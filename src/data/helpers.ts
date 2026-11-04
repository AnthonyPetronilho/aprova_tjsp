import type { Flashcard, Lesson, Question } from '../types'
export const o = (id: Question['options'][0]['id'], text: string, why: string) => ({ id, text, why })
export const mkQ = (prefix: string, topicId: string) => (n: number, stem: string, options: Question['options'], answer: Question['answer'], difficulty: Question['difficulty']): Question => ({ id: `${prefix}-${n}`, topicId, stem, options, answer, difficulty, origin: 'inedita-ia' })
// Gira as alternativas (sem embaralhar a ordem relativa) para o gabarito não ficar sempre em C/D. Só em questões não numéricas.
export const place = (q: Question, target: Question['answer']): Question => {
  const idx = q.options.findIndex(x => x.id === q.answer), k = (target.charCodeAt(0) - 65 - idx + 5) % 5, old = q.options
  return { ...q, answer: target, options: old.map((_, i) => ({ ...old[(i - k + 5) % 5], id: String.fromCharCode(65 + i) as Question['answer'] })) }
}
export const mkC = (prefix: string, topicId: string, lessonId: string) => (n: number, front: string, back: string): Flashcard => ({ id: `fc-${prefix}-${n}`, topicId, lessonId, origin: 'aula', front, back })

// Distribui o gabarito de forma uniforme entre A–E (ciclos de 5), girando as alternativas. Usado em questões numéricas, cuja ordem natural é crescente.
export const spread = (qs: Question[], offset = 0): Question[] => qs.map((q, i) => place(q, 'ABCDE'[(i * 3 + offset) % 5] as Question['answer']))
export const step = (title: string, body: string[], alt?: string, table?: Lesson['steps'][0]['table']) => ({ title, body, alt, table })
// Questão com a alternativa certa na posição C; o spread() depois gira o gabarito. wrongs = [texto, motivo] (o prefixo "Errada:" é automático).
export type W = [string, string]
export const mkW = (prefix: string, topicId: string) => {
  const m = mkQ(prefix, topicId)
  return (n: number, stem: string, right: W, wrongs: [W, W, W, W], d: Question['difficulty']): Question =>
    m(n, stem, [o('A', wrongs[0][0], 'Errada: ' + wrongs[0][1]), o('B', wrongs[1][0], 'Errada: ' + wrongs[1][1]), o('C', right[0], 'Correta: ' + right[1]), o('D', wrongs[2][0], 'Errada: ' + wrongs[2][1]), o('E', wrongs[3][0], 'Errada: ' + wrongs[3][1])], 'C', d)
}
export const qids = (p: string) => [1, 2, 3, 4, 5].map(n => `${p}-${n}`)
