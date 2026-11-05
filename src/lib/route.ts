import { useSyncExternalStore } from 'react'
// Roteamento mínimo por hash (#/login, #/dashboard…). Funciona em qualquer hospedagem estática sem regras de reescrita e
// dá ao botão "voltar" do navegador o comportamento esperado. Nenhuma biblioteca nova.
export type Gate = 'checking' | 'in' | 'out'
export const PAGE_KEYS = ['home', 'edital', 'lesson', 'review', 'bank', 'errors', 'notes', 'mocks', 'essay', 'plan', 'progress', 'settings', 'soon', 'admin'] as const
export type PageKey = (typeof PAGE_KEYS)[number]
export type View =
  | { kind: 'loading' } | { kind: 'welcome' } | { kind: 'login' } | { kind: 'register' }
  | { kind: 'page'; page: PageKey; lessonId?: string }
  | { kind: 'redirect'; to: string }

export const pageToPath = (page: string, lessonId?: string | null): string =>
  page === 'home' ? '/dashboard' : page === 'lesson' && lessonId ? `/lesson/${encodeURIComponent(lessonId)}` : `/${page}`
export function parsePage(path: string): { page: PageKey; lessonId?: string } | null {
  const [, a, b] = path.split('/'); if (a === undefined) return null
  if (a === 'dashboard') return b === undefined ? { page: 'home' } : null
  if (a === 'lesson') { if (b === undefined || b === '') return { page: 'lesson' }; try { return { page: 'lesson', lessonId: decodeURIComponent(b) } } catch { return { page: 'lesson' } } }
  return (PAGE_KEYS as readonly string[]).includes(a) && a !== 'home' && b === undefined ? { page: a as PageKey } : null
}
export function parseHash(h: string): { path: string; query: URLSearchParams } {
  const raw = h.replace(/^#/, ''), i = raw.indexOf('?'), p = i < 0 ? raw : raw.slice(0, i)
  let path = '/' + p.replace(/^\/+/, ''); if (path.length > 1) path = path.replace(/\/+$/, '')
  return { path, query: new URLSearchParams(i < 0 ? '' : raw.slice(i + 1)) }
}
// Destino pós-login: só caminhos internos conhecidos (nunca a própria tela de login/cadastro).
export const safeNext = (next: string | null | undefined): string => (next && next.startsWith('/') && !next.startsWith('//') && parsePage(next) ? next : '/dashboard')

// Decide o que mostrar. Função pura: toda a regra de proteção de rotas está aqui e é testada sem navegador.
export function resolveRoute(path: string, query: URLSearchParams, enabled: boolean, gate: Gate): View {
  const auth = path === '/' || path === '/login' || path === '/register', pg = parsePage(path)
  if (!enabled) return auth || !pg ? { kind: 'redirect', to: '/dashboard' } : { kind: 'page', ...pg } // sem servidor não há conta: o app é 100% local
  if (gate === 'checking') return { kind: 'loading' }
  if (gate === 'in') {
    if (path === '/login' || path === '/register') return { kind: 'redirect', to: safeNext(query.get('next')) }
    return auth || !pg ? { kind: 'redirect', to: '/dashboard' } : { kind: 'page', ...pg }
  }
  if (path === '/') return { kind: 'welcome' }
  if (path === '/login') return { kind: 'login' }
  if (path === '/register') return { kind: 'register' }
  return { kind: 'redirect', to: pg && pg.page !== 'home' ? `/login?next=${encodeURIComponent(path)}` : '/login' }
}

const subscribe = (f: () => void) => { window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f) }
export const useHash = () => useSyncExternalStore(subscribe, () => window.location.hash, () => '')
export function navigate(to: string, replace = false) {
  const h = '#' + to; if (window.location.hash === h) return
  if (replace) window.location.replace(h); else window.location.hash = to
}
