import { useCallback, useEffect, useRef, useState } from 'react'
import type { AsmItem, AsmMode, DayStats, Essay, Ev, MasteryRules, MaterialKind, MockResult, MockRun, OptId, PlanMark, PlanSettings, Progress, Question, Rating, XpSettings } from '../types'
import { QUESTIONS } from '../data/questions'
import { DISCIPLINES } from '../data/edital'
import { buildTemplate } from './plan'
import { DEFAULT_MASTERY, DEFAULT_XP } from '../config'
import { FLASHCARDS } from '../data/cards'
import { todayStr } from './dates'
import { achievements, levelInfo } from './gamification'
import { buildMissions, emptyDay, missionDone } from './missions'
import { SCHEMA, canon, compact, emptyBase, isProgressLike, legacyToV2, mergeProgress, rebuild, uid } from './events'
import { sync } from './sync'
import { validateStudy, type StudyInput } from './learning'
import { backup } from './backup'
export { todayStr }
const KEY = 'aprova-tjsp:v1' // a chave não muda: os dados antigos continuam sendo lidos e migrados
const DEV_KEY = 'aprova-tjsp:device'
const empty: Progress = { schemaVersion: SCHEMA, diary: {}, marks: {}, epoch: { id: '0', at: '' }, prefsAt: '', events: [], base: emptyBase(), essaysDeleted: [], xp: 0, completed: {}, answers: {}, studyDays: [], bonusDays: [], dark: false, cards: {}, errors: {}, favorites: [], reviewLog: [], reviewXpDays: [], notes: {}, achievements: {}, correctStreak: 0, bestCorrectStreak: 0, totalAnswered: 0, daily: {}, settings: { xp: { ...DEFAULT_XP }, mastery: { ...DEFAULT_MASTERY } }, levelSeen: 0, planMarks: {}, mocks: [], mockXpDays: [], essays: [], essayDrafts: {} }

export function deviceId(): string {
  try { let d = localStorage.getItem(DEV_KEY); if (!d) { d = uid(); localStorage.setItem(DEV_KEY, d) } return d } catch { return 'sem-armazenamento' }
}
// Aceita dados de qualquer fase anterior (campos ausentes recebem padrões), reconstrói as estatísticas de hoje e leva ao modelo de eventos.
export function normalize(raw: unknown): Progress {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Progress>, t = todayStr()
  const p: Progress = { ...empty, ...r, diary: r.diary ?? {}, marks: r.marks ?? {}, settings: { xp: { ...DEFAULT_XP, ...(r.settings?.xp ?? {}) }, mastery: { ...DEFAULT_MASTERY, ...(r.settings?.mastery ?? {}) } } } as Progress
  if (r.totalAnswered === undefined) p.totalAnswered = Object.keys(p.answers).length
  if (!r.daily) {
    const ans = Object.entries(p.answers).filter(([, a]) => a.at === t)
    p.daily = { [t]: { ...emptyDay(), qids: ans.map(([q]) => q), correctQids: ans.filter(([, a]) => a.correct).map(([q]) => q), lessons: Object.values(p.completed).filter(d => d === t).length, reviews: p.reviewLog.filter(l => l.at === t).length } }
  }
  if (!r.base || !Array.isArray(r.events) || (r.schemaVersion ?? 1) < 2) return legacyToV2(migrateLegacy(p)) // dados antigos: viram a base congelada
  return rebuild({ ...p, schemaVersion: SCHEMA }) // v2 → v3: campos novos vazios, eventos intactos (idempotente)
}
// cards das aulas já concluídas e erros antigos (Fase 1 → 2); só vale para o formato antigo, antes de virar base
function migrateLegacy(p: Progress): Progress {
  const t = todayStr(); let cards = p.cards, errors = p.errors, ch = false
  const touch = () => { if (!ch) { cards = { ...cards }; errors = { ...errors }; ch = true } }
  for (const lid of Object.keys(p.completed)) for (const c of FLASHCARDS) if (c.lessonId === lid && !cards[c.id]) { touch(); cards[c.id] = { ease: 2.5, interval: 0, due: t, reps: 0, lapses: 0 } }
  return ch ? { ...p, cards, errors } : p
}
// Camada de persistência isolada. Antes de migrar um formato antigo, uma cópia fica guardada (lib/backup.ts).
const load = (): Progress => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return normalize({})
    const j = JSON.parse(raw)
    if (j?.schemaVersion !== SCHEMA) backup(`antes-da-migracao-v${j?.schemaVersion ?? 1}`, raw)
    return normalize(j)
  } catch { return normalize({}) }
}
const save = (p: Progress) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* localStorage indisponível */ } }

type NewEv = Ev extends infer E ? (E extends Ev ? Omit<E, 'id' | 'at' | 'day'> & { id?: string } : never) : never
const mk = (e: NewEv): Ev => ({ ...e, id: e.id ?? uid(), at: new Date().toISOString(), day: todayStr() }) as Ev
// Único caminho de escrita das atividades: acrescenta eventos (ids repetidos são ignorados) e reconstrói o estado derivado.
// Produtor de eventos: um id curto por vida da página (e por troca de conta). Cada produtor numera seus eventos ans/rev em sequência (1, 2, 3…),
// o que permite ao checkpoint da compactação dizer exatamente "até aqui eu já incorporei" sem listar ids.
let PID = uid().slice(0, 8)
export const producerId = () => PID
export const rotateProducer = () => { PID = uid().slice(0, 8) }
const seqOf = (x: Progress, dev: string) => Math.max(x.cp?.vec[dev] ?? 0, ...x.events.map(e => ((e.t === 'ans' || e.t === 'rev') && e.dev === dev ? e.n ?? 0 : 0)))
export function commit(x: Progress, evs: Ev[], patch: Partial<Progress> = {}, dev: string = PID): Progress {
  let seq = seqOf(x, dev)
  evs = evs.map(e => ((e.t === 'ans' || e.t === 'rev') && e.n === undefined ? { ...e, dev, n: ++seq } : e))
  const ids = new Set(x.events.map(e => e.id)); let events = x.events
  for (const e of evs) {
    if (e.t === 'sec') { events = ids.has(e.id) ? events.map(y => (y.id === e.id ? e : y)) : [...events, e]; ids.add(e.id) }
    else if (!ids.has(e.id)) { events = [...events, e]; ids.add(e.id) }
  }
  return rebuild({ ...x, ...patch, events })
}
// eventos de uma resposta: a resposta (sempre um registro novo) e, na 1ª vez que acerta a questão, a recompensa (id fixo por questão)
export function answerEvents(x: Progress, qid: string, chosen: OptId, correct: boolean, asm?: string): Ev[] {
  const first = correct && !x.answers[qid]?.everCorrect
  return [mk({ t: 'ans', qid, chosen, correct, ...(asm ? { asm } : {}) }), ...(first ? [mk({ t: 'rwd', kind: 'q', key: qid, xp: x.settings.xp.question, id: `rwd:q:${qid}` })] : [])]
}
const stampPrefs = (): Partial<Progress> => ({ prefsAt: new Date().toISOString() })

export interface Toast { id: string; text: string }
export function useProgress() {
  const [p, setP] = useState<Progress>(() => load())
  const ref = useRef(p)
  // todas as mudanças passam por aqui: o estado mais recente fica numa ref (leitura síncrona para a sincronização) e vai para o React
  const update = useCallback((f: (x: Progress) => Progress) => { const n = f(ref.current); if (n !== ref.current) { ref.current = n; setP(n) } }, [])
  const [toasts, setToasts] = useState<Toast[]>([]), seen = useRef(new Set<string>())
  const toast = useCallback((id: string, text: string) => { if (seen.current.has(id)) return; seen.current.add(id); setToasts(t => [...t, { id, text }]); window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 6000) }, [])
  useEffect(() => { save(p); document.documentElement.classList.toggle('dark', p.dark) }, [p])
  // Sem servidor não há outros aparelhos: compacta aqui mesmo (com cópia antes). Com servidor, a compactação só vale se o servidor aceitar (sync.ts: prepare/committed).
  useEffect(() => { if (sync.getState().enabled) return; const c = compact(ref.current); if (c) { backup('antes-de-compactar', JSON.stringify(ref.current)); update(() => c) } }, [update])
  useEffect(() => { // missões do dia, bônus, conquistas e nível: tudo derivado de atividades reais
    const t = todayStr(); let n = p; const ev: [string, string][] = []
    if (n.missionsToday?.day !== t) n = { ...n, missionsToday: { day: t, list: buildMissions(n, t) } }
    const list = n.missionsToday?.list ?? [], day = n.daily[t]
    if (list.length && list.every(m => missionDone(m, day)) && !n.bonusDays.includes(t)) {
      n = commit(n, [mk({ t: 'rwd', kind: 'mission', key: t, xp: n.settings.xp.dailyMission, id: `rwd:mission:${t}` })]); ev.push([`bonus-${t}`, `🎯 Missões do dia completas! +${n.settings.xp.dailyMission} XP`])
    }
    for (const a of achievements(n)) if (a.ok && !n.achievements[a.id]) { n = { ...n, achievements: { ...n.achievements, [a.id]: t } }; ev.push([`ach-${a.id}`, `🏆 Conquista desbloqueada: ${a.name}`]) }
    const lv = levelInfo(n.xp)
    if (lv.index > n.levelSeen) { if (n.levelSeen > 0) ev.push([`lv-${lv.index}`, `⬆️ Nível ${lv.index}: ${lv.title}`]); n = { ...n, levelSeen: lv.index } }
    if (n !== p) { update(() => n); ev.forEach(([id, text]) => toast(id, text)) }
  }, [p, toast, update])
  useEffect(() => { // tempo ativo de estudo: 15 s por intervalo se a aba está visível e houve interação no último minuto. Vira um contador por (aparelho, dia).
    let last = Date.now(); const mark = () => { last = Date.now() }, evs = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    evs.forEach(e => window.addEventListener(e, mark, { passive: true }))
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible' || Date.now() - last >= 60000) return
      update(x => { const sid = `sec:${deviceId()}:${todayStr()}`, cur = x.events.find(e => e.id === sid); return commit(x, [mk({ t: 'sec', sec: (cur?.t === 'sec' ? cur.sec : 0) + 15, id: sid })]) })
    }, 15000)
    return () => { evs.forEach(e => window.removeEventListener(e, mark)); window.clearInterval(id) }
  }, [update])
  useEffect(() => { // outra aba do mesmo navegador salvou: mescla em vez de sobrescrever
    const h = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return
      try { const other = normalize(JSON.parse(e.newValue)); update(x => { const m = mergeProgress(x, other); return canon(m) === canon(x) ? x : m }) } catch { /* ignora */ }
    }
    window.addEventListener('storage', h); return () => window.removeEventListener('storage', h)
  }, [update])
  const answer = useCallback((qid: string, chosen: OptId, correct: boolean) => update(x => commit(x, answerEvents(x, qid, chosen, correct))), [update])
  const complete = useCallback((id: string) => update(x => {
    if (x.completed[id]) return x
    return commit(x, [mk({ t: 'les', lid: id, id: `les:${id}` }), mk({ t: 'rwd', kind: 'les', key: id, xp: x.settings.xp.lesson, id: `rwd:les:${id}` })], { lastLessonId: id })
  }), [update])
  const rate = useCallback((cardId: string, r: Rating) => update(x => (x.cards[cardId] ? commit(x, [mk({ t: 'rev', card: cardId, rating: r })]) : x)), [update])
  // XP de revisão: 1x por dia, ao concluir uma sessão (evita farmar XP repetindo sessões). Id fixo por dia: dois aparelhos não duplicam.
  const finishReview = useCallback(() => update(x => { const t = todayStr(); return x.reviewXpDays.includes(t) ? x : commit(x, [mk({ t: 'rwd', kind: 'rev', key: t, xp: x.settings.xp.review, id: `rwd:rev:${t}` })]) }), [update])
  const saveNote = useCallback((key: string, text: string) => update(x => {
    const v = text.slice(0, 2000)
    if (!v.trim() && !x.notes[key]) return x
    return { ...x, notes: { ...x.notes, [key]: { text: v.trim() ? v : '', updatedAt: new Date().toISOString() } } } // apagar = registro vazio (lápide), para a exclusão também sincronizar
  }), [update])
  const toggleFav = useCallback((qid: string) => update(x => commit(x, [mk({ t: 'fav', qid, on: !x.favorites.includes(qid) })])), [update])
  const setXp = useCallback((k: keyof XpSettings, v: number) => update(x => ({ ...x, ...stampPrefs(), settings: { ...x.settings, xp: { ...x.settings.xp, [k]: Math.max(0, Math.min(1000, Math.round(v) || 0)) } } })), [update])
  const resetXp = useCallback(() => update(x => ({ ...x, ...stampPrefs(), settings: { ...x.settings, xp: { ...DEFAULT_XP } } })), [update])
  // Restaurar backup SOMA o arquivo ao progresso atual (não apaga o que já existe). Antes, guarda uma cópia do estado atual.
  const replaceAll = useCallback((raw: unknown) => {
    if (!isProgressLike(raw)) return false
    backup('antes-de-restaurar', JSON.stringify(ref.current)); seen.current.clear(); update(x => mergeProgress(x, normalize(raw))); return true
  }, [update])
  // Zerar: nova "época" (decisão explícita e mais recente vence na sincronização); guarda cópia antes.
  const reset = useCallback(() => { backup('antes-de-zerar', JSON.stringify(ref.current)); seen.current.clear(); update(x => ({ ...normalize({}), epoch: { id: uid(), at: new Date().toISOString() }, dark: x.dark, prefsAt: new Date().toISOString() })) }, [update])
  // mescla dados vindos do servidor ou de outra aba; devolve o progresso resultante
  const mergeRemote = useCallback((raw: unknown): Progress | null => {
    if (!isProgressLike(raw)) return null
    let remote: Progress; try { remote = normalize(raw) } catch { return null }
    const merged = mergeProgress(ref.current, remote)
    if (canon(merged) !== canon(ref.current)) { backup('antes-de-mesclar', JSON.stringify(ref.current)); update(() => merged) }
    return ref.current
  }, [update])
  // Troca de conta no mesmo navegador: esvazia o estado local SEM criar nova época (não é "zerar": não apaga nada no servidor).
  // Quem chama já guardou uma cópia dos dados (lib/session.ts).
  const clearLocal = useCallback(() => { seen.current.clear(); rotateProducer(); update(x => ({ ...normalize({}), dark: x.dark })) }, [update])
  // ── Fase 3: Diário de Estudos, marcações por assunto, avaliações e regra de domínio
  const saveStudy = useCallback((input: StudyInput): string | null => {
    const err = validateStudy(input); if (err) return err
    const disc = DISCIPLINES.find(d => d.topics.some(t => t.id === input.topicId))!, now = new Date().toISOString()
    update(x => {
      const old = input.id ? x.diary[input.id] : undefined, id = old?.id ?? uid()
      const entry = { id, date: input.date, discId: disc.id, topicId: input.topicId, material: input.material as MaterialKind, source: input.source.trim(), minutes: Math.round(input.minutes), ...(input.note?.trim() ? { note: input.note.trim().slice(0, 1000) } : {}), createdAt: old?.createdAt ?? now, updatedAt: now }
      const t = todayStr(), reward = entry.minutes >= 10 ? [mk({ t: 'rwd', kind: 'study', key: t, xp: x.settings.xp.study, id: `rwd:study:${t}` })] : []
      return commit(x, reward, { diary: { ...x.diary, [id]: entry } })
    })
    return null
  }, [update])
  const deleteStudy = useCallback((id: string) => update(x => (x.diary[id] && !x.diary[id].deleted ? { ...x, diary: { ...x.diary, [id]: { ...x.diary[id], deleted: true, updatedAt: new Date().toISOString() } } } : x)), [update])
  const setMark = useCallback((topicId: string, state: 'estudando' | 'teoria' | 'limpo', entry?: string) => update(x => ({ ...x, marks: { ...x.marks, [topicId]: { state, at: new Date().toISOString(), ...(entry ? { entry } : {}) } } })), [update])
  // Registra uma avaliação/prática: a tentativa (imutável) + cada resposta como evento normal (alimenta Caderno de Erros e revisões). XP: 1x por assunto por dia.
  const submitAssessment = useCallback((a: { topic: string; mode: AsmMode; answers: { qid: string; chosen: OptId }[]; sec: number; entry?: string }): string => {
    const id = uid()
    update(x => {
      const qs = a.answers.map(r => ({ r, q: QUESTIONS.find(q => q.id === r.qid) })).filter((y): y is { r: { qid: string; chosen: OptId }; q: Question } => !!y.q && y.q.topicId === a.topic) // nunca mistura assuntos
      if (!qs.length) return x
      const items: AsmItem[] = qs.map(({ r, q }) => [q.id, r.chosen, r.chosen === q.answer ? 1 : 0])
      let n = commit(x, [mk({ t: 'asm', topic: a.topic, mode: a.mode, items, sec: Math.max(0, Math.min(86400, Math.round(a.sec))), ...(a.entry ? { entry: a.entry } : {}), id })])
      for (const [q, c, ok] of items) n = commit(n, answerEvents(n, q, c, !!ok, id))
      const t = todayStr(); if (items.length >= 5) n = commit(n, [mk({ t: 'rwd', kind: 'asm', key: `${a.topic}:${t}`, xp: n.settings.xp.assessment, id: `rwd:asm:${a.topic}:${t}` })])
      return n
    })
    return id
  }, [update])
  const setMastery = useCallback((r: Partial<MasteryRules>) => update(x => {
    const c = (v: number | undefined, lo: number, hi: number, d: number) => Math.max(lo, Math.min(hi, Math.round(v ?? d)))
    const m = x.settings.mastery; return { ...x, ...stampPrefs(), settings: { ...x.settings, mastery: { minPct: c(r.minPct ?? m.minPct, 50, 100, 80), minDays: c(r.minDays ?? m.minDays, 1, 10, 2), minDistinct: c(r.minDistinct ?? m.minDistinct, 3, 100, 10), weakBelow: c(r.weakBelow ?? m.weakBelow, 10, 90, 60) } } }
  }), [update])
  const resetMastery = useCallback(() => update(x => ({ ...x, ...stampPrefs(), settings: { ...x.settings, mastery: { ...DEFAULT_MASTERY } } })), [update])
  const startMock = useCallback((run: MockRun) => update(x => ({ ...x, mockRun: run })), [update])
  const patchMock = useCallback((f: (r: MockRun) => MockRun) => update(x => (x.mockRun ? { ...x, mockRun: f(x.mockRun) } : x)), [update])
  const abandonMock = useCallback(() => update(x => ({ ...x, mockRun: undefined })), [update])
  // Finaliza o simulado: registra cada resposta (erros viram Caderno de Erros/flashcards) e salva o resultado. XP do simulado: 1x por dia.
  const finishMock = useCallback((): string => {
    const id = `m${Date.now()}`
    update(x => {
      const r = x.mockRun; if (!r) return x
      const t = todayStr(), qs = r.qids.map(i => QUESTIONS.find(q => q.id === i)).filter((q): q is Question => !!q)
      let n: Progress = x, correct = 0, wrong = 0
      for (const q of qs) { const a = r.answers[q.id]; if (!a) continue; const ok = a === q.answer; if (ok) correct++; else wrong++; n = commit(n, answerEvents(n, q.id, a, ok)) }
      const used = Math.min(Math.round((Date.now() - r.startedAt) / 1000), r.limitSec ?? Infinity)
      const res: MockResult = { id, kind: r.kind, date: t, secondsUsed: used, qids: r.qids, answers: r.answers, correct, wrong, blank: qs.length - correct - wrong, score: Math.round((correct / Math.max(1, qs.length)) * 100) / 10 }
      if (!n.mockXpDays.includes(t) && (r.kind === 'completo' || qs.length >= 10)) n = commit(n, [mk({ t: 'rwd', kind: 'mock', key: t, xp: n.settings.xp.mock, id: `rwd:mock:${t}` })])
      return { ...n, mockRun: undefined, mocks: [...n.mocks, res] }
    })
    return id
  }, [update])
  const createPlan = useCallback((s: PlanSettings) => update(x => ({ ...x, ...stampPrefs(), plan: { settings: s, createdAt: todayStr(), from: todayStr(), template: buildTemplate(x, s) } })), [update])
  const recalcPlan = useCallback(() => update(x => (x.plan ? { ...x, ...stampPrefs(), plan: { ...x.plan, from: todayStr(), template: buildTemplate(x, x.plan.settings) } } : x)), [update])
  const clearPlan = useCallback(() => update(x => ({ ...x, ...stampPrefs(), plan: undefined, planMarks: {} })), [update])
  const markBlock = useCallback((date: string, idx: number, mark?: PlanMark) => update(x => {
    const day = { ...(x.planMarks[date] ?? {}) }; if (mark) day[idx] = mark; else delete day[idx]
    const planMarks = { ...x.planMarks, [date]: day }
    return { ...x, ...stampPrefs(), planMarks, studyDays: mark === 'done' && !x.studyDays.includes(todayStr()) ? [...x.studyDays, todayStr()].sort() : x.studyDays }
  }), [update])
  const saveDraft = useCallback((themeId: string, text: string) => update(x => { const d = { ...x.essayDrafts }; if (text.trim()) d[themeId] = text; else delete d[themeId]; return { ...x, ...stampPrefs(), essayDrafts: d } }), [update])
  const saveEssay = useCallback((e: Essay) => update(x => ({ ...x, essays: [...x.essays, e], studyDays: x.studyDays.includes(todayStr()) ? x.studyDays : [...x.studyDays, todayStr()].sort() })), [update])
  const deleteEssay = useCallback((id: string) => update(x => ({ ...x, essays: x.essays.filter(e => e.id !== id), essaysDeleted: [...new Set([...x.essaysDeleted, id])].sort() })), [update])
  const setLast = useCallback((id: string) => update(x => (x.lastLessonId === id ? x : { ...x, lastLessonId: id })), [update])
  const toggleDark = () => update(x => ({ ...x, dark: !x.dark }))
  const dismiss = (id: string) => setToasts(t => t.filter(x => x.id !== id))
  const getState = useCallback(() => ref.current, [])
  return { p, toasts, dismiss, answer, complete, rate, finishReview, saveNote, toggleFav, setXp, resetXp, replaceAll, reset, setLast, toggleDark, startMock, patchMock, abandonMock, finishMock, createPlan, recalcPlan, clearPlan, markBlock, saveDraft, saveEssay, deleteEssay, mergeRemote, clearLocal, toast, getState, saveStudy, deleteStudy, setMark, submitAssessment, setMastery, resetMastery }
}
export type Store = ReturnType<typeof useProgress>
export type { DayStats }
