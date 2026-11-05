import { createApp } from './app.js'
import { createMemoryRepo } from './repo.memory.js'
import { createMongoRepo } from './repo.mongo.js'
const { PORT = '3001', MONGODB_URI, JWT_SECRET, CORS_ORIGIN = 'http://localhost:5173', STORE, NODE_ENV, ADMIN_EMAILS = '', TRUST_PROXY } = process.env
let repo
if (STORE === 'memory') {
  if (NODE_ENV === 'production') { console.error('STORE=memory não é permitido em produção.'); process.exit(1) }
  console.warn('⚠️  Usando armazenamento EM MEMÓRIA: nada será salvo ao reiniciar.'); repo = createMemoryRepo()
} else {
  if (!MONGODB_URI) { console.error('Defina MONGODB_URI no arquivo .env (veja .env.example).'); process.exit(1) }
  repo = await createMongoRepo(MONGODB_URI)
}
if (!JWT_SECRET || /cole-aqui|troque|exemplo|changeme/i.test(JWT_SECRET)) { console.error('JWT_SECRET ausente ou ainda é o texto de exemplo. Gere um segredo de verdade (veja .env.example) e salve o .env.'); process.exit(1) }
if (!ADMIN_EMAILS.trim()) console.warn('ℹ️  ADMIN_EMAILS vazio: ninguém terá acesso às rotas administrativas.')
const app = createApp({ repo, jwtSecret: JWT_SECRET, corsOrigin: CORS_ORIGIN, adminEmails: ADMIN_EMAILS, trustProxy: TRUST_PROXY })
const server = app.listen(Number(PORT), () => console.log(`API do Aprova TJSP em http://localhost:${PORT} (armazenamento: ${repo.kind})`))
const stop = () => server.close(() => repo.close().then(() => process.exit(0)))
process.on('SIGINT', stop); process.on('SIGTERM', stop)
