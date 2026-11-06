import { useEffect, useMemo, useRef, useState } from 'react'
import { DISCIPLINES } from '../data/edital'
import { QUESTIONS } from '../data/questions'
import { useContent, validationOf } from '../lib/content'
import { MASTERY_SHORT, STATUS, VALIDATION, attemptsOf, entriesOf, evolution, masteryText, poolOf, score, suggestionsFor, topicLearning, fmtMin } from '../lib/learning'
import type { Store } from '../lib/useProgress'
import type { AsmItem, AsmMode, OptId, Question } from '../types'
const inp = 'rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm w-full'
const STEPS = ['Assunto', 'Estudo teórico', 'Questões', 'Resultado', 'Reforço', 'Reavaliação']
const shuffle = <T,>(a: T[]) => { const o = [...a]; for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]] } return o }
interface Result { id: string; mode: AsmMode; items: AsmItem[]; sec: number; qs: Question[] }
export default function Validate({ s, go, initialTopic }: { s: Store; go: (page: string, id?: string) => void; initialTopic?: string }) {
  const { p, submitAssessment, setMark } = s, content = useContent()
  const vOf = (q: string) => validationOf(q), [step, setStep] = useState(1)
  const [disc, setDisc] = useState(() => DISCIPLINES.find(d => d.topics.some(t => t.id === initialTopic))?.id ?? ''), [topic, setTopic] = useState(initialTopic ?? '')
  const [entry, setEntry] = useState(''), [mode, setMode] = useState<AsmMode>('avaliacao'), [count, setCount] = useState(10)
  const [qs, setQs] = useState<Question[]>([]), [ans, setAns] = useState<Record<string, OptId>>({}), [res, setRes] = useState<Result | null>(null)
  const t0 = useRef(0)
  void content
  const topics = DISCIPLINES.find(d => d.id === disc)?.topics ?? []
  const L = useMemo(() => (topic ? topicLearning(p, topic, { vOf }) : null), [p, topic, content.validations]) // eslint-disable-line react-hooks/exhaustive-deps
  const pool = topic ? poolOf(topic, vOf) : null, avail = pool ? (mode === 'avaliacao' ? pool.validated : pool.practice) : []
  const entries = topic ? entriesOf(p).filter(e => e.topicId === topic) : []
  useEffect(() => { setCount(Math.max(1, Math.min(10, avail.length))) }, [avail.length, mode, topic]) // padrão: até 10 questões; a pessoa ajusta
  const start = () => {
    const seen = (id: string) => p.answers[id] ? (p.answers[id].correct ? 2 : 0) : 1 // erradas antes, novas, depois acertadas
    const picked = shuffle(avail).sort((a, b) => seen(a.id) - seen(b.id)).slice(0, count)
    setQs(shuffle(picked)); setAns({}); setRes(null); t0.current = Date.now(); setStep(3)
  }
  const finish = () => {
    const answered = qs.filter(q => ans[q.id]), sec = Math.round((Date.now() - t0.current) / 1000)
    const id = submitAssessment({ topic, mode, answers: answered.map(q => ({ qid: q.id, chosen: ans[q.id] })), sec, entry: entry || undefined })
    setRes({ id, mode, sec, qs: answered, items: answered.map(q => [q.id, ans[q.id], ans[q.id] === q.answer ? 1 : 0] as AsmItem) }); setStep(4)
  }
  const stepper = <ol className="flex flex-wrap gap-1 text-xs" aria-label="Etapas">{STEPS.map((n, i) => <li key={n} aria-current={step === i + 1 ? 'step' : undefined} className={`rounded-full px-3 py-1 ${step === i + 1 ? 'bg-indigo-600 text-white' : step > i + 1 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700'}`}>{i + 1}. {n}</li>)}</ol>
  return <div className="space-y-4 max-w-3xl">
    <h1 className="text-2xl font-bold">✅ Validar meu aprendizado</h1>
    <p className="text-sm text-slate-500">Estudou fora do app? Confira o que ficou. Fazer uma avaliação <b>não é</b> dominar o assunto: o domínio só é reconhecido quando a regra de acertos, dias e questões validadas é cumprida.</p>
    {stepper}
    {step === 1 && <div className="card space-y-3"><h2 className="font-bold">1. Escolha o assunto</h2>
      <div className="grid sm:grid-cols-2 gap-3"><label className="text-sm">Disciplina<select className={inp} value={disc} onChange={e => { setDisc(e.target.value); setTopic('') }}><option value="">Escolha…</option>{DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label className="text-sm">Assunto do edital<select className={inp} value={topic} disabled={!disc} onChange={e => setTopic(e.target.value)}><option value="">Escolha…</option>{topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label></div>
      {L && pool && <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3 space-y-1 text-sm"><p>Situação atual: <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[L.status].cls}`}>{STATUS[L.status].label}</span></p><p className="text-slate-500">{STATUS[L.status].desc}</p>
        {L.legacyLessons > 0 && <p className="text-xs text-slate-500">📚 {L.legacyLessons} aula(s) deste assunto: <b>Concluído no modelo anterior</b> (não conta como estudo externo).</p>}
        <p>Questões: <b>{pool.validated.length}</b> validadas · <b>{pool.practice.length - pool.validated.length}</b> pendentes/em complementação{pool.excluded.length ? ` · ${pool.excluded.length} fora (erro confirmado)` : ''}</p>
        <p>{L.mastery.state === 'consolidado' ? '🏆 ' : ''}{masteryText(L.mastery)}</p></div>}
      <button className="btn-p" disabled={!topic} onClick={() => setStep(2)}>Continuar</button></div>}
    {step === 2 && L && <div className="card space-y-3"><h2 className="font-bold">2. Estudo teórico</h2><p className="text-sm">Você estudou a teoria de <b>{topics.find(t => t.id === topic)?.title}</b> com seu material externo?</p>
      <div className="flex flex-wrap gap-2">{([['teoria', 'Sim, concluí o estudo teórico'], ['estudando', 'Ainda estou estudando'], ['limpo', 'Não registrar agora']] as const).map(([k, l]) => <button key={k} className={p.marks?.[topic]?.state === k ? 'btn-p' : 'btn-s'} onClick={() => setMark(topic, k, entry || undefined)}>{l}</button>)}</div>
      <label className="text-sm block">Vincular a um registro do Diário (opcional)<select className={inp} value={entry} onChange={e => setEntry(e.target.value)}><option value="">Nenhum</option>{entries.map(e => <option key={e.id} value={e.id}>{e.date.slice(8)}/{e.date.slice(5, 7)} · {e.source} · {fmtMin(e.minutes)}</option>)}</select></label>
      {!entries.length && <p className="text-xs text-slate-500">Nenhum estudo deste assunto no Diário. <button className="underline text-indigo-600" onClick={() => go('diary')}>Registrar estudo</button></p>}
      <div className="flex gap-2"><button className="btn-s" onClick={() => setStep(1)}>Voltar</button><button className="btn-p" onClick={() => setStep(3)}>Continuar para as questões</button></div></div>}
    {step === 3 && pool && !qs.length && <div className="card space-y-3"><h2 className="font-bold">3. Responder questões</h2>
      <div className="grid sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Modo">{([['avaliacao', 'Avaliação', 'Só questões validadas. Conta para o domínio.'], ['pratica', 'Prática', 'Também usa questões pendentes. Nunca conta para o domínio.']] as const).map(([k, n, d]) => <label key={k} className={`rounded-xl border p-3 cursor-pointer ${mode === k ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-300 dark:border-slate-600'}`}><input type="radio" className="mr-2" checked={mode === k} onChange={() => setMode(k)} /><b>{n}</b><span className="block text-xs text-slate-500">{d}</span></label>)}</div>
      {avail.length === 0 ? <div className="text-sm space-y-2"><p>{mode === 'avaliacao' ? `${MASTERY_SHORT} Este assunto ainda não tem questões validadas.` : 'Este assunto não tem questões disponíveis.'}</p>{mode === 'avaliacao' && pool.practice.length > 0 && <button className="btn-s" onClick={() => setMode('pratica')}>Fazer uma prática ({pool.practice.length} questões)</button>}</div>
        : <><label className="text-sm block">Quantidade de questões: <b>{count}</b> de {avail.length} disponíveis<input type="range" className="w-full" min={1} max={avail.length} value={Math.min(count, avail.length)} onChange={e => setCount(Number(e.target.value))} /></label>
          {mode === 'avaliacao' && avail.length < p.settings.mastery.minDistinct && <p className="text-xs text-amber-700 dark:text-amber-300">Há {avail.length} questão(ões) validada(s); o critério de domínio pede {p.settings.mastery.minDistinct} distintas. Dá para avaliar, mas o domínio só será reconhecido quando houver mais.</p>}
          <p className="text-xs text-slate-500">Só aparecem questões deste assunto; nunca completamos com outros assuntos.</p></>}
      <div className="flex gap-2"><button className="btn-s" onClick={() => setStep(2)}>Voltar</button><button className="btn-p" disabled={!avail.length} onClick={start}>Começar</button></div></div>}
    {step === 3 && qs.length > 0 && <div className="space-y-3"><div className="card flex flex-wrap items-center justify-between gap-2"><p className="text-sm"><b>{mode === 'avaliacao' ? 'Avaliação' : 'Prática'}</b> · {Object.keys(ans).length}/{qs.length} respondidas</p><div className="flex gap-2"><button className="btn-s" onClick={() => { setQs([]); setAns({}) }}>Cancelar</button><button className="btn-p" disabled={!Object.keys(ans).length} onClick={finish}>Finalizar</button></div></div>
      {qs.map((q, i) => <fieldset key={q.id} className="card"><legend className="sr-only">Questão {i + 1}</legend><p className="text-xs text-slate-500">Questão {i + 1}</p><p className="font-medium mb-2">{q.stem}</p>
        <div className="space-y-2">{q.options.map(o => <label key={o.id} className={`flex gap-2 rounded-xl border p-3 cursor-pointer ${ans[q.id] === o.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-300 dark:border-slate-600'}`}><input type="radio" name={q.id} checked={ans[q.id] === o.id} onChange={() => setAns({ ...ans, [q.id]: o.id })} /><span><b>{o.id})</b> {o.text}</span></label>)}</div></fieldset>)}
      <button className="btn-p" disabled={!Object.keys(ans).length} onClick={finish}>Finalizar e ver resultado</button></div>}
    {step === 4 && res && L && (() => { const sc = score(res.items), wrong = res.qs.filter((q, i) => res.items[i][2] === 0), m = L.mastery; return <div className="space-y-3">
      <div className="card space-y-2"><h2 className="font-bold">4. Resultado — {res.mode === 'avaliacao' ? 'Avaliação' : 'Prática'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">{[['Acertos', sc.ok], ['Erros', sc.n - sc.ok], ['Aproveitamento', `${sc.pct}%`], ['Tempo', fmtMin(Math.max(1, Math.round(res.sec / 60)))]].map(([k, v]) => <div key={k as string} className="rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3"><p className="text-xs text-slate-500">{k}</p><p className="text-xl font-extrabold">{v}</p></div>)}</div>
        <p className="text-sm">Situação do assunto agora: <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[L.status].cls}`}>{STATUS[L.status].label}</span></p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{res.mode === 'pratica' ? 'Prática: este resultado não conta para o domínio consolidado.' : masteryText(m)}</p></div>
      {wrong.length > 0 && <div className="card"><h3 className="font-semibold mb-1">Pontos para revisar</h3><p className="text-sm text-slate-500">Você errou {wrong.length} questão(ões). Elas já estão no Caderno de Erros.</p></div>}
      {res.qs.map((q, i) => { const ok = res.items[i][2] === 1; return <details key={q.id} className="card" open={!ok}><summary className="cursor-pointer"><span className={ok ? 'text-emerald-600' : 'text-rose-600'}>{ok ? '✓ Acertou' : '✗ Errou'}</span> · {q.stem.slice(0, 110)}{q.stem.length > 110 ? '…' : ''} <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${VALIDATION[vOf(q.id)].cls}`}>{VALIDATION[vOf(q.id)].label}</span></summary>
        <ul className="mt-2 space-y-1 text-sm">{q.options.map(o => <li key={o.id} className={o.id === q.answer ? 'text-emerald-700 dark:text-emerald-300' : o.id === res.items[i][1] ? 'text-rose-700 dark:text-rose-300' : ''}><b>{o.id})</b> {o.text}{o.id === q.answer ? ' ← gabarito' : o.id === res.items[i][1] ? ' ← sua resposta' : ''}<br /><span className="text-xs text-slate-500">{o.why}</span></li>)}</ul></details> })}
      <button className="btn-p" onClick={() => setStep(5)}>Ver reforço sugerido</button></div> })()}
    {step === 5 && res && L && <div className="card space-y-3"><h2 className="font-bold">5. Reforço</h2><p className="text-sm text-slate-500">Sugestões a partir do seu desempenho registrado (sem IA). O material do app é complementar ao seu estudo externo.</p>
      <ul className="space-y-2">{suggestionsFor(p, topic, res.items, L.status === 'dominio').map(sg => <li key={sg.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-sm"><span>{sg.text}</span>{sg.page && <button className="btn-s" onClick={() => go(sg.page!, sg.lessonId)}>Abrir</button>}</li>)}</ul>
      <div className="flex gap-2"><button className="btn-s" onClick={() => setStep(4)}>Voltar</button><button className="btn-p" onClick={() => setStep(6)}>Continuar</button></div></div>}
    {step === 6 && L && <div className="card space-y-3"><h2 className="font-bold">6. Reavaliação e evolução</h2>
      {(() => { const ev = evolution(attemptsOf(p), topic); return ev.list.length ? <><ul className="space-y-1 text-sm">{ev.list.map((a, i) => <li key={a.id} className="flex justify-between"><span>{i + 1}ª tentativa · {a.day.slice(8)}/{a.day.slice(5, 7)} · {a.mode === 'avaliacao' ? 'Avaliação' : 'Prática'}</span><b>{a.ok}/{a.n} ({a.pct}%)</b></li>)}</ul>
        <p className="text-sm">{ev.delta === null ? 'Faça outra tentativa em outro dia para comparar a evolução.' : ev.delta > 0 ? `📈 Melhora de ${ev.delta} ponto(s) percentual(is) em relação à tentativa anterior.` : ev.delta < 0 ? `📉 Queda de ${-ev.delta} ponto(s) percentual(is) em relação à tentativa anterior.` : 'Mesmo aproveitamento da tentativa anterior.'}</p></> : <p className="text-sm text-slate-500">Nenhuma tentativa ainda neste assunto.</p> })()}
      <p className="text-sm">{masteryText(L.mastery)}</p>
      <div className="flex flex-wrap gap-2"><button className="btn-p" onClick={() => { setQs([]); setAns({}); setRes(null); setStep(3) }}>Nova avaliação deste assunto</button><button className="btn-s" onClick={() => { setQs([]); setAns({}); setRes(null); setTopic(''); setStep(1) }}>Escolher outro assunto</button></div></div>}
  </div>
}
