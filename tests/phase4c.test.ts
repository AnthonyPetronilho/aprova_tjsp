// Fase 4C — testes dos problemas identificados na segunda auditoria. Passar aqui NÃO significa revisão humana nem certificação jurídica.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { QUESTIONS } from '../src/data/questions'
import { AUDIT } from '../src/data/audit'
import { REVISIONS, supersededIds } from '../src/data/revisions'
import { LOTES_4C } from '../src/data/audit-docs-4c'
import { DOC_AUDIT_BY_ID } from '../src/data/audit-docs'

const byId = (id: string) => QUESTIONS.find(q => q.id === id)!
const ans = (id: string) => { const q = byId(id); return q.options.find(o => o.id === q.answer)!.text }

describe('substituições da 4C', () => {
  it('pcl-4 é substituída por pcl-4b; a antiga permanece no catálogo, fora do pool, e invalida a maestria', () => {
    const r = REVISIONS.find(x => x.id === 'pcl-4' && x.kind === 'substituicao')!
    expect(r.supersededBy).toBe('pcl-4b'); expect(r.invalidatesMastery).toBe(true)
    expect(supersededIds().has('pcl-4')).toBe(true); expect(byId('pcl-4b')).toBeTruthy()
    expect(AUDIT['pcl-4b'].proposed).toBe('pendente')
  })
  it('substitutas autorais continuam Pendentes', () => { for (const id of ['soc-2b', 'ppj-4b', 'estr-1b', 'pcl-4b']) expect(AUDIT[id].proposed, id).toBe('pendente') })
  it('soc-2b: gabarito é a alternativa de 40 h com transição, e a revisão referencia letras existentes', () => {
    expect(byId('soc-2b').options.some(o => o.id === byId('soc-2b').answer)).toBe(true)
    const r = REVISIONS.find(x => x.id === 'soc-2b')!; expect(r.kind).toBe('complementacao')
    const letters = new Set(byId('soc-2b').options.map(o => o.id))
    for (const k of Object.keys(r.optionWhy ?? {})) expect(letters.has(k), k).toBe(true)
  })
  it('conc-5 e clas-5: correções de explicação não invalidam a maestria', () => {
    for (const id of ['conc-5', 'clas-5']) { const r = REVISIONS.find(x => x.id === id && x.version === 2)!; expect(r, id).toBeTruthy(); expect(r.invalidatesMastery).toBe(false) }
  })
})

describe('registros documentais da 4C', () => {
  it('todo registro de Português/Informática tem fonte, dispositivo e data de verificação', () => {
    expect(LOTES_4C.length).toBeGreaterThan(40)
    for (const d of LOTES_4C) { expect(d.source.length, d.id).toBeGreaterThan(5); expect(d.provision.length, d.id).toBeGreaterThan(0); expect(d.date ?? '', d.id).toMatch(/^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/) }
  })
  it('Atualidades com afirmação não confirmada em fonte institucional fica Pendente (fat-2)', () => {
    expect(AUDIT['fat-2'].proposed).toBe('pendente'); expect(DOC_AUDIT_BY_ID['fat-2'].pendencies?.join(' ')).toMatch(/132 anos/)
  })
  it('nenhuma questão autoral está Validada e nenhuma é marcada com revisão humana', () => {
    for (const q of QUESTIONS) { if (q.origin === 'autoral') expect(AUDIT[q.id]?.proposed, q.id).toBe('pendente') }
    for (const a of Object.values(AUDIT)) expect(a.methods).not.toContain('validacao-humana')
  })
})

describe('Matemática autoral — recálculo independente', () => {
  const mdc = (a: number, b: number): number => (b ? mdc(b, a % b) : a), mmc = (a: number, b: number) => (a * b) / mdc(a, b)
  const num = (t: string) => Number(t.replace(/[^\d,]/g, '').replace(',', '.'))
  it('mmc-6..10', () => {
    expect(num(ans('mmc-6'))).toBe(mmc(6, 8)); expect(num(ans('mmc-7'))).toBe(mdc(84, 126))
    expect(num(ans('mmc-8'))).toBe(mmc(mmc(4, 6), 9)); expect(num(ans('mmc-9'))).toBe(mmc(12, 15)); expect(num(ans('mmc-10'))).toBe(mdc(150, 90))
  })
  it('porc-6..10', () => {
    expect(num(ans('porc-6'))).toBe(500 * 0.7); expect(num(ans('porc-7'))).toBe(((460 - 400) / 400) * 100)
    expect(num(ans('porc-8'))).toBeCloseTo(250 * 0.96, 5); expect(num(ans('porc-9'))).toBe(80 * 0.65)
    expect(num(ans('porc-10'))).toBeCloseTo((1.1 * 1.2 - 1) * 100, 5)
  })
  it('oper-5: o irracional é √2', () => { expect(ans('oper-5')).toContain('√2') })
})

describe('segunda auditoria por amostra', () => {
  const j = JSON.parse(readFileSync('docs/FASE-4C-SEGUNDA-AUDITORIA.json', 'utf8'))
  it('amostra com 86 itens, todos existentes no banco, sem revisão humana e sem percentual de precisão', () => {
    expect(j.total).toBe(86); for (const i of j.itens) { expect(QUESTIONS.some(q => q.id === i.id), i.id).toBe(true); expect(i.revisaoHumana).toBe('não') }
    expect(JSON.stringify(j)).not.toMatch(/\d+\s?%\s*de\s*precis/i)
  })
  it('a única divergência inicial (pca-4) foi esclarecida como erro da releitura, com gabarito armazenado conferido', () => {
    const div = j.itens.filter((i: { resultadoComparacao: string }) => i.resultadoComparacao === 'divergência inicial')
    expect(div.map((i: { id: string }) => i.id)).toEqual(['pca-4']); expect(ans('pca-4')).toMatch(/^5, 10 e 30/)
  })
})
