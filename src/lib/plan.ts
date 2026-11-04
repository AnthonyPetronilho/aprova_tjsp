// Motor do cronograma: gera um ciclo semanal (1 a 4 semanas) com blocos de 30 min, pesos por matéria e reta final.
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { QUESTIONS } from '../data/questions'
import { EXAM_DATE } from '../config'
import { addDays, todayStr } from './dates'
import type { Plan, PlanBlock, PlanSettings, Progress } from '../types'
export const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
export const FINAL_DAYS = 14
export const blocksPerDay = (hours: number) => Math.max(1, Math.min(16, Math.round(hours * 2)))
// Peso base = nº de questões do edital. O edital não divide as 30 questões de Direito entre as 6 disciplinas: dividimos igualmente.
const BASE: Record<string, number> = { pt: 16, atual: 4, mat: 4, info: 9, rl: 7 }
export function weights(p: Progress, s: PlanSettings) {
  const law = DISCIPLINES.filter(d => d.block === 2).length
  return DISCIPLINES.map(d => {
    let w = BASE[d.id] ?? 30 / law
    if (s.hard.includes(d.id)) w *= 1.5
    const a = Object.entries(p.answers).filter(([q]) => topicDiscipline(QUESTIONS.find(x => x.id === q)?.topicId ?? '')?.id === d.id)
    if (a.length >= 5) { const acc = a.filter(([, x]) => x.correct).length / a.length; if (acc < 0.6) w *= 1.3; else if (acc > 0.85) w *= 0.85 }
    return { id: d.id, w }
  })
}
// Distribui `total` blocos: 1 para cada matéria (se couber) e o restante proporcional ao peso (maiores restos).
export function allocate(total: number, ws: { id: string; w: number }[]): Record<string, number> {
  const out: Record<string, number> = Object.fromEntries(ws.map(x => [x.id, 0]))
  if (total <= 0) return out
  if (total < ws.length) { [...ws].sort((a, b) => b.w - a.w).slice(0, total).forEach(x => (out[x.id] = 1)); return out }
  ws.forEach(x => (out[x.id] = 1))
  const rest = total - ws.length, sum = ws.reduce((a, b) => a + b.w, 0)
  const raw = ws.map(x => ({ id: x.id, v: (rest * x.w) / sum }))
  raw.forEach(r => (out[r.id] += Math.floor(r.v)))
  let left = total - Object.values(out).reduce((a, b) => a + b, 0)
  for (const r of [...raw].sort((a, b) => (b.v % 1) - (a.v % 1))) { if (left <= 0) break; out[r.id]++; left-- }
  return out
}
// Intercala as matérias para que a mesma não apareça em blocos seguidos.
export function interleave(counts: Record<string, number>, order: string[]): string[] {
  const left = { ...counts }, out: string[] = []; let last = ''
  while (Object.values(left).some(v => v > 0)) {
    const cand = order.filter(id => left[id] > 0).sort((a, b) => left[b] - left[a])
    const pick = cand.find(id => id !== last) ?? cand[0]
    out.push(pick); left[pick]--; last = pick
  }
  return out
}
export function buildTemplate(p: Progress, s: PlanSettings): PlanBlock[][] {
  const W = Math.max(1, s.weekdays.length), bpd = blocksPerDay(s.hoursPerDay), ws = weights(p, s), nd = ws.length
  // Ciclo mínimo (até 4 semanas) com pelo menos 2 blocos por matéria, para que os pesos apareçam de verdade.
  let K = 4; for (let k = 1; k <= 4; k++) if (k * W * bpd - k >= 2 * nd) { K = k; break }
  const content = K * W * bpd - K
  const seq = interleave(allocate(content, ws), ws.map(x => x.id))
  const seen: Record<string, number> = {}
  const mk = (disc: string): PlanBlock => { const c = (seen[disc] = (seen[disc] ?? -1) + 1); return { disc, min: 30, kind: s.style === 'ler' ? 'estudo' : s.style === 'praticar' ? 'questoes' : c % 2 === 0 ? 'estudo' : 'questoes' } }
  const days: PlanBlock[][] = []; let i = 0
  for (let d = 0; d < K * W; d++) {
    const lastOfWeek = d % W === W - 1, n = bpd - (lastOfWeek ? 1 : 0), day: PlanBlock[] = []
    for (let k = 0; k < n; k++) day.push(mk(seq[i++]))
    if (lastOfWeek) day.push({ disc: 'geral', kind: 'revisao', min: 30 })
    days.push(day)
  }
  return days
}
export const isStudyDay = (plan: Plan, date: string) => plan.settings.weekdays.includes(new Date(date + 'T12:00:00').getDay())
export const finalStart = () => addDays(EXAM_DATE, -FINAL_DAYS)
const studyDaysBetween = (plan: Plan, from: string, to: string) => { let n = 0; for (let d = from; d < to; d = addDays(d, 1)) if (isStudyDay(plan, d)) n++; return n }
export function dayBlocks(plan: Plan, date: string): PlanBlock[] | null {
  if (date >= EXAM_DATE || date < plan.from || !isStudyDay(plan, date) || !plan.template.length) return null
  const bpd = blocksPerDay(plan.settings.hoursPerDay)
  if (date >= finalStart()) {
    const kinds: PlanBlock['kind'][] = ['simulado', 'revisao', 'erros', 'revisao'], di = studyDaysBetween(plan, finalStart() > plan.from ? finalStart() : plan.from, date)
    return Array.from({ length: bpd }, (_, i) => ({ disc: 'geral', kind: kinds[(di + i) % 4], min: 30 }))
  }
  return plan.template[studyDaysBetween(plan, plan.from, date) % plan.template.length]
}
export function missed(p: Progress, from: string, to: string) {
  const out: { date: string; idx: number; block: PlanBlock }[] = []
  if (!p.plan) return out
  for (let d = from < p.plan.from ? p.plan.from : from; d < to; d = addDays(d, 1)) (dayBlocks(p.plan, d) ?? []).forEach((block, idx) => { if (!p.planMarks[d]?.[idx]) out.push({ date: d, idx, block }) })
  return out
}
export function remaining(plan: Plan) {
  const t = todayStr(); let days = 0
  for (let d = t < plan.from ? plan.from : t; d < EXAM_DATE; d = addDays(d, 1)) if (isStudyDay(plan, d)) days++
  return { days, hours: days * plan.settings.hoursPerDay, weeks: Math.ceil(Math.max(0, (new Date(EXAM_DATE + 'T12:00:00').getTime() - Date.now()) / 864e5) / 7) }
}
export const discName = (id: string) => (id === 'geral' ? 'Geral' : DISCIPLINES.find(d => d.id === id)?.name ?? id)
