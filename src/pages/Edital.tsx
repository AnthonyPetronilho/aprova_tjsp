import { DISCIPLINES, BLOCKS } from '../data/edital'
import { LESSONS } from '../data/lessons'
import { topicStatus } from '../lib/status'
import type { Progress } from '../types'
export default function Edital({ p, go }: { p: Progress; go: (page: string, lessonId?: string) => void }) {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">🗺️ Mapa do Edital</h1><p className="text-slate-500 text-sm">Tópicos conforme o Anexo VIII. O status só avança com atividades concluídas. “Em revisão” = aula concluída com flashcards já revisados; “Dominado” = todos os flashcards do tópico com intervalo ≥ 21 dias.</p>
    {([1, 2, 3] as const).map(b => <section key={b}><h2 className="font-semibold mt-4 mb-2">{BLOCKS[b]}</h2><div className="space-y-2">{DISCIPLINES.filter(d => d.block === b).map(d => <details key={d.id} className="card" open={d.id === 'pt' || d.id === 'dpenal'}><summary className="cursor-pointer font-semibold">{d.emoji} {d.name}{d.questions ? ` · ${d.questions} questões` : ''}</summary><ul className="mt-3 space-y-2">{d.topics.map(t => { const s = topicStatus(p, t.id); const has = LESSONS.find(l => l.topicId === t.id); return <li key={t.id} className="flex flex-wrap items-center gap-2 text-sm"><span className="flex-1 min-w-[12rem]">{t.title}</span><span className={`px-2 py-0.5 rounded-full text-xs ${s.cls}`}>{s.txt}</span>{has && <button className="btn-p !py-1 text-xs" onClick={() => go('lesson', has.id)}>Estudar</button>}</li> })}</ul></details>)}</div></section>)}</div>
}
