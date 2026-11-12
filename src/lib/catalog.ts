// Fase 5 — catálogo editorial publicado (vem do servidor). Complementa o catálogo embutido: não o substitui nem apaga nada.
// Regras: (1) só o que foi PUBLICADO chega aqui; (2) a revisão do catálogo é monotônica — uma cópia mais antiga (cache local,
// aba desatualizada, resposta atrasada) nunca substitui uma versão editorial mais recente; (3) o progresso da estudante não é lido nem escrito aqui.
import type { Lesson, Question, Flashcard, Validation, Step } from '../types'
export interface CatRow<T> { id: string; origin: 'catalogo' | 'admin'; archived?: boolean; supersededBy?: string; validation?: Validation; live?: T }
export interface QLive { topicId?: string; stem?: string; options?: Question['options']; answer?: Question['answer']; difficulty?: Question['difficulty']; ref?: string; optionWhy?: Record<string, string> }
export interface LLive { topicId: string; title: string; steps: Step[]; questionIds: string[] }
export interface CLive { topicId: string; front: string; back: string; lessonId: string }
export interface CatalogDoc { rev: number; questions: CatRow<QLive>[]; lessons: CatRow<LLive>[]; cards: CatRow<CLive>[] }
const KEY = 'aprova-tjsp:catalog:v1'
const empty = (): CatalogDoc => ({ rev: 0, questions: [], lessons: [], cards: [] })
let doc: CatalogDoc = empty(), excluded = new Set<string>(), vmap = new Map<string, Validation>()
const listeners = new Set<() => void>()
export const onCatalogChange = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f) } }
export const getCatalog = () => doc
export const catalogRev = () => doc.rev
export const catalogExcluded = (): ReadonlySet<string> => excluded
export const catalogValidation = (id: string): Validation | undefined => vmap.get(id)
const VALS = ['pendente', 'precisa-correcao', 'precisa-complementacao', 'validada']
const arr = (x: unknown) => (Array.isArray(x) ? x : [])
// aceita só o que tem a forma esperada; qualquer lixo é descartado (nunca quebra o app)
export function sanitizeCatalog(raw: unknown): CatalogDoc | null {
  const r = raw as Partial<CatalogDoc> | null
  if (!r || typeof r !== 'object' || !Number.isInteger(r.rev) || (r.rev as number) < 0) return null
  const row = <T,>(x: unknown): CatRow<T> | null => { const o = x as CatRow<T>; return o && typeof o.id === 'string' && o.id.length < 200 && (o.origin === 'catalogo' || o.origin === 'admin') ? { id: o.id, origin: o.origin, archived: o.archived === true ? true : undefined, supersededBy: typeof o.supersededBy === 'string' ? o.supersededBy : undefined, validation: VALS.includes(o.validation as string) ? o.validation : undefined, live: o.live && typeof o.live === 'object' ? o.live : undefined } : null }
  const list = <T,>(a: unknown) => arr(a).map(x => row<T>(x)).filter((x): x is CatRow<T> => !!x)
  return { rev: r.rev as number, questions: list<QLive>(r.questions), lessons: list<LLive>(r.lessons), cards: list<CLive>(r.cards) }
}
function derive() {
  excluded = new Set(); vmap = new Map()
  for (const q of doc.questions) { if (q.archived || q.supersededBy) excluded.add(q.id); if (q.validation) vmap.set(q.id, q.validation) }
}
export function loadCatalog() { try { const r = localStorage.getItem(KEY); const c = r ? sanitizeCatalog(JSON.parse(r)) : null; if (c) doc = c } catch { doc = empty() } derive() }
// Aplica uma resposta do servidor. Só avança (rev maior); mesma rev reaplica sem efeito. Devolve true se mudou.
export function applyCatalog(raw: unknown): boolean {
  const c = sanitizeCatalog(raw); if (!c || c.rev < doc.rev || (c.rev === doc.rev && doc.rev !== 0)) return false
  doc = c; derive(); try { localStorage.setItem(KEY, JSON.stringify(doc)) } catch { /* segue em memória */ }
  listeners.forEach(f => f()); return true
}
export function resetCatalogForTests() { doc = empty(); derive() }

// Aplica o catálogo publicado sobre as listas embutidas (devolve listas novas; os objetos embutidos não são alterados).
export function overlayQuestions(base: Question[]): Question[] {
  const by = new Map(doc.questions.map(r => [r.id, r]))
  const out = base.map(q => {
    const r = by.get(q.id); if (!r) return q
    let n = q
    if (r.live && r.origin === 'catalogo') n = { ...n, ...(r.live.ref ? { ref: r.live.ref } : {}), options: n.options.map(o => (r.live!.optionWhy?.[o.id] ? { ...o, why: r.live!.optionWhy![o.id] } : o)) }
    if (r.validation) n = { ...n, validation: r.validation }
    return n
  })
  const have = new Set(out.map(q => q.id))
  for (const r of doc.questions) if (r.origin === 'admin' && r.live && r.live.stem && r.live.options && r.live.answer && r.live.topicId && !have.has(r.id)) out.push({ id: r.id, topicId: r.live.topicId, stem: r.live.stem, options: r.live.options, answer: r.live.answer, difficulty: r.live.difficulty ?? 'Médio', origin: 'autoral', validation: r.validation ?? 'pendente', ...(r.live.ref ? { ref: r.live.ref } : {}) })
  return out
}
export function overlayLessons(base: Lesson[]): Lesson[] {
  const by = new Map(doc.lessons.map(r => [r.id, r])), gone = new Set(doc.lessons.filter(r => r.archived).map(r => r.id))
  const out = base.filter(l => !gone.has(l.id)).map(l => { const r = by.get(l.id); return r?.live && r.origin === 'catalogo' ? { ...l, title: r.live.title, steps: r.live.steps, questionIds: r.live.questionIds } : l })
  const have = new Set(out.map(l => l.id))
  for (const r of doc.lessons) if (r.origin === 'admin' && r.live && !r.archived && !have.has(r.id)) out.push({ id: r.id, topicId: r.live.topicId, title: r.live.title, steps: r.live.steps, questionIds: r.live.questionIds })
  return out
}
export function overlayCards(base: Flashcard[], lessonIds: Set<string>): Flashcard[] {
  const by = new Map(doc.cards.map(r => [r.id, r])), gone = new Set(doc.cards.filter(r => r.archived).map(r => r.id))
  const out = base.filter(c => !gone.has(c.id)).map(c => { const r = by.get(c.id); return r?.live && r.origin === 'catalogo' ? { ...c, front: r.live.front, back: r.live.back } : c })
  const have = new Set(out.map(c => c.id))
  for (const r of doc.cards) if (r.origin === 'admin' && r.live && !r.archived && !have.has(r.id) && lessonIds.has(r.live.lessonId)) out.push({ id: r.id, topicId: r.live.topicId, front: r.live.front, back: r.live.back, lessonId: r.live.lessonId, origin: 'aula' })
  return out
}

// Busca o catálogo publicado (requer sessão). Falha de rede/erro nunca derruba o app: continua valendo a última cópia conhecida.
export async function refreshCatalog(fetcher: (method: string, path: string) => Promise<unknown>): Promise<boolean> {
  try { return applyCatalog(await fetcher('GET', '/api/catalog')) } catch { return false }
}
