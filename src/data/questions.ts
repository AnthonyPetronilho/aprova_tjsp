import type { Question } from '../types'
import { CRASE_QUESTIONS } from './crase'
import { PECULATO_QUESTIONS } from './peculato'
import { EXATAS_QUESTIONS } from './exatas'
import { PORT_QUESTIONS } from './portugues'
import { MAT2_QUESTIONS } from './mat2'
import { MAT3_QUESTIONS } from './mat3'
import { RL2_QUESTIONS } from './rl2'
export const QUESTIONS: Question[] = [...CRASE_QUESTIONS, ...PECULATO_QUESTIONS, ...EXATAS_QUESTIONS, ...PORT_QUESTIONS, ...MAT2_QUESTIONS, ...MAT3_QUESTIONS, ...RL2_QUESTIONS]
