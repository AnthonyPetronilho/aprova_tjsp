// Inventário do banco de questões (Fase 4, etapa A). Uso: npx tsx tools/inventory.ts
import { QUESTIONS } from '../src/data/questions'
import { DISCIPLINES } from '../src/data/edital'
import { LESSONS } from '../src/data/lessons'
import { FLASHCARDS } from '../src/data/cards'
const topics = DISCIPLINES.flatMap(d => d.topics.map(t => ({ ...t, disc: d.id })))
const byTopic: Record<string, number> = {}; QUESTIONS.forEach(q => (byTopic[q.topicId] = (byTopic[q.topicId] ?? 0) + 1))
const ids = new Map<string, number>(); QUESTIONS.forEach(q => ids.set(q.id, (ids.get(q.id) ?? 0) + 1))
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
const stems = new Map<string, string[]>(); QUESTIONS.forEach(q => { const k = norm(q.stem); stems.set(k, [...(stems.get(k) ?? []), q.id]) })
const out = {
  questions: QUESTIONS.length, topics: topics.length, lessons: LESSONS.length, flashcards: FLASHCARDS.length,
  dupIds: [...ids].filter(([, n]) => n > 1).map(([i]) => i), dupStems: [...stems.values()].filter(v => v.length > 1),
  badTopic: QUESTIONS.filter(q => !topics.some(t => t.id === q.topicId)).map(q => q.id),
  optionsNot5or4: QUESTIONS.filter(q => ![4, 5].includes(q.options.length)).map(q => [q.id, q.options.length]),
  answerMissing: QUESTIONS.filter(q => !q.options.some(o => o.id === q.answer)).map(q => q.id),
  origin: QUESTIONS.reduce((a: Record<string, number>, q) => ((a[q.origin] = (a[q.origin] ?? 0) + 1), a), {}),
  validationField: QUESTIONS.filter(q => q.validation).length,
  noWhy: QUESTIONS.filter(q => q.options.some(o => !o.why || o.why.length < 15)).length,
  perDisc: DISCIPLINES.map(d => [d.id, d.name, d.topics.length, d.topics.reduce((n, t) => n + (byTopic[t.id] ?? 0), 0)]),
  perTopic: topics.map(t => [t.id, byTopic[t.id] ?? 0]),
  topicsGE10: topics.filter(t => (byTopic[t.id] ?? 0) >= 10).length, topicsLT5: topics.filter(t => (byTopic[t.id] ?? 0) < 5).map(t => t.id),
  answerDist: QUESTIONS.reduce((a: Record<string, number>, q) => ((a[q.answer] = (a[q.answer] ?? 0) + 1), a), {}),
  lessonsQuestionIdsMissing: LESSONS.flatMap(l => l.questionIds.filter(i => !ids.has(i)).map(i => [l.id, i])),
}
console.log(JSON.stringify(out, null, 1))
