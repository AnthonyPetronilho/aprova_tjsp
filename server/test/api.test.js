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
// progresso mínimo válido no formato antigo (v1) e no atual (v2)
const P1 = (extra = {}) => ({ xp: 0, completed: {}, answers: {}, cards: {}, errors: {}, notes: {}, daily: {}, studyDays: [], bonusDays: [], favorites: [], reviewLog: [], reviewXpDays: [], mocks: [], mockXpDays: [], essays: [], ...extra })
const EV = (o = {}) => ({ id: 'e1', t: 'ans', at: '2026-11-05T10:00:00.000Z', day: '2026-11-05', qid: 'q1', chosen: 'A', correct: true, ...o })
const P2 = (events = [], extra = {}) => P1({ schemaVersion: 2, epoch: { id: '0', at: '' }, base: {}, events, ...extra })
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
    const p1 = await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: P1({ xp: 10, notes: { 'card:x': { text: 'a', updatedAt: 'x' } }, daily: { '2026-11-04': { $set: 1 } } }) }, a); assert.equal(p1.status, 200); assert.equal(p1.body.version, 1)
    const g = await s.call('GET', '/api/data/progress', undefined, a); assert.equal(g.body.data.xp, 10); assert.deepEqual(g.body.data.daily['2026-11-04'], { $set: 1 }, 'chaves estranhas preservadas')
    const stale = await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: P1({ xp: 99 }) }, a); assert.equal(stale.status, 409); assert.equal(stale.body.data.xp, 10, 'conflito devolve a versão do servidor')
    assert.equal((await s.call('PUT', '/api/data/progress', { baseVersion: 1, data: P1({ xp: 20 }) }, a)).body.version, 2)
    assert.equal((await s.call('GET', '/api/data/progress', undefined, b)).body.data, null, 'B não vê dados de A')
    assert.equal((await s.call('PUT', '/api/data/content', { baseVersion: 0, data: { lessons: [], questions: [], cards: [] } }, a)).status, 200, 'tipo content')
    assert.equal((await s.call('GET', '/api/data/outro', undefined, a)).status, 404)
    for (const bad of [{ baseVersion: -1, data: {} }, { baseVersion: '0', data: {} }, { baseVersion: 0, data: [] }, { baseVersion: 0, data: 'x' }, { baseVersion: 0 }]) assert.equal((await s.call('PUT', '/api/data/progress', bad, a)).status, 400)
    assert.equal((await s.call('PUT', '/api/data/progress', { baseVersion: 2, data: P1({ notes: { n: { text: 'x'.repeat(4_600_000), updatedAt: 'x' } } }) }, a)).status, 413)
  } finally { s.close() }
})
test('excluir conta apaga usuário e dados', async () => {
  const s = await boot(); try {
    const { body } = await reg(s); await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: P1({ xp: 1 }) }, body.token)
    assert.equal((await s.call('DELETE', '/api/me', undefined, body.token)).status, 403, 'sem senha não apaga')
    assert.equal((await s.call('DELETE', '/api/me', { password: 'senha-errada-1' }, body.token)).status, 403, 'senha errada não apaga')
    assert.equal((await s.call('GET', '/api/me', undefined, body.token)).status, 200, 'conta continua existindo')
    assert.equal((await s.call('DELETE', '/api/me', { password: 'senha-boa-123' }, body.token)).status, 204)
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

test('administrador é definido só no servidor e verificado a cada requisição', async () => {
  const s = await boot({ adminEmails: ' Admin@x.com , outro@x.com ' }); try {
    const adm = await reg(s, 'admin@x.com'), usr = await reg(s, 'user@x.com')
    assert.equal(adm.body.user.admin, true, 'cadastro devolve o papel só como informação'); assert.equal(usr.body.user.admin, false)
    assert.equal((await s.call('GET', '/api/me', undefined, adm.body.token)).body.user.admin, true)
    assert.equal((await s.call('GET', '/api/admin/whoami')).status, 401, 'sem token')
    assert.equal((await s.call('GET', '/api/admin/whoami', undefined, usr.body.token)).status, 403, 'usuário comum')
    assert.equal((await s.call('GET', '/api/admin/whoami', undefined, adm.body.token)).status, 200)
    // o token não carrega papel: um token assinado com o segredo certo e uma "claim" de admin não vale para um usuário comum
    const forged = jwt.sign({ sub: usr.body.user.id, admin: true, role: 'admin' }, SECRET)
    assert.equal((await s.call('GET', '/api/admin/whoami', undefined, forged)).status, 403, 'claim no token não concede acesso')
    const tok = jwt.decode(adm.body.token); assert.equal(tok.admin, undefined); assert.equal(tok.role, undefined)
    // cabeçalhos/corpo enviados pelo cliente também não concedem acesso
    const h = await fetch(s.base + '/api/admin/whoami?admin=true', { headers: { Authorization: `Bearer ${usr.body.token}`, 'X-Admin': 'true' } }); assert.equal(h.status, 403)
  } finally { s.close() }
  const none = await boot(); try { const u = await reg(none, 'admin@x.com'); assert.equal((await none.call('GET', '/api/admin/whoami', undefined, u.body.token)).status, 403, 'sem ADMIN_EMAILS ninguém é admin') } finally { none.close() }
})
test('validação do formato do progresso e do conteúdo (422)', async () => {
  const s = await boot(); try {
    const a = (await reg(s)).body.token, put = (data, kind = 'progress', baseVersion = 0) => s.call('PUT', `/api/data/${kind}`, { baseVersion, data }, a)
    for (const [nome, d] of [
      ['xp negativo', P1({ xp: -1 })], ['xp texto', P1({ xp: '10' })], ['sem completed', (({ completed, ...r }) => r)(P1())], ['lista no lugar de objeto', P1({ answers: [] })],
      ['evento de tipo desconhecido', P2([EV({ t: 'hack' })])], ['evento sem id', P2([EV({ id: '' })])], ['dia inválido', P2([EV({ day: '05/11/2026' })])], ['ids repetidos', P2([EV(), EV()])],
      ['alternativa inválida', P2([EV({ chosen: 'Z' })])], ['XP absurdo', P2([EV({ id: 'r1', t: 'rwd', kind: 'q', key: 'q1', xp: 99999 })])], ['tempo absurdo', P2([EV({ id: 's1', t: 'sec', sec: 999999 })])],
      ['versão futura', P1({ schemaVersion: 3 })], ['v2 sem base', (({ base, ...r }) => r)(P2())], ['events não é lista', P2('x')],
    ]) assert.equal((await put(d)).status, 422, nome)
    assert.equal((await put(P2([EV(), EV({ id: 'e2', t: 'sec', sec: 15 })]))).status, 200, 'v2 válido')
    assert.equal((await put({ lessons: [{ nome: 'sem id' }], questions: [], cards: [] }, 'content')).status, 422)
    assert.equal((await put({ lessons: [], questions: [], cards: [], videos: [] }, 'content')).status, 422)
    assert.equal((await put({ lessons: [{ id: 'u-1' }], questions: [], cards: [], videos: {}, deleted: {} }, 'content')).status, 200)
  } finally { s.close() }
})
test('meta de versão, histórico (backup) no servidor e 409 com o documento atual', async () => {
  const s = await boot(); try {
    const u = await reg(s), a = u.body.token
    assert.equal((await s.call('GET', '/api/data/progress/meta', undefined, a)).body.version, 0)
    await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: P1({ xp: 1 }) }, a)
    await s.call('PUT', '/api/data/progress', { baseVersion: 1, data: P1({ xp: 2 }) }, a)
    await s.call('PUT', '/api/data/progress', { baseVersion: 2, data: P1({ xp: 3 }) }, a)
    assert.equal((await s.call('GET', '/api/data/progress/meta', undefined, a)).body.version, 3)
    const h = await s.repo.listHistory(u.body.user.id, 'progress'); assert.deepEqual(h.map(x => JSON.parse(x.json).xp), [1, 2], 'versões substituídas ficam guardadas')
    const c = await s.call('PUT', '/api/data/progress', { baseVersion: 1, data: P1({ xp: 9 }) }, a); assert.equal(c.status, 409); assert.equal(c.body.version, 3); assert.equal(c.body.data.xp, 3)
    for (let i = 3; i < 20; i++) await s.call('PUT', '/api/data/progress', { baseVersion: i, data: P1({ xp: i }) }, a)
    assert.equal((await s.repo.listHistory(u.body.user.id, 'progress')).length, 10, 'histórico limitado às 10 últimas')
    assert.equal((await s.call('GET', '/api/data/outro/meta', undefined, a)).status, 404)
  } finally { s.close() }
})
test('limite de requisições nas rotas de dados é por usuário', async () => {
  const s = await boot({ dataLimitMax: 5 }); try {
    const a = (await reg(s, 'a@b.com')).body.token, b = (await reg(s, 'b@b.com')).body.token
    const codes = []; for (let i = 0; i < 8; i++) codes.push((await s.call('GET', '/api/data/progress/meta', undefined, a)).status)
    assert.ok(codes.includes(429), 'A é limitado: ' + codes)
    assert.equal((await s.call('GET', '/api/data/progress/meta', undefined, b)).status, 200, 'B não é afetado pelo limite de A')
  } finally { s.close() }
})
test('trust proxy é configurável e o servidor sobe com ele', async () => {
  const s = await boot({ trustProxy: '1' }); try { assert.equal((await s.call('GET', '/api/health')).status, 200) } finally { s.close() }
})
