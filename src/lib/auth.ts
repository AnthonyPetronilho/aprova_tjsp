import { useEffect, useState } from 'react'
import { sync, useSyncState, type AuthResult } from './sync'
import { createSession, type LocalData } from './session'
import { mergeProgress } from './events'
import { normalize } from './useProgress'
import { clearContentLocal, contentForSync, mergeRemoteContent } from './content'
import type { Store } from './useProgress'
import type { Gate } from './route'
import { navigate } from './route'

// Cola entre a tela (React), a sincronização e a troca de conta. Não há segunda lógica de autenticação:
// login/cadastro/sessão continuam em lib/sync.ts; aqui só se decide o que acontece com os dados locais.
let local: LocalData | null = null
const session = createSession(() => local)

export function bindLocalData(s: Pick<Store, 'getState' | 'mergeRemote' | 'clearLocal'>) {
  local = {
    progress: { get: () => s.getState(), clear: () => s.clearLocal(), mergeIn: raw => s.mergeRemote(raw), combine: (a, b) => { try { return mergeProgress(normalize(a), normalize(b)) } catch { return b } } },
    content: { get: contentForSync, clear: clearContentLocal, mergeIn: mergeRemoteContent },
  }
}

// Aviso de uma tela para a próxima (ex.: "Você saiu da conta" na página inicial, "Conta criada" no dashboard).
let flash: { where: 'welcome' | 'shell'; text: string } | null = null
export const setFlash = (where: 'welcome' | 'shell', text: string) => { flash = { where, text } }
export const peekFlash = (where: 'welcome' | 'shell') => (flash?.where === where ? flash.text : '')
export const clearFlash = () => { flash = null }

export const signIn = (mode: 'login' | 'register', email: string, password: string): Promise<AuthResult> =>
  sync.authenticate(mode, email, password, e => { session.adopt(e) })

// Sair: envia o que estiver pendente (até 5 s), guarda a cópia local da conta, encerra a sessão e esvazia o estado local.
// Nada é apagado do servidor nem dos backups. Sem conexão, as alterações não enviadas ficam na cópia local da conta.
export async function signOut(): Promise<{ synced: boolean; kept: boolean }> {
  const email = sync.getState().email ?? ''
  let synced = false
  try {
    synced = await Promise.race([sync.syncNow().then(() => sync.getState().status === 'idle'), new Promise<boolean>(r => setTimeout(() => r(false), 5000))])
  } catch { synced = false }
  const r = session.leave(email, synced)
  sync.logout()
  setFlash('welcome', synced || r === 'cleared' ? 'Você saiu da conta. Seu progresso continua salvo.' : 'Você saiu da conta.')
  navigate('/', true)
  return { synced, kept: r === 'kept' }
}

export async function removeAccount(password: string) {
  const email = sync.getState().email ?? ''
  await sync.deleteAccount(password)
  if (!sync.isLoggedIn()) { session.leave(email, true); navigate('/', true) } // a conta saiu do servidor; a cópia local fica guardada neste navegador
}

// Outra aba saiu ou entrou: acompanha, para que dados de uma conta não fiquem na memória desta aba depois do logout.
const SYNC_KEY = 'aprova-tjsp:sync:v1'
export function initSession(): () => void {
  const st = sync.getState()
  if (sync.isLoggedIn() && st.email && !session.owner()) session.setOwner(st.email) // quem já estava conectado antes desta versão
  const h = (e: StorageEvent) => {
    if (e.key !== SYNC_KEY) return
    const before = sync.getState().email ?? '', was = sync.isLoggedIn()
    sync.reload()
    if (was && !sync.isLoggedIn()) { session.leave(before, true); navigate('/', true) }
  }
  window.addEventListener('storage', h); return () => window.removeEventListener('storage', h)
}

// 'checking' enquanto confirma o token guardado; só 401 derruba a sessão (falha de rede mantém o usuário dentro).
export function useAuthGate(): Gate {
  const sy = useSyncState()
  const [verified, setVerified] = useState(() => !sync.isLoggedIn())
  useEffect(() => {
    if (verified) return
    let live = true; void sync.verifySession().finally(() => { if (live) setVerified(true) })
    return () => { live = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return !verified ? 'checking' : sy.email ? 'in' : 'out'
}
