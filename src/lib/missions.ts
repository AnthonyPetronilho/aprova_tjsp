import type { DayStats, Mission, Progress } from '../types'
import { QUESTIONS } from '../data/questions'
import { cardById } from '../data/cards'
import { isDue } from './srs'
import { DISCIPLINES } from '../data/edital'
import { validationOf } from './content'
import { attemptsOf, topicLearning, topicTitle } from './learning'
export const emptyDay = (): DayStats => ({ qids: [], correctQids: [], lessons: 0, reviews: 0, resolved: 0, seconds: 0, xp: 0 })
export function missionProgress(m: Mission, d?: DayStats): number {
  if (!d) return 0
  switch (m.kind) {
    case 'lesson': return d.lessons
    case 'review': return d.reviews
    case 'errors': return d.resolved
    case 'questions': return d.qids.length
    case 'correct': return d.correctQids.length
    case 'time': return Math.floor(d.seconds / 60)
    case 'study': return d.study ?? 0
    case 'assess': return d.asm ?? 0
  }
}
export const missionDone = (m: Mission, d?: DayStats) => missionProgress(m, d) >= m.target
const openErrors = (p: Progress) => Object.entries(p.errors).filter(([q, e]) => !e.resolved && QUESTIONS.some(x => x.id === q)).length
// Missões geradas uma vez por dia a partir do estado real (3 a 5), para não mudarem enquanto a pessoa estuda.
export function buildMissions(p: Progress, today: string): Mission[] {
  const out: Mission[] = []
  // Método: estudar fora → registrar → validar → reforçar. As missões seguem o que está pendente nessa jornada.
  const att = attemptsOf(p), L = DISCIPLINES.flatMap(d => d.topics).map(t => topicLearning(p, t.id, { vOf: validationOf, today, attempts: att }))
  const wait = L.find(x => x.status === 'aguardando')
  if (wait) out.push({ id: 'assess', kind: 'assess', target: 1, label: `Validar o assunto: ${topicTitle(wait.topicId)}` })
  else if (!att.length || !L.some(x => x.studied)) out.push({ id: 'study', kind: 'study', target: 1, label: 'Registrar um estudo externo no Diário' })
  const due = Object.keys(p.cards).filter(id => cardById(id) && isDue(p.cards[id], today)).length
  const recent = p.reviewLog.slice(-50), retention = recent.length >= 10 ? recent.filter(r => r.rating > 0).length / recent.length : 1
  if (due > 0) { const n = Math.min(due, retention < 0.7 ? 15 : 10); out.push({ id: 'review', kind: 'review', target: n, label: `Revisar ${n} flashcard(s)` }) }
  const errs = openErrors(p)
  if (errs > 0) { const ans = Object.values(p.answers), acc = ans.length >= 5 ? ans.filter(a => a.correct).length / ans.length : 1; const n = Math.min(errs, acc < 0.6 ? 5 : 3); out.push({ id: 'errors', kind: 'errors', target: n, label: `Resolver ${n} erro(s) do Caderno de Erros` }) }
  const qn = Math.min(5, QUESTIONS.length); out.push({ id: 'questions', kind: 'questions', target: qn, label: `Responder ${qn} questões` })
  const mins = Object.entries(p.daily).filter(([d, s]) => d < today && s.seconds >= 300).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7).map(([, s]) => s.seconds / 60)
  const avg = mins.length ? mins.reduce((a, b) => a + b, 0) / mins.length : 15, tm = Math.min(60, Math.max(10, Math.round(avg / 5) * 5))
  out.push({ id: 'time', kind: 'time', target: tm, label: `Estudar por ${tm} minutos` })
  if (out.length < 3) out.push({ id: 'correct', kind: 'correct', target: Math.min(3, QUESTIONS.length), label: `Acertar ${Math.min(3, QUESTIONS.length)} questões` })
  return out.slice(0, 5)
}
