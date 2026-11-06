import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AddressInfo } from 'node:net'
import { createApp } from '../server/src/app.js'
import { createMemoryRepo } from '../server/src/repo.memory.js'
import { createSync } from '../src/lib/sync'
import { canon, compact, isCovered, mergeProgress, fingerprint, rebuild, uid } from '../src/lib/events'
import { errCardId } from '../src/data/cards'
import { normalize } from '../src/lib/useProgress'
import type { Ev, Progress } from '../src/types'
import { device, memStorage, rng } from './helpers'

const OPT = { minEvents: 5, keepDays: 3, minGapDays: 0 }
// tudo que o app mostra e que a compactação NÃO pode alterar
const derived = (p: Progress) => canon({ xp: p.xp, completed: p.completed, answers: p.answers, errors: p.errors, cards: p.cards, favorites: p.favorites, reviewLog: p.reviewLog, daily: Object.fromEntries(Object.entries(p.daily).map(([k, v]) => [k, { ...v, qids: [...v.qids].sort(), correctQids: [...v.correctQids].sort() }])), totalAnswered: p.totalAnswered, correctStreak: p.correctStreak, bestCorrectStreak: p.bestCorrectStreak, studyDays: p.studyDays, bonusDays: p.bonusDays, reviewXpDays: p.reviewXpDays, mockXpDays: p.mockXpDays })
// agregados que não dependem da ordem de aplicação (valem mesmo para eventos "tardios" de aparelhos offline)
const agg = (p: Progress) => canon({ xp: p.xp, answered: Object.keys(p.answers).sort(), errs: Object.fromEntries(Object.entries(p.errors).map(([k, v]) => [k, v.count])), total: p.totalAnswered, qids: Object.fromEntries(Object.entries(p.daily).map(([d, s]) => [d, [...s.qids].sort()])), study: p.studyDays })
const foldable = (e: Ev) => e.t === 'ans' || e.t === 'rev'
const QS = Array.from({ length: 12 }, (_, i) => `q${i + 1}`)
function fill(d: ReturnType<typeof device>, rand: () => number, n: number, from: number, to: number) {
  for (let i = 0; i < n; i++) {
    const ago = Math.round(from - (from - to) * (i / Math.max(1, n - 1))), q = QS[Math.floor(rand() * QS.length)], ok = rand() < 0.55
    if (rand() < 0.7) d.answer(q, ok, ok ? 'A' : 'B', ago); else { const c = errCardId(QS[Math.floor(rand() * QS.length)]); if (d.p.cards[c]) d.rate(c, (Math.floor(rand() * 4) as 0 | 1 | 2 | 3), ago) }
  }
}

describe('compactação: preserva o resultado', () => {
  it('estado derivado idêntico antes e depois (30 execuções aleatórias, também em 2ª compactação)', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const r = rng(seed), d = device({}, 'A' + seed); fill(d, r, 120, 40, 8)
      const c = compact(d.p, OPT)!; expect(c, `seed ${seed}`).not.toBeNull()
      expect(derived(c), `seed ${seed}`).toBe(derived(d.p)); expect(c.events.length).toBeLessThan(d.p.events.length); expect(c.cp!.gen).toBe(1)
      for (const e of d.p.events.filter(foldable)) expect(isCovered(e, c.cp) !== c.events.some(x => x.id === e.id), `seed ${seed}: evento ou está coberto ou permanece`).toBe(true)
      d.p = c; fill(d, r, 60, 7, 0); const before = derived(d.p)
      const c2 = compact(d.p, { ...OPT, keepDays: 1 }); if (c2) { expect(derived(c2)).toBe(before); expect(c2.cp!.gen).toBe(2) }
    }
  })
  it('é idempotente: compactar de novo não faz nada; mesclar com a cópia antiga ou consigo mesma devolve o mesmo documento', () => {
    const d = device({}, 'A'); fill(d, rng(7), 100, 30, 5)
    const c = compact(d.p, OPT)!
    expect(compact(c, OPT)).toBeNull()
    expect(fingerprint(mergeProgress(c, c))).toBe(fingerprint(c))
    expect(fingerprint(mergeProgress(d.p, c))).toBe(fingerprint(c)); expect(fingerprint(mergeProgress(c, d.p))).toBe(fingerprint(c))
    expect(fingerprint(normalize(JSON.parse(JSON.stringify(c))))).toBe(fingerprint(c)) // ida e volta pelo armazenamento
  })
  it('XP e recompensas não duplicam: recompensas nunca são incorporadas e ids antigos não são reaplicados', () => {
    const d = device({}, 'A'); fill(d, rng(3), 90, 30, 6)
    const xp = d.p.xp, rwd = d.p.events.filter(e => e.t === 'rwd').length, c = compact(d.p, OPT)!
    expect(c.xp).toBe(xp); expect(c.events.filter(e => e.t === 'rwd').length).toBe(rwd)
    expect(mergeProgress(c, d.p).xp).toBe(xp); expect(mergeProgress(mergeProgress(c, d.p), c).xp).toBe(xp)
    d.p = c; d.answer('q99', true, 'A', 0); expect(d.p.xp).toBe(xp + 10) // uma resposta nova vale uma vez
  })
  it('só incorpora o que cabe em um prefixo contínuo de cada produtor (lacuna e relógio fora de ordem não perdem nada)', () => {
    const d = device({}, 'A'); fill(d, rng(11), 40, 30, 10)
    const nums = d.p.events.filter(foldable).map(e => (e as { n: number }).n)
    const gapped = { ...d.p, events: d.p.events.filter(e => !(foldable(e) && (e as { n: number }).n === 5)) } // o evento nº 5 ainda não chegou
    const c = compact(gapped, OPT)!; expect(c.cp!.vec.A).toBe(4)
    const late = d.p.events.find(e => foldable(e) && (e as { n: number }).n === 5)!
    const m = mergeProgress(c, { ...d.p, events: [late] as Ev[] }) // quando o nº 5 chega, não está coberto: é mantido
    expect(m.events.some(e => e.id === late.id)).toBe(true)
    expect(nums.length).toBeGreaterThan(5)
    // relógio do aparelho voltou atrás: nº 2 mais antigo que nº 1 → nada é incorporado
    const w = device({}, 'W'); w.answer('q1', true, 'A', 10); w.answer('q2', true, 'A', 20); w.answer('q3', true, 'A', 5)
    expect(compact(w.p, { ...OPT, minEvents: 1 })).toBeNull()
  })
  it('respeita o limite mínimo, o intervalo entre compactações e a janela recente', () => {
    const d = device({}, 'A'); fill(d, rng(5), 30, 30, 10)
    expect(compact(d.p, { ...OPT, minEvents: 10_000 })).toBeNull()
    const c = compact(d.p, OPT)!; fill({ ...d, get p() { return c } } as never, rng(1), 0, 1, 1)
    expect(compact(c, { ...OPT, minGapDays: 1 })).toBeNull() // acabou de compactar
    const r = device({}, 'R'); fill(r, rng(9), 40, 2, 0) // só atividade recente
    expect(compact(r.p, { ...OPT, keepDays: 3 })).toBeNull()
  })
  it('eventos antigos sem produtor (Fase 2) são cobertos por id; os de outro aparelho continuam valendo', () => {
    const strip = (p: Progress): Progress => ({ ...p, events: p.events.map(e => { const { dev: _d, n: _n, ...r } = e as Ev & { dev?: string; n?: number }; void _d; void _n; return r as Ev }) })
    const old = device({}, 'A'); fill(old, rng(21), 60, 30, 10)
    const legacy = strip(old.p), c = compact(legacy, OPT)!
    expect(c.cp!.legacy.length).toBeGreaterThan(0); expect(derived(c)).toBe(derived(legacy))
    expect(mergeProgress(c, legacy).events.filter(foldable).every(e => !c.cp!.legacy.includes(e.id))).toBe(true) // o aparelho antigo, com os mesmos ids, não reaplica
    const other = device({}, 'B'); other.answer('qx', true, 'A', 12)
    const ev = strip(other.p).events.find(e => e.t === 'ans')!
    expect(mergeProgress(c, { ...legacy, events: [ev] }).events.some(e => e.id === ev.id)).toBe(true) // evento antigo de outro aparelho que ainda não tinha sincronizado
  })
})

describe('compactação: aparelho que ficou offline', () => {
  function setup() {
    const r = rng(42), A = device({}, 'A'), B = device({}, 'B')
    fill(A, r, 50, 30, 15); B.p = mergeProgress(B.p, A.p); fill(B, r, 30, 25, 12); A.p = mergeProgress(A.p, B.p); B.p = mergeProgress(B.p, A.p) // sincronizados
    return { r, A, B, snapB: B.p }
  }
  it('volta com eventos novos: os já incorporados não reaplicam, os novos não se perdem, resultado = ao de nunca compactar', () => {
    const { r, A, B } = setup()
    fill(A, r, 40, 14, 4) // A segue estudando e compacta
    const Afull = A.p, cA = compact(A.p, OPT)!; expect(cA.cp).toBeDefined(); const server = cA
    fill(B, r, 25, 2, 0) // B, offline, estuda mais (eventos recentes)
    const Bfull = B.p, m = mergeProgress(B.p, server)
    expect(m.events.filter(foldable).every(e => !isCovered(e, m.cp))).toBe(true)
    expect(m.events.length).toBe(new Set(m.events.map(e => e.id)).size)
    const truth = mergeProgress(Afull, Bfull)
    expect(derived(m)).toBe(derived(truth)); expect(m.xp).toBe(truth.xp)
    for (const e of Bfull.events.filter(e => e.at > (cA.cp!.at))) expect(m.events.some(x => x.id === e.id)).toBe(true)
    expect(fingerprint(mergeProgress(server, m))).toBe(fingerprint(m)); expect(fingerprint(mergeProgress(m, server))).toBe(fingerprint(m))
  })
  it('volta com eventos ANTIGOS ainda não enviados ("tardios"): nenhum se perde e os totais conferem', () => {
    const { r, A, B } = setup()
    fill(A, r, 40, 14, 4)
    const Afull = A.p, server = compact(A.p, OPT)!
    for (let i = 0; i < 8; i++) B.answer(QS[i], i % 2 === 0, i % 2 === 0 ? 'A' : 'C', 11 - (i % 3)) // do passado, antes do corte da compactação
    const Bfull = B.p, m = mergeProgress(B.p, server), truth = mergeProgress(Afull, Bfull)
    expect(agg(m)).toBe(agg(truth)); expect(m.xp).toBe(truth.xp)
    const lateIds = Bfull.events.filter(e => foldable(e) && !Afull.events.some(x => x.id === e.id)).map(e => e.id)
    expect(lateIds.length).toBeGreaterThan(0); for (const id of lateIds) expect(m.events.some(x => x.id === id)).toBe(true)
    expect(m.answers[QS[1]].everCorrect || !Bfull.answers[QS[1]]?.everCorrect).toBe(true)
  })
  it('quem já tem a compactação e recebe o documento antigo não volta atrás', () => {
    const { r, A } = setup(); fill(A, r, 20, 14, 5)
    const full = A.p, c = compact(A.p, OPT)!
    expect(derived(mergeProgress(c, full))).toBe(derived(full)); expect(mergeProgress(c, full).cp!.id).toBe(c.cp!.id)
    expect(mergeProgress(c, full).events.length).toBe(c.events.length)
  })
  it('propriedade (protocolo do servidor): 3 aparelhos, ações aleatórias, sincronizações e compactações em ordem aleatória → convergem, sem perder nem duplicar', () => {
    // Modelo do servidor: um documento S. Sincronizar = mesclar S no aparelho; o candidato compactado é calculado sobre esse resultado e só vira S (e do aparelho) se o servidor aceitar (aqui, sempre
    // que veio da mesclagem com S atual — é o que a versão base/409 garante). Por isso os checkpoints formam uma cadeia linear.
    for (let seed = 1; seed <= 40; seed++) {
      const r = rng(1000 + seed), D = [device({}, 'A'), device({}, 'B'), device({}, 'C')], created: Ev[] = []
      let S: Progress | null = null
      const syncDev = (d: ReturnType<typeof device>, allowCompact: boolean) => {
        if (S) d.p = mergeProgress(d.p, S)
        const cand = allowCompact ? compact(d.p, OPT) : null
        S = cand ?? (S ? mergeProgress(S, d.p) : d.p)
        if (cand) d.p = mergeProgress(d.p, cand)
      }
      for (let step = 0; step < 60; step++) {
        const d = D[Math.floor(r() * 3)], k = r()
        if (k < 0.55) { const n0 = d.p.events.length; fill(d, r, 1 + Math.floor(r() * 6), 25, 0); created.push(...d.p.events.slice(n0)) }
        else if (k < 0.8) syncDev(d, true)
        else if (k < 0.9) syncDev(d, false)
        else if (S) d.p = mergeProgress(d.p, S) // só puxa
      }
      for (let i = 0; i < 2; i++) for (const d of D) syncDev(d, i === 0)
      const fps = D.map(x => fingerprint(x.p)); expect(new Set(fps).size, `seed ${seed}: convergência`).toBe(1)
      const fin = D[0].p, truth = rebuild({ ...normalize({}), events: [...new Map(created.map(e => [e.id, e])).values()] })
      for (const e of created.filter(foldable)) expect(fin.events.some(x => x.id === e.id) || isCovered(e, fin.cp), `seed ${seed}: evento ${e.id} perdido`).toBe(true)
      expect(fin.events.length).toBe(new Set(fin.events.map(e => e.id)).size)
      expect(fin.xp, `seed ${seed}: XP`).toBe(truth.xp); expect(agg(fin), `seed ${seed}`).toBe(agg(truth))
    }
  })
  it('sem o protocolo do servidor (duas compactações aplicadas às cegas) haveria perda — por isso só o servidor decide qual vale', () => {
    const A = device({}, 'A'), B = device({}, 'B'); fill(A, rng(1), 30, 30, 10); fill(B, rng(2), 30, 30, 10)
    const cA = compact(A.p, OPT)!, cB = compact(B.p, OPT)!, m = mergeProgress(cA, cB)
    const lost = [...A.p.events, ...B.p.events].filter(e => foldable(e) && !m.events.some(x => x.id === e.id) && !isCovered(e, m.cp))
    expect(lost.length).toBeGreaterThan(0) // documenta o risco que o protocolo (prepare/committed + versão do servidor) evita
  })
})

// ── com servidor real: concorrência de duas compactações e falha de rede
let srv: ReturnType<ReturnType<typeof createApp>['listen']>, api = ''
beforeEach(async () => {
  const app = createApp({ repo: createMemoryRepo(), jwtSecret: 'x'.repeat(40), corsOrigin: 'http://localhost', bcryptCost: 4, rateLimitMax: 1000, dataLimitMax: 100000 })
  await new Promise<void>(r => { srv = app.listen(0, () => r()) }); api = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`
})
afterEach(() => new Promise<void>(r => srv.close(() => r())))
function client(id: string) {
  const dev = device({}, id), net = { down: false, hold: null as null | Promise<void>, puts: 0 }, tried: string[] = []
  const f: typeof fetch = async (i, init) => { if (net.down) throw new TypeError('down'); if (init?.method === 'PUT' && net.hold && String(i).endsWith('/progress')) { const h = net.hold; net.hold = null; await h } if (init?.method === 'PUT') net.puts++; return fetch(i, init) }
  const s = createSync({ api, storage: memStorage(), fetch: f, debounceMs: 5, retryBaseMs: 20, retryMaxMs: 40 })
  s.setAdapters({ progress: { ...dev.adapter, prepare: d => { const c = compact(d as Progress, OPT); if (c) tried.push(c.cp!.id); return c ?? d }, committed: sent => { dev.adapter.merge(sent) } } })
  return { dev, net, s, tried }
}
const EMAIL = 'aluna@example.com', PW = 'senha-boa-123'
describe('compactação com servidor real', () => {
  it('duas compactações concorrentes: só uma vale, a outra é refeita sobre o resultado, e nada se perde', async () => {
    const A = client('A'), B = client('B'), r = rng(8)
    await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW)
    const created: Ev[] = []
    const act = (c: ReturnType<typeof client>, n: number, from: number, to: number) => { const n0 = c.dev.p.events.length; fill(c.dev, r, n, from, to); created.push(...c.dev.p.events.slice(n0)) }
    act(A, 30, 30, 12); act(B, 25, 28, 11)
    let release!: () => void; B.net.hold = new Promise<void>(res => { release = res })
    const pb = B.s.syncNow() // B chega até o PUT e fica parado
    await new Promise(r => setTimeout(r, 150)); expect(B.tried.length).toBe(1)
    await A.s.syncNow(); expect(A.dev.p.cp?.gen).toBe(1) // A grava primeiro
    act(B, 6, 1, 0) // B ainda faz atividade recente enquanto espera
    release(); await pb; await A.s.syncNow(); await B.s.syncNow(); await A.s.syncNow()
    expect(B.dev.p.cp?.id).not.toBe(B.tried[0]) // a compactação perdedora nunca foi adotada
    expect(fingerprint(A.dev.p)).toBe(fingerprint(B.dev.p))
    const fin = A.dev.p, truth = rebuild({ ...normalize({}), events: [...new Map(created.map(e => [e.id, e])).values()] })
    for (const e of created.filter(foldable)) expect(fin.events.some(x => x.id === e.id) || isCovered(e, fin.cp)).toBe(true)
    expect(fin.xp).toBe(truth.xp); expect(agg(fin)).toBe(agg(truth)); expect(fin.cp!.gen).toBeGreaterThanOrEqual(1)
  })
  it('falha de rede no envio: nada é compactado localmente; ao voltar, tudo é enviado e compactado uma vez', async () => {
    const A = client('A'), r = rng(2); await A.s.authenticate('register', EMAIL, PW)
    fill(A.dev, r, 60, 30, 8); const before = A.dev.p, count = before.events.length
    A.net.down = true; await A.s.syncNow()
    expect(A.dev.p.cp).toBeUndefined(); expect(A.dev.p.events.length).toBe(count); expect(derived(A.dev.p)).toBe(derived(before))
    A.net.down = false; await A.s.syncNow(); await A.s.syncNow()
    expect(A.dev.p.cp?.gen).toBe(1); expect(A.dev.p.events.length).toBeLessThan(count); expect(derived(A.dev.p)).toBe(derived(before))
    const puts = A.net.puts; await A.s.syncNow(); expect(A.net.puts).toBe(puts) // sem novidade, não reenvia
  })
  it('dispositivo antigo volta depois de uma compactação no servidor e recebe tudo sem duplicar', async () => {
    const A = client('A'), B = client('B'), r = rng(4)
    await A.s.authenticate('register', EMAIL, PW); await B.s.authenticate('login', EMAIL, PW)
    fill(A.dev, r, 40, 30, 10); await A.s.syncNow(); await B.s.syncNow() // ambos sincronizados; o servidor já compactou (A)
    B.net.down = true; const n0 = B.dev.p.events.length; fill(B.dev, r, 15, 2, 0); const mine = B.dev.p.events.slice(n0)
    fill(A.dev, r, 40, 9, 4); await A.s.syncNow() // A segue estudando e compacta de novo
    B.net.down = false; await B.s.syncNow(); await A.s.syncNow()
    expect(fingerprint(A.dev.p)).toBe(fingerprint(B.dev.p))
    for (const e of mine) expect(A.dev.p.events.some(x => x.id === e.id)).toBe(true)
  })
})
