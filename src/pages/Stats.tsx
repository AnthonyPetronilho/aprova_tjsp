import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { QUESTIONS } from '../data/questions'
import { LESSONS } from '../data/lessons'
import { topicStatus, type StatusKey } from '../lib/status'
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
  const topics = DISCIPLINES.flatMap(d => d.topics), counts: Record<StatusKey, number> = { none: 0, new: 0, doing: 0, studied: 0, review: 0, mastered: 0 }
  topics.forEach(x => counts[topicStatus(p, x.id).key]++)
  const withLesson = topics.filter(x => LESSONS.some(l => l.topicId === x.id)).length, covered = topics.filter(x => ['studied', 'review', 'mastered'].includes(topicStatus(p, x.id).key)).length
  const LABEL: [StatusKey, string][] = [['mastered', 'Dominado'], ['review', 'Em revisão'], ['studied', 'Estudado'], ['doing', 'Em andamento'], ['new', 'Não iniciado'], ['none', 'Sem aula ainda']]
  return <div className="space-y-4">
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">{[['Questões respondidas', String(p.totalAnswered)], ['Acerto geral', acc === null ? '—' : `${acc}%`], ['Revisões feitas', String(p.reviewLog.length)], ['Taxa de lembrança', ret === null ? '—' : `${ret}%`], ['Simulados', String(p.mocks.length)], ['Redações salvas', String(p.essays.length)]].map(([k, v]) => <div key={k} className="card"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-extrabold">{v}</p></div>)}</div>
    <div className="grid lg:grid-cols-2 gap-4">
      <Col title="Horas estudadas por semana (tempo ativo, 8 semanas)" vals={hours} labels={weeks.map(w => `${w.slice(8)}/${w.slice(5, 7)}`)} unit="h" color="bg-sky-500" />
      <Col title="Evolução nos simulados (nota 0 a 10, últimos 10)" vals={mocks.map(m => m.score)} labels={mocks.map(m => `${m.kind === 'completo' ? 'C' : 'R'} ${m.date.slice(8)}/${m.date.slice(5, 7)}`)} unit="" color="bg-indigo-500" /></div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h3 className="font-bold mb-1">Matérias: mais fortes e mais difíceis</h3><p className="text-xs text-slate-500 mb-3">Considera a última resposta de cada questão; só entram matérias com pelo menos 3 questões respondidas.</p>
        {per.length < 2 ? <p className="text-sm text-slate-500">{per.length ? `Só ${per[0].d.name} tem dados suficientes (${per[0].pct}% de acerto).` : 'Dados insuficientes ainda.'}</p> : <><p className="text-sm font-semibold text-emerald-600">💪 Mais forte: {per[0].d.name} ({per[0].pct}%)</p><p className="text-sm font-semibold text-rose-600 mb-3">🎯 Mais difícil: {per[per.length - 1].d.name} ({per[per.length - 1].pct}%)</p></>}
        {per.map(x => <div key={x.d.id} className="mb-2"><div className="flex justify-between text-sm"><span>{x.d.name}</span><span>{x.pct}% ({x.n} q.)</span></div><Bar pct={x.pct} color={x.pct >= 60 ? 'bg-emerald-500' : 'bg-rose-500'} /></div>)}</div>
      <div className="card"><h3 className="font-bold mb-1">Cobertura do edital</h3><p className="text-3xl font-extrabold text-emerald-600">{Math.round((covered / topics.length) * 100)}%</p><Bar pct={Math.round((covered / topics.length) * 100)} color="bg-emerald-500" /><p className="text-xs text-slate-500 mt-1 mb-3">{covered} de {topics.length} tópicos estudados · {withLesson} já têm aula no app</p>
        <ul className="text-sm space-y-1">{LABEL.map(([k, n]) => <li key={k} className="flex justify-between"><span>{n}</span><b>{counts[k]}</b></li>)}</ul></div></div>
    {p.mocks.length > 0 && <p className="text-xs text-slate-500">C = simulado completo, R = rápido. Notas são estimativas do simulado, não garantem resultado no concurso real.</p>}</div>
}
