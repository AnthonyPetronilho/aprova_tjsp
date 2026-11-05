import { useRef, useState } from 'react'
import type { XpSettings } from '../types'
import { useContent, setEditor } from '../lib/content'
import { useSyncState, authenticate, logout, deleteAccount, syncNow } from '../lib/sync'
import { listBackups, readBackup } from '../lib/backup'
import type { Store } from '../lib/useProgress'
const FIELDS: [keyof XpSettings, string][] = [['lesson', 'Concluir uma aula'], ['question', 'Acertar uma questão (1ª vez que acerta)'], ['review', 'Concluir uma revisão (1x por dia)'], ['dailyMission', 'Completar as missões do dia'], ['mock', 'Finalizar um simulado (1x por dia)']]
function Backups() {
  const [list] = useState(listBackups)
  if (!list.length) return null
  const dl = (key: string) => { const j = readBackup(key); if (!j) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([j], { type: 'application/json' })); a.download = `aprova-tjsp-${key.split(':').slice(2).join('-').replace(/[^\w.-]/g, '_')}.json`; a.click(); URL.revokeObjectURL(a.href) }
  return <details className="text-sm"><summary className="cursor-pointer">Cópias automáticas neste navegador ({list.length})</summary><ul className="mt-2 space-y-1">{list.map(b => <li key={b.key} className="flex items-center justify-between gap-2"><span>{b.label.replace(/-/g, ' ')} · {new Date(b.at).toLocaleString('pt-BR')} · {Math.round(b.bytes / 1024)} KB</span><button className="btn-s !py-1 text-xs" onClick={() => dl(b.key)}>Baixar</button></li>)}</ul><p className="text-xs text-slate-500 mt-1">Para voltar a uma cópia, baixe e use “Restaurar backup”.</p></details>
}
export default function Settings({ s }: { s: Store }) {
  const content = useContent(), sy = useSyncState(), [em, setEm] = useState(''), [pw, setPw] = useState(''), [delc, setDelc] = useState(false), [delPw, setDelPw] = useState('')
  const { p, setXp, resetXp, replaceAll, reset } = s, [msg, setMsg] = useState(''), [confirm, setConfirm] = useState(false), file = useRef<HTMLInputElement>(null)
  const exportData = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' })); a.download = `aprova-tjsp-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href); setMsg('Backup baixado.') }
  const importData = async (f?: File) => { if (!f) return; try { setMsg(replaceAll(JSON.parse(await f.text())) ? 'Backup somado ao seu progresso atual (nada do que você já tinha foi apagado).' : 'Arquivo inválido: não parece um backup do Aprova TJSP.') } catch { setMsg('Não foi possível ler o arquivo.') } if (file.current) file.current.value = '' }
  return <div className="space-y-4 max-w-2xl"><h1 className="text-2xl font-bold">⚙️ Configurações</h1>
    <div className="card space-y-3"><h2 className="font-bold">Valores de XP</h2><p className="text-sm text-slate-500">Valem para ganhos futuros; o XP já acumulado não muda. Os níveis têm limites fixos.</p>
      {FIELDS.map(([k, l]) => <label key={k} className="flex items-center justify-between gap-3 text-sm"><span>{l}</span><input type="number" min={0} max={1000} value={p.settings.xp[k]} onChange={e => setXp(k, Number(e.target.value))} className="w-24 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1 text-right" /></label>)}
      <button className="btn-s" onClick={resetXp}>Restaurar valores padrão</button></div>
    <div className="card space-y-3"><h2 className="font-bold">Backup do progresso</h2><p className="text-sm text-slate-500">Sem conta, seu progresso fica salvo só neste navegador: baixe um backup de vez em quando. Restaurar um arquivo <b>soma</b> o conteúdo dele ao progresso atual.</p>
      <div className="flex flex-wrap gap-2"><button className="btn-p" onClick={exportData}>⬇️ Baixar backup</button><button className="btn-s" onClick={() => file.current?.click()}>⬆️ Restaurar backup</button><input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={e => importData(e.target.files?.[0])} /></div>
      {msg && <p className="text-sm" role="status">{msg}</p>}
      <Backups /></div>
    <div className="card space-y-3"><h2 className="font-bold">👤 Conta e sincronização</h2>
      {!sy.enabled ? <p className="text-sm text-slate-500">Sem servidor configurado: o app funciona só neste navegador. Para ter conta e sincronizar entre aparelhos, rode a pasta <code>server/</code> e defina <code>VITE_API_URL</code> (veja o README).</p>
      : sy.email ? <>
        <p className="text-sm">Conectado como <b>{sy.email}</b> · {sy.status === 'syncing' ? 'sincronizando…' : sy.status === 'error' ? '⚠️ erro' : sy.status === 'offline' ? '📴 sem conexão' : '✅ sincronizado'}{sy.lastAt && sy.status === 'idle' ? ` (${new Date(sy.lastAt).toLocaleTimeString('pt-BR')})` : ''}</p>
        {sy.msg && <p className="text-sm" role="status">{sy.msg}</p>}
        <p className="text-xs text-slate-500">Os dados de vários aparelhos são combinados automaticamente (nenhuma resposta, revisão ou XP é apagada ou contada duas vezes). Antes de qualquer combinação grande, uma cópia fica guardada neste navegador.</p>
        <div className="flex flex-wrap gap-2"><button className="btn-s" onClick={() => syncNow()}>🔄 Sincronizar agora</button><button className="btn-s" onClick={logout}>Sair</button></div>
        {!delc ? <button className="underline text-sm text-rose-600" onClick={() => setDelc(true)}>Apagar minha conta e os dados do servidor…</button> : <div className="space-y-2 text-sm"><input type="password" autoComplete="current-password" aria-label="Confirme sua senha" placeholder="Confirme sua senha para apagar" value={delPw} onChange={e => setDelPw(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm" /><div className="flex gap-2 items-center"><button className="btn bg-rose-600 text-white" disabled={!delPw} onClick={() => { deleteAccount(delPw); setDelc(false); setDelPw('') }}>Sim, apagar conta</button><button className="btn-s" onClick={() => { setDelc(false); setDelPw('') }}>Cancelar</button></div></div>}</>
      : <form className="space-y-2" onSubmit={e => { e.preventDefault(); authenticate('login', em, pw) }}><p className="text-sm text-slate-500">Entre para guardar seu progresso e conteúdo no servidor. Sem conta, tudo continua salvo só neste navegador.</p>
        <input type="email" autoComplete="email" aria-label="E-mail" placeholder="E-mail" value={em} onChange={e => setEm(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm" />
        <input type="password" autoComplete="current-password" aria-label="Senha" placeholder="Senha (mín. 8 caracteres)" value={pw} onChange={e => setPw(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm" />
        {sy.msg && <p className="text-sm text-rose-600" role="alert">{sy.msg}</p>}
        <div className="flex gap-2"><button className="btn-p" type="submit" disabled={sy.status === 'syncing'}>Entrar</button><button className="btn-s" type="button" disabled={sy.status === 'syncing'} onClick={() => authenticate('register', em, pw)}>Criar conta</button></div></form>}</div>
    <div className="card space-y-2"><h2 className="font-bold">Modo editor (conteúdo)</h2><p className="text-sm text-slate-500">Mostra a área “Admin” no menu para criar aulas, questões, flashcards e vídeos de reforço. É um modo local, sem senha: o conteúdo fica só neste navegador.</p><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={content.editor} onChange={e => setEditor(e.target.checked)} /> Ativar modo editor</label></div>
    <div className="card space-y-3"><h2 className="font-bold">Zerar progresso</h2><p className="text-sm text-slate-500">Apaga XP, aulas, respostas, flashcards, erros e anotações. Não dá para desfazer (faça um backup antes).</p>
      {!confirm ? <button className="btn-s" onClick={() => setConfirm(true)}>Zerar tudo…</button> : <div className="flex gap-2"><button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={() => { reset(); setConfirm(false); setMsg('Progresso zerado.') }}>Sim, apagar tudo</button><button className="btn-s" onClick={() => setConfirm(false)}>Cancelar</button></div>}</div></div>
}
