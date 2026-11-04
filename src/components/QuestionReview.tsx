import type { MockResult, Question } from '../types'
// Gabarito comentado, somente leitura (usado depois do simulado).
export default function QuestionReview({ qs, r }: { qs: Question[]; r: MockResult }) {
  return <div className="space-y-3">{qs.map((q, n) => { const a = r.answers[q.id], st = !a ? 'Em branco' : a === q.answer ? 'Acertou' : 'Errou'
    return <div key={q.id} className="card"><p className="text-xs text-slate-500 mb-1">Questão {n + 1} · {q.difficulty} · <b className={st === 'Acertou' ? 'text-emerald-600' : st === 'Errou' ? 'text-rose-600' : 'text-slate-500'}>{st}</b></p><p className="font-medium mb-2">{q.stem}</p>
      <ul className="space-y-1 text-sm">{q.options.map(o => <li key={o.id} className={`rounded-lg p-2 border ${o.id === q.answer ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : o.id === a ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30' : 'border-slate-200 dark:border-slate-700'}`}><b>{o.id})</b> {o.text}{o.id === a ? ' ← sua resposta' : ''}<p className="text-xs text-slate-500 mt-1">{o.why}</p></li>)}</ul></div> })}</div>
}
