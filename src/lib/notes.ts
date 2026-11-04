import { cardById } from '../data/cards'
import { QUESTIONS } from '../data/crase'
import { DISCIPLINES } from '../data/edital'
export const cardNoteKey = (cardId: string) => (cardId.startsWith('err-') ? `question:${cardId.slice(4)}` : `card:${cardId}`) // card de erro compartilha a anotação da questão
export const questionNoteKey = (qid: string) => `question:${qid}`
export const topicNoteKey = (tid: string) => `topic:${tid}`
export function describeNote(key: string): { kind: string; title: string } {
  const [type, ...rest] = key.split(':'), id = rest.join(':')
  if (type === 'card') return { kind: 'Flashcard', title: cardById(id)?.front ?? 'Card removido' }
  if (type === 'question') return { kind: 'Questão', title: QUESTIONS.find(q => q.id === id)?.stem ?? 'Questão removida' }
  return { kind: 'Tópico do edital', title: DISCIPLINES.flatMap(d => d.topics).find(t => t.id === id)?.title ?? 'Tópico removido' }
}
