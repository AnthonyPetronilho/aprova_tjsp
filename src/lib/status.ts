import { QUESTIONS } from '../data/questions'
import { LESSONS } from '../data/lessons'
import { FLASHCARDS } from '../data/cards'
import { isMastered } from './srs'
import type { Progress } from '../types'
export type StatusKey = 'none' | 'new' | 'doing' | 'studied' | 'review' | 'mastered'
export function topicStatus(p: Progress, topicId: string): { key: StatusKey; txt: string; cls: string } {
  const ls = LESSONS.filter(x => x.topicId === topicId)
  if (!ls.length) return { key: 'none', txt: 'Sem aula ainda', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700' }
  if (ls.every(l => p.completed[l.id])) {
    const st = FLASHCARDS.filter(c => c.topicId === topicId).map(c => p.cards[c.id]).filter(Boolean)
    if (st.length && st.every(isMastered)) return { key: 'mastered', txt: 'Dominado', cls: 'bg-violet-100 text-violet-700' }
    if (st.some(c => c.last)) return { key: 'review', txt: 'Em revisão', cls: 'bg-sky-100 text-sky-700' }
    return { key: 'studied', txt: 'Estudado', cls: 'bg-emerald-100 text-emerald-700' }
  }
  if (QUESTIONS.some(q => ls.some(l => l.questionIds.includes(q.id)) && p.answers[q.id])) return { key: 'doing', txt: 'Em andamento', cls: 'bg-amber-100 text-amber-700' }
  return { key: 'new', txt: 'Não iniciado', cls: 'bg-indigo-100 text-indigo-700' }
}
