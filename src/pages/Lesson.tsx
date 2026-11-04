import { useState } from 'react'
import { CRASE_LESSON as L, QUESTIONS } from '../data/crase'
import { FLASHCARDS } from '../data/cards'
import NoteBox from '../components/NoteBox'
import { topicNoteKey } from '../lib/notes'
import QuestionCard from '../components/QuestionCard'
import type { Store } from '../lib/useProgress'
export default function Lesson({ s }: { s: Store }) {
  const { p, answer, complete, setLast, toggleFav, saveNote } = s, xp = p.settings.xp
  const [i, setI] = useState(0), [alt, setAlt] = useState(false)
  const qs = QUESTIONS.filter(q => L.questionIds.includes(q.id)), all = qs.every(q => p.answers[q.id]), isDone = !!p.completed[L.id]
  const cards = FLASHCARDS.filter(c => c.lessonId === L.id)
  const go = (n: number) => { setI(n); setAlt(false); setLast(L.id) }
  const names = [...L.steps.map(st => st.title), 'Teste seu conhecimento', 'Revisão']
  const step = L.steps[i]
  return <div className="space-y-4 max-w-3xl"><div><p className="text-sm text-slate-500">Língua Portuguesa › Tópico 12 do Anexo VIII</p><h1 className="text-2xl font-bold">Aula: {L.title} {isDone && '✅'}</h1></div>
    <div className="flex gap-1 flex-wrap">{names.map((n, k) => <button key={n} onClick={() => go(k)} className={`px-3 py-1 rounded-full text-sm ${k === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{k + 1}. {n}</button>)}</div>
    {step ? <div className="card space-y-3"><h2 className="font-bold text-lg">{step.title}</h2>{(alt && step.alt ? [step.alt] : step.body).map((t, k) => <p key={k} className={alt ? 'bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl' : ''}>{t}</p>)}
      <div className="flex gap-2 flex-wrap">{step.alt && <button className="btn-s" onClick={() => setAlt(!alt)}>{alt ? '↩ Voltar à explicação' : '🤔 Não entendi'}</button>}<button className="btn-s" disabled title="Depende da Tutora IA (fase 5)">🌱 Explique como iniciante (em breve)</button></div>
      <button className="btn-p" onClick={() => go(i + 1)}>Próximo →</button></div>
    : i === L.steps.length ? <div className="space-y-4">{qs.map((q, n) => <QuestionCard key={q.id} q={q} n={n + 1} answer={p.answers[q.id]} fav={p.favorites.includes(q.id)} onAnswer={answer} onFav={toggleFav} xpQuestion={xp.question} note={p.notes[`question:${q.id}`]?.text} onNote={saveNote} />)}
      <button className="btn-p" onClick={() => go(i + 1)}>Ir para a revisão →</button></div>
    : <div className="card space-y-3"><h2 className="font-bold text-lg">Revisão</h2>
      <p>Ao concluir a aula, {cards.length} flashcards entram na Central de Revisões. Questões que você errar também viram flashcards.</p>
      <ul className="list-disc ml-5 text-sm">{cards.map(c => <li key={c.id}>{c.front}</li>)}</ul>
      <button className="btn-p" disabled={!all || isDone} onClick={() => complete(L.id)}>{isDone ? 'Aula concluída — flashcards na Central de Revisões' : all ? `Concluir aula (+${xp.lesson} XP)` : 'Responda todas as questões do teste para concluir'}</button></div>}
    <div className="card"><NoteBox key={topicNoteKey(L.topicId)} label="📝 Minhas anotações sobre Crase (aparecem também nas revisões)" value={p.notes[topicNoteKey(L.topicId)]?.text ?? ''} onSave={t => saveNote(topicNoteKey(L.topicId), t)} rows={4} /></div></div>
}
