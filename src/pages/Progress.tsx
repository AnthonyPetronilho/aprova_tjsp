import { LEVELS } from '../config'
import { achievements, levelInfo, streak } from '../lib/gamification'
import { addDays, todayStr } from '../lib/dates'
import type { Progress as P } from '../types'
import Bar from '../components/Bar'
import { fmtTime } from './Dashboard'
import Stats from './Stats'
import { useState } from 'react'
const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
function Bars({ title, vals, labels, unit, color }: { title: string; vals: number[]; labels: string[]; unit: string; color: string }) {
  const max = Math.max(1, ...vals)
  return <div className="card"><h3 className="font-bold mb-3">{title}</h3><div className="flex items-end gap-2 h-32">{vals.map((v, i) => <div key={i} className="flex-1 flex flex-col items-center justify-end h-full"><span className="text-xs text-slate-500">{v}{unit}</span><div className={`w-full rounded-t ${color}`} style={{ height: `${Math.max(v ? 4 : 0, (v / max) * 100)}%`, minHeight: v ? 4 : 0 }} /><span className="text-xs mt-1">{labels[i]}</span></div>)}</div></div>
}
export default function Progress({ p }: { p: P }) {
  const [tab, setTab] = useState<'geral' | 'stats' | 'conq'>('geral')
  const t = todayStr(), lv = levelInfo(p.xp), days = Array.from({ length: 7 }, (_, i) => addDays(t, i - 6)), ach = achievements(p)
  const labels = days.map(d => WD[new Date(d + 'T12:00:00').getDay()])
  const ans = Object.values(p.answers), acc = ans.length ? Math.round((ans.filter(a => a.correct).length / ans.length) * 100) : null
  const totalSec = Object.values(p.daily).reduce((n, d) => n + d.seconds, 0)
  const tabs = [['geral', 'Visão geral'], ['stats', 'Estatísticas'], ['conq', 'Conquistas']] as const
  return <div className="space-y-6"><h1 className="text-2xl font-bold">📈 Evolução</h1>
    <div className="flex gap-2" role="tablist">{tabs.map(([k, n]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`px-3 py-1 rounded-full text-sm border ${tab === k ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>{n}</button>)}</div>
    {tab === 'stats' && <Stats p={p} />}
    {tab === 'geral' && <>
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {[['XP total', String(p.xp)], ['Dias estudados', String(p.studyDays.length)], ['Sequência', `${streak(p.studyDays)} dia(s)`], ['Questões respondidas', String(p.totalAnswered)], ['Tempo ativo', fmtTime(totalSec)]].map(([k, v]) => <div key={k} className="card"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-extrabold">{v}</p></div>)}
      <div className="card"><p className="text-sm text-slate-500">Acerto atual</p><p className="text-2xl font-extrabold">{acc === null ? '—' : `${acc}%`}</p><p className="text-xs text-slate-500">última resposta de cada questão</p></div>
      <div className="card"><p className="text-sm text-slate-500">Revisões feitas</p><p className="text-2xl font-extrabold">{p.reviewLog.length}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Anotações</p><p className="text-2xl font-extrabold">{Object.keys(p.notes).length}</p></div></div>
    <div className="grid lg:grid-cols-2 gap-4">
      <Bars title="Tempo ativo nos últimos 7 dias" vals={days.map(d => Math.round((p.daily[d]?.seconds ?? 0) / 60))} labels={labels} unit="m" color="bg-sky-500" />
      <Bars title="XP ganho nos últimos 7 dias" vals={days.map(d => p.daily[d]?.xp ?? 0)} labels={labels} unit="" color="bg-indigo-500" /></div>
    <div className="card"><h2 className="font-bold mb-1">Nível {lv.index} · {lv.title}</h2><Bar pct={lv.pct} /><p className="text-xs text-slate-500 mt-1 mb-3">{lv.toNext ? `${lv.toNext} XP para o próximo nível` : 'Nível máximo'}</p>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">{LEVELS.map((l, i) => <li key={l.title} className={`rounded-xl px-3 py-2 ${p.xp >= l.min ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-slate-100 dark:bg-slate-700 opacity-60'}`}>{i + 1}. {l.title} <span className="text-xs text-slate-500">({l.min} XP)</span></li>)}</ol></div>
    </>}
    {tab === 'conq' && <div><h2 className="font-bold mb-3">🏆 Conquistas ({ach.filter(a => a.ok).length}/{ach.length})</h2><div className="grid md:grid-cols-2 gap-4">{ach.map(a => <div key={a.id} className={`card ${a.ok ? '' : 'opacity-80'}`}><div className="flex gap-3"><span className="text-3xl">{a.ok ? a.emoji : '🔒'}</span><div className="flex-1"><p className="font-bold">{a.name}</p><p className="text-sm text-slate-500">{a.desc}</p><div className="mt-2"><Bar pct={Math.round((a.cur / a.goal) * 100)} color={a.ok ? 'bg-emerald-500' : 'bg-indigo-500'} /></div><p className="text-xs text-slate-500 mt-1">{a.ok ? `Desbloqueada em ${(p.achievements[a.id] ?? todayStr()).split('-').reverse().join('/')}` : `${a.cur}/${a.goal}`}{!a.ok && a.hint ? ` · ${a.hint}` : ''}</p></div></div></div>)}</div></div>}</div>
}
