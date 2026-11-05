import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AddressInfo } from 'node:net'
import { createApp } from '../server/src/app.js'
import { createMemoryRepo } from '../server/src/repo.memory.js'
import { createSync } from '../src/lib/sync'
import { today } from './helpers'
import { device, memStorage } from './helpers'
import { fingerprint } from '../src/lib/events'
import type { Progress } from '../src/types'

// Servidor real (Express + repositório em memória) numa porta efêmera; clientes reais de sincronização com "rede" controlável.
let srv: ReturnType<ReturnType<typeof createApp>['listen']>, api = '', repo: ReturnType<typeof createMemoryRepo>
beforeEach(async () => {
  repo = createMemoryRepo()
  const app = createApp({ repo, jwtSecret: 'x'.repeat(40), corsOrigin: 'http://localhost', bcryptCost: 4, rateLimitMax: 1000, dataLimitMax: 100000 })
  await new Promise<void>(r => { srv = app.listen(0, () => r()) }); api = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`
})
afterEach(() => new Promise<void>(r => srv.close(() => r())))

function client(opts: { debounceMs?: number; retryBaseMs?: number } = {}) {
  const dev = device(), net = { down: false, calls: [] as string[] }
  const f: typeof fetch = async (input, init) => { net.calls.push(`${init?.method ?? 'GET'} ${String(input).replace(api, '')}`); if (net.down) throw new TypeError('network down'); return fetch(input, init) }
  const s = createSync({ api, storage: memStorage(), fetch: f, debounceMs: opts.debounceMs ?? 5, retryBaseMs: opts.retryBaseMs ?? 20, retryMaxMs: 80 })
  s.setAdapters({ progress: dev.adapter })
  return { dev, net, s }
}
const EMAIL = 'aluna@example.com', PW = 'senha-boa-123'
const serverDoc = async () => { const u = await repo.findUserByEmail(EMAIL); const d = await repo.getDoc(u!.id, 'progress'); return d ? (JSON.parse(d.json) as Progress) : null }
const settle = async (...cs: ReturnType<typeof client>[]) => { for (let i = 0; i < 3; i++) for (const c of cs) { await c.s.syncNow() } }
const events = (p: Progress, t: string) => p.events.filter(e => e.t === t).length

describe('sincronização entre aparelhos (servidor real)', () => {
  it('login em um segundo aparelho traz o progresso do primeiro, sem pedir escolha', async () => {
    const A = client(), B = client()
    await A.s.authenticate('register', EMAIL, PW); A.dev.answer('q1', true); A.dev.answer('q2', false); await A.s.syncNow()
    await B.s.authenticate('login', EMAIL, PW)
    expect(B.s.getState().status).toBe('idle'); expect(B.dev.p.xp).toBe(10); expect(B.dev.p.answers.q2.correct).toBe(false)
  })
  it('os dois aparelhos têm dados e fazem login: união, sem perda e sem pergunta ao usuário', async () => {
    const A = client(), B = client()
    A.dev.answer('q1', true); B.dev.answer('q2', true); B.dev.answer('q3', false)       // atividade feita ANTES de existir conta, nos dois
    await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW); await A.s.syncNow()
    for (const c of [A, B]) { expect(c.dev.p.xp).toBe(20); expect(events(c.dev.p, 'ans')).toBe(3); expect(c.s.getState().status).toBe('idle') }
    expect(fingerprint(A.dev.p)).toBe(fingerprint(B.dev.p))
  })
  it('REGRESSÃO do conflito falso: dois aparelhos abertos só acumulando tempo de estudo convergem sem erro nem perda', async () => {
    const A = client(), B = client(); await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW)
    const day = today()
    for (let i = 1; i <= 8; i++) { // ~2 minutos "só com mouse" nos dois aparelhos, com envios intercalados
      A.dev.ev({ t: 'sec', sec: 15 * i, id: `sec:A:${day}` }); B.dev.ev({ t: 'sec', sec: 15 * i, id: `sec:B:${day}` })
      await Promise.all([A.s.syncNow(), B.s.syncNow()])
      expect(A.s.getState().status).toBe('idle'); expect(B.s.getState().status).toBe('idle')
    }
    await settle(A, B); expect(A.dev.p.daily[day].seconds).toBe(240); expect(B.dev.p.daily[day].seconds).toBe(240)
  })
  it('atividades simultâneas em aparelhos diferentes: tudo é preservado, XP não duplica e repetir a sincronização não muda nada', async () => {
    const A = client(), B = client(); await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW)
    A.dev.answer('q1', true); B.dev.answer('q1', true)            // mesma questão certa nos dois: 1 recompensa
    A.dev.answer('q2', true); B.dev.answer('q3', false); B.dev.rate('err-q3', 2)
    await Promise.all([A.s.syncNow(), B.s.syncNow()]); await settle(A, B)
    for (const c of [A, B]) { expect(c.dev.p.xp).toBe(20); expect(events(c.dev.p, 'rwd')).toBe(2); expect(events(c.dev.p, 'ans')).toBe(4); expect(events(c.dev.p, 'rev')).toBe(1) }
    const fp = fingerprint(A.dev.p), v = (await repo.getDoc((await repo.findUserByEmail(EMAIL))!.id, 'progress'))!.version
    await settle(A, B); expect(fingerprint(A.dev.p)).toBe(fp); expect(fingerprint(B.dev.p)).toBe(fp)
    expect((await repo.getDoc((await repo.findUserByEmail(EMAIL))!.id, 'progress'))!.version).toBe(v)  // sem novas gravações quando nada mudou
    expect(fingerprint((await serverDoc())!)).toBe(fp)
  })
  it('push com debounce: alterações locais chegam ao servidor sozinhas; 409 é resolvido por mesclagem', async () => {
    const A = client(), B = client(); await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW)
    A.dev.answer('q1', true); A.s.scheduleSync('progress'); await new Promise(r => setTimeout(r, 60)); await A.s.idle()
    B.dev.answer('q2', true) // B ainda tem a versão antiga: o PUT dá 409, o cliente mescla e reenvia
    B.s.scheduleSync('progress'); await new Promise(r => setTimeout(r, 60)); await B.s.idle()
    expect(B.dev.p.xp).toBe(20); expect((await serverDoc())!.xp).toBe(20); expect(B.s.getState().status).toBe('idle')
    expect(B.net.calls.filter(c => c.startsWith('PUT')).length).toBeGreaterThanOrEqual(2)
  })
  it('queda de rede: dados locais ficam intactos, estado "sem conexão", retomada automática e mesclagem', async () => {
    const A = client(), B = client({ retryBaseMs: 20 }); await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW)
    B.net.down = true; B.dev.answer('q9', true); B.dev.answer('q8', false)
    await B.s.syncNow(); expect(B.s.getState().status).toBe('offline'); expect(B.dev.p.xp).toBe(10)
    A.dev.answer('q1', true); await A.s.syncNow()                    // enquanto isso A segue sincronizando
    B.net.down = false; await new Promise(r => setTimeout(r, 120)); await B.s.idle()   // a nova tentativa automática dispara
    await settle(A, B)
    expect(B.s.getState().status).toBe('idle'); for (const c of [A, B]) { expect(c.dev.p.xp).toBe(20); expect(events(c.dev.p, 'ans')).toBe(3) }
  })
  it('aparelho antigo que volta depois de muitas versões no servidor é mesclado, não sobrescreve', async () => {
    const A = client(), B = client(); await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW)
    B.dev.answer('antigo', true)
    for (let i = 0; i < 12; i++) { A.dev.answer(`n${i}`, true); await A.s.syncNow(); A.s.scheduleSync('progress', 1); await new Promise(r => setTimeout(r, 15)); await A.s.idle() }
    await B.s.syncNow(); await settle(A, B)
    expect(B.dev.p.xp).toBe(130); expect(A.dev.p.xp).toBe(130); expect((await serverDoc())!.xp).toBe(130)
  })
  it('dados do servidor inválidos ou de versão mais nova: nada é sobrescrito e o aviso é claro', async () => {
    const A = client(); await A.s.authenticate('register', EMAIL, PW); A.dev.answer('q1', true); await A.s.syncNow()
    const u = (await repo.findUserByEmail(EMAIL))!, cur = (await repo.getDoc(u.id, 'progress'))!
    const futuro = JSON.stringify({ ...JSON.parse(cur.json), schemaVersion: 9 })
    await repo.putDoc(u.id, 'progress', futuro, cur.version)
    A.dev.answer('q2', true); await A.s.syncNow()
    expect(A.s.getState().status).toBe('error'); expect(A.s.getState().msg).toMatch(/versão mais nova|não puderam ser lidos/); expect(A.dev.p.xp).toBe(20)
    expect((await repo.getDoc(u.id, 'progress'))!.json).toBe(futuro)  // servidor intacto
    const lixo = '{"xp":"abc"}'; const c2 = (await repo.getDoc(u.id, 'progress'))!; await repo.putDoc(u.id, 'progress', lixo, c2.version)
    await A.s.syncNow(); expect(A.s.getState().status).toBe('error'); expect(A.dev.p.xp).toBe(20)
  })
  it('sessão inválida (401): sai da conta, mantém os dados locais', async () => {
    const A = client(); await A.s.authenticate('register', EMAIL, PW); A.dev.answer('q1', true)
    await repo.deleteUser((await repo.findUserByEmail(EMAIL))!.id); await A.s.syncNow()
    expect(A.s.isLoggedIn()).toBe(false); expect(A.s.getState().status).toBe('local'); expect(A.dev.p.xp).toBe(10)
  })
  it('apagar conta exige a senha; erro de senha não desconecta', async () => {
    const A = client(); await A.s.authenticate('register', EMAIL, PW)
    await A.s.deleteAccount('errada-123'); expect(A.s.isLoggedIn()).toBe(true); expect(A.s.getState().msg).toMatch(/Senha incorreta/)
    await A.s.deleteAccount(PW); expect(A.s.isLoggedIn()).toBe(false); expect(await repo.findUserByEmail(EMAIL)).toBeNull()
  })
  it('administrador: o frontend só exibe o que o servidor informa', async () => {
    const app2 = createApp({ repo: createMemoryRepo(), jwtSecret: 'y'.repeat(40), corsOrigin: 'http://localhost', bcryptCost: 4, adminEmails: EMAIL })
    const s2 = await new Promise<ReturnType<typeof app2.listen>>(r => { const x = app2.listen(0, () => r(x)) })
    try {
      const url = `http://127.0.0.1:${(s2.address() as AddressInfo).port}`
      const c = createSync({ api: url, storage: memStorage() }); await c.authenticate('register', EMAIL, PW); expect(c.getState().admin).toBe(true)
      const d = createSync({ api: url, storage: memStorage() }); await d.authenticate('register', 'outra@example.com', PW); expect(d.getState().admin).toBe(false)
    } finally { await new Promise<void>(r => s2.close(() => r())) }
  })
  it('logout cancela envios pendentes', async () => {
    const A = client(); await A.s.authenticate('register', EMAIL, PW); A.dev.answer('q1', true); A.s.scheduleSync('progress', 30); A.s.logout(); await new Promise(r => setTimeout(r, 80))
    expect(A.net.calls.filter(c => c.startsWith('PUT') && c.includes('progress')).length).toBe(1) // só o do cadastro; nenhum depois do logout
  })
})
