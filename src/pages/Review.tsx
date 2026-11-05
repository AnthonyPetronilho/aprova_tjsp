import { useState } from 'react'
import { cardById } from '../data/cards'
import { schedule, RATING_LABELS, isDue, isMastered, intervalLabel } from '../lib/srs'
import { addDays, todayStr } from '../lib/dates'
import NoteBox from '../components/NoteBox'
import { cardNoteKey, topicNoteKey } from '../lib/notes'
import type { Rating } from '../types'
import type { Store } from '../lib/useProgress'
import Bar from '../components/Bar'
const COLORS = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500']
export default function Review({ s }: { s: Store }) {
  const { p, rate, finishReview, saveNote } = s, t = todayStr()
  const [queue, setQueue] = useState<string[] | null>(null), [shown, setShown] = useState(false), [total, setTotal] = useState(0), [done, setDone] = useState(false)
  const ids = Object.keys(p.cards).filter(id => cardById(id))
  const avail = ids.filter(id => isDue(p.cards[id], t)).sort((a, b) => p.cards[a].due.localeCompare(p.cards[b].due))
  const overdue = ids.filter(id => p.cards[id].due < t).length, mastered = ids.filter(id => isMastered(p.cards[id])).length
  const recent = p.reviewLog.slice(-50), retention = recent.length ? Math.round((recent.filter(r => r.rating > 0).length / recent.length) * 100) : null
  const upcoming = Array.from({ length: 7 }, (_, k) => { const d = addDays(t, k + 1); return { d, n: ids.filter(id => p.cards[id].due === d).length } })
  const start = () => { setQueue(avail); setTotal(avail.length); setShown(false); setDone(false) }
  const onRate = (id: string, r: Rating) => {
    rate(id, r); const rest = (queue ?? []).slice(1), next = r === 0 ? [...rest, id] : rest
    setShown(false); setQueue(next)
    if (!next.length) { finishReview(); setDone(true) }
  }
  if (queue && !done && queue.length) {
    const id = queue[0], c = cardById(id)!, st = p.cards[id]
    return <div className="max-w-2xl space-y-4"><div className="flex justify-between text-sm text-slate-500"><span>Revisão · restam {queue.length} (de {total} no início)</span><button className="underline" onClick={() => setQueue(null)}>Sair</button></div>
      <Bar pct={Math.round(((total - Math.min(total, queue.length)) / Math.max(total, 1)) * 100)} />
      <div className="card min-h-[12rem] flex flex-col justify-between gap-4"><p className="text-xs text-slate-500">{c.origin === 'erro' ? 'Card gerado a partir de um erro' : 'Card da aula'}</p>
        <p className="text-lg whitespace-pre-line">{c.front}</p>
        {shown && <p className="whitespace-pre-line border-t border-slate-200 dark:border-slate-700 pt-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3">{c.back}</p>}
        {!shown && p.notes[cardNoteKey(id)]?.text && <p className="text-xs text-slate-500">📝 Você tem uma anotação neste card (aparece depois de mostrar a resposta).</p>}</div>
      {shown && <div className="card space-y-3">{p.notes[topicNoteKey(c.topicId)]?.text && <details><summary className="cursor-pointer text-sm font-semibold">📝 Anotação da aula</summary><p className="whitespace-pre-line text-sm mt-2">{p.notes[topicNoteKey(c.topicId)].text}</p></details>}
        <NoteBox key={cardNoteKey(id)} value={p.notes[cardNoteKey(id)]?.text ?? ''} onSave={t => saveNote(cardNoteKey(id), t)} /></div>}
      {!shown ? <button className="btn-p w-full" onClick={() => setShown(true)}>Mostrar resposta</button>
        : <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{([0, 1, 2, 3] as Rating[]).map(r => <button key={r} onClick={() => onRate(id, r)} className={`btn text-white ${COLORS[r]}`}>{RATING_LABELS[r]}<span className="block text-xs font-normal opacity-90">{intervalLabel(schedule(st, r, t))}</span></button>)}</div>}</div>
  }
  if (done) return <div className="card max-w-xl space-y-3"><h1 className="text-xl font-bold">🎉 Revisão concluída!</h1><p>Você revisou {total} card(s). {p.reviewXpDays.includes(t) ? `O bônus de revisão (+${p.settings.xp.review} XP) é concedido uma vez por dia.` : ''}</p><button className="btn-p" onClick={() => { setQueue(null); setDone(false) }}>Voltar à Central</button></div>
  return <div className="space-y-4"><h1 className="text-2xl font-bold">🔁 Central de Revisões</h1>
    {!ids.length && <div className="card"><p>Você ainda não tem flashcards. Conclua uma aula ou erre uma questão para gerar os primeiros cards.</p></div>}
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="card"><p className="text-sm text-slate-500">Disponíveis hoje</p><p className="text-3xl font-extrabold text-indigo-600">{avail.length}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Atrasados</p><p className="text-3xl font-extrabold text-rose-500">{overdue}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Dominados</p><p className="text-3xl font-extrabold text-emerald-600">{mastered}</p><p className="text-xs text-slate-500">intervalo ≥ 21 dias</p></div>
      <div className="card"><p className="text-sm text-slate-500">Total no baralho</p><p className="text-3xl font-extrabold">{ids.length}</p></div>
      <div className="card col-span-2 lg:col-span-1"><p className="text-sm text-slate-500">Taxa de lembrança</p><p className="text-3xl font-extrabold text-violet-600">{retention === null ? '—' : `${retention}%`}</p><p className="text-xs text-slate-500">{recent.length ? `% de respostas diferentes de “Esqueci” nas últimas ${recent.length} avaliações${recent.length < 10 ? ' (poucos dados)' : ''}` : 'Sem revisões ainda'}</p></div></div>
    <div className="card"><button className="btn-p" disabled={!avail.length} onClick={start}>{avail.length ? `Iniciar revisão (${avail.length})` : 'Nada para revisar agora'}</button></div>
    <div className="card"><h2 className="font-bold mb-3">📅 Próximas revisões (7 dias)</h2><ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-sm">{upcoming.map(u => <li key={u.d} className="rounded-xl bg-slate-100 dark:bg-slate-700 p-2 text-center"><p className="text-xs text-slate-500">{u.d.slice(8)}/{u.d.slice(5, 7)}</p><p className="font-bold">{u.n}</p></li>)}</ul></div></div>
}
