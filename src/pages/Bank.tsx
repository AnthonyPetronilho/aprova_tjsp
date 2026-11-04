import { useState } from 'react'
import { QUESTIONS } from '../data/questions'
import { DISCIPLINES, topicDiscipline } from '../data/edital'
import { LESSONS } from '../data/lessons'
import QuestionCard from '../components/QuestionCard'
import type { Store } from '../lib/useProgress'
const sel = 'rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm'
export default function Bank({ s }: { s: Store }) {
  const { p, answer, toggleFav, saveNote } = s
  const [topic, setTopic] = useState('all'), [disc, setDisc] = useState('all'), [dif, setDif] = useState('all'), [st, setSt] = useState('all')
  const list = QUESTIONS.filter(q => (disc === 'all' || topicDiscipline(q.topicId)?.id === disc) && (topic === 'all' || q.topicId === topic) && (dif === 'all' || q.difficulty === dif) && (st === 'all' || (st === 'wrong' ? p.answers[q.id] && !p.answers[q.id].correct : st === 'new' ? !p.answers[q.id] : p.favorites.includes(q.id))))
  return <div className="space-y-4 max-w-3xl"><h1 className="text-2xl font-bold">✏️ Banco de Questões</h1>
    <p className="text-sm text-slate-500">O banco tem {QUESTIONS.length} questões inéditas, 5 por aula, em {LESSONS.length} aulas.</p>
    <div className="flex flex-wrap gap-2"><select className={sel} value={disc} onChange={e => setDisc(e.target.value)}><option value="all">Todas as matérias</option>{DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
      <select className={sel} value={topic} onChange={e => setTopic(e.target.value)}><option value="all">Todos os assuntos</option>{DISCIPLINES.flatMap(d => d.topics).filter(t => QUESTIONS.some(q => q.topicId === t.id)).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
      <select className={sel} value={dif} onChange={e => setDif(e.target.value)}><option value="all">Toda dificuldade</option><option>Fácil</option><option>Médio</option><option>Difícil</option></select>
      <select className={sel} value={st} onChange={e => setSt(e.target.value)}><option value="all">Todas</option><option value="wrong">Erradas</option><option value="new">Não respondidas</option><option value="fav">Favoritas</option></select></div>
    {list.length ? list.map((q, n) => <QuestionCard key={q.id} q={q} n={n + 1} answer={p.answers[q.id]} fav={p.favorites.includes(q.id)} onAnswer={answer} onFav={toggleFav} xpQuestion={p.settings.xp.question} note={p.notes[`question:${q.id}`]?.text} onNote={saveNote} label={topicDiscipline(q.topicId)?.name} />) : <div className="card">Nenhuma questão com esses filtros.</div>}</div>
}
