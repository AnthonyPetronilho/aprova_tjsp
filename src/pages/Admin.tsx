import { useRef, useState } from 'react'
import type { Flashcard, Lesson, OptId, Question, Step, Video } from '../types'
import { DISCIPLINES } from '../data/edital'
import { LESSONS } from '../data/lessons'
import { QUESTIONS } from '../data/questions'
import { FLASHCARDS } from '../data/cards'
import { useContent, saveLesson, saveQuestion, saveCard, removeItem, setVideo, newId, isBuiltin, exportContent, importContent, resetContent, topicsFlat, type Status } from '../lib/content'
import { parseVideo } from '../lib/video'
import VideoPlayer from '../components/VideoPlayer'
const inp = 'w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm'
const OPTS: OptId[] = ['A', 'B', 'C', 'D', 'E']
const Badge = ({ st }: { st: Status | 'embutido' }) => <span className={`text-xs rounded-full px-2 py-0.5 ${st === 'publicado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : st === 'rascunho' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' : 'bg-slate-200 dark:bg-slate-700'}`}>{st === 'embutido' ? 'do app' : st}</span>
const TopicSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => <select className={inp} value={value} onChange={e => onChange(e.target.value)} aria-label="Assunto do edital"><option value="">— assunto do edital —</option>{DISCIPLINES.map(d => <optgroup key={d.id} label={d.name}>{d.topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</optgroup>)}</select>
const Errors = ({ list }: { list: string[] }) => list.length ? <ul className="text-sm text-rose-700 dark:text-rose-300 list-disc ml-5" role="alert">{list.map(e => <li key={e}>{e}</li>)}</ul> : null
function Actions({ reviewed, setReviewed, onSave, onCancel }: { reviewed: boolean; setReviewed: (b: boolean) => void; onSave: (publish: boolean) => void; onCancel: () => void }) {
  return <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
    <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={reviewed} onChange={e => setReviewed(e.target.checked)} /><span>Conferi o conteúdo com fonte confiável (legislação, gramática, etc.). Conteúdo gerado por IA <b>precisa</b> ser revisado antes de publicar.</span></label>
    <div className="flex flex-wrap gap-2"><button className="btn-p" onClick={() => onSave(true)}>Publicar</button><button className="btn-s" onClick={() => onSave(false)}>Salvar rascunho</button><button className="btn-s" onClick={onCancel}>Cancelar</button></div>
    <p className="text-xs text-slate-500">Rascunhos não aparecem para estudo. Só o que é publicado entra no app.</p></div>
}

function LessonForm({ init, onDone }: { init: Lesson & { reviewed?: boolean }; onDone: () => void }) {
  const [l, setL] = useState(init), [errs, setErrs] = useState<string[]>([]), [rev, setRev] = useState(!!init.reviewed)
  const step = (i: number, p: Partial<Step>) => setL({ ...l, steps: l.steps.map((s, k) => k === i ? { ...s, ...p } : s) })
  const move = (i: number, d: number) => { const a = [...l.steps], j = i + d; if (j < 0 || j >= a.length) return;[a[i], a[j]] = [a[j], a[i]]; setL({ ...l, steps: a }) }
  const avail = QUESTIONS.filter(q => q.topicId === l.topicId), vi = l.video?.url ? parseVideo(l.video.url) : null
  const submit = (publish: boolean) => {
    if (!l.title.trim()) return setErrs(['Dê um título à aula (mesmo para rascunho).'])
    const e = saveLesson({ ...l, reviewed: rev, video: l.video?.url?.trim() ? { url: l.video.url.trim(), title: l.video.title?.trim() || undefined } : undefined }, publish); setErrs(e); if (!e.length) onDone()
  }
  return <div className="card space-y-3"><h2 className="font-bold">{LESSONS.some(x => x.id === l.id) || init.title ? 'Editar aula' : 'Nova aula'}</h2>
    <TopicSelect value={l.topicId} onChange={v => setL({ ...l, topicId: v, questionIds: [] })} />
    <input className={inp} placeholder="Título da aula" aria-label="Título da aula" value={l.title} onChange={e => setL({ ...l, title: e.target.value })} />
    <div className="space-y-3">{l.steps.map((s, i) => <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2"><div className="flex gap-2 items-center"><span className="text-sm font-semibold">Etapa {i + 1}</span><span className="flex-1" /><button className="underline text-xs" onClick={() => move(i, -1)} aria-label={`Subir etapa ${i + 1}`}>↑</button><button className="underline text-xs" onClick={() => move(i, 1)} aria-label={`Descer etapa ${i + 1}`}>↓</button><button className="underline text-xs text-rose-600" onClick={() => setL({ ...l, steps: l.steps.filter((_, k) => k !== i) })}>remover</button></div>
      <input className={inp} placeholder="Título da etapa" aria-label={`Título da etapa ${i + 1}`} value={s.title} onChange={e => step(i, { title: e.target.value })} />
      <textarea className={inp} rows={5} placeholder="Texto (separe parágrafos com uma linha em branco)" aria-label={`Texto da etapa ${i + 1}`} value={s.body.join('\n\n')} onChange={e => step(i, { body: e.target.value.split(/\n\s*\n/) })} />
      <textarea className={inp} rows={2} placeholder="(opcional) Explicação alternativa para o botão “Não entendi”" aria-label={`Explicação alternativa da etapa ${i + 1}`} value={s.alt ?? ''} onChange={e => step(i, { alt: e.target.value || undefined })} /></div>)}
      <button className="btn-s" onClick={() => setL({ ...l, steps: [...l.steps, { title: '', body: [''] }] })}>+ Adicionar etapa</button></div>
    <fieldset className="space-y-1"><legend className="font-semibold text-sm">Questões do teste da aula</legend>{!l.topicId ? <p className="text-sm text-slate-500">Escolha o assunto para listar as questões.</p> : avail.length === 0 ? <p className="text-sm text-slate-500">Ainda não há questões publicadas deste assunto. Cadastre na aba Questões e volte aqui.</p> : avail.map(q => <label key={q.id} className="flex gap-2 text-sm"><input type="checkbox" checked={l.questionIds.includes(q.id)} onChange={e => setL({ ...l, questionIds: e.target.checked ? [...l.questionIds, q.id] : l.questionIds.filter(x => x !== q.id) })} /><span>{q.stem.slice(0, 110)}{q.stem.length > 110 ? '…' : ''}</span></label>)}</fieldset>
    <fieldset className="space-y-2"><legend className="font-semibold text-sm">🎬 Reforço em vídeo (opcional)</legend><p className="text-xs text-slate-500">Cole um link que você mesmo escolheu (YouTube ou Vimeo são incorporados na aula; outros viram link). O app não sugere nem inventa vídeos.</p>
      <input className={inp} placeholder="https://www.youtube.com/watch?v=…" aria-label="Link do vídeo" value={l.video?.url ?? ''} onChange={e => setL({ ...l, video: { ...l.video, url: e.target.value } })} />
      <input className={inp} placeholder="Título do vídeo (opcional)" aria-label="Título do vídeo" value={l.video?.title ?? ''} onChange={e => setL({ ...l, video: { url: l.video?.url ?? '', title: e.target.value } })} />
      {l.video?.url && !vi && <p className="text-sm text-rose-600" role="alert">Link inválido: use um endereço https completo.</p>}{vi && <VideoPlayer video={l.video!} />}</fieldset>
    <Errors list={errs} /><Actions reviewed={rev} setReviewed={setRev} onSave={submit} onCancel={onDone} /></div>
}

function QuestionForm({ init, onDone }: { init: Question & { reviewed?: boolean }; onDone: () => void }) {
  const [q, setQ] = useState(init), [errs, setErrs] = useState<string[]>([]), [rev, setRev] = useState(!!init.reviewed)
  const opt = (id: OptId, p: Partial<{ text: string; why: string }>) => setQ({ ...q, options: q.options.map(o => o.id === id ? { ...o, ...p } : o) })
  const submit = (publish: boolean) => { if (!q.stem.trim()) return setErrs(['Escreva o enunciado (mesmo para rascunho).']); const e = saveQuestion({ ...q, reviewed: rev }, publish); setErrs(e); if (!e.length) onDone() }
  return <div className="card space-y-3"><h2 className="font-bold">Questão</h2>
    <TopicSelect value={q.topicId} onChange={v => setQ({ ...q, topicId: v })} />
    <div className="flex flex-wrap gap-2"><select className={inp + ' !w-auto'} aria-label="Dificuldade" value={q.difficulty} onChange={e => setQ({ ...q, difficulty: e.target.value as Question['difficulty'] })}><option>Fácil</option><option>Médio</option><option>Difícil</option></select>
      <select className={inp + ' !w-auto'} aria-label="Origem" value={q.origin} onChange={e => setQ({ ...q, origin: e.target.value as Question['origin'] })}><option value="autoral">Autoral (escrita por mim)</option><option value="ia-revisada">Gerada por IA e revisada por mim</option></select></div>
    <textarea className={inp} rows={4} placeholder="Enunciado" aria-label="Enunciado" value={q.stem} onChange={e => setQ({ ...q, stem: e.target.value })} />
    {q.options.map(o => <div key={o.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2"><label className="flex items-center gap-2 text-sm font-semibold"><input type="radio" name="gab" checked={q.answer === o.id} onChange={() => setQ({ ...q, answer: o.id })} aria-label={`Gabarito é ${o.id}`} /> {o.id}) {q.answer === o.id && <span className="text-emerald-600 text-xs">gabarito</span>}</label>
      <input className={inp} placeholder={`Texto da alternativa ${o.id}`} aria-label={`Alternativa ${o.id}`} value={o.text} onChange={e => opt(o.id, { text: e.target.value })} />
      <input className={inp} placeholder={`Por que a ${o.id} está certa/errada (comentário)`} aria-label={`Comentário ${o.id}`} value={o.why} onChange={e => opt(o.id, { why: e.target.value })} /></div>)}
    <Errors list={errs} /><Actions reviewed={rev} setReviewed={setRev} onSave={submit} onCancel={onDone} /></div>
}

function CardForm({ init, onDone }: { init: Flashcard & { reviewed?: boolean }; onDone: () => void }) {
  const [c, setC] = useState(init), [errs, setErrs] = useState<string[]>([]), [rev, setRev] = useState(!!init.reviewed)
  const submit = (publish: boolean) => { if (!c.front.trim()) return setErrs(['Escreva a frente do card (mesmo para rascunho).']); const e = saveCard({ ...c, reviewed: rev }, publish); setErrs(e); if (!e.length) onDone() }
  return <div className="card space-y-3"><h2 className="font-bold">Flashcard</h2>
    <TopicSelect value={c.topicId} onChange={v => setC({ ...c, topicId: v })} />
    <select className={inp} aria-label="Aula do card" value={c.lessonId ?? ''} onChange={e => setC({ ...c, lessonId: e.target.value || undefined })}><option value="">— aula à qual o card pertence —</option>{LESSONS.filter(l => !c.topicId || l.topicId === c.topicId).map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select>
    <textarea className={inp} rows={2} placeholder="Frente (pergunta)" aria-label="Frente" value={c.front} onChange={e => setC({ ...c, front: e.target.value })} />
    <textarea className={inp} rows={3} placeholder="Verso (resposta)" aria-label="Verso" value={c.back} onChange={e => setC({ ...c, back: e.target.value })} />
    <Errors list={errs} /><Actions reviewed={rev} setReviewed={setRev} onSave={submit} onCancel={onDone} /></div>
}

const topicName = (id: string) => topicsFlat.find(t => t.id === id)?.title ?? '(sem assunto)'
function Row({ title, sub, st, onEdit, onDelete }: { title: string; sub: string; st: Status | 'embutido'; onEdit?: () => void; onDelete?: () => void }) {
  const [c, setC] = useState(false)
  return <li className="flex flex-wrap items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-700"><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{title || '(sem título)'}</p><p className="text-xs text-slate-500 truncate">{sub}</p></div><Badge st={st} />
    {onEdit && <button className="btn-s !py-1 text-xs" onClick={onEdit}>Editar</button>}
    {onDelete && (c ? <><button className="btn !py-1 text-xs bg-rose-600 text-white" onClick={onDelete}>Confirmar exclusão</button><button className="underline text-xs" onClick={() => setC(false)}>Não</button></> : <button className="underline text-xs text-rose-600" onClick={() => setC(true)}>Excluir</button>)}</li>
}
function VideosTab() {
  const c = useContent(), [msg, setMsg] = useState('')
  return <div className="card space-y-3"><h2 className="font-bold">🎬 Vídeos de reforço por aula</h2><p className="text-sm text-slate-500">Cole o link de um vídeo que você escolheu para cada aula. Vale também para as aulas que já vêm no app.</p>
    {LESSONS.map(l => <VideoRow key={l.id + (c.videos[l.id]?.url ?? '')} l={l} onMsg={setMsg} />)}{msg && <p className="text-sm" role="status">{msg}</p>}</div>
}
function VideoRow({ l, onMsg }: { l: Lesson; onMsg: (m: string) => void }) {
  const [url, setUrl] = useState(l.video?.url ?? ''), [title, setTitle] = useState(l.video?.title ?? ''), v = url.trim() ? parseVideo(url) : null
  const save = () => { if (!url.trim()) { setVideo(l.id, null); return onMsg(`Vídeo removido de “${l.title}”.`) } if (!v) return onMsg('Link inválido: use um endereço https completo.'); setVideo(l.id, { url: url.trim(), title: title.trim() || undefined } as Video); onMsg(`Vídeo salvo em “${l.title}”.`) }
  return <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2"><p className="font-semibold text-sm">{l.title} <span className="text-xs font-normal text-slate-500">· {topicName(l.topicId)}</span></p>
    <input className={inp} aria-label={`Link do vídeo de ${l.title}`} placeholder="https://…" value={url} onChange={e => setUrl(e.target.value)} /><input className={inp} aria-label={`Título do vídeo de ${l.title}`} placeholder="Título (opcional)" value={title} onChange={e => setTitle(e.target.value)} />
    {url.trim() && !v && <p className="text-sm text-rose-600" role="alert">Link inválido.</p>}{v && <VideoPlayer video={{ url: url.trim(), title }} />}
    <button className="btn-s !py-1 text-sm" onClick={save}>{url.trim() ? 'Salvar vídeo' : l.video ? 'Remover vídeo' : 'Salvar'}</button></div>
}
function BackupTab() {
  const [msg, setMsg] = useState(''), [conf, setConf] = useState(false), f = useRef<HTMLInputElement>(null)
  const down = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([exportContent()], { type: 'application/json' })); a.download = `aprova-tjsp-conteudo-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href); setMsg('Conteúdo exportado.') }
  const up = async (file?: File) => { if (!file) return; try { const r = importContent(JSON.parse(await file.text())); setMsg(r.ok ? `Conteúdo importado (${r.added} item(ns) novo(s)).` : 'Arquivo inválido: não parece um conteúdo do Aprova TJSP.') } catch { setMsg('Não foi possível ler o arquivo.') } if (f.current) f.current.value = '' }
  return <div className="card space-y-3"><h2 className="font-bold">Backup do conteúdo</h2><p className="text-sm text-slate-500">O conteúdo que você cria fica só neste navegador. Exporte de vez em quando; quando o servidor existir, é por aqui que ele será migrado. O backup de progresso (Configurações) é separado.</p>
    <div className="flex flex-wrap gap-2"><button className="btn-p" onClick={down}>⬇️ Exportar conteúdo</button><button className="btn-s" onClick={() => f.current?.click()}>⬆️ Importar conteúdo</button><input ref={f} type="file" accept="application/json,.json" className="hidden" onChange={e => up(e.target.files?.[0])} aria-label="Arquivo de conteúdo" /></div>
    {!conf ? <button className="underline text-sm text-rose-600" onClick={() => setConf(true)}>Apagar todo o conteúdo criado por mim…</button> : <div className="flex gap-2 items-center text-sm"><button className="btn bg-rose-600 text-white" onClick={() => { resetContent(); setConf(false); setMsg('Conteúdo criado por você foi apagado.') }}>Sim, apagar</button><button className="btn-s" onClick={() => setConf(false)}>Cancelar</button></div>}
    {msg && <p className="text-sm" role="status">{msg}</p>}</div>
}

type Tab = 'aulas' | 'questoes' | 'cards' | 'videos' | 'backup'
export default function Admin() {
  const c = useContent(), [tab, setTab] = useState<Tab>('aulas'), [edit, setEdit] = useState<null | { kind: Tab; item: unknown }>(null)
  const chip = (k: Tab) => `px-3 py-1 rounded-full text-sm ${tab === k ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`
  const done = () => setEdit(null)
  const blankLesson = (): Lesson => ({ id: newId('l'), topicId: '', title: '', steps: [{ title: '', body: [''] }], questionIds: [] })
  const blankQ = (): Question => ({ id: newId('q'), topicId: '', stem: '', options: OPTS.map(id => ({ id, text: '', why: '' })), answer: 'A', difficulty: 'Médio', origin: 'autoral' })
  const blankC = (): Flashcard => ({ id: newId('c'), topicId: '', front: '', back: '', origin: 'aula' })
  const customCount = c.lessons.length + c.questions.length + c.cards.length
  return <div className="space-y-4 max-w-3xl"><div><h1 className="text-2xl font-bold">🛠️ Administração de conteúdo</h1><p className="text-sm text-slate-500">Modo editor local: tudo o que você criar fica neste navegador ({customCount} item(ns) seu(s)). Conteúdo do app (“do app”) não pode ser alterado aqui, apenas receber vídeo.</p></div>
    <div className="flex gap-1 flex-wrap" role="tablist">{([['aulas', 'Aulas'], ['questoes', 'Questões'], ['cards', 'Flashcards'], ['videos', 'Vídeos'], ['backup', 'Backup']] as [Tab, string][]).map(([k, n]) => <button key={k} role="tab" aria-selected={tab === k} className={chip(k)} onClick={() => { setTab(k); setEdit(null) }}>{n}</button>)}</div>
    {edit?.kind === 'aulas' && <LessonForm key={(edit.item as Lesson).id} init={edit.item as Lesson} onDone={done} />}
    {edit?.kind === 'questoes' && <QuestionForm key={(edit.item as Question).id} init={edit.item as Question} onDone={done} />}
    {edit?.kind === 'cards' && <CardForm key={(edit.item as Flashcard).id} init={edit.item as Flashcard} onDone={done} />}
    {!edit && tab === 'aulas' && <div className="card"><div className="flex items-center mb-2"><h2 className="font-bold flex-1">Aulas</h2><button className="btn-p" onClick={() => setEdit({ kind: 'aulas', item: blankLesson() })}>+ Nova aula</button></div><ul>
      {c.lessons.map(l => <Row key={l.id} title={l.title} sub={`${topicName(l.topicId)} · ${l.steps.length} etapa(s)${l.video ? ' · 🎬' : ''}`} st={l.status} onEdit={() => setEdit({ kind: 'aulas', item: l })} onDelete={() => removeItem('lessons', l.id)} />)}
      {LESSONS.filter(l => isBuiltin(l.id)).map(l => <Row key={l.id} title={l.title} sub={`${topicName(l.topicId)}${l.video ? ' · 🎬' : ''}`} st="embutido" />)}</ul></div>}
    {!edit && tab === 'questoes' && <div className="card"><div className="flex items-center mb-2"><h2 className="font-bold flex-1">Questões <span className="text-sm font-normal text-slate-500">({QUESTIONS.length} publicadas no banco)</span></h2><button className="btn-p" onClick={() => setEdit({ kind: 'questoes', item: blankQ() })}>+ Nova questão</button></div><ul>
      {c.questions.map(q => <Row key={q.id} title={q.stem} sub={`${topicName(q.topicId)} · ${q.difficulty}`} st={q.status} onEdit={() => setEdit({ kind: 'questoes', item: q })} onDelete={() => removeItem('questions', q.id)} />)}
      {QUESTIONS.filter(q => isBuiltin(q.id)).map(q => <Row key={q.id} title={q.stem} sub={`${topicName(q.topicId)} · ${q.difficulty}`} st="embutido" />)}</ul></div>}
    {!edit && tab === 'cards' && <div className="card"><div className="flex items-center mb-2"><h2 className="font-bold flex-1">Flashcards</h2><button className="btn-p" onClick={() => setEdit({ kind: 'cards', item: blankC() })}>+ Novo flashcard</button></div><ul>
      {c.cards.map(x => <Row key={x.id} title={x.front} sub={topicName(x.topicId)} st={x.status} onEdit={() => setEdit({ kind: 'cards', item: x })} onDelete={() => removeItem('cards', x.id)} />)}
      {FLASHCARDS.filter(x => isBuiltin(x.id)).map(x => <Row key={x.id} title={x.front} sub={topicName(x.topicId)} st="embutido" />)}</ul></div>}
    {!edit && tab === 'videos' && <VideosTab />}{!edit && tab === 'backup' && <BackupTab />}</div>
}
