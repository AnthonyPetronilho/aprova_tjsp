import { useState } from 'react'
import type { Answer, OptId, Question } from '../types'
import NoteBox from './NoteBox'
const ORIGIN: Record<Question['origin'], string> = { 'inedita-ia': 'Inédita (gerada por IA, não é de prova anterior)', 'prova-anterior': 'Prova anterior', autoral: 'Autoral (cadastrada por você)', 'ia-revisada': 'Gerada por IA e revisada por você' }
interface Props { q: Question; n?: number; answer?: Answer; fav: boolean; onAnswer: (q: string, c: OptId, ok: boolean) => void; onFav: (q: string) => void; startRedo?: boolean; label?: string; xpQuestion: number; note?: string; onNote: (key: string, text: string) => void }
export default function QuestionCard({ q, n, answer, fav, onAnswer, onFav, startRedo, label, xpQuestion, note, onNote }: Props) {
  const [redo, setRedo] = useState(!!startRedo)
  const a = redo ? undefined : answer
  const pick = (id: OptId) => { onAnswer(q.id, id, id === q.answer); setRedo(false) }
  return <div className="card">
    <div className="flex justify-between gap-2 mb-1"><p className="text-xs text-slate-500">{n ? `Questão ${n} · ` : ''}{q.difficulty} · {ORIGIN[q.origin]}{label ? ` · ${label}` : ''}</p>
      <button aria-label={fav ? 'Remover dos favoritos' : 'Favoritar'} title="Favoritar" onClick={() => onFav(q.id)} className="text-lg leading-none">{fav ? '⭐' : '☆'}</button></div>
    <p className="font-medium mb-3">{q.stem}</p>
    <div className="space-y-2">{q.options.map(op => { const sel = a?.chosen === op.id, right = a && op.id === q.answer
      return <div key={op.id}><button disabled={!!a} onClick={() => pick(op.id)} className={`w-full text-left rounded-xl border p-3 ${right ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : sel ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}`}><b>{op.id})</b> {op.text}</button>{a && <p className="text-xs text-slate-500 ml-3 mt-1">{op.why}</p>}</div> })}</div>
    {a && <div className="mt-3 flex flex-wrap items-center gap-3"><p className={`font-semibold ${a.correct ? 'text-emerald-600' : 'text-rose-600'}`}>{a.correct ? `Correto!${a.everCorrect && xpQuestion ? ` (+${xpQuestion} XP só na 1ª vez que acertar)` : ''}` : `Incorreto. Gabarito: ${q.answer}. Registrada no Caderno de Erros e enviada para revisão.`}</p><button className="btn-s !py-1 text-sm" onClick={() => setRedo(true)}>🔁 Refazer</button></div>}
    {a && <details className="mt-3" open={!!note}><summary className="cursor-pointer text-sm font-semibold">📝 Anotação{note ? ' (salva)' : ''}</summary><div className="mt-2"><NoteBox key={q.id} label="Anote o que não pode esquecer sobre esta questão" value={note ?? ''} onSave={t => onNote(`question:${q.id}`, t)} /></div></details>}
  </div>
}
