import type { Question } from '../types'
import { CRASE_QUESTIONS } from './crase'
import { PECULATO_QUESTIONS } from './peculato'
export const QUESTIONS: Question[] = [...CRASE_QUESTIONS, ...PECULATO_QUESTIONS]
