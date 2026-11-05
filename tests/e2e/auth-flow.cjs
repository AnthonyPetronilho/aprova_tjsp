// E2E manual do fluxo de entrada (não roda no `npm test`). Mesmos pré-requisitos de two-devices.cjs (servidor em memória na 3101,
// Atenção: o servidor limita tentativas de login/cadastro por IP (20 a cada 15 min). Este roteiro usa ~12; reinicie o servidor de teste entre execuções.
// front compilado com VITE_API_URL e servido na 4174). Opcional: AXE=/caminho/axe.min.js para checar acessibilidade.
const { chromium } = require('playwright'), fs = require('fs')
const U = 'http://localhost:4174', API = 'http://localhost:3101', stamp = Date.now(), EA = `a${stamp}@x.com`, EB = `b${stamp}@x.com`, PW = 'senha-de-teste-123'
const ok = (c, m) => { if (!c) { console.error('FALHA:', m); process.exit(1) } console.log('ok -', m) }
const txt = pg => pg.locator('body').innerText(), hash = pg => pg.evaluate(() => location.hash)
const legacy = { xp: 245, completed: { 'pt-crase': '2026-10-01' }, answers: { 'q-x': { chosen: 'A', correct: true, everCorrect: true, at: '2026-10-01' } }, studyDays: ['2026-10-01'], bonusDays: [], dark: false, cards: {}, errors: {}, favorites: [], reviewLog: [], notes: { 'a': { text: 'minha nota antiga', updatedAt: '2026-10-01T10:00:00.000Z' } }, achievements: {}, mocks: [], essays: [] }
const store = (pg, k) => pg.evaluate(k => localStorage.getItem(k), k)
async function newPage(b, opts = {}) {
  const c = await b.newContext({ viewport: opts.viewport ?? { width: 1100, height: 900 } }), pg = await c.newPage(); pg.errs = []
  pg.on('pageerror', e => pg.errs.push(e.message)); pg.ctx = c; return pg
}
const fillLogin = async (pg, email, pw) => { await pg.fill('#email', email); await pg.fill('#pw', pw) }
const prog = async pg => JSON.parse(await store(pg, 'aprova-tjsp:v1'))
;(async () => {
  const b = await chromium.launch(), P = await newPage(b)
  await P.addInitScript(s => { if (!localStorage.getItem('aprova-tjsp:v1') && !sessionStorage.getItem('seeded')) { localStorage.setItem('aprova-tjsp:v1', s); sessionStorage.setItem('seeded', '1') } }, JSON.stringify(legacy))
  // 1) visitante
  await P.goto(U); await P.waitForSelector('h1')
  let t = await txt(P)
  ok(/Seu conhecimento evolui a cada desafio/.test(t) && await P.locator('a:has-text("Entrar")').count() > 0 && await P.locator('a:has-text("Criar conta")').count() > 0, 'visitante vê a página de boas-vindas com Entrar e Criar conta')
  ok(!/Configurações|Esqueci/.test(t) && await P.locator('aside').count() === 0, 'sem menu do app nem "Esqueci minha senha"')
  await P.goto(U + '#/lesson/algum'); await P.waitForTimeout(300)
  ok((await hash(P)).startsWith('#/login?next=%2Flesson%2Falgum'), 'rota privada redireciona ao login guardando o destino')
  // 2) validação e erro de credencial
  await P.click('button[type=submit]'); ok(/Informe um e-mail|Informe seu e-mail/.test(await txt(P)), 'validação: e-mail vazio')
  await fillLogin(P, 'invalido', 'x'); await P.click('button[type=submit]'); ok(/e-mail válido/.test(await txt(P)), 'validação: e-mail inválido')
  await P.fill('#email', EA); await P.fill('#pw', PW); await P.click('button[type=submit]'); await P.waitForSelector('[role=alert]')
  ok(/E-mail ou senha incorretos/.test(await txt(P)), 'login com conta inexistente: mensagem clara')
  ok(await P.getAttribute('#pw', 'type') === 'password', 'senha oculta por padrão'); await fillLogin(P, EA, PW); await P.click('button:has-text("Mostrar")'); ok(await P.getAttribute('#pw', 'type') === 'text' && await P.getAttribute('button[aria-pressed]', 'aria-pressed') === 'true', 'mostrar/ocultar senha')
  // 3) cadastro (a página tem dados anteriores de quem usava sem conta → serão adotados)
  await P.goto(U + '#/register'); await P.waitForSelector('#pw2')
  await P.fill('#email', EA); await P.fill('#pw', 'curta'); await P.fill('#pw2', 'outra'); await P.click('button[type=submit]'); ok(/8 a 72/.test(await txt(P)) , 'cadastro: senha curta recusada')
  await P.fill('#pw', PW); await P.fill('#pw2', 'diferente-123'); await P.click('button[type=submit]'); ok(/não coincidem/.test(await txt(P)), 'cadastro: senhas diferentes recusadas')
  await P.fill('#pw2', PW); await P.click('button[type=submit]'); await P.waitForSelector('aside', { timeout: 8000 })
  ok(await hash(P) === '#/dashboard', 'cadastro leva ao dashboard'); ok(/Conta criada/.test(await txt(P)), 'confirmação de sucesso exibida')
  let pr = await prog(P); ok(pr.xp === 245 && pr.base.completed['pt-crase'], 'progresso anterior (XP 245, aula concluída no modelo anterior) adotado pela conta')
  // 4) sessão persiste e nunca pisca a tela de login durante a verificação
  await P.route('**/api/me', async r => { await new Promise(x => setTimeout(x, 1500)); r.continue() })
  const seen = []; await P.exposeFunction('rec', s => seen.push(s)); await P.addInitScript(() => { new MutationObserver(() => { const h = document.querySelector('h1')?.textContent ?? ''; if (/Entrar|Seu conhecimento/.test(h)) window.rec(h) }).observe(document, { childList: true, subtree: true }) })
  await P.reload(); await P.waitForTimeout(500); ok(/Carregando/.test(await txt(P)), 'durante a verificação aparece "Carregando…"')
  await P.waitForSelector('aside'); ok(seen.length === 0 && await hash(P) === '#/dashboard', 'após atualizar: sessão mantida, sem piscar login/boas-vindas'); await P.unroute('**/api/me')
  await P.goto(U + '#/login'); await P.waitForTimeout(300); ok(await hash(P) === '#/dashboard', 'autenticado em /login vai ao dashboard'); await P.goto(U + '#/'); await P.waitForTimeout(300); ok(await hash(P) === '#/dashboard', 'autenticado em / vai ao dashboard')
  // 5) menu de perfil: desktop + teclado
  const trig = P.locator('aside button[aria-haspopup=menu]')
  await trig.focus(); await P.keyboard.press('Enter'); await P.waitForSelector('[role=menu]')
  ok((await txt(P)).includes(EA) && await P.locator('[role=menuitem]').count() === 2, 'menu mostra o e-mail, Configurações e Sair da conta')
  ok(await P.evaluate(() => document.activeElement?.textContent?.includes('Configurações')), 'abre com foco no primeiro item')
  await P.keyboard.press('ArrowDown'); ok(await P.evaluate(() => document.activeElement?.textContent?.includes('Sair')), '↓ move para "Sair da conta"')
  await P.keyboard.press('Escape'); ok(await P.locator('[role=menu]').count() === 0 && await P.evaluate(() => document.activeElement?.getAttribute('aria-haspopup') === 'menu'), 'Esc fecha e devolve o foco ao avatar')
  await trig.click(); await P.mouse.click(700, 500); ok(await P.locator('[role=menu]').count() === 0, 'clicar fora fecha')
  await trig.click(); await P.click('[role=menuitem]:has-text("Configurações")'); await P.waitForTimeout(200); ok(await hash(P) === '#/settings' && !(await P.locator('input[type=email]').count()), 'Configurações abre sem formulário de login duplicado')
  // 6) sincronização: outro aparelho entra e recebe XP
  const D = await newPage(b); await D.goto(U + '#/login'); await fillLogin(D, EA, PW); await D.click('button[type=submit]'); await D.waitForSelector('aside', { timeout: 8000 }); await D.waitForTimeout(800)
  ok((await prog(D)).xp === 245, 'segundo aparelho recebe o XP após o login'); await D.ctx.close()
  // 7) logout: nada é apagado do servidor; navegador não guarda mais a conta A
  await P.locator('aside button[aria-haspopup=menu]').click(); await P.click('[role=menuitem]:has-text("Sair da conta")'); await P.waitForSelector('h1:has-text("Seu conhecimento")', { timeout: 8000 })
  ok(await hash(P) === '#/' && /Você saiu da conta/.test(await txt(P)), 'logout volta à página inicial com aviso')
  pr = await prog(P); ok(pr.xp === 0 && !pr.base.completed['pt-crase'] && !JSON.stringify(pr.notes).includes('antiga'), 'dados da conta A removidos do estado ativo do navegador')
  ok(await store(P, 'aprova-tjsp:owner') === null && JSON.parse(await store(P, 'aprova-tjsp:sync:v1')).token === undefined, 'token e dono removidos')
  ok((await P.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('aprova-tjsp:acct:') || k.startsWith('aprova-tjsp:backup:')).length)) >= 2, 'cópia da conta e backups preservados')
  // 8) troca de conta no mesmo navegador
  await P.goto(U + '#/register'); await P.fill('#email', EB); await P.fill('#pw', PW); await P.fill('#pw2', PW); await P.click('button[type=submit]'); await P.waitForSelector('aside', { timeout: 8000 }); await P.waitForTimeout(800)
  pr = await prog(P); ok(pr.xp === 0 && !JSON.stringify(pr).includes('q-x') && !JSON.stringify(pr).includes('antiga'), 'conta B não enxerga nada da conta A')
  await P.locator('aside button[aria-haspopup=menu]').click(); await P.click('[role=menuitem]:has-text("Sair da conta")'); await P.waitForSelector('h1:has-text("Seu conhecimento")')
  await P.goto(U + '#/login'); await fillLogin(P, EA, PW); await P.click('button[type=submit]'); await P.waitForSelector('aside', { timeout: 8000 }); await P.waitForTimeout(800)
  pr = await prog(P); ok(pr.xp === 245 && pr.base.completed['pt-crase'], 'conta A volta com todo o seu progresso')
  // 9) destino original após login
  await P.locator('aside button[aria-haspopup=menu]').click(); await P.click('[role=menuitem]:has-text("Sair da conta")'); await P.waitForSelector('h1:has-text("Seu conhecimento")')
  await P.goto(U + '#/bank'); await P.waitForSelector('#email'); await fillLogin(P, EA, PW); await P.click('button[type=submit]'); await P.waitForSelector('aside', { timeout: 8000 }); ok(await hash(P) === '#/bank', 'após o login volta à página que tentava acessar')
  // 10) sessão expirada: dados locais mantidos
  await P.evaluate(() => { const k = 'aprova-tjsp:sync:v1', j = JSON.parse(localStorage.getItem(k)); j.token = 'expirado'; localStorage.setItem(k, JSON.stringify(j)) })
  await P.reload(); await P.waitForSelector('#email', { timeout: 8000 })
  ok(/Sua sessão expirou/.test(await txt(P)) && (await hash(P)).includes('next=%2Fbank'), 'sessão expirada: login com aviso e destino')
  ok((await prog(P)).xp === 245, 'sessão expirada não apaga o progresso local')
  // 11) backend indisponível: segue dentro, com dados locais
  await fillLogin(P, EA, PW); await P.click('button[type=submit]'); await P.waitForSelector('aside', { timeout: 8000 })
  await P.route('**/api/**', r => r.abort()); await P.reload(); await P.waitForSelector('aside', { timeout: 12000 })
  ok(await hash(P) === '#/bank' && (await prog(P)).xp === 245, 'backend fora do ar: continua autenticado, sem redirecionar nem apagar dados')
  await P.locator('aside button[aria-haspopup=menu]').click(); await P.waitForTimeout(500); ok(/Sem conexão|Sincroniz/.test(await txt(P)), 'menu mostra o estado da sincronização offline')
  await P.keyboard.press('Escape'); await P.unroute('**/api/**')
  // 12) celular
  const M = await newPage(b, { viewport: { width: 390, height: 844 } }); await M.goto(U); await M.waitForSelector('h1')
  const noScroll = pg => pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  ok(await noScroll(M), 'boas-vindas sem rolagem horizontal no celular'); await M.goto(U + '#/login'); ok(await noScroll(M), 'login sem rolagem horizontal'); await M.goto(U + '#/register'); ok(await noScroll(M), 'cadastro sem rolagem horizontal')
  await M.goto(U + '#/login'); await fillLogin(M, EA, PW); await M.click('button[type=submit]'); await M.waitForSelector('header button[aria-haspopup=menu]', { timeout: 8000 })
  ok(await noScroll(M), 'dashboard sem rolagem horizontal no celular')
  await M.click('header button[aria-haspopup=menu]'); const box = await M.locator('[role=menu]').boundingBox(); ok(box && box.x >= 0 && box.x + box.width <= 390, 'menu de perfil cabe na tela do celular')
  await M.click('[role=menuitem]:has-text("Sair da conta")'); await M.waitForSelector('h1:has-text("Seu conhecimento")', { timeout: 8000 }); ok(await hash(M) === '#/', 'logout no celular')
  // 13) acessibilidade (axe) nas telas públicas e no app
  if (process.env.AXE && fs.existsSync(process.env.AXE)) {
    const axe = fs.readFileSync(process.env.AXE, 'utf8')
    for (const [name, pg, route] of [['boas-vindas', M, '#/'], ['login', M, '#/login'], ['cadastro', M, '#/register']]) { await pg.goto(U + route); await pg.waitForTimeout(300); await pg.evaluate(axe); const r = await pg.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })); ok(r.violations.length === 0, `axe ${name}: ${r.violations.map(v => v.id + ' ' + v.nodes.map(n => n.target).join('|')).join('; ') || '0 violações'}`) }
    // no app só o que esta etapa criou (menu de perfil); violações antigas de outras páginas (contraste dos títulos do menu lateral, selects sem nome no Banco) ficam fora deste escopo
    await P.goto(U + '#/dashboard'); await P.locator('aside button[aria-haspopup=menu]').click(); await P.evaluate(axe)
    const r = await P.evaluate(() => axe.run(document.querySelector('aside div.relative'), { runOnly: ['wcag2a', 'wcag2aa'] })); ok(r.violations.length === 0, `axe menu de perfil: ${r.violations.map(v => v.id + ' ' + v.nodes.map(n => n.target).join('|')).join('; ') || '0 violações'}`)
  }
  ok(P.errs.length === 0 && M.errs.length === 0, 'sem erros de JavaScript: ' + [...P.errs, ...M.errs].join(' | '))
  await b.close(); console.log('E2E-AUTH OK')
})().catch(e => { console.error('ERRO', e.message); process.exit(1) })
