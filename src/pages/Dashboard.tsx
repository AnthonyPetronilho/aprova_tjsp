import { DISCIPLINES, BLOCKS, topicDiscipline } from '../data/edital'
import { QUESTIONS } from '../data/questions'
import { LESSONS } from '../data/lessons'
import { cardById } from '../data/cards'
import { EXAM_DATE } from '../config'
import { levelInfo, streak } from '../lib/gamification'
import { missionDone, missionProgress } from '../lib/missions'
import { isDue } from '../lib/srs'
import { todayStr } from '../lib/dates'
import { suggestLesson } from '../lib/study'
import { dayBlocks, discName } from '../lib/plan'
import type { Progress } from '../types'
import Bar from '../components/Bar'
export const fmtTime = (sec: number) => { const m = Math.floor(sec / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min` }
export default function Dashboard({ p, go }: { p: Progress; go: (page: string, lessonId?: string) => void }) {
  const t = todayStr(), lv = levelInfo(p.xp), st = streak(p.studyDays), day = p.daily[t]
  const missions = p.missionsToday?.day === t ? p.missionsToday.list : [], mDone = missions.filter(m => missionDone(m, day)).length
  const total = DISCIPLINES.reduce((n, d) => n + d.topics.length, 0), done = Object.keys(p.completed).length
  const pend = Object.keys(p.cards).filter(id => cardById(id) && isDue(p.cards[id], t)).length, last = LESSONS.find(l => l.id === p.lastLessonId)
  const totalSec = Object.values(p.daily).reduce((n, d) => n + d.seconds, 0)
  const days = Math.max(0, Math.ceil((new Date(EXAM_DATE + 'T12:00:00').getTime() - Date.now()) / 864e5))
  const h = new Date().getHours(), hi = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const perf = DISCIPLINES.map(d => { const a = Object.entries(p.answers).filter(([q]) => topicDiscipline(QUESTIONS.find(x => x.id === q)?.topicId ?? '')?.id === d.id); return { d, n: a.length, ok: a.filter(([, x]) => x.correct).length } }).filter(x => x.n)
  return <div className="space-y-6">
    <div><h1 className="text-2xl md:text-3xl font-bold">{hi}! 🌟 Pronta para conquistar sua aprovação no TJSP?</h1><p className="text-slate-500">Escrevente Técnico Judiciário · VUNESP · Edital 02/2026</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="card col-span-2 lg:col-span-1"><p className="text-sm text-slate-500">Nível {lv.index}</p><p className="font-bold">{lv.title}</p><p className="text-2xl font-extrabold text-indigo-600">{p.xp} XP</p><Bar pct={lv.pct} /><p className="text-xs text-slate-500 mt-1">{lv.toNext ? `${lv.toNext} XP para o próximo nível` : 'Nível máximo'}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Sequência</p><p className="text-3xl font-extrabold text-amber-500">🔥 {st}</p><p className="text-xs text-slate-500">1 dia de folga não quebra · {p.studyDays.length} dia(s) estudados</p></div>
      <div className="card"><p className="text-sm text-slate-500">Tempo de estudo</p><p className="text-2xl font-extrabold text-sky-600">{fmtTime(totalSec)}</p><p className="text-xs text-slate-500">hoje: {fmtTime(day?.seconds ?? 0)} (tempo ativo)</p></div>
      <div className="card"><p className="text-sm text-slate-500">Edital concluído</p><p className="text-3xl font-extrabold text-emerald-600">{Math.round((done / total) * 100)}%</p><p className="text-xs text-slate-500">{done} de {total} tópicos</p></div>
      <div className="card"><p className="text-sm text-slate-500">Revisões pendentes</p><p className="text-3xl font-extrabold text-rose-500">{pend}</p><button className="underline text-xs text-indigo-600" onClick={() => go('review')}>Abrir Central</button></div>
      <div className="card"><p className="text-sm text-slate-500">Prova objetiva</p><p className="text-3xl font-extrabold text-violet-600">{days} dias</p><p className="text-xs text-slate-500">14/03/2027 (previsto)</p></div>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h2 className="font-bold mb-1">🎯 Missão de Hoje <span className="text-sm font-normal text-slate-500">({mDone}/{missions.length})</span></h2><p className="text-xs text-slate-500 mb-3">Geradas a cada dia conforme suas pendências, seu desempenho e seu ritmo recente de estudo.</p>
        <ul className="space-y-3">{missions.map(m => { const cur = Math.min(missionProgress(m, day), m.target), ok = missionDone(m, day); return <li key={m.id}><div className="flex items-center gap-2"><span className={`h-5 w-5 shrink-0 rounded-full grid place-items-center text-xs text-white ${ok ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>{ok ? '✓' : ''}</span><span className={`flex-1 ${ok ? 'line-through text-slate-400' : ''}`}>{m.label}</span><span className="text-xs text-slate-500">{cur}/{m.target}</span></div><div className="ml-7 mt-1"><Bar pct={Math.round((cur / m.target) * 100)} color="bg-emerald-500" /></div></li> })}</ul>
        <p className="text-xs text-slate-500 mt-3">Cumpra todas para ganhar +{p.settings.xp.dailyMission} XP (1x por dia).</p>
        {last && <p className="text-sm mt-2">Último assunto: <b>{last.title}</b></p>}<button className="btn-p mt-3" onClick={() => go('lesson', suggestLesson(p))}>{p.lastLessonId ? 'Continuar estudando' : 'Começar a estudar'}</button></div>
      <div className="card"><h2 className="font-bold mb-3">📊 Desempenho por disciplina</h2>{perf.length ? perf.map(({ d, n, ok }) => <div key={d.id} className="mb-2"><div className="flex justify-between text-sm"><span>{d.name}</span><span>{ok}/{n} acertos</span></div><Bar pct={Math.round((ok / n) * 100)} color="bg-emerald-500" /></div>) : <p className="text-slate-500 text-sm">Sem respostas registradas ainda. Resolva as questões da primeira aula.</p>}
        <button className="underline text-sm text-indigo-600 mt-3" onClick={() => go('progress')}>Ver evolução e conquistas →</button></div>
    </div>
    <div className="card"><h2 className="font-bold mb-2">📅 Cronograma de hoje</h2>{!p.plan ? <><p className="text-sm text-slate-500 mb-2">Você ainda não tem um cronograma. Responda 5 perguntas e eu monto um plano até a prova.</p><button className="btn-p" onClick={() => go('plan')}>Criar cronograma</button></> : (() => { const bl = dayBlocks(p.plan, t); return bl ? <><ul className="text-sm space-y-1">{bl.map((b, i) => <li key={i} className={p.planMarks[t]?.[i] === 'done' ? 'line-through opacity-60' : ''}>{p.planMarks[t]?.[i] === 'done' ? '✓' : '•'} {b.disc === 'geral' ? 'Revisão geral' : discName(b.disc)} ({b.kind === 'estudo' ? 'estudo' : b.kind === 'questoes' ? 'questões' : b.kind}) · {b.min} min</li>)}</ul><button className="underline text-sm text-indigo-600 mt-2" onClick={() => go('plan')}>Abrir cronograma →</button></> : <p className="text-sm text-slate-500">Hoje é dia de descanso no seu plano 🌿. <button className="underline text-indigo-600" onClick={() => go('plan')}>Ver cronograma</button></p> })()}</div>
    <div className="card"><h2 className="font-bold mb-3">📝 Regras da prova (edital)</h2><ul className="text-sm space-y-1 list-disc ml-5"><li>70 questões, 5 alternativas, mesmo peso; objetiva e redação no mesmo dia, até 5 h.</li>{([1, 2, 3] as const).map(b => <li key={b}>{BLOCKS[b]}{b < 3 ? ' – eliminatório (mín. 50% de acertos)' : ' – classificatório'}</li>)}<li>Nota mínima na objetiva: 5,0. Redação: 0 a 40 pontos, mínimo 24.</li></ul></div></div>
}
