import { LESSONS } from '../data/lessons'
import type { Progress } from '../types'
// Aula sugerida: a última aberta (se ainda não concluída), senão a primeira pendente, senão a última estudada.
export function suggestLesson(p: Progress): string {
  const last = LESSONS.find(l => l.id === p.lastLessonId)
  if (last && !p.completed[last.id]) return last.id
  return (LESSONS.find(l => !p.completed[l.id]) ?? last ?? LESSONS[0]).id
}
