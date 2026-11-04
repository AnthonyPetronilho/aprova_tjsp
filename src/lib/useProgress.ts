import { useCallback, useEffect, useState } from 'react'
import type { OptId, Progress } from '../types'
import { XP } from '../config'
const KEY = 'aprova-tjsp:v1'
export const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const empty: Progress = { xp: 0, completed: {}, answers: {}, studyDays: [], bonusDays: [], dark: false }
// Camada de persistência isolada: trocar por chamadas à API (Express/MongoDB) no futuro.
const load = (): Progress => { try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return empty } }
const save = (p: Progress) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* localStorage indisponível (ex.: sandbox) */ } }
export function missions(p: Progress) {
  const t = todayStr(), ans = Object.values(p.answers).filter(a => a.at === t)
  return [
    { label: 'Concluir uma aula', done: Object.values(p.completed).includes(t) },
    { label: 'Responder 5 questões', done: ans.length >= 5 },
    { label: 'Acertar 3 questões', done: ans.filter(a => a.correct).length >= 3 },
  ]
}
export function streak(days: string[]) {
  const s = new Set(days); const d = new Date(); let n = 0
  const f = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
  if (!s.has(f(d))) d.setDate(d.getDate() - 1)
  while (s.has(f(d))) { n++; d.setDate(d.getDate() - 1) }
  return n
}
export function useProgress() {
  const [p, setP] = useState<Progress>(load)
  useEffect(() => { save(p); document.documentElement.classList.toggle('dark', p.dark) }, [p])
  useEffect(() => { // bônus diário (+50 XP, uma vez por dia) quando todas as missões reais foram cumpridas
    const t = todayStr()
    if (missions(p).every(m => m.done) && !p.bonusDays.includes(t)) setP(x => ({ ...x, xp: x.xp + XP.dailyMission, bonusDays: [...x.bonusDays, t] }))
  }, [p])
  const day = (x: Progress) => (x.studyDays.includes(todayStr()) ? x.studyDays : [...x.studyDays, todayStr()])
  const answer = useCallback((qid: string, chosen: OptId, correct: boolean) => setP(x => {
    const first = correct && !x.answers[qid]?.everCorrect
    return { ...x, xp: x.xp + (first ? XP.question : 0), studyDays: day(x), answers: { ...x.answers, [qid]: { chosen, correct, everCorrect: !!x.answers[qid]?.everCorrect || correct, at: todayStr() } } }
  }), [])
  const complete = useCallback((id: string) => setP(x => x.completed[id] ? x : { ...x, xp: x.xp + XP.lesson, studyDays: day(x), lastLessonId: id, completed: { ...x.completed, [id]: todayStr() } }), [])
  const setLast = useCallback((id: string) => setP(x => ({ ...x, lastLessonId: id })), [])
  const toggleDark = () => setP(x => ({ ...x, dark: !x.dark }))
  return { p, answer, complete, setLast, toggleDark }
}
