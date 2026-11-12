import { useEffect, useMemo, useState } from 'react'
import { AUDIT, type AuditMethod } from '../../data/audit'
import { DOC_AUDIT_BY_ID } from '../../data/audit-docs'
import { REVISIONS } from '../../data/revisions'
import { VALIDATION } from '../../lib/learning'
import { adm, type HistEntry } from './api'
import { HumanBadge, PubBadge, ValBadge, fmt, inp, srcLabel, topicTitle, useAdminData } from './common'
import type { Validation } from '../../types'
const METHOD: Record<AuditMethod, string> = { 'revisao-ia-textual': 'Revisão textual por IA (não humana)', 'conferencia-normativa': 'Conferência documental por IA (não humana)', 'calculo-automatizado': 'Verificação automatizada (ferramenta)', 'validacao-humana': 'Revisão humana' }
// Evidências da auditoria embutida (Fases 4/4B/4C) de uma questão. Nada aqui é revisão humana.
export function Evidence({ id }: { id: string }) {
  const a = AUDIT[id], d = DOC_AUDIT_BY_ID[id], revs = REVISIONS.filter(r => r.id === id)
  if (!a) return <p className="text-sm text-slate-500">Sem registro de auditoria embutida (questão criada no Admin).</p>
  return <div className="space-y-2 text-sm"><h3 className="font-semibold">Auditoria embutida (Fase 4C)</h3>
    <p>Situação na auditoria: <ValBadge v={a.proposed} /> <span className="text-slate-500">(antes: {VALIDATION[a.previous].label})</span> · risco {a.risk}</p>
    <p><b>Método:</b> {a.methods.map(m => METHOD[m]).join(' + ')} — <i>nenhuma revisão humana registrada na auditoria embutida</i></p>
    {d ? <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1"><dt className="font-semibold">Fonte</dt><dd>{d.source}</dd><dt className="font-semibold">Dispositivo</dt><dd>{d.provision}</dd><dt className="font-semibold">Página</dt><dd>{d.pages}</dd><dt className="font-semibold">Data</dt><dd>{d.date ?? '2026-11-06 (conferência da Fase 4B)'}</dd><dt className="font-semibold">Resultado</dt><dd>{d.result}</dd>{d.excerpt && <><dt className="font-semibold">Trecho</dt><dd className="italic">{d.excerpt}</dd></>}{d.note && <><dt className="font-semibold">Observações</dt><dd>{d.note}</dd></>}</dl> : <p><b>Referência:</b> {a.reference}</p>}
    {(a.issues.length > 0 || a.pendencies.length > 0 || d?.pendencies?.length) && <div><p className="font-semibold">Riscos e pendências conhecidos</p><ul className="list-disc ml-5">{[...a.issues, ...a.pendencies, ...(d?.pendencies ?? [])].map(x => <li key={x}>{x}</li>)}</ul></div>}
    <p className="text-xs text-slate-500">{a.verification}</p>
    {revs.length > 0 && <div><p className="font-semibold">Revisões embutidas (Fase 4)</p><ul className="list-disc ml-5">{revs.map(r => <li key={r.version}>v{r.version} ({r.date}) — {r.kind}: {r.summary}</li>)}</ul></div>}</div>
}
export default function AuditTab({ onOpen }: { onOpen: (id: string) => void }) {
  const { byId } = useAdminData(), [f, setF] = useState<'pendente' | Validation | 'todas'>('pendente'), [disc, setDisc] = useState('all'), [recent, setRecent] = useState<HistEntry[] | null>(null)
  useEffect(() => { let on = true; adm.recent().then(r => { if (on) setRecent(r.history) }).catch(() => { if (on) setRecent([]) }); return () => { on = false } }, [])
  const rows = useMemo(() => Object.values(AUDIT).filter(a => (f === 'todas' || (byId.get(`question:${a.id}`)?.validation ?? a.proposed) === f) && (disc === 'all' || a.discipline === disc)).sort((x, y) => (x.discipline + x.id < y.discipline + y.id ? -1 : 1)), [byId, f, disc])
  const discs = useMemo(() => [...new Set(Object.values(AUDIT).map(a => a.discipline))].sort(), [])
  const count = (v: Validation) => Object.values(AUDIT).filter(a => (byId.get(`question:${a.id}`)?.validation ?? a.proposed) === v).length
  return <div className="space-y-3">
    <div className="card space-y-2"><h2 className="font-bold">Pendências da auditoria</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">Situação atual de cada questão (auditoria da Fase 4C, ajustada pelas revisões registradas aqui). As validações por IA/ferramenta <b>não</b> são revisão humana: {count('validada')} validadas · {count('pendente')} pendentes · {count('precisa-correcao')} precisam de correção · {count('precisa-complementacao')} precisam de complementação.</p>
      <div className="flex flex-wrap gap-2"><select className={inp + ' !w-auto'} aria-label="Situação" value={f} onChange={e => setF(e.target.value as typeof f)}><option value="pendente">Pendentes</option><option value="precisa-correcao">Precisa de correção</option><option value="precisa-complementacao">Precisa de complementação</option><option value="validada">Validadas</option><option value="todas">Todas</option></select>
        <select className={inp + ' !w-auto'} aria-label="Disciplina" value={disc} onChange={e => setDisc(e.target.value)}><option value="all">Todas as disciplinas</option>{discs.map(d => <option key={d}>{d}</option>)}</select><span className="text-sm self-center">{rows.length} questões</span></div></div>
    <ul className="space-y-2">{rows.slice(0, 120).map(a => { const it = byId.get(`question:${a.id}`); return <li key={a.id}><button className="card w-full text-left !p-3 hover:border-indigo-400" onClick={() => onOpen(a.id)}><div className="flex flex-wrap gap-1.5 items-center"><code className="text-xs">{a.id}</code><ValBadge v={(it?.validation ?? a.proposed) as Validation} />{it && <PubBadge p={it.estado} />}<HumanBadge src={it?.validationSource ?? null} /><span className="text-xs text-slate-500">{a.discipline} · {topicTitle(a.topicId)}</span></div>{[...a.pendencies, ...a.issues][0] && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{[...a.pendencies, ...a.issues][0]}</p>}</button></li> })}</ul>
    {rows.length > 120 && <p className="text-xs text-slate-500">Mostrando 120 de {rows.length}; use os filtros.</p>}
    <div className="card space-y-2"><h3 className="font-semibold">Alterações recentes (todo o catálogo)</h3>{!recent ? <p className="text-sm text-slate-500">Carregando…</p> : !recent.length ? <p className="text-sm text-slate-500">Nenhuma alteração administrativa registrada ainda.</p> : <ul className="text-sm space-y-1">{recent.slice(0, 30).map(h => <li key={`${h.kind}${h.id}${h.rev}`}><code className="text-xs">{h.id}</code> v{h.rev} · {h.type} · {fmt(h.at)} · {h.by} — “{h.reason}”</li>)}</ul>}</div>
    <p className="text-xs text-slate-500">Legenda das fontes de validação: {srcLabel('auditoria-ia')}; {srcLabel('revisao-humana-administrador')}; {srcLabel('revisao-profissional-declarada')}.</p></div>
}
