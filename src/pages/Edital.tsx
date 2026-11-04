import { DISCIPLINES, BLOCKS } from '../data/edital'
import { QUESTIONS } from '../data/crase'
import { LESSONS } from '../data/lessons'
import { FLASHCARDS } from '../data/cards'
import { isMastered } from '../lib/srs'
import type { Progress } from '../types'
function status(p: Progress, topicId: string) {
  const l = LESSONS.find(x => x.topicId === topicId)
  if (!l) return { txt: 'Sem aula ainda', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700' }
  if (p.completed[l.id]) {
    const st = FLASHCARDS.filter(c => c.topicId === topicId).map(c => p.cards[c.id]).filter(Boolean)
    if (st.length && st.every(isMastered)) return { txt: 'Dominado', cls: 'bg-violet-100 text-violet-700' }
    if (st.some(c => c.last)) return { txt: 'Em revisão', cls: 'bg-sky-100 text-sky-700' }
    return { txt: 'Estudado', cls: 'bg-emerald-100 text-emerald-700' }
  }
  if (QUESTIONS.some(q => l.questionIds.includes(q.id) && p.answers[q.id])) return { txt: 'Em andamento', cls: 'bg-amber-100 text-amber-700' }
  return { txt: 'Não iniciado', cls: 'bg-indigo-100 text-indigo-700' }
}
export default function Edital({ p, go }: { p: Progress; go: (page: string) => void }) {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">🗺️ Mapa do Edital</h1><p className="text-slate-500 text-sm">Tópicos conforme o Anexo VIII. O status só avança com atividades concluídas. “Em revisão” = aula concluída com flashcards já revisados; “Dominado” = todos os flashcards do tópico com intervalo ≥ 21 dias.</p>
    {([1, 2, 3] as const).map(b => <section key={b}><h2 className="font-semibold mt-4 mb-2">{BLOCKS[b]}</h2><div className="space-y-2">{DISCIPLINES.filter(d => d.block === b).map(d => <details key={d.id} className="card" open={d.id === 'pt'}><summary className="cursor-pointer font-semibold">{d.emoji} {d.name}{d.questions ? ` · ${d.questions} questões` : ''}</summary><ul className="mt-3 space-y-2">{d.topics.map(t => { const s = status(p, t.id); const has = LESSONS.some(l => l.topicId === t.id); return <li key={t.id} className="flex flex-wrap items-center gap-2 text-sm"><span className="flex-1 min-w-[12rem]">{t.title}</span><span className={`px-2 py-0.5 rounded-full text-xs ${s.cls}`}>{s.txt}</span>{has && <button className="btn-p !py-1 text-xs" onClick={() => go('lesson')}>Estudar</button>}</li> })}</ul></details>)}</div></section>)}</div>
}
