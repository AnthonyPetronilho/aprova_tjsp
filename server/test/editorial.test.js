// Fase 5 — testes do catálogo editorial. Usam o repositório EM MEMÓRIA (mesma interface do MongoDB; os mesmos testes podem rodar contra o MongoDB real: veja test/editorial.mongo.test.js).
import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import { createApp } from '../src/app.js'
import { createMemoryRepo } from '../src/repo.memory.js'
import { runEditorialSuite } from './editorial.suite.js'
const SECRET = 'x'.repeat(40)
async function boot(opts = {}, repo = createMemoryRepo()) {
  const app = createApp({ repo, jwtSecret: SECRET, corsOrigin: 'http://localhost:5173', bcryptCost: 4, rateLimitMax: 1000, adminEmails: ' Admin@Test.com , outro@x.com ', ...opts })
  await app.locals.editorialReady
  const srv = await new Promise(r => { const s = app.listen(0, () => r(s)) }), base = `http://127.0.0.1:${srv.address().port}`
  const call = async (method, path, body, token, extra = {}) => { const r = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra }, body: body === undefined ? undefined : JSON.stringify(body) }); const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null } catch { /* */ } return { status: r.status, body: j, headers: r.headers } }
  const reg = async (email) => (await call('POST', '/api/auth/register', { email, password: 'senha-boa-123' })).body.token
  return { call, reg, close: () => srv.close(), repo }
}
runEditorialSuite({ test, assert, jwt, boot, SECRET, label: 'memória' })
