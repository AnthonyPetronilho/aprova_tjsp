// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { applyCatalog, catalogRev, resetCatalogForTests, sanitizeCatalog } from '../src/lib/catalog'
import { validationOf } from '../src/lib/content'
import { activeQuestions, isActiveQuestion } from '../src/lib/pool'
import { poolOf, masteryOf } from '../src/lib/learning'
import { QUESTIONS } from '../src/data/questions'
import { LESSONS } from '../src/data/lessons'
import { FLASHCARDS } from '../src/data/cards'
import { DEFAULT_MASTERY } from '../src/config'

const seed = JSON.parse(readFileSync('server/data/catalog-seed.json', 'utf8'))
const q0 = QUESTIONS.find(q => validationOf(q.id) === 'validada')!
beforeEach(() => { resetCatalogForTests(); try { localStorage.clear() } catch { /* */ } })

describe('Fase 5 — catálogo editorial no cliente', () => {
  it('semente do servidor coincide com o catálogo embutido (ids e assuntos)', () => {
    expect(seed.questions.map((x: { id: string }) => x.id).sort()).toEqual(QUESTIONS.filter(q => !q.id.startsWith('adm-')).map(q => q.id).sort())
    expect(seed.lessons.length).toBe(LESSONS.length); expect(seed.cards.length).toBe(FLASHCARDS.length)
    const tq = new Map(QUESTIONS.map(q => [q.id, q.topicId])); for (const s of seed.questions) expect(tq.get(s.id)).toBe(s.topicId)
  })
  it('revisão monotônica: catálogo mais antigo ou igual não substitui', () => {
    expect(applyCatalog({ rev: 5, questions: [{ id: q0.id, origin: 'catalogo', archived: true }], lessons: [], cards: [] })).toBe(true)
    expect(applyCatalog({ rev: 3, questions: [], lessons: [], cards: [] })).toBe(false)
    expect(applyCatalog({ rev: 5, questions: [], lessons: [], cards: [] })).toBe(false)
    expect(catalogRev()).toBe(5); expect(isActiveQuestion(q0)).toBe(false)
  })
  it('arquivada/substituída saem dos conjuntos de estudo, mas continuam consultáveis no histórico', () => {
    const n = activeQuestions().length
    applyCatalog({ rev: 1, questions: [{ id: q0.id, origin: 'catalogo', supersededBy: 'adm-q-x' }], lessons: [], cards: [] })
    expect(activeQuestions().length).toBe(n - 1); expect(QUESTIONS.some(q => q.id === q0.id)).toBe(true)
    expect(poolOf(q0.topicId, validationOf).validated.some(q => q.id === q0.id)).toBe(false)
  })
  it('validação do servidor tem precedência; precisa-correcao sai do pool e não conta para domínio', () => {
    applyCatalog({ rev: 2, questions: [{ id: q0.id, origin: 'catalogo', validation: 'precisa-correcao' }], lessons: [], cards: [] })
    expect(validationOf(q0.id)).toBe('precisa-correcao'); expect(isActiveQuestion(q0)).toBe(false)
    const m = masteryOf(q0.topicId, [], validationOf, DEFAULT_MASTERY); expect(m.state).not.toBe('consolidado')
  })
  it('questão criada no Admin só aparece depois de publicada e entra como pendente', () => {
    applyCatalog({ rev: 1, questions: [{ id: 'adm-q-abc', origin: 'admin', live: { topicId: q0.topicId, stem: 'Enunciado de teste?', options: q0.options, answer: q0.answer } }], lessons: [], cards: [] })
    const q = QUESTIONS.find(x => x.id === 'adm-q-abc'); expect(q).toBeTruthy(); expect(validationOf('adm-q-abc')).toBe('pendente')
    expect(poolOf(q0.topicId, validationOf).validated.some(x => x.id === 'adm-q-abc')).toBe(false)
  })
  it('lixo no catálogo é descartado sem quebrar', () => {
    expect(sanitizeCatalog(null)).toBeNull(); expect(sanitizeCatalog({ rev: -1 })).toBeNull()
    expect(sanitizeCatalog({ rev: 1, questions: [{ id: 3 }, { id: 'x', origin: 'zzz' }], lessons: 'x', cards: null })!.questions).toEqual([])
  })
  it('aplicar catálogo não toca no progresso (XP, eventos, respostas)', () => {
    localStorage.setItem('aprova-tjsp:progress', '{"xp":123}')
    const before = localStorage.getItem('aprova-tjsp:progress')
    applyCatalog({ rev: 9, questions: [{ id: q0.id, origin: 'catalogo', archived: true }], lessons: [], cards: [] })
    expect(localStorage.getItem('aprova-tjsp:progress')).toBe(before)
  })
})
