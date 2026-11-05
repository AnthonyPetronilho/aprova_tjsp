import { describe, expect, it } from 'vitest'
import { parseHash, parsePage, resolveRoute, safeNext, pageToPath, PAGE_KEYS } from '../src/lib/route'
import { validateConfirm, validateEmail, validatePassword, authMessage } from '../src/lib/authForm'

const q = (s = '') => new URLSearchParams(s)
describe('rotas e proteção', () => {
  it('visitante vê boas-vindas, login e cadastro; o resto vai para o login com destino', () => {
    expect(resolveRoute('/', q(), true, 'out')).toEqual({ kind: 'welcome' })
    expect(resolveRoute('/login', q(), true, 'out')).toEqual({ kind: 'login' })
    expect(resolveRoute('/register', q(), true, 'out')).toEqual({ kind: 'register' })
    expect(resolveRoute('/lesson/abc', q(), true, 'out')).toEqual({ kind: 'redirect', to: '/login?next=%2Flesson%2Fabc' })
    expect(resolveRoute('/settings', q(), true, 'out')).toEqual({ kind: 'redirect', to: '/login?next=%2Fsettings' })
    expect(resolveRoute('/dashboard', q(), true, 'out')).toEqual({ kind: 'redirect', to: '/login' })
    expect(resolveRoute('/qualquer-coisa', q(), true, 'out')).toEqual({ kind: 'redirect', to: '/login' })
  })
  it('enquanto verifica a sessão, mostra carregamento (nunca o login)', () => {
    for (const p of ['/', '/login', '/dashboard', '/settings']) expect(resolveRoute(p, q(), true, 'checking')).toEqual({ kind: 'loading' })
  })
  it('usuário autenticado: / e telas de entrada vão ao dashboard (ou ao destino salvo); páginas abrem; desconhecida volta ao dashboard', () => {
    expect(resolveRoute('/', q(), true, 'in')).toEqual({ kind: 'redirect', to: '/dashboard' })
    expect(resolveRoute('/login', q(), true, 'in')).toEqual({ kind: 'redirect', to: '/dashboard' })
    expect(resolveRoute('/login', q('next=%2Fbank'), true, 'in')).toEqual({ kind: 'redirect', to: '/bank' })
    expect(resolveRoute('/dashboard', q(), true, 'in')).toEqual({ kind: 'page', page: 'home' })
    expect(resolveRoute('/lesson/x%20y', q(), true, 'in')).toEqual({ kind: 'page', page: 'lesson', lessonId: 'x y' })
    expect(resolveRoute('/nada', q(), true, 'in')).toEqual({ kind: 'redirect', to: '/dashboard' })
  })
  it('sem servidor configurado o app continua 100% local, sem telas de conta', () => {
    expect(resolveRoute('/', q(), false, 'out')).toEqual({ kind: 'redirect', to: '/dashboard' })
    expect(resolveRoute('/login', q(), false, 'out')).toEqual({ kind: 'redirect', to: '/dashboard' })
    expect(resolveRoute('/review', q(), false, 'out')).toEqual({ kind: 'page', page: 'review' })
  })
  it('destino pós-login só aceita caminhos internos conhecidos', () => {
    expect(safeNext('/bank')).toBe('/bank')
    for (const bad of ['//evil.com', 'https://evil.com', '/login', '/register', '/', '', null, undefined, 'javascript:alert(1)']) expect(safeNext(bad as string)).toBe('/dashboard')
  })
  it('todas as páginas existentes têm caminho e voltam do caminho', () => {
    for (const k of PAGE_KEYS) { const r = parsePage(pageToPath(k)); expect(r?.page).toBe(k) }
    expect(parsePage(pageToPath('lesson', 'a/b c'))).toEqual({ page: 'lesson', lessonId: 'a/b c' })
    expect(parseHash('#/login?next=%2Fbank')).toMatchObject({ path: '/login' }); expect(parseHash('').path).toBe('/'); expect(parseHash('#/review/').path).toBe('/review')
  })
})
describe('validação do formulário (igual ao servidor)', () => {
  it('e-mail e senha', () => {
    expect(validateEmail('')).toBeTruthy(); expect(validateEmail('a@b')).toBeTruthy(); expect(validateEmail(' a@b.co ')).toBe('')
    expect(validatePassword('1234567')).toBeTruthy(); expect(validatePassword('12345678')).toBe(''); expect(validatePassword('x'.repeat(73))).toBeTruthy()
    expect(validateConfirm('abc', 'abd')).toBeTruthy(); expect(validateConfirm('abc', 'abc')).toBe('')
  })
  it('mensagens: rede ≠ credencial inválida', () => {
    expect(authMessage('login', 0, 'x')).toMatch(/conectar/); expect(authMessage('login', 401, 'x')).toBe('E-mail ou senha incorretos.'); expect(authMessage('register', 409, 'x')).toMatch(/já está cadastrado/)
  })
})
