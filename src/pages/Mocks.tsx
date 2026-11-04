import { useEffect, useRef, useState } from 'react'
import { QUESTIONS } from '../data/questions'
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { AREAS, COMPLETE_LIMIT_SEC, analyze, availability, canStartComplete, fmtClock, pickComplete, pickQuick } from '../lib/mocks'
import type { MockResult, OptId } from '../types'
import type { Store } from '../lib/useProgress'
import Bar from '../components/Bar'
import QuestionReview from '../components/QuestionReview'
const useNow = () => { const [n, setN] = useState(Date.now()); useEffect(() => { const i = window.setInterval(() => setN(Date.now()), 1000); return () => window.clearInterval(i) }, []); return n }
const chip = (on: boolean) => `px-3 py-1 rounded-full text-sm border ${on ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`
const fmtDate = (d: string) => d.split('-').reverse().join('/')
const nota = (n: number) => n.toFixed(1).replace('.', ',')
function Run({ s, onFinish }: { s: Store; onFinish: (id: string) => void }) {
  const run = s.p.mockRun!, now = useNow(), elapsed = (now - run.startedAt) / 1000, left = run.limitSec ? run.limitSec - elapsed : null
  const qs = run.qids.map(id => QUESTIONS.find(q => q.id === id)).filter((q): q is NonNullable<typeof q> => !!q), q = qs[Math.min(run.idx, qs.length - 1)]
  const [confirm, setConfirm] = useState(false), [quit, setQuit] = useState(false), fin = useRef(false)
  const finish = () => { if (fin.current) return; fin.current = true; onFinish(s.finishMock()) }
  useEffect(() => { if (left !== null && left <= 0) finish() })
  const pick = (id: OptId) => s.patchMock(r => { const a = { ...r.answers }; if (a[q.id] === id) delete a[q.id]; else a[q.id] = id; return { ...r, answers: a } })
  const answered = qs.filter(x => run.answers[x.id]).length, blank = qs.length - answered
  return <div className="space-y-4 max-w-3xl">
    <div className="card flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs text-slate-500">Simulado {run.kind === 'completo' ? 'completo TJSP (parte objetiva)' : 'rápido'}</p><p className="font-bold">Questão {run.idx + 1} de {qs.length} · {answered} respondida(s)</p></div>
      <div className={`text-2xl font-mono font-bold ${left !== null && left < 600 ? 'text-rose-600' : ''}`} role="timer" aria-label="Cronômetro">{left !== null ? `⏳ ${fmtClock(left)}` : `⏱️ ${fmtClock(elapsed)}`}</div></div>
    <div className="flex flex-wrap gap-1" aria-label="Navegação entre questões">{qs.map((x, i) => <button key={x.id} onClick={() => s.patchMock(r => ({ ...r, idx: i }))} aria-label={`Ir para a questão ${i + 1}${run.answers[x.id] ? ' (respondida)' : ''}`} className={`h-8 w-8 rounded-lg text-xs font-semibold border ${i === run.idx ? 'ring-2 ring-indigo-500' : ''} ${run.answers[x.id] ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>{i + 1}</button>)}</div>
    <div className="card"><p className="font-medium mb-3">{q.stem}</p><div className="space-y-2">{q.options.map(o => <button key={o.id} onClick={() => pick(o.id)} aria-pressed={run.answers[q.id] === o.id} className={`w-full text-left rounded-xl border p-3 ${run.answers[q.id] === o.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}`}><b>{o.id})</b> {o.text}</button>)}</div><p className="text-xs text-slate-500 mt-2">Clique de novo na alternativa marcada para deixar em branco. O gabarito só aparece ao finalizar.</p></div>
    <div className="flex flex-wrap gap-2"><button className="btn-s" disabled={run.idx === 0} onClick={() => s.patchMock(r => ({ ...r, idx: r.idx - 1 }))}>← Anterior</button><button className="btn-s" disabled={run.idx >= qs.length - 1} onClick={() => s.patchMock(r => ({ ...r, idx: r.idx + 1 }))}>Próxima →</button>
      {!confirm ? <button className="btn-p ml-auto" onClick={() => setConfirm(true)}>Finalizar simulado</button> : <span className="ml-auto flex flex-wrap gap-2 items-center"><span className="text-sm">{blank ? `${blank} em branco. ` : ''}Finalizar agora?</span><button className="btn-p" onClick={finish}>Sim, finalizar</button><button className="btn-s" onClick={() => setConfirm(false)}>Continuar</button></span>}</div>
    <div className="text-right">{!quit ? <button className="underline text-xs text-slate-500" onClick={() => setQuit(true)}>Abandonar sem registrar</button> : <span className="text-xs">Descarta as respostas. <button className="underline text-rose-600" onClick={s.abandonMock}>Descartar</button> · <button className="underline" onClick={() => setQuit(false)}>Voltar</button></span>}</div></div>
}
function Result({ s, r, onBack, go }: { s: Store; r: MockResult; onBack: () => void; go: (page: string) => void }) {
  const { qs, byArea, review, rules } = analyze(r), [gab, setGab] = useState(false)
  const same = s.p.mocks.filter(m => m.kind === r.kind), i = same.findIndex(m => m.id === r.id), prev = i > 0 ? same[i - 1] : null
  const total = r.correct + r.wrong + r.blank
  return <div className="space-y-4 max-w-3xl"><button className="underline text-sm" onClick={onBack}>← Voltar aos simulados</button>
    <div className="card"><p className="text-xs text-slate-500">Simulado {r.kind === 'completo' ? 'completo TJSP' : 'rápido'} · {fmtDate(r.date)}</p><div className="flex flex-wrap items-end gap-6 mt-1"><div><p className="text-sm text-slate-500">Nota estimada (0 a 10)</p><p className="text-5xl font-extrabold text-indigo-600">{nota(r.score)}</p></div><div className="text-sm space-y-1"><p>✅ {r.correct} acertos ({total ? Math.round((r.correct / total) * 100) : 0}%)</p><p>❌ {r.wrong} erros · ⚪ {r.blank} em branco</p><p>⏱️ Tempo: {fmtClock(r.secondsUsed)}</p>{prev && <p>📈 vs. anterior ({nota(prev.score)}): <b className={r.score >= prev.score ? 'text-emerald-600' : 'text-rose-600'}>{r.score >= prev.score ? '+' : ''}{nota(r.score - prev.score)}</b></p>}</div></div>
      <p className="text-xs text-slate-500 mt-3">Todas as questões têm o mesmo peso (nota = acertos ÷ total × 10). O resultado do simulado não garante habilitação nem classificação no concurso real.</p></div>
    {rules ? <div className="card"><h2 className="font-bold mb-2">Requisitos mínimos da prova objetiva (edital)</h2><ul className="text-sm space-y-1">{rules.map(x => <li key={x.label}>{x.ok ? '✅' : '❌'} {x.label}</li>)}</ul><p className="text-sm mt-2 font-semibold">{rules.every(x => x.ok) ? 'Neste simulado você cumpriu os requisitos mínimos.' : 'Neste simulado você NÃO cumpriu todos os requisitos mínimos.'}</p><p className="text-xs text-slate-500">O Bloco III (Conhecimentos Gerais) é apenas classificatório. A redação é eliminatória à parte e é treinada no Laboratório de Redação.</p></div>
      : <div className="card text-sm text-slate-500">Simulado rápido: os critérios eliminatórios do edital (50% em cada bloco e nota 5,0) só se aplicam à prova completa de 70 questões.</div>}
    <div className="card"><h2 className="font-bold mb-3">Desempenho por área</h2>{byArea.map(a => <div key={a.id} className="mb-2"><div className="flex justify-between text-sm"><span>{a.name}</span><span>{a.correct}/{a.total} · {a.pct}%</span></div><Bar pct={a.pct} color={a.pct >= 50 ? 'bg-emerald-500' : 'bg-rose-500'} /></div>)}</div>
    {review.length > 0 && <div className="card"><h2 className="font-bold mb-2">Assuntos para revisar</h2><ul className="list-disc ml-5 text-sm">{review.map(t => <li key={t}>{t}</li>)}</ul><p className="text-xs text-slate-500 mt-2">As questões erradas já foram para o Caderno de Erros e viraram flashcards.</p><div className="flex gap-2 mt-3"><button className="btn-s" onClick={() => go('errors')}>Caderno de Erros</button><button className="btn-s" onClick={() => go('review')}>Revisões</button></div></div>}
    <button className="btn-p" onClick={() => setGab(!gab)}>{gab ? 'Esconder' : 'Ver'} gabarito comentado</button>{gab && <QuestionReview qs={qs} r={r} />}</div>
}
function Home({ s, open }: { s: Store; open: (id: string) => void }) {
  const { p } = s, [n, setN] = useState(10), [mode, setMode] = useState<'auto' | 'manual'>('auto'), [discs, setDiscs] = useState<string[]>([])
  const withQ = DISCIPLINES.filter(d => QUESTIONS.some(q => topicDiscipline(q.topicId)?.id === d.id))
  const pool = mode === 'auto' ? QUESTIONS.length : QUESTIONS.filter(q => discs.includes(topicDiscipline(q.topicId)?.id ?? '')).length, real = Math.min(n, pool), av = availability(), ok = canStartComplete()
  const start = (kind: 'rapido' | 'completo') => { const qids = kind === 'completo' ? pickComplete() : pickQuick(p, n, mode === 'auto' ? 'auto' : discs); if (!qids?.length) return; s.startMock({ id: `r${Date.now()}`, kind, startedAt: Date.now(), limitSec: kind === 'completo' ? COMPLETE_LIMIT_SEC : undefined, qids, answers: {}, idx: 0 }) }
  return <div className="space-y-4 max-w-3xl"><h1 className="text-2xl font-bold">🧪 Simulados</h1>
    <div className="card space-y-3"><h2 className="font-bold">Simulado rápido</h2>
      <div className="flex flex-wrap gap-2">{[5, 10, 15, 20].map(k => <button key={k} onClick={() => setN(k)} className={chip(n === k)}>{k} questões</button>)}</div>
      <div className="flex flex-wrap gap-2"><button onClick={() => setMode('auto')} className={chip(mode === 'auto')}>Automático (foco nas minhas dificuldades)</button><button onClick={() => setMode('manual')} className={chip(mode === 'manual')}>Escolher matérias</button></div>
      {mode === 'manual' && <div className="flex flex-wrap gap-2">{withQ.map(d => <button key={d.id} onClick={() => setDiscs(discs.includes(d.id) ? discs.filter(x => x !== d.id) : [...discs, d.id])} className={chip(discs.includes(d.id))} aria-pressed={discs.includes(d.id)}>{d.name}</button>)}</div>}
      <p className="text-sm text-slate-500">{pool === 0 ? 'Escolha ao menos uma matéria com questões.' : real < n ? `O banco tem ${pool} questão(ões) nessa seleção; o simulado terá ${real}.` : `Serão ${real} questões.`} O automático prioriza erros em aberto e questões que você ainda não respondeu.</p>
      <button className="btn-p" disabled={!real} onClick={() => start('rapido')}>Iniciar simulado rápido</button></div>
    <div className="card space-y-3"><h2 className="font-bold">Simulado completo TJSP</h2><p className="text-sm text-slate-500">Reproduz a distribuição do edital (70 questões) com cronômetro de 5 horas para objetiva e redação. Aqui você faz a parte objetiva; a redação é treinada no Laboratório.</p>
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-500"><th>Área</th><th className="text-right">Edital</th><th className="text-right">No banco</th><th className="text-right">Faltam</th></tr></thead><tbody>{av.map(a => <tr key={a.id} className="border-t border-slate-200 dark:border-slate-700"><td className="py-1">{a.name}</td><td className="text-right">{a.n}</td><td className="text-right">{a.have}</td><td className={`text-right ${a.have >= a.n ? 'text-emerald-600' : 'text-rose-600'}`}>{Math.max(0, a.n - a.have)}</td></tr>)}<tr className="border-t border-slate-300 dark:border-slate-600 font-semibold"><td className="py-1">Total</td><td className="text-right">{AREAS.reduce((x, a) => x + a.n, 0)}</td><td className="text-right">{av.reduce((x, a) => x + a.have, 0)}</td><td className="text-right">{av.reduce((x, a) => x + Math.max(0, a.n - a.have), 0)}</td></tr></tbody></table>
      {!ok && <p className="text-sm text-amber-700 dark:text-amber-300">Ainda não há questões suficientes em todas as áreas. O simulado completo será liberado quando o banco atingir a distribuição do edital (as questões entram junto com os conteúdos).</p>}
      <button className="btn-p" disabled={!ok} onClick={() => start('completo')}>Iniciar simulado completo (5 h)</button></div>
    <div className="card"><h2 className="font-bold mb-2">Histórico</h2>{!p.mocks.length ? <p className="text-sm text-slate-500">Você ainda não finalizou nenhum simulado.</p> : <ul className="space-y-2">{[...p.mocks].reverse().map(m => <li key={m.id} className="flex flex-wrap items-center gap-3 text-sm"><span className="w-24 text-slate-500">{fmtDate(m.date)}</span><span className="flex-1 min-w-[8rem]">{m.kind === 'completo' ? 'Completo' : 'Rápido'} · {m.correct}/{m.correct + m.wrong + m.blank} acertos · {fmtClock(m.secondsUsed)}</span><b className="text-indigo-600">{nota(m.score)}</b><button className="btn-s !py-1 text-xs" onClick={() => open(m.id)}>Ver</button></li>)}</ul>}</div></div>
}
export default function Mocks({ s, go }: { s: Store; go: (page: string) => void }) {
  const [rid, setRid] = useState<string | null>(null)
  if (s.p.mockRun) return <Run s={s} onFinish={setRid} />
  const r = rid ? s.p.mocks.find(m => m.id === rid) : null
  return r ? <Result s={s} r={r} onBack={() => setRid(null)} go={go} /> : <Home s={s} open={setRid} />
}
