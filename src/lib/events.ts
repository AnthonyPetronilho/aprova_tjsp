import type { Base, CardState, Checkpoint, DayStats, Ev, ErrorEntry, Progress } from '../types'
import { addDays, todayStr } from './dates'
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
//  - Fase 3 (schema 3): compactação. Eventos ans/rev antigos são incorporados à base; o 'checkpoint' (cp) registra, por produtor, até que nº de sequência
//    cada um foi incorporado (vec) e, para eventos antigos sem produtor, a lista de ids. Evento coberto pelo cp é descartado ao mesclar (não reaplica);
//    evento não coberto (de aparelho que ficou offline) é mantido e aplicado. Só o servidor decide qual compactação vale (veja sync.ts: prepare/committed).
export const SCHEMA = 3
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
    out.daily[k] = { qids: union(x.qids, y.qids), correctQids: union(x.correctQids, y.correctQids), lessons: Math.max(x.lessons, y.lessons), reviews: Math.max(x.reviews, y.reviews), resolved: Math.max(x.resolved, y.resolved), seconds: Math.max(x.seconds, y.seconds), xp: Math.max(x.xp, y.xp), ...(x.asm || y.asm ? { asm: Math.max(x.asm ?? 0, y.asm ?? 0) } : {}), ...(x.study || y.study ? { study: 1 } : {}) }
  }
  out.totalAnswered = Math.max(a.totalAnswered, b.totalAnswered)
  out.correctStreak = Math.max(a.correctStreak, b.correctStreak)
  out.bestCorrectStreak = Math.max(a.bestCorrectStreak, b.bestCorrectStreak)
  return out
}

const cloneDaily = (d: Record<string, DayStats>) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, { ...v, qids: [...v.qids], correctQids: [...v.correctQids] }]))

// ── derivação: reconstrói o estado a partir de base + eventos. Pura e determinística (ordem por at, id).
export function rebuild(p: Progress, opts: { only?: Set<string> } = {}): Progress {
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
  // 2) aplica os eventos em ordem (opts.only: só estes — usado para calcular a base da compactação)
  for (const e of evs) {
    if (opts.only && !opts.only.has(e.id)) continue
    switch (e.t) {
      case 'ans': {
        // "tardio": a resposta é mais antiga que a já registrada (evento de aparelho que ficou offline, aplicado depois de uma compactação). Conta como atividade, mas não desfaz o estado mais recente.
        const prev = answers[e.qid], late = !!prev && prev.at > e.day, first = !late && e.correct && !prev?.everCorrect, wasOpen = !late && !!errors[e.qid] && !errors[e.qid].resolved, d = day(e.day)
        if (!e.correct) errors[e.qid] = late && errors[e.qid] ? { ...errors[e.qid], count: errors[e.qid].count + 1 } : { count: (errors[e.qid]?.count ?? 0) + 1, lastAt: e.day, resolved: late ? !!prev?.correct : false }
        else if (errors[e.qid] && !late) errors[e.qid] = { ...errors[e.qid], resolved: true }
        if (!d.qids.includes(e.qid)) { d.qids.push(e.qid); totalAnswered++ }
        if (e.correct && !d.correctQids.includes(e.qid)) d.correctQids.push(e.qid)
        if (e.correct && wasOpen) d.resolved++
        if (!late) { best = Math.max(best, e.correct && first ? streak + 1 : 0); streak = e.correct ? streak + (first ? 1 : 0) : 0 }
        answers[e.qid] = late ? { ...prev, everCorrect: prev.everCorrect || e.correct } : { chosen: e.chosen, correct: e.correct, everCorrect: !!prev?.everCorrect || e.correct, at: e.day }
        study.add(e.day); break
      }
      case 'rev': { const c = cards[e.card]; if (c) { if (!(c.last && c.last > e.day)) cards[e.card] = schedule(c, e.rating, e.day); reviewLog.push({ at: e.day, rating: e.rating }); day(e.day).reviews++; study.add(e.day) } break }
      case 'les': day(e.day).lessons++; study.add(e.day); break
      case 'sec': day(e.day).seconds += e.sec; break
      case 'asm': { const d = day(e.day); d.asm = (d.asm ?? 0) + 1; study.add(e.day); break }
      case 'rwd': xp += e.xp; day(e.day).xp += e.xp; if (e.kind === 'study') day(e.day).study = 1; if (e.kind === 'rev') revXp.add(e.key); if (e.kind === 'mock') mockXp.add(e.key); if (e.kind === 'mission') bonus.add(e.key); break
      case 'fav': if (e.on) fav.add(e.qid); else fav.delete(e.qid); break
    }
  }
  return {
    ...p, xp, completed, answers, errors, cards, favorites: [...fav].sort(), reviewLog: reviewLog.slice(-500), daily, totalAnswered, correctStreak: streak, bestCorrectStreak: best,
    studyDays: union(p.studyDays, [...study]), bonusDays: union(p.bonusDays, [...bonus]), reviewXpDays: union(p.reviewXpDays, [...revXp]), mockXpDays: union(p.mockXpDays, [...mockXp]),
  }
}

// ── migração do formato anterior (sem eventos): o estado atual vira a base congelada; nada é descartado nem reatribuído.
// Leva qualquer versão ao formato atual (idempotente): v1/sem eventos → base congelada; v2 → v3 (campos novos vazios, eventos intactos).
export function toCurrent(p: Progress): Progress {
  if (p.schemaVersion === SCHEMA && p.base && Array.isArray(p.events)) return p
  if (p.schemaVersion === 2 && p.base && Array.isArray(p.events)) return rebuild({ ...p, schemaVersion: SCHEMA, diary: p.diary ?? {}, marks: p.marks ?? {} })
  return legacyToV2(p)
}
export const toV2 = toCurrent
export function legacyToV2(p: Progress): Progress {
  const base: Base = { xp: p.xp, completed: p.completed, answers: p.answers, errors: p.errors, cards: p.cards, favorites: p.favorites, reviewLog: p.reviewLog, daily: p.daily, totalAnswered: p.totalAnswered, correctStreak: p.correctStreak, bestCorrectStreak: p.bestCorrectStreak }
  return rebuild({ ...p, schemaVersion: SCHEMA, events: [], base, diary: p.diary ?? {}, marks: p.marks ?? {} })
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
  const a = toCurrent(local), b = toCurrent(remote)
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
  const diary: Progress['diary'] = {}
  for (const k of new Set([...Object.keys(a.diary ?? {}), ...Object.keys(b.diary ?? {})])) { const x = a.diary?.[k], y = b.diary?.[k]; diary[k] = !x || !y ? (x ?? y)! : pickBy(x, y, v => v.updatedAt) }
  const marks: Progress['marks'] = {}
  for (const k of new Set([...Object.keys(a.marks ?? {}), ...Object.keys(b.marks ?? {})])) { const x = a.marks?.[k], y = b.marks?.[k]; marks[k] = !x || !y ? (x ?? y)! : pickBy(x, y, v => v.at) }
  // compactação: vence o checkpoint mais novo; a base dele já contém os eventos cobertos. Cp igual → bases do mesmo ponto (só difere em dados antigos) → mescla normal.
  const cp = pickCp(a.cp, b.cp), same = (a.cp?.id ?? '') === (b.cp?.id ?? '')
  const base = same ? mergeBase(a.base, b.base) : cp === a.cp ? fillBase(a.base, b.base) : fillBase(b.base, a.base)
  const events = mergeEvents(a.events, b.events).filter(e => !isCovered(e, cp))
  return rebuild({
    ...a, cp, base, events, diary, marks, notes, achievements, mocks, essays, essaysDeleted: deleted,
    studyDays: union(a.studyDays, b.studyDays), bonusDays: union(a.bonusDays, b.bonusDays), reviewXpDays: union(a.reviewXpDays, b.reviewXpDays), mockXpDays: union(a.mockXpDays, b.mockXpDays),
    settings: prefs.settings, plan: prefs.plan, planMarks: prefs.planMarks, essayDrafts: prefs.essayDrafts, prefsAt: prefs.prefsAt, levelSeen: Math.max(a.levelSeen, b.levelSeen),
  })
}

// ── compactação (Fase 3) ───────────────────────────────────────────────────────────────────────────────────────────────
const pickCp = (a?: Checkpoint, b?: Checkpoint): Checkpoint | undefined => (!a ? b : !b ? a : a.gen !== b.gen ? (a.gen > b.gen ? a : b) : a.id >= b.id ? a : b)
type Foldable = Extract<Ev, { t: 'ans' | 'rev' }>
const foldable = (e: Ev): e is Foldable => e.t === 'ans' || e.t === 'rev'
export function isCovered(e: Ev, cp?: Checkpoint): boolean {
  if (!cp || !foldable(e)) return false
  return e.dev !== undefined && e.n !== undefined ? e.n <= (cp.vec[e.dev] ?? 0) : cp.legacy.includes(e.id)
}
// Mesma ideia de mergeBase, para bases de pontos diferentes: vale a do checkpoint mais novo (W); só preenche o que ela não tem (dados antigos sem outro lugar).
function fillBase(w: Base, l: Base): Base {
  const fill = <T,>(x: Record<string, T>, y: Record<string, T>) => ({ ...y, ...x })
  const completed = { ...w.completed }; for (const [k, v] of Object.entries(l.completed)) completed[k] = minStr(completed[k], v)!
  return { ...w, xp: Math.max(w.xp, l.xp), completed, answers: fill(w.answers, l.answers), errors: fill(w.errors, l.errors), cards: fill(w.cards, l.cards), favorites: union(w.favorites, l.favorites), daily: fill(w.daily, l.daily), totalAnswered: Math.max(w.totalAnswered, l.totalAnswered), bestCorrectStreak: Math.max(w.bestCorrectStreak, l.bestCorrectStreak) }
}
// forma canônica da base (listas ordenadas, como mergeBase produz): mesclar um documento consigo mesmo devolve exatamente o mesmo documento
const sortedDaily = (d: Record<string, DayStats>) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, { ...v, qids: [...v.qids].sort(), correctQids: [...v.correctQids].sort() }]))
export const COMPACT_DEFAULTS = { minEvents: 400, keepDays: 14, minGapDays: 1 }
export interface CompactOpts { minEvents?: number; keepDays?: number; minGapDays?: number; today?: string; now?: string }
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 864e5)
// Incorpora à base os eventos ans/rev mais antigos (mais velhos que keepDays dias). Devolve null se não há o que compactar.
// Garantias (testadas): o estado derivado não muda; o resultado é o mesmo se rodar de novo (nada novo → null); só entram na base eventos que formam
// um prefixo contínuo de cada produtor (assim o checkpoint descreve exatamente o que foi incorporado).
export function compact(p0: Progress, o: CompactOpts = {}): Progress | null {
  const cfg = { ...COMPACT_DEFAULTS, ...o }, today = o.today ?? todayStr(), now = o.now ?? new Date().toISOString()
  const p = toCurrent(p0), cp0 = p.cp
  if (cp0 && dayDiff(cp0.at.slice(0, 10), today) < cfg.minGapDays) return null
  const events = p.events.filter(e => !isCovered(e, cp0)).sort(cmpEv), fo = events.filter(foldable)
  if (fo.length < cfg.minEvents) return null
  const cutoff = addDays(today, -cfg.keepDays), next: Record<string, number> = {}, vec = { ...(cp0?.vec ?? {}) }, legacy = new Set(cp0?.legacy ?? []), F: Foldable[] = []
  for (const e of fo) {
    if (e.day >= cutoff) break
    if (e.dev !== undefined && e.n !== undefined) { const want = (next[e.dev] ?? vec[e.dev] ?? 0) + 1; if (e.n !== want) break; next[e.dev] = e.n } else legacy.add(e.id)
    F.push(e)
  }
  if (!F.length) return null
  const r = rebuild({ ...p, events }, { only: new Set(F.map(e => e.id)) })
  const base: Base = { xp: p.base.xp, completed: p.base.completed, answers: r.answers, errors: r.errors, cards: r.cards, favorites: p.base.favorites, reviewLog: r.reviewLog, daily: sortedDaily(r.daily), totalAnswered: r.totalAnswered, correctStreak: r.correctStreak, bestCorrectStreak: r.bestCorrectStreak }
  const cp: Checkpoint = { id: uid(), gen: (cp0?.gen ?? 0) + 1, at: now, vec: { ...vec, ...next }, legacy: [...legacy].sort() }
  const ids = new Set(F.map(e => e.id))
  return rebuild({ ...p, base, cp, events: events.filter(e => !ids.has(e.id)) })
}

// Forma mínima aceitável para um progresso vindo de fora (servidor, arquivo, outra aba). Evita que dado corrompido entre na mesclagem.
export function isProgressLike(raw: unknown): raw is Partial<Progress> {
  const r = raw as Partial<Progress> | null, obj = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v), arr = Array.isArray
  if (!r || typeof r !== 'object') return false
  if (r.schemaVersion !== undefined && (!Number.isInteger(r.schemaVersion) || r.schemaVersion > SCHEMA)) return false
  if (typeof r.xp !== 'number' || !Number.isFinite(r.xp) || !obj(r.completed) || !obj(r.answers)) return false
  for (const k of ['cards', 'errors', 'notes', 'daily'] as const) if (r[k] !== undefined && !obj(r[k])) return false
  for (const k of ['studyDays', 'bonusDays', 'favorites', 'reviewLog', 'reviewXpDays', 'mocks', 'mockXpDays', 'essays'] as const) if (r[k] !== undefined && !arr(r[k])) return false
  if (r.schemaVersion !== undefined && r.schemaVersion >= 2 && (!arr(r.events) || !obj(r.base) || !obj(r.epoch))) return false
  for (const k of ['diary', 'marks'] as const) if (r[k] !== undefined && !obj(r[k])) return false
  if (r.cp !== undefined && (!obj(r.cp) || !obj(r.cp.vec) || !arr(r.cp.legacy) || !Number.isInteger(r.cp.gen))) return false
  return true
}
