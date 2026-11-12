// Fase 5 — catálogo editorial central (questões, aulas, flashcards).
// Modelo: o catálogo embutido no aplicativo continua sendo a BASE. O MongoDB guarda uma sobreposição (overlay): um registro por
// conteúdo, com versão (rev), situação de publicação, situação de validação, rascunho e o conteúdo publicado. O servidor entrega
// aos clientes só o que está PUBLICADO (GET /api/catalog). Rascunhos e conteúdo em revisão só aparecem nas rotas /api/admin.
// O progresso pessoal (eventos, XP, respostas) é outro domínio e nunca é tocado aqui.
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

export const PUB = ['rascunho', 'em-revisao', 'publicada', 'arquivada']
export const VALIDATIONS = ['pendente', 'precisa-correcao', 'precisa-complementacao', 'validada']
export const KINDS = ['question', 'lesson', 'card']
const OPT = ['A', 'B', 'C', 'D', 'E'], DIFF = ['Fácil', 'Médio', 'Difícil']
const REVIEW_KINDS = {
  administrador: 'Revisão pessoal do administrador (não é revisão por especialista)',
  'profissional-declarado': 'Revisão por profissional, DECLARADA pelo administrador (a plataforma não comprova a qualificação)',
}
export const loadSeed = () => JSON.parse(readFileSync(new URL('../data/catalog-seed.json', import.meta.url), 'utf8'))

export function seedEntries(seed, now = new Date().toISOString()) {
  const base = { rev: 1, origin: 'catalogo', pub: 'publicada', live: null, draft: null, supersededBy: null, replaces: null, createdAt: now, updatedAt: now, updatedBy: 'importacao' }
  return [
    ...seed.questions.map(q => ({ ...base, kind: 'question', id: q.id, baseTopic: q.topicId, validation: q.validation, validationSource: 'auditoria-ia', supersededBy: q.supersededBy ?? null })),
    ...seed.lessons.map(l => ({ ...base, kind: 'lesson', id: l.id, baseTopic: l.topicId, validation: null, validationSource: null })),
    ...seed.cards.map(c => ({ ...base, kind: 'card', id: c.id, baseTopic: c.topicId, baseLesson: c.lessonId, validation: null, validationSource: null })),
  ]
}

// ---------- validação estrita das entradas (o mesmo critério vale para rascunho, revisão e publicação)
const TAG = /<\s*\/?\s*[a-z!?]/i
function text(v, label, min, max, errs, { optional = false } = {}) {
  if (v === undefined || v === null || v === '') { if (!optional) errs.push(`${label}: obrigatório.`); return undefined }
  if (typeof v !== 'string') { errs.push(`${label}: precisa ser texto.`); return undefined }
  const s = v.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
  if (s.length < min) errs.push(`${label}: mínimo de ${min} caracteres.`)
  if (s.length > max) errs.push(`${label}: máximo de ${max} caracteres.`)
  if (TAG.test(s)) errs.push(`${label}: não use marcações HTML (o conteúdo é exibido como texto simples).`)
  return s
}
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v)
const onlyKeys = (o, allowed, errs, label) => { for (const k of Object.keys(o)) if (!allowed.includes(k)) errs.push(`${label}: campo não permitido "${k.slice(0, 30)}".`) }

export function normQuestion(d, seed) {
  const errs = []; if (!isObj(d)) return { errs: ['Questão inválida.'] }
  onlyKeys(d, ['topicId', 'stem', 'options', 'answer', 'difficulty', 'ref'], errs, 'Questão')
  if (!seed.topics.includes(d.topicId)) errs.push('Assunto do edital inválido.')
  const stem = text(d.stem, 'Enunciado', 15, 2500, errs)
  let options = []
  if (!Array.isArray(d.options) || d.options.length !== 5) errs.push('A questão precisa de exatamente 5 alternativas (A a E).')
  else {
    options = d.options.map((o, i) => {
      if (!isObj(o) || o.id !== OPT[i]) { errs.push(`Alternativa ${OPT[i]}: id inesperado.`); return { id: OPT[i], text: '', why: '' } }
      return { id: o.id, text: text(o.text, `Alternativa ${o.id}`, 1, 700, errs) ?? '', why: text(o.why, `Explicação da alternativa ${o.id}`, 3, 1500, errs) ?? '' }
    })
    const t = options.map(o => o.text.toLowerCase()).filter(Boolean); if (new Set(t).size !== t.length) errs.push('Há alternativas com texto repetido.')
  }
  if (!OPT.includes(d.answer)) errs.push('Gabarito inválido.')
  if (!DIFF.includes(d.difficulty)) errs.push('Dificuldade inválida.')
  const ref = text(d.ref, 'Referência', 0, 600, errs, { optional: true })
  return errs.length ? { errs } : { data: { topicId: d.topicId, stem, options, answer: d.answer, difficulty: d.difficulty, ...(ref ? { ref } : {}) } }
}
// Correção de uma questão do catálogo base: só explicações e referência. Enunciado, alternativas e gabarito mudam por SUBSTITUIÇÃO.
export function normQuestionPatch(d) {
  const errs = []; if (!isObj(d)) return { errs: ['Alteração inválida.'] }
  for (const k of Object.keys(d)) if (!['optionWhy', 'ref'].includes(k)) errs.push(`Em questões do catálogo base só é possível corrigir explicações e referência. "${k.slice(0, 30)}" muda o sentido da questão: use a substituição.`)
  const out = {}
  if (d.optionWhy !== undefined) {
    if (!isObj(d.optionWhy)) errs.push('optionWhy inválido.')
    else { out.optionWhy = {}; for (const [k, v] of Object.entries(d.optionWhy)) { if (!OPT.includes(k)) { errs.push(`Alternativa desconhecida: ${k.slice(0, 5)}.`); continue } const t = text(v, `Explicação da alternativa ${k}`, 3, 1500, errs); if (t) out.optionWhy[k] = t } }
  }
  const ref = text(d.ref, 'Referência', 0, 600, errs, { optional: true }); if (ref) out.ref = ref
  if (!errs.length && !Object.keys(out).length) errs.push('Nenhuma alteração informada.')
  return errs.length ? { errs } : { data: out }
}
const STEP_KEYS = ['title', 'body', 'alt', 'quotes', 'table']
export function normLesson(d, seed, hasQuestion) {
  const errs = []; if (!isObj(d)) return { errs: ['Aula inválida.'] }
  onlyKeys(d, ['topicId', 'title', 'steps', 'questionIds'], errs, 'Aula')
  if (!seed.topics.includes(d.topicId)) errs.push('Assunto do edital inválido.')
  const title = text(d.title, 'Título', 3, 200, errs)
  const steps = []
  if (!Array.isArray(d.steps) || d.steps.length < 1 || d.steps.length > 40) errs.push('A aula precisa de 1 a 40 etapas.')
  else d.steps.forEach((s, i) => {
    const L = `Etapa ${i + 1}`
    if (!isObj(s)) { errs.push(`${L}: inválida.`); return }
    onlyKeys(s, STEP_KEYS, errs, L)
    const st = { title: text(s.title, `${L}: título`, 1, 200, errs) ?? '', body: [] }
    if (!Array.isArray(s.body) || s.body.length < 1 || s.body.length > 30) errs.push(`${L}: o texto precisa de 1 a 30 parágrafos.`)
    else st.body = s.body.map((b, j) => text(b, `${L}, parágrafo ${j + 1}`, 1, 4000, errs) ?? '')
    const alt = text(s.alt, `${L}: alternativa`, 0, 2000, errs, { optional: true }); if (alt) st.alt = alt
    if (s.quotes !== undefined) {
      if (!Array.isArray(s.quotes) || s.quotes.length > 20) errs.push(`${L}: citações inválidas.`)
      else st.quotes = s.quotes.map((q, j) => ({ ref: text(q?.ref, `${L}, citação ${j + 1} (referência)`, 1, 300, errs) ?? '', text: text(q?.text, `${L}, citação ${j + 1}`, 1, 3000, errs) ?? '' }))
    }
    if (s.table !== undefined) {
      const t = s.table
      if (!isObj(t) || !Array.isArray(t.head) || !Array.isArray(t.rows) || t.head.length < 1 || t.head.length > 8 || t.rows.length > 60) errs.push(`${L}: tabela inválida.`)
      else {
        const cap = text(t.caption, `${L}: legenda da tabela`, 0, 300, errs, { optional: true })
        const head = t.head.map(h => text(h, `${L}: cabeçalho da tabela`, 1, 200, errs) ?? '')
        const rows = t.rows.map(r => { if (!Array.isArray(r) || r.length !== head.length) { errs.push(`${L}: linha da tabela com número de colunas diferente do cabeçalho.`); return [] } return r.map(c => text(c, `${L}: célula da tabela`, 0, 1000, errs, { optional: true }) ?? '') })
        st.table = { ...(cap ? { caption: cap } : {}), head, rows }
      }
    }
    steps.push(st)
  })
  const qids = Array.isArray(d.questionIds) ? d.questionIds : []
  if (!Array.isArray(d.questionIds) && d.questionIds !== undefined) errs.push('questionIds precisa ser uma lista.')
  if (qids.length > 200) errs.push('Questões vinculadas demais.')
  for (const q of qids) if (typeof q !== 'string' || !hasQuestion(q)) errs.push(`Questão vinculada inexistente: ${String(q).slice(0, 40)}.`)
  return errs.length ? { errs } : { data: { topicId: d.topicId, title, steps, questionIds: [...new Set(qids)] } }
}
export function normCard(d, seed, hasLesson) {
  const errs = []; if (!isObj(d)) return { errs: ['Flashcard inválido.'] }
  onlyKeys(d, ['topicId', 'front', 'back', 'lessonId'], errs, 'Flashcard')
  if (!seed.topics.includes(d.topicId)) errs.push('Assunto do edital inválido.')
  const front = text(d.front, 'Frente', 3, 1000, errs), back = text(d.back, 'Verso', 3, 2000, errs)
  if (typeof d.lessonId !== 'string' || !hasLesson(d.lessonId)) errs.push('Aula vinculada inexistente.')
  return errs.length ? { errs } : { data: { topicId: d.topicId, front, back, lessonId: d.lessonId } }
}

const sameQuestionMeaning = (a, b) => a && b && a.stem === b.stem && a.answer === b.answer && a.topicId === b.topicId && JSON.stringify(a.options.map(o => [o.id, o.text])) === JSON.stringify(b.options.map(o => [o.id, o.text]))
const hashId = s => createHash('sha256').update(String(s)).digest('hex').slice(0, 12)
const snap = r => ({ pub: r.pub, validation: r.validation, live: r.live ?? null, draft: r.draft ?? null, supersededBy: r.supersededBy ?? null })
export const estado = r => (r.draft ? r.draft.state : r.pub)  // situação exibida: rascunho/em revisão (edição pendente) ou publicada/arquivada
const PREFIX = { question: 'q', lesson: 'l', card: 'c' }

export function mountEditorial(app, { repo, requireAdmin, auth, wrap, seed, limiter }) {
  const init = repo.edInit(seedEntries(seed)).then(n => ({ inserted: n }))
  app.locals.editorialReady = init
  const ready = wrap(async (_req, _res, next) => { await init; next() })
  const kindOk = (req, res, next) => (KINDS.includes(req.params.kind) ? next() : res.status(404).json({ error: 'Tipo de conteúdo desconhecido.' }))
  const bodyRev = (req, res) => (Number.isInteger(req.body?.baseRev) && req.body.baseRev >= 1 ? req.body.baseRev : (res.status(400).json({ error: 'Informe baseRev (versão em que a edição se baseou).' }), null))
  const reason = (req, res, min = 5) => { const r = typeof req.body?.reason === 'string' ? req.body.reason.trim() : ''; if (r.length < min || r.length > 500) { res.status(400).json({ error: `Justificativa obrigatória (${min} a 500 caracteres).` }); return null } return r }
  const conflict = (res, cur) => res.status(409).json({ error: 'Outro administrador alterou este conteúdo depois que você o abriu. Nada foi sobrescrito: recarregue, confira a versão atual e refaça a edição.', current: cur })
  // validação síncrona usa conjuntos pré-carregados
  async function sets() { const all = await repo.edList(); return { q: new Set(all.filter(x => x.kind === 'question').map(x => x.id)), l: new Set(all.filter(x => x.kind === 'lesson').map(x => x.id)), all } }
  const normFor = async (rec, data) => {
    const S = await sets()
    if (rec.kind === 'question') return rec.origin === 'catalogo' ? normQuestionPatch(data) : normQuestion(data, seed)
    if (rec.kind === 'lesson') { const r = normLesson(data, seed, id => S.q.has(id)); if (r.data && rec.origin === 'catalogo' && r.data.topicId !== rec.baseTopic) return { errs: ['O assunto de uma aula do catálogo não pode ser alterado.'] }; return r }
    const r = normCard(data, seed, id => S.l.has(id)); if (r.data && rec.origin === 'catalogo' && (r.data.topicId !== rec.baseTopic || r.data.lessonId !== rec.baseLesson)) return { errs: ['Assunto e aula de um flashcard do catálogo não podem ser alterados (preserva os registros de revisão).'] }
    return r
  }
  const hist = (rec, type, by, why, before, extra = {}) => ({ kind: rec.kind, id: rec.id, at: new Date().toISOString(), by, type, reason: why, before, after: snap(rec), refs: extra.refs ?? null, affectsCatalog: !!extra.affectsCatalog, ...(extra.review ? { review: extra.review } : {}) })
  const view = r => ({ ...r, estado: estado(r) })

  const A = [...requireAdmin, ready]
  const writeLimit = limiter

  app.get('/api/admin/overview', ...A, wrap(async (_req, res) => {
    const all = await repo.edList(), cnt = (f, key) => all.filter(f).reduce((m, x) => { const k = key(x); m[k] = (m[k] || 0) + 1; return m }, {})
    const qs = all.filter(x => x.kind === 'question')
    res.json({
      catalogRev: await repo.edCatalogRev(),
      totals: { question: qs.length, lesson: all.filter(x => x.kind === 'lesson').length, card: all.filter(x => x.kind === 'card').length },
      validation: cnt(x => x.kind === 'question', x => x.validation),
      publication: { question: cnt(x => x.kind === 'question', estado), lesson: cnt(x => x.kind === 'lesson', estado), card: cnt(x => x.kind === 'card', estado) },
      humanReviewed: qs.filter(x => x.validationSource && x.validationSource !== 'auditoria-ia').length,
      recent: await repo.edRecent(15),
    })
  }))
  app.get('/api/admin/items', ...A, wrap(async (_req, res) => { res.json({ catalogRev: await repo.edCatalogRev(), items: (await repo.edList()).map(view) }) }))
  app.get('/api/admin/items/:kind/:id', ...A, kindOk, wrap(async (req, res) => {
    const r = await repo.edGet(req.params.kind, req.params.id); if (!r) return res.status(404).json({ error: 'Conteúdo não encontrado.' })
    res.json({ item: view(r), history: await repo.edHistory(r.kind, r.id) })
  }))
  app.get('/api/admin/history', ...A, wrap(async (_req, res) => { res.json({ history: await repo.edRecent(100) }) }))
  app.get('/api/admin/export', ...A, wrap(async (_req, res) => { res.json({ app: 'aprova-tjsp-editorial', exportedAt: new Date().toISOString(), catalogRev: await repo.edCatalogRev(), items: (await repo.edList()).filter(x => x.live || x.draft || x.origin === 'admin' || (x.kind === 'question' && x.validationSource !== 'auditoria-ia') || x.pub === 'arquivada' || x.supersededBy) }) }))
  // Importação idempotente do catálogo base (já roda na inicialização). Só insere o que não existe; nunca altera registros existentes.
  app.post('/api/admin/import', ...A, writeLimit, wrap(async (_req, res) => { res.json({ inserted: await repo.edInit(seedEntries(seed)) }) }))

  // criar conteúdo novo (nasce como rascunho). clientKey torna a operação idempotente: repetir a requisição devolve o mesmo item.
  app.post('/api/admin/items/:kind', ...A, writeLimit, kindOk, wrap(async (req, res) => {
    const kind = req.params.kind, key = typeof req.body?.clientKey === 'string' ? req.body.clientKey : ''
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(key)) return res.status(400).json({ error: 'clientKey inválido.' })
    const why = reason(req, res, 3); if (!why) return
    const id = `adm-${PREFIX[kind]}-${hashId(key)}`
    const stub = { kind, id, origin: 'admin' }
    const n = await normFor(stub, req.body.data); if (n.errs) return res.status(422).json({ error: 'Conteúdo inválido.', details: n.errs })
    const now = new Date().toISOString(), by = req.user.email
    const rec = { kind, id, rev: 1, origin: 'admin', pub: 'rascunho', live: null, draft: { data: n.data, state: 'rascunho', by, at: now, reason: why }, validation: kind === 'question' ? 'pendente' : null, validationSource: kind === 'question' ? 'nenhuma' : null, supersededBy: null, replaces: null, createdAt: now, updatedAt: now, updatedBy: by }
    const r = await repo.edCreate(rec, hist(rec, 'criacao', by, why, null))
    if (r.dup) return res.status(200).json({ item: view(r.current), duplicate: true })
    res.status(201).json({ item: view(r.rec) })
  }))

  // salvar rascunho (edição). Não muda o que os estudantes veem.
  app.put('/api/admin/items/:kind/:id/draft', ...A, writeLimit, kindOk, wrap(async (req, res) => {
    const baseRev = bodyRev(req, res); if (!baseRev) return; const why = reason(req, res); if (!why) return
    const rec = await repo.edGet(req.params.kind, req.params.id); if (!rec) return res.status(404).json({ error: 'Conteúdo não encontrado.' })
    if (rec.rev !== baseRev) return conflict(res, view(rec))
    if (rec.pub === 'arquivada' && !rec.draft) return res.status(409).json({ error: 'Conteúdo arquivado: reative-o antes de editar.' })
    if (rec.supersededBy) return res.status(409).json({ error: 'Esta questão foi substituída; edite a questão nova.' })
    const n = await normFor(rec, req.body.data); if (n.errs) return res.status(422).json({ error: 'Conteúdo inválido.', details: n.errs })
    // questão já publicada: mudança de enunciado/alternativas/gabarito muda o sentido → substituição
    if (rec.kind === 'question' && rec.origin === 'admin' && rec.live && !sameQuestionMeaning(rec.live, { ...rec.live, ...n.data }) ) return res.status(422).json({ error: 'Esta questão já foi publicada. Mudar enunciado, alternativas ou gabarito altera o sentido: use "Substituir questão" (o ID anterior continua rastreável).' })
    const before = snap(rec), now = new Date().toISOString(), by = req.user.email
    const draft = { data: n.data, state: 'rascunho', by, at: now, reason: why }
    const r = await repo.edUpdate(rec.kind, rec.id, baseRev, { draft, updatedAt: now, updatedBy: by }, hist({ ...rec, draft }, 'edicao-rascunho', by, why, before, { refs: req.body.refs ?? null }))
    if (r.conflict) return conflict(res, view(r.current))
    res.json({ item: view(r.rec) })
  }))

  // mudança de situação: rascunho ⇄ em revisão; publicar; arquivar; reativar
  app.post('/api/admin/items/:kind/:id/state', ...A, writeLimit, kindOk, wrap(async (req, res) => {
    const baseRev = bodyRev(req, res); if (!baseRev) return; const why = reason(req, res); if (!why) return
    const to = req.body.to, rec = await repo.edGet(req.params.kind, req.params.id); if (!rec) return res.status(404).json({ error: 'Conteúdo não encontrado.' })
    if (rec.rev !== baseRev) return conflict(res, view(rec))
    const before = snap(rec), now = new Date().toISOString(), by = req.user.email
    let fields, type, affects = false
    if (to === 'em-revisao' || to === 'rascunho') {
      if (!rec.draft) return res.status(409).json({ error: 'Não há edição pendente para encaminhar.' })
      fields = { draft: { ...rec.draft, state: to, by, at: now }, updatedAt: now, updatedBy: by }; type = to === 'em-revisao' ? 'envio-revisao' : 'volta-rascunho'
    } else if (to === 'publicada') {
      if (rec.supersededBy) return res.status(409).json({ error: 'Esta questão foi substituída e não pode voltar ao pool ativo.' })
      if (rec.pub === 'arquivada' && !rec.draft) {
        fields = { pub: 'publicada', updatedAt: now, updatedBy: by }; type = 'reativacao'; affects = true
      } else {
        if (!rec.draft) return res.status(409).json({ error: 'Não há edição pendente para publicar.' })
        if (req.body.confirmReviewed !== true && rec.draft.state !== 'em-revisao') return res.status(400).json({ error: 'Para publicar direto do rascunho, confirme que conferiu o conteúdo (confirmReviewed).' })
        const n = await normFor(rec, rec.draft.data); if (n.errs) return res.status(422).json({ error: 'Conteúdo inválido para publicação.', details: n.errs })
        if (rec.kind === 'question' && rec.validation === 'precisa-correcao') return res.status(422).json({ error: 'Questão com erro confirmado (precisa de correção) não pode ser publicada. Corrija e registre a nova validação, ou substitua a questão.' })
        fields = { pub: 'publicada', live: n.data, draft: null, updatedAt: now, updatedBy: by }; type = 'publicacao'; affects = true
        if (rec.kind === 'question' && rec.validation === 'validada' && req.body.keepValidation !== true) { fields.validation = 'pendente'; fields.validationSource = 'reaberta-por-edicao'; fields.validationNote = 'Conteúdo alterado e publicado: a validação anterior foi reaberta (pendente). Para manter, publique com keepValidation e justificativa.' }
      }
    } else if (to === 'arquivada') {
      if (rec.pub === 'rascunho') return res.status(409).json({ error: 'Rascunho nunca publicado: descarte a edição em vez de arquivar.' })
      fields = { pub: 'arquivada', updatedAt: now, updatedBy: by }; type = 'arquivamento'; affects = true
    } else return res.status(400).json({ error: 'Situação desconhecida.' })
    const next = { ...rec, ...fields }
    let r = await repo.edUpdate(rec.kind, rec.id, baseRev, fields, hist(next, type, by, why, before, { affectsCatalog: affects }))
    if (r.conflict) return conflict(res, view(r.current))
    // se esta publicação substitui outra questão, encerra a antiga (idempotente; o ID antigo continua no catálogo)
    if (type === 'publicacao' && rec.replaces) {
      for (let i = 0; i < 3; i++) {
        const old = await repo.edGet('question', rec.replaces); if (!old || old.supersededBy === rec.id) break
        const o = await repo.edUpdate('question', old.id, old.rev, { supersededBy: rec.id, updatedAt: now, updatedBy: by }, hist({ ...old, supersededBy: rec.id }, 'substituicao', by, `Substituída por ${rec.id}: ${why}`, snap(old), { affectsCatalog: true }))
        if (!o.conflict) break
      }
    }
    res.json({ item: view(r.rec) })
  }))

  // descartar a edição pendente (volta ao conteúdo publicado)
  app.delete('/api/admin/items/:kind/:id/draft', ...A, writeLimit, kindOk, wrap(async (req, res) => {
    const baseRev = bodyRev(req, res); if (!baseRev) return; const why = reason(req, res); if (!why) return
    const rec = await repo.edGet(req.params.kind, req.params.id); if (!rec) return res.status(404).json({ error: 'Conteúdo não encontrado.' })
    if (rec.rev !== baseRev) return conflict(res, view(rec))
    if (!rec.draft) return res.status(409).json({ error: 'Não há edição pendente.' })
    if (rec.pub === 'rascunho') return res.status(409).json({ error: 'Item novo ainda não publicado: arquive/ignore em vez de descartar (o histórico é preservado).' })
    const now = new Date().toISOString(), by = req.user.email
    const r = await repo.edUpdate(rec.kind, rec.id, baseRev, { draft: null, updatedAt: now, updatedBy: by }, hist({ ...rec, draft: null }, 'descarte-rascunho', by, why, snap(rec)))
    if (r.conflict) return conflict(res, view(r.current)); res.json({ item: view(r.rec) })
  }))

  // validação de conteúdo (questões). Revisão humana é sempre uma ação autenticada, rastreável e rotulada.
  app.post('/api/admin/items/question/:id/validation', ...A, writeLimit, wrap(async (req, res) => {
    const baseRev = bodyRev(req, res); if (!baseRev) return
    const { validation, reviewKind, note, reference } = req.body ?? {}
    if (!VALIDATIONS.includes(validation)) return res.status(400).json({ error: 'Situação de validação inválida.' })
    if (!Object.hasOwn(REVIEW_KINDS, reviewKind)) return res.status(400).json({ error: 'Informe o tipo de revisão: administrador ou profissional-declarado.' })
    const errs = []; const n = text(note, 'Observação', 10, 1000, errs), ref = text(reference, 'Fonte/dispositivo conferido', validation === 'validada' ? 3 : 0, 500, errs, { optional: validation !== 'validada' })
    if (errs.length) return res.status(422).json({ error: 'Dados da revisão inválidos.', details: errs })
    const rec = await repo.edGet('question', req.params.id); if (!rec) return res.status(404).json({ error: 'Questão não encontrada.' })
    if (rec.rev !== baseRev) return conflict(res, view(rec))
    const now = new Date().toISOString(), by = req.user.email
    const fields = { validation, validationSource: reviewKind === 'administrador' ? 'revisao-humana-administrador' : 'revisao-profissional-declarada', validationNote: n, validationRef: ref ?? null, validationBy: by, validationAt: now, updatedAt: now, updatedBy: by }
    const review = { kind: reviewKind, label: REVIEW_KINDS[reviewKind], validation, note: n, reference: ref ?? null }
    const r = await repo.edUpdate('question', rec.id, baseRev, fields, hist({ ...rec, ...fields }, 'validacao', by, n, snap(rec), { affectsCatalog: true, review, refs: ref ?? null }))
    if (r.conflict) return conflict(res, view(r.current)); res.json({ item: view(r.rec) })
  }))

  // substituição: cria a questão nova (rascunho). Quando ela for publicada, a antiga sai do pool; o ID antigo permanece no catálogo.
  app.post('/api/admin/items/question/:id/replace', ...A, writeLimit, wrap(async (req, res) => {
    const baseRev = bodyRev(req, res); if (!baseRev) return; const why = reason(req, res, 10); if (!why) return
    const key = typeof req.body?.clientKey === 'string' ? req.body.clientKey : ''; if (!/^[A-Za-z0-9_-]{8,64}$/.test(key)) return res.status(400).json({ error: 'clientKey inválido.' })
    const old = await repo.edGet('question', req.params.id); if (!old) return res.status(404).json({ error: 'Questão não encontrada.' })
    if (old.rev !== baseRev) return conflict(res, view(old))
    if (old.supersededBy) return res.status(409).json({ error: `Esta questão já foi substituída por ${old.supersededBy}.` })
    const n = normQuestion(req.body.question, seed); if (n.errs) return res.status(422).json({ error: 'Questão nova inválida.', details: n.errs })
    const now = new Date().toISOString(), by = req.user.email, id = `adm-q-${hashId(key)}`
    const rec = { kind: 'question', id, rev: 1, origin: 'admin', pub: 'rascunho', live: null, draft: { data: n.data, state: 'rascunho', by, at: now, reason: why }, validation: 'pendente', validationSource: 'nenhuma', supersededBy: null, replaces: old.id, createdAt: now, updatedAt: now, updatedBy: by }
    const r = await repo.edCreate(rec, hist(rec, 'criacao', by, `Substitui ${old.id}: ${why}`, null, { refs: old.id }))
    res.status(r.dup ? 200 : 201).json({ item: view(r.rec ?? r.current), duplicate: !!r.dup })
  }))

  // recuperar uma versão anterior como NOVO rascunho (nada é apagado; é preciso publicar de novo)
  app.post('/api/admin/items/:kind/:id/restore', ...A, writeLimit, kindOk, wrap(async (req, res) => {
    const baseRev = bodyRev(req, res); if (!baseRev) return; const why = reason(req, res); if (!why) return
    const ver = req.body?.version; if (!Number.isInteger(ver) || ver < 1) return res.status(400).json({ error: 'Informe a versão a recuperar.' })
    const rec = await repo.edGet(req.params.kind, req.params.id); if (!rec) return res.status(404).json({ error: 'Conteúdo não encontrado.' })
    if (rec.rev !== baseRev) return conflict(res, view(rec))
    const h = (await repo.edHistory(rec.kind, rec.id)).find(x => x.rev === ver); if (!h) return res.status(404).json({ error: 'Versão não encontrada no histórico.' })
    const data = h.after?.draft?.data ?? h.after?.live
    if (!data) return res.status(409).json({ error: 'Essa versão não contém conteúdo editável para recuperar.' })
    const n = await normFor(rec, data); if (n.errs) return res.status(422).json({ error: 'A versão recuperada não passa mais na validação atual.', details: n.errs })
    if (rec.kind === 'question' && rec.origin === 'admin' && rec.live && !sameQuestionMeaning(rec.live, { ...rec.live, ...n.data })) return res.status(422).json({ error: 'A versão recuperada altera o sentido da questão publicada: use a substituição.' })
    const now = new Date().toISOString(), by = req.user.email, draft = { data: n.data, state: 'rascunho', by, at: now, reason: `Recuperada da versão ${ver}: ${why}` }
    const r = await repo.edUpdate(rec.kind, rec.id, baseRev, { draft, updatedAt: now, updatedBy: by }, hist({ ...rec, draft }, 'restauracao', by, `Versão ${ver}: ${why}`, snap(rec)))
    if (r.conflict) return conflict(res, view(r.current)); res.json({ item: view(r.rec) })
  }))

  // ---- catálogo efetivo para os clientes: SOMENTE o publicado (sem rascunhos, sem e-mails de administradores, sem justificativas)
  const catalogView = async () => {
    const all = await repo.edList(), rev = await repo.edCatalogRev(), out = { rev, questions: [], lessons: [], cards: [] }
    for (const r of all) {
      if (r.pub === 'rascunho') continue   // item novo ainda não publicado
      const row = { id: r.id, origin: r.origin }
      if (r.pub === 'arquivada') row.archived = true
      if (r.supersededBy) row.supersededBy = r.supersededBy
      if (r.kind === 'question') {
        if (r.validationSource && !['auditoria-ia', 'nenhuma'].includes(r.validationSource)) row.validation = r.validation
        else if (r.origin === 'admin') row.validation = r.validation
        if (r.live) row.live = r.live
        if (r.origin === 'admin' && r.live == null && !row.archived) continue
        if (!row.live && !row.archived && !row.supersededBy && row.validation === undefined) continue
        out.questions.push(row)
      } else {
        if (r.live) row.live = r.live
        if (!row.live && !row.archived) continue
        ;(r.kind === 'lesson' ? out.lessons : out.cards).push(row)
      }
    }
    return out
  }
  app.get('/api/catalog', auth, ready, wrap(async (req, res) => {
    const c = await catalogView(), etag = `W/"cat-${c.rev}"`
    res.set('ETag', etag).set('Cache-Control', 'private, no-cache')
    if (req.headers['if-none-match'] === etag) return res.status(304).end()
    res.json(c)
  }))
}
