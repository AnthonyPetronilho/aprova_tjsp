// Fase 4 — Registro de auditoria do banco de questões.
//
// IMPORTANTE (leia antes de confiar em qualquer status):
//  • Este registro NÃO é o histórico de respostas do aluno (isso fica em progress/events).
//  • "revisao-ia-textual": leitura do enunciado, das alternativas, do gabarito e da explicação por IA, com base no conhecimento do modelo.
//    NÃO é conferência com texto oficial e NÃO é revisão humana.
//  • "conferencia-normativa": cotejo com a redação vigente de fonte oficial. Nesta fase NENHUMA questão a possui: Planalto, Câmara e TJSP
//    não puderam ser acessados (bloqueio de rede). Por isso nenhuma questão jurídica é 'validada'.
//  • "calculo-automatizado": a resposta foi recalculada por código (src/data/calc-checks.ts) e o teste automatizado confere o gabarito.
//  • "validacao-humana": reservada ao revisor humano; a IA nunca a atribui. Nenhuma questão a tem nesta fase.
import type { Question, Validation } from '../types'
import { RAW_QUESTIONS } from './questions-raw'
import { DISCIPLINES } from './edital'
import { CALC_CHECKS, NEW_CALC } from './calc-checks'
import { DOC_AUDIT_BY_ID, DOC_AUDIT_DATE } from './audit-docs'
import { REVISIONS } from './revisions'

export type AuditMethod = 'revisao-ia-textual' | 'conferencia-normativa' | 'calculo-automatizado' | 'validacao-humana'
export interface AuditRecord {
  id: string; discipline: string; topicId: string
  previous: Validation; proposed: Validation
  methods: AuditMethod[]; risk: 'baixo' | 'medio' | 'alto'
  issues: string[]; corrections: string[]; justification: string
  reference: string; auditedAt: string; verification: string; pendencies: string[]
}
export const AUDIT_DATE = '2026-11-06'
export const AUDIT_VERSION = 1

const discOfTopic = new Map<string, string>(); DISCIPLINES.forEach(d => d.topics.forEach(t => discOfTopic.set(t.id, d.name)))
const LEGAL = /^(dpenal|dpp|dpc|dconst|dadm|dint)/
const calc = new Map(CALC_CHECKS.map(c => [c.id, c]))
const newCalc = new Map(NEW_CALC.map(c => [c.id, c]))

// Achados manuais da revisão (por id). Só entram itens com motivo concreto.
const MANUAL: Record<string, { issues?: string[]; risk?: AuditRecord['risk']; pendencies?: string[] }> = {
  'adn-2': { risk: 'medio', issues: ['Conferência preliminar (diagnóstico 4B, Lei 10.261 p. 36) coincide com o gabarito, mas o PDF mistura redação antiga e nova; auditoria formal ainda não feita.'], pendencies: ['Auditar formalmente o art. 256, § 1º (texto vigente após LC 1.361/2021).'] },
  'nac-4': { risk: 'medio', issues: ['Depende da redação do art. 12, § 4º, dada pela EC 131/2023.'], pendencies: ['Conferir texto consolidado da CF/88.'] },
}

export function referenceOf(q: Question): string {
  const right = q.options.find(o => o.id === q.answer)!
  const m = (right.why + ' ' + q.stem).match(/(?:Arts?\.|Artigos?)\s*\d+[^.;,]*(?:,\s*[^.;]*?(?:§|inciso|parágrafo)[^.;]*)?|Súmula[^.;,]*|Res(?:olução)?\.?[^.;,]*\d+[^.;,]*/i)
  return m ? m[0].trim().slice(0, 120) : ''
}

function build(q: Question): AuditRecord {
  const right = q.options.find(o => o.id === q.answer)!
  const discipline = discOfTopic.get(q.topicId) || '?'
  const issues: string[] = []
  const L = q.options.map(o => o.text.length), mx = Math.max(...L)
  if (right.text.length === mx && right.text.length > 40 && right.text.length > 1.6 * (L.reduce((a, b) => a + b, 0) - mx) / (L.length - 1)) issues.push('Alternativa correta nitidamente mais longa que as demais (pista indevida de formato).')
  const short = q.options.filter(o => o.why.length < 25).length
  if (short) issues.push(`${short} explicação(ões) de alternativa muito curta(s).`)
  const legal = LEGAL.test(q.topicId)
  let reference = referenceOf(q)
  const pendencies: string[] = []
  let risk: AuditRecord['risk'] = 'baixo'
  const methods: AuditMethod[] = ['revisao-ia-textual']
  let proposed: Validation = 'pendente'
  let justification = 'Revisão textual por IA sem achados de erro conceitual; sem cotejo com fonte oficial, permanece Pendente.'
  let verification = 'Leitura integral do item (enunciado, 4-5 alternativas, gabarito, explicações) por IA em ' + AUDIT_DATE + '.'
  if (legal) {
    risk = /^(dadm|dint)/.test(q.topicId) ? 'alto' : 'medio'
    if (!reference) { issues.push('Sem referência explícita a dispositivo no enunciado nem na explicação.'); pendencies.push('Indicar o dispositivo legal.') }
    pendencies.push('Conferir redação vigente na fonte oficial (Planalto/ALESP/TJSP), com versão e data de consulta.')
    justification = 'Questão jurídica: sem acesso à fonte oficial nesta fase, a regra do projeto é manter Pendente.'
  } else if (q.topicId.startsWith('atual')) {
    risk = 'alto'; pendencies.push('Fato datado: reconferir em fonte oficial perto da prova.')
    justification = 'Atualidades dependem de data; permanece Pendente.'
  } else if (q.topicId.startsWith('info')) {
    risk = 'medio'; pendencies.push('Conferir versão do software/recurso citado.')
  } else if (q.topicId.startsWith('pt')) {
    risk = 'baixo'; pendencies.push('Revisão editorial humana de gramática normativa.')
  }
  const c = calc.get(q.id)
  if (c) {
    methods.push('calculo-automatizado'); proposed = 'validada'
    verification = 'Resposta recalculada por código (' + c.how + ') e comparada ao gabarito por teste automatizado; nenhuma outra alternativa tem o mesmo valor (exceto distratores equivalentes intencionais).'
    justification = 'Conteúdo determinístico: o cálculo foi conferido por código. Recomenda-se revisão editorial humana do enunciado.'
    reference = 'Recálculo: ' + c.how
    pendencies.push('Revisão editorial humana opcional (clareza do enunciado).')
  }
  const nc = newCalc.get(q.id)
  if (q.origin === 'autoral') {
    methods.push('calculo-automatizado'); proposed = 'pendente'; risk = 'baixo'
    verification = 'Questão autoral criada por IA em ' + AUDIT_DATE + '; resposta recalculada por código' + (nc ? ' (' + nc.how + ')' : '') + '.'
    justification = 'Questão nova de IA: regra da Fase 4 — nasce Pendente até revisão editorial humana, mesmo com cálculo conferido.'
    reference = nc ? 'Recálculo: ' + nc.how : ''
    pendencies.push('Revisão editorial humana (enunciado, qualidade dos distratores).')
  }
  const da = DOC_AUDIT_BY_ID[q.id]
  let corrections: string[] = []
  if (da) {
    methods.push('conferencia-normativa'); proposed = da.status
    verification = 'Conferência documental por IA (não humana) em ' + DOC_AUDIT_DATE + ' — ' + da.source + '; ' + da.provision + ', p. ' + da.pages + '. Edital: referência temporal 19/10/2026 informada pelo proprietário (comprovação independente pendente).'
    reference = da.provision + ' (p. ' + da.pages + ')'
    justification = da.status === 'validada'
      ? 'Enunciado, alternativas, gabarito e explicação conferidos com o texto da fonte; resposta única.'
      : 'Conferido com o texto compilado, mas a vigência na data do edital não está comprovada; permanece Pendente.'
    if (da.note) issues.push(da.note)
    pendencies.length = 0; pendencies.push(...(da.pendencies ?? []), 'Revisão humana não realizada.')
    corrections = REVISIONS.filter(r => r.id === q.id).map(r => `v${r.version} (${r.kind}): ${r.summary}`)
    risk = da.status === 'validada' ? 'baixo' : 'medio'
  }
  const man = MANUAL[q.id]
  if (man) { if (man.issues) issues.push(...man.issues); if (man.pendencies) pendencies.push(...man.pendencies); if (man.risk) risk = man.risk }
  return { id: q.id, discipline, topicId: q.topicId, previous: q.validation ?? 'pendente', proposed, methods, risk, issues, corrections, justification, reference, auditedAt: AUDIT_DATE, verification, pendencies }
}

export const AUDIT: Record<string, AuditRecord> = Object.fromEntries(RAW_QUESTIONS.map(q => [q.id, build(q)]))
export const auditOf = (id: string) => AUDIT[id]
