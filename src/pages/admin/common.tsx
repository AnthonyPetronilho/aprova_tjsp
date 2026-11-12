import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { adm, Conflict, Invalid, PUB_LABEL, SOURCE_LABEL, type EdItem, type HistEntry, type Pub } from './api'
import { VALIDATION } from '../../lib/learning'
import { DISCIPLINES } from '../../data/edital'
import type { Validation } from '../../types'
export const inp = 'w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm'
export const TOPICS = DISCIPLINES.flatMap(d => d.topics.map(t => ({ id: t.id, title: t.title, disc: d.name, discId: d.id })))
export const topicTitle = (id: string) => TOPICS.find(t => t.id === id)?.title ?? '(sem assunto)'
export const fmt = (iso?: string) => { if (!iso) return '—'; const d = new Date(iso); return Number.isNaN(+d) ? iso : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) }
export const PubBadge = ({ p }: { p: Pub }) => <span className={`text-xs rounded-full px-2 py-0.5 whitespace-nowrap ${PUB_LABEL[p].cls}`}>{PUB_LABEL[p].t}</span>
export const ValBadge = ({ v }: { v: Validation | null }) => (v ? <span title={VALIDATION[v].hint} className={`text-xs rounded-full px-2 py-0.5 whitespace-nowrap ${VALIDATION[v].cls}`}>{VALIDATION[v].label}</span> : null)
export const HumanBadge = ({ src }: { src: string | null }) => (src === 'revisao-humana-administrador' || src === 'revisao-profissional-declarada' ? <span className="text-xs rounded-full px-2 py-0.5 bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-200 whitespace-nowrap">{src === 'revisao-humana-administrador' ? 'Revisão do administrador' : 'Revisão profissional declarada'}</span> : null)
export const TopicSelect = ({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) => <select className={inp} disabled={disabled} value={value} onChange={e => onChange(e.target.value)} aria-label="Assunto do edital"><option value="">— assunto do edital —</option>{DISCIPLINES.map(d => <optgroup key={d.id} label={d.name}>{d.topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</optgroup>)}</select>
export const ErrList = ({ list }: { list: string[] }) => (list.length ? <ul className="text-sm text-rose-700 dark:text-rose-300 list-disc ml-5" role="alert">{list.map(e => <li key={e}>{e}</li>)}</ul> : null)

// ---- dados do servidor (lista completa de itens editoriais + visão geral). Um único ponto de recarga.
interface Ctx { items: EdItem[]; byId: Map<string, EdItem>; loading: boolean; error: string; reload: () => Promise<void>; put: (it: EdItem) => void }
const DataCtx = createContext<Ctx | null>(null)
export const useAdminData = () => { const c = useContext(DataCtx); if (!c) throw new Error('fora do provedor'); return c }
export function AdminData({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EdItem[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState('')
  const reload = useCallback(async () => { setLoading(true); try { setItems((await adm.items()).items); setError('') } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao carregar.') } setLoading(false) }, [])
  useEffect(() => { void reload() }, [reload])
  const byId = useMemo(() => new Map(items.map(i => [`${i.kind}:${i.id}`, i])), [items])
  const put = useCallback((it: EdItem) => setItems(l => (l.some(x => x.kind === it.kind && x.id === it.id) ? l.map(x => (x.kind === it.kind && x.id === it.id ? it : x)) : [...l, it])), [])
  return <DataCtx.Provider value={{ items, byId, loading, error, reload, put }}>{children}</DataCtx.Provider>
}
// executa uma operação de escrita e traduz os erros do servidor (conflito, validação) em mensagens claras
export function useAction(onItem: (it: EdItem) => void) {
  const [busy, setBusy] = useState(false), [errs, setErrs] = useState<string[]>([]), [conflict, setConflict] = useState<EdItem | null>(null), [ok, setOk] = useState('')
  const run = useCallback(async (fn: () => Promise<{ item: EdItem }>, okMsg: string) => {
    if (busy) return false
    setBusy(true); setErrs([]); setConflict(null); setOk('')
    try { const r = await fn(); onItem(r.item); setOk(okMsg); setBusy(false); return true }
    catch (e) {
      if (e instanceof Conflict) { setConflict(e.current); setErrs([e.message]) }
      else if (e instanceof Invalid) setErrs([e.message, ...e.details])
      else setErrs([e instanceof Error ? e.message : 'Falha na operação.'])
      setBusy(false); return false
    }
  }, [busy, onItem])
  return { busy, errs, conflict, ok, run, clear: () => { setErrs([]); setConflict(null); setOk('') } }
}
export function ConflictBox({ conflict, onLoad }: { conflict: EdItem | null; onLoad: (it: EdItem) => void }) {
  if (!conflict) return null
  return <div role="alert" className="rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm space-y-2"><p className="font-semibold">⚠️ Conflito de edição</p><p>O conteúdo está na versão {conflict.rev} (alterado por {conflict.updatedBy} em {fmt(conflict.updatedAt)}). Sua edição <b>não</b> foi salva e nada foi sobrescrito. Carregue a versão atual, confira e refaça a alteração.</p><button className="btn-s" onClick={() => onLoad(conflict)}>Carregar versão atual</button></div>
}
export function Feedback({ busy, ok, errs }: { busy: boolean; ok: string; errs: string[] }) {
  return <div aria-live="polite" className="space-y-1">{busy && <p className="text-sm text-slate-500">Salvando…</p>}{ok && !busy && <p className="text-sm text-emerald-700 dark:text-emerald-300">✓ {ok}</p>}<ErrList list={errs} /></div>
}
const TYPE_LABEL: Record<string, string> = { criacao: 'Criação', 'edicao-rascunho': 'Edição (rascunho)', 'envio-revisao': 'Enviado para revisão', 'volta-rascunho': 'Voltou a rascunho', publicacao: 'Publicação', arquivamento: 'Arquivamento', reativacao: 'Reativação', 'descarte-rascunho': 'Rascunho descartado', validacao: 'Validação/revisão', substituicao: 'Substituição', restauracao: 'Recuperação de versão' }
export function History({ item, onRestore }: { item: EdItem; onRestore?: (version: number) => void }) {
  const [h, setH] = useState<HistEntry[] | null>(null), [err, setErr] = useState('')
  useEffect(() => { let on = true; adm.item(item.kind, item.id).then(r => { if (on) setH(r.history) }).catch(e => { if (on) setErr(e instanceof Error ? e.message : 'Falha') }); return () => { on = false } }, [item.kind, item.id, item.rev])
  if (err) return <p className="text-sm text-rose-600">{err}</p>
  if (!h) return <p className="text-sm text-slate-500">Carregando histórico…</p>
  if (!h.length) return <p className="text-sm text-slate-500">Sem alterações administrativas registradas (conteúdo ainda como no catálogo base).</p>
  return <ol className="space-y-2 text-sm">{h.map(e => <li key={e.rev} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2"><div className="flex flex-wrap gap-2 items-center"><b>v{e.rev}</b><span>{TYPE_LABEL[e.type] ?? e.type}</span><span className="text-slate-500">{fmt(e.at)} · {e.by}</span><PubBadge p={e.after.pub} />{e.after.validation && <ValBadge v={e.after.validation} />}{onRestore && !!(e.after.draft || e.after.live) && <button className="btn-s !py-0.5 !px-2 text-xs ml-auto" onClick={() => onRestore(e.rev)}>Recuperar como rascunho</button>}</div><p className="text-slate-700 dark:text-slate-300">“{e.reason}”</p>{e.review && <p className="text-xs text-teal-800 dark:text-teal-300">{e.review.label} — fonte: {e.review.reference ?? '—'}</p>}{e.refs && <p className="text-xs text-slate-500">Referências: {e.refs}</p>}</li>)}</ol>
}
export const srcLabel = (s: string | null) => (s ? SOURCE_LABEL[s] ?? s : '—')
// Painel de situação + ações de publicação, comum a questões, aulas e flashcards
export function PublishBar({ item, onItem, canPublish = true }: { item: EdItem; onItem: (it: EdItem) => void; canPublish?: boolean }) {
  const act = useAction(onItem), [why, setWhy] = useState(''), [conf, setConf] = useState(false), [keep, setKeep] = useState(false)
  const w = why.trim().length >= 5
  const go = (to: Pub, msg: string) => act.run(() => adm.setState(item, to, why.trim(), { confirmReviewed: conf, keepValidation: keep }), msg)
  return <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2"><p className="font-semibold text-sm">Publicação</p>
    <p className="text-sm">Situação: <PubBadge p={item.estado} /> {item.draft && item.pub === 'publicada' && <span className="text-xs text-slate-500">(há edição pendente; os estudantes ainda veem a versão publicada)</span>}</p>
    <input className={inp} placeholder="Justificativa da mudança de situação (mín. 5 caracteres)" aria-label="Justificativa" value={why} onChange={e => setWhy(e.target.value)} />
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={conf} onChange={e => setConf(e.target.checked)} /> Conferi o conteúdo (necessário para publicar direto do rascunho)</label>
    {item.kind === 'question' && item.validation === 'validada' && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={keep} onChange={e => setKeep(e.target.checked)} /> Manter a validação ao publicar (por padrão, publicar uma edição reabre a validação)</label>}
    <div className="flex flex-wrap gap-2">
      {item.draft?.state === 'rascunho' && <button className="btn-s" disabled={!w || act.busy} onClick={() => go('em-revisao', 'Encaminhado para revisão.')}>Encaminhar para revisão</button>}
      {item.draft?.state === 'em-revisao' && <button className="btn-s" disabled={!w || act.busy} onClick={() => go('rascunho', 'Voltou a rascunho.')}>Voltar a rascunho</button>}
      {item.draft && canPublish && <button className="btn-p" disabled={!w || act.busy || (item.draft.state === 'rascunho' && !conf)} onClick={() => go('publicada', 'Publicado. Os usuários recebem na próxima atualização do catálogo.')}>Publicar</button>}
      {!item.draft && item.pub === 'publicada' && <button className="btn-s" disabled={!w || act.busy} onClick={() => go('arquivada', 'Arquivado: sai das atividades novas; o histórico é preservado.')}>Arquivar</button>}
      {!item.draft && item.pub === 'arquivada' && !item.supersededBy && <button className="btn-s" disabled={!w || act.busy} onClick={() => go('publicada', 'Reativado.')}>Reativar</button>}
    </div>
    {!canPublish && <p className="text-xs text-rose-700 dark:text-rose-300">Questão com erro confirmado (“Precisa de correção”): não pode ser publicada até a correção ser registrada.</p>}
    <ConflictBox conflict={act.conflict} onLoad={it => { onItem(it); act.clear() }} /><Feedback busy={act.busy} ok={act.ok} errs={act.errs} /></div>
}
