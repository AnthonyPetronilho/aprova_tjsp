// Quem é o dono dos dados guardados neste navegador, e o que fazer ao trocar de conta.
// Regras: (1) os dados de uma conta NUNCA aparecem para outra; (2) nada é apagado do servidor; (3) ao sair, uma cópia completa
// dos dados locais fica guardada para a mesma conta (protege alterações ainda não enviadas) e volta a ser somada quando ela entrar de novo.
export interface Part { get: () => unknown; clear: () => void; mergeIn: (raw: unknown) => unknown; combine?: (a: unknown, b: unknown) => unknown }
export interface LocalData { progress: Part; content: Part }
export const OWNER_KEY = 'aprova-tjsp:owner', ACCT_PREFIX = 'aprova-tjsp:acct:'
export const normEmail = (e: string) => e.trim().toLowerCase()
type St = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function createSession(data: () => LocalData | null, storage: St | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined) {
  const owner = (): string => { try { return storage?.getItem(OWNER_KEY) ?? '' } catch { return '' } }
  const setOwner = (e: string) => { try { if (e) storage?.setItem(OWNER_KEY, normEmail(e)); else storage?.removeItem(OWNER_KEY) } catch { /* ignora */ } }
  const key = (e: string) => ACCT_PREFIX + normEmail(e)
  const readSnap = (e: string): { progress?: unknown; content?: unknown } | null => { try { const r = storage?.getItem(key(e)); return r ? JSON.parse(r) : null } catch { return null } }
  // Guarda os dados locais da conta (somados à cópia anterior, se houver). Devolve false se não coube no armazenamento.
  function snapshot(email: string): boolean {
    const d = data(); if (!d) return true
    try {
      const old = readSnap(email), cur = d.progress.get()
      const progress = old?.progress && d.progress.combine ? d.progress.combine(old.progress, cur) : cur
      storage?.setItem(key(email), JSON.stringify({ at: new Date().toISOString(), progress, content: d.content.get() })); return true
    } catch { return false }
  }
  function restore(email: string) { const d = data(), s = readSnap(email); if (!d || !s) return; if (s.progress) d.progress.mergeIn(s.progress); if (s.content) d.content.mergeIn(s.content) }
  return {
    owner, setOwner, snapshot, restore, hasSnapshot: (e: string) => !!readSnap(e),
    // Logo após o servidor aceitar o login, antes de sincronizar:
    //  • mesma conta → segue (soma dados locais e do servidor);
    //  • primeira conta neste navegador (sem dono) → adota os dados locais já existentes (migração de quem usava sem conta);
    //  • outra conta → guarda os dados da anterior, esvazia o estado local e restaura a cópia desta conta, se houver.
    adopt(email: string): 'same' | 'adopted' | 'switched' {
      const prev = owner(), now = normEmail(email), d = data()
      const r: 'same' | 'adopted' | 'switched' = prev === now ? 'same' : prev ? 'switched' : 'adopted'
      if (prev && prev !== now) { snapshot(prev); d?.progress.clear(); d?.content.clear() }
      if (prev !== now) restore(now)
      setOwner(now); return r
    },
    // Ao sair: guarda a cópia e esvazia o estado local. Se a cópia não couber e o servidor não tem tudo (synced=false), mantém o estado local
    // (nada se perde; fica visível só na próxima entrada da mesma conta) e devolve 'kept'.
    leave(email: string, synced: boolean): 'cleared' | 'kept' {
      const who = email ? normEmail(email) : owner(), d = data()
      if (who && !snapshot(who) && !synced) return 'kept'
      d?.progress.clear(); d?.content.clear(); setOwner(''); return 'cleared'
    },
  }
}
