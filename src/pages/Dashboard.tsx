import { BLOCKS } from '../data/edital'
import { useMemo } from 'react'
import { useContent, validationOf } from '../lib/content'
import { attemptsOf, coverage, entriesOf, fmtMin, performanceByDiscipline, topicLearning } from '../lib/learning'
import { DISCIPLINES } from '../data/edital'
import { cardById } from '../data/cards'
import { EXAM_DATE } from '../config'
import { levelInfo, streak } from '../lib/gamification'
import { missionDone, missionProgress } from '../lib/missions'
import { isDue } from '../lib/srs'
import { todayStr } from '../lib/dates'
import { dayBlocks, discName } from '../lib/plan'
import type { Progress } from '../types'
import Bar from '../components/Bar'
export const fmtTime = (sec: number) => { const m = Math.floor(sec / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min` }
export default function Dashboard({ p, go }: { p: Progress; go: (page: string, id?: string) => void }) {
  const t = todayStr(), lv = levelInfo(p.xp), st = streak(p.studyDays), day = p.daily[t], c = useContent(), vOf = (q: string) => validationOf(q)
  const missions = p.missionsToday?.day === t ? p.missionsToday.list : [], mDone = missions.filter(m => missionDone(m, day)).length
  const pend = Object.keys(p.cards).filter(id => cardById(id) && isDue(p.cards[id], t)).length
  const totalSec = Object.values(p.daily).reduce((n, d) => n + d.seconds, 0)
  const days = Math.max(0, Math.ceil((new Date(EXAM_DATE + 'T12:00:00').getTime() - Date.now()) / 864e5))
  const h = new Date().getHours(), hi = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const cov = useMemo(() => coverage(p, { vOf }), [p, c.validations]) // eslint-disable-line react-hooks/exhaustive-deps
  const att = useMemo(() => attemptsOf(p), [p.events]) // eslint-disable-line react-hooks/exhaustive-deps
  const perf = useMemo(() => performanceByDiscipline(att), [att])
  const ent = entriesOf(p), manualMin = ent.reduce((n, e) => n + e.minutes, 0), todayMin = ent.filter(e => e.date === t).reduce((n, e) => n + e.minutes, 0)
  const waiting = DISCIPLINES.flatMap(d => d.topics).map(x => topicLearning(p, x.id, { vOf, attempts: att })).filter(x => x.status === 'aguardando' || x.status === 'reforcar')
  const next = waiting[0]
  const QUICK: [string, string, string][] = [['diary:new', '📖', 'Registrar estudo'], ['validate', '✅', 'Validar aprendizado'], ['review', '🔁', 'Revisar conteúdos'], ['diary', '🗒️', 'Diário']]
  return <div className="space-y-6">
    <div><h1 className="text-2xl md:text-3xl font-bold">{hi}! 🌟 Pronta para conquistar sua aprovação no TJSP?</h1><p className="text-slate-500">Escrevente Técnico Judiciário · VUNESP · Edital 02/2026 · prova em {days} dias (14/03/2027, previsto)</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Acesso rápido">{QUICK.map(([pg, e, n], i) => <button key={i} className={i < 2 ? 'btn-p !py-3' : 'btn-s !py-3'} onClick={() => (pg.includes(':') ? go(pg.split(':')[0], pg.split(':')[1]) : go(pg))}>{e} {n}</button>)}</div>
    {next && <div className="card border-violet-400 text-sm flex flex-wrap items-center justify-between gap-2"><span>{next.status === 'reforcar' ? '🧩 Precisa reforçar' : '⏳ Aguardando avaliação'}: <b>{DISCIPLINES.flatMap(d => d.topics).find(x => x.id === next.topicId)?.title}</b></span><button className="btn-p" onClick={() => go('validate', next.topicId)}>Validar agora</button></div>}
    <div className="grid lg:grid-cols-3 gap-4" aria-label="Métricas de aprendizado">
      {([['Cobertura de estudo', cov.study, 'assuntos com estudo registrado (Diário ou marcação)', 'bg-sky-500'], ['Cobertura de avaliação', cov.assessment, `assuntos com alguma avaliação/prática (${cov.assessment.validated} com avaliação validada)`, 'bg-violet-500'], ['Domínio estimado', cov.mastery, 'assuntos com domínio consolidado pelo critério configurado', 'bg-emerald-500']] as const).map(([n, v, d, col]) => <div key={n} className="card"><p className="text-sm text-slate-500">{n}</p><p className="text-3xl font-extrabold">{v.pct}%</p><Bar pct={v.pct} color={col} /><p className="text-xs text-slate-500 mt-1">{v.n} de {cov.total} {d}</p></div>)}
    </div>
    <p className="text-xs text-slate-500 -mt-3">São três medidas separadas: estudar não é o mesmo que ser avaliado, e ser avaliado não é o mesmo que dominar. Abrir uma aula ou ler um resumo não entra nelas.</p>
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="card col-span-2 lg:col-span-1"><p className="text-sm text-slate-500">Nível {lv.index}</p><p className="font-bold">{lv.title}</p><p className="text-2xl font-extrabold text-indigo-600">{p.xp} XP</p><Bar pct={lv.pct} /><p className="text-xs text-slate-500 mt-1">{lv.toNext ? `${lv.toNext} XP para o próximo nível` : 'Nível máximo'}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Sequência</p><p className="text-3xl font-extrabold text-amber-500">🔥 {st}</p><button className="underline text-xs text-indigo-600" onClick={() => go('progress')}>Conquistas</button></div>
      <div className="card"><p className="text-sm text-slate-500">Estudo externo (manual)</p><p className="text-2xl font-extrabold text-sky-600">{fmtMin(manualMin)}</p><p className="text-xs text-slate-500">{ent.length} registro(s) · hoje {fmtMin(todayMin)}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Tempo ativo no app</p><p className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">{fmtTime(totalSec)}</p><p className="text-xs text-slate-500">hoje {fmtTime(day?.seconds ?? 0)} · {att.length} avaliação(ões)/prática(s)</p></div>
      <div className="card"><p className="text-sm text-slate-500">Revisões pendentes</p><p className="text-3xl font-extrabold text-rose-500">{pend}</p><button className="underline text-xs text-indigo-600" onClick={() => go('review')}>Abrir Central</button></div>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h2 className="font-bold mb-1">🎯 Missão de Hoje <span className="text-sm font-normal text-slate-500">({mDone}/{missions.length})</span></h2><p className="text-xs text-slate-500 mb-3">Geradas a cada dia conforme seus registros, avaliações e pendências.</p>
        <ul className="space-y-3">{missions.map(m => { const cur = Math.min(missionProgress(m, day), m.target), ok = missionDone(m, day); return <li key={m.id}><div className="flex items-center gap-2"><span className={`h-5 w-5 shrink-0 rounded-full grid place-items-center text-xs text-white ${ok ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>{ok ? '✓' : ''}</span><span className={`flex-1 ${ok ? 'line-through text-slate-400' : ''}`}>{m.label}</span><span className="text-xs text-slate-500">{cur}/{m.target}</span></div><div className="ml-7 mt-1"><Bar pct={Math.round((cur / m.target) * 100)} color="bg-emerald-500" /></div></li> })}</ul>
        <p className="text-xs text-slate-500 mt-3">Cumpra todas para ganhar +{p.settings.xp.dailyMission} XP (1x por dia).</p></div>
      <div className="card"><h2 className="font-bold mb-3">📊 Desempenho por disciplina</h2>{perf.length ? perf.map(x => <div key={x.id} className="mb-3"><p className="text-sm">{x.name}</p>{x.evaluation.n > 0 && <><div className="flex justify-between text-xs text-slate-500"><span>Avaliação (validadas)</span><span>{x.evaluation.ok}/{x.evaluation.n}</span></div><Bar pct={x.evaluation.pct} color="bg-emerald-500" /></>}{x.practice.n > 0 && <><div className="flex justify-between text-xs text-slate-500 mt-1"><span>Prática (não conta para o domínio)</span><span>{x.practice.ok}/{x.practice.n}</span></div><Bar pct={x.practice.pct} color="bg-slate-400" /></>}</div>) : <p className="text-slate-500 text-sm">Sem avaliações ainda. Estude com seu material, registre no Diário e use “Validar aprendizado”.</p>}
        <button className="underline text-sm text-indigo-600 mt-3" onClick={() => go('progress')}>Ver evolução e conquistas →</button></div>
    </div>
    <div className="card"><h2 className="font-bold mb-2">📅 Cronograma de hoje</h2>{!p.plan ? <><p className="text-sm text-slate-500 mb-2">Você ainda não tem um cronograma. Responda 5 perguntas e eu monto um plano até a prova.</p><button className="btn-p" onClick={() => go('plan')}>Criar cronograma</button></> : (() => { const bl = dayBlocks(p.plan, t); return bl ? <><ul className="text-sm space-y-1">{bl.map((b, i) => <li key={i} className={p.planMarks[t]?.[i] === 'done' ? 'line-through opacity-60' : ''}>{p.planMarks[t]?.[i] === 'done' ? '✓' : '•'} {b.disc === 'geral' ? 'Revisão geral' : discName(b.disc)} ({({ estudo: 'resumo', teoria: 'teoria externa', diagnostico: 'teste diagnóstico', questoes: 'questões', revisao: 'revisão', simulado: 'simulado', erros: 'erros' } as Record<string, string>)[b.kind] ?? b.kind}) · {b.min} min</li>)}</ul><button className="underline text-sm text-indigo-600 mt-2" onClick={() => go('plan')}>Abrir cronograma →</button></> : <p className="text-sm text-slate-500">Hoje é dia de descanso no seu plano 🌿. <button className="underline text-indigo-600" onClick={() => go('plan')}>Ver cronograma</button></p> })()}</div>
    <details className="card"><summary className="cursor-pointer font-bold">📝 Regras da prova (edital)</summary><ul className="text-sm space-y-1 list-disc ml-5 mt-2"><li>70 questões, 5 alternativas, mesmo peso; objetiva e redação no mesmo dia, até 5 h.</li>{([1, 2, 3] as const).map(b => <li key={b}>{BLOCKS[b]}{b < 3 ? ' – eliminatório (mín. 50% de acertos)' : ' – classificatório'}</li>)}<li>Nota mínima na objetiva: 5,0. Redação: 0 a 40 pontos, mínimo 24.</li></ul></details></div>
}
