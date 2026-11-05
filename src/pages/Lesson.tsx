import { useState } from 'react'
import { QUESTIONS } from '../data/questions'
import { LESSONS } from '../data/lessons'
import { FLASHCARDS } from '../data/cards'
import { DISCIPLINES, BLOCKS, topicDiscipline } from '../data/edital'
import QuestionCard from '../components/QuestionCard'
import VideoPlayer from '../components/VideoPlayer'
import NoteBox from '../components/NoteBox'
import { topicNoteKey } from '../lib/notes'
import type { Store } from '../lib/useProgress'
let saved: { blk: string; dsc: string } | null = null
const matches = (topicId: string, b: string, d: string) => { const x = topicDiscipline(topicId); return !!x && (b === 'all' || String(x.block) === b) && (d === 'all' || x.id === d) }
export default function Lesson({ s, lessonId, onPick }: { s: Store; lessonId: string; onPick: (id: string) => void }) {
  const { p, answer, complete, setLast, toggleFav, saveNote } = s, xp = p.settings.xp
  const L = LESSONS.find(l => l.id === lessonId) ?? LESSONS[0]
  const [i, setI] = useState(0), [alt, setAlt] = useState(false)
  const qs = QUESTIONS.filter(q => L.questionIds.includes(q.id)), all = qs.every(q => p.answers[q.id]), isDone = !!p.completed[L.id]
  const cards = FLASHCARDS.filter(c => c.lessonId === L.id)
  const topic = DISCIPLINES.flatMap(d => d.topics).find(t => t.id === L.topicId), disc = topicDiscipline(L.topicId)
  const init = saved && matches(L.topicId, saved.blk, saved.dsc) ? saved : { blk: String(disc?.block ?? 'all'), dsc: disc?.id ?? 'all' }
  const [blk, setBlk] = useState(init.blk), [dsc, setDsc] = useState(init.dsc)
  const discOpts = DISCIPLINES.filter(d => blk === 'all' || String(d.block) === blk)
  const list = LESSONS.filter(l => matches(l.topicId, blk, dsc))
  const pos = list.findIndex(l => l.id === L.id), inList = pos >= 0, doneN = list.filter(l => p.completed[l.id]).length
  const pickFilter = (b: string, d: string) => { setBlk(b); setDsc(d); saved = { blk: b, dsc: d }; if (!matches(L.topicId, b, d)) { const nl = LESSONS.find(l => matches(l.topicId, b, d)); if (nl) onPick(nl.id) } }
  const go = (n: number) => { setI(n); setAlt(false); setLast(L.id) }
  const names = [...L.steps.map(st => st.title), 'Teste seu conhecimento', 'Revisão']
  const step = L.steps[i]
  return <div className="space-y-4 max-w-3xl">
    <div className="card space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-slate-500 space-y-1 block">Bloco<select className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={blk} onChange={e => pickFilter(e.target.value, 'all')}><option value="all">Todos os blocos</option>{([1, 2, 3] as const).map(b => <option key={b} value={b}>{BLOCKS[b]}</option>)}</select></label>
        <label className="text-xs text-slate-500 space-y-1 block">Matéria<select className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={dsc} onChange={e => pickFilter(blk, e.target.value)}><option value="all">Todas as matérias</option>{discOpts.map(d => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}</select></label>
        <label className="text-xs text-slate-500 space-y-1 block">Aula<select className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={L.id} onChange={e => onPick(e.target.value)}>{!inList && <option value={L.id}>{L.title}</option>}{list.map(l => <option key={l.id} value={l.id}>{p.completed[l.id] ? '✅ ' : ''}{l.title}</option>)}</select></label>
      </div>
      <div className="flex items-center gap-2 text-sm"><button className="btn-s" disabled={pos < 1} onClick={() => onPick(list[pos - 1].id)}>← Anterior</button><button className="btn-s" disabled={pos < 0 || pos >= list.length - 1} onClick={() => onPick(list[pos + 1].id)}>Próxima →</button><span className="text-slate-500 ml-auto">{doneN}/{list.length} aulas concluídas neste filtro</span></div>
    </div>
    <div><p className="text-sm text-slate-500">{disc?.name} › {topic?.title}</p><h1 className="text-2xl font-bold">Aula: {L.title} {isDone && '✅'}</h1></div>
    {L.video && <details className="card"><summary className="cursor-pointer font-semibold">🎬 Reforço em vídeo (opcional)</summary><div className="mt-3"><VideoPlayer video={L.video} /></div></details>}
    <div className="flex gap-1 flex-wrap">{names.map((n, k) => <button key={n} onClick={() => go(k)} className={`px-3 py-1 rounded-full text-sm ${k === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{k + 1}. {n}</button>)}</div>
    {step ? <div className="card space-y-3"><h2 className="font-bold text-lg">{step.title}</h2>
      {(alt && step.alt ? [step.alt] : step.body).map((t, k) => <p key={k} className={alt ? 'bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl' : ''}>{t}</p>)}
      {!alt && step.quotes?.map(qt => <blockquote key={qt.ref} className="border-l-4 border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-r-xl p-3 text-sm"><p className="font-semibold mb-1">⚖️ {qt.ref}</p><p>{qt.text}</p></blockquote>)}
      {!alt && step.table && <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">{step.table.caption && <caption className="text-left font-semibold mb-1">{step.table.caption}</caption>}<thead><tr>{step.table.head.map(h => <th key={h} className="text-left p-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">{h}</th>)}</tr></thead><tbody>{step.table.rows.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j} className={`p-2 border border-slate-200 dark:border-slate-600 align-top ${j === 0 ? 'font-semibold' : ''}`}>{c}</td>)}</tr>)}</tbody></table></div>}
      {!alt && step.quotes && <p className="text-xs text-slate-500">Texto conferido em fontes públicas. Antes da prova, confirme a redação vigente no site do Planalto (Código Penal compilado).</p>}
      <div className="flex gap-2 flex-wrap">{step.alt && <button className="btn-s" onClick={() => setAlt(!alt)}>{alt ? '↩ Voltar à explicação' : '🤔 Não entendi'}</button>}<button className="btn-s" disabled title="Depende da Tutora IA (fase 5)">🌱 Explique como iniciante (em breve)</button></div>
      <button className="btn-p" onClick={() => go(i + 1)}>Próximo →</button></div>
    : i === L.steps.length ? <div className="space-y-4">{qs.map((q, n) => <QuestionCard key={q.id} q={q} n={n + 1} answer={p.answers[q.id]} fav={p.favorites.includes(q.id)} onAnswer={answer} onFav={toggleFav} xpQuestion={xp.question} note={p.notes[`question:${q.id}`]?.text} onNote={saveNote} />)}
      <button className="btn-p" onClick={() => go(i + 1)}>Ir para a revisão →</button></div>
    : <div className="card space-y-3"><h2 className="font-bold text-lg">Revisão</h2>
      <p>Ao concluir a aula, {cards.length} flashcards entram na Central de Revisões. Questões que você errar também viram flashcards.</p>
      <ul className="list-disc ml-5 text-sm">{cards.map(c => <li key={c.id}>{c.front}</li>)}</ul>
      <button className="btn-p" disabled={!all || isDone} onClick={() => complete(L.id)}>{isDone ? 'Aula concluída — flashcards na Central de Revisões' : all ? `Concluir aula (+${xp.lesson} XP)` : 'Responda todas as questões do teste para concluir'}</button></div>}
    <div className="card"><NoteBox key={topicNoteKey(L.topicId)} label={`📝 Minhas anotações sobre ${L.title} (aparecem também nas revisões)`} value={p.notes[topicNoteKey(L.topicId)]?.text ?? ''} onSave={t => saveNote(topicNoteKey(L.topicId), t)} rows={4} /></div></div>
}
