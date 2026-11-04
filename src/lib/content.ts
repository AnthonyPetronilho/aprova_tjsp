import { useSyncExternalStore } from 'react'
import type { Flashcard, Lesson, Question, Video } from '../types'
import { LESSONS } from '../data/lessons'
import { QUESTIONS } from '../data/questions'
import { FLASHCARDS } from '../data/cards'
import { DISCIPLINES } from '../data/edital'
import { parseVideo } from './video'

// Conteúdo embutido (somente leitura) + conteúdo do editor (localStorage). Os arrays LESSONS/QUESTIONS/FLASHCARDS
// continuam sendo os mesmos objetos usados pelo app inteiro; aqui eles são reconstruídos no lugar (embutido + publicados).
export type Status = 'rascunho' | 'publicado'
export type Meta = { status: Status; reviewed: boolean; updatedAt: string }
export type CLesson = Lesson & Meta
export type CQuestion = Question & Meta
export type CCard = Flashcard & Meta
export interface ContentState { editor: boolean; lessons: CLesson[]; questions: CQuestion[]; cards: CCard[]; videos: Record<string, Video> }
const KEY = 'aprova-tjsp:content:v1'
const BUILTIN = { lessons: [...LESSONS], questions: [...QUESTIONS], cards: [...FLASHCARDS] }
export const isBuiltin = (id: string) => BUILTIN.lessons.some(l => l.id === id) || BUILTIN.questions.some(q => q.id === id) || BUILTIN.cards.some(c => c.id === id)
const empty = (): ContentState => ({ editor: false, lessons: [], questions: [], cards: [], videos: {} })

let state: ContentState = empty(), version = 0
const subs = new Set<() => void>()
export const topicsFlat = DISCIPLINES.flatMap(d => d.topics.map(t => ({ id: t.id, title: t.title, disc: d.name })))
const topicIds = new Set(topicsFlat.map(t => t.id))

function rebuild() {
  const vids = state.videos
  LESSONS.length = 0; LESSONS.push(...BUILTIN.lessons.map(l => vids[l.id] ? { ...l, video: vids[l.id] } : l), ...state.lessons.filter(l => l.status === 'publicado'))
  QUESTIONS.length = 0; QUESTIONS.push(...BUILTIN.questions, ...state.questions.filter(q => q.status === 'publicado'))
  FLASHCARDS.length = 0; FLASHCARDS.push(...BUILTIN.cards, ...state.cards.filter(c => c.status === 'publicado'))
}
const emit = () => { version++; rebuild(); try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* sem armazenamento: segue em memória */ } subs.forEach(f => f()) }
export function sanitize(raw: unknown): ContentState | null {
  const r = raw as Partial<ContentState> | null
  if (!r || typeof r !== 'object' || !Array.isArray(r.lessons) || !Array.isArray(r.questions) || !Array.isArray(r.cards)) return null
  const okId = (x: { id?: unknown }) => typeof x?.id === 'string' && x.id.length > 0
  const clean = <T extends { id?: unknown }>(a: T[]) => a.filter(okId).filter(x => !isBuiltin(x.id as string))
  const videos: Record<string, Video> = {}
  for (const [k, v] of Object.entries(r.videos ?? {})) if (v && typeof (v as Video).url === 'string' && parseVideo((v as Video).url)) videos[k] = { url: (v as Video).url, title: typeof (v as Video).title === 'string' ? (v as Video).title : undefined }
  return { editor: !!r.editor, lessons: clean(r.lessons as CLesson[]), questions: clean(r.questions as CQuestion[]), cards: clean(r.cards as CCard[]), videos }
}
export function loadContent() {
  try { const r = localStorage.getItem(KEY); if (r) state = sanitize(JSON.parse(r)) ?? empty() } catch { state = empty() }
  rebuild()
}
export const getContent = () => state
export function useContent(): ContentState { useSyncExternalStore(f => { subs.add(f); return () => { subs.delete(f) } }, () => version); return state }
const now = () => new Date().toISOString()
const upsert = <T extends { id: string }>(a: T[], x: T) => a.some(y => y.id === x.id) ? a.map(y => y.id === x.id ? x : y) : [...a, x]
export const newId = (p: string) => `u-${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

export function setEditor(v: boolean) { state = { ...state, editor: v }; emit() }
export function setVideo(lessonId: string, v: Video | null) {
  const videos = { ...state.videos }
  if (v) videos[lessonId] = v; else delete videos[lessonId]
  state = { ...state, videos, lessons: state.lessons.map(l => l.id === lessonId ? { ...l, video: v ?? undefined, updatedAt: now() } : l) }; emit()
}

// ---- validação (devolve lista de problemas; vazia = pode salvar/publicar)
const blank = (s: string | undefined) => !s || !s.trim()
export function validateQuestion(q: Question): string[] {
  const e: string[] = []
  if (!topicIds.has(q.topicId)) e.push('Escolha o assunto do edital.')
  if (blank(q.stem) || q.stem.trim().length < 15) e.push('O enunciado precisa ter pelo menos 15 caracteres.')
  if (q.options.length !== 5 || q.options.map(o => o.id).join('') !== 'ABCDE') e.push('A questão precisa das alternativas A a E.')
  q.options.forEach(o => { if (blank(o.text)) e.push(`Preencha o texto da alternativa ${o.id}.`); if (blank(o.why)) e.push(`Explique por que a alternativa ${o.id} está certa ou errada.`) })
  const txt = q.options.map(o => o.text.trim().toLowerCase()).filter(Boolean); if (new Set(txt).size !== txt.length) e.push('Há alternativas com texto repetido.')
  if (!q.options.some(o => o.id === q.answer)) e.push('Marque o gabarito.')
  return e
}
export function validateCard(c: Flashcard): string[] {
  const e: string[] = []
  if (!topicIds.has(c.topicId)) e.push('Escolha o assunto do edital.')
  if (blank(c.front)) e.push('Escreva a frente (pergunta) do card.')
  if (blank(c.back)) e.push('Escreva o verso (resposta) do card.')
  if (!c.lessonId || !(state.lessons.some(l => l.id === c.lessonId) || BUILTIN.lessons.some(l => l.id === c.lessonId))) e.push('Escolha a aula do card (os cards entram na revisão quando a aula é concluída).')
  return e
}
export function validateLesson(l: Lesson): string[] {
  const e: string[] = []
  if (!topicIds.has(l.topicId)) e.push('Escolha o assunto do edital.')
  if (blank(l.title)) e.push('Dê um título à aula.')
  if (!l.steps.length) e.push('Inclua ao menos uma etapa de conteúdo.')
  l.steps.forEach((s, i) => { if (blank(s.title)) e.push(`Etapa ${i + 1}: falta o título.`); if (!s.body.some(b => !blank(b))) e.push(`Etapa ${i + 1}: escreva o texto.`) })
  if (l.video?.url && !parseVideo(l.video.url)) e.push('O link de vídeo não é um endereço https válido.')
  return e
}

type Draft<T> = T & { reviewed?: boolean }
function save<T extends { id: string }>(key: 'lessons' | 'questions' | 'cards', item: Draft<T>, publish: boolean, validate: (x: T) => string[]): string[] {
  const errs = publish ? validate(item) : []
  if (publish && !item.reviewed) errs.push('Marque “Conferi o conteúdo” antes de publicar.')
  if (errs.length) return errs
  const full = { ...item, reviewed: !!item.reviewed, status: (publish ? 'publicado' : 'rascunho') as Status, updatedAt: now() }
  state = { ...state, [key]: upsert(state[key] as { id: string }[], full) } as ContentState; emit(); return []
}
export const saveLesson = (l: Draft<Lesson>, publish: boolean) => {
  // a aula só referencia questões que existem
  l = { ...l, steps: l.steps.map(st => ({ ...st, title: st.title.trim(), body: st.body.map(b => b.trim()).filter(Boolean), alt: st.alt?.trim() || undefined })), questionIds: l.questionIds.filter(id => state.questions.some(q => q.id === id) || BUILTIN.questions.some(q => q.id === id)) }
  return save('lessons', l, publish, validateLesson)
}
export const saveQuestion = (q: Draft<Question>, publish: boolean) => save('questions', q, publish, validateQuestion)
export const saveCard = (c: Draft<Flashcard>, publish: boolean) => save('cards', c, publish, validateCard)
export function removeItem(kind: 'lessons' | 'questions' | 'cards', id: string) {
  if (isBuiltin(id)) return
  let next: ContentState = { ...state, [kind]: (state[kind] as { id: string }[]).filter(x => x.id !== id) } as ContentState
  if (kind === 'questions') next = { ...next, lessons: next.lessons.map(l => ({ ...l, questionIds: l.questionIds.filter(q => q !== id) })) }
  if (kind === 'lessons') next = { ...next, cards: next.cards.map(c => c.lessonId === id ? { ...c, status: 'rascunho' as Status, lessonId: undefined } : c) }
  state = next; emit()
}
export const exportContent = () => JSON.stringify({ app: 'aprova-tjsp-conteudo', v: 1, ...state, editor: undefined }, null, 2)
export function importContent(raw: unknown): { ok: boolean; added: number } {
  const c = sanitize(raw); if (!c) return { ok: false, added: 0 }
  let added = 0
  const merge = <T extends { id: string }>(a: T[], b: T[]) => { let out = a; for (const x of b) { if (!out.some(y => y.id === x.id)) added++; out = upsert(out, x) } return out }
  state = { ...state, lessons: merge(state.lessons, c.lessons), questions: merge(state.questions, c.questions), cards: merge(state.cards, c.cards), videos: { ...state.videos, ...c.videos } }
  emit(); return { ok: true, added }
}
export function resetContent() { state = { ...empty(), editor: state.editor }; emit() }
export const contentIsEmpty = () => !state.lessons.length && !state.questions.length && !state.cards.length && !Object.keys(state.videos).length
export function replaceContent(raw: unknown): boolean { const c = sanitize(raw); if (!c) return false; state = { ...c, editor: state.editor }; emit(); return true }
export const contentForSync = () => ({ lessons: state.lessons, questions: state.questions, cards: state.cards, videos: state.videos })
