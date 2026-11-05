import { useState } from 'react'
import NoteBox from '../components/NoteBox'
import { describeNote } from '../lib/notes'
import type { Store } from '../lib/useProgress'
export default function Notes({ s }: { s: Store }) {
  const { p, saveNote } = s, [q, setQ] = useState('')
  const all = Object.entries(p.notes).filter(([, n]) => n.text.trim()).map(([key, n]) => ({ key, n, ...describeNote(key) })).sort((a, b) => b.n.updatedAt.localeCompare(a.n.updatedAt))
  const list = all.filter(x => !q.trim() || (x.n.text + ' ' + x.title).toLowerCase().includes(q.trim().toLowerCase()))
  return <div className="space-y-4 max-w-3xl"><h1 className="text-2xl font-bold">📝 Minhas Anotações</h1>
    <p className="text-sm text-slate-500">Escreva anotações nas aulas, nas questões (depois de responder) e durante as revisões. Tudo fica reunido aqui. Apagar todo o texto de uma anotação a exclui.</p>
    {all.length > 0 && <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar nas anotações…" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2" />}
    {!all.length && <div className="card">Você ainda não tem anotações. Abra uma revisão, mostre a resposta e escreva algo para lembrar.</div>}
    {all.length > 0 && !list.length && <div className="card">Nada encontrado para “{q}”.</div>}
    {list.map(x => <div key={x.key} className="card space-y-2"><div className="flex justify-between gap-2"><div><p className="text-xs text-slate-500">{x.kind} · atualizada em {x.n.updatedAt.split('-').reverse().join('/')}</p><p className="text-sm font-medium line-clamp-2 whitespace-pre-line">{x.title}</p></div><button className="btn-s !py-1 text-sm h-fit" onClick={() => saveNote(x.key, '')}>Excluir</button></div>
      <NoteBox key={x.key} label="Anotação" value={x.n.text} onSave={t => saveNote(x.key, t)} rows={3} /></div>)}</div>
}
