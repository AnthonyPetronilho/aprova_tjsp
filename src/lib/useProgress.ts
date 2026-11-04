import { useCallback, useEffect, useRef, useState } from 'react'
import type { DayStats, OptId, Progress, Rating, XpSettings } from '../types'
import { DEFAULT_XP } from '../config'
import { FLASHCARDS, errCardId } from '../data/cards'
import { newCard, schedule } from './srs'
import { todayStr } from './dates'
import { achievements, levelInfo } from './gamification'
import { buildMissions, emptyDay, missionDone } from './missions'
export { todayStr }
const KEY = 'aprova-tjsp:v1'
const empty: Progress = { xp: 0, completed: {}, answers: {}, studyDays: [], bonusDays: [], dark: false, cards: {}, errors: {}, favorites: [], reviewLog: [], reviewXpDays: [], notes: {}, achievements: {}, correctStreak: 0, bestCorrectStreak: 0, totalAnswered: 0, daily: {}, settings: { xp: { ...DEFAULT_XP } }, levelSeen: 0 }
// Aceita dados de qualquer fase anterior (campos ausentes recebem padrões) e reconstrói as estatísticas de hoje.
export function normalize(raw: unknown): Progress {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Progress>, t = todayStr()
  const p: Progress = { ...empty, ...r, settings: { xp: { ...DEFAULT_XP, ...(r.settings?.xp ?? {}) } } }
  if (r.totalAnswered === undefined) p.totalAnswered = Object.keys(p.answers).length
  if (!r.daily) {
    const ans = Object.entries(p.answers).filter(([, a]) => a.at === t)
    p.daily = { [t]: { ...emptyDay(), qids: ans.map(([q]) => q), correctQids: ans.filter(([, a]) => a.correct).map(([q]) => q), lessons: Object.values(p.completed).filter(d => d === t).length, reviews: p.reviewLog.filter(l => l.at === t).length } }
  }
  return p
}
// Camada de persistência isolada: trocar por chamadas à API (Express/MongoDB) no futuro.
const load = (): Progress => { try { return normalize(JSON.parse(localStorage.getItem(KEY) || '{}')) } catch { return normalize({}) } }
const save = (p: Progress) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* localStorage indisponível */ } }
function migrate(p: Progress): Progress { // cards de aulas concluídas e erros antigos (Fase 1 → 2)
  const t = todayStr(); let cards = p.cards, errors = p.errors, ch = false
  const touch = () => { if (!ch) { cards = { ...cards }; errors = { ...errors }; ch = true } }
  for (const lid of Object.keys(p.completed)) for (const c of FLASHCARDS) if (c.lessonId === lid && !cards[c.id]) { touch(); cards[c.id] = newCard(t) }
  for (const [qid, a] of Object.entries(p.answers)) if (!a.correct && !errors[qid]) { touch(); errors[qid] = { count: 1, lastAt: a.at, resolved: false }; if (!cards[errCardId(qid)]) cards[errCardId(qid)] = newCard(t) }
  return ch ? { ...p, cards, errors } : p
}
// Soma XP e atualiza as estatísticas do dia; `study` marca o dia como estudado.
function bump(x: Progress, f: (d: DayStats) => DayStats, xp = 0, study = true): Progress {
  const t = todayStr(), d = f(x.daily[t] ?? emptyDay())
  return { ...x, xp: x.xp + xp, daily: { ...x.daily, [t]: { ...d, xp: d.xp + xp } }, studyDays: study && !x.studyDays.includes(t) ? [...x.studyDays, t] : x.studyDays }
}
const uniq = (a: string[], v: string) => (a.includes(v) ? a : [...a, v])
export interface Toast { id: string; text: string }
export function useProgress() {
  const [p, setP] = useState<Progress>(() => migrate(load()))
  const [toasts, setToasts] = useState<Toast[]>([]), seen = useRef(new Set<string>())
  const toast = useCallback((id: string, text: string) => { if (seen.current.has(id)) return; seen.current.add(id); setToasts(t => [...t, { id, text }]); window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 6000) }, [])
  useEffect(() => { save(p); document.documentElement.classList.toggle('dark', p.dark) }, [p])
  useEffect(() => { // missões do dia, bônus, conquistas e nível: tudo derivado de atividades reais
    const t = todayStr(); let n = migrate(p); const ev: [string, string][] = []
    if (n.missionsToday?.day !== t) n = { ...n, missionsToday: { day: t, list: buildMissions(n, t) } }
    const list = n.missionsToday?.list ?? [], day = n.daily[t]
    if (list.length && list.every(m => missionDone(m, day)) && !n.bonusDays.includes(t)) {
      n = bump({ ...n, bonusDays: [...n.bonusDays, t] }, d => d, n.settings.xp.dailyMission, false); ev.push([`bonus-${t}`, `🎯 Missões do dia completas! +${n.settings.xp.dailyMission} XP`])
    }
    for (const a of achievements(n)) if (a.ok && !n.achievements[a.id]) { n = { ...n, achievements: { ...n.achievements, [a.id]: t } }; ev.push([`ach-${a.id}`, `🏆 Conquista desbloqueada: ${a.name}`]) }
    const lv = levelInfo(n.xp)
    if (lv.index > n.levelSeen) { if (n.levelSeen > 0) ev.push([`lv-${lv.index}`, `⬆️ Nível ${lv.index}: ${lv.title}`]); n = { ...n, levelSeen: lv.index } }
    if (n !== p) { setP(n); ev.forEach(([id, text]) => toast(id, text)) }
  }, [p, toast])
  useEffect(() => { // tempo ativo de estudo: conta 15 s por intervalo se a aba está visível e houve interação no último minuto
    let last = Date.now(); const mark = () => { last = Date.now() }, evs = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    evs.forEach(e => window.addEventListener(e, mark, { passive: true }))
    const id = window.setInterval(() => { if (document.visibilityState === 'visible' && Date.now() - last < 60000) setP(x => bump(x, d => ({ ...d, seconds: d.seconds + 15 }), 0, false)) }, 15000)
    return () => { evs.forEach(e => window.removeEventListener(e, mark)); window.clearInterval(id) }
  }, [])
  const answer = useCallback((qid: string, chosen: OptId, correct: boolean) => setP(x => {
    const t = todayStr(), prev = x.answers[qid], first = correct && !prev?.everCorrect, wasOpen = !!x.errors[qid] && !x.errors[qid].resolved
    let errors = x.errors, cards = x.cards
    if (!correct) {
      errors = { ...errors, [qid]: { count: (x.errors[qid]?.count ?? 0) + 1, lastAt: t, resolved: false } }
      if (!cards[errCardId(qid)]) cards = { ...cards, [errCardId(qid)]: newCard(t) }
    } else if (x.errors[qid]) errors = { ...errors, [qid]: { ...x.errors[qid], resolved: true } }
    const newToday = !(x.daily[t]?.qids ?? []).includes(qid)
    return bump({ ...x, errors, cards, correctStreak: correct ? x.correctStreak + (first ? 1 : 0) : 0, bestCorrectStreak: Math.max(x.bestCorrectStreak, correct && first ? x.correctStreak + 1 : 0), totalAnswered: x.totalAnswered + (newToday ? 1 : 0), answers: { ...x.answers, [qid]: { chosen, correct, everCorrect: !!prev?.everCorrect || correct, at: t } } },
      d => ({ ...d, qids: uniq(d.qids, qid), correctQids: correct ? uniq(d.correctQids, qid) : d.correctQids, resolved: d.resolved + (correct && wasOpen ? 1 : 0) }), first ? x.settings.xp.question : 0)
  }), [])
  const complete = useCallback((id: string) => setP(x => {
    if (x.completed[id]) return x
    const t = todayStr(), cards = { ...x.cards }
    for (const c of FLASHCARDS) if (c.lessonId === id && !cards[c.id]) cards[c.id] = newCard(t)
    return bump({ ...x, cards, lastLessonId: id, completed: { ...x.completed, [id]: t } }, d => ({ ...d, lessons: d.lessons + 1 }), x.settings.xp.lesson)
  }), [])
  const rate = useCallback((cardId: string, r: Rating) => setP(x => {
    const t = todayStr(), cur = x.cards[cardId]; if (!cur) return x
    return bump({ ...x, cards: { ...x.cards, [cardId]: schedule(cur, r, t) }, reviewLog: [...x.reviewLog, { at: t, rating: r }].slice(-500) }, d => ({ ...d, reviews: d.reviews + 1 }))
  }), [])
  // XP de revisão: 1x por dia, ao concluir uma sessão (evita farmar XP repetindo sessões).
  const finishReview = useCallback(() => setP(x => { const t = todayStr(); return x.reviewXpDays.includes(t) ? x : bump({ ...x, reviewXpDays: [...x.reviewXpDays, t] }, d => d, x.settings.xp.review, false) }), [])
  const saveNote = useCallback((key: string, text: string) => setP(x => {
    const notes = { ...x.notes }; const v = text.slice(0, 2000)
    if (v.trim()) notes[key] = { text: v, updatedAt: todayStr() }; else delete notes[key]
    return { ...x, notes }
  }), [])
  const toggleFav = useCallback((qid: string) => setP(x => ({ ...x, favorites: x.favorites.includes(qid) ? x.favorites.filter(i => i !== qid) : [...x.favorites, qid] })), [])
  const setXp = useCallback((k: keyof XpSettings, v: number) => setP(x => ({ ...x, settings: { xp: { ...x.settings.xp, [k]: Math.max(0, Math.min(1000, Math.round(v) || 0)) } } })), [])
  const resetXp = useCallback(() => setP(x => ({ ...x, settings: { xp: { ...DEFAULT_XP } } })), [])
  const replaceAll = useCallback((raw: unknown) => { const r = raw as Partial<Progress> | null; if (!r || typeof r !== 'object' || typeof r.xp !== 'number' || typeof r.completed !== 'object' || typeof r.answers !== 'object') return false; seen.current.clear(); setP(migrate(normalize(raw))); return true }, [])
  const reset = useCallback(() => { seen.current.clear(); setP(migrate(normalize({}))) }, [])
  const setLast = useCallback((id: string) => setP(x => ({ ...x, lastLessonId: id })), [])
  const toggleDark = () => setP(x => ({ ...x, dark: !x.dark }))
  const dismiss = (id: string) => setToasts(t => t.filter(x => x.id !== id))
  return { p, toasts, dismiss, answer, complete, rate, finishReview, saveNote, toggleFav, setXp, resetXp, replaceAll, reset, setLast, toggleDark }
}
export type Store = ReturnType<typeof useProgress>
