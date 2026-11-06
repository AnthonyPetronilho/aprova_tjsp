import { DISCIPLINES, BLOCKS } from '../data/edital'
import { useMemo } from 'react'
import { useContent, validationOf } from '../lib/content'
import { STATUS, STATUS_ORDER, attemptsOf, coverage, fmtMin, topicLearning } from '../lib/learning'
import type { Progress } from '../types'
import Bar from '../components/Bar'
export default function Edital({ p, go }: { p: Progress; go: (page: string, id?: string) => void }) {
  const c = useContent(), vOf = (q: string) => validationOf(q)
  const att = useMemo(() => attemptsOf(p), [p.events]) // eslint-disable-line react-hooks/exhaustive-deps
  const cov = useMemo(() => coverage(p, { vOf }), [p, c.validations]) // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="space-y-4"><h1 className="text-2xl font-bold">🗺️ Mapa do Edital</h1>
    <p className="text-slate-500 text-sm">Tópicos conforme o Anexo VIII. O status de cada assunto vem do que você <b>registrou e avaliou</b>: abrir um resumo não muda o status.</p>
    <div className="grid sm:grid-cols-3 gap-3">{[['Cobertura de estudo', cov.study, 'assuntos com estudo registrado'], ['Cobertura de avaliação', cov.assessment, 'assuntos já avaliados'], ['Domínio estimado', cov.mastery, 'assuntos com domínio consolidado']].map(([n, v, d]) => { const x = v as { n: number; pct: number }; return <div key={n as string} className="card"><p className="text-xs text-slate-500">{n as string}</p><p className="text-2xl font-extrabold">{x.pct}%</p><Bar pct={x.pct} /><p className="text-xs text-slate-500 mt-1">{x.n} de {cov.total} {d as string}</p></div> })}</div>
    <details className="card text-sm"><summary className="cursor-pointer font-semibold">O que significa cada status?</summary><ul className="mt-2 space-y-2">{STATUS_ORDER.map(k => <li key={k}><span className={`px-2 py-0.5 rounded-full text-xs ${STATUS[k].cls}`}>{STATUS[k].label}</span> <span className="text-slate-600 dark:text-slate-300">{STATUS[k].desc}</span></li>)}</ul></details>
    {([1, 2, 3] as const).map(b => <section key={b}><h2 className="font-semibold mt-4 mb-2">{BLOCKS[b]}</h2><div className="space-y-2">{DISCIPLINES.filter(d => d.block === b).map(d => <details key={d.id} className="card" open={d.id === 'pt' || d.id === 'dpenal'}><summary className="cursor-pointer font-semibold">{d.emoji} {d.name}{d.questions ? ` · ${d.questions} questões` : ''}</summary><ul className="mt-3 space-y-3">{d.topics.map(t => { const L = topicLearning(p, t.id, { vOf, attempts: att }), st = STATUS[L.status]
      return <li key={t.id} className="text-sm"><div className="flex flex-wrap items-center gap-2"><span className="flex-1 min-w-[12rem]">{t.title}</span><span className={`px-2 py-0.5 rounded-full text-xs ${st.cls}`} title={st.desc}>{st.label}</span>
        <button className="btn-s !py-1 text-xs" onClick={() => go('diary', t.id)}>Registrar estudo</button><button className="btn-p !py-1 text-xs" onClick={() => go('validate', t.id)}>Validar</button></div>
        <p className="text-xs text-slate-500 mt-0.5">{L.entries ? `${L.entries} estudo(s) · ${fmtMin(L.minutes)} informados` : 'sem estudo registrado'}{L.last ? ` · última tentativa ${L.lastPct}% (${L.last.mode === 'avaliacao' ? 'avaliação' : 'prática'})` : ''}{L.legacyLessons > 0 ? ` · ${L.legacyLessons} aula(s) concluída(s) no modelo anterior` : ''}</p></li> })}</ul></details>)}</div></section>)}</div>
}
