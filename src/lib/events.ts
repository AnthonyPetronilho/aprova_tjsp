import type { Base, CardState, DayStats, Ev, ErrorEntry, Progress } from '../types'
import { FLASHCARDS, errCardId } from '../data/cards'
import { newCard, schedule } from './srs'

// Modelo de eventos do progresso (Fase 2).
//  - Cada resposta, revisão, aula concluída, recompensa de XP e favorito é um REGISTRO com id único. Dois aparelhos que
//    registram a mesma atividade (mesmo id) contam uma vez; atividades diferentes somam. Nada é "maior contador vence".
//  - Tempo de estudo: um contador por (aparelho, dia). Cada contador só é escrito por um aparelho, então "máximo por id"
//    é exato; o total é a SOMA entre aparelhos.
//  - XP: soma das recompensas (eventos 'rwd' com id determinístico, ex.: rwd:q:<questão>), nunca um número copiado.
//  - O estado exibido (answers, errors, cards, daily, xp…) é DERIVADO por rebuild() a partir de base + eventos.
//    O mesmo caminho serve para ações locais e para mesclagem, então os dois sempre concordam.
//  - base: retrato congelado dos dados anteriores a esta versão (compatibilidade). É mesclado de forma determinística.
export const SCHEMA = 2
export const emptyBase = (): Base => ({ xp: 0, completed: {}, answers: {}, errors: {}, cards: {}, favorites: [], reviewLog: [], daily: {}, totalAnswered: 0, correctStreak: 0, bestCorrectStreak: 0 })
export const emptyDay = (): DayStats => ({ qids: [], correctQids: [], lessons: 0, reviews: 0, resolved: 0, seconds: 0, xp: 0 })

export const uid = (): string => {
  const c = (globalThis as { crypto?: Crypto }).crypto
  if (c?.randomUUID) return c.randomUUID()
  return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
}
export const cmpEv = (a: Ev, b: Ev) => (a.at < b.at ? -1 : a.at > b.at ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
const stable = (v: unknown): string => JSON.stringify(v, (_k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(k => [k, (x as Record<string, unknown>)[k]])) : x))
export const canon = stable
const union = (a: string[] = [], b: string[] = []) => [...new Set([...a, ...b])].sort()
const minStr = (a?: string, b?: string) => (a === undefined ? b : b === undefined ? a : a <= b ? a : b)
const pickBy = <T,>(a: T, b: T, key: (x: T) => string) => { const ka = key(a), kb = key(b); return ka > kb ? a : kb > ka ? b : stable(a) <= stable(b) ? a : b }

// ── eventos: união por id. Contadores 'sec' usam máximo por id; os demais são imutáveis (em colisão, vence o JSON menor, só para ser determinístico).
export function mergeEvents(a: Ev[], b: Ev[]): Ev[] {
  const m = new Map<string, Ev>()
  for (const e of [...a, ...b]) {
    const cur = m.get(e.id)
    if (!cur) { m.set(e.id, e); continue }
    if (e.t === 'sec' && cur.t === 'sec') m.set(e.id, e.sec > cur.sec ? e : cur)
    else if (stable(e) < stable(cur)) m.set(e.id, e)
  }
  return [...m.values()].sort(cmpEv)
}

// ── base (dados anteriores ao modelo de eventos): mesclagem determinística, associativa e idempotente.
export function mergeBase(a: Base, b: Base): Base {
  const keys = <T,>(x: Record<string, T>, y: Record<string, T>) => [...new Set([...Object.keys(x), ...Object.keys(y)])].sort()
  const out = emptyBase()
  out.xp = Math.max(a.xp, b.xp) // só dados antigos: o XP novo vem de eventos
  for (const k of keys(a.completed, b.completed)) out.completed[k] = minStr(a.completed[k], b.completed[k])!
  for (const k of keys(a.answers, b.answers)) {
    const x = a.answers[k], y = b.answers[k]
    if (!x || !y) { out.answers[k] = x ?? y; continue }
    const w = pickBy(x, y, v => v.at); out.answers[k] = { ...w, everCorrect: x.everCorrect || y.everCorrect }
  }
  for (const k of keys(a.errors, b.errors)) {
    const x = a.errors[k], y = b.errors[k]
    if (!x || !y) { out.errors[k] = (x ?? y) as ErrorEntry; continue }
    const w = pickBy(x, y, v => `${v.lastAt}|${String(v.count).padStart(6, '0')}`); out.errors[k] = { count: Math.max(x.count, y.count), lastAt: w.lastAt, resolved: w.resolved }
  }
  for (const k of keys(a.cards, b.cards)) {
    const x = a.cards[k], y = b.cards[k]
    out.cards[k] = !x || !y ? ((x ?? y) as CardState) : pickBy(x, y, v => `${v.last ?? ''}|${String(v.reps).padStart(6, '0')}`)
  }
  out.favorites = union(a.favorites, b.favorites)
  out.reviewLog = b.reviewLog.length > a.reviewLog.length ? b.reviewLog : a.reviewLog.length > b.reviewLog.length ? a.reviewLog : stable(a.reviewLog) <= stable(b.reviewLog) ? a.reviewLog : b.reviewLog
  for (const k of keys(a.daily, b.daily)) {
    const x = a.daily[k], y = b.daily[k]
    if (!x || !y) { out.daily[k] = (x ?? y) as DayStats; continue }
    out.daily[k] = { qids: union(x.qids, y.qids), correctQids: union(x.correctQids, y.correctQids), lessons: Math.max(x.lessons, y.lessons), reviews: Math.max(x.reviews, y.reviews), resolved: Math.max(x.resolved, y.resolved), seconds: Math.max(x.seconds, y.seconds), xp: Math.max(x.xp, y.xp) }
  }
  out.totalAnswered = Math.max(a.totalAnswered, b.totalAnswered)
  out.correctStreak = Math.max(a.correctStreak, b.correctStreak)
  out.bestCorrectStreak = Math.max(a.bestCorrectStreak, b.bestCorrectStreak)
  return out
}

const cloneDaily = (d: Record<string, DayStats>) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, { ...v, qids: [...v.qids], correctQids: [...v.correctQids] }]))

// ── derivação: reconstrói o estado a partir de base + eventos. Pura e determinística (ordem por at, id).
export function rebuild(p: Progress): Progress {
  const b = p.base, evs = [...p.events].sort(cmpEv)
  let xp = b.xp, totalAnswered = b.totalAnswered, streak = b.correctStreak, best = b.bestCorrectStreak
  const completed = { ...b.completed }, answers = { ...b.answers }, errors: Record<string, ErrorEntry> = Object.fromEntries(Object.entries(b.errors).map(([k, v]) => [k, { ...v }]))
  const cards: Record<string, CardState> = { ...b.cards }, fav = new Set(b.favorites), reviewLog = [...b.reviewLog], daily = cloneDaily(b.daily)
  const study = new Set<string>(), bonus = new Set<string>(), revXp = new Set<string>(), mockXp = new Set<string>()
  const day = (d: string) => (daily[d] ??= emptyDay())
  // 1) datas de conclusão e criação de cards (antes de aplicar revisões, para não depender da ordem entre aparelhos com relógios diferentes)
  for (const e of evs) if (e.t === 'les') completed[e.lid] = minStr(completed[e.lid], e.day)!
  for (const [lid, d] of Object.entries(completed)) for (const c of FLASHCARDS) if (c.lessonId === lid && !cards[c.id]) cards[c.id] = newCard(d)
  const firstWrong: Record<string, string> = {}
  for (const e of evs) if (e.t === 'ans' && !e.correct) firstWrong[e.qid] = minStr(firstWrong[e.qid], e.day)!
  for (const [q, d] of Object.entries(firstWrong)) if (!cards[errCardId(q)]) cards[errCardId(q)] = newCard(d)
  // 2) aplica os eventos em ordem
  for (const e of evs) {
    switch (e.t) {
      case 'ans': {
        const prev = answers[e.qid], first = e.correct && !prev?.everCorrect, wasOpen = !!errors[e.qid] && !errors[e.qid].resolved, d = day(e.day)
        if (!e.correct) errors[e.qid] = { count: (errors[e.qid]?.count ?? 0) + 1, lastAt: e.day, resolved: false }
        else if (errors[e.qid]) errors[e.qid] = { ...errors[e.qid], resolved: true }
        if (!d.qids.includes(e.qid)) { d.qids.push(e.qid); totalAnswered++ }
        if (e.correct && !d.correctQids.includes(e.qid)) d.correctQids.push(e.qid)
        if (e.correct && wasOpen) d.resolved++
        best = Math.max(best, e.correct && first ? streak + 1 : 0); streak = e.correct ? streak + (first ? 1 : 0) : 0
        answers[e.qid] = { chosen: e.chosen, correct: e.correct, everCorrect: !!prev?.everCorrect || e.correct, at: e.day }
        study.add(e.day); break
      }
      case 'rev': { const c = cards[e.card]; if (c) { cards[e.card] = schedule(c, e.rating, e.day); reviewLog.push({ at: e.day, rating: e.rating }); day(e.day).reviews++; study.add(e.day) } break }
      case 'les': day(e.day).lessons++; study.add(e.day); break
      case 'sec': day(e.day).seconds += e.sec; break
      case 'rwd': xp += e.xp; day(e.day).xp += e.xp; if (e.kind === 'rev') revXp.add(e.key); if (e.kind === 'mock') mockXp.add(e.key); if (e.kind === 'mission') bonus.add(e.key); break
      case 'fav': if (e.on) fav.add(e.qid); else fav.delete(e.qid); break
    }
  }
  return {
    ...p, xp, completed, answers, errors, cards, favorites: [...fav].sort(), reviewLog: reviewLog.slice(-500), daily, totalAnswered, correctStreak: streak, bestCorrectStreak: best,
    studyDays: union(p.studyDays, [...study]), bonusDays: union(p.bonusDays, [...bonus]), reviewXpDays: union(p.reviewXpDays, [...revXp]), mockXpDays: union(p.mockXpDays, [...mockXp]),
  }
}

// ── migração do formato anterior (sem eventos): o estado atual vira a base congelada; nada é descartado nem reatribuído.
export function toV2(p: Progress): Progress { return p.schemaVersion === SCHEMA && p.base && Array.isArray(p.events) ? p : legacyToV2(p) }
export function legacyToV2(p: Progress): Progress {
  const base: Base = { xp: p.xp, completed: p.completed, answers: p.answers, errors: p.errors, cards: p.cards, favorites: p.favorites, reviewLog: p.reviewLog, daily: p.daily, totalAnswered: p.totalAnswered, correctStreak: p.correctStreak, bestCorrectStreak: p.bestCorrectStreak }
  return rebuild({ ...p, schemaVersion: SCHEMA, events: [], base })
}

// Campos que valem só para este aparelho e nunca são enviados para decidir nada nos outros.
export const DEVICE_LOCAL = ['dark', 'mockRun', 'missionsToday', 'levelSeen', 'lastLessonId'] as const
export function syncView(p: Progress): unknown {
  const { dark: _d, mockRun: _m, missionsToday: _s, levelSeen: _l, lastLessonId: _a, ...rest } = p
  void _d; void _m; void _s; void _l; void _a
  return rest
}
export const fingerprint = (p: Progress) => stable(syncView(p))

// ── mesclagem de dois progressos (local, remoto). Resultado equivalente em qualquer ordem para os campos sincronizados.
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const a = toV2(local), b = toV2(remote)
  if (a.epoch.id !== b.epoch.id) { // "Zerar progresso" cria uma nova época; vence a decisão mais recente (backup é feito por quem chama)
    const w = pickBy(a, b, x => `${x.epoch.at || "0"}|${x.epoch.id}`)
    return rebuild({ ...w, dark: a.dark, mockRun: a.mockRun, missionsToday: a.missionsToday, levelSeen: Math.max(a.levelSeen, b.levelSeen), lastLessonId: a.lastLessonId })
  }
  const prefs = pickBy(a, b, x => x.prefsAt)
  const notes: Progress['notes'] = {}
  for (const k of new Set([...Object.keys(a.notes), ...Object.keys(b.notes)])) { const x = a.notes[k], y = b.notes[k]; notes[k] = !x || !y ? (x ?? y) : pickBy(x, y, n => n.updatedAt) }
  const achievements: Record<string, string> = {}
  for (const k of new Set([...Object.keys(a.achievements), ...Object.keys(b.achievements)])) achievements[k] = minStr(a.achievements[k], b.achievements[k])!
  const mocks = [...new Map([...a.mocks, ...b.mocks].map(m => [m.id, m])).values()].sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : x.id < y.id ? -1 : 1))
  const deleted = union(a.essaysDeleted, b.essaysDeleted)
  const essays = [...new Map([...a.essays, ...b.essays].map(e => [e.id, e])).values()].filter(e => !deleted.includes(e.id)).sort((x, y) => (x.savedAt < y.savedAt ? -1 : x.savedAt > y.savedAt ? 1 : x.id < y.id ? -1 : 1))
  return rebuild({
    ...a, base: mergeBase(a.base, b.base), events: mergeEvents(a.events, b.events), notes, achievements, mocks, essays, essaysDeleted: deleted,
    studyDays: union(a.studyDays, b.studyDays), bonusDays: union(a.bonusDays, b.bonusDays), reviewXpDays: union(a.reviewXpDays, b.reviewXpDays), mockXpDays: union(a.mockXpDays, b.mockXpDays),
    settings: prefs.settings, plan: prefs.plan, planMarks: prefs.planMarks, essayDrafts: prefs.essayDrafts, prefsAt: prefs.prefsAt, levelSeen: Math.max(a.levelSeen, b.levelSeen),
  })
}

// Forma mínima aceitável para um progresso vindo de fora (servidor, arquivo, outra aba). Evita que dado corrompido entre na mesclagem.
export function isProgressLike(raw: unknown): raw is Partial<Progress> {
  const r = raw as Partial<Progress> | null, obj = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v), arr = Array.isArray
  if (!r || typeof r !== 'object') return false
  if (r.schemaVersion !== undefined && (!Number.isInteger(r.schemaVersion) || r.schemaVersion > SCHEMA)) return false
  if (typeof r.xp !== 'number' || !Number.isFinite(r.xp) || !obj(r.completed) || !obj(r.answers)) return false
  for (const k of ['cards', 'errors', 'notes', 'daily'] as const) if (r[k] !== undefined && !obj(r[k])) return false
  for (const k of ['studyDays', 'bonusDays', 'favorites', 'reviewLog', 'reviewXpDays', 'mocks', 'mockXpDays', 'essays'] as const) if (r[k] !== undefined && !arr(r[k])) return false
  if (r.schemaVersion === SCHEMA && (!arr(r.events) || !obj(r.base) || !obj(r.epoch))) return false
  return true
}
