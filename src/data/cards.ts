import type { Flashcard } from '../types'
import { QUESTIONS } from './crase'
// Flashcards autorais ligados às aulas (conteúdo inédito, baseado no tópico 12 do Anexo VIII – Crase).
export const FLASHCARDS: Flashcard[] = [
  { id: 'fc-crase-1', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'O que é crase?', back: 'A fusão da preposição "a" com o artigo definido feminino "a(s)" (ou com aquele/aquela/aquilo). Ex.: Fui à escola.' },
  { id: 'fc-crase-2', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Como funciona o teste do "ao" para a crase?', back: 'Troque a palavra feminina por uma masculina. Se surgir "ao", há crase no feminino. Ex.: "ao chefe" → "à chefe".' },
  { id: 'fc-crase-3', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Há crase na indicação de horas? Dê um exemplo.', back: 'Sim. Ex.: "Chegamos às 14 horas."' },
  { id: 'fc-crase-4', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Pode haver crase antes de verbo ou de pronome pessoal (ela, você)?', back: 'Não. Ex.: "a partir de hoje"; "entreguei a ela"; "revelou a você".' },
  { id: 'fc-crase-5', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Teste do "da": como saber se há crase antes de nome de lugar?', back: 'Se "volto DA" → há crase ("Vou à Bahia"). Se "volto DE" → não há ("Vou a Roma").' },
  { id: 'fc-crase-6', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Há crase em expressões com palavra repetida (ex.: frente a frente)?', back: 'Não. Ex.: "frente a frente", "cara a cara", "gota a gota".' },
  { id: 'fc-crase-7', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Quando a crase é facultativa?', back: 'Antes de pronome possessivo feminino singular e de nome próprio feminino de pessoa. Ex.: "Entreguei a/à Maria."' },
]
export const errCardId = (qid: string) => `err-${qid}`
// Cards de erro são derivados da questão errada (não duplicam texto no armazenamento).
export function cardById(id: string): Flashcard | undefined {
  if (id.startsWith('err-')) {
    const q = QUESTIONS.find(x => x.id === id.slice(4)); if (!q) return undefined
    const ok = q.options.find(o => o.id === q.answer)!
    return { id, topicId: q.topicId, origin: 'erro', front: `Você errou esta questão. Qual é a alternativa correta?\n\n${q.stem}`, back: `Gabarito: ${ok.id}) ${ok.text}\n${ok.why}` }
  }
  return FLASHCARDS.find(c => c.id === id)
}
