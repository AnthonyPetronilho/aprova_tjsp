// Fase 4 — Histórico de revisões de questões (separado do histórico de respostas do aluno).
// Política:
//  • Correção que NÃO muda o sentido/gabarito: mantém o ID e registra a revisão (kind 'correcao' ou 'complementacao').
//    O texto novo é aplicado por sobreposição (applyRevisions) e o texto anterior fica registrado em `previous`.
//  • Mudança de gabarito ou de sentido: a questão antiga é encerrada (kind 'substituicao', supersededBy = novo ID).
//    O ID antigo permanece no catálogo para que respostas, XP e simulados antigos não sejam reinterpretados;
//    ele só deixa de entrar em novas avaliações e no domínio. O XP histórico NUNCA é recalculado.
//  • invalidatesMastery: a revisão torna acertos anteriores inadequados como prova de domínio.
import type { Question } from '../types'
export interface QuestionRevision {
  id: string; version: number; date: string
  kind: 'correcao' | 'complementacao' | 'substituicao'
  summary: string; reason: string; source?: string
  /** Alterações aplicadas: texto de explicação ("why") por alternativa. Nunca altera enunciado, alternativas nem gabarito. */
  after?: { optionWhy?: Record<string, string> }
  previous?: { optionWhy?: Record<string, string> }
  supersededBy?: string; invalidatesMastery?: boolean
}
const D = '2026-11-06'
const LC = 'LC SP 1.111/2010 (ALESP, última atualização LC 1.441/2026), impresso em 06/11/2026'
export const REVISIONS: QuestionRevision[] = [
  { id: 'itt-5', version: 2, date: D, kind: 'correcao', invalidatesMastery: false,
    summary: 'Explicação da alternativa C citava um piso de 90 dias de revezamento que não existe mais.',
    reason: 'O piso "não inferior a 90 (noventa) dias" constava do art. 9º, V, na redação original; a Res. TJSP 864/2022 deu nova redação ao inciso V e o texto compilado não o contém. A alternativa continua errada e o gabarito (A) não muda.',
    source: 'Res. TJSP 850/2021, texto compilado (p. 4) e texto original (p. 16) — PDF do portal TJSP, impresso em 06/11/2026',
    previous: { optionWhy: { C: 'Errada: 90 dias é o prazo mínimo de revezamento.' } },
    after: { optionWhy: { C: 'Errada: o prazo é de 5 dias úteis (art. 19, § 1º). Os 90 dias eram o piso de revezamento da redação original do art. 9º, V, que a Res. 864/2022 retirou.' } } },
  { id: 'ilc-4', version: 2, date: D, kind: 'correcao', invalidatesMastery: false,
    summary: 'A explicação citava o art. 37-A para o percentual de 20%, que está no art. 37-B, I.',
    reason: 'O percentual do Doutor (20%) consta do art. 37-B, I, na redação da LC 1.441/2026 (antes, 12,5%); a vedação de cumulação está no art. 37-B, § 1º, e a não incorporação, no art. 37-A, § 4º. Gabarito (C) e percentuais não mudam.',
    source: LC + ' — p. 6 e 7',
    previous: { optionWhy: { C: 'Correta: Art. 37-A.' } },
    after: { optionWhy: { C: 'Correta: art. 37-B, I (redação da LC 1.441/2026): 20% para título de Doutor; não cumulativo (art. 37-B, § 1º) e sem incorporação (art. 37-A, § 4º).' } } },
  { id: 'itm-5', version: 2, date: D, kind: 'complementacao', summary: 'Referência precisada: art. 33, § 1º.', reason: 'O prazo de cinco dias está no § 1º do art. 33.', source: 'Res. TJSP 850/2021, texto compilado (p. 12)',
    previous: { optionWhy: { A: 'Correta: Art. 33.' } }, after: { optionWhy: { A: 'Correta: art. 33, § 1º (comunicação à Presidência no prazo de cinco dias).' } } },
  { id: 'ilr-1', version: 2, date: D, kind: 'complementacao', summary: 'Referência precisada: art. 14, I.', reason: 'O interstício de 1 ano consta do art. 14, I (redação da LC 1.217/2013); a redação anterior previa 2 anos.', source: LC + ' — p. 3',
    previous: { optionWhy: { D: 'Correta: Arts. 13 a 20.' } }, after: { optionWhy: { D: 'Correta: art. 14, I (redação da LC 1.217/2013): interstício mínimo de 1 ano de efetivo exercício no mesmo cargo e grau.' } } },
  { id: 'ilr-2', version: 2, date: D, kind: 'complementacao', summary: 'Referência precisada: arts. 18 e 26.', reason: 'O prazo de 30 dias corridos, a contar da publicação do resultado, consta do art. 18 (progressão) e do art. 26 (promoção).', source: LC + ' — p. 3 e 4',
    previous: { optionWhy: { B: 'Correta: Arts. 13 a 28.' } }, after: { optionWhy: { B: 'Correta: arts. 18 (progressão) e 26 (promoção): recurso ao Comitê de Recursos Humanos em até 30 dias corridos da publicação do resultado.' } } },
  { id: 'ilr-3', version: 2, date: D, kind: 'complementacao', summary: 'Referência precisada: art. 30, IV.', reason: 'A proporção de 70% para Diretor consta do art. 30, IV.', source: LC + ' — p. 4',
    previous: { optionWhy: { E: 'Correta: Arts. 29 a 33.' } }, after: { optionWhy: { E: 'Correta: art. 30, IV: 70% dos cargos de Diretor são reservados a servidores efetivos.' } } },
  { id: 'ilr-4', version: 2, date: D, kind: 'complementacao', summary: 'Referência precisada: art. 32, III.', reason: 'A exigência dos resultados finais positivos nos três últimos processos anuais consta do art. 32, III.', source: LC + ' — p. 4',
    previous: { optionWhy: { C: 'Correta: Arts. 29 a 33.' } }, after: { optionWhy: { C: 'Correta: art. 32, III: resultados finais positivos nos 3 últimos processos anuais de Avaliação de Desempenho.' } } },
  { id: 'ilr-5', version: 2, date: D, kind: 'complementacao', summary: 'Referência precisada: art. 21.', reason: 'A definição de Promoção consta do art. 21.', source: LC + ' — p. 4',
    previous: { optionWhy: { A: 'Correta: Arts. 21 a 28.' } }, after: { optionWhy: { A: 'Correta: art. 21: promoção é a passagem ao nível e grau imediatamente superiores, dentro da mesma referência.' } } },
]
export const supersededIds = (revs: QuestionRevision[] = REVISIONS): Set<string> => new Set(revs.filter(r => r.kind === 'substituicao' && r.supersededBy).map(r => r.id))
export const versionOf = (id: string, revs: QuestionRevision[] = REVISIONS): number => revs.filter(r => r.id === id).reduce((m, r) => Math.max(m, r.version), 1)
/** Aplica as revisões (somente explicações) por cima do texto-base. O gabarito, o enunciado e o texto das alternativas nunca mudam. */
export function applyRevisions(q: Question, revs: QuestionRevision[] = REVISIONS): Question {
  const mine = revs.filter(r => r.id === q.id && r.after?.optionWhy).sort((a, b) => a.version - b.version)
  if (!mine.length) return q
  const why: Record<string, string> = {}
  for (const r of mine) Object.assign(why, r.after!.optionWhy)
  return { ...q, options: q.options.map(o => (why[o.id] !== undefined ? { ...o, why: why[o.id] } : o)) }
}
