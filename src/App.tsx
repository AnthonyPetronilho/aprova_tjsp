import { useEffect, useRef, useState } from 'react'
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
import Diary from './pages/Diary'
import Validate from './pages/Validate'
import { useContent } from './lib/content'
import { setAdapters, scheduleSync, startAutoSync } from './lib/sync'
import { fingerprint, compact } from './lib/events'
import { backup } from './lib/backup'
import type { Progress as ProgressDoc } from './types'
import { contentForSync, mergeRemoteContent, contentFingerprint } from './lib/content'
import { normalize } from './lib/useProgress'
import Toasts from './components/Toasts'
import Soon from './pages/Soon'
import Welcome from './pages/Welcome'
import { Login, Register } from './pages/Auth'
import ProfileMenu from './components/ProfileMenu'
import { useHash, parseHash, resolveRoute, navigate, pageToPath, safeNext } from './lib/route'
import { bindLocalData, initSession, useAuthGate, peekFlash, clearFlash } from './lib/auth'
import { useSyncState } from './lib/sync'
const BASE: { title: string; items: [string, string, string][] }[] = [
  { title: 'Minha jornada', items: [['home', '🏠', 'Início'], ['edital', '🗺️', 'Edital'], ['diary', '📖', 'Diário de Estudos'], ['validate', '✅', 'Validar aprendizado']] },
  { title: 'Reforçar e revisar', items: [['review', '🔁', 'Revisões'], ['errors', '📓', 'Erros'], ['lesson', '📚', 'Resumos (complementar)'], ['bank', '✏️', 'Questões'], ['notes', '📝', 'Anotações']] },
  { title: 'Praticar', items: [['mocks', '🧪', 'Simulados'], ['essay', '✍️', 'Redação']] },
  { title: 'Planejar', items: [['plan', '📅', 'Cronograma'], ['progress', '📈', 'Evolução']] },
  { title: 'Mais', items: [['settings', '⚙️', 'Configurações'], ['soon', '🚧', 'Em breve']] },
]
const ADMIN: [string, string, string] = ['admin', '🛠️', 'Admin']
const MAIN = ['home', 'diary', 'validate', 'review']
const ALL = [...BASE.flatMap(g => g.items), ADMIN]
export default function App() {
  const s = useProgress(), { p, toggleDark, toasts, dismiss } = s, content = useContent()
  const pRef = useRef(p); pRef.current = p
  const firstP = useRef(true), firstC = useRef(true)
  useEffect(() => {
    setAdapters({
      progress: {
        get: () => s.getState(), merge: r => s.mergeRemote(r), fingerprint: d => { try { return fingerprint(normalize(d)) } catch { return '' } },
        prepare: d => compact(d as ProgressDoc) ?? d, // compactação: só vale se o servidor aceitar este envio (veja sync.ts)
        committed: sent => { backup('antes-de-compactar', JSON.stringify(s.getState())); s.mergeRemote(sent) },
      },
      content: { get: contentForSync, merge: mergeRemoteContent, fingerprint: contentFingerprint },
    })
    bindLocalData(s)
    const stopSession = initSession(), stopSync = startAutoSync()
    return () => { stopSession(); stopSync() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Só atividade real agenda envio rápido (3 s). O contador de tempo de estudo (a cada 15 s) não muda esta "assinatura" e sai junto com a próxima atividade ou em até 5 min.
  const sig = [p.events.length, p.mocks.length, p.essays.length, p.essaysDeleted.length, p.prefsAt, p.epoch.id, Object.values(p.notes).map(n => n.updatedAt).join(','), p.achievements && Object.keys(p.achievements).length].join('|')
  const lastSig = useRef(sig)
  useEffect(() => { if (firstP.current) { firstP.current = false; return } const quick = lastSig.current !== sig; lastSig.current = sig; scheduleSync('progress', quick ? 3000 : 300000) }, [p, sig])
  useEffect(() => { if (firstC.current) { firstC.current = false; return } scheduleSync('content') }, [content.lessons, content.questions, content.cards, content.videos, content.deleted, content.validations])
  const GROUPS = content.editor ? BASE.map(g => g.title === 'Mais' ? { ...g, items: [ADMIN, ...g.items] } : g) : BASE
  const hash = useHash(), { path, query } = parseHash(hash), sy = useSyncState(), gate = useAuthGate()
  const view = resolveRoute(path, query, sy.enabled, gate)
  const [lessonState, setLessonState] = useState<string | null>(null), [focus, setFocus] = useState<string | undefined>(), [more, setMore] = useState(false)
  const page = view.kind === 'page' ? view.page : 'home', lessonId = (view.kind === 'page' ? view.lessonId : undefined) ?? lessonState
  useEffect(() => { if (view.kind === 'redirect') navigate(view.to, true) }, [view.kind === 'redirect' ? view.to : ''])  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (view.kind === 'page') { const f = peekFlash('shell'); if (f) { s.toast(`flash-${Date.now()}`, f); clearFlash() } } }, [view.kind]) // eslint-disable-line react-hooks/exhaustive-deps
  const go = (pg: string, id?: string) => {
    let lid = lessonId; if (pg === 'lesson' && (id || !lid)) { lid = id ?? suggestLesson(p); setLessonState(lid) }
    if (pg === 'diary' || pg === 'validate') setFocus(id)
    setMore(false); navigate(pageToPath(pg, pg === 'lesson' ? lid : undefined)); window.scrollTo?.(0, 0)
  }
  const pickLesson = (id: string) => { setLessonState(id); navigate(pageToPath('lesson', id), true) }
  const Btn = ({ k, e, n }: { k: string; e: string; n: string }) => <button onClick={() => go(k)} className={`text-left rounded-xl px-3 py-2 ${page === k ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{e} {n}</button>
  if (view.kind === 'loading' || view.kind === 'redirect') return <div className="min-h-screen grid place-items-center" role="status" aria-live="polite"><p className="text-slate-500"><span aria-hidden="true">🎓</span> Carregando…</p></div>
  if (view.kind === 'welcome') return <Welcome s={s} />
  if (view.kind === 'login') return <Login s={s} next={query.get('next') ? safeNext(query.get('next')) : null} />
  if (view.kind === 'register') return <Register s={s} next={query.get('next') ? safeNext(query.get('next')) : null} />
  return <div className="min-h-screen md:flex">
    <aside className="hidden md:flex md:flex-col w-56 shrink-0 p-4 gap-1 border-r border-slate-200 dark:border-slate-700"><p className="font-extrabold text-xl text-indigo-600 mb-3">🎓 Aprova TJSP</p>
      {GROUPS.map(g => <div key={g.title} className="flex flex-col gap-1 mb-2"><p className="text-[11px] uppercase tracking-wide text-slate-400 px-3">{g.title}</p>{g.items.map(([k, e, n]) => <Btn key={k} k={k} e={e} n={n} />)}</div>)}
      <div className="mt-auto space-y-1"><ProfileMenu placement="up" showName onSettings={() => go('settings')} /><button className="btn-s w-full" onClick={toggleDark}>{p.dark ? '☀️ Modo claro' : '🌙 Modo escuro'}</button></div></aside>
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 min-w-0">
      <header className="md:hidden flex items-center justify-between mb-3"><span className="font-extrabold text-indigo-600 dark:text-indigo-400">🎓 Aprova TJSP</span><div className="flex items-center gap-2"><ProfileMenu placement="down" onSettings={() => go('settings')} /><button className="btn-s !px-3 !py-1.5 text-sm" onClick={toggleDark} aria-label={p.dark ? 'Ativar modo claro' : 'Ativar modo escuro'}>{p.dark ? '☀️' : '🌙'}</button></div></header>
      {p.mockRun && page !== 'mocks' && <div className="card mb-4 flex flex-wrap items-center gap-2 border-indigo-400"><span className="flex-1">🧪 Você tem um simulado em andamento (o cronômetro continua correndo).</span><button className="btn-p" onClick={() => go('mocks')}>Voltar ao simulado</button></div>}
      {page === 'home' && <Dashboard p={p} go={go} />}{page === 'edital' && <Edital p={p} go={go} />}{page === 'lesson' && <Lesson key={lessonId ?? 'x'} s={s} lessonId={lessonId ?? suggestLesson(p)} onPick={pickLesson} />}{page === 'review' && <Review s={s} />}{page === 'bank' && <Bank s={s} />}{page === 'errors' && <Errors s={s} go={go} />}{page === 'notes' && <Notes s={s} />}{page === 'mocks' && <Mocks s={s} go={go} />}{page === 'essay' && <Essay s={s} />}{page === 'plan' && <Plan s={s} go={go} />}{page === 'progress' && <Progress p={p} />}{page === 'settings' && <Settings s={s} />}{page === 'diary' && <Diary key={focus ?? 'd'} s={s} go={go} focusTopic={focus} />}{page === 'validate' && <Validate key={focus ?? 'v'} s={s} go={go} initialTopic={focus} />}{page === 'soon' && <Soon />}{page === 'admin' && (content.editor ? <Admin /> : <Dashboard p={p} go={go} />)}</main>
    <Toasts toasts={toasts} dismiss={dismiss} />
    {more && <div className="md:hidden fixed inset-x-0 bottom-14 z-40 max-h-[70vh] overflow-y-auto bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 space-y-2" role="menu">{GROUPS.map(g => <div key={g.title}><p className="text-[11px] uppercase tracking-wide text-slate-400">{g.title}</p><div className="grid grid-cols-3 gap-2">{g.items.map(([k, e, n]) => <button key={k} role="menuitem" onClick={() => go(k)} className={`rounded-xl py-2 text-xs ${page === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}><div className="text-lg">{e}</div>{n}</button>)}</div></div>)}</div>}
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-14 flex bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">{MAIN.map(k => { const [, e, n] = ALL.find(x => x[0] === k)!; return <button key={k} onClick={() => go(k)} className={`flex-1 text-xs ${page === k && !more ? 'text-indigo-600 font-bold' : ''}`}><div className="text-lg">{e}</div>{n}</button> })}<button onClick={() => setMore(!more)} aria-expanded={more} className={`flex-1 text-xs ${more || !MAIN.includes(page) ? 'text-indigo-600 font-bold' : ''}`}><div className="text-lg">☰</div>Mais</button></nav></div>
}
