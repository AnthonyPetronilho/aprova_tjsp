import { useCallback, useEffect, useState } from 'react'
import type { OptId, Progress, Rating } from '../types'
import { XP } from '../config'
import { FLASHCARDS, errCardId } from '../data/cards'
import { newCard, schedule } from './srs'
import { todayStr } from './dates'
export { todayStr }
const KEY = 'aprova-tjsp:v1'
const empty: Progress = { xp: 0, completed: {}, answers: {}, studyDays: [], bonusDays: [], dark: false, cards: {}, errors: {}, favorites: [], reviewLog: [], reviewXpDays: [] }
// Camada de persistência isolada: trocar por chamadas à API (Express/MongoDB) no futuro.
const load = (): Progress => { try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return empty } }
const save = (p: Progress) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* localStorage indisponível */ } }
// Compatibilidade com dados salvos pela Fase 1: cria flashcards de aulas já concluídas e registra erros antigos.
function migrate(p: Progress): Progress {
  const t = todayStr(); let cards = p.cards, errors = p.errors, ch = false
  const touch = () => { if (!ch) { cards = { ...cards }; errors = { ...errors }; ch = true } }
  for (const lid of Object.keys(p.completed)) for (const c of FLASHCARDS) if (c.lessonId === lid && !cards[c.id]) { touch(); cards[c.id] = newCard(t) }
  for (const [qid, a] of Object.entries(p.answers)) if (!a.correct && !errors[qid]) { touch(); errors[qid] = { count: 1, lastAt: a.at, resolved: false }; if (!cards[errCardId(qid)]) cards[errCardId(qid)] = newCard(t) }
  return ch ? { ...p, cards, errors } : p
}
export function missions(p: Progress) {
  const t = todayStr(), ans = Object.values(p.answers).filter(a => a.at === t)
  const list = [
    { label: 'Concluir uma aula', done: Object.values(p.completed).includes(t) },
    { label: 'Responder 5 questões', done: ans.length >= 5 },
    { label: 'Acertar 3 questões', done: ans.filter(a => a.correct).length >= 3 },
  ]
  const deck = Object.keys(p.cards).length
  if (deck > 0) list.push({ label: `Revisar ${Math.min(5, deck)} flashcard(s)`, done: p.reviewLog.filter(r => r.at === t).length >= Math.min(5, deck) })
  return list
}
export function streak(days: string[]) {
  const s = new Set(days); const d = new Date(); let n = 0
  const f = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
  if (!s.has(f(d))) d.setDate(d.getDate() - 1)
  while (s.has(f(d))) { n++; d.setDate(d.getDate() - 1) }
  return n
}
export function useProgress() {
  const [p, setP] = useState<Progress>(() => migrate(load()))
  useEffect(() => { save(p); document.documentElement.classList.toggle('dark', p.dark) }, [p])
  useEffect(() => { const m = migrate(p); if (m !== p) setP(m) }, [p])
  useEffect(() => { // bônus diário (+50 XP, 1x/dia) quando todas as missões reais foram cumpridas
    const t = todayStr()
    if (missions(p).every(m => m.done) && !p.bonusDays.includes(t)) setP(x => ({ ...x, xp: x.xp + XP.dailyMission, bonusDays: [...x.bonusDays, t] }))
  }, [p])
  const day = (x: Progress) => (x.studyDays.includes(todayStr()) ? x.studyDays : [...x.studyDays, todayStr()])
  const answer = useCallback((qid: string, chosen: OptId, correct: boolean) => setP(x => {
    const t = todayStr(), prev = x.answers[qid], first = correct && !prev?.everCorrect
    let errors = x.errors, cards = x.cards
    if (!correct) {
      const e = x.errors[qid]; errors = { ...errors, [qid]: { count: (e?.count ?? 0) + 1, lastAt: t, resolved: false } }
      if (!cards[errCardId(qid)]) cards = { ...cards, [errCardId(qid)]: newCard(t) }
    } else if (x.errors[qid]) errors = { ...errors, [qid]: { ...x.errors[qid], resolved: true } }
    return { ...x, errors, cards, xp: x.xp + (first ? XP.question : 0), studyDays: day(x), answers: { ...x.answers, [qid]: { chosen, correct, everCorrect: !!prev?.everCorrect || correct, at: t } } }
  }), [])
  const complete = useCallback((id: string) => setP(x => {
    if (x.completed[id]) return x
    const t = todayStr(), cards = { ...x.cards }
    for (const c of FLASHCARDS) if (c.lessonId === id && !cards[c.id]) cards[c.id] = newCard(t)
    return { ...x, cards, xp: x.xp + XP.lesson, studyDays: day(x), lastLessonId: id, completed: { ...x.completed, [id]: t } }
  }), [])
  const rate = useCallback((cardId: string, r: Rating) => setP(x => {
    const t = todayStr(), cur = x.cards[cardId]; if (!cur) return x
    return { ...x, cards: { ...x.cards, [cardId]: schedule(cur, r, t) }, reviewLog: [...x.reviewLog, { at: t, rating: r }].slice(-500), studyDays: day(x) }
  }), [])
  // +15 XP por dia ao concluir uma sessão de revisão (evita farmar XP repetindo sessões).
  const finishReview = useCallback(() => setP(x => { const t = todayStr(); return x.reviewXpDays.includes(t) ? x : { ...x, xp: x.xp + XP.review, reviewXpDays: [...x.reviewXpDays, t] } }), [])
  const toggleFav = useCallback((qid: string) => setP(x => ({ ...x, favorites: x.favorites.includes(qid) ? x.favorites.filter(i => i !== qid) : [...x.favorites, qid] })), [])
  const setLast = useCallback((id: string) => setP(x => ({ ...x, lastLessonId: id })), [])
  const toggleDark = () => setP(x => ({ ...x, dark: !x.dark }))
  return { p, answer, complete, rate, finishReview, toggleFav, setLast, toggleDark }
}
export type Store = ReturnType<typeof useProgress>
