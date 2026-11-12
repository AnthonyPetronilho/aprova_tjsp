// Questões que podem entrar em NOVAS atividades (simulados, banco, aulas): fora as substituídas (Fase 4/5), as arquivadas e as com erro confirmado.
// Respostas antigas continuam preservadas: o histórico procura a questão por ID em QUESTIONS, que mantém todas.
import { QUESTIONS } from '../data/questions'
import { supersededIds } from '../data/revisions'
import { catalogExcluded } from './catalog'
import { validationOf } from './content'
import type { Question } from '../types'
export const isActiveQuestion = (q: Question) => !supersededIds().has(q.id) && !catalogExcluded().has(q.id) && validationOf(q.id) !== 'precisa-correcao'
export const activeQuestions = (): Question[] => QUESTIONS.filter(isActiveQuestion)
