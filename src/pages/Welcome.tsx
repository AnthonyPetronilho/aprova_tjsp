import { useEffect, useState } from 'react'
import PublicShell from '../components/PublicShell'
import { clearFlash, peekFlash } from '../lib/auth'
import type { Store } from '../lib/useProgress'
// Tela de entrada minimalista: só identificação, título, descrição, as duas ações e a nota de sincronização.
export default function Welcome({ s }: { s: Store }) {
  const [notice, setNotice] = useState<string | null>(() => peekFlash('welcome') || null)
  useEffect(() => () => clearFlash(), [])
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(null), 8000); return () => clearTimeout(t) }, [notice])
  return <PublicShell dark={s.p.dark} toggleDark={s.toggleDark} wide center>
    {/* A mensagem flutua sobre o topo e some sozinha: não empurra o conteúdo principal. */}
    <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center px-4">{notice && <p role="status" className="pointer-events-auto rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-2 text-sm text-center">{notice}</p>}</div>
    <section className="mx-auto max-w-2xl text-center py-10">
      <p className="text-sm font-medium tracking-wide text-indigo-600 dark:text-indigo-400">Escrevente Técnico Judiciário • TJSP</p>
      <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-balance">Seu conhecimento evolui a cada desafio.</h1>
      <p className="mt-5 mx-auto max-w-md text-lg text-slate-600 dark:text-slate-300">Organize seus estudos, pratique questões e acompanhe sua evolução em um só lugar.</p>
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto"><a href="#/login" className="btn-p sm:min-w-36 text-center">Entrar</a><a href="#/register" className="btn-s sm:min-w-36 text-center">Criar conta</a></div>
      <p className="mt-6 text-sm text-slate-500">Seu progresso fica salvo e sincronizado entre seus dispositivos.</p>
    </section>
  </PublicShell>
}
