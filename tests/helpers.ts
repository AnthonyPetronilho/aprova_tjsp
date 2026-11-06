import { commit, answerEvents, normalize } from '../src/lib/useProgress'
import { mergeProgress, fingerprint, isProgressLike, uid } from '../src/lib/events'
import type { Ev, OptId, Progress, Rating } from '../src/types'

// PRNG com semente (testes aleatórios reproduzíveis)
export function rng(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32 } }

// Um "aparelho" de teste: guarda o progresso como o app faz (commit/merge) sem React.
// `id` = produtor dos eventos (cada aparelho de teste tem o seu, como cada página aberta no app)
export function device(raw: unknown = {}, id: string = uid().slice(0, 8)) {
  let p = normalize(raw)
  const d = {
    get p() { return p },
    set p(v: Progress) { p = v },
    id,
    // relógio estritamente crescente: ações no mesmo milissegundo teriam ordem decidida pelo id aleatório (teste instável). `ago` = dias atrás.
    answer(qid: string, correct: boolean, chosen: OptId = 'A', ago = 0) { p = commit(p, answerEvents(p, qid, chosen, correct).map(e => ({ ...e, ...stamp(ago) })), {}, id) },
    rate(card: string, r: Rating, ago = 0) { p = commit(p, [{ id: uid(), t: 'rev', card, rating: r, ...stamp(ago) } as Ev], {}, id) },
    ev(e: Partial<Ev> & { t: Ev['t'] }, ago = 0) { const full = { id: uid(), ...stamp(ago), ...e } as Ev; p = commit(p, [full], {}, id) },
    mergeFrom(other: Progress) { p = mergeProgress(p, other); return p },
    adapter: {
      get: () => p as object,
      merge: (r: unknown) => { if (!isProgressLike(r)) return null; try { p = mergeProgress(p, normalize(r)); return p as object } catch { return null } },
      fingerprint: (x: unknown) => { try { return fingerprint(normalize(x)) } catch { return '' } },
    },
  }
  return d
}
let last = 0
const tick = () => { last = Math.max(Date.now(), last + 1); return last }
const dayOfMs = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
// at/day de um evento "há `ago` dias", com relógio crescente dentro do mesmo dia
export const stamp = (ago = 0) => { const ms = tick() - ago * 864e5; return { at: new Date(ms).toISOString(), day: dayOfMs(ms) } }
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
export const fp = (p: Progress) => fingerprint(p)
// armazenamento em memória no formato de localStorage
export function memStorage(): Storage {
  const m = new Map<string, string>()
  return { get length() { return m.size }, clear: () => m.clear(), getItem: k => m.get(k) ?? null, key: i => [...m.keys()][i] ?? null, removeItem: k => { m.delete(k) }, setItem: (k, v) => { m.set(k, String(v)) } } as Storage
}
