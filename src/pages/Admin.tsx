import { useEffect, useState } from 'react'
import { adm, type Overview } from './admin/api'
import { AdminData, PubBadge, fmt, useAdminData } from './admin/common'
import QuestionsTab from './admin/QuestionsTab'
import AuditTab from './admin/AuditTab'
import { LessonsTab, CardsTab } from './admin/ContentTabs'
import AdminLegacy from './AdminLegacy'
import { VALIDATION } from '../lib/learning'
import type { Validation } from '../types'
// Fase 5 — painel administrativo. O acesso é decidido pelo servidor (a rota /api/admin/* confere o e-mail autenticado);
// esta tela só é exibida quando /api/me diz admin, e qualquer chamada sem permissão é recusada pelo servidor de qualquer forma.
type Tab = 'geral' | 'questoes' | 'aulas' | 'cards' | 'auditoria' | 'legado'
const TABS: [Tab, string][] = [['geral', 'Visão geral'], ['questoes', 'Questões'], ['aulas', 'Aulas'], ['cards', 'Flashcards'], ['auditoria', 'Auditoria'], ['legado', 'Conteúdo local (legado)']]
function Overview_({ go }: { go: (t: Tab, id?: string) => void }) {
  const { items } = useAdminData(), [ov, setOv] = useState<Overview | null>(null), [err, setErr] = useState('')
  useEffect(() => { let on = true; adm.overview().then(o => { if (on) setOv(o) }).catch(e => { if (on) setErr(e instanceof Error ? e.message : 'Falha') }); return () => { on = false } }, [items])
  if (err) return <p className="text-rose-600 text-sm" role="alert">{err}</p>
  if (!ov) return <p className="text-sm text-slate-500" role="status">Carregando visão geral…</p>
  const V = (['validada', 'pendente', 'precisa-correcao', 'precisa-complementacao'] as Validation[]).map(v => [v, ov.validation[v] ?? 0] as const)
  const P = ov.publication.question ?? {}
  const Stat = ({ n, t, cls = '' }: { n: number; t: string; cls?: string }) => <div className={`rounded-xl border border-slate-200 dark:border-slate-700 p-3 ${cls}`}><div className="text-2xl font-extrabold">{n}</div><div className="text-xs text-slate-600 dark:text-slate-300">{t}</div></div>
  return <div className="space-y-3">
    <div className="card space-y-3"><h2 className="font-bold">Questões</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-2"><Stat n={ov.totals.question} t="no catálogo" />{V.map(([v, n]) => <Stat key={v} n={n} t={VALIDATION[v].label} />)}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2"><Stat n={P.publicada ?? 0} t="publicadas" /><Stat n={P.rascunho ?? 0} t="em rascunho" /><Stat n={P['em-revisao'] ?? 0} t="em revisão" /><Stat n={P.arquivada ?? 0} t="arquivadas" /></div>
      <p className="text-sm text-slate-600 dark:text-slate-300">Revisões humanas registradas no Admin: <b>{ov.humanReviewed}</b>. As “Validadas” vindas da auditoria foram conferidas por IA/ferramentas — <b>não</b> por revisão humana independente. Revisão do catálogo publicado: {ov.catalogRev}.</p>
      <div className="flex gap-2 flex-wrap"><button className="btn-p" onClick={() => go('auditoria')}>Ver as {ov.validation.pendente ?? 0} pendentes</button><button className="btn-s" onClick={() => go('questoes')}>Gerenciar questões</button></div></div>
    <div className="card space-y-2"><h2 className="font-bold">Aulas e flashcards</h2><p className="text-sm">{ov.totals.lesson} aulas ({Object.entries(ov.publication.lesson ?? {}).map(([k, n]) => `${n} ${k}`).join(', ')}) · {ov.totals.card} flashcards ({Object.entries(ov.publication.card ?? {}).map(([k, n]) => `${n} ${k}`).join(', ')})</p></div>
    <div className="card space-y-2"><h2 className="font-bold">Últimas alterações</h2>{!ov.recent.length ? <p className="text-sm text-slate-500">Ainda não há alterações administrativas.</p> : <ul className="text-sm space-y-1">{ov.recent.map(h => <li key={`${h.kind}${h.id}${h.rev}`}><button className="underline" onClick={() => go(h.kind === 'question' ? 'questoes' : h.kind === 'lesson' ? 'aulas' : 'cards', h.id)}><code>{h.id}</code></button> v{h.rev} · {h.type} · <PubBadge p={h.after.pub} /> · {fmt(h.at)} — “{h.reason}”</li>)}</ul>}</div></div>
}
export default function Admin() {
  const [tab, setTab] = useState<Tab>('geral'), [focus, setFocus] = useState<string | null>(null)
  const go = (t: Tab, id?: string) => { setTab(t); setFocus(id ?? null) }
  return <AdminData><div className="space-y-4 max-w-4xl"><div><h1 className="text-2xl font-bold">🛠️ Administração do conteúdo</h1><p className="text-sm text-slate-500">As alterações ficam no servidor (MongoDB) e só chegam aos estudantes quando publicadas. Rascunhos e revisões não aparecem para ninguém além de administradores.</p></div>
    <div className="flex flex-wrap gap-1 text-sm" role="tablist">{TABS.map(([k, n]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => go(k)} className={`rounded-xl px-3 py-2 ${tab === k ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{n}</button>)}</div>
    {tab === 'geral' && <Overview_ go={go} />}{tab === 'questoes' && <QuestionsTab focusId={focus} onFocus={setFocus} />}{tab === 'aulas' && <LessonsTab />}{tab === 'cards' && <CardsTab />}{tab === 'auditoria' && <AuditTab onOpen={id => go('questoes', id)} />}{tab === 'legado' && <div className="space-y-2"><p className="text-sm rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3">Conteúdo criado antes da Fase 5, guardado só neste navegador/conta. Não é o catálogo central: não chega a outros usuários. Mantido para não perder o que já existe.</p><AdminLegacy /></div>}</div></AdminData>
}
