// Regras da metodologia (Fase 3): Diário de Estudos, avaliações, status por assunto, critério de domínio e as três métricas.
// Tudo aqui é função pura sobre o progresso (testável sem React): estudar fora → registrar → validar → reforçar → revisar → reavaliar.
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { QUESTIONS } from '../data/questions'
import { FLASHCARDS } from '../data/cards'
import { LESSONS } from '../data/lessons'
import { addDays, todayStr } from './dates'
import type { AsmItem, AsmMode, MasteryRules, MaterialKind, Progress, Question, StudyEntry, Validation } from '../types'

export type VOf = (qid: string) => Validation
export const VALIDATION: Record<Validation, { label: string; cls: string; hint: string }> = {
  pendente: { label: 'Pendente', cls: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200', hint: 'Ainda não conferida. Serve para prática; não conta para o domínio.' },
  'precisa-correcao': { label: 'Precisa de correção', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200', hint: 'Erro confirmado. Fica fora das avaliações até ser corrigida.' },
  'precisa-complementacao': { label: 'Precisa de complementação', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200', hint: 'Sem erro confirmado, mas incompleta. Serve para prática; não conta para o domínio.' },
  validada: { label: 'Validada', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200', hint: 'Conferida. Pode compor avaliações e o domínio.' },
}
export const MATERIALS: [MaterialKind, string][] = [['videoaula', 'Videoaula'], ['apostila', 'Apostila'], ['livro', 'Livro'], ['curso', 'Curso preparatório'], ['legislacao', 'Legislação'], ['outro', 'Outro']]
export const MATERIAL_LABEL = Object.fromEntries(MATERIALS) as Record<MaterialKind, string>

// ── Diário de Estudos
export const topicExists = (id: string) => DISCIPLINES.some(d => d.topics.some(t => t.id === id))
export const topicTitle = (id: string) => DISCIPLINES.flatMap(d => d.topics).find(t => t.id === id)?.title ?? id
export interface StudyInput { id?: string; date: string; topicId: string; material: string; source: string; minutes: number; note?: string }
export function validateStudy(i: StudyInput, today = todayStr()): string | null {
  if (!topicExists(i.topicId)) return 'Escolha um assunto do edital.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(i.date) || Number.isNaN(Date.parse(i.date + 'T12:00:00'))) return 'Informe a data do estudo.'
  if (i.date > today) return 'A data do estudo não pode estar no futuro.'
  if (!MATERIALS.some(([k]) => k === i.material)) return 'Escolha o tipo de material.'
  if (!i.source.trim()) return 'Informe a fonte do material (por exemplo, o nome do curso, do livro ou da lei).'
  if (i.source.trim().length > 120) return 'A fonte pode ter até 120 caracteres.'
  if (!Number.isFinite(i.minutes) || Math.round(i.minutes) < 1 || Math.round(i.minutes) > 960) return 'Informe o tempo dedicado, de 1 a 960 minutos.'
  if ((i.note ?? '').length > 1000) return 'As observações podem ter até 1000 caracteres.'
  return null
}
// registros ativos (sem os excluídos e sem assunto inexistente), do mais recente para o mais antigo
export const entriesOf = (p: Progress): StudyEntry[] => Object.values(p.diary ?? {}).filter(e => !e.deleted && topicExists(e.topicId)).sort((a, b) => (a.date === b.date ? (a.createdAt < b.createdAt ? 1 : -1) : a.date < b.date ? 1 : -1))
export function filterEntries(list: StudyEntry[], f: { disc?: string; from?: string; to?: string }): StudyEntry[] {
  return list.filter(e => (!f.disc || e.discId === f.disc) && (!f.from || e.date >= f.from) && (!f.to || e.date <= f.to))
}
// Tempo informado manualmente (minutos) por disciplina. Fica SEPARADO do tempo ativo medido pelo app (daily[].seconds): nunca se somam.
export function minutesByDiscipline(list: StudyEntry[]): { id: string; name: string; minutes: number; count: number }[] {
  return DISCIPLINES.map(d => { const l = list.filter(e => e.discId === d.id); return { id: d.id, name: d.name, minutes: l.reduce((n, e) => n + e.minutes, 0), count: l.length } }).filter(x => x.count).sort((a, b) => b.minutes - a.minutes)
}
export const fmtMin = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`)

// ── Avaliações (tentativas)
export interface Attempt { id: string; at: string; day: string; topic: string; mode: AsmMode; items: AsmItem[]; sec: number; entry?: string }
export function attemptsOf(p: Progress): Attempt[] {
  const out: Attempt[] = []
  for (const e of p.events) if (e.t === 'asm') out.push({ id: e.id, at: e.at, day: e.day, topic: e.topic, mode: e.mode, items: e.items, sec: e.sec, entry: e.entry })
  return out.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : a.id < b.id ? -1 : 1))
}
export const score = (items: AsmItem[]) => ({ n: items.length, ok: items.filter(i => i[2] === 1).length, pct: items.length ? Math.round((items.filter(i => i[2] === 1).length / items.length) * 100) : 0 })

// Conjunto de questões de um assunto. Avaliação usa só as validadas; prática usa tudo, menos as com erro confirmado.
export function poolOf(topicId: string, vOf: VOf): { all: Question[]; validated: Question[]; practice: Question[]; excluded: Question[] } {
  const all = QUESTIONS.filter(q => q.topicId === topicId)
  return { all, validated: all.filter(q => vOf(q.id) === 'validada'), practice: all.filter(q => vOf(q.id) !== 'precisa-correcao'), excluded: all.filter(q => vOf(q.id) === 'precisa-correcao') }
}

// ── Critério de domínio. Evidência = respostas dadas em AVALIAÇÕES (não prática) a questões que HOJE estão validadas.
export type MasteryState = 'consolidado' | 'nao-avaliado' | 'amostra-insuficiente' | 'nao-atingido'
export interface Mastery { state: MasteryState; pct: number | null; lastPct: number | null; distinct: number; days: number; evals: number; poolValidated: number; poolShort: boolean; rules: MasteryRules }
export const MASTERY_SHORT = 'Domínio ainda não avaliado — questões validadas insuficientes.'
export function masteryOf(topicId: string, attempts: Attempt[], vOf: VOf, rules: MasteryRules): Mastery {
  const poolValidated = poolOf(topicId, vOf).validated.length
  const ev = attempts.filter(a => a.topic === topicId && a.mode === 'avaliacao').map(a => ({ a, items: a.items.filter(i => vOf(i[0]) === 'validada') })).filter(x => x.items.length)
  const all = ev.flatMap(x => x.items), sc = score(all), last = ev.length ? score(ev[ev.length - 1].items) : null
  const distinct = new Set(all.map(i => i[0])).size, days = new Set(ev.map(x => x.a.day)).size
  const base = { distinct, days, evals: ev.length, poolValidated, poolShort: poolValidated < rules.minDistinct, rules, pct: all.length ? sc.pct : null, lastPct: last ? last.pct : null }
  if (!ev.length) return { ...base, state: 'nao-avaliado' }
  if (distinct < rules.minDistinct || days < rules.minDays) return { ...base, state: 'amostra-insuficiente' }
  return { ...base, state: sc.pct >= rules.minPct && (last?.pct ?? 0) >= rules.minPct ? 'consolidado' : 'nao-atingido' }
}
export function masteryText(m: Mastery): string {
  if (m.state === 'consolidado') return 'Domínio consolidado'
  if (m.poolShort) return MASTERY_SHORT
  if (m.state === 'nao-avaliado') return 'Domínio ainda não avaliado — faça uma avaliação com questões validadas.'
  if (m.state === 'amostra-insuficiente') return `Amostra insuficiente: ${m.distinct}/${m.rules.minDistinct} questões validadas distintas e ${m.days}/${m.rules.minDays} dia(s) de avaliação.`
  return `Ainda abaixo da meta: ${m.pct}% de acertos em avaliações validadas (meta ${m.rules.minPct}%).`
}

// ── Status por assunto
export type LStatus = 'nao-iniciado' | 'estudando' | 'teoria' | 'aguardando' | 'reforcar' | 'revisao' | 'bom' | 'dominio'
export const STATUS: Record<LStatus, { label: string; desc: string; cls: string }> = {
  'nao-iniciado': { label: 'Não iniciado', desc: 'Nenhum estudo, marcação ou avaliação registrados neste assunto.', cls: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' },
  estudando: { label: 'Estudando externamente', desc: 'Há estudo registrado no Diário (ou você marcou que está estudando), mas ainda não declarou o estudo teórico como concluído.', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200' },
  teoria: { label: 'Estudo teórico realizado', desc: 'Você declarou o estudo teórico como concluído hoje e ainda não fez nenhuma avaliação.', cls: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' },
  aguardando: { label: 'Aguardando avaliação', desc: 'Há estudo mais recente do que a última avaliação (ou o estudo foi declarado há 1 dia ou mais sem avaliação): é hora de validar.', cls: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200' },
  reforcar: { label: 'Precisa reforçar', desc: 'A última avaliação ficou abaixo do limite de reforço e ainda não houve revisão depois dela.', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200' },
  revisao: { label: 'Em revisão', desc: 'Desempenho intermediário na última avaliação, ou você já revisou (flashcards, questões) depois de um desempenho baixo.', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200' },
  bom: { label: 'Bom desempenho', desc: 'A última avaliação atingiu a meta de acertos, mas o critério de domínio (dias, questões validadas) ainda não foi cumprido.', cls: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200' },
  dominio: { label: 'Domínio consolidado', desc: 'Critério cumprido: meta de acertos em avaliações com questões validadas, em dias diferentes e com quantidade mínima de questões distintas.', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' },
}
export const STATUS_ORDER: LStatus[] = ['nao-iniciado', 'estudando', 'teoria', 'aguardando', 'reforcar', 'revisao', 'bom', 'dominio']
export interface TopicLearning {
  topicId: string; status: LStatus; mastery: Mastery; studied: boolean; assessed: boolean; attempts: Attempt[]; last?: Attempt; lastPct: number | null
  evidence: 'avaliacao' | 'pratica' | null; legacyLessons: number; minutes: number; entries: number
}
const stamp = (iso: string) => iso // comparação lexicográfica de ISO-8601 em UTC
export function topicLearning(p: Progress, topicId: string, ctx: { vOf: VOf; today?: string; attempts?: Attempt[] }): TopicLearning {
  const today = ctx.today ?? todayStr(), rules = p.settings.mastery
  const atts = (ctx.attempts ?? attemptsOf(p)).filter(a => a.topic === topicId), last = atts[atts.length - 1]
  const ents = entriesOf(p).filter(e => e.topicId === topicId), mk = p.marks?.[topicId], mark = mk && mk.state !== 'limpo' ? mk : undefined
  const m = masteryOf(topicId, atts, ctx.vOf, rules), lastPct = last ? score(last.items).pct : null
  const legacyLessons = LESSONS.filter(l => l.topicId === topicId && p.completed[l.id]).length
  const studied = ents.length > 0 || mark?.state === 'teoria'
  const studyAt = [...ents.map(e => e.createdAt), ...(mark ? [mark.at] : [])].sort().pop() // registro mais recente de estudo (criação, não edição)
  let status: LStatus
  if (m.state === 'consolidado') status = 'dominio'
  else if (last) {
    if (studyAt && stamp(studyAt) > stamp(last.at)) status = 'aguardando'
    else if (lastPct! >= rules.minPct) status = 'bom'
    else if (lastPct! >= rules.weakBelow) status = 'revisao'
    else status = revisedAfter(p, topicId, last) ? 'revisao' : 'reforcar'
  } else if (mark?.state === 'teoria') status = mark.at.slice(0, 10) < today ? 'aguardando' : 'teoria'
  else if (ents.length || mark?.state === 'estudando') status = 'estudando'
  else status = 'nao-iniciado'
  return { topicId, status, mastery: m, studied, assessed: atts.length > 0, attempts: atts, last, lastPct, evidence: last ? last.mode : null, legacyLessons, minutes: ents.reduce((n, e) => n + e.minutes, 0), entries: ents.length }
}
// Revisão depois de uma avaliação: flashcards do assunto revisados, ou questões do assunto respondidas fora de avaliação, depois dela.
function revisedAfter(p: Progress, topicId: string, last: Attempt): boolean {
  const cards = new Set(FLASHCARDS.filter(c => c.topicId === topicId).map(c => c.id)), qs = new Set(QUESTIONS.filter(q => q.topicId === topicId).map(q => q.id))
  if ([...cards].some(id => (p.cards[id]?.last ?? '') > last.day)) return true
  if ([...qs].some(id => (p.answers[id]?.at ?? '') > last.day)) return true
  return p.events.some(e => e.at > last.at && ((e.t === 'rev' && cards.has(e.card)) || (e.t === 'ans' && !e.asm && qs.has(e.qid))))
}

// ── As três métricas (nunca misturadas)
export interface Coverage { total: number; study: { n: number; pct: number }; assessment: { n: number; pct: number; validated: number }; mastery: { n: number; pct: number } }
export function coverage(p: Progress, ctx: { vOf: VOf; today?: string }): Coverage {
  const topics = DISCIPLINES.flatMap(d => d.topics), attempts = attemptsOf(p), L = topics.map(t => topicLearning(p, t.id, { ...ctx, attempts }))
  const pct = (n: number) => Math.round((n / topics.length) * 100)
  const study = L.filter(x => x.studied).length, assessed = L.filter(x => x.assessed).length, valid = L.filter(x => x.attempts.some(a => a.mode === 'avaliacao')).length, mastery = L.filter(x => x.status === 'dominio').length
  return { total: topics.length, study: { n: study, pct: pct(study) }, assessment: { n: assessed, pct: pct(assessed), validated: valid }, mastery: { n: mastery, pct: pct(mastery) } }
}
// Desempenho por disciplina a partir das tentativas, separando prática (qualquer questão) de avaliação (validadas no momento).
export function performanceByDiscipline(attempts: Attempt[]): { id: string; name: string; practice: ReturnType<typeof score>; evaluation: ReturnType<typeof score> }[] {
  return DISCIPLINES.map(d => {
    const at = attempts.filter(a => topicDiscipline(a.topic)?.id === d.id)
    return { id: d.id, name: d.name, practice: score(at.filter(a => a.mode === 'pratica').flatMap(a => a.items)), evaluation: score(at.filter(a => a.mode === 'avaliacao').flatMap(a => a.items)) }
  }).filter(x => x.practice.n || x.evaluation.n)
}
// Evolução entre avaliações de um assunto: percentual de cada tentativa e a diferença da última para a anterior.
export function evolution(attempts: Attempt[], topicId: string) {
  const a = attempts.filter(x => x.topic === topicId).map(x => ({ id: x.id, day: x.day, mode: x.mode, ...score(x.items) }))
  const n = a.length
  return { list: a, delta: n >= 2 ? a[n - 1].pct - a[n - 2].pct : null }
}

// ── Reforço sugerido depois de uma avaliação (sem IA: regras sobre o desempenho registrado)
export interface Suggestion { id: string; text: string; page?: string; lessonId?: string }
export function suggestionsFor(p: Progress, topicId: string, items: AsmItem[], masteryOk: boolean): Suggestion[] {
  const sc = score(items), r = p.settings.mastery, out: Suggestion[] = [], lesson = LESSONS.find(l => l.topicId === topicId)
  const wrong = items.filter(i => i[2] === 0).length
  if (sc.pct < r.weakBelow) {
    out.push({ id: 'externo', text: 'Voltar ao material externo e registrar o novo estudo no Diário.', page: 'diary' })
    if (lesson) out.push({ id: 'resumo', text: 'Ler o resumo do assunto (material complementar).', page: 'lesson', lessonId: lesson.id })
  } else if (lesson && sc.pct < r.minPct) out.push({ id: 'resumo', text: 'Reler o resumo do assunto (material complementar).', page: 'lesson', lessonId: lesson.id })
  if (wrong) out.push({ id: 'erros', text: `Refazer as ${wrong} questão(ões) erradas no Caderno de Erros.`, page: 'errors' })
  if (FLASHCARDS.some(c => c.topicId === topicId)) out.push({ id: 'cards', text: 'Estudar os flashcards do assunto.', page: 'review' })
  out.push({ id: 'reavaliar', text: masteryOk ? 'Parabéns! Reavalie em outro dia para manter o domínio.' : sc.pct >= r.minPct ? `Faça outra avaliação em um dia diferente (o critério pede ${r.minDays} dias).` : 'Faça uma nova avaliação em alguns dias, depois de reforçar.' })
  return out
}
export const daysAgo = (n: number) => addDays(todayStr(), -n)
