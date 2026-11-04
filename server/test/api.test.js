import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import { createApp } from '../src/app.js'
import { createMemoryRepo } from '../src/repo.memory.js'
const SECRET = 'x'.repeat(40)
async function boot(opts = {}) {
  const repo = createMemoryRepo(), app = createApp({ repo, jwtSecret: SECRET, corsOrigin: 'http://localhost:5173', bcryptCost: 4, rateLimitMax: 1000, ...opts })
  const srv = await new Promise(r => { const s = app.listen(0, () => r(s)) }), base = `http://127.0.0.1:${srv.address().port}`
  const call = async (method, path, body, token) => { const r = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) }); const t = await r.text(); return { status: r.status, body: t ? JSON.parse(t) : null, headers: r.headers } }
  return { call, close: () => srv.close(), repo, base }
}
const reg = (s, email = 'a@b.com', password = 'senha-boa-123') => s.call('POST', '/api/auth/register', { email, password })

test('JWT_SECRET curto é recusado', () => assert.throws(() => createApp({ repo: createMemoryRepo(), jwtSecret: 'curto' })))
test('cadastro, login e /me', async () => {
  const s = await boot(); try {
    const r = await reg(s, ' A@B.com '); assert.equal(r.status, 201); assert.equal(r.body.user.email, 'a@b.com'); assert.ok(r.body.token); assert.equal(r.body.user.passHash, undefined)
    assert.equal((await reg(s, 'a@b.com')).status, 409, 'e-mail repetido (case-insensitive)')
    const l = await s.call('POST', '/api/auth/login', { email: 'A@b.com', password: 'senha-boa-123' }); assert.equal(l.status, 200)
    assert.equal((await s.call('GET', '/api/me', undefined, l.body.token)).body.user.email, 'a@b.com')
  } finally { s.close() }
})
test('validação de credenciais e login genérico', async () => {
  const s = await boot(); try {
    assert.equal((await s.call('POST', '/api/auth/register', { email: 'ruim', password: 'senha-boa-123' })).status, 400)
    assert.equal((await s.call('POST', '/api/auth/register', { email: 'a@b.com', password: 'curta' })).status, 400)
    assert.equal((await s.call('POST', '/api/auth/register', { email: 'a@b.com', password: 'x'.repeat(73) })).status, 400)
    assert.equal((await s.call('POST', '/api/auth/register', { email: { $ne: 1 }, password: 'senha-boa-123' })).status, 400, 'objeto no e-mail (NoSQL injection)')
    await reg(s)
    const wrong = await s.call('POST', '/api/auth/login', { email: 'a@b.com', password: 'senha-errada-1' }), ghost = await s.call('POST', '/api/auth/login', { email: 'nao@existe.com', password: 'senha-errada-1' })
    assert.equal(wrong.status, 401); assert.deepEqual(wrong.body, ghost.body, 'mesma mensagem com ou sem usuário')
  } finally { s.close() }
})
test('rotas protegidas exigem token válido', async () => {
  const s = await boot(); try {
    const { body } = await reg(s)
    for (const t of [undefined, 'lixo', jwt.sign({ sub: body.user.id }, 'outro-segredo-'.repeat(4)), jwt.sign({ sub: body.user.id }, SECRET, { expiresIn: -10 }), jwt.sign({ sub: 'inexistente' }, SECRET), jwt.sign({ sub: body.user.id }, '', { algorithm: 'none' })])
      assert.equal((await s.call('GET', '/api/data/progress', undefined, t)).status, 401)
  } finally { s.close() }
})
test('documentos: versão otimista, isolamento entre usuários e limites', async () => {
  const s = await boot(); try {
    const a = (await reg(s, 'a@b.com')).body.token, b = (await reg(s, 'b@b.com')).body.token
    assert.deepEqual((await s.call('GET', '/api/data/progress', undefined, a)).body, { version: 0, updatedAt: null, data: null })
    const p1 = await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: { xp: 10, 'card:x': { a: 1 }, '2026-11-04': { $set: 1 } } }, a); assert.equal(p1.status, 200); assert.equal(p1.body.version, 1)
    const g = await s.call('GET', '/api/data/progress', undefined, a); assert.equal(g.body.data.xp, 10); assert.deepEqual(g.body.data['2026-11-04'], { $set: 1 }, 'chaves estranhas preservadas')
    const stale = await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: { xp: 99 } }, a); assert.equal(stale.status, 409); assert.equal(stale.body.data.xp, 10, 'conflito devolve a versão do servidor')
    assert.equal((await s.call('PUT', '/api/data/progress', { baseVersion: 1, data: { xp: 20 } }, a)).body.version, 2)
    assert.equal((await s.call('GET', '/api/data/progress', undefined, b)).body.data, null, 'B não vê dados de A')
    assert.equal((await s.call('PUT', '/api/data/content', { baseVersion: 0, data: { lessons: [] } }, a)).status, 200, 'tipo content')
    assert.equal((await s.call('GET', '/api/data/outro', undefined, a)).status, 404)
    for (const bad of [{ baseVersion: -1, data: {} }, { baseVersion: '0', data: {} }, { baseVersion: 0, data: [] }, { baseVersion: 0, data: 'x' }, { baseVersion: 0 }]) assert.equal((await s.call('PUT', '/api/data/progress', bad, a)).status, 400)
    assert.equal((await s.call('PUT', '/api/data/progress', { baseVersion: 2, data: { big: 'x'.repeat(1_100_000) } }, a)).status, 413)
  } finally { s.close() }
})
test('excluir conta apaga usuário e dados', async () => {
  const s = await boot(); try {
    const { body } = await reg(s); await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: { xp: 1 } }, body.token)
    assert.equal((await s.call('DELETE', '/api/me', undefined, body.token)).status, 204)
    assert.equal((await s.call('GET', '/api/me', undefined, body.token)).status, 401)
    assert.equal(await s.repo.getDoc(body.user.id, 'progress'), null)
    assert.equal((await reg(s)).status, 201, 'e-mail pode ser reutilizado')
  } finally { s.close() }
})
test('limitador de tentativas, cabeçalhos de segurança, CORS e JSON inválido', async () => {
  const s = await boot({ rateLimitMax: 3 }); try {
    const r = await s.call('GET', '/api/health'); assert.ok(r.headers.get('x-content-type-options')); assert.equal(r.headers.get('x-powered-by'), null)
    const o = await fetch(s.base + '/api/health', { headers: { Origin: 'http://evil.com' } }); assert.equal(o.headers.get('access-control-allow-origin'), null)
    const g = await fetch(s.base + '/api/health', { headers: { Origin: 'http://localhost:5173' } }); assert.equal(g.headers.get('access-control-allow-origin'), 'http://localhost:5173')
    const j = await fetch(s.base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{ruim' }); assert.equal(j.status, 400)
    const codes = []; for (let i = 0; i < 5; i++) codes.push((await s.call('POST', '/api/auth/login', { email: 'a@b.com', password: 'qualquer-senha' })).status)
    assert.ok(codes.includes(429), 'bloqueia após várias tentativas: ' + codes)
    assert.equal((await s.call('GET', '/api/nada')).status, 404)
  } finally { s.close() }
})
