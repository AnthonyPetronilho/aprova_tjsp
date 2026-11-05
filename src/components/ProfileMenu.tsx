import { useEffect, useRef, useState } from 'react'
import { useSyncState } from '../lib/sync'
import { signOut } from '../lib/auth'
// Menu de perfil: avatar com a inicial do e-mail → conta, estado da sincronização, Configurações e "Sair da conta".
// Teclado: Enter/Espaço/↓ abrem; ↑/↓/Home/End navegam; Esc fecha e devolve o foco; Tab fecha. Clique/toque fora fecha.
const STATUS: Record<string, string> = { idle: '✅ Sincronizado', syncing: '🔄 Sincronizando…', offline: '📴 Sem conexão — dados salvos neste aparelho', error: '⚠️ Erro ao sincronizar', local: '' }
export default function ProfileMenu({ onSettings, placement, showName }: { onSettings: () => void; placement: 'up' | 'down'; showName?: boolean }) {
  const sy = useSyncState(), [open, setOpen] = useState(false), [leaving, setLeaving] = useState(false)
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), list = useRef<HTMLDivElement>(null)
  const items = () => Array.from(list.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [])
  const close = (refocus = true) => { setOpen(false); if (refocus) trigger.current?.focus() }
  useEffect(() => {
    if (!open) return
    items()[0]?.focus()
    const out = (e: Event) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', out); document.addEventListener('touchstart', out)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('touchstart', out) }
  }, [open])
  if (!sy.enabled || !sy.email) return null
  const email = sy.email, initial = email.trim().charAt(0).toUpperCase() || '?'
  const onKey = (e: React.KeyboardEvent) => {
    const it = items(), i = it.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); it[(i + 1) % it.length]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); it[(i - 1 + it.length) % it.length]?.focus() }
    else if (e.key === 'Home') { e.preventDefault(); it[0]?.focus() }
    else if (e.key === 'End') { e.preventDefault(); it[it.length - 1]?.focus() }
    else if (e.key === 'Tab') setOpen(false)
  }
  const out = async () => { setLeaving(true); try { await signOut() } finally { setLeaving(false); setOpen(false) } }
  return <div ref={root} className="relative" onKeyDown={open ? onKey : undefined}>
    <button ref={trigger} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls="profile-menu" aria-label={`Menu da conta: ${email}`} onClick={() => setOpen(o => !o)}
      onKeyDown={e => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true) } }}
      className={`flex items-center gap-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 ${showName ? 'w-full px-2 py-2 text-left' : 'p-1'}`}>
      <span aria-hidden="true" className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-indigo-600 text-white font-bold">{initial}</span>
      {showName && <span className="min-w-0 flex-1 truncate text-sm">{email}</span>}
    </button>
    {open && <div className={`absolute z-[60] w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-2 ${placement === 'up' ? 'bottom-full mb-2 left-0' : 'top-full mt-2 right-0'}`}>
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 mb-1"><p className="text-xs text-slate-600 dark:text-slate-400">Conectado como</p><p className="text-sm font-semibold break-all">{email}</p>{STATUS[sy.status] && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1" role="status">{STATUS[sy.status]}</p>}</div>
      <div id="profile-menu" ref={list} role="menu" aria-label="Conta">
        <button role="menuitem" type="button" onClick={() => { setOpen(false); onSettings() }} className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">⚙️ Configurações</button>
        <button role="menuitem" type="button" disabled={leaving} onClick={out} className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50">{leaving ? 'Saindo…' : '🚪 Sair da conta'}</button>
      </div>
    </div>}
  </div>
}
