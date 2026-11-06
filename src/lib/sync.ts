import { useSyncExternalStore } from 'react'
// Conta + sincronização opcional. O app funciona 100% local; com servidor (VITE_API_URL) e login, o progresso e o conteúdo
// são copiados para o servidor. Conflitos NÃO pedem escolha ao usuário: o cliente baixa a versão do servidor, MESCLA com a local
// (união de eventos com ids únicos; veja lib/events.ts) e reenvia. A mesclagem é idempotente, então repetir não duplica nada.
export type Kind = 'progress' | 'content'
export interface Adapter {
  get: () => object
  /** Mescla os dados do servidor no estado local e devolve o resultado (ou null se os dados forem inválidos/de versão mais nova). */
  merge: (remote: unknown) => object | null
  /** Resumo canônico dos campos sincronizados, para saber se há algo novo a enviar. */
  fingerprint: (data: unknown) => string
  /** Opcional: devolve uma versão compactada do documento a enviar (ou o próprio objeto se não há o que compactar). Nada muda localmente ainda. */
  prepare?: (data: object) => object
  /** Opcional: chamado só depois que o servidor ACEITOU o documento compactado; aí o estado local passa a usá-lo. */
  committed?: (sent: object) => void
}
export interface SyncState { enabled: boolean; email?: string; admin?: boolean; status: 'local' | 'idle' | 'syncing' | 'error' | 'offline'; msg?: string; lastAt?: string }
export interface SyncConfig { api: string; storage?: Pick<Storage, 'getItem' | 'setItem'>; fetch?: typeof fetch; debounceMs?: number; retryBaseMs?: number; retryMaxMs?: number; maxAttempts?: number; storageKey?: string }
interface Saved { token?: string; email?: string; admin?: boolean; versions: Record<Kind, number> }
const KINDS: Kind[] = ['progress', 'content']
const fresh = (): Saved => ({ versions: { progress: 0, content: 0 } })
export type AuthResult = { ok: true } | { ok: false; status: number; message: string } // status 0 = sem conexão com o servidor
export type SessionCheck = 'none' | 'valid' | 'invalid' | 'offline'
export class ApiError extends Error { constructor(public status: number, m: string, public body?: { version?: number; data?: unknown }) { super(m) } }

export function createSync(cfg: SyncConfig) {
  const API = cfg.api.replace(/\/$/, ''), KEY = cfg.storageKey ?? 'aprova-tjsp:sync:v1'
  const store = cfg.storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
  const doFetch = (...a: Parameters<typeof fetch>) => (cfg.fetch ?? fetch)(...a)
  const debounceMs = cfg.debounceMs ?? 3000, retryBase = cfg.retryBaseMs ?? 5000, retryMax = cfg.retryMaxMs ?? 300000, maxAttempts = cfg.maxAttempts ?? 6
  let saved: Saved = fresh()
  const readSaved = () => { try { const r = store?.getItem(KEY); saved = r ? { ...fresh(), ...JSON.parse(r) } : fresh() } catch { saved = fresh() } }
  const persist = () => { try { store?.setItem(KEY, JSON.stringify(saved)) } catch { /* ignora */ } }
  readSaved()
  let st: SyncState = { enabled: !!API, email: saved.token ? saved.email : undefined, admin: saved.token ? saved.admin : undefined, status: saved.token ? 'idle' : 'local' }
  let adapters: Partial<Record<Kind, Adapter>> = {}
  const synced: Partial<Record<Kind, string>> = {} // resumo do último estado que sabemos estar no servidor
  const subs = new Set<() => void>(); let ver = 0
  const set = (p: Partial<SyncState>) => { st = { ...st, ...p }; ver++; subs.forEach(f => f()) }

  async function req(method: string, path: string, body?: unknown, auth = true) {
    let r: Response
    try { r = await doFetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(auth && saved.token ? { Authorization: `Bearer ${saved.token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) }) }
    catch { throw new ApiError(0, 'Sem conexão com o servidor.') }
    const t = await r.text(); let j: { error?: string } & Record<string, unknown> = {}
    try { j = t ? JSON.parse(t) : {} } catch { /* resposta não-JSON */ }
    if (!r.ok) {
      if (r.status === 401 && auth) { saved = fresh(); persist(); set({ email: undefined, admin: undefined, status: 'local', msg: 'Sessão expirada. Entre novamente.' }) }
      throw new ApiError(r.status, j.error ?? `Erro ${r.status}`, j as never)
    }
    return j
  }

  // Envia; em 409 (outro aparelho salvou antes) mescla com a versão que o servidor devolveu e tenta de novo. Nunca descarta dados locais.
  async function push(k: Kind) {
    const a = adapters[k]; if (!a) return
    readSaved(); let data = a.get(), base = saved.versions[k]
    for (let i = 0; i < maxAttempts; i++) {
      try {
        let payload = data; try { payload = a.prepare?.(data) ?? data } catch { payload = data } // compactar nunca pode impedir o envio
        const r = await req('PUT', `/api/data/${k}`, { baseVersion: base, data: payload }) as { version: number }
        saved.versions[k] = r.version; persist()
        if (payload !== data) { a.committed?.(payload); synced[k] = a.fingerprint(payload) } else synced[k] = a.fingerprint(data)
        return
      } catch (e) {
        if (!(e instanceof ApiError) || e.status !== 409) throw e
        const merged = e.body?.data ? a.merge(e.body.data) : data
        if (!merged) throw new ApiError(422, 'Os dados do servidor não puderam ser lidos (formato inválido ou de uma versão mais nova do app). Nada foi sobrescrito.')
        data = merged; base = e.body?.version ?? base
      }
    }
    throw new ApiError(409, 'Muitas atualizações simultâneas. Tentaremos de novo em instantes.')
  }
  // Busca o servidor (só se a versão mudou), mescla e, se a mescla trouxe algo que o servidor não tem, envia.
  async function pull(k: Kind) {
    const a = adapters[k]; if (!a) return
    readSaved()
    const meta = await req('GET', `/api/data/${k}/meta`) as { version: number }
    if (meta.version === saved.versions[k] && meta.version !== 0 && synced[k] !== undefined) { if (a.fingerprint(a.get()) !== synced[k]) await push(k); return } // nada novo no servidor; só envia o que for local
    const r = await req('GET', `/api/data/${k}`) as { version: number; data: unknown }
    if (r.version === 0 || !r.data) { await push(k); return }
    const merged = a.merge(r.data)
    if (!merged) throw new ApiError(422, 'Os dados do servidor não puderam ser lidos (formato inválido ou de uma versão mais nova do app). Nada foi sobrescrito.')
    saved.versions[k] = r.version; persist()
    if (a.fingerprint(merged) !== a.fingerprint(r.data)) await push(k); else synced[k] = a.fingerprint(r.data)
  }

  // fila: uma sincronização por vez
  let chain: Promise<void> = Promise.resolve(), retryN = 0, retryTimer: ReturnType<typeof setTimeout> | undefined
  const timers: Partial<Record<Kind, ReturnType<typeof setTimeout>>> = {}
  function run(fn: () => Promise<void>): Promise<void> {
    const next = chain.then(async () => {
      if (!saved.token) return
      set({ status: 'syncing', msg: undefined })
      try { await fn(); retryN = 0; set({ status: 'idle', msg: undefined, lastAt: new Date().toISOString() }) }
      catch (e) {
        if (e instanceof ApiError && e.status === 0) { set({ status: 'offline', msg: 'Sem conexão. Seus dados estão salvos neste aparelho e serão enviados quando a conexão voltar.' }); scheduleRetry() }
        else if (e instanceof ApiError && e.status === 409) { set({ status: 'error', msg: e.message }); scheduleRetry() }
        else if (!(e instanceof ApiError && e.status === 401)) set({ status: 'error', msg: e instanceof Error ? e.message : 'Falha ao sincronizar.' })
      }
    })
    chain = next.catch(() => undefined); return next
  }
  function scheduleRetry() { clearTimeout(retryTimer); const wait = Math.min(retryBase * 3 ** retryN++, retryMax); retryTimer = setTimeout(() => { void syncNow() }, wait) }
  const syncNow = () => run(async () => { for (const k of KINDS) await pull(k) })
  function scheduleSync(k: Kind, delay = debounceMs) {
    if (!saved.token) return
    clearTimeout(timers[k]); timers[k] = setTimeout(() => { void run(() => push(k)) }, delay)
  }

  // onAuthed roda (de forma síncrona) logo depois que o servidor aceita as credenciais e ANTES da primeira sincronização:
  // é o ponto em que o app troca os dados locais se a conta for outra (veja lib/auth.ts).
  async function authenticate(mode: 'login' | 'register', email: string, password: string, onAuthed?: (email: string) => void): Promise<AuthResult> {
    if (!API) return { ok: false, status: 0, message: 'Servidor não configurado.' }
    set({ status: 'syncing', msg: undefined })
    try {
      const r = await req('POST', `/api/auth/${mode}`, { email, password }, false) as { token: string; user: { email: string; admin?: boolean } }
      saved = { token: r.token, email: r.user.email, admin: !!r.user.admin, versions: { progress: 0, content: 0 } }; persist()
      Object.keys(synced).forEach(k => delete synced[k as Kind])
      onAuthed?.(r.user.email)
      set({ email: r.user.email, admin: !!r.user.admin })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Falha ao entrar.', status = e instanceof ApiError ? e.status : 0
      set({ status: saved.token ? 'idle' : 'local', msg: undefined }); return { ok: false, status, message }
    }
    await syncNow(); return { ok: true }
  }
  function logout() { clearTimeout(retryTimer); Object.keys(synced).forEach(k => delete synced[k as Kind]); KINDS.forEach(k => clearTimeout(timers[k])); saved = fresh(); persist(); set({ email: undefined, admin: undefined, status: 'local', msg: undefined }) }
  async function deleteAccount(password: string) {
    try { await req('DELETE', '/api/me', { password }); logout(); set({ msg: 'Conta e dados do servidor apagados. Os dados deste navegador foram mantidos.' }) }
    catch (e) { set({ status: 'error', msg: e instanceof Error ? e.message : 'Falha ao apagar a conta.' }) }
  }
  // Confirma no servidor que o token guardado ainda vale. Só 401 conta como sessão inválida: falha de rede, timeout ou erro 5xx
  // mantêm a sessão (o app segue com os dados locais e tenta sincronizar depois).
  async function verifySession(timeoutMs = 6000): Promise<SessionCheck> {
    readSaved(); if (!saved.token) return 'none'
    try {
      const r = await Promise.race([req('GET', '/api/me'), new Promise<never>((_, rej) => setTimeout(() => rej(new ApiError(0, 'timeout')), timeoutMs))]) as { user: { admin?: boolean } }
      saved.admin = !!r.user.admin; persist(); set({ admin: saved.admin }); return 'valid'
    } catch (e) { return e instanceof ApiError && e.status === 401 ? 'invalid' : 'offline' }
  }
  // Outra aba entrou ou saiu da conta: relê o armazenamento e atualiza o estado.
  function reload() { readSaved(); set({ email: saved.token ? saved.email : undefined, admin: saved.token ? saved.admin : undefined, status: saved.token ? 'idle' : 'local', msg: undefined }) }
  // Ao abrir o app, voltar ao foco ou reconectar: puxa e mescla (no máximo 1x a cada 15 s), e confirma o papel de administrador no servidor.
  let lastPull = 0
  async function refreshMe() { try { const r = await req('GET', '/api/me') as { user: { admin?: boolean } }; saved.admin = !!r.user.admin; persist(); set({ admin: saved.admin }) } catch { /* sem rede: mantém o último valor */ } }
  function maybePull(force = false) { if (!saved.token) return; const n = Date.now(); if (!force && n - lastPull < 15000) return; lastPull = n; void syncNow() }
  function startAutoSync(win: Pick<Window, 'addEventListener' | 'removeEventListener'> & { document?: Document } = window) {
    const onVis = () => { if (win.document?.visibilityState !== 'hidden') maybePull() }, onOnline = () => { clearTimeout(retryTimer); maybePull(true) }, onFocus = () => maybePull()
    win.addEventListener('visibilitychange', onVis); win.addEventListener('online', onOnline); win.addEventListener('focus', onFocus)
    const poll = setInterval(() => { if (win.document?.visibilityState !== 'hidden') maybePull(true) }, 60000)
    if (saved.token) { void refreshMe(); maybePull(true) }
    return () => { win.removeEventListener('visibilitychange', onVis); win.removeEventListener('online', onOnline); win.removeEventListener('focus', onFocus); clearInterval(poll) }
  }
  return {
    getState: () => st, subscribe: (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }, version: () => ver,
    setAdapters: (a: Partial<Record<Kind, Adapter>>) => { adapters = a }, authenticate, verifySession, reload, logout, deleteAccount, syncNow, scheduleSync, startAutoSync, isLoggedIn: () => !!saved.token,
    idle: () => chain, dispose: () => { clearTimeout(retryTimer); KINDS.forEach(k => clearTimeout(timers[k])) },
  }
}

// instância usada pelo app
const API = ((import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? '')
export const sync = createSync({ api: API })
export const useSyncState = () => { useSyncExternalStore(sync.subscribe, sync.version); return sync.getState() }
export const { setAdapters, authenticate, verifySession, reload, logout, deleteAccount, syncNow, scheduleSync, startAutoSync, isLoggedIn } = sync
