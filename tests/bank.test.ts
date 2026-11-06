// Fase 4 — testes ESTRUTURAIS do banco de questões. Passar aqui NÃO significa que o conteúdo jurídico foi validado.
import { describe, it, expect } from 'vitest'
import { QUESTIONS } from '../src/data/questions'
import { RAW_QUESTIONS } from '../src/data/questions-raw'
import { DISCIPLINES } from '../src/data/edital'
import { AUDIT } from '../src/data/audit'
import { CALC_CHECKS, NEW_CALC } from '../src/data/calc-checks'
import { numbersOf } from '../src/lib/numparse'
import { supersededIds, versionOf, REVISIONS, applyRevisions } from '../src/data/revisions'
import { DOC_AUDIT, DOC_AUDIT_BY_ID } from '../src/data/audit-docs'
import { poolOf } from '../src/lib/learning'
import type { Validation } from '../src/types'

const topicIds = new Set(DISCIPLINES.flatMap(d => d.topics.map(t => t.id)))
const VALS: Validation[] = ['pendente', 'precisa-correcao', 'precisa-complementacao', 'validada']

describe('integridade estrutural do banco', () => {
  it('IDs únicos', () => { const ids = QUESTIONS.map(q => q.id); expect(new Set(ids).size).toBe(ids.length) })
  it('todo assunto referenciado existe no edital', () => { expect(QUESTIONS.filter(q => !topicIds.has(q.topicId)).map(q => q.id)).toEqual([]) })
  it('4 ou 5 alternativas, ids distintos, texto e explicação não vazios', () => {
    for (const q of QUESTIONS) {
      expect([4, 5]).toContain(q.options.length)
      expect(new Set(q.options.map(o => o.id)).size).toBe(q.options.length)
      for (const o of q.options) { expect(o.text.trim().length, q.id).toBeGreaterThan(0); expect(o.why.trim().length, q.id).toBeGreaterThan(0) }
    }
  })
  it('gabarito aponta para uma alternativa existente', () => { for (const q of QUESTIONS) expect(q.options.some(o => o.id === q.answer), q.id).toBe(true) })
  it('sem questão duplicada (mesmo enunciado e mesmas alternativas)', () => {
    const k = (q: typeof QUESTIONS[number]) => q.stem.trim().toLowerCase() + '|' + q.options.map(o => o.text.trim().toLowerCase()).sort().join('|')
    const seen = new Map<string, string>(); const dup: string[] = []
    for (const q of QUESTIONS) { const key = k(q); if (seen.has(key)) dup.push(q.id + '=' + seen.get(key)); else seen.set(key, q.id) }
    expect(dup).toEqual([])
  })
  it('status de catálogo é um dos 4 valores compatíveis com o campo simples', () => { for (const q of QUESTIONS) expect(VALS).toContain(q.validation) })
  it('questões de IA nunca nascem validadas sem método registrado', () => {
    for (const q of QUESTIONS.filter(q => q.validation === 'validada')) {
      const a = AUDIT[q.id]
      expect(a.methods.some(m => m === 'calculo-automatizado' || m === 'conferencia-normativa' || m === 'validacao-humana'), q.id).toBe(true)
    }
  })
  it('a IA não atribui validação humana; conferência normativa só onde há registro documental', () => {
    expect(Object.values(AUDIT).filter(a => a.methods.includes('validacao-humana'))).toEqual([])
    expect(Object.values(AUDIT).filter(a => a.methods.includes('conferencia-normativa')).map(a => a.id).sort()).toEqual(DOC_AUDIT.map(d => d.id).sort())
  })
  it('questão jurídica/legislação interna só é validada com registro documental completo (fonte, dispositivo, página, trecho)', () => {
    const jur = QUESTIONS.filter(q => /^(dpenal|dpp|dpc|dconst|dadm|dint|atual)/.test(q.topicId) && q.validation === 'validada')
    expect(jur.length).toBeGreaterThan(0)
    for (const q of jur) {
      const d = DOC_AUDIT_BY_ID[q.id]; expect(d, q.id).toBeTruthy()
      expect(d.status).toBe('validada'); expect(d.source.length).toBeGreaterThan(10); expect(d.provision).toMatch(/\d/); expect(d.pages).toMatch(/\d/); expect(d.excerpt.length).toBeGreaterThan(20)
    }
  })
  it('lote 01: 25 questões auditadas; Res. 850 permanece Pendente por vigência não comprovada', () => {
    expect(DOC_AUDIT.length).toBe(25)
    for (const d of DOC_AUDIT.filter(x => /^it[tm]-/.test(x.id))) { expect(d.status).toBe('pendente'); expect(d.pendencies?.length).toBeGreaterThan(0) }
    expect(DOC_AUDIT.filter(x => x.status === 'validada').length).toBe(15)
  })
})

describe('registro de auditoria', () => {
  it('há exatamente um registro por questão, com campos obrigatórios', () => {
    expect(Object.keys(AUDIT).sort()).toEqual(RAW_QUESTIONS.map(q => q.id).sort())
    for (const a of Object.values(AUDIT)) {
      expect(a.discipline).not.toBe('?'); expect(a.auditedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(a.methods.length).toBeGreaterThan(0); expect(a.verification.length).toBeGreaterThan(10); expect(a.justification.length).toBeGreaterThan(10)
      expect(VALS).toContain(a.proposed); expect(VALS).toContain(a.previous)
    }
  })
  it('status do catálogo = status proposto na auditoria', () => { for (const q of QUESTIONS) expect(q.validation).toBe(AUDIT[q.id].proposed) })
})

describe('conferência computacional (exatas)', () => {
  it('o gabarito coincide com o valor recalculado e nenhum distrator tem o mesmo valor', () => {
    const near = (a: number[], v: number[]) => v.every(x => a.some(y => Math.abs(y - x) < 1e-9))
    for (const c of [...CALC_CHECKS, ...NEW_CALC]) {
      const q = QUESTIONS.find(x => x.id === c.id)!; expect(q, c.id).toBeTruthy()
      const right = q.options.find(o => o.id === q.answer)!
      expect(near(numbersOf(right.text), c.values), c.id + ' gabarito').toBe(true)
      const eq = q.options.filter(o => o.id !== q.answer && near(numbersOf(o.text), c.values) && !(c.equivalentDistractors || []).includes(o.id))
      expect(eq.map(o => o.id), c.id + ' distratores').toEqual([])
    }
  })
  it('só é validada quem tem cálculo conferido (CALC_CHECKS) ou conferência documental registrada', () => {
    const ids = new Set(CALC_CHECKS.map(c => c.id))
    expect(QUESTIONS.filter(q => q.validation === 'validada' && !ids.has(q.id) && !DOC_AUDIT_BY_ID[q.id])).toEqual([])
  })
  it('o analisador numérico entende formatos pt-BR', () => {
    expect(numbersOf('R$ 1.800,00')).toEqual([1800]); expect(numbersOf('7,5')).toEqual([7.5]); expect(numbersOf('2/5')).toEqual([0.4])
    expect(numbersOf('−4')).toEqual([-4]); expect(numbersOf('9 h 30 min')).toEqual([9.5])
  })
})

describe('ampliação (lote autoral F4-A)', () => {
  it('questões novas de IA são autorais e nascem Pendente', () => {
    const novas = QUESTIONS.filter(q => q.origin === 'autoral')
    expect(novas.length).toBe(10)
    for (const q of novas) { expect(q.validation, q.id).toBe('pendente'); expect(AUDIT[q.id].proposed).toBe('pendente') }
  })
  it('os assuntos ampliados chegam a 10 questões, mas só 5 por assunto estão validadas', () => {
    for (const t of ['mat-2', 'mat-4']) {
      const qs = QUESTIONS.filter(q => q.topicId === t)
      expect(qs.length).toBe(10); expect(qs.filter(q => q.validation === 'validada').length).toBe(5)
    }
  })
  it('gabarito distribuído nas cinco letras no lote', () => { expect(new Set(QUESTIONS.filter(q => q.origin === 'autoral').map(q => q.answer)).size).toBeGreaterThanOrEqual(4) })
})

describe('revisões e uso nas avaliações', () => {
  it('revisões do lote 01: mesmo ID, gabarito e alternativas intactos; só a explicação muda; texto anterior registrado', () => {
    expect(REVISIONS.length).toBe(8)
    for (const r of REVISIONS) {
      const raw = RAW_QUESTIONS.find(q => q.id === r.id)!, now = QUESTIONS.find(q => q.id === r.id)!
      expect(now.answer).toBe(raw.answer); expect(now.stem).toBe(raw.stem); expect(now.options.map(o => o.text)).toEqual(raw.options.map(o => o.text))
      for (const [k, v] of Object.entries(r.previous!.optionWhy!)) expect(raw.options.find(o => o.id === k)!.why, r.id).toBe(v)
      for (const [k, v] of Object.entries(r.after!.optionWhy!)) expect(now.options.find(o => o.id === k)!.why, r.id).toBe(v)
      expect(r.kind).not.toBe('substituicao'); expect(r.version).toBeGreaterThan(1)
    }
  })
  it('applyRevisions não altera questão sem revisão', () => { const q = RAW_QUESTIONS.find(x => x.id === 'mmc-1')!; expect(applyRevisions(q)).toBe(q) })
  it('a explicação corrigida de itt-5 não cita mais o piso de 90 dias como regra vigente', () => {
    const q = QUESTIONS.find(x => x.id === 'itt-5')!; const c = q.options.find(o => o.id === 'C')!
    expect(c.why).toMatch(/redação original/); expect(c.why).not.toMatch(/prazo mínimo de revezamento/)
  })
  it('questão substituída sai de novas avaliações, mas continua no catálogo', () => {
    const revs = [{ id: 'mmc-1', version: 2, date: '2026-11-06', kind: 'substituicao' as const, summary: 'x', reason: 'y', supersededBy: 'mmc-1b' }]
    expect(supersededIds(revs).has('mmc-1')).toBe(true); expect(versionOf('mmc-1', revs)).toBe(2); expect(versionOf('mmc-2', revs)).toBe(1)
    expect(QUESTIONS.some(q => q.id === 'mmc-1')).toBe(true)
  })
  it('regras da Fase 3 preservadas: prática aceita pendente; erro confirmado fica de fora; só validada conta para domínio', () => {
    const topic = QUESTIONS.find(q => q.id === 'mmc-1')!.topicId
    const base = poolOf(topic, id => (id === 'mmc-1' ? 'precisa-correcao' : id === 'mmc-2' ? 'pendente' : 'validada'))
    expect(base.excluded.map(q => q.id)).toContain('mmc-1')
    expect(base.practice.map(q => q.id)).not.toContain('mmc-1'); expect(base.practice.map(q => q.id)).toContain('mmc-2')
    expect(base.validated.map(q => q.id)).not.toContain('mmc-2')
  })
})
