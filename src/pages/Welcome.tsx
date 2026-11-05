import { useEffect, useState } from 'react'
import PublicShell from '../components/PublicShell'
import { LESSONS } from '../data/lessons'
import { QUESTIONS } from '../data/questions'
import { FLASHCARDS } from '../data/cards'
import { DISCIPLINES } from '../data/edital'
import { clearFlash, peekFlash } from '../lib/auth'
import type { Store } from '../lib/useProgress'
// Só recursos que existem hoje no app. Os números vêm do conteúdo carregado, então nunca ficam desatualizados.
const FEATURES: [string, string, string][] = [
  ['📚', 'Aulas pelo edital', 'Estude por bloco e matéria, seguindo os tópicos do edital.'],
  ['✏️', 'Banco de questões', 'Pratique por assunto e veja por que cada alternativa está certa ou errada.'],
  ['🔁', 'Revisão e erros', 'Flashcards com repetição espaçada e um caderno com as questões que você errou.'],
  ['🧪', 'Simulados', 'Treine com tempo e acompanhe seu desempenho.'],
  ['📅', 'Cronograma e redação', 'Organize a rotina de estudos e pratique a redação.'],
  ['📈', 'Evolução', 'Acompanhe XP, níveis, conquistas e o seu progresso por matéria.'],
]
export default function Welcome({ s }: { s: Store }) {
  const [notice] = useState(() => peekFlash('welcome'))
  useEffect(() => () => clearFlash(), [])
  const topics = DISCIPLINES.reduce((n, d) => n + d.topics.length, 0)
  const stats: [number, string][] = [[topics, 'tópicos do edital'], [LESSONS.length, 'aulas'], [QUESTIONS.length, 'questões'], [FLASHCARDS.length, 'flashcards']]
  return <PublicShell dark={s.p.dark} toggleDark={s.toggleDark} wide>
    {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-2 text-sm">{notice}</p>}
    <section className="py-8 md:py-14 max-w-2xl">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Escrevente Técnico Judiciário · TJSP</p>
      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Seu conhecimento evolui a cada desafio.</h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Organize seus estudos para o TJSP, pratique questões, revise conteúdos e acompanhe sua evolução em uma plataforma desenvolvida para ajudar você a aprender.</p>
      <div className="mt-6 flex flex-wrap gap-3"><a href="#/login" className="btn-p">Entrar</a><a href="#/register" className="btn-s">Criar conta</a></div>
      <p className="mt-3 text-sm text-slate-500">Com uma conta, seu progresso fica salvo e sincronizado entre seus dispositivos.</p>
    </section>
    <section aria-label="O que a plataforma oferece">
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">{stats.map(([n, l]) => <li key={l} className="card !p-4 text-center"><p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{n}</p><p className="text-sm text-slate-500">{l}</p></li>)}</ul>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{FEATURES.map(([e, t, d]) => <li key={t} className="card !p-4"><p className="font-bold"><span aria-hidden="true">{e}</span> {t}</p><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{d}</p></li>)}</ul>
    </section>
  </PublicShell>
}
