// Validação do formato dos documentos sincronizados. O servidor continua guardando o JSON como o app enviou,
// mas recusa dados que não tenham a forma esperada: um aparelho com dado corrompido não contamina os demais.
const DAY = /^\d{4}-\d{2}-\d{2}$/
const EV_TYPES = new Set(['ans', 'rev', 'les', 'sec', 'rwd', 'fav'])
const REWARD_KINDS = new Set(['q', 'les', 'rev', 'mock', 'mission'])
const OPT = new Set(['A', 'B', 'C', 'D', 'E'])
export const MAX_EVENTS = 150_000
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v)
const str = (v, max = 200) => typeof v === 'string' && v.length > 0 && v.length <= max
const num = v => typeof v === 'number' && Number.isFinite(v)

export function validateEvent(e) {
  if (!isObj(e)) return 'evento inválido'
  if (!str(e.id, 160)) return 'evento sem id'
  if (!EV_TYPES.has(e.t)) return `tipo de evento desconhecido: ${String(e.t).slice(0, 20)}`
  if (!str(e.at, 40)) return 'evento sem data/hora'
  if (typeof e.day !== 'string' || !DAY.test(e.day)) return 'evento com dia inválido'
  switch (e.t) {
    case 'ans': if (!str(e.qid) || !OPT.has(e.chosen) || typeof e.correct !== 'boolean') return 'resposta inválida'; break
    case 'rev': if (!str(e.card) || !Number.isInteger(e.rating) || e.rating < 0 || e.rating > 3) return 'revisão inválida'; break
    case 'les': if (!str(e.lid)) return 'aula inválida'; break
    case 'sec': if (!num(e.sec) || e.sec < 0 || e.sec > 86_400) return 'tempo de estudo inválido'; break
    case 'rwd': if (!REWARD_KINDS.has(e.kind) || !str(e.key) || !num(e.xp) || e.xp < 0 || e.xp > 1000) return 'recompensa inválida'; break
    case 'fav': if (!str(e.qid) || typeof e.on !== 'boolean') return 'favorito inválido'; break
  }
  return null
}

// devolve uma mensagem de erro (string) ou null se o documento é aceitável
export function validateProgress(d) {
  if (!isObj(d)) return 'O progresso precisa ser um objeto.'
  if (d.schemaVersion !== undefined && !Number.isInteger(d.schemaVersion)) return 'schemaVersion inválido.'
  if (d.schemaVersion > 2) return 'Versão de dados mais nova que a suportada pelo servidor.'
  if (!num(d.xp) || d.xp < 0) return 'xp inválido.'
  for (const k of ['completed', 'answers', 'cards', 'errors', 'notes', 'daily']) if (!isObj(d[k])) return `${k} precisa ser um objeto.`
  for (const k of ['studyDays', 'bonusDays', 'favorites', 'reviewLog', 'reviewXpDays', 'mocks', 'mockXpDays', 'essays']) if (!Array.isArray(d[k])) return `${k} precisa ser uma lista.`
  if (d.schemaVersion === 2) {
    if (!Array.isArray(d.events)) return 'events precisa ser uma lista.'
    if (d.events.length > MAX_EVENTS) return 'Eventos demais.'
    if (!isObj(d.base)) return 'base inválida.'
    if (!isObj(d.epoch) || !str(d.epoch.id, 100) || typeof d.epoch.at !== 'string') return 'época inválida.'
    const seen = new Set()
    for (const e of d.events) { const err = validateEvent(e); if (err) return err; if (seen.has(e.id)) return 'evento com id repetido.'; seen.add(e.id) }
  }
  return null
}
export function validateContent(d) {
  if (!isObj(d)) return 'O conteúdo precisa ser um objeto.'
  for (const k of ['lessons', 'questions', 'cards']) { if (!Array.isArray(d[k])) return `${k} precisa ser uma lista.`; if (d[k].some(x => !isObj(x) || !str(x.id))) return `${k} com item sem id.` }
  if (d.videos !== undefined && !isObj(d.videos)) return 'videos inválido.'
  if (d.deleted !== undefined && !isObj(d.deleted)) return 'deleted inválido.'
  return null
}
export const VALIDATORS = { progress: validateProgress, content: validateContent }
