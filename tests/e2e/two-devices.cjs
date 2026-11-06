// E2E manual (não roda no `npm test`): dois aparelhos simulados no navegador contra o servidor real.
// Pré-requisitos: `npm i -D playwright` (ou playwright já instalado), servidor em memória e o front compilado apontando para ele:
//   (cd server && STORE=memory JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") CORS_ORIGIN=http://localhost:4174 PORT=3101 node src/index.js) &
//   VITE_API_URL=http://localhost:3101 npx vite build --outDir /tmp/dist-api && (cd /tmp/dist-api && python3 -m http.server 4174) &
//   node tests/e2e/two-devices.cjs
const { chromium } = require('playwright')
const U = 'http://localhost:4174', em = `t${Date.now()}@x.com`, pw = 'senha-de-teste-123'
const ok = (c, m) => { if (!c) { console.error('FALHA:', m); process.exit(1) } console.log('ok -', m) }
const legacy = { xp: 245, completed: { 'pt-crase': '2026-10-01' }, answers: { 'q-x': { chosen: 'A', correct: true, everCorrect: true, at: '2026-10-01' } }, studyDays: ['2026-10-01'], bonusDays: [], dark: false, cards: {}, errors: {}, favorites: [], reviewLog: [], reviewXpDays: [], notes: { 'topic:pt-12': { text: 'minha nota antiga', updatedAt: '2026-10-03' } }, achievements: { first: '2026-10-01' }, correctStreak: 1, bestCorrectStreak: 1, totalAnswered: 1, daily: {}, settings: { xp: { lesson: 20, question: 10, review: 15, dailyMission: 50, mock: 100 } }, levelSeen: 3, planMarks: {}, mocks: [], mockXpDays: [], essays: [], essayDrafts: {} }
async function dev(b, seed) { const c = await b.newContext({ viewport: { width: 1100, height: 900 } }), pg = await c.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.errs = errs
  if (seed) await pg.addInitScript(s => { if (!localStorage.getItem('aprova-tjsp:v1')) localStorage.setItem('aprova-tjsp:v1', s) }, JSON.stringify(seed)); await pg.goto(U); await pg.waitForTimeout(600); return pg }
async function login(pg, mode) { await pg.goto(U + (mode === 'reg' ? '#/register' : '#/login')); await pg.fill('#email', em); await pg.fill('#pw', pw); if (mode === 'reg') await pg.fill('#pw2', pw); await pg.click(mode === 'reg' ? 'button[type=submit]:has-text("Criar conta")' : 'button[type=submit]:has-text("Entrar")'); await pg.waitForTimeout(1800); await pg.goto(U + '#/settings'); await pg.waitForTimeout(400) }
const txt = async pg => await pg.locator('body').innerText()
;(async () => {
  const b = await chromium.launch()
  // 1) migração de dados antigos no navegador
  const A = await dev(b, legacy)
  const raw = await A.evaluate(() => JSON.parse(localStorage.getItem('aprova-tjsp:v1')))
  ok(raw.schemaVersion === 3 && raw.base.xp === 245 && raw.xp === 245, 'dados antigos migrados: XP 245 preservado, schemaVersion 3')
  ok(raw.completed['pt-crase'] === '2026-10-01' && raw.base.completed['pt-crase'], 'aula concluída no modelo anterior preservada na base')
  const bk = await A.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('aprova-tjsp:backup:antes-da-migracao')))
  ok(bk.length === 1, 'backup criado antes de migrar')
  const orig = await A.evaluate(k => localStorage.getItem(k), bk[0]); ok(JSON.parse(orig).xp === 245 && JSON.parse(orig).schemaVersion === undefined, 'backup é o original (formato antigo), intacto')
  await A.reload(); await A.waitForTimeout(500)
  ok((await A.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('aprova-tjsp:backup:antes-da-migracao')).length)) === 1, 'recarregar não cria outro backup')
  // 2) dois aparelhos abertos sem atividade de estudo: nenhum conflito
  await login(A, 'reg'); ok(/sincronizado/.test(await txt(A)), 'A sincronizado após cadastro')
  const B = await dev(b); await login(B, 'login'); ok(/sincronizado/.test(await txt(B)), 'B sincronizado após login')
  ok((await B.evaluate(() => JSON.parse(localStorage.getItem('aprova-tjsp:v1')).xp)) === 245, 'B recebeu o XP 245 de A')
  ok(/minha nota antiga/.test(JSON.stringify(await B.evaluate(() => JSON.parse(localStorage.getItem('aprova-tjsp:v1')).notes))), 'B recebeu as anotações de A')
  for (let i = 0; i < 7; i++) { for (const P of [A, B]) { await P.mouse.move(100 + i * 9, 200); await P.keyboard.press('Shift') } await A.waitForTimeout(5000) }
  const ta = await txt(A), tb = await txt(B)
  ok(!/⚠️|sem conexão/.test(ta) && /✅ sincronizado/.test(ta), 'A: 35 s só com mouse não gera conflito (antes gerava)')
  ok(!/⚠️|sem conexão/.test(tb) && /✅ sincronizado/.test(tb), 'B: idem')
  ok(A.errs.length === 0 && B.errs.length === 0, 'sem erros de JavaScript na página')
  await b.close(); console.log('E2E-FASE2 OK')
})()
