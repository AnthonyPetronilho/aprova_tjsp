import { QUESTIONS } from '../data/questions'
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { LESSONS } from '../data/lessons'
import QuestionCard from '../components/QuestionCard'
import type { Store } from '../lib/useProgress'
export default function Errors({ s, go }: { s: Store; go: (page: string, lessonId?: string) => void }) {
  const { p, answer, toggleFav, saveNote } = s
  const entries = Object.entries(p.errors).filter(([q]) => QUESTIONS.some(x => x.id === q))
  const open = entries.filter(([, e]) => !e.resolved).sort((a, b) => b[1].lastAt.localeCompare(a[1].lastAt)), solved = entries.filter(([, e]) => e.resolved)
  const byTopic: Record<string, number> = {}
  open.forEach(([qid, e]) => { const q = QUESTIONS.find(x => x.id === qid)!; byTopic[q.topicId] = (byTopic[q.topicId] ?? 0) + e.count })
  const worst = Object.entries(byTopic).sort((a, b) => b[1] - a[1])
  const topicName = (id: string) => DISCIPLINES.flatMap(d => d.topics).find(t => t.id === id)?.title ?? id
  return <div className="space-y-4 max-w-3xl"><h1 className="text-2xl font-bold">📓 Caderno de Erros</h1>
    {!entries.length && <div className="card">Nenhum erro registrado. Quando você errar uma questão, ela aparece aqui e vira flashcard automaticamente.</div>}
    {worst.length > 0 && <div className="card"><h2 className="font-bold mb-2">Assuntos com mais erros pendentes</h2><ul className="text-sm space-y-1">{worst.map(([tid, n]) => <li key={tid}>• {topicName(tid)} — {n} erro(s)</li>)}</ul>
      {LESSONS.some(l => l.topicId === worst[0][0]) && <p className="text-sm mt-3">Sugestão: reveja a aula deste assunto e refaça as questões abaixo.</p>}
      <div className="flex gap-2 mt-3">{LESSONS.some(l => l.topicId === worst[0][0]) && <button className="btn-s" onClick={() => go('lesson', LESSONS.find(l => l.topicId === worst[0][0])!.id)}>Rever aula</button>}<button className="btn-s" onClick={() => go('review')}>Ir às revisões</button></div></div>}
    {open.map(([qid, e]) => { const q = QUESTIONS.find(x => x.id === qid)!; return <QuestionCard key={qid} q={q} startRedo answer={p.answers[qid]} fav={p.favorites.includes(qid)} onAnswer={answer} onFav={toggleFav} xpQuestion={p.settings.xp.question} note={p.notes[`question:${qid}`]?.text} onNote={saveNote} label={`${e.count} erro(s) · ${topicDiscipline(q.topicId)?.name}`} /> })}
    {solved.length > 0 && <details className="card"><summary className="cursor-pointer font-semibold">Resolvidos ({solved.length})</summary><ul className="text-sm mt-2 space-y-1">{solved.map(([qid]) => <li key={qid}>✓ {QUESTIONS.find(x => x.id === qid)!.stem}</li>)}</ul></details>}</div>
}
