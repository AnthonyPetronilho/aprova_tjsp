import { useState } from 'react'
import { useProgress } from './lib/useProgress'
import { suggestLesson } from './lib/study'
import Dashboard from './pages/Dashboard'
import Edital from './pages/Edital'
import Lesson from './pages/Lesson'
import Review from './pages/Review'
import Bank from './pages/Bank'
import Errors from './pages/Errors'
import Notes from './pages/Notes'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import Plan from './pages/Plan'
import Mocks from './pages/Mocks'
import Essay from './pages/Essay'
import Admin from './pages/Admin'
import { useContent } from './lib/content'
import Toasts from './components/Toasts'
import Soon from './pages/Soon'
const BASE: { title: string; items: [string, string, string][] }[] = [
  { title: 'Estudar', items: [['home', '🏠', 'Início'], ['edital', '🗺️', 'Edital'], ['lesson', '📚', 'Estudar'], ['review', '🔁', 'Revisões'], ['bank', '✏️', 'Questões'], ['errors', '📓', 'Erros'], ['notes', '📝', 'Anotações']] },
  { title: 'Praticar', items: [['mocks', '🧪', 'Simulados'], ['essay', '✍️', 'Redação']] },
  { title: 'Planejar', items: [['plan', '📅', 'Cronograma'], ['progress', '📈', 'Evolução']] },
  { title: 'Mais', items: [['settings', '⚙️', 'Configurações'], ['soon', '🚧', 'Em breve']] },
]
const ADMIN: [string, string, string] = ['admin', '🛠️', 'Admin']
const MAIN = ['home', 'lesson', 'review', 'mocks']
const ALL = [...BASE.flatMap(g => g.items), ADMIN]
export default function App() {
  const s = useProgress(), { p, toggleDark, toasts, dismiss } = s, content = useContent()
  const GROUPS = content.editor ? BASE.map(g => g.title === 'Mais' ? { ...g, items: [ADMIN, ...g.items] } : g) : BASE
  const [page, setPage] = useState('home'), [lessonId, setLessonId] = useState<string | null>(null), [more, setMore] = useState(false)
  const go = (pg: string, id?: string) => { if (pg === 'lesson' && (id || !lessonId)) setLessonId(id ?? suggestLesson(p)); setPage(pg); setMore(false); window.scrollTo?.(0, 0) }
  const Btn = ({ k, e, n }: { k: string; e: string; n: string }) => <button onClick={() => go(k)} className={`text-left rounded-xl px-3 py-2 ${page === k ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{e} {n}</button>
  return <div className="min-h-screen md:flex">
    <aside className="hidden md:flex md:flex-col w-56 shrink-0 p-4 gap-1 border-r border-slate-200 dark:border-slate-700"><p className="font-extrabold text-xl text-indigo-600 mb-3">🎓 Aprova TJSP</p>
      {GROUPS.map(g => <div key={g.title} className="flex flex-col gap-1 mb-2"><p className="text-[11px] uppercase tracking-wide text-slate-400 px-3">{g.title}</p>{g.items.map(([k, e, n]) => <Btn key={k} k={k} e={e} n={n} />)}</div>)}
      <button className="btn-s mt-auto" onClick={toggleDark}>{p.dark ? '☀️ Modo claro' : '🌙 Modo escuro'}</button></aside>
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 min-w-0">
      <button className="md:hidden btn-s mb-3 text-sm" onClick={toggleDark}>{p.dark ? '☀️' : '🌙'}</button>
      {p.mockRun && page !== 'mocks' && <div className="card mb-4 flex flex-wrap items-center gap-2 border-indigo-400"><span className="flex-1">🧪 Você tem um simulado em andamento (o cronômetro continua correndo).</span><button className="btn-p" onClick={() => go('mocks')}>Voltar ao simulado</button></div>}
      {page === 'home' && <Dashboard p={p} go={go} />}{page === 'edital' && <Edital p={p} go={go} />}{page === 'lesson' && <Lesson key={lessonId ?? 'x'} s={s} lessonId={lessonId ?? suggestLesson(p)} onPick={setLessonId} />}{page === 'review' && <Review s={s} />}{page === 'bank' && <Bank s={s} />}{page === 'errors' && <Errors s={s} go={go} />}{page === 'notes' && <Notes s={s} />}{page === 'mocks' && <Mocks s={s} go={go} />}{page === 'essay' && <Essay s={s} />}{page === 'plan' && <Plan s={s} go={go} />}{page === 'progress' && <Progress p={p} />}{page === 'settings' && <Settings s={s} />}{page === 'soon' && <Soon />}{page === 'admin' && (content.editor ? <Admin /> : <Dashboard p={p} go={go} />)}</main>
    <Toasts toasts={toasts} dismiss={dismiss} />
    {more && <div className="md:hidden fixed inset-x-0 bottom-14 z-40 max-h-[70vh] overflow-y-auto bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 space-y-2" role="menu">{GROUPS.map(g => <div key={g.title}><p className="text-[11px] uppercase tracking-wide text-slate-400">{g.title}</p><div className="grid grid-cols-3 gap-2">{g.items.map(([k, e, n]) => <button key={k} role="menuitem" onClick={() => go(k)} className={`rounded-xl py-2 text-xs ${page === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}><div className="text-lg">{e}</div>{n}</button>)}</div></div>)}</div>}
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-14 flex bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">{MAIN.map(k => { const [, e, n] = ALL.find(x => x[0] === k)!; return <button key={k} onClick={() => go(k)} className={`flex-1 text-xs ${page === k && !more ? 'text-indigo-600 font-bold' : ''}`}><div className="text-lg">{e}</div>{n}</button> })}<button onClick={() => setMore(!more)} aria-expanded={more} className={`flex-1 text-xs ${more || !MAIN.includes(page) ? 'text-indigo-600 font-bold' : ''}`}><div className="text-lg">☰</div>Mais</button></nav></div>
}
