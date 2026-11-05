import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AddressInfo } from 'node:net'
import { createApp } from '../server/src/app.js'
import { createMemoryRepo } from '../server/src/repo.memory.js'
import { createSync } from '../src/lib/sync'
import { createSession } from '../src/lib/session'
import { mergeProgress } from '../src/lib/events'
import { normalize } from '../src/lib/useProgress'
import { device, memStorage } from './helpers'

// Um "navegador": um localStorage compartilhado pelo sync, pelo dono dos dados e pelas cópias, mais o estado local (progresso e conteúdo).
let srv: ReturnType<ReturnType<typeof createApp>['listen']>, api = ''
beforeEach(async () => {
  const app = createApp({ repo: createMemoryRepo(), jwtSecret: 'x'.repeat(40), corsOrigin: 'http://localhost', bcryptCost: 4, rateLimitMax: 1000, dataLimitMax: 100000 })
  await new Promise<void>(r => { srv = app.listen(0, () => r()) }); api = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`
})
afterEach(() => new Promise<void>(r => srv.close(() => r())))

function browser() {
  const storage = memStorage(), dev = device(), net = { down: false }
  let content: Record<string, unknown> = {}
  const f: typeof fetch = async (i, init) => { if (net.down) throw new TypeError('down'); return fetch(i, init) }
  const s = createSync({ api, storage, fetch: f, debounceMs: 5, retryBaseMs: 20, retryMaxMs: 40 })
  s.setAdapters({ progress: dev.adapter })
  const ses = createSession(() => ({
    progress: { get: () => dev.p, clear: () => { dev.p = normalize({}) }, mergeIn: raw => dev.adapter.merge(raw), combine: (a, b) => mergeProgress(normalize(a), normalize(b)) },
    content: { get: () => content, clear: () => { content = {} }, mergeIn: raw => { content = { ...content, ...(raw as object) } } },
  }), storage)
  const signIn = (mode: 'login' | 'register', e: string, pw: string) => s.authenticate(mode, e, pw, em => { ses.adopt(em) })
  const signOut = async () => { const email = s.getState().email ?? ''; await s.syncNow(); const synced = s.getState().status === 'idle'; const r = ses.leave(email, synced); s.logout(); return { synced, r } }
  return { storage, dev, net, s, ses, signIn, signOut, setContent: (c: Record<string, unknown>) => { content = c }, get content() { return content } }
}
const A = 'ana@example.com', B = 'beto@example.com', PW = 'senha-boa-123'
const answered = (b: ReturnType<typeof browser>) => Object.keys(b.dev.p.answers).sort()

describe('login, logout e troca de conta no mesmo navegador', () => {
  it('login inválido não altera nada; falha de rede não é "senha incorreta"', async () => {
    const b = browser(); await b.signIn('register', A, PW); await b.signOut()
    const bad = await b.signIn('login', A, 'errada-123'); expect(bad).toMatchObject({ ok: false, status: 401 })
    expect(b.s.isLoggedIn()).toBe(false)
    b.net.down = true; const off = await b.signIn('login', A, PW); expect(off).toMatchObject({ ok: false, status: 0 })
  })
  it('logout não apaga nada no servidor: entrar de novo em outro navegador traz tudo', async () => {
    const b1 = browser(); await b1.signIn('register', A, PW); b1.dev.answer('q1', true); b1.dev.answer('q2', false)
    const xp = b1.dev.p.xp; expect(xp).toBeGreaterThan(0); const out = await b1.signOut(); expect(out.synced).toBe(true)
    const b2 = browser(); await b2.signIn('login', A, PW); expect(answered(b2)).toEqual(['q1', 'q2']); expect(b2.dev.p.xp).toBe(xp)
  })
  it('depois do logout o estado local fica vazio e a conta seguinte não vê nada da anterior', async () => {
    const b = browser(); await b.signIn('register', A, PW); b.dev.answer('q1', true); b.setContent({ lessons: ['x'] })
    await b.signOut()
    expect(answered(b)).toEqual([]); expect(b.content).toEqual({}); expect(b.ses.owner()).toBe('')
    await b.signIn('register', B, PW); expect(answered(b)).toEqual([]); expect(b.content).toEqual({}) // nada de A em B
    b.dev.answer('q9', true); await b.signOut()
    const c = browser(); await c.signIn('login', A, PW); expect(answered(c)).toEqual(['q1']) // e nada de B em A
  })
  it('sem conexão no logout: alterações não enviadas ficam guardadas e voltam ao entrar de novo na mesma conta', async () => {
    const b = browser(); await b.signIn('register', A, PW); b.dev.answer('q1', true); await b.s.syncNow()
    b.dev.answer('q2', true); b.net.down = true
    const out = await b.signOut(); expect(out.synced).toBe(false); expect(out.r).toBe('cleared'); expect(answered(b)).toEqual([])
    b.net.down = false; await b.signIn('login', A, PW); await b.s.syncNow()
    expect(answered(b)).toEqual(['q1', 'q2']) // restaurado da cópia local e enviado
    const c = browser(); await c.signIn('login', A, PW); expect(answered(c)).toEqual(['q1', 'q2'])
  })
  it('sessão expirada mantém os dados locais; outra conta só entra depois de guardá-los', async () => {
    const b = browser(); await b.signIn('register', A, PW); b.dev.answer('q1', true); b.dev.answer('q2', true) // não enviados
    // token invalidado (como se tivesse expirado)
    b.storage.setItem('aprova-tjsp:sync:v1', JSON.stringify({ token: 'invalido', email: A, versions: { progress: 0, content: 0 } })); b.s.reload()
    expect(await b.s.verifySession()).toBe('invalid'); expect(b.s.isLoggedIn()).toBe(false); expect(answered(b)).toEqual(['q1', 'q2']) // nada apagado
    await b.signIn('register', B, PW); expect(answered(b)).toEqual([]) // B não vê A
    await b.signOut(); await b.signIn('login', A, PW); await b.s.syncNow(); expect(answered(b)).toEqual(['q1', 'q2']) // A recupera o que não tinha enviado
  })
  it('verifySession: rede fora ou servidor indisponível não derruba a sessão', async () => {
    const b = browser(); await b.signIn('register', A, PW)
    b.net.down = true; expect(await b.s.verifySession(200)).toBe('offline'); expect(b.s.isLoggedIn()).toBe(true); b.net.down = false
    expect(await b.s.verifySession()).toBe('valid'); expect(await browser().s.verifySession()).toBe('none')
  })
  it('dados de quem já usava o app sem conta são adotados pela primeira conta (migração)', async () => {
    const b = browser(); b.dev.answer('q1', true); b.dev.answer('q2', true) // progresso anônimo
    await b.signIn('register', A, PW); await b.s.syncNow(); expect(b.ses.owner()).toBe(A); expect(answered(b)).toEqual(['q1', 'q2'])
    const c = browser(); await c.signIn('login', A, PW); expect(answered(c)).toEqual(['q1', 'q2'])
  })
  it('sincroniza respostas e XP após o login em outro aparelho', async () => {
    const a = browser(); await a.signIn('register', A, PW); a.dev.answer('q1', true); await a.s.syncNow()
    const b = browser(); await b.signIn('login', A, PW)
    expect(b.dev.p.xp).toBe(a.dev.p.xp); expect(b.dev.p.xp).toBeGreaterThan(0)
    b.dev.answer('q2', true); await b.s.syncNow(); await a.s.syncNow(); expect(a.dev.p.xp).toBe(b.dev.p.xp)
  })
})
