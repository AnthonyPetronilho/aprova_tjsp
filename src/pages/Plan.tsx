import { useState } from 'react'
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { LESSONS } from '../data/lessons'
import { EXAM_DATE } from '../config'
import { addDays, todayStr } from '../lib/dates'
import { WEEKDAYS, blocksPerDay, dayBlocks, discName, finalStart, missed, remaining } from '../lib/plan'
import type { Plan as PlanT, PlanBlock, PlanSettings } from '../types'
import type { Store } from '../lib/useProgress'
const KIND: Record<PlanBlock['kind'], string> = { estudo: 'Estudar (resumo complementar de)', questoes: 'Resolver questões de', revisao: 'Revisão geral (flashcards e erros)', simulado: 'Simulado', erros: 'Refazer o Caderno de Erros', teoria: 'Estudo teórico (material externo) de', diagnostico: 'Teste diagnóstico (Validar meu aprendizado) de' }
const fmt = (d: string) => `${WEEKDAYS[new Date(d + 'T12:00:00').getDay()]} ${d.slice(8)}/${d.slice(5, 7)}`
const label = (b: PlanBlock) => (b.disc === 'geral' ? KIND[b.kind] : `${KIND[b.kind]} ${discName(b.disc)}`)
const chip = (on: boolean) => `px-3 py-1 rounded-full text-sm border ${on ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`
type Go = (page: string, id?: string) => void
function target(s: Store, b: PlanBlock): { page: string; id?: string } | null {
  if (b.kind === 'revisao') return { page: 'review' }
  if (b.kind === 'erros') return { page: 'errors' }
  if (b.kind === 'simulado') return { page: 'mocks' }
  if (b.kind === 'questoes') return { page: 'bank' }
  if (b.kind === 'teoria') return { page: 'diary', id: 'new' }
  if (b.kind === 'diagnostico') return { page: 'validate' }
  const l = LESSONS.find(x => topicDiscipline(x.topicId)?.id === b.disc && !s.p.completed[x.id])
  return l ? { page: 'lesson', id: l.id } : null
}
function Questionnaire({ s }: { s: Store }) {
  const [st, setSt] = useState<PlanSettings>({ weekdays: [1, 2, 3, 4, 5], hoursPerDay: 2, level: 'iniciante', hard: [], style: 'misto' })
  const tog = <T,>(a: T[], v: T) => (a.includes(v) ? a.filter(x => x !== v) : [...a, v])
  const weeks = Math.ceil((new Date(EXAM_DATE + 'T12:00:00').getTime() - Date.now()) / 864e5 / 7)
  return <div className="space-y-4 max-w-2xl"><h1 className="text-2xl font-bold">📅 Cronograma personalizado</h1>
    <p className="text-sm text-slate-500">Responda 5 perguntas e eu monto um plano até a prova (14/03/2027, faltam cerca de {weeks} semanas). Você pode recalcular quando quiser.</p>
    <div className="card space-y-5">
      <label className="block"><span className="font-semibold">1. Quantas horas por dia você consegue estudar?</span><div className="flex items-center gap-3 mt-2"><input type="range" min={0.5} max={8} step={0.5} value={st.hoursPerDay} onChange={e => setSt({ ...st, hoursPerDay: Number(e.target.value) })} className="flex-1" /><b className="w-16 text-right">{st.hoursPerDay} h</b></div></label>
      <div><span className="font-semibold">2. Em quais dias da semana?</span><div className="flex flex-wrap gap-2 mt-2">{WEEKDAYS.map((w, i) => <button key={w} type="button" onClick={() => setSt({ ...st, weekdays: tog(st.weekdays, i) })} className={chip(st.weekdays.includes(i))} aria-pressed={st.weekdays.includes(i)}>{w}</button>)}</div>{!st.weekdays.length && <p className="text-xs text-rose-600 mt-1">Escolha ao menos um dia.</p>}</div>
      <div><span className="font-semibold">3. Qual é o seu nível atual?</span><div className="flex flex-wrap gap-2 mt-2">{([['iniciante', 'Iniciante'], ['intermediario', 'Intermediário'], ['avancado', 'Avançado']] as const).map(([k, n]) => <button key={k} type="button" onClick={() => setSt({ ...st, level: k })} className={chip(st.level === k)}>{n}</button>)}</div></div>
      <div><span className="font-semibold">4. Quais matérias você considera mais difíceis?</span><div className="flex flex-wrap gap-2 mt-2">{DISCIPLINES.map(d => <button key={d.id} type="button" onClick={() => setSt({ ...st, hard: tog(st.hard, d.id) })} className={chip(st.hard.includes(d.id))} aria-pressed={st.hard.includes(d.id)}>{d.name}</button>)}</div></div>
      <div><span className="font-semibold">5. Você prefere estudar…</span><div className="flex flex-wrap gap-2 mt-2">{([['ler', 'Mais teoria externa'], ['praticar', 'Mais questões'], ['misto', 'Combinando os dois']] as const).map(([k, n]) => <button key={k} type="button" onClick={() => setSt({ ...st, style: k })} className={chip(st.style === k)}>{n}</button>)}</div></div>
      <button className="btn-p" disabled={!st.weekdays.length} onClick={() => s.createPlan(st)}>Criar meu cronograma</button></div></div>
}
function Week({ plan, s }: { plan: PlanT; s: Store }) {
  const t = todayStr()
  return <div className="card"><h2 className="font-bold mb-3">🗓️ Próximos 7 dias</h2><ul className="grid sm:grid-cols-2 lg:grid-cols-7 gap-2 text-sm">{Array.from({ length: 7 }, (_, i) => addDays(t, i)).map(d => { const bl = dayBlocks(plan, d); return <li key={d} className="rounded-xl bg-slate-100 dark:bg-slate-700 p-2"><p className="text-xs font-semibold">{fmt(d)}</p>{bl ? bl.map((b, k) => <p key={k} className={`text-xs ${s.p.planMarks[d]?.[k] === 'done' ? 'line-through opacity-60' : ''}`}>• {b.disc === 'geral' ? KIND[b.kind].split(' (')[0] : discName(b.disc)}</p>) : <p className="text-xs text-slate-500">{d >= EXAM_DATE ? '—' : 'descanso'}</p>}</li> })}</ul></div>
}
function PlanView({ s, go }: { s: Store; go: Go }) {
  const { p } = s, plan = p.plan!, t = todayStr(), today = dayBlocks(plan, t), rem = remaining(plan), [confirm, setConfirm] = useState(false)
  const pend = missed(p, addDays(t, -7), t)
  const counts: Record<string, number> = {}; plan.template.flat().forEach(b => { counts[b.disc] = (counts[b.disc] ?? 0) + 1 })
  const total = plan.template.flat().length
  const done = today?.filter((_, i) => p.planMarks[t]?.[i] === 'done').length ?? 0
  return <div className="space-y-4"><div className="flex flex-wrap justify-between gap-2"><h1 className="text-2xl font-bold">📅 Cronograma até a prova</h1><div className="flex gap-2 flex-wrap"><button className="btn-s" onClick={s.recalcPlan} title="Reorganiza do dia de hoje em diante, considerando seu desempenho">🔄 Recalcular</button>{!confirm ? <button className="btn-s" onClick={() => setConfirm(true)}>Refazer perguntas</button> : <><button className="btn bg-rose-600 text-white" onClick={() => { s.clearPlan(); setConfirm(false) }}>Confirmar (apaga o plano)</button><button className="btn-s" onClick={() => setConfirm(false)}>Cancelar</button></>}</div></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[['Semanas até a prova', String(rem.weeks)], ['Dias de estudo restantes', String(rem.days)], ['Horas planejadas', `${rem.hours} h`], ['Rotina', `${plan.settings.hoursPerDay} h × ${plan.settings.weekdays.length} dia(s)`]].map(([k, v]) => <div key={k} className="card"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-extrabold">{v}</p></div>)}</div>
    <div className="card"><h2 className="font-bold mb-1">Hoje · {fmt(t)}{today ? ` · ${done}/${today.length}` : ''}</h2>
      {!today ? <p className="text-slate-500">{t >= EXAM_DATE ? 'A prova já passou ou é hoje. Boa sorte! 🍀' : 'Hoje é dia de descanso no seu plano 🌿. Descansar também faz parte de aprender; se quiser, revise alguns flashcards.'}</p>
        : <ul className="space-y-2">{today.map((b, i) => { const m = p.planMarks[t]?.[i], tg = target(s, b); return <li key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-3"><input type="checkbox" className="h-5 w-5" checked={m === 'done'} aria-label={`Marcar como feito: ${label(b)}`} onChange={e => s.markBlock(t, i, e.target.checked ? 'done' : undefined)} /><span className={`flex-1 min-w-[12rem] ${m ? 'line-through opacity-60' : ''}`}>{label(b)} <span className="text-xs text-slate-500">({b.min} min)</span></span>{b.kind === 'estudo' && !tg && <span className="text-xs text-slate-500">Sem aula no app ainda — estude pelo seu material</span>}{tg && !m && <button className="btn-s !py-1 text-sm" onClick={() => go(tg.page, tg.id)}>Abrir</button>}{!m && <button className="underline text-xs text-slate-500" onClick={() => s.markBlock(t, i, 'skip')}>Pular hoje</button>}{m === 'skip' && <span className="text-xs text-slate-500">pulado</span>}</li> })}</ul>}</div>
    {pend.length > 0 && <div className="card"><h2 className="font-bold mb-1">🌱 Para recuperar quando puder</h2><p className="text-xs text-slate-500 mb-2">Sem pressão: blocos dos últimos 7 dias que ficaram em aberto. Marque o que fez depois ou dispense o que não faz mais sentido.</p><ul className="space-y-1 text-sm">{pend.slice(0, 8).map(x => <li key={x.date + x.idx} className="flex flex-wrap gap-2 items-center"><span className="flex-1 min-w-[10rem]">{fmt(x.date)} · {label(x.block)}</span><button className="btn-s !py-0.5 text-xs" onClick={() => s.markBlock(x.date, x.idx, 'done')}>Fiz</button><button className="underline text-xs text-slate-500" onClick={() => s.markBlock(x.date, x.idx, 'skip')}>Dispensar</button></li>)}</ul>{pend.length > 8 && <p className="text-xs text-slate-500 mt-1">e mais {pend.length - 8}… use “Recalcular” para reorganizar a partir de hoje.</p>}</div>}
    <Week plan={plan} s={s} />
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h2 className="font-bold mb-2">Distribuição do tempo no ciclo ({plan.template.length / plan.settings.weekdays.length} semana(s))</h2><table className="w-full text-sm"><tbody>{Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([id, n]) => <tr key={id} className="border-t border-slate-200 dark:border-slate-700"><td className="py-1">{discName(id)}{plan.settings.hard.includes(id) ? ' ⭐' : ''}</td><td className="text-right">{n} bloco(s)</td><td className="text-right w-14">{Math.round((n / total) * 100)}%</td></tr>)}</tbody></table>
        <p className="text-xs text-slate-500 mt-2">Peso de cada matéria = nº de questões do edital (⭐ = você marcou como difícil; matérias com baixo acerto recebem um pouco mais). O edital não divide as 30 questões de Direito entre as 6 disciplinas jurídicas; dividi igualmente.</p></div>
      <div className="card"><h2 className="font-bold mb-2">Fases até a prova</h2><ul className="text-sm space-y-2"><li><b>Base e prática</b> · {fmt(plan.from)} até {fmt(addDays(finalStart(), -1))}<br /><span className="text-slate-500">Blocos de {plan.settings.style === 'ler' ? 'estudo' : plan.settings.style === 'praticar' ? 'questões' : 'estudo e questões alternados'}, com uma revisão geral por semana.</span></li><li><b>Reta final</b> · {fmt(finalStart())} até {fmt(addDays(EXAM_DATE, -1))}<br /><span className="text-slate-500">Sem conteúdo novo: simulados, revisão e Caderno de Erros.</span></li><li><b>Prova objetiva</b> · {fmt(EXAM_DATE)} (data prevista)</li></ul><p className="text-xs text-slate-500 mt-2">Nível informado: {plan.settings.level}. {blocksPerDay(plan.settings.hoursPerDay)} bloco(s) de 30 min por dia de estudo.</p></div></div></div>
}
export default function Plan({ s, go }: { s: Store; go: Go }) { return s.p.plan ? <PlanView s={s} go={go} /> : <Questionnaire s={s} /> }
