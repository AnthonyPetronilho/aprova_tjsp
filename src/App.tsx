import { useState } from 'react'
import { useProgress } from './lib/useProgress'
import Dashboard from './pages/Dashboard'
import Edital from './pages/Edital'
import Lesson from './pages/Lesson'
import Review from './pages/Review'
import Bank from './pages/Bank'
import Errors from './pages/Errors'
import Notes from './pages/Notes'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import Toasts from './components/Toasts'
import Soon from './pages/Soon'
const NAV = [['home', '🏠', 'Início'], ['edital', '🗺️', 'Edital'], ['lesson', '📚', 'Estudar'], ['review', '🔁', 'Revisões'], ['bank', '✏️', 'Questões'], ['errors', '📓', 'Erros'], ['notes', '📝', 'Anotações'], ['progress', '📈', 'Evolução'], ['settings', '⚙️', 'Config.'], ['soon', '🚧', 'Em breve']]
export default function App() {
  const s = useProgress(), { p, toggleDark, toasts, dismiss } = s
  const [page, setPage] = useState('home')
  return <div className="min-h-screen md:flex">
    <aside className="hidden md:flex md:flex-col w-56 p-4 gap-1 border-r border-slate-200 dark:border-slate-700"><p className="font-extrabold text-xl text-indigo-600 mb-4">🎓 Aprova TJSP</p>{NAV.map(([k, e, n]) => <button key={k} onClick={() => setPage(k)} className={`text-left rounded-xl px-3 py-2 ${page === k ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{e} {n}</button>)}<button className="btn-s mt-auto" onClick={toggleDark}>{p.dark ? '☀️ Modo claro' : '🌙 Modo escuro'}</button></aside>
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 min-w-0">
      <button className="md:hidden btn-s mb-3 text-sm" onClick={toggleDark}>{p.dark ? '☀️' : '🌙'}</button>
      {page === 'home' && <Dashboard p={p} go={setPage} />}{page === 'edital' && <Edital p={p} go={setPage} />}{page === 'lesson' && <Lesson s={s} />}{page === 'review' && <Review s={s} />}{page === 'bank' && <Bank s={s} />}{page === 'errors' && <Errors s={s} go={setPage} />}{page === 'notes' && <Notes s={s} />}{page === 'progress' && <Progress p={p} />}{page === 'settings' && <Settings s={s} />}{page === 'soon' && <Soon />}</main>
    <Toasts toasts={toasts} dismiss={dismiss} />
    <nav className="md:hidden fixed bottom-0 inset-x-0 flex overflow-x-auto bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">{NAV.map(([k, e, n]) => <button key={k} onClick={() => setPage(k)} className={`flex-1 min-w-[4.5rem] py-2 text-xs ${page === k ? 'text-indigo-600 font-bold' : ''}`}><div className="text-lg">{e}</div>{n}</button>)}</nav></div>
}
