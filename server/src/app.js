import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { VALIDATORS } from './validate.js'

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/
const KINDS = new Set(['progress', 'content'])
const LIMIT = { progress: 4_500_000, content: 4_000_000 }  // bytes: o progresso agora inclui o registro de eventos  // bytes (texto JSON)

// Administradores: definidos só no servidor (ADMIN_EMAILS, separados por vírgula). O token JWT NÃO carrega papel algum:
// a cada requisição o servidor confere o e-mail do usuário contra esta lista. Nenhum estado do frontend concede acesso.
export const parseAdmins = s => new Set(String(s ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean))

export function createApp({ repo, jwtSecret, corsOrigin, bcryptCost = 12, rateLimitMax = 20, dataLimitMax = 600, adminEmails = '', trustProxy = undefined }) {
  if (!jwtSecret || jwtSecret.length < 32) throw new Error('JWT_SECRET precisa ter pelo menos 32 caracteres.')
  const app = express()
  app.disable('x-powered-by')
  if (trustProxy !== undefined && trustProxy !== '') app.set('trust proxy', /^\d+$/.test(String(trustProxy)) ? Number(trustProxy) : trustProxy)
  const admins = parseAdmins(adminEmails), isAdmin = u => !!u && admins.has(String(u.email).toLowerCase())
  app.use(helmet())
  app.use(cors({ origin: corsOrigin ? corsOrigin.split(',').map(s => s.trim()) : false, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }))
  app.use(express.json({ limit: '5mb' }))
  const dummyHash = bcrypt.hashSync('senha-falsa-para-igualar-tempo', bcryptCost)
  const sign = u => jwt.sign({ sub: u.id }, jwtSecret, { algorithm: 'HS256', expiresIn: '7d' })
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: rateLimitMax, standardHeaders: true, legacyHeaders: false, message: { error: 'Muitas tentativas. Aguarde alguns minutos.' } })
  const wrap = fn => (req, res, next) => fn(req, res, next).catch(next)

  const auth = wrap(async (req, res, next) => {
    const h = req.headers.authorization ?? '', t = h.startsWith('Bearer ') ? h.slice(7) : ''
    try {
      const { sub } = jwt.verify(t, jwtSecret, { algorithms: ['HS256'] })
      const u = await repo.findUserById(String(sub)); if (!u) throw new Error('sem usuário')
      req.user = u; next()
    } catch { res.status(401).json({ error: 'Sessão inválida ou expirada. Entre novamente.' }) }
  })

  app.get('/api/health', (_req, res) => res.json({ ok: true, store: repo.kind }))

  const creds = body => {
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '', password = typeof body?.password === 'string' ? body.password : ''
    if (!EMAIL.test(email)) return { error: 'Informe um e-mail válido.' }
    if (password.length < 8 || password.length > 72) return { error: 'A senha precisa ter de 8 a 72 caracteres.' }
    return { email, password }
  }
  app.post('/api/auth/register', authLimiter, wrap(async (req, res) => {
    const c = creds(req.body); if (c.error) return res.status(400).json({ error: c.error })
    const u = await repo.createUser({ email: c.email, passHash: await bcrypt.hash(c.password, bcryptCost) })
    if (!u) return res.status(409).json({ error: 'Este e-mail já está cadastrado.' })
    res.status(201).json({ token: sign(u), user: { id: u.id, email: u.email, admin: isAdmin(u) } })
  }))
  app.post('/api/auth/login', authLimiter, wrap(async (req, res) => {
    const c = creds(req.body); if (c.error) return res.status(400).json({ error: c.error })
    const u = await repo.findUserByEmail(c.email)
    const ok = await bcrypt.compare(c.password, u?.passHash ?? dummyHash)   // mesmo custo com ou sem usuário
    if (!u || !ok) return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
    res.json({ token: sign(u), user: { id: u.id, email: u.email, admin: isAdmin(u) } })
  }))
  app.get('/api/me', auth, (req, res) => res.json({ user: { id: req.user.id, email: req.user.email, admin: isAdmin(req.user) } }))
  // apagar a conta exige a senha atual (um token roubado não basta)
  app.delete('/api/me', authLimiter, auth, wrap(async (req, res) => {
    const pw = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!pw || !(await bcrypt.compare(pw, req.user.passHash))) return res.status(403).json({ error: 'Senha incorreta.' })
    await repo.deleteUser(req.user.id); res.status(204).end()
  }))
  // Rotas administrativas: sempre autenticadas E autorizadas no servidor. As rotas de conteúdo entram na Fase 5.
  const requireAdmin = [auth, (req, res, next) => (isAdmin(req.user) ? next() : res.status(403).json({ error: 'Acesso restrito a administradores.' }))]
  app.get('/api/admin/whoami', ...requireAdmin, (req, res) => res.json({ admin: true, email: req.user.email }))

  // Documentos do usuário (progresso e conteúdo). O servidor guarda o JSON como o app enviou, depois de validar o formato.
  // Atualização com controle de versão (baseVersion): se outro aparelho salvou antes, responde 409 com o documento atual
  // e quem mescla é o cliente. Cada versão substituída fica no histórico do servidor (backup, últimas 10).
  const dataLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: dataLimitMax, standardHeaders: true, legacyHeaders: false, keyGenerator: req => `u:${req.user?.id ?? req.ip}`, message: { error: 'Muitas requisições. Aguarde alguns minutos.' } })
  const kindOk = (req, res, next) => (KINDS.has(req.params.kind) ? next() : res.status(404).json({ error: 'Tipo desconhecido.' }))
  app.get('/api/data/:kind/meta', auth, dataLimiter, kindOk, wrap(async (req, res) => {
    const d = await repo.getDoc(req.user.id, req.params.kind)
    res.json({ version: d?.version ?? 0, updatedAt: d?.updatedAt ?? null })
  }))
  app.get('/api/data/:kind', auth, dataLimiter, kindOk, wrap(async (req, res) => {
    const d = await repo.getDoc(req.user.id, req.params.kind)
    res.json(d ? { version: d.version, updatedAt: d.updatedAt, data: JSON.parse(d.json) } : { version: 0, updatedAt: null, data: null })
  }))
  app.put('/api/data/:kind', auth, dataLimiter, kindOk, wrap(async (req, res) => {
    const kind = req.params.kind
    const { baseVersion, data } = req.body ?? {}
    if (!Number.isInteger(baseVersion) || baseVersion < 0) return res.status(400).json({ error: 'baseVersion inválido.' })
    if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ error: 'data precisa ser um objeto.' })
    const bad = VALIDATORS[kind](data); if (bad) return res.status(422).json({ error: `Dados recusados: ${bad}` })
    const json = JSON.stringify(data)
    if (Buffer.byteLength(json) > LIMIT[kind]) return res.status(413).json({ error: 'Dados grandes demais.' })
    const r = await repo.putDoc(req.user.id, kind, json, baseVersion)
    if (r.conflict) return res.status(409).json({ error: 'Versão desatualizada: outro dispositivo salvou antes.', version: r.current?.version ?? 0, updatedAt: r.current?.updatedAt ?? null, data: r.current ? JSON.parse(r.current.json) : null })
    res.json({ version: r.doc.version, updatedAt: r.doc.updatedAt })
  }))

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Dados grandes demais.' })
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido.' })
    console.error(err); res.status(500).json({ error: 'Erro interno.' })
  })
  return app
}
