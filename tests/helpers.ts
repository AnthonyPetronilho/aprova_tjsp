import { commit, answerEvents, normalize } from '../src/lib/useProgress'
import { mergeProgress, fingerprint, isProgressLike, uid } from '../src/lib/events'
import type { Ev, OptId, Progress, Rating } from '../src/types'

// PRNG com semente (testes aleatórios reproduzíveis)
export function rng(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32 } }

// Um "aparelho" de teste: guarda o progresso como o app faz (commit/merge) sem React.
export function device(raw: unknown = {}) {
  let p = normalize(raw)
  const d = {
    get p() { return p },
    set p(v: Progress) { p = v },
    // relógio estritamente crescente: ações no mesmo milissegundo teriam ordem decidida pelo id aleatório (teste instável)
    answer(qid: string, correct: boolean, chosen: OptId = 'A') { p = commit(p, answerEvents(p, qid, chosen, correct).map(e => ({ ...e, at: tick() }))) },
    rate(card: string, r: Rating) { p = commit(p, [{ id: uid(), t: 'rev', card, rating: r, at: new Date().toISOString(), day: today(), } as Ev]) },
    ev(e: Partial<Ev> & { t: Ev['t'] }) { const full = { id: uid(), at: new Date().toISOString(), day: today(), ...e } as Ev; p = commit(p, [full]) },
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
const tick = () => { last = Math.max(Date.now(), last + 1); return new Date(last).toISOString() }
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
export const fp = (p: Progress) => fingerprint(p)
// armazenamento em memória no formato de localStorage
export function memStorage(): Storage {
  const m = new Map<string, string>()
  return { get length() { return m.size }, clear: () => m.clear(), getItem: k => m.get(k) ?? null, key: i => [...m.keys()][i] ?? null, removeItem: k => { m.delete(k) }, setItem: (k, v) => { m.set(k, String(v)) } } as Storage
}
