import type { Question } from '../types'
import { RAW_QUESTIONS } from './questions-raw'
import { AUDIT } from './audit'
import { applyRevisions } from './revisions'
// Fase 4: o status de catálogo vem do registro de auditoria (src/data/audit.ts). Sobrescritas por conta (content.validations) continuam valendo.
export const QUESTIONS: Question[] = RAW_QUESTIONS.map(q => ({ ...applyRevisions(q), validation: AUDIT[q.id]?.proposed ?? q.validation ?? 'pendente' }))
