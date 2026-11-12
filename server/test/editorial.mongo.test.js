// Mesma suíte do catálogo editorial, contra um MongoDB REAL. Só roda se MONGODB_TEST_URI estiver definido (use um banco descartável;
// os testes criam um banco com nome único e o apagam ao final). Sem a variável, os testes são marcados como "pulados" — não como aprovados.
import test from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import { MongoClient } from 'mongodb'
import { createApp } from '../src/app.js'
import { createMongoRepo } from '../src/repo.mongo.js'
import { runEditorialSuite } from './editorial.suite.js'
const URI = process.env.MONGODB_TEST_URI, SECRET = 'x'.repeat(40)
if (!URI) { test('catálogo editorial contra MongoDB real', { skip: 'MONGODB_TEST_URI não definido (teste não executado)' }, () => {}) }
else {
  async function boot(opts = {}) {
    const dbName = `aprova_test_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const repo = await createMongoRepo(URI, dbName)
    const app = createApp({ repo, jwtSecret: SECRET, corsOrigin: 'http://localhost:5173', bcryptCost: 4, rateLimitMax: 1000, adminEmails: ' Admin@Test.com , outro@x.com ', ...opts })
    await app.locals.editorialReady
    const srv = await new Promise(r => { const s = app.listen(0, () => r(s)) }), base = `http://127.0.0.1:${srv.address().port}`
    const call = async (method, path, body, token, extra = {}) => { const r = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra }, body: body === undefined ? undefined : JSON.stringify(body) }); const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null } catch { /* */ } return { status: r.status, body: j, headers: r.headers } }
    const reg = async email => (await call('POST', '/api/auth/register', { email, password: 'senha-boa-123' })).body.token
    return { call, reg, repo, close: async () => { srv.close(); await repo.close(); const c = new MongoClient(URI); await c.connect(); await c.db(dbName).dropDatabase(); await c.close() } }
  }
  runEditorialSuite({ test, assert, jwt, boot, SECRET, label: 'MongoDB real' })
}
