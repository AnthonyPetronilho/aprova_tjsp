import { LEVELS } from '../config'
import type { Progress } from '../types'
export function levelInfo(xp: number) {
  let i = 0; LEVELS.forEach((l, k) => { if (xp >= l.min) i = k })
  const next = LEVELS[i + 1]
  return { index: i + 1, title: LEVELS[i].title, pct: next ? Math.round(((xp - LEVELS[i].min) / (next.min - LEVELS[i].min)) * 100) : 100, toNext: next ? next.min - xp : 0 }
}
export const achievements = (p: Progress, streakDays: number) => [
  { name: 'Primeiros passos', desc: 'Concluir a primeira aula', ok: Object.keys(p.completed).length > 0 },
  { name: 'Disciplina de ferro', desc: 'Estudar 7 dias', ok: p.studyDays.length >= 7 || streakDays >= 7 },
  { name: 'Maratonista', desc: 'Responder 100 questões', ok: Object.keys(p.answers).length >= 100 },
]
