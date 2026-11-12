// Cliente da API administrativa (Fase 5). Toda autorização é feita no SERVIDOR; este módulo apenas chama as rotas.
import { api, ApiError } from '../../lib/sync'
import type { Lesson, Flashcard, Question, Validation } from '../../types'
export type Pub = 'rascunho' | 'em-revisao' | 'publicada' | 'arquivada'
export interface Draft<T = unknown> { data: T; state: 'rascunho' | 'em-revisao'; by: string; at: string; reason: string }
export interface EdItem {
  kind: 'question' | 'lesson' | 'card'; id: string; rev: number; origin: 'catalogo' | 'admin'; pub: Pub; estado: Pub
  live: unknown; draft: Draft | null; validation: Validation | null; validationSource: string | null; validationNote?: string; validationRef?: string | null; validationBy?: string; validationAt?: string
  supersededBy: string | null; replaces: string | null; baseTopic?: string; baseLesson?: string | null; createdAt: string; updatedAt: string; updatedBy: string
}
export interface HistEntry { kind: string; id: string; rev: number; at: string; by: string; type: string; reason: string; before: unknown; after: { pub: Pub; validation: Validation | null; live: unknown; draft: Draft | null; supersededBy: string | null }; refs: string | null; review?: { kind: string; label: string; validation: Validation; note: string; reference: string | null } }
export interface Overview { catalogRev: number; totals: Record<string, number>; validation: Record<string, number>; publication: Record<string, Record<string, number>>; humanReviewed: number; recent: HistEntry[] }
export type QuestionData = Pick<Question, 'topicId' | 'stem' | 'options' | 'answer' | 'difficulty'> & { ref?: string }
export type LessonData = Pick<Lesson, 'topicId' | 'title' | 'steps' | 'questionIds'>
export type CardData = Pick<Flashcard, 'topicId' | 'front' | 'back'> & { lessonId: string }
export class Conflict extends Error { constructor(public current: EdItem | null) { super('Outro administrador alterou este conteúdo depois que você o abriu. Nada foi sobrescrito.') } }
export class Invalid extends Error { constructor(m: string, public details: string[]) { super(m) } }
async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  try { return await api(method, path, body) as T }
  catch (e) {
    if (e instanceof ApiError) {
      const b = (e.body ?? {}) as { current?: EdItem; details?: string[] }
      if (e.status === 409 && b.current) throw new Conflict(b.current)
      if (e.status === 422 && b.details) throw new Invalid(e.message, b.details)
    }
    throw e
  }
}
export const newKey = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID().replace(/-/g, '') : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`)
export const adm = {
  overview: () => call<Overview>('GET', '/api/admin/overview'),
  items: () => call<{ catalogRev: number; items: EdItem[] }>('GET', '/api/admin/items'),
  item: (kind: string, id: string) => call<{ item: EdItem; history: HistEntry[] }>('GET', `/api/admin/items/${kind}/${id}`),
  recent: () => call<{ history: HistEntry[] }>('GET', '/api/admin/history'),
  create: (kind: string, data: unknown, reason: string, clientKey = newKey()) => call<{ item: EdItem; duplicate?: boolean }>('POST', `/api/admin/items/${kind}`, { clientKey, reason, data }),
  saveDraft: (it: EdItem, data: unknown, reason: string) => call<{ item: EdItem }>('PUT', `/api/admin/items/${it.kind}/${it.id}/draft`, { baseRev: it.rev, reason, data }),
  discard: (it: EdItem, reason: string) => call<{ item: EdItem }>('DELETE', `/api/admin/items/${it.kind}/${it.id}/draft`, { baseRev: it.rev, reason }),
  setState: (it: EdItem, to: Pub, reason: string, extra: { confirmReviewed?: boolean; keepValidation?: boolean } = {}) => call<{ item: EdItem }>('POST', `/api/admin/items/${it.kind}/${it.id}/state`, { baseRev: it.rev, to, reason, ...extra }),
  validate: (it: EdItem, body: { validation: Validation; reviewKind: 'administrador' | 'profissional-declarado'; note: string; reference: string }) => call<{ item: EdItem }>('POST', `/api/admin/items/question/${it.id}/validation`, { baseRev: it.rev, ...body }),
  replace: (it: EdItem, question: QuestionData, reason: string, clientKey = newKey()) => call<{ item: EdItem }>('POST', `/api/admin/items/question/${it.id}/replace`, { baseRev: it.rev, reason, clientKey, question }),
  restore: (it: EdItem, version: number, reason: string) => call<{ item: EdItem }>('POST', `/api/admin/items/${it.kind}/${it.id}/restore`, { baseRev: it.rev, version, reason }),
}
export const PUB_LABEL: Record<Pub, { t: string; cls: string }> = {
  rascunho: { t: 'Rascunho', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200' },
  'em-revisao': { t: 'Em revisão', cls: 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200' },
  publicada: { t: 'Publicada', cls: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200' },
  arquivada: { t: 'Arquivada', cls: 'bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-slate-100' },
}
export const SOURCE_LABEL: Record<string, string> = {
  'auditoria-ia': 'Auditoria por IA/ferramenta (não humana)',
  'revisao-humana-administrador': 'Revisão pessoal do administrador',
  'revisao-profissional-declarada': 'Revisão por profissional (declarada, não comprovada)',
  'reaberta-por-edicao': 'Reaberta por edição publicada',
  nenhuma: 'Sem validação registrada',
}
