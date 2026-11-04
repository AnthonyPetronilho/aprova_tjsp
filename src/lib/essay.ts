// Checagem automática SIMPLES de pontos citados no edital (cap. XI). Não é correção nem nota: só chama atenção para padrões penalizáveis.
export interface Flag { id: string; level: 'atencao' | 'info'; text: string }
const words = (t: string) => t.toLowerCase().match(/[\p{L}\p{N}-]+/gu) ?? []
export const paragraphs = (t: string) => t.split(/\n+/).map(x => x.trim()).filter(Boolean)
const sentences = (p: string) => p.split(/[.!?]+(?:\s|$)/).map(x => x.trim()).filter(x => words(x).length >= 3)
// `\b` do JavaScript não reconhece letras acentuadas (ex.: "você"), então usamos limites de palavra com Unicode.
const W = (alt: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${alt})(?![\\p{L}\\p{N}])`, 'iu')
const FIRST = W('eu|meu|minha|meus|minhas|mim|comigo|me'), SECOND = W('você|vocês|tu|teu|tua|teus|tuas|vós|vosso|vossa')
const REF = W('textos?\\s+(?:i{1,3}|iv|[1-4])|primeiro texto|segundo texto|terceiro texto|coletânea|textos? (?:de apoio|motivadores?)|nesta prova|nesta proposta|como solicitado')
export function copiedShare(text: string, sources: string[], n = 6): number {
  const w = words(text); if (w.length < n) return 0
  const src = new Set<string>(); for (const s of sources) { const sw = words(s); for (let i = 0; i + n <= sw.length; i++) src.add(sw.slice(i, i + n).join(' ')) }
  const hit = new Array(w.length).fill(false)
  for (let i = 0; i + n <= w.length; i++) if (src.has(w.slice(i, i + n).join(' '))) for (let k = i; k < i + n; k++) hit[k] = true
  return hit.filter(Boolean).length / w.length
}
export function analyzeEssay(text: string, sources: string[]): { flags: Flag[]; words: number; paragraphs: number } {
  const w = words(text).length, ps = paragraphs(text), flags: Flag[] = []
  if (!w) return { flags, words: 0, paragraphs: 0 }
  if (w < 80) flags.push({ id: 'curto', level: 'atencao', text: 'Texto muito curto. Na prova manuscrita, 7 linhas ou menos (sem contar o título) resultam em nota 0, e é preciso ter pelo menos 8 linhas autorais seguidas.' })
  if (ps.length < 2) flags.push({ id: 'monobloco', level: 'atencao', text: 'Texto em um só bloco. O edital penaliza redação sem divisão em parágrafos (introdução, desenvolvimento e conclusão).' })
  else if (ps.length < 3) flags.push({ id: 'estrutura', level: 'info', text: 'Só 2 parágrafos: confira se há introdução, desenvolvimento e conclusão com posicionamento claro.' })
  const short = ps.filter(p => sentences(p).length <= 1).length
  if (ps.length >= 2 && short > ps.length / 2) flags.push({ id: 'periodo-unico', level: 'atencao', text: 'Predominam parágrafos de um único período. O edital cita como aspecto negativo a predominância de parágrafos muito curtos ou muito longos, de um só período.' })
  const f = text.match(FIRST), s2 = text.match(SECOND)
  if (f) flags.push({ id: 'primeira', level: 'atencao', text: `Possível uso de 1ª pessoa do singular (“${f[0]}”). O edital diz que pode ser penalizado; prefira linguagem impessoal.` })
  if (s2) flags.push({ id: 'segunda', level: 'atencao', text: `Possível uso de 2ª pessoa (“${s2[0]}”). O edital diz que pode ser penalizado.` })
  const r = text.match(REF)
  if (r) flags.push({ id: 'referencia', level: 'atencao', text: `Possível referência direta à prova ou à coletânea (“${r[0]}”). O texto deve ter autonomia, sem depender da consulta à proposta.` })
  const c = copiedShare(text, sources)
  if (c >= 0.25) flags.push({ id: 'copia', level: 'atencao', text: `Cerca de ${Math.round(c * 100)}% do texto repete trechos dos textos de apoio. Cópia predominante pode zerar a prova; reescreva com suas palavras.` })
  return { flags, words: w, paragraphs: ps.length }
}
