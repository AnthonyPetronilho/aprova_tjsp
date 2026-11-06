import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { QUESTIONS } from '../data/questions'
import { useMemo } from 'react'
import { QUESTIONS as QS } from '../data/questions'
import { useContent, validationOf } from '../lib/content'
import { STATUS, STATUS_ORDER, attemptsOf, coverage, entriesOf, fmtMin, performanceByDiscipline, topicLearning, evolution } from '../lib/learning'
import { addDays, todayStr } from '../lib/dates'
import type { Progress } from '../types'
import Bar from '../components/Bar'
const nota = (n: number) => n.toFixed(1).replace('.', ',')
const monday = (d: string) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}` }
function Col({ title, vals, labels, unit, color }: { title: string; vals: number[]; labels: string[]; unit: string; color: string }) {
  const max = Math.max(1, ...vals)
  return <div className="card"><h3 className="font-bold mb-3">{title}</h3>{vals.length ? <div className="flex items-end gap-2 h-32">{vals.map((v, i) => <div key={i} className="flex-1 flex flex-col items-center justify-end h-full min-w-0"><span className="text-xs text-slate-500">{v}{unit}</span><div className={`w-full rounded-t ${color}`} style={{ height: `${(v / max) * 100}%`, minHeight: v ? 4 : 0 }} /><span className="text-[10px] mt-1 truncate max-w-full">{labels[i]}</span></div>)}</div> : <p className="text-sm text-slate-500">Sem dados ainda.</p>}</div>
}
export default function Stats({ p }: { p: Progress }) {
  const t = todayStr(), weeks = Array.from({ length: 8 }, (_, i) => monday(addDays(t, (i - 7) * 7)))
  const hours = weeks.map(w => Math.round((Object.entries(p.daily).filter(([d]) => monday(d) === w).reduce((n, [, s]) => n + s.seconds, 0) / 3600) * 10) / 10)
  const ans = Object.entries(p.answers), acc = ans.length ? Math.round((ans.filter(([, a]) => a.correct).length / ans.length) * 100) : null
  const rec = p.reviewLog.slice(-50), ret = rec.length ? Math.round((rec.filter(r => r.rating > 0).length / rec.length) * 100) : null
  const mocks = p.mocks.slice(-10)
  const per = DISCIPLINES.map(d => { const a = ans.filter(([q]) => topicDiscipline(QUESTIONS.find(x => x.id === q)?.topicId ?? '')?.id === d.id); return { d, n: a.length, pct: a.length ? Math.round((a.filter(([, x]) => x.correct).length / a.length) * 100) : 0 } }).filter(x => x.n >= 3).sort((a, b) => b.pct - a.pct)
  const c = useContent(), vOf = (q: string) => validationOf(q), topics = DISCIPLINES.flatMap(d => d.topics)
  const att = useMemo(() => attemptsOf(p), [p.events]) // eslint-disable-line react-hooks/exhaustive-deps
  const cov = useMemo(() => coverage(p, { vOf }), [p, c.validations]) // eslint-disable-line react-hooks/exhaustive-deps
  const L = useMemo(() => topics.map(x => topicLearning(p, x.id, { vOf, attempts: att })), [p, att, c.validations]) // eslint-disable-line react-hooks/exhaustive-deps
  const counts = Object.fromEntries(STATUS_ORDER.map(k => [k, L.filter(x => x.status === k).length]))
  const ent = entriesOf(p), manual = ent.reduce((n, e) => n + e.minutes, 0), appSec = Object.values(p.daily).reduce((n, d) => n + d.seconds, 0)
  const perfD = performanceByDiscipline(att), nVal = QS.filter(q => vOf(q.id) === 'validada').length, nExc = QS.filter(q => vOf(q.id) === 'precisa-correcao').length
  const evals = att.filter(a => a.mode === 'avaliacao').length, practices = att.length - evals
  const evolved = [...new Set(att.map(a => a.topic))].map(t => ({ t, ev: evolution(att, t) })).filter(x => x.ev.list.length >= 2)
  return <div className="space-y-4">
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">{[['Questões respondidas', String(p.totalAnswered)], ['Acerto geral', acc === null ? '—' : `${acc}%`], ['Revisões feitas', String(p.reviewLog.length)], ['Taxa de lembrança', ret === null ? '—' : `${ret}%`], ['Simulados', String(p.mocks.length)], ['Redações salvas', String(p.essays.length)]].map(([k, v]) => <div key={k} className="card"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-extrabold">{v}</p></div>)}</div>
    <div className="grid lg:grid-cols-2 gap-4">
      <Col title="Horas estudadas por semana (tempo ativo, 8 semanas)" vals={hours} labels={weeks.map(w => `${w.slice(8)}/${w.slice(5, 7)}`)} unit="h" color="bg-sky-500" />
      <Col title="Evolução nos simulados (nota 0 a 10, últimos 10)" vals={mocks.map(m => m.score)} labels={mocks.map(m => `${m.kind === 'completo' ? 'C' : 'R'} ${m.date.slice(8)}/${m.date.slice(5, 7)}`)} unit="" color="bg-indigo-500" /></div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h3 className="font-bold mb-1">Matérias: mais fortes e mais difíceis</h3><p className="text-xs text-slate-500 mb-3">Considera a última resposta de cada questão; só entram matérias com pelo menos 3 questões respondidas.</p>
        {per.length < 2 ? <p className="text-sm text-slate-500">{per.length ? `Só ${per[0].d.name} tem dados suficientes (${per[0].pct}% de acerto).` : 'Dados insuficientes ainda.'}</p> : <><p className="text-sm font-semibold text-emerald-600">💪 Mais forte: {per[0].d.name} ({per[0].pct}%)</p><p className="text-sm font-semibold text-rose-600 mb-3">🎯 Mais difícil: {per[per.length - 1].d.name} ({per[per.length - 1].pct}%)</p></>}
        {per.map(x => <div key={x.d.id} className="mb-2"><div className="flex justify-between text-sm"><span>{x.d.name}</span><span>{x.pct}% ({x.n} q.)</span></div><Bar pct={x.pct} color={x.pct >= 60 ? 'bg-emerald-500' : 'bg-rose-500'} /></div>)}</div>
      <div className="card"><h3 className="font-bold mb-1">Assuntos por situação</h3><p className="text-xs text-slate-500 mb-3">Três coberturas separadas: estudo {cov.study.pct}% · avaliação {cov.assessment.pct}% · domínio {cov.mastery.pct}% ({topics.length} assuntos).</p>
        <ul className="text-sm space-y-1">{STATUS_ORDER.map(k => <li key={k} className="flex justify-between"><span className={`px-2 py-0.5 rounded-full text-xs ${STATUS[k].cls}`}>{STATUS[k].label}</span><b>{counts[k]}</b></li>)}</ul></div></div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h3 className="font-bold mb-1">Tempo de estudo: externo × app</h3><p className="text-xs text-slate-500 mb-2">Medidas diferentes, que nunca se somam: o externo é informado por você no Diário; o do app é o tempo ativo medido.</p>
        <ul className="text-sm space-y-1"><li className="flex justify-between"><span>Estudo externo (manual, {ent.length} registro(s))</span><b>{fmtMin(manual)}</b></li><li className="flex justify-between"><span>Tempo ativo no app</span><b>{fmtMin(Math.round(appSec / 60))}</b></li></ul></div>
      <div className="card"><h3 className="font-bold mb-1">Avaliações e questões</h3><ul className="text-sm space-y-1"><li className="flex justify-between"><span>Avaliações (questões validadas)</span><b>{evals}</b></li><li className="flex justify-between"><span>Práticas (não contam para o domínio)</span><b>{practices}</b></li><li className="flex justify-between"><span>Questões validadas</span><b>{nVal}</b></li><li className="flex justify-between"><span>Questões pendentes ou em complementação</span><b>{QS.length - nVal - nExc}</b></li><li className="flex justify-between"><span>Questões fora das avaliações (erro confirmado)</span><b>{nExc}</b></li></ul></div></div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h3 className="font-bold mb-1">Desempenho por disciplina (tentativas)</h3>{perfD.length ? perfD.map(x => <div key={x.id} className="mb-3"><p className="text-sm">{x.name}</p>{x.evaluation.n > 0 && <><div className="flex justify-between text-xs text-slate-500"><span>Avaliação</span><span>{x.evaluation.pct}% ({x.evaluation.n} resp.)</span></div><Bar pct={x.evaluation.pct} color="bg-emerald-500" /></>}{x.practice.n > 0 && <><div className="flex justify-between text-xs text-slate-500 mt-1"><span>Prática</span><span>{x.practice.pct}% ({x.practice.n} resp.)</span></div><Bar pct={x.practice.pct} color="bg-slate-400" /></>}</div>) : <p className="text-sm text-slate-500">Sem avaliações ou práticas registradas ainda.</p>}</div>
      <div className="card"><h3 className="font-bold mb-1">Evolução entre tentativas</h3>{evolved.length ? <ul className="text-sm space-y-2">{evolved.map(({ t, ev }) => <li key={t}><p>{topics.find(x => x.id === t)?.title}</p><p className="text-xs text-slate-500">{ev.list.map(a => `${a.pct}%`).join(' → ')} {ev.delta! > 0 ? `(+${ev.delta} p.p.)` : ev.delta! < 0 ? `(${ev.delta} p.p.)` : '(igual)'}</p></li>)}</ul> : <p className="text-sm text-slate-500">A evolução aparece quando um assunto tem pelo menos duas tentativas.</p>}</div></div>
    {p.mocks.length > 0 && <p className="text-xs text-slate-500">C = simulado completo, R = rápido. Notas são estimativas do simulado, não garantem resultado no concurso real.</p>}</div>
}
