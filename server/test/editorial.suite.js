// Suíte compartilhada: roda com repositório em memória e, quando MONGODB_TEST_URI existe, contra um MongoDB real (banco descartável).
const Q = (o = {}) => ({ topicId: 'pt-12', stem: 'Qual é a alternativa correta sobre o uso da crase?', difficulty: 'Médio', answer: 'C', ref: 'Gramática, cap. 3',
  options: ['A', 'B', 'C', 'D', 'E'].map(id => ({ id, text: `Texto da alternativa ${id}`, why: `Explicação da alternativa ${id}` })), ...o })
const L = (o = {}) => ({ topicId: 'pt-12', title: 'Aula nova de teste', questionIds: [], steps: [{ title: 'Etapa 1', body: ['Parágrafo um.'] }], ...o })
export function runEditorialSuite({ test, assert, jwt, boot, SECRET, label }) {
  const T = (name, fn) => test(`[${label}] ${name}`, async () => { const s = await boot(); try { s.admin = await s.reg('admin@test.com'); s.user = await s.reg('aluna@x.com'); await fn(s) } finally { await s.close() } })
  const A = s => (m, p, b) => s.call(m, p, b, s.admin)
  const create = async (s, kind, data, key = Math.random().toString(36).slice(2) + 'abcdefgh') => (await A(s)('POST', `/api/admin/items/${kind}`, { clientKey: key, reason: 'criação de teste', data })).body
  const state = (s, it, to, extra = {}) => A(s)('POST', `/api/admin/items/${it.kind}/${it.id}/state`, { baseRev: it.rev, to, reason: 'mudança de teste', ...extra })

  // ---- autorização (1–4)
  T('rotas administrativas: sem token = 401, token inválido = 401, usuário comum = 403, administrador = 200', async s => {
    const routes = [['GET', '/api/admin/overview'], ['GET', '/api/admin/items'], ['GET', '/api/admin/history'], ['GET', '/api/admin/export'], ['POST', '/api/admin/import'], ['POST', '/api/admin/items/question', {}], ['PUT', '/api/admin/items/question/pt-1/draft', {}], ['POST', '/api/admin/items/question/pt-1/state', {}], ['POST', '/api/admin/items/question/pt-1/validation', {}]]
    for (const [m, p, b] of routes) {
      assert.equal((await s.call(m, p, b)).status, 401, `${m} ${p} sem token`)
      assert.equal((await s.call(m, p, b, 'lixo.lixo.lixo')).status, 401, `${m} ${p} token inválido`)
      assert.equal((await s.call(m, p, b, s.user)).status, 403, `${m} ${p} usuário comum`)
    }
    assert.equal((await s.call('GET', '/api/admin/overview', undefined, s.admin)).status, 200)
    const forged = jwt.sign({ sub: '999', admin: true, role: 'admin', email: 'admin@test.com' }, 'outro-segredo-qualquer-0000000000000000', { algorithm: 'HS256' })
    assert.equal((await s.call('GET', '/api/admin/overview', undefined, forged)).status, 401, 'JWT assinado com outro segredo')
    const claim = jwt.sign({ sub: '2', admin: true, role: 'admin' }, SECRET, { algorithm: 'HS256' })   // alega ser admin no próprio token: o servidor ignora
    assert.equal((await s.call('GET', '/api/admin/overview', undefined, claim)).status, 403, 'declaração de papel no JWT não vale')
    assert.equal((await s.call('GET', '/api/me', undefined, s.admin)).body.user.admin, true); assert.equal((await s.call('GET', '/api/me', undefined, s.user)).body.user.admin, false)
  })
  T('o e-mail administrativo é normalizado (espaços e maiúsculas) e nada de ADMIN_EMAILS vaza', async s => {
    const t = JSON.stringify([(await s.call('GET', '/api/me', undefined, s.admin)).body, (await s.call('GET', '/api/catalog', undefined, s.user)).body, (await A(s)('GET', '/api/admin/overview')).body])
    assert.ok(!/outro@x\.com|JWT_SECRET|passHash|senha-boa/i.test(t))
    assert.equal((await s.call('GET', '/api/catalog')).status, 401, 'catálogo exige autenticação')
  })
  // ---- catálogo base e importação
  T('importação idempotente: 524 questões base importadas; repetir não duplica nem sobrescreve', async s => {
    const ov = (await A(s)('GET', '/api/admin/overview')).body
    assert.equal(ov.totals.question, 524); assert.ok(ov.totals.lesson > 50 && ov.totals.card > 100)
    assert.deepEqual(ov.validation, { validada: 449, pendente: 69, 'precisa-correcao': 4, 'precisa-complementacao': 2 }, 'mesmas classificações da Fase 4C, sem alteração automática')
    const it = (await A(s)('GET', '/api/admin/items/question/pt-1')).body.item || (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.kind === 'question')
    const d = await A(s)('PUT', `/api/admin/items/question/${it.id}/draft`, { baseRev: it.rev, reason: 'rascunho', data: { ref: 'Referência editada' } }); assert.equal(d.status, 200)
    assert.equal((await A(s)('POST', '/api/admin/import')).body.inserted, 0)
    const again = (await A(s)('GET', `/api/admin/items/question/${it.id}`)).body.item; assert.equal(again.draft.data.ref, 'Referência editada', 'importação não sobrescreve edições')
    assert.equal((await A(s)('GET', '/api/admin/overview')).body.totals.question, 524)
  })
  // ---- questões (5–11)
  T('criar → rascunho invisível → publicar → visível aos usuários comuns; IDs estáveis', async s => {
    const c = await create(s, 'question', Q()); assert.equal(c.item.estado, 'rascunho'); assert.equal(c.item.validation, 'pendente'); assert.ok(c.item.id.startsWith('adm-q-'))
    let cat = (await s.call('GET', '/api/catalog', undefined, s.user)).body; assert.ok(!JSON.stringify(cat).includes(c.item.id), 'rascunho não vaza')
    const r1 = await state(s, c.item, 'em-revisao'); assert.equal(r1.status, 200); assert.equal(r1.body.item.estado, 'em-revisao')
    cat = (await s.call('GET', '/api/catalog', undefined, s.user)).body; assert.ok(!JSON.stringify(cat).includes(c.item.id), 'em revisão não vaza')
    const r2 = await state(s, r1.body.item, 'publicada'); assert.equal(r2.status, 200); assert.equal(r2.body.item.pub, 'publicada'); assert.equal(r2.body.item.id, c.item.id)
    cat = (await s.call('GET', '/api/catalog', undefined, s.user)).body; const row = cat.questions.find(x => x.id === c.item.id); assert.ok(row); assert.equal(row.validation, 'pendente'); assert.equal(row.live.answer, 'C')
    assert.ok(!JSON.stringify(cat).includes('admin@test.com') && !JSON.stringify(cat).includes('criação de teste'), 'sem e-mail nem justificativas')
  })
  T('publicar direto do rascunho exige confirmação explícita', async s => {
    const c = await create(s, 'question', Q()); assert.equal((await state(s, c.item, 'publicada')).status, 400); assert.equal((await state(s, c.item, 'publicada', { confirmReviewed: true })).status, 200)
  })
  T('conteúdo inválido é bloqueado no servidor (assunto, 5 alternativas, gabarito, repetidas, HTML, tamanho)', async s => {
    const bad = [Q({ topicId: 'inexistente' }), Q({ options: Q().options.slice(0, 4) }), Q({ answer: 'F' }), Q({ stem: 'curto' }), Q({ difficulty: 'Fácil!' }),
      Q({ options: Q().options.map(o => ({ ...o, text: 'igual' })) }), Q({ stem: 'Enunciado com <script>alert(1)</script> dentro' }), Q({ stem: 'x'.repeat(3000) }), Q({ extra: 'campo não permitido' }),
      Q({ options: Q().options.map((o, i) => (i === 2 ? { ...o, why: '' } : o)) })]
    for (const q of bad) { const r = await A(s)('POST', '/api/admin/items/question', { clientKey: 'k' + Math.random().toString(36).slice(2) + 'zzzz', reason: 'teste', data: q }); assert.equal(r.status, 422, JSON.stringify(r.body).slice(0, 120)) }
    assert.equal((await A(s)('POST', '/api/admin/items/question', { clientKey: 'curto', reason: 'teste', data: Q() })).status, 400, 'clientKey inválido')
    assert.equal((await A(s)('POST', '/api/admin/items/question', { clientKey: 'abcdefgh1234', reason: '', data: Q() })).status, 400, 'justificativa obrigatória')
  })
  T('criação idempotente: repetir a mesma requisição não duplica', async s => {
    const a = await create(s, 'question', Q(), 'chave-fixa-12345'), b = await create(s, 'question', Q(), 'chave-fixa-12345'); assert.equal(a.item.id, b.item.id); assert.equal(b.duplicate, true)
    assert.equal((await A(s)('GET', '/api/admin/items')).body.items.filter(x => x.origin === 'admin').length, 1)
  })
  T('correção de explicação em questão do catálogo: mesmo ID, rascunho invisível até publicar, histórico registrado', async s => {
    const q = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'ilc-4'); assert.ok(q)
    const e = await A(s)('PUT', '/api/admin/items/question/ilc-4/draft', { baseRev: q.rev, reason: 'precisar a referência', data: { optionWhy: { C: 'Correta: art. 37-B, I.' }, ref: 'LC 1.111/2010, art. 37-B' } }); assert.equal(e.status, 200)
    assert.ok(!JSON.stringify((await s.call('GET', '/api/catalog', undefined, s.user)).body).includes('art. 37-B, I.'))
    const p = await state(s, e.body.item, 'publicada', { confirmReviewed: true }); assert.equal(p.status, 200); assert.equal(p.body.item.id, 'ilc-4')
    const row = (await s.call('GET', '/api/catalog', undefined, s.user)).body.questions.find(x => x.id === 'ilc-4'); assert.equal(row.live.optionWhy.C, 'Correta: art. 37-B, I.')
    const h = (await A(s)('GET', '/api/admin/items/question/ilc-4')).body.history; assert.deepEqual(h.map(x => x.type), ['publicacao', 'edicao-rascunho']); assert.equal(h[1].by, 'admin@test.com'); assert.equal(h[1].before.draft, null); assert.ok(h[0].after.live)
    assert.equal(q.validation, 'validada'); assert.equal(p.body.item.validation, 'pendente', 'publicar edição de questão validada reabre a validação (decisão explícita, registrada)')
  })
  T('em questão do catálogo, mudar enunciado/alternativas/gabarito é recusado (usar substituição)', async s => {
    const q = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'ilc-4')
    for (const data of [{ stem: 'novo enunciado inventado para a questão' }, { answer: 'A' }, { options: [] }]) { const r = await A(s)('PUT', '/api/admin/items/question/ilc-4/draft', { baseRev: q.rev, reason: 'teste', data }); assert.equal(r.status, 422); assert.match(r.body.details.join(' '), /substitui/i) }
  })
  T('publicar edição de questão validada reabre a validação (pendente), a menos que keepValidation seja informado', async s => {
    const get = async id => (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === id)
    let q = await get('ilc-4'); let e = await A(s)('PUT', '/api/admin/items/question/ilc-4/draft', { baseRev: q.rev, reason: 'ajuste', data: { ref: 'nova' } })
    let p = await state(s, e.body.item, 'publicada', { confirmReviewed: true }); assert.equal(p.body.item.validation, 'pendente'); assert.equal(p.body.item.validationSource, 'reaberta-por-edicao')
    q = await get('ilr-1'); e = await A(s)('PUT', '/api/admin/items/question/ilr-1/draft', { baseRev: q.rev, reason: 'ajuste', data: { ref: 'nova' } })
    p = await state(s, e.body.item, 'publicada', { confirmReviewed: true, keepValidation: true }); assert.equal(p.body.item.validation, 'validada')
  })
  T('erro confirmado impede publicação; revisão humana é rotulada e não se confunde com auditoria por IA', async s => {
    const c = await create(s, 'question', Q()), baseRev = c.item.rev
    const v = await A(s)('POST', `/api/admin/items/question/${c.item.id}/validation`, { baseRev, validation: 'precisa-correcao', reviewKind: 'administrador', note: 'Gabarito conflita com o dispositivo.', reference: '' }); assert.equal(v.status, 200)
    const p = await state(s, v.body.item, 'publicada', { confirmReviewed: true }); assert.equal(p.status, 422); assert.match(p.body.error, /erro confirmado/i)
    const ok = await A(s)('POST', `/api/admin/items/question/${v.body.item.id}/validation`, { baseRev: v.body.item.rev, validation: 'validada', reviewKind: 'administrador', note: 'Conferi com o texto legal.', reference: 'CPC art. 226' })
    assert.equal(ok.body.item.validationSource, 'revisao-humana-administrador'); assert.equal(ok.body.item.validationBy, 'admin@test.com')
    const noRef = await A(s)('POST', `/api/admin/items/question/${ok.body.item.id}/validation`, { baseRev: ok.body.item.rev, validation: 'validada', reviewKind: 'profissional-declarado', note: 'Conferida por advogado.', reference: '' }); assert.equal(noRef.status, 422, 'validada exige fonte')
    const prof = await A(s)('POST', `/api/admin/items/question/${ok.body.item.id}/validation`, { baseRev: ok.body.item.rev, validation: 'validada', reviewKind: 'profissional-declarado', note: 'Conferida por advogado.', reference: 'CPC art. 226' }); assert.equal(prof.body.item.validationSource, 'revisao-profissional-declarada')
    assert.equal((await A(s)('POST', `/api/admin/items/question/${ok.body.item.id}/validation`, { baseRev: prof.body.item.rev, validation: 'validada', reviewKind: 'especialista', note: 'texto de nota longo', reference: 'x y z' })).status, 400, 'tipo de revisão inválido')
    const h = (await A(s)('GET', `/api/admin/items/question/${c.item.id}`)).body.history; assert.ok(h.some(x => x.type === 'validacao' && x.review?.label.includes('não é revisão por especialista')))
    assert.ok(!JSON.stringify(h).match(/revisada por especialista/i))
  })
  T('substituição: ID antigo permanece rastreável; só sai do pool quando a nova é publicada; não volta ao pool', async s => {
    const old = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'mmc-1')
    const r = await A(s)('POST', '/api/admin/items/question/mmc-1/replace', { baseRev: old.rev, reason: 'gabarito revisado', clientKey: 'subst-0001-abc', question: Q({ topicId: old.baseTopic }) }); assert.equal(r.status, 201); assert.equal(r.body.item.replaces, 'mmc-1')
    assert.equal((await A(s)('POST', '/api/admin/items/question/mmc-1/replace', { baseRev: old.rev, reason: 'gabarito revisado', clientKey: 'subst-0001-abc', question: Q({ topicId: old.baseTopic }) })).body.duplicate, true, 'idempotente')
    assert.equal((await s.call('GET', '/api/catalog', undefined, s.user)).body.questions.some(x => x.id === 'mmc-1' && x.supersededBy), false, 'antes de publicar a nova, a antiga continua ativa')
    const p = await state(s, r.body.item, 'publicada', { confirmReviewed: true }); assert.equal(p.status, 200)
    const row = (await s.call('GET', '/api/catalog', undefined, s.user)).body.questions.find(x => x.id === 'mmc-1'); assert.equal(row.supersededBy, r.body.item.id)
    const o = (await A(s)('GET', '/api/admin/items/question/mmc-1')).body; assert.equal(o.item.supersededBy, r.body.item.id); assert.ok(o.history.some(x => x.type === 'substituicao'))
    assert.equal((await state(s, o.item, 'publicada')).status, 409, 'substituída não volta ao pool'); assert.equal((await A(s)('PUT', '/api/admin/items/question/mmc-1/draft', { baseRev: o.item.rev, reason: 'teste', data: { ref: 'x' } })).status, 409)
    assert.equal((await A(s)('POST', '/api/admin/items/question/mmc-1/replace', { baseRev: o.item.rev, reason: 'de novo outra vez', clientKey: 'subst-0002-abc', question: Q({ topicId: old.baseTopic }) })).status, 409, 'já substituída')
  })
  T('mudar o sentido de uma questão já publicada exige substituição; descartar rascunho; arquivar e reativar', async s => {
    const c = await create(s, 'question', Q()); const p = await state(s, c.item, 'publicada', { confirmReviewed: true })
    const bad = await A(s)('PUT', `/api/admin/items/question/${c.item.id}/draft`, { baseRev: p.body.item.rev, reason: 'teste', data: Q({ answer: 'A' }) }); assert.equal(bad.status, 422); assert.match(bad.body.error, /Substituir/)
    const ok = await A(s)('PUT', `/api/admin/items/question/${c.item.id}/draft`, { baseRev: p.body.item.rev, reason: 'melhora da explicação', data: Q({ options: Q().options.map(o => ({ ...o, why: 'Explicação melhorada ' + o.id })) }) }); assert.equal(ok.status, 200)
    const d = await A(s)('DELETE', `/api/admin/items/question/${c.item.id}/draft`, { baseRev: ok.body.item.rev, reason: 'desisti da edição' }); assert.equal(d.status, 200); assert.equal(d.body.item.draft, null); assert.equal(d.body.item.pub, 'publicada')
    const ar = await state(s, d.body.item, 'arquivada'); assert.equal(ar.body.item.pub, 'arquivada')
    assert.equal((await s.call('GET', '/api/catalog', undefined, s.user)).body.questions.find(x => x.id === c.item.id).archived, true)
    const re = await state(s, ar.body.item, 'publicada'); assert.equal(re.body.item.pub, 'publicada')
  })
  // ---- aulas e flashcards (16–18)
  T('aulas: criar, editar, publicar, vínculos preservados; aula do catálogo mantém ID e assunto', async s => {
    const q = await create(s, 'question', Q()); await state(s, q.item, 'publicada', { confirmReviewed: true })
    const l = await create(s, 'lesson', L({ questionIds: [q.item.id, 'mmc-2'] })); assert.equal(l.item.estado, 'rascunho')
    assert.equal((await A(s)('POST', '/api/admin/items/lesson', { clientKey: 'aula-ruim-123456', reason: 'teste', data: L({ questionIds: ['nao-existe'] }) })).status, 422)
    const ed = await A(s)('PUT', `/api/admin/items/lesson/${l.item.id}/draft`, { baseRev: l.item.rev, reason: 'ajuste', data: L({ title: 'Título corrigido', questionIds: [q.item.id] }) }); assert.equal(ed.status, 200)
    const p = await state(s, ed.body.item, 'publicada', { confirmReviewed: true }); assert.equal(p.status, 200)
    const row = (await s.call('GET', '/api/catalog', undefined, s.user)).body.lessons.find(x => x.id === l.item.id); assert.equal(row.live.title, 'Título corrigido'); assert.deepEqual(row.live.questionIds, [q.item.id])
    const base = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.kind === 'lesson' && x.origin === 'catalogo')
    assert.equal((await A(s)('PUT', `/api/admin/items/lesson/${base.id}/draft`, { baseRev: base.rev, reason: 'teste', data: L({ topicId: base.baseTopic === 'pt-12' ? 'pt-1' : 'pt-12' }) })).status, 422, 'assunto de aula do catálogo é imutável')
  })
  T('flashcards: criar, editar, publicar, arquivar; card do catálogo preserva ID, assunto e aula', async s => {
    const lesson = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.kind === 'lesson' && x.origin === 'catalogo')
    const c = await create(s, 'card', { topicId: lesson.baseTopic, lessonId: lesson.id, front: 'Frente nova', back: 'Verso novo' }); assert.equal(c.item.kind, 'card')
    const p = await state(s, c.item, 'publicada', { confirmReviewed: true }); assert.equal(p.status, 200)
    assert.equal((await s.call('GET', '/api/catalog', undefined, s.user)).body.cards.find(x => x.id === c.item.id).live.front, 'Frente nova')
    const ar = await state(s, p.body.item, 'arquivada'); assert.equal(ar.body.item.pub, 'arquivada')
    const base = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'fc-crase-1'); assert.ok(base)
    const ok = await A(s)('PUT', '/api/admin/items/card/fc-crase-1/draft', { baseRev: base.rev, reason: 'corrigir conceito', data: { topicId: base.baseTopic, lessonId: base.baseLesson, front: 'O que é crase?', back: 'Fusão da preposição a com o artigo definido feminino.' } }); assert.equal(ok.status, 200)
    assert.equal((await A(s)('PUT', '/api/admin/items/card/fc-crase-1/draft', { baseRev: ok.body.item.rev, reason: 'teste', data: { topicId: base.baseTopic, lessonId: 'outra-aula', front: 'abc', back: 'abc' } })).status, 422)
  })
  // ---- concorrência (19–20) e recuperação
  T('concorrência: duas edições com a mesma versão → uma vence, a outra recebe 409 com o estado atual; nada é sobrescrito', async s => {
    const q = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'ilr-2')
    const [a, b] = await Promise.all([1, 2].map(i => A(s)('PUT', '/api/admin/items/question/ilr-2/draft', { baseRev: q.rev, reason: `edição ${i}`, data: { ref: `ref-${i}` } })))
    assert.deepEqual([a.status, b.status].sort(), [200, 409]); const loser = a.status === 409 ? a : b, winner = a.status === 200 ? a : b
    assert.match(loser.body.error, /outro administrador/i); assert.equal(loser.body.current.draft.data.ref, winner.body.item.draft.data.ref)
    const h = (await A(s)('GET', '/api/admin/items/question/ilr-2')).body.history; assert.equal(h.filter(x => x.type === 'edicao-rascunho').length, 1)
    const stale = await A(s)('PUT', '/api/admin/items/question/ilr-2/draft', { baseRev: q.rev, reason: 'atrasada', data: { ref: 'velha' } }); assert.equal(stale.status, 409)
    assert.equal((await A(s)('GET', '/api/admin/items/question/ilr-2')).body.item.draft.data.ref, winner.body.item.draft.data.ref)
  })
  T('concorrência na publicação e na validação também é detectada', async s => {
    const q = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'ilr-3')
    const r = await Promise.all([A(s)('POST', '/api/admin/items/question/ilr-3/validation', { baseRev: q.rev, validation: 'pendente', reviewKind: 'administrador', note: 'primeira revisão', reference: '' }), A(s)('POST', '/api/admin/items/question/ilr-3/validation', { baseRev: q.rev, validation: 'precisa-complementacao', reviewKind: 'administrador', note: 'segunda revisão', reference: '' })])
    assert.deepEqual(r.map(x => x.status).sort(), [200, 409])
  })
  T('recuperar versão anterior vira novo rascunho (nada é apagado) e exige nova publicação', async s => {
    const q = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'ilr-4')
    const e1 = await A(s)('PUT', '/api/admin/items/question/ilr-4/draft', { baseRev: q.rev, reason: 'primeira', data: { ref: 'versão A' } })
    const e2 = await A(s)('PUT', '/api/admin/items/question/ilr-4/draft', { baseRev: e1.body.item.rev, reason: 'segunda', data: { ref: 'versão B' } })
    const r = await A(s)('POST', '/api/admin/items/question/ilr-4/restore', { baseRev: e2.body.item.rev, version: e1.body.item.rev, reason: 'voltar à versão A' }); assert.equal(r.status, 200); assert.equal(r.body.item.draft.data.ref, 'versão A'); assert.equal(r.body.item.pub, 'publicada')
    const h = (await A(s)('GET', '/api/admin/items/question/ilr-4')).body.history; assert.equal(h.length, 3); assert.equal(h[0].type, 'restauracao')
    assert.equal((await A(s)('POST', '/api/admin/items/question/ilr-4/restore', { baseRev: r.body.item.rev, version: 99, reason: 'não existe' })).status, 404)
  })
  // ---- sincronização (12–15)
  T('mudar o catálogo não toca o progresso das contas (documento, versão e XP intactos) e contas continuam isoladas', async s => {
    const prog = { schemaVersion: 3, xp: 120, completed: {}, answers: {}, cards: {}, errors: {}, notes: {}, daily: {}, studyDays: [], bonusDays: [], favorites: [], reviewLog: [], reviewXpDays: [], mocks: [], mockXpDays: [], essays: [], diary: {}, marks: {}, epoch: { id: '0', at: '' }, base: {}, events: [{ id: 'e1', t: 'ans', at: '2026-11-05T10:00:00.000Z', day: '2026-11-05', qid: 'ilc-4', chosen: 'C', correct: true }] }
    const put = await s.call('PUT', '/api/data/progress', { baseVersion: 0, data: prog }, s.user); assert.equal(put.status, 200)
    const before = JSON.stringify((await s.call('GET', '/api/data/progress', undefined, s.user)).body)
    const q = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'ilc-4')
    const e = await A(s)('PUT', '/api/admin/items/question/ilc-4/draft', { baseRev: q.rev, reason: 'ajuste', data: { ref: 'x' } }); await state(s, e.body.item, 'publicada', { confirmReviewed: true })
    const old = (await A(s)('GET', '/api/admin/items')).body.items.find(x => x.id === 'mmc-3'); const arch = await state(s, old, 'arquivada'); assert.equal(arch.status, 200)
    assert.equal(JSON.stringify((await s.call('GET', '/api/data/progress', undefined, s.user)).body), before, 'progresso idêntico após publicar/arquivar')
    assert.equal((await s.call('GET', '/api/data/progress', undefined, s.admin)).body.data, null, 'a conta do administrador não vê o progresso da aluna')
  })
  T('catálogo: ETag permite resposta 304 e a revisão do catálogo só avança com publicações', async s => {
    const a = await s.call('GET', '/api/catalog', undefined, s.user); const rev0 = a.body.rev, etag = a.headers.get('etag')
    assert.equal((await s.call('GET', '/api/catalog', undefined, s.user, { 'If-None-Match': etag })).status, 304)
    const c = await create(s, 'question', Q()); assert.equal((await s.call('GET', '/api/catalog', undefined, s.user)).body.rev, rev0, 'rascunho não muda a revisão')
    await state(s, c.item, 'publicada', { confirmReviewed: true }); assert.ok((await s.call('GET', '/api/catalog', undefined, s.user)).body.rev > rev0)
  })
  T('painel de histórico, visão geral e exportação (backup) refletem as alterações', async s => {
    const c = await create(s, 'question', Q()); const ov = (await A(s)('GET', '/api/admin/overview')).body
    assert.equal(ov.totals.question, 525); assert.ok(ov.recent.some(h => h.id === c.item.id && h.type === 'criacao'))
    const ex = (await A(s)('GET', '/api/admin/export')).body; assert.ok(ex.items.some(x => x.id === c.item.id)); assert.ok(ex.items.length < 50, 'a exportação contém só o que difere do catálogo base')
    assert.ok((await A(s)('GET', '/api/admin/history')).body.history.length >= 1)
  })
}
