import { useMemo, useState } from 'react'
import type { Flashcard, Lesson, Step } from '../../types'
import { LESSONS } from '../../data/lessons'
import { FLASHCARDS } from '../../data/cards'
import { adm, newKey, type CardData, type EdItem, type LessonData } from './api'
import { ConflictBox, Feedback, History, PubBadge, PublishBar, TOPICS, TopicSelect, inp, topicTitle, useAction, useAdminData, fmt } from './common'
import { QUESTIONS } from '../../data/questions'

// Aulas e flashcards: edição de texto com rascunho/revisão/publicação. Publicar nunca altera o progresso da estudante
// (IDs preservados; os registros de estudo ficam em outro documento).
const lessonOf = (it: EdItem): Lesson | undefined => {
  const d = (it.draft?.data ?? it.live) as LessonData | null
  const base = LESSONS.find(l => l.id === it.id)
  if (it.origin === 'admin') return d ? { id: it.id, ...d } : undefined
  return base ? { ...base, ...(d ? { title: d.title, steps: d.steps, questionIds: d.questionIds } : {}) } : undefined
}
const cardOf = (it: EdItem): Flashcard | undefined => {
  const d = (it.draft?.data ?? it.live) as CardData | null, base = FLASHCARDS.find(c => c.id === it.id)
  if (it.origin === 'admin') return d ? { id: it.id, origin: 'aula', ...d } : undefined
  return base ? { ...base, ...(d ? { front: d.front, back: d.back } : {}) } : undefined
}
function useList(kind: 'lesson' | 'card') {
  const { items, byId, put, loading, error, reload } = useAdminData()
  const [q, setQ] = useState(''), [topic, setTopic] = useState('all'), [pub, setPub] = useState('all'), [page, setPage] = useState(0)
  const all = useMemo(() => items.filter(i => i.kind === kind), [items, kind])
  const label = (it: EdItem) => (kind === 'lesson' ? lessonOf(it)?.title : cardOf(it)?.front) ?? ''
  const topicOf = (it: EdItem) => (kind === 'lesson' ? lessonOf(it)?.topicId : cardOf(it)?.topicId) ?? it.baseTopic ?? ''
  const list = useMemo(() => { const k = q.trim().toLowerCase(); return all.filter(it => (topic === 'all' || topicOf(it) === topic) && (pub === 'all' || it.estado === pub) && (!k || it.id.toLowerCase().includes(k) || label(it).toLowerCase().includes(k))).sort((a, b) => (a.id < b.id ? -1 : 1)) }, [all, q, topic, pub]) // eslint-disable-line react-hooks/exhaustive-deps
  return { byId, put, loading, error, reload, all, list, q, setQ, topic, setTopic, pub, setPub, page, setPage, label, topicOf }
}
function Filters({ s, onNew, title }: { s: ReturnType<typeof useList>; onNew: () => void; title: string }) {
  return <div className="card space-y-2"><div className="flex flex-wrap gap-2 items-center"><h2 className="font-bold flex-1">{title} <span className="text-sm font-normal text-slate-500">({s.list.length} de {s.all.length})</span></h2><button className="btn-s" onClick={() => void s.reload()}>↻ Recarregar</button><button className="btn-p" onClick={onNew}>+ Novo</button></div>
    <input className={inp} placeholder="Buscar por ID ou texto" aria-label="Buscar" value={s.q} onChange={e => { s.setQ(e.target.value); s.setPage(0) }} />
    <div className="grid grid-cols-2 gap-2"><select className={inp} aria-label="Assunto" value={s.topic} onChange={e => { s.setTopic(e.target.value); s.setPage(0) }}><option value="all">Todos os assuntos</option>{TOPICS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
      <select className={inp} aria-label="Publicação" value={s.pub} onChange={e => { s.setPub(e.target.value); s.setPage(0) }}><option value="all">Toda publicação</option><option value="rascunho">Rascunho</option><option value="em-revisao">Em revisão</option><option value="publicada">Publicada</option><option value="arquivada">Arquivada</option></select></div>
    {s.loading && <p className="text-sm text-slate-500" role="status">Carregando…</p>}{s.error && <p className="text-sm text-rose-600" role="alert">{s.error}</p>}</div>
}
function Pager({ n, page, setPage }: { n: number; page: number; setPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(n / 40)); return <div className="flex items-center gap-2 justify-center"><button className="btn-s" disabled={page === 0} onClick={() => setPage(page - 1)}>‹</button><span className="text-sm">{Math.min(page, pages - 1) + 1} / {pages}</span><button className="btn-s" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>›</button></div>
}

// ---------------- AULAS
const blankStep = (): Step => ({ title: '', body: [''] })
export function LessonsTab() {
  const s = useList('lesson'), [open, setOpen] = useState<string | null>(null), [creating, setCreating] = useState(false)
  const sel = open ? s.byId.get(`lesson:${open}`) : undefined
  if (creating) return <LessonEditor key="new" onItem={s.put} onBack={it => { setCreating(false); if (it) setOpen(it.id) }} />
  if (sel) return <LessonEditor key={sel.id} item={sel} onItem={s.put} onBack={() => setOpen(null)} />
  const shown = s.list.slice(Math.min(s.page, Math.max(0, Math.ceil(s.list.length / 40) - 1)) * 40).slice(0, 40)
  return <div className="space-y-3"><Filters s={s} onNew={() => setCreating(true)} title="Aulas" />
    <ul className="space-y-2">{shown.map(it => { const l = lessonOf(it); return <li key={it.id}><button className="card w-full text-left !p-3 hover:border-indigo-400" onClick={() => setOpen(it.id)}><div className="flex flex-wrap gap-1.5 items-center"><code className="text-xs">{it.id}</code><PubBadge p={it.estado} />{it.origin === 'admin' && <span className="text-xs text-slate-500">criada no Admin</span>}</div><p className="text-sm font-medium">{l?.title ?? '(sem título)'}</p><p className="text-xs text-slate-500">{topicTitle(s.topicOf(it))} · {l?.steps.length ?? 0} etapas · {l?.questionIds.length ?? 0} questões</p></button></li> })}</ul>
    <Pager n={s.list.length} page={s.page} setPage={s.setPage} /></div>
}
function LessonEditor({ item, onItem, onBack }: { item?: EdItem; onItem: (it: EdItem) => void; onBack: (it?: EdItem) => void }) {
  const cur = item ? lessonOf(item) : undefined
  const init = (): LessonData => ({ topicId: cur?.topicId ?? '', title: cur?.title ?? '', steps: cur?.steps.map(x => ({ ...x, body: [...x.body] })) ?? [blankStep()], questionIds: cur?.questionIds ?? [] })
  const [d, setD] = useState<LessonData>(init), [why, setWhy] = useState(''), [rev, setRev] = useState(item?.rev ?? 0), [key] = useState(newKey), [tab, setTab] = useState<'texto' | 'historico'>('texto')
  const [it, setIt] = useState<EdItem | undefined>(item)
  const apply = (x: EdItem) => { setIt(x); setRev(x.rev); onItem(x) }
  const act = useAction(apply)
  const base = item?.origin === 'catalogo', step = (i: number, p: Partial<Step>) => setD({ ...d, steps: d.steps.map((s, j) => (j === i ? { ...s, ...p } : s)) })
  const avail = QUESTIONS.filter(q => q.topicId === d.topicId)
  const dirty = JSON.stringify(d) !== JSON.stringify(it ? (() => { const c = lessonOf(it); return c ? { topicId: c.topicId, title: c.title, steps: c.steps, questionIds: c.questionIds } : d })() : null)
  const payload = (): LessonData => ({ ...d, steps: d.steps.map(s => ({ ...s, body: s.body.map(b => b.trim()).filter(Boolean), alt: s.alt?.trim() || undefined })) })
  return <div className="space-y-3"><div className="card space-y-3"><div className="flex flex-wrap gap-2 items-center"><button className="btn-s" onClick={() => onBack(it)}>← Lista</button>{it && <><code>{it.id}</code><PubBadge p={it.estado} /><span className="text-xs text-slate-500 ml-auto">versão {it.rev} · {fmt(it.updatedAt)}</span></>}</div>
    <div className="flex gap-1 text-sm">{(['texto', 'historico'] as const).map(k => <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-3 py-1.5 ${tab === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{k === 'texto' ? 'Conteúdo' : 'Histórico'}</button>)}</div>
    {tab === 'historico' && it && <History item={it} />}
    {tab === 'texto' && <>
      <TopicSelect value={d.topicId} onChange={v => setD({ ...d, topicId: v, questionIds: [] })} disabled={base} />
      <input className={inp} placeholder="Título da aula" aria-label="Título" value={d.title} onChange={e => setD({ ...d, title: e.target.value })} />
      {d.steps.map((s, i) => <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2"><div className="flex gap-2 items-center"><span className="text-xs font-semibold">Etapa {i + 1}</span>{!base && <><button className="btn-s !py-0.5 !px-2 text-xs" disabled={i === 0} onClick={() => setD({ ...d, steps: d.steps.map((x, j) => (j === i - 1 ? d.steps[i] : j === i ? d.steps[i - 1] : x)) })}>↑</button><button className="btn-s !py-0.5 !px-2 text-xs" disabled={i === d.steps.length - 1} onClick={() => setD({ ...d, steps: d.steps.map((x, j) => (j === i + 1 ? d.steps[i] : j === i ? d.steps[i + 1] : x)) })}>↓</button><button className="btn-s !py-0.5 !px-2 text-xs ml-auto" disabled={d.steps.length < 2} onClick={() => setD({ ...d, steps: d.steps.filter((_, j) => j !== i) })}>Remover</button></>}</div>
        <input className={inp} placeholder="Título da etapa" aria-label={`Título da etapa ${i + 1}`} value={s.title} onChange={e => step(i, { title: e.target.value })} />
        <textarea className={inp} rows={5} placeholder="Texto (parágrafos separados por linha em branco). Texto simples: HTML não é aceito." aria-label={`Texto da etapa ${i + 1}`} value={s.body.join('\n\n')} onChange={e => step(i, { body: e.target.value.split(/\n{2,}/) })} />
        <textarea className={inp} rows={2} placeholder="(opcional) explicação alternativa" aria-label={`Alternativa da etapa ${i + 1}`} value={s.alt ?? ''} onChange={e => step(i, { alt: e.target.value })} />
        {(s.quotes?.length || s.table) && <p className="text-xs text-slate-500">Esta etapa tem {s.quotes?.length ? `${s.quotes.length} citação(ões)` : ''}{s.quotes?.length && s.table ? ' e ' : ''}{s.table ? 'uma tabela' : ''}, preservadas ao salvar (edição só pelo texto).</p>}</div>)}
      <button className="btn-s" onClick={() => setD({ ...d, steps: [...d.steps, blankStep()] })}>+ Adicionar etapa</button>
      <fieldset className="space-y-1"><legend className="font-semibold text-sm">Questões do teste da aula</legend>{!d.topicId ? <p className="text-sm text-slate-500">Escolha o assunto.</p> : avail.map(q => <label key={q.id} className="flex gap-2 text-sm items-start"><input type="checkbox" className="mt-1" checked={d.questionIds.includes(q.id)} onChange={e => setD({ ...d, questionIds: e.target.checked ? [...d.questionIds, q.id] : d.questionIds.filter(x => x !== q.id) })} /><span><code className="text-xs">{q.id}</code> {q.stem.slice(0, 90)}…</span></label>)}</fieldset>
      <input className={inp} aria-label="Justificativa" placeholder="Justificativa da edição (mín. 5 caracteres)" value={why} onChange={e => setWhy(e.target.value)} />
      <ConflictBox conflict={act.conflict} onLoad={x => { apply(x); const c = lessonOf(x); if (c) setD({ topicId: c.topicId, title: c.title, steps: c.steps, questionIds: c.questionIds }); act.clear() }} /><Feedback busy={act.busy} ok={act.ok} errs={act.errs} />
      <button className="btn-p" disabled={act.busy || why.trim().length < 5 || (!!it && !dirty)} onClick={() => void act.run(() => (it ? adm.saveDraft({ ...it, rev }, payload(), why.trim()) : adm.create('lesson', payload(), why.trim(), key)), 'Rascunho salvo (não publicado).')}>Salvar rascunho</button>
      {it && <PublishBar item={it} onItem={apply} />}</>}</div></div>
}

// ---------------- FLASHCARDS
export function CardsTab() {
  const s = useList('card'), [open, setOpen] = useState<string | null>(null), [creating, setCreating] = useState(false)
  const sel = open ? s.byId.get(`card:${open}`) : undefined
  if (creating) return <CardEditor key="new" onItem={s.put} onBack={it => { setCreating(false); if (it) setOpen(it.id) }} />
  if (sel) return <CardEditor key={sel.id} item={sel} onItem={s.put} onBack={() => setOpen(null)} />
  const shown = s.list.slice(Math.min(s.page, Math.max(0, Math.ceil(s.list.length / 40) - 1)) * 40).slice(0, 40)
  return <div className="space-y-3"><Filters s={s} onNew={() => setCreating(true)} title="Flashcards" />
    <ul className="space-y-2">{shown.map(it => { const c = cardOf(it); return <li key={it.id}><button className="card w-full text-left !p-3 hover:border-indigo-400" onClick={() => setOpen(it.id)}><div className="flex flex-wrap gap-1.5 items-center"><code className="text-xs">{it.id}</code><PubBadge p={it.estado} />{it.origin === 'admin' && <span className="text-xs text-slate-500">criado no Admin</span>}</div><p className="text-sm line-clamp-1">{c?.front}</p><p className="text-xs text-slate-500">{topicTitle(s.topicOf(it))}</p></button></li> })}</ul>
    <Pager n={s.list.length} page={s.page} setPage={s.setPage} /></div>
}
function CardEditor({ item, onItem, onBack }: { item?: EdItem; onItem: (it: EdItem) => void; onBack: (it?: EdItem) => void }) {
  const cur = item ? cardOf(item) : undefined
  const [d, setD] = useState<CardData>({ topicId: cur?.topicId ?? '', front: cur?.front ?? '', back: cur?.back ?? '', lessonId: cur?.lessonId ?? '' }), [why, setWhy] = useState(''), [it, setIt] = useState<EdItem | undefined>(item), [rev, setRev] = useState(item?.rev ?? 0), [key] = useState(newKey), [tab, setTab] = useState<'texto' | 'historico'>('texto')
  const apply = (x: EdItem) => { setIt(x); setRev(x.rev); onItem(x) }
  const act = useAction(apply), base = item?.origin === 'catalogo'
  const lessons = LESSONS.filter(l => !d.topicId || l.topicId === d.topicId)
  return <div className="card space-y-3"><div className="flex flex-wrap gap-2 items-center"><button className="btn-s" onClick={() => onBack(it)}>← Lista</button>{it && <><code>{it.id}</code><PubBadge p={it.estado} /><span className="text-xs text-slate-500 ml-auto">versão {it.rev} · {fmt(it.updatedAt)}</span></>}</div>
    <div className="flex gap-1 text-sm">{(['texto', 'historico'] as const).map(k => <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-3 py-1.5 ${tab === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{k === 'texto' ? 'Conteúdo' : 'Histórico'}</button>)}</div>
    {tab === 'historico' && it && <History item={it} />}
    {tab === 'texto' && <><TopicSelect value={d.topicId} onChange={v => setD({ ...d, topicId: v, lessonId: '' })} disabled={base} />
      <select className={inp} aria-label="Aula do card" disabled={base} value={d.lessonId} onChange={e => setD({ ...d, lessonId: e.target.value })}><option value="">— aula —</option>{lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select>
      <textarea className={inp} rows={2} aria-label="Frente" placeholder="Frente (pergunta)" value={d.front} onChange={e => setD({ ...d, front: e.target.value })} />
      <textarea className={inp} rows={4} aria-label="Verso" placeholder="Verso (resposta)" value={d.back} onChange={e => setD({ ...d, back: e.target.value })} />
      {base && <p className="text-xs text-slate-500">Assunto e aula de um flashcard do catálogo não mudam (preserva os registros de revisão). Para trocar o conceito por outro, crie um flashcard novo e arquive este.</p>}
      <input className={inp} aria-label="Justificativa" placeholder="Justificativa da edição (mín. 5 caracteres)" value={why} onChange={e => setWhy(e.target.value)} />
      <ConflictBox conflict={act.conflict} onLoad={x => { apply(x); const c = cardOf(x); if (c) setD({ topicId: c.topicId, front: c.front, back: c.back, lessonId: c.lessonId ?? '' }); act.clear() }} /><Feedback busy={act.busy} ok={act.ok} errs={act.errs} />
      <button className="btn-p" disabled={act.busy || why.trim().length < 5} onClick={() => void act.run(() => (it ? adm.saveDraft({ ...it, rev }, d, why.trim()) : adm.create('card', d, why.trim(), key)), 'Rascunho salvo (não publicado).')}>Salvar rascunho</button>
      {it && <PublishBar item={it} onItem={apply} />}</>}</div>
}
