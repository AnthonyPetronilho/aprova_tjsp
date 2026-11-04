import { useSyncExternalStore } from 'react'
// Conta + sincronização opcional. O app continua funcionando 100% offline/local; com servidor configurado
// (VITE_API_URL) e login, o progresso e o conteúdo são copiados para o servidor (último a salvar vence, com aviso de conflito).
export type Kind = 'progress' | 'content'
export interface Adapter { get: () => object; set: (d: unknown) => boolean; isEmpty: () => boolean }
export interface SyncState { enabled: boolean; email?: string; status: 'local' | 'idle' | 'syncing' | 'error' | 'conflict'; msg?: string; lastAt?: string; conflict?: Kind[] }
const API = ((import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? '').replace(/\/$/, '')
const KEY = 'aprova-tjsp:sync:v1'
interface Saved { token?: string; email?: string; versions: Record<Kind, number> }
let saved: Saved = { versions: { progress: 0, content: 0 } }
try { const r = localStorage.getItem(KEY); if (r) saved = { ...saved, ...JSON.parse(r) } } catch { /* ignora */ }
let st: SyncState = { enabled: !!API, email: saved.token ? saved.email : undefined, status: 'local' }
if (saved.token) st.status = 'idle'
let adapters: Partial<Record<Kind, Adapter>> = {}
const subs = new Set<() => void>(); let ver = 0
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)) } catch { /* ignora */ } }
const set = (p: Partial<SyncState>) => { st = { ...st, ...p }; ver++; subs.forEach(f => f()) }
export const useSyncState = () => { useSyncExternalStore(f => { subs.add(f); return () => { subs.delete(f) } }, () => ver); return st }
export const setAdapters = (a: Partial<Record<Kind, Adapter>>) => { adapters = a }

class ApiError extends Error { constructor(public status: number, m: string, public body?: { version?: number; data?: unknown }) { super(m) } }
async function req(method: string, path: string, body?: unknown, auth = true) {
  let r: Response
  try { r = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(auth && saved.token ? { Authorization: `Bearer ${saved.token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) }) }
  catch { throw new ApiError(0, 'Sem conexão com o servidor.') }
  const t = await r.text(); let j: { error?: string } & Record<string, unknown> = {}
  try { j = t ? JSON.parse(t) : {} } catch { /* resposta não-JSON */ }
  if (!r.ok) { if (r.status === 401 && auth) { saved = { versions: { progress: 0, content: 0 } }; persist(); set({ email: undefined, status: 'local', msg: 'Sessão expirada. Entre novamente.' }) } throw new ApiError(r.status, j.error ?? `Erro ${r.status}`, j as never) }
  return j
}
const KINDS: Kind[] = ['progress', 'content']
async function push(k: Kind) {
  const a = adapters[k]; if (!a) return
  try { const r = await req('PUT', `/api/data/${k}`, { baseVersion: saved.versions[k], data: a.get() }) as { version: number }; saved.versions[k] = r.version; persist() }
  catch (e) { if (e instanceof ApiError && e.status === 409) { saved.versions[k] = (e.body?.version as number) ?? saved.versions[k]; persist(); throw Object.assign(e, { conflict: true }) } throw e }
}
// Compara com o servidor depois do login: servidor vazio → envia; local vazio → adota o do servidor; os dois com dados → pergunta.
async function reconcile() {
  const conflicts: Kind[] = []
  for (const k of KINDS) {
    const a = adapters[k]; if (!a) continue
    const r = await req('GET', `/api/data/${k}`) as { version: number; data: unknown }
    saved.versions[k] = r.version; persist()
    if (r.version === 0 || !r.data) await push(k)
    else if (a.isEmpty()) a.set(r.data)
    else conflicts.push(k)
  }
  if (conflicts.length) set({ status: 'conflict', conflict: conflicts, msg: 'Há dados neste navegador e no servidor. Escolha qual manter.' })
  else set({ status: 'idle', conflict: undefined, msg: undefined, lastAt: new Date().toISOString() })
}
async function guarded(fn: () => Promise<void>) {
  set({ status: 'syncing', msg: undefined })
  try { await fn() } catch (e) {
    if (e instanceof Error && (e as { conflict?: boolean }).conflict) set({ status: 'conflict', conflict: [...(st.conflict ?? []), ...KINDS].filter((x, i, arr) => arr.indexOf(x) === i), msg: 'Outro dispositivo salvou antes. Escolha qual versão manter.' })
    else set({ status: 'error', msg: e instanceof Error ? e.message : 'Falha ao sincronizar.' })
  }
}
export async function authenticate(mode: 'login' | 'register', email: string, password: string) {
  if (!API) return
  set({ status: 'syncing', msg: undefined })
  try {
    const r = await req('POST', `/api/auth/${mode}`, { email, password }, false) as { token: string; user: { email: string } }
    saved = { token: r.token, email: r.user.email, versions: { progress: 0, content: 0 } }; persist(); set({ email: r.user.email })
    await guarded(reconcile)
  } catch (e) { set({ status: saved.token ? 'idle' : 'local', msg: e instanceof Error ? e.message : 'Falha ao entrar.' }) }
}
export function logout() { saved = { versions: { progress: 0, content: 0 } }; persist(); set({ email: undefined, status: 'local', msg: undefined, conflict: undefined }) }
export async function deleteAccount() { try { await req('DELETE', '/api/me'); logout(); set({ msg: 'Conta e dados do servidor apagados. Os dados deste navegador foram mantidos.' }) } catch (e) { set({ status: 'error', msg: e instanceof Error ? e.message : 'Falha ao apagar a conta.' }) } }
export async function resolveConflict(choice: 'server' | 'local') {
  await guarded(async () => {
    for (const k of st.conflict ?? []) {
      const a = adapters[k]; if (!a) continue
      if (choice === 'server') { const r = await req('GET', `/api/data/${k}`) as { version: number; data: unknown }; if (r.data && !a.set(r.data)) throw new Error('Dados do servidor inválidos.'); saved.versions[k] = r.version; persist() }
      else { const r = await req('GET', `/api/data/${k}`) as { version: number }; saved.versions[k] = r.version; persist(); await push(k) }
    }
    set({ status: 'idle', conflict: undefined, msg: undefined, lastAt: new Date().toISOString() })
  })
}
let timers: Partial<Record<Kind, ReturnType<typeof setTimeout>>> = {}
// chamado quando os dados locais mudam; agrupa as alterações (3 s) antes de enviar
export function scheduleSync(k: Kind) {
  if (!saved.token || st.status === 'conflict') return
  clearTimeout(timers[k]); timers[k] = setTimeout(() => { guarded(async () => { await push(k); set({ status: 'idle', msg: undefined, lastAt: new Date().toISOString() }) }) }, 3000)
}
export const syncNow = () => guarded(async () => { await reconcile() })
export const isLoggedIn = () => !!saved.token
