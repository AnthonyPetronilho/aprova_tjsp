import { useMemo, useState } from 'react'
import type { OptId, Question, Validation } from '../../types'
import { QUESTIONS } from '../../data/questions'
import { DISCIPLINES } from '../../data/edital'
import { AUDIT } from '../../data/audit'
import { VALIDATION } from '../../lib/learning'
import { adm, newKey, type EdItem, type QuestionData } from './api'
import { ConflictBox, Feedback, History, HumanBadge, PubBadge, PublishBar, TopicSelect, ValBadge, inp, srcLabel, topicTitle, TOPICS, useAction, useAdminData, fmt, ErrList } from './common'
import { Evidence } from './AuditTab'
const OPTS: OptId[] = ['A', 'B', 'C', 'D', 'E']
const blankQ = (): QuestionData => ({ topicId: '', stem: '', difficulty: 'Médio', answer: 'A', ref: '', options: OPTS.map(id => ({ id, text: '', why: '' })) })
// conteúdo mostrado/editado: rascunho > versão efetiva (catálogo base + publicado)

export default function QuestionsTab({ focusId, onFocus }: { focusId: string | null; onFocus: (id: string | null) => void }) {
  const { items, byId, put, loading, error, reload } = useAdminData()
  const [q, setQ] = useState(''), [disc, setDisc] = useState('all'), [topic, setTopic] = useState('all'), [val, setVal] = useState('all'), [pub, setPub] = useState('all'), [org, setOrg] = useState('all'), [page, setPage] = useState(0), [creating, setCreating] = useState(false)
  const qs = useMemo(() => items.filter(i => i.kind === 'question'), [items])
  const text = (it: EdItem) => (it.origin === 'admin' ? ((it.draft?.data ?? it.live) as QuestionData | undefined)?.stem ?? '' : QUESTIONS.find(x => x.id === it.id)?.stem ?? '')
  const topicOf = (it: EdItem) => (it.origin === 'admin' ? ((it.draft?.data ?? it.live) as QuestionData | undefined)?.topicId ?? '' : it.baseTopic ?? '')
  const list = useMemo(() => {
    const k = q.trim().toLowerCase()
    return qs.filter(it => (disc === 'all' || TOPICS.find(t => t.id === topicOf(it))?.discId === disc) && (topic === 'all' || topicOf(it) === topic) && (val === 'all' || it.validation === val) && (pub === 'all' || it.estado === pub) && (org === 'all' || (org === 'admin' ? it.origin === 'admin' : it.origin === 'catalogo')) && (!k || it.id.toLowerCase().includes(k) || text(it).toLowerCase().includes(k)))
      .sort((a, b) => (a.id < b.id ? -1 : 1))
  }, [qs, q, disc, topic, val, pub, org]) // eslint-disable-line react-hooks/exhaustive-deps
  const PAGE = 40, pages = Math.max(1, Math.ceil(list.length / PAGE)), cur = Math.min(page, pages - 1), shown = list.slice(cur * PAGE, cur * PAGE + PAGE)
  const sel = focusId ? byId.get(`question:${focusId}`) : undefined
  if (creating) return <NewQuestion onDone={it => { setCreating(false); if (it) { put(it); onFocus(it.id) } }} />
  if (focusId && sel) return <QuestionDetail item={sel} onItem={put} onBack={() => onFocus(null)} onOpen={onFocus} />
  const reset = () => setPage(0)
  return <div className="space-y-3">
    <div className="card space-y-2"><div className="flex flex-wrap gap-2 items-center"><h2 className="font-bold flex-1">Questões <span className="text-sm font-normal text-slate-500">({list.length} de {qs.length})</span></h2><button className="btn-s" onClick={() => void reload()}>↻ Recarregar</button><button className="btn-p" onClick={() => setCreating(true)}>+ Nova questão</button></div>
      <input className={inp} placeholder="Buscar por ID ou palavra do enunciado" aria-label="Buscar" value={q} onChange={e => { setQ(e.target.value); reset() }} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <select className={inp} aria-label="Disciplina" value={disc} onChange={e => { setDisc(e.target.value); setTopic('all'); reset() }}><option value="all">Todas as disciplinas</option>{DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <select className={inp} aria-label="Assunto" value={topic} onChange={e => { setTopic(e.target.value); reset() }}><option value="all">Todos os assuntos</option>{TOPICS.filter(t => disc === 'all' || t.discId === disc).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
        <select className={inp} aria-label="Validação" value={val} onChange={e => { setVal(e.target.value); reset() }}><option value="all">Toda validação</option>{(Object.keys(VALIDATION) as Validation[]).map(v => <option key={v} value={v}>{VALIDATION[v].label}</option>)}</select>
        <select className={inp} aria-label="Publicação" value={pub} onChange={e => { setPub(e.target.value); reset() }}><option value="all">Toda publicação</option><option value="rascunho">Rascunho</option><option value="em-revisao">Em revisão</option><option value="publicada">Publicada</option><option value="arquivada">Arquivada</option></select>
        <select className={inp} aria-label="Origem" value={org} onChange={e => { setOrg(e.target.value); reset() }}><option value="all">Toda origem</option><option value="catalogo">Catálogo base</option><option value="admin">Criadas no Admin</option></select></div></div>
    {loading && <p className="text-sm text-slate-500" role="status">Carregando…</p>}{error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
    <ul className="space-y-2">{shown.map(it => <li key={it.id}><button className="card w-full text-left !p-3 hover:border-indigo-400" onClick={() => onFocus(it.id)}><div className="flex flex-wrap gap-1.5 items-center mb-1"><code className="text-xs">{it.id}</code><ValBadge v={it.validation} /><PubBadge p={it.estado} /><HumanBadge src={it.validationSource} />{it.supersededBy && <span className="text-xs text-rose-700">substituída por {it.supersededBy}</span>}{it.replaces && <span className="text-xs text-slate-500">substitui {it.replaces}</span>}</div><p className="text-sm line-clamp-2">{text(it) || '(sem enunciado)'}</p><p className="text-xs text-slate-500 mt-1">{topicTitle(topicOf(it))} · {it.origin === 'admin' ? 'criada no Admin' : 'catálogo base'}</p></button></li>)}</ul>
    {!list.length && !loading && <p className="text-sm text-slate-500">Nenhuma questão com esses filtros.</p>}
    <div className="flex items-center gap-2 justify-center"><button className="btn-s" disabled={cur === 0} onClick={() => setPage(cur - 1)}>‹</button><span className="text-sm">{cur + 1} / {pages}</span><button className="btn-s" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>›</button></div></div>
}

function QForm({ value, onChange, lockMeaning, baseOnly }: { value: QuestionData; onChange: (v: QuestionData) => void; lockMeaning?: boolean; baseOnly?: boolean }) {
  const set = (p: Partial<QuestionData>) => onChange({ ...value, ...p }), opt = (id: OptId, p: Partial<{ text: string; why: string }>) => set({ options: value.options.map(o => (o.id === id ? { ...o, ...p } : o)) })
  const lock = !!lockMeaning
  return <div className="space-y-3">
    {!baseOnly && <><TopicSelect value={value.topicId} onChange={v => set({ topicId: v })} disabled={lock} />
      <div className="flex flex-wrap gap-2"><select className={inp + ' !w-auto'} aria-label="Dificuldade" value={value.difficulty} onChange={e => set({ difficulty: e.target.value as Question['difficulty'] })}>{['Fácil', 'Médio', 'Difícil'].map(d => <option key={d}>{d}</option>)}</select></div>
      <textarea className={inp} rows={4} placeholder="Enunciado" aria-label="Enunciado" disabled={lock} value={value.stem} onChange={e => set({ stem: e.target.value })} /></>}
    {baseOnly && <p className="text-sm rounded-xl bg-slate-100 dark:bg-slate-800 p-3"><b>Enunciado e alternativas (somente leitura):</b> {value.stem}</p>}
    {value.options.map(o => <div key={o.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="radio" name="gab" disabled={lock || baseOnly} checked={value.answer === o.id} onChange={() => set({ answer: o.id })} /> Alternativa {o.id}{value.answer === o.id && <span className="text-emerald-700 dark:text-emerald-300">(gabarito)</span>}</label>
      <input className={inp} placeholder={`Texto da alternativa ${o.id}`} aria-label={`Alternativa ${o.id}`} disabled={lock || baseOnly} value={o.text} onChange={e => opt(o.id, { text: e.target.value })} />
      <textarea className={inp} rows={2} placeholder={`Explicação da ${o.id}`} aria-label={`Explicação ${o.id}`} value={o.why} onChange={e => opt(o.id, { why: e.target.value })} /></div>)}
    <input className={inp} placeholder="Referência (dispositivo legal, fonte) — opcional" aria-label="Referência" value={value.ref ?? ''} onChange={e => set({ ref: e.target.value })} />
    {lock && <p className="text-xs text-slate-500">Enunciado, alternativas e gabarito de conteúdo publicado só mudam por <b>substituição</b> (o ID anterior continua rastreável).</p>}</div>
}

function NewQuestion({ onDone }: { onDone: (it?: EdItem) => void }) {
  const [v, setV] = useState<QuestionData>(blankQ), [why, setWhy] = useState('Criação de questão'), [key] = useState(newKey)
  const act = useAction(it => onDone(it))
  return <div className="card space-y-3"><h2 className="font-bold">Nova questão (nasce como rascunho)</h2><QForm value={v} onChange={setV} />
    <input className={inp} aria-label="Justificativa" placeholder="Justificativa / origem da questão" value={why} onChange={e => setWhy(e.target.value)} />
    <Feedback busy={act.busy} ok={act.ok} errs={act.errs} />
    <div className="flex gap-2"><button className="btn-p" disabled={act.busy} onClick={() => void act.run(() => adm.create('question', clean(v), why, key), 'Rascunho criado.')}>Salvar rascunho</button><button className="btn-s" onClick={() => onDone()}>Cancelar</button></div></div>
}
const clean = (v: QuestionData): QuestionData => ({ ...v, ref: v.ref?.trim() || undefined })

function QuestionDetail({ item, onItem, onBack, onOpen }: { item: EdItem; onItem: (it: EdItem) => void; onBack: () => void; onOpen: (id: string) => void }) {
  const base = QUESTIONS.find(x => x.id === item.id)
  const initial = (): QuestionData => {
    const d = (item.draft?.data ?? item.live) as Partial<QuestionData> & { optionWhy?: Record<string, string> } | null
    if (item.origin === 'admin') return { ...blankQ(), ...(d as QuestionData | null) }
    return { topicId: base?.topicId ?? '', stem: base?.stem ?? '', difficulty: base?.difficulty ?? 'Médio', answer: base?.answer ?? 'A', ref: d?.ref ?? (base as { ref?: string } | undefined)?.ref ?? '', options: (base?.options ?? []).map(o => ({ ...o, why: d?.optionWhy?.[o.id] ?? o.why })) }
  }
  const [form, setForm] = useState<QuestionData>(initial), [rev, setRev] = useState(item.rev), [why, setWhy] = useState('')
  const [tab, setTab] = useState<'conteudo' | 'evidencias' | 'revisao' | 'historico' | 'substituir'>('conteudo')
  const reloadForm = (it: EdItem) => { onItem(it); setRev(it.rev) }
  const act = useAction(it => { onItem(it); setRev(it.rev) })
  const published = item.origin === 'admin' && !!item.live
  const dirty = JSON.stringify(form) !== JSON.stringify(initial())
  const payload = (): unknown => (item.origin === 'catalogo' ? { optionWhy: Object.fromEntries(form.options.map(o => [o.id, o.why])), ...(form.ref?.trim() ? { ref: form.ref.trim() } : {}) } : clean(form))
  const readonly = !!item.supersededBy
  return <div className="space-y-3">
    <div className="card space-y-2"><div className="flex flex-wrap gap-2 items-center"><button className="btn-s" onClick={onBack}>← Lista</button><code>{item.id}</code><ValBadge v={item.validation} /><PubBadge p={item.estado} /><HumanBadge src={item.validationSource} /><span className="text-xs text-slate-500 ml-auto">versão {item.rev} · atualizado {fmt(item.updatedAt)}</span></div>
      <p className="text-xs text-slate-500">{topicTitle(form.topicId)} · {item.origin === 'admin' ? 'criada no Admin (autoral)' : 'catálogo base'}{item.replaces && <> · substitui <button className="underline" onClick={() => onOpen(item.replaces!)}>{item.replaces}</button></>}{item.supersededBy && <> · <b className="text-rose-700">substituída por <button className="underline" onClick={() => onOpen(item.supersededBy!)}>{item.supersededBy}</button> (fora das atividades novas; respostas antigas preservadas)</b></>}</p>
      <div className="flex flex-wrap gap-1 text-sm" role="tablist">{([['conteudo', 'Conteúdo'], ['evidencias', 'Auditoria e evidências'], ['revisao', 'Registrar revisão'], ['historico', 'Histórico'], ['substituir', 'Substituir']] as const).map(([k, n]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg px-3 py-1.5 ${tab === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{n}</button>)}</div></div>
    {tab === 'conteudo' && <div className="card space-y-3">
      {item.draft && <p className="text-sm rounded-xl bg-amber-50 dark:bg-amber-900/20 p-2">Há uma edição pendente ({item.draft.state === 'em-revisao' ? 'em revisão' : 'rascunho'}) de {item.draft.by} — “{item.draft.reason}”. Os estudantes veem a versão publicada.</p>}
      <QForm value={form} onChange={setForm} lockMeaning={published} baseOnly={item.origin === 'catalogo'} />
      {!readonly && <><input className={inp} aria-label="Justificativa da edição" placeholder="Justificativa da edição (obrigatória, mín. 5 caracteres)" value={why} onChange={e => setWhy(e.target.value)} />
        <ConflictBox conflict={act.conflict} onLoad={it => { reloadForm(it); act.clear(); setForm(initialFrom(it, base)); }} /><Feedback busy={act.busy} ok={act.ok} errs={act.errs} />
        <div className="flex flex-wrap gap-2"><button className="btn-p" disabled={act.busy || !dirty || why.trim().length < 5} onClick={() => void act.run(() => adm.saveDraft({ ...item, rev }, payload(), why.trim()), 'Rascunho salvo (ainda não publicado).')}>Salvar rascunho</button>
          {item.draft && item.pub !== 'rascunho' && <button className="btn-s" disabled={act.busy || why.trim().length < 5} onClick={() => void act.run(() => adm.discard({ ...item, rev }, why.trim()), 'Edição pendente descartada.')}>Descartar edição pendente</button>}</div></>}
      {!readonly && <PublishBar item={item} onItem={it => { onItem(it); setRev(it.rev); setForm(initialFrom(it, base)) }} canPublish={item.validation !== 'precisa-correcao'} />}</div>}
    {tab === 'evidencias' && <div className="card space-y-2"><Evidence id={item.id} /><p className="text-sm"><b>Situação atual:</b> <ValBadge v={item.validation} /> — {srcLabel(item.validationSource)}{item.validationBy && <> · por {item.validationBy} em {fmt(item.validationAt)}</>}{item.validationNote && <>. “{item.validationNote}”{item.validationRef && <> (fonte: {item.validationRef})</>}</>}</p></div>}
    {tab === 'revisao' && <ReviewForm item={item} onItem={it => { onItem(it); setRev(it.rev) }} />}
    {tab === 'historico' && <div className="card space-y-2"><h3 className="font-semibold">Histórico de alterações</h3><RestoreHistory item={{ ...item, rev }} onItem={it => { onItem(it); setRev(it.rev); setForm(initialFrom(it, base)); setTab('conteudo') }} /></div>}
    {tab === 'substituir' && <Replace item={item} base={initial()} onOpen={onOpen} onItem={onItem} />}
    {AUDIT[item.id]?.pendencies.length ? <p className="text-xs text-slate-500">Pendências da auditoria: {AUDIT[item.id].pendencies.join(' | ')}</p> : null}</div>
}
function initialFrom(it: EdItem, base?: Question): QuestionData {
  const d = (it.draft?.data ?? it.live) as (Partial<QuestionData> & { optionWhy?: Record<string, string> }) | null
  if (it.origin === 'admin') return { ...blankQ(), ...(d as QuestionData | null) }
  return { topicId: base?.topicId ?? '', stem: base?.stem ?? '', difficulty: base?.difficulty ?? 'Médio', answer: base?.answer ?? 'A', ref: d?.ref ?? '', options: (base?.options ?? []).map(o => ({ ...o, why: d?.optionWhy?.[o.id] ?? o.why })) }
}
function RestoreHistory({ item, onItem }: { item: EdItem; onItem: (it: EdItem) => void }) {
  const act = useAction(onItem)
  return <><History item={item} onRestore={v => void act.run(() => adm.restore(item, v, `Recuperação da versão ${v}`), `Versão ${v} recuperada como rascunho (publique de novo para valer).`)} /><ConflictBox conflict={act.conflict} onLoad={onItem} /><Feedback busy={act.busy} ok={act.ok} errs={act.errs} /></>
}
function ReviewForm({ item, onItem }: { item: EdItem; onItem: (it: EdItem) => void }) {
  const [v, setV] = useState<Validation>(item.validation ?? 'pendente'), [kind, setKind] = useState<'administrador' | 'profissional-declarado'>('administrador'), [note, setNote] = useState(''), [ref, setRef] = useState('')
  const act = useAction(onItem)
  return <div className="card space-y-3"><h3 className="font-semibold">Registrar revisão de conteúdo</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300">A auditoria feita por IA <b>não</b> é revisão humana e continua registrada à parte. Aqui você registra uma revisão sua, com autoria e data. “Validada” só tem efeito no domínio se a questão estiver <b>publicada</b> e elegível.</p>
    <select className={inp} aria-label="Nova situação" value={v} onChange={e => setV(e.target.value as Validation)}>{(Object.keys(VALIDATION) as Validation[]).map(x => <option key={x} value={x}>{VALIDATION[x].label}</option>)}</select>
    <fieldset className="space-y-1 text-sm"><legend className="font-semibold">Quem revisou</legend>
      <label className="flex gap-2"><input type="radio" checked={kind === 'administrador'} onChange={() => setKind('administrador')} /> Eu mesma(o), como administrador — <i>revisão pessoal, não é revisão por especialista</i></label>
      <label className="flex gap-2"><input type="radio" checked={kind === 'profissional-declarado'} onChange={() => setKind('profissional-declarado')} /> Profissional (declarado por mim) — <i>a plataforma não comprova a qualificação</i></label></fieldset>
    <textarea className={inp} rows={3} aria-label="Observação" placeholder="O que foi conferido e como (mín. 10 caracteres)" value={note} onChange={e => setNote(e.target.value)} />
    <input className={inp} aria-label="Fonte conferida" placeholder={v === 'validada' ? 'Fonte/dispositivo conferido (obrigatório para validar)' : 'Fonte/dispositivo (opcional)'} value={ref} onChange={e => setRef(e.target.value)} />
    <ConflictBox conflict={act.conflict} onLoad={onItem} /><Feedback busy={act.busy} ok={act.ok} errs={act.errs} />
    <button className="btn-p" disabled={act.busy || note.trim().length < 10 || (v === 'validada' && ref.trim().length < 3)} onClick={() => void act.run(() => adm.validate(item, { validation: v, reviewKind: kind, note: note.trim(), reference: ref.trim() }), 'Revisão registrada.')}>Registrar revisão</button></div>
}
function Replace({ item, base, onOpen, onItem }: { item: EdItem; base: QuestionData; onOpen: (id: string) => void; onItem: (it: EdItem) => void }) {
  const [v, setV] = useState<QuestionData>(base), [why, setWhy] = useState(''), [key] = useState(newKey), [created, setCreated] = useState<EdItem | null>(null)
  const act = useAction(it => { setCreated(it); onItem(it) })
  if (item.supersededBy) return <div className="card"><p className="text-sm">Esta questão já foi substituída por <button className="underline" onClick={() => onOpen(item.supersededBy!)}>{item.supersededBy}</button>.</p></div>
  return <div className="card space-y-3"><h3 className="font-semibold">Substituir questão</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300">Use quando mudar o gabarito ou o sentido. Cria uma questão <b>nova</b> (rascunho). Quando a nova for publicada, a antiga sai das atividades novas, mas o ID, as respostas, o XP e os simulados antigos permanecem como estão. O domínio da nova começa do zero.</p>
    {created ? <p className="text-sm">Criada: <button className="underline" onClick={() => onOpen(created.id)}>{created.id}</button>. Abra-a para revisar e publicar.</p> : <>
      <QForm value={v} onChange={setV} />
      <input className={inp} aria-label="Justificativa da substituição" placeholder="Por que substituir (mín. 10 caracteres)" value={why} onChange={e => setWhy(e.target.value)} />
      <ErrList list={[]} /><ConflictBox conflict={act.conflict} onLoad={onItem} /><Feedback busy={act.busy} ok={act.ok} errs={act.errs} />
      <button className="btn-p" disabled={act.busy || why.trim().length < 10} onClick={() => void act.run(() => adm.replace(item, clean(v), why.trim(), key), 'Questão substituta criada como rascunho.')}>Criar questão substituta</button></>}</div>
}
