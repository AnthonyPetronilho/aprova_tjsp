// E2E manual da Fase 3 (não roda no `npm test`). Modo local (sem servidor): `npm run build` sem VITE_API_URL e `npx vite preview --port 4174` (ou qualquer servidor estático de dist/).
const { chromium } = require('playwright')
const U = process.env.URL || 'http://localhost:4174'
const ok = (c, m) => { if (!c) { console.error('FALHA:', m); process.exit(1) } console.log('ok -', m) }
const txt = pg => pg.locator('body').innerText()
;(async () => {
  const b = await chromium.launch(), pg = await (await b.newContext({ viewport: { width: 1200, height: 1000 } })).newPage(), errs = []
  pg.on('pageerror', e => errs.push(e.message))
  const old = { xp: 245, completed: { 'pt-crase': '2026-10-01' }, answers: {}, studyDays: ['2026-10-01'], bonusDays: [], dark: false, cards: {}, errors: {}, notes: {}, favorites: [], mocks: [], reviewLog: [], reviewXpDays: [], daily: {}, settings: { xp: { lesson: 20, question: 10, review: 15, dailyMission: 50, mock: 100 } } }
  await pg.addInitScript(s => { if (!localStorage.getItem('aprova-tjsp:v1')) localStorage.setItem('aprova-tjsp:v1', s) }, JSON.stringify(old))
  await pg.goto(U + '#/dashboard'); await pg.waitForSelector('h1')
  let t = await txt(pg)
  ok(/Cobertura de estudo/.test(t) && /Cobertura de avaliação/.test(t) && /Domínio estimado/.test(t), 'dashboard mostra as três métricas separadas')
  ok(/Registrar estudo/.test(t) && /Validar aprendizado/.test(t) && /Revisar conteúdos/.test(t), 'acesso rápido presente')
  ok(/245 XP/.test(t), 'XP antigo preservado (245)')
  ok(await pg.evaluate(() => Object.keys(localStorage).some(k => k.includes('antes-da-migracao-v1'))), 'cópia criada antes de migrar')
  // Diário
  await pg.click('button:has-text("Registrar estudo")'); await pg.waitForSelector('form[aria-label="Registrar estudo"]')
  await pg.click('button:has-text("Salvar registro")'); ok(/Escolha um assunto/.test(await txt(pg)), 'diário recusa registro sem assunto')
  const selects = pg.locator('form select'); await selects.nth(0).selectOption({ index: 1 }); await selects.nth(1).selectOption({ index: 1 })
  await pg.fill('input[type=number]', '45'); await pg.fill('input[maxlength="120"]', 'Curso X, aula 1'); await pg.fill('textarea', 'ponto importante')
  await pg.click('button:has-text("Salvar registro")'); await pg.waitForSelector('li:has-text("Curso X, aula 1")')
  t = await txt(pg); ok(/45 min/.test(t) && /\(manual\)/.test(t) && /ponto importante/.test(t), 'registro criado, tempo marcado como manual')
  await pg.click('button:has-text("Editar")'); await pg.fill('input[type=number]', '60'); await pg.click('button:has-text("Salvar alterações")'); await pg.waitForSelector('li:has-text("1 h")')
  ok(/1 h/.test(await txt(pg)), 'registro editado')
  await pg.reload(); await pg.waitForSelector('li:has-text("Curso X, aula 1")'); ok(true, 'registro persiste após recarregar')
  await pg.click('button:has-text("Excluir")'); await pg.click('button:has-text("Confirmar exclusão")'); await pg.waitForTimeout(200)
  ok(/ainda não registrou/.test(await txt(pg)), 'registro excluído')
  // Edital: aula antiga
  await pg.goto(U + '#/edital'); await pg.waitForSelector('h1:has-text("Mapa do Edital")'); t = await txt(pg)
  ok(/O que significa cada status/.test(t) && /Não iniciado/.test(t), 'edital explica os status')
  // Validar: prática (nenhuma questão validada)
  await pg.goto(U + '#/validate'); await pg.waitForSelector('h1:has-text("Validar")')
  let s = pg.locator('select'); await s.nth(0).selectOption({ index: 1 }); await s.nth(1).selectOption({ index: 1 }); await pg.click('button:has-text("Continuar")')
  ok(/Estudo teórico/.test(await txt(pg)), 'etapa 2')
  await pg.click('button:has-text("Sim, concluí o estudo teórico")'); await pg.click('button:has-text("Continuar para as questões")')
  t = await txt(pg); ok(/Domínio ainda não avaliado — questões validadas insuficientes\./.test(t), 'avaliação sem questões validadas mostra a mensagem exigida')
  await pg.click('button:has-text("Fazer uma prática")'); ok(/Quantidade de questões/.test(await txt(pg)), 'quantidade variável disponível na prática')
  await pg.click('button:has-text("Começar")'); await pg.waitForSelector('fieldset')
  const n = await pg.locator('fieldset').count(); ok(n >= 1, `prática com ${n} questão(ões) do assunto`)
  for (let i = 0; i < n; i++) await pg.locator('fieldset').nth(i).locator('input[type=radio]').first().check()
  await pg.click('button:has-text("Finalizar e ver resultado")'); await pg.waitForSelector('h2:has-text("Resultado")'); t = await txt(pg)
  ok(/Acertos/.test(t) && /Aproveitamento/.test(t) && /não conta para o domínio/.test(t), 'resultado: prática não conta para o domínio')
  await pg.click('button:has-text("Ver reforço sugerido")'); ok(/Reforço/.test(await txt(pg)), 'etapa 5 reforço'); await pg.click('button:has-text("Continuar")')
  ok(/1ª tentativa/.test(await txt(pg)), 'etapa 6 mostra a tentativa registrada')
  // Admin: validar questões do assunto e avaliar de verdade
  await pg.goto(U + '#/settings'); await pg.waitForSelector('h1:has-text("Configurações")'); await pg.locator('label:has-text("Modo editor") input, input[type=checkbox]').last().check().catch(() => {})
  const prog = await pg.evaluate(() => JSON.parse(localStorage.getItem('aprova-tjsp:v1')))
  const asmEv = prog.events.find(e => e.t === 'asm'); ok(!!asmEv && prog.events.filter(e => e.t === 'ans' && e.asm === asmEv.id).length === asmEv.items.length, 'tentativa registrada com respostas vinculadas')
  ok(prog.xp >= 245 && prog.completed['pt-crase'] === '2026-10-01' && prog.schemaVersion === 3, 'migração: XP e aula antiga preservados, esquema 3')
  ok(Object.keys(prog.marks).length === 1 && Object.keys(prog.diary).length === 1, 'aula antiga não virou estudo externo (só a marcação feita agora)')
  await pg.goto(U + '#/admin'); const qtab = pg.locator('[role=tab]:has-text("Questões")'); if (await qtab.count()) { await qtab.click(); const sel = pg.locator('select[aria-label="Situação de validação"]'); ok(await sel.count() > 100, 'admin lista a situação de validação das questões'); }
  // Avaliação de verdade: marca as questões do assunto como validadas (como o editor faria) e avalia em 2 dias diferentes
  const qids = asmEv.items.map(i => i[0]); ok(qids.length >= 3, `assunto tem ${qids.length} questões`)
  await pg.evaluate(q => localStorage.setItem('aprova-tjsp:content:v1', JSON.stringify({ editor: false, lessons: [], questions: [], cards: [], videos: {}, deleted: {}, validations: Object.fromEntries(q.map(id => [id, { v: 'validada', at: new Date().toISOString() }])) })), qids)
  await pg.goto(U + '#/validate'); await pg.reload(); await pg.waitForSelector('h1:has-text("Validar")')
  const runEval = async () => { s = pg.locator('select'); await s.nth(0).selectOption({ index: 1 }); await s.nth(1).selectOption({ index: 1 }); await pg.click('button:has-text("Continuar")'); await pg.click('button:has-text("Continuar para as questões")'); await pg.click('button:has-text("Começar")'); await pg.waitForSelector('fieldset'); const k = await pg.locator('fieldset').count(); for (let i = 0; i < k; i++) await pg.locator('fieldset').nth(i).locator('input[type=radio]').first().check(); await pg.click('button:has-text("Finalizar e ver resultado")'); await pg.waitForSelector('h2:has-text("Resultado")'); return txt(pg) }
  t = await runEval(); ok(/Resultado — Avaliação/.test(t) && !/não conta para o domínio/.test(t), 'avaliação com questões validadas (modo Avaliação)')
  ok(/Amostra insuficiente|Domínio ainda não avaliado/.test(t), 'um dia de avaliação não consolida o domínio: ' + (t.match(/(Amostra insuficiente[^\n]*|Domínio ainda não avaliado[^\n]*)/) || [''])[0])
  ok(errs.length === 0, 'sem erros de JavaScript: ' + errs.join('|'))
  await b.close(); console.log('E2E Fase 3: tudo ok')
})().catch(e => { console.error(e); process.exit(1) })
