import { QUESTIONS } from '../data/questions'
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import type { MockResult, Progress, Question } from '../types'
// Distribuição real do edital (cap. IX/Anexo VIII): 16 + 30 + 4 + 4 + 9 + 7 = 70 questões.
export const AREAS = [
  { id: 'pt', name: 'Língua Portuguesa', n: 16, block: 1, discs: ['pt'] },
  { id: 'dir', name: 'Conhecimentos em Direito', n: 30, block: 2, discs: ['dpenal', 'dpp', 'dpc', 'dconst', 'dadm', 'dint'] },
  { id: 'atual', name: 'Atualidades', n: 4, block: 3, discs: ['atual'] },
  { id: 'mat', name: 'Matemática', n: 4, block: 3, discs: ['mat'] },
  { id: 'info', name: 'Informática', n: 9, block: 3, discs: ['info'] },
  { id: 'rl', name: 'Raciocínio Lógico', n: 7, block: 3, discs: ['rl'] },
]
export const COMPLETE_LIMIT_SEC = 5 * 3600 // objetiva + redação: 5 horas
export const areaOf = (q: Question) => AREAS.find(a => a.discs.includes(topicDiscipline(q.topicId)?.id ?? ''))
export const availability = () => AREAS.map(a => ({ ...a, have: QUESTIONS.filter(q => areaOf(q)?.id === a.id).length }))
export const canStartComplete = () => availability().every(a => a.have >= a.n)
export const shuffle = <T,>(a: T[]): T[] => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] } return r }
export function pickComplete(): string[] | null {
  if (!canStartComplete()) return null
  return AREAS.flatMap(a => shuffle(QUESTIONS.filter(q => areaOf(q)?.id === a.id)).slice(0, a.n).map(q => q.id))
}
// Rápido: manual (matérias escolhidas) ou automático (prioriza erros em aberto e questões ainda não respondidas).
export function pickQuick(p: Progress, n: number, discIds: string[] | 'auto'): string[] {
  const pool = QUESTIONS.filter(q => discIds === 'auto' || discIds.includes(topicDiscipline(q.topicId)?.id ?? ''))
  const score = (q: Question) => (p.errors[q.id] && !p.errors[q.id].resolved ? 3 : 0) + (p.answers[q.id] ? 0 : 2) + Math.random() * 0.9
  return (discIds === 'auto' ? [...pool].sort((a, b) => score(b) - score(a)) : shuffle(pool)).slice(0, n).map(q => q.id)
}
export function analyze(r: MockResult) {
  const qs = r.qids.map(id => QUESTIONS.find(q => q.id === id)).filter((q): q is Question => !!q)
  const byArea = AREAS.map(a => { const l = qs.filter(q => areaOf(q)?.id === a.id), ok = l.filter(q => r.answers[q.id] === q.answer).length; return { ...a, total: l.length, correct: ok, pct: l.length ? Math.round((ok / l.length) * 100) : 0 } }).filter(a => a.total)
  const review = [...new Set(qs.filter(q => r.answers[q.id] !== q.answer).map(q => q.topicId))]
  const topicName = (id: string) => DISCIPLINES.flatMap(d => d.topics).find(t => t.id === id)?.title ?? id
  let rules: { label: string; ok: boolean }[] | null = null
  if (r.kind === 'completo') {
    const pt = byArea.find(a => a.id === 'pt'), dir = byArea.find(a => a.id === 'dir')
    rules = [{ label: 'Bloco I (Língua Portuguesa): mínimo de 50% de acertos', ok: !!pt && pt.correct * 2 >= pt.total }, { label: 'Bloco II (Direito): mínimo de 50% de acertos', ok: !!dir && dir.correct * 2 >= dir.total }, { label: 'Nota geral mínima de 5,0 nos 3 blocos', ok: r.score >= 5 }]
  }
  return { qs, byArea, review: review.map(topicName), rules }
}
export const fmtClock = (sec: number) => { const s = Math.max(0, Math.floor(sec)); return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }
