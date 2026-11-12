// Fase 5 — gera server/data/catalog-seed.json: índice mínimo do catálogo embutido (ids, assunto, status de auditoria).
// O servidor usa este índice para validar edições (assuntos/IDs válidos) e para a importação idempotente. NÃO contém o texto das questões.
import { writeFileSync } from 'node:fs'
import { QUESTIONS } from '../src/data/questions'
import { LESSONS } from '../src/data/lessons'
import { FLASHCARDS } from '../src/data/cards'
import { DISCIPLINES } from '../src/data/edital'
import { supersededIds, REVISIONS } from '../src/data/revisions'
export const buildSeed = () => {
  void supersededIds
  return {
    schema: 1,
    topics: DISCIPLINES.flatMap(d => d.topics.map(t => t.id)),
    questions: QUESTIONS.map(q => ({ id: q.id, topicId: q.topicId, validation: q.validation ?? 'pendente', supersededBy: REVISIONS.find(r => r.id === q.id && r.kind === 'substituicao')?.supersededBy ?? null })),
    lessons: LESSONS.map(l => ({ id: l.id, topicId: l.topicId })),
    cards: FLASHCARDS.map(c => ({ id: c.id, topicId: c.topicId, lessonId: c.lessonId ?? null })),
  }
}
if (process.argv[1]?.endsWith('export-seed.ts')) { const s = buildSeed(); writeFileSync('server/data/catalog-seed.json', JSON.stringify(s)); console.log(s.questions.length, s.lessons.length, s.cards.length) }
