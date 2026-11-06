import { useMemo, useState } from 'react'
import { DISCIPLINES } from '../data/edital'
import { addDays, todayStr } from '../lib/dates'
import { MATERIALS, MATERIAL_LABEL, entriesOf, filterEntries, fmtMin, minutesByDiscipline, topicTitle } from '../lib/learning'
import type { Store } from '../lib/useProgress'
import type { MaterialKind } from '../types'
const inp = 'rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm w-full'
const PERIODS: [string, string][] = [['all', 'Todo o período'], ['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias'], ['custom', 'Intervalo…']]
const fmtDate = (d: string) => `${d.slice(8)}/${d.slice(5, 7)}/${d.slice(0, 4)}`
interface Form { id?: string; date: string; disc: string; topicId: string; material: MaterialKind; source: string; minutes: string; note: string }
const blank = (): Form => ({ date: todayStr(), disc: '', topicId: '', material: 'videoaula', source: '', minutes: '', note: '' })
export default function Diary({ s, go, focusTopic }: { s: Store; go: (page: string) => void; focusTopic?: string }) {
  const { p, saveStudy, deleteStudy } = s
  const topicOk = !!focusTopic && focusTopic !== 'new' ? focusTopic : undefined
  const [f, setF] = useState<Form | null>(() => (focusTopic ? { ...blank(), ...(topicOk ? { topicId: topicOk, disc: DISCIPLINES.find(d => d.topics.some(x => x.id === topicOk))?.id ?? '' } : {}) } : null)), [err, setErr] = useState(''), [del, setDel] = useState<string | null>(null)
  const [fd, setFd] = useState(''), [per, setPer] = useState('all'), [from, setFrom] = useState(''), [to, setTo] = useState('')
  const all = useMemo(() => entriesOf(p), [p.diary]) // eslint-disable-line react-hooks/exhaustive-deps
  const t = todayStr(), range = per === '7' ? { from: addDays(t, -6) } : per === '30' ? { from: addDays(t, -29) } : per === 'custom' ? { from, to } : {}
  const list = filterEntries(all, { disc: fd || undefined, ...range }), byDisc = minutesByDiscipline(list), total = list.reduce((n, e) => n + e.minutes, 0)
  const open = (e?: (typeof all)[number]) => { setErr(''); setF(e ? { id: e.id, date: e.date, disc: e.discId, topicId: e.topicId, material: e.material, source: e.source, minutes: String(e.minutes), note: e.note ?? '' } : { ...blank(), ...(topicOk ? { topicId: topicOk, disc: DISCIPLINES.find(d => d.topics.some(x => x.id === topicOk))?.id ?? '' } : {}) }) }
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault(); if (!f) return
    const e = saveStudy({ id: f.id, date: f.date, topicId: f.topicId, material: f.material, source: f.source, minutes: Number(f.minutes), note: f.note })
    if (e) { setErr(e); return }
    setF(null)
  }
  const topics = DISCIPLINES.find(d => d.id === f?.disc)?.topics ?? []
  return <div className="space-y-4 max-w-3xl">
    <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">📖 Diário de Estudos</h1><button className="btn-p" onClick={() => open()}>+ Registrar estudo</button></div>
    <p className="text-sm text-slate-500">Registre o que você estudou <b>fora do app</b> (videoaula, apostila, livro…). O tempo informado aqui é <b>manual</b>: aparece separado do tempo ativo medido pelo app e nunca é somado a ele. Depois de estudar, use <button className="underline text-indigo-600" onClick={() => go('validate')}>Validar meu aprendizado</button>.</p>
    {f && <form onSubmit={submit} className="card space-y-3" aria-label={f.id ? 'Editar estudo' : 'Registrar estudo'}>
      <h2 className="font-bold">{f.id ? 'Editar registro' : 'Novo registro'}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm">Data do estudo<input type="date" max={t} className={inp} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></label>
        <label className="text-sm">Tempo dedicado (minutos)<input type="number" min={1} max={960} className={inp} value={f.minutes} onChange={e => setF({ ...f, minutes: e.target.value })} placeholder="Ex.: 45" /></label>
        <label className="text-sm">Disciplina<select className={inp} value={f.disc} onChange={e => setF({ ...f, disc: e.target.value, topicId: '' })}><option value="">Escolha…</option>{DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label className="text-sm">Assunto do edital<select className={inp} value={f.topicId} disabled={!f.disc} onChange={e => setF({ ...f, topicId: e.target.value })}><option value="">Escolha…</option>{topics.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
        <label className="text-sm">Tipo de material<select className={inp} value={f.material} onChange={e => setF({ ...f, material: e.target.value as MaterialKind })}>{MATERIALS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label className="text-sm">Fonte<input className={inp} maxLength={120} value={f.source} onChange={e => setF({ ...f, source: e.target.value })} placeholder="Ex.: Curso X, aula 12" /></label>
      </div>
      <label className="text-sm block">Observações (opcional)<textarea className={inp} rows={2} maxLength={1000} value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></label>
      {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
      <div className="flex gap-2"><button className="btn-p" type="submit">{f.id ? 'Salvar alterações' : 'Salvar registro'}</button><button className="btn-s" type="button" onClick={() => setF(null)}>Cancelar</button></div>
    </form>}
    <div className="card space-y-3"><h2 className="font-bold">Histórico</h2>
      <div className="flex flex-wrap gap-2"><select aria-label="Filtrar por disciplina" className={inp + ' !w-auto'} value={fd} onChange={e => setFd(e.target.value)}><option value="">Todas as disciplinas</option>{DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <select aria-label="Filtrar por período" className={inp + ' !w-auto'} value={per} onChange={e => setPer(e.target.value)}>{PERIODS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        {per === 'custom' && <><input aria-label="De" type="date" className={inp + ' !w-auto'} value={from} onChange={e => setFrom(e.target.value)} /><input aria-label="Até" type="date" className={inp + ' !w-auto'} value={to} onChange={e => setTo(e.target.value)} /></>}</div>
      {byDisc.length > 0 && <div><p className="text-sm font-semibold">Tempo informado por disciplina: {fmtMin(total)} no total</p><ul className="text-sm mt-1 space-y-0.5">{byDisc.map(x => <li key={x.id} className="flex justify-between"><span>{x.name} <span className="text-slate-500">({x.count} registro{x.count > 1 ? 's' : ''})</span></span><b>{fmtMin(x.minutes)}</b></li>)}</ul></div>}
      {list.length ? <ul className="divide-y divide-slate-200 dark:divide-slate-700">{list.map(e => <li key={e.id} className="py-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0"><p className="font-medium">{topicTitle(e.topicId)}</p><p className="text-xs text-slate-500">{fmtDate(e.date)} · {DISCIPLINES.find(d => d.id === e.discId)?.name} · {MATERIAL_LABEL[e.material]} · {e.source} · {fmtMin(e.minutes)} <span title="Tempo informado por você">(manual)</span></p>{e.note && <p className="text-sm mt-1 whitespace-pre-wrap">{e.note}</p>}</div>
        <div className="flex gap-2 shrink-0">{del === e.id ? <><button className="btn bg-rose-600 text-white" onClick={() => { deleteStudy(e.id); setDel(null) }}>Confirmar exclusão</button><button className="btn-s" onClick={() => setDel(null)}>Manter</button></> : <><button className="btn-s" onClick={() => open(e)}>Editar</button><button className="btn-s" onClick={() => setDel(e.id)}>Excluir</button></>}</div></li>)}</ul>
        : <p className="text-sm text-slate-500">{all.length ? 'Nenhum registro com esses filtros.' : 'Você ainda não registrou nenhum estudo. Use “Registrar estudo” depois de estudar com seu material.'}</p>}
    </div></div>
}
