import { useState } from 'react'
import { CRASE_LESSON as L, QUESTIONS } from '../data/crase'
import { XP } from '../config'
import type { OptId, Progress } from '../types'
export default function Lesson({ p, answer, complete, setLast }: { p: Progress; answer: (q: string, c: OptId, ok: boolean) => void; complete: (id: string) => void; setLast: (id: string) => void }) {
  const [i, setI] = useState(0), [alt, setAlt] = useState(false)
  const qs = QUESTIONS.filter(q => L.questionIds.includes(q.id)), all = qs.every(q => p.answers[q.id]), isDone = !!p.completed[L.id]
  const go = (n: number) => { setI(n); setAlt(false); setLast(L.id) }
  const names = [...L.steps.map(s => s.title), 'Teste seu conhecimento']
  return <div className="space-y-4 max-w-3xl"><div><p className="text-sm text-slate-500">Língua Portuguesa › Tópico 12 do Anexo VIII</p><h1 className="text-2xl font-bold">Aula: {L.title} {isDone && '✅'}</h1></div>
    <div className="flex gap-1 flex-wrap">{names.map((n, k) => <button key={n} onClick={() => go(k)} className={`px-3 py-1 rounded-full text-sm ${k === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{k + 1}. {n}</button>)}</div>
    {i < L.steps.length ? <div className="card space-y-3"><h2 className="font-bold text-lg">{L.steps[i].title}</h2>{(alt && L.steps[i].alt ? [L.steps[i].alt!] : L.steps[i].body).map((t, k) => <p key={k} className={alt ? 'bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl' : ''}>{t}</p>)}
      <div className="flex gap-2 flex-wrap">{L.steps[i].alt && <button className="btn-s" onClick={() => setAlt(!alt)}>{alt ? '↩ Voltar à explicação' : '🤔 Não entendi'}</button>}<button className="btn-s" disabled title="Depende da Tutora IA (fase 5)">🌱 Explique como iniciante (em breve)</button></div>
      <button className="btn-p" onClick={() => go(i + 1)}>Próximo →</button></div>
    : <div className="space-y-4">{qs.map((q, n) => { const a = p.answers[q.id]; return <div key={q.id} className="card"><p className="text-xs text-slate-500 mb-1">Questão {n + 1} · {q.difficulty} · Inédita (gerada por IA, não é de prova anterior)</p><p className="font-medium mb-3">{q.stem}</p><div className="space-y-2">{q.options.map(op => { const sel = a?.chosen === op.id, right = a && op.id === q.answer; return <div key={op.id}><button disabled={!!a} onClick={() => answer(q.id, op.id, op.id === q.answer)} className={`w-full text-left rounded-xl border p-3 ${right ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : sel ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}`}><b>{op.id})</b> {op.text}</button>{a && <p className="text-xs text-slate-500 ml-3 mt-1">{op.why}</p>}</div> })}</div>{a && <p className={`mt-3 font-semibold ${a.correct ? 'text-emerald-600' : 'text-rose-600'}`}>{a.correct ? `Correto! ${a.everCorrect && XP.question ? `(+${XP.question} XP na 1ª vez)` : ''}` : `Incorreto. Gabarito: ${q.answer}. (Caderno de Erros: em breve)`}</p>}</div> })}
      <button className="btn-p" disabled={!all || isDone} onClick={() => complete(L.id)}>{isDone ? 'Aula concluída' : all ? `Concluir aula (+${XP.lesson} XP)` : 'Responda todas as questões para concluir'}</button></div>}</div>
}
