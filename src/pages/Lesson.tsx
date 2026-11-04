import { useState } from 'react'
import { QUESTIONS } from '../data/questions'
import { LESSONS } from '../data/lessons'
import { FLASHCARDS } from '../data/cards'
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import QuestionCard from '../components/QuestionCard'
import VideoPlayer from '../components/VideoPlayer'
import NoteBox from '../components/NoteBox'
import { topicNoteKey } from '../lib/notes'
import type { Store } from '../lib/useProgress'
export default function Lesson({ s, lessonId, onPick }: { s: Store; lessonId: string; onPick: (id: string) => void }) {
  const { p, answer, complete, setLast, toggleFav, saveNote } = s, xp = p.settings.xp
  const L = LESSONS.find(l => l.id === lessonId) ?? LESSONS[0]
  const [i, setI] = useState(0), [alt, setAlt] = useState(false)
  const qs = QUESTIONS.filter(q => L.questionIds.includes(q.id)), all = qs.every(q => p.answers[q.id]), isDone = !!p.completed[L.id]
  const cards = FLASHCARDS.filter(c => c.lessonId === L.id)
  const topic = DISCIPLINES.flatMap(d => d.topics).find(t => t.id === L.topicId), disc = topicDiscipline(L.topicId)
  const go = (n: number) => { setI(n); setAlt(false); setLast(L.id) }
  const names = [...L.steps.map(st => st.title), 'Teste seu conhecimento', 'Revisão']
  const step = L.steps[i]
  return <div className="space-y-4 max-w-3xl">
    <div className="flex gap-2 flex-wrap">{LESSONS.map(l => <button key={l.id} onClick={() => onPick(l.id)} className={`px-3 py-1 rounded-full text-sm border ${l.id === L.id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>{p.completed[l.id] ? '✅ ' : ''}{l.title}</button>)}</div>
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
