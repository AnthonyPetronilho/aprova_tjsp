import { DISCIPLINES, BLOCKS, topicDiscipline } from '../data/edital'
import { QUESTIONS } from '../data/crase'
import { EXAM_DATE } from '../config'
import { levelInfo, achievements } from '../lib/gamification'
import { missions, streak } from '../lib/useProgress'
import type { Progress } from '../types'
import Bar from '../components/Bar'
export default function Dashboard({ p, go }: { p: Progress; go: (page: string) => void }) {
  const lv = levelInfo(p.xp), st = streak(p.studyDays), ms = missions(p)
  const total = DISCIPLINES.reduce((n, d) => n + d.topics.length, 0), done = Object.keys(p.completed).length
  const days = Math.max(0, Math.ceil((new Date(EXAM_DATE + 'T12:00:00').getTime() - Date.now()) / 864e5))
  const h = new Date().getHours(), hi = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const perf = DISCIPLINES.map(d => { const a = Object.entries(p.answers).filter(([q]) => topicDiscipline(QUESTIONS.find(x => x.id === q)?.topicId ?? '')?.id === d.id); return { d, n: a.length, ok: a.filter(([, x]) => x.correct).length } }).filter(x => x.n)
  return <div className="space-y-6">
    <div><h1 className="text-2xl md:text-3xl font-bold">{hi}! 🌟 Pronta para conquistar sua aprovação no TJSP?</h1><p className="text-slate-500">Escrevente Técnico Judiciário · VUNESP · Edital 02/2026</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card col-span-2 lg:col-span-1"><p className="text-sm text-slate-500">Nível {lv.index}</p><p className="font-bold text-lg">{lv.title}</p><p className="text-2xl font-extrabold text-indigo-600">{p.xp} XP</p><Bar pct={lv.pct} /><p className="text-xs text-slate-500 mt-1">{lv.toNext ? `${lv.toNext} XP para o próximo nível` : 'Nível máximo'}</p></div>
      <div className="card"><p className="text-sm text-slate-500">Sequência</p><p className="text-3xl font-extrabold text-amber-500">🔥 {st}</p><p className="text-xs text-slate-500">dia(s) seguidos · {p.studyDays.length} dia(s) estudados</p></div>
      <div className="card"><p className="text-sm text-slate-500">Edital concluído</p><p className="text-3xl font-extrabold text-emerald-600">{Math.round((done / total) * 100)}%</p><p className="text-xs text-slate-500">{done} de {total} tópicos com aula concluída</p></div>
      <div className="card"><p className="text-sm text-slate-500">Prova objetiva</p><p className="text-3xl font-extrabold text-violet-600">{days} dias</p><p className="text-xs text-slate-500">14/03/2027 (previsto)</p></div>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h2 className="font-bold mb-3">🎯 Missão de Hoje</h2><ul className="space-y-2">{ms.map(m => <li key={m.label} className="flex items-center gap-2"><span className={`h-5 w-5 rounded-full grid place-items-center text-xs text-white ${m.done ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>{m.done ? '✓' : ''}</span><span className={m.done ? 'line-through text-slate-400' : ''}>{m.label}</span></li>)}</ul><p className="text-xs text-slate-500 mt-3">Cumpra as 3 para ganhar +50 XP (1x por dia).</p><button className="btn-p mt-3" onClick={() => go('lesson')}>{p.lastLessonId ? 'Continuar estudando' : 'Começar a estudar'}</button></div>
      <div className="card"><h2 className="font-bold mb-3">📊 Desempenho por disciplina</h2>{perf.length ? perf.map(({ d, n, ok }) => <div key={d.id} className="mb-2"><div className="flex justify-between text-sm"><span>{d.name}</span><span>{ok}/{n} acertos</span></div><Bar pct={Math.round((ok / n) * 100)} color="bg-emerald-500" /></div>) : <p className="text-slate-500 text-sm">Sem respostas registradas ainda. Resolva as questões da primeira aula.</p>}</div>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card"><h2 className="font-bold mb-3">📝 Regras da prova (edital)</h2><ul className="text-sm space-y-1 list-disc ml-5"><li>70 questões, 5 alternativas, mesmo peso; objetiva e redação no mesmo dia, até 5 h.</li>{([1, 2, 3] as const).map(b => <li key={b}>{BLOCKS[b]}{b < 3 ? ' – eliminatório (mín. 50% de acertos)' : ' – classificatório'}</li>)}<li>Nota mínima na objetiva: 5,0. Redação: 0 a 40 pontos, mínimo 24.</li></ul></div>
      <div className="card"><h2 className="font-bold mb-3">🏅 Conquistas</h2><ul className="space-y-1 text-sm">{achievements(p, st).map(a => <li key={a.name} className={a.ok ? '' : 'opacity-50'}>{a.ok ? '🏆' : '🔒'} <b>{a.name}</b> — {a.desc}</li>)}</ul></div>
    </div></div>
}
