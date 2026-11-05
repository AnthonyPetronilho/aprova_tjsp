import { QUESTIONS } from '../../src/data/questions'
import { LESSONS } from '../../src/data/lessons'
import { FLASHCARDS } from '../../src/data/cards'
import { DISCIPLINES } from '../../src/data/edital'
const bad = (m: string) => { console.error('FALHA:', m); throw new Error(m) }
const topics = new Set(DISCIPLINES.flatMap(d => d.topics.map(t => t.id)))
const ids = QUESTIONS.map(q => q.id); if (new Set(ids).size !== ids.length) bad('ids de questão duplicados')
for (const q of QUESTIONS) {
  if (q.options.map(o => o.id).join('') !== 'ABCDE') bad(`${q.id}: alternativas não são A–E`)
  if (!q.options.some(o => o.id === q.answer)) bad(`${q.id}: gabarito inexistente`)
  if (q.options.some(o => !o.why.trim() || !o.text.trim())) bad(`${q.id}: alternativa sem texto/justificativa`)
  if (!topics.has(q.topicId)) bad(`${q.id}: tópico inexistente ${q.topicId}`)
  if (new Set(q.options.map(o => o.text)).size !== 5) bad(`${q.id}: alternativas repetidas`)
  const right = q.options.find(o => o.id === q.answer)!
  if (/^Errada/.test(right.why)) bad(`${q.id}: justificativa do gabarito diz "Errada"`)
  q.options.filter(o => o.id !== q.answer).forEach(o => { if (/^Correta:/.test(o.why)) bad(`${q.id}: alternativa errada ${o.id} justificada como "Correta:"`) })
}
const fids = FLASHCARDS.map(c => c.id); if (new Set(fids).size !== fids.length) bad('ids de flashcard duplicados')
for (const c of FLASHCARDS) { if (!topics.has(c.topicId)) bad(`card ${c.id}: tópico inexistente`); if (c.lessonId && !LESSONS.some(l => l.id === c.lessonId)) bad(`card ${c.id}: aula inexistente`) }
for (const l of LESSONS) {
  if (!topics.has(l.topicId)) bad(`aula ${l.id}: tópico inexistente`)
  if (l.questionIds.length < 3 || l.questionIds.length > 5) bad(`aula ${l.id}: precisa de 3 a 5 questões`)
  for (const id of l.questionIds) { const q = QUESTIONS.find(x => x.id === id); if (!q) bad(`aula ${l.id}: questão ${id} não existe`); else if (q.topicId !== l.topicId) bad(`questão ${id} com tópico diferente da aula`) }
  if (!FLASHCARDS.some(c => c.lessonId === l.id)) bad(`aula ${l.id}: sem flashcards`)
}
// o Direito Penal dividido deve ter exatamente os mesmos intervalos do edital
const pen = DISCIPLINES.find(d => d.id === 'dpenal')!.topics.map(t => t.title).join(' | ')
console.log(pen)
console.log('respostas:', QUESTIONS.map(q => q.answer).join(''), '· questões:', QUESTIONS.length, '· cards:', FLASHCARDS.length, '· aulas:', LESSONS.length)
console.log('DADOS OK')

import { it } from 'vitest'
it('script legado: data executa sem falhas', () => {})
