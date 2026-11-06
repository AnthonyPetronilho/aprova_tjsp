// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useProgress, normalize } from '../src/lib/useProgress'
import { mergeProgress, toCurrent, rebuild, fingerprint } from '../src/lib/events'
import { clearContentLocal, setValidation, validationOf } from '../src/lib/content'
import { QUESTIONS } from '../src/data/questions'
import { DISCIPLINES } from '../src/data/edital'
import { DEFAULT_MASTERY } from '../src/config'
import { MASTERY_SHORT, attemptsOf, coverage, entriesOf, filterEntries, masteryOf, masteryText, minutesByDiscipline, poolOf, score, suggestionsFor, topicLearning, validateStudy, evolution, performanceByDiscipline } from '../src/lib/learning'
import { achievements } from '../src/lib/gamification'
import { device, stamp, today } from './helpers'
import type { AsmItem, OptId, Progress } from '../src/types'

const topicWith = (n: number) => DISCIPLINES.flatMap(d => d.topics).find(t => QUESTIONS.filter(q => q.topicId === t.id).length >= n)!.id
const T = topicWith(5), TQ = QUESTIONS.filter(q => q.topicId === T), OTHER = QUESTIONS.find(q => q.topicId !== T)!
const wrongOf = (q: { answer: OptId }): OptId => (q.answer === 'A' ? 'B' : 'A')
const vOfAll = (v: 'validada' | 'pendente') => () => v
const rules = { ...DEFAULT_MASTERY, minDistinct: 3 }
// tentativa de avaliação construída direto como evento (permite escolher o dia: "ago" dias atrás)
function asm(d: ReturnType<typeof device>, topic: string, mode: 'avaliacao' | 'pratica', hits: boolean[], ago = 0) {
  const items: AsmItem[] = hits.map((ok, i) => [TQ[i % TQ.length].id, ok ? TQ[i % TQ.length].answer : wrongOf(TQ[i % TQ.length]), ok ? 1 : 0])
  d.ev({ t: 'asm', topic, mode, items, sec: 60 } as never, ago)
}
const mkP = (r = rules) => { const d = device({}, 'X'); d.p = { ...d.p, settings: { ...d.p.settings, mastery: r } }; return d }
const fresh = () => { localStorage.clear(); clearContentLocal() }
beforeEach(fresh)

describe('Diário de Estudos', () => {
  const ok = { date: today(), topicId: T, material: 'videoaula', source: 'Curso X', minutes: 30 }
  it('valida os campos e rejeita assunto inexistente', () => {
    expect(validateStudy(ok)).toBeNull()
    expect(validateStudy({ ...ok, topicId: 'nao-existe' })).toMatch(/assunto/i)
    expect(validateStudy({ ...ok, source: '  ' })).toMatch(/fonte/i)
    expect(validateStudy({ ...ok, minutes: 0 })).toMatch(/tempo/i)
    expect(validateStudy({ ...ok, minutes: 961 })).toMatch(/tempo/i)
    expect(validateStudy({ ...ok, material: 'tv' })).toMatch(/material/i)
    expect(validateStudy({ ...ok, date: '2999-01-01' })).toMatch(/futuro/i)
    expect(validateStudy({ ...ok, date: 'ontem' })).toMatch(/data/i)
    expect(validateStudy({ ...ok, note: 'x'.repeat(1001) })).toMatch(/observa/i)
  })
  it('cria, edita, exclui e lista; guarda disciplina derivada, createdAt e updatedAt', async () => {
    const { result } = renderHook(() => useProgress())
    let e0: string | null = null; act(() => { e0 = result.current.saveStudy({ ...ok, topicId: 'nao-existe' }) }); expect(e0).toMatch(/assunto/i)
    expect(entriesOf(result.current.p)).toHaveLength(0)
    let err: string | null = 'x'; act(() => { err = result.current.saveStudy({ ...ok, note: ' revisar ' }) }); expect(err).toBeNull()
    const [e] = entriesOf(result.current.p); expect(e).toMatchObject({ topicId: T, material: 'videoaula', source: 'Curso X', minutes: 30, note: 'revisar', discId: DISCIPLINES.find(d => d.topics.some(t => t.id === T))!.id })
    expect(e.id).toBeTruthy(); expect(e.createdAt).toBeTruthy()
    await new Promise(r => setTimeout(r, 5))
    act(() => { result.current.saveStudy({ ...ok, id: e.id, minutes: 45, source: 'Livro Y' }) })
    const [e2] = entriesOf(result.current.p); expect(entriesOf(result.current.p)).toHaveLength(1)
    expect(e2).toMatchObject({ id: e.id, minutes: 45, source: 'Livro Y', createdAt: e.createdAt }); expect(e2.updatedAt > e.updatedAt).toBe(true)
    act(() => { result.current.deleteStudy(e.id) }); expect(entriesOf(result.current.p)).toHaveLength(0)
    expect(result.current.p.diary[e.id].deleted).toBe(true) // lápide: a exclusão também sincroniza
  })
  it('filtra por disciplina e período e soma o tempo manual por disciplina', () => {
    const d = device(); const mk = (id: string, date: string, topicId: string, minutes: number) => { const disc = DISCIPLINES.find(x => x.topics.some(t => t.id === topicId))!; d.p = { ...d.p, diary: { ...d.p.diary, [id]: { id, date, discId: disc.id, topicId, material: 'livro', source: 's', minutes, createdAt: date + 'T10:00:00.000Z', updatedAt: date + 'T10:00:00.000Z' } } } }
    const T2 = DISCIPLINES.find(x => x.id !== DISCIPLINES.find(y => y.topics.some(t => t.id === T))!.id)!.topics[0].id
    mk('a', '2026-10-01', T, 30); mk('b', '2026-10-10', T, 20); mk('c', '2026-10-12', T2, 50)
    const all = entriesOf(d.p); expect(all.map(e => e.id)).toEqual(['c', 'b', 'a'])
    const disc = all.find(e => e.id === 'a')!.discId
    expect(filterEntries(all, { disc }).map(e => e.id)).toEqual(['b', 'a'])
    expect(filterEntries(all, { from: '2026-10-05', to: '2026-10-11' }).map(e => e.id)).toEqual(['b'])
    const m = minutesByDiscipline(all); expect(m.find(x => x.id === disc)!.minutes).toBe(50); expect(m.reduce((n, x) => n + x.minutes, 0)).toBe(100)
  })
  it('tempo manual NÃO entra no tempo ativo do app nem nos contadores diários', () => {
    const { result } = renderHook(() => useProgress())
    const before = JSON.stringify(Object.values(result.current.p.daily).map(x => x.seconds))
    act(() => { result.current.saveStudy({ ...ok, minutes: 120 }) })
    expect(JSON.stringify(Object.values(result.current.p.daily).map(x => x.seconds))).toBe(before)
    expect(result.current.p.events.some(e => e.t === 'sec')).toBe(false)
  })
  it('XP do registro: só a partir de 10 min, 1x por dia, sem duplicar ao editar ou entre aparelhos', () => {
    const { result } = renderHook(() => useProgress()), xp0 = result.current.p.xp, bonus = result.current.p.settings.xp.study
    act(() => { result.current.saveStudy({ ...ok, minutes: 5 }) }); expect(result.current.p.xp).toBe(xp0)
    act(() => { result.current.saveStudy({ ...ok, minutes: 60 }) }); expect(result.current.p.xp).toBe(xp0 + bonus)
    act(() => { result.current.saveStudy({ ...ok, minutes: 90, source: 'outra' }) }); expect(result.current.p.xp).toBe(xp0 + bonus)
    const a = result.current.p, b = device(); b.ev({ t: 'rwd', kind: 'study', key: today(), xp: bonus, id: `rwd:study:${today()}` } as never)
    expect(mergeProgress(a, b.p).xp).toBe(xp0 + bonus)
    expect(bonus).toBeLessThanOrEqual(10) // marcar estudo não rende recompensa grande
  })
  it('sincroniza entre aparelhos: o mais recente vence, exclusão vence edição mais antiga, nada se perde', () => {
    const A = device({}, 'A'), B = device({}, 'B')
    const e = (id: string, minutes: number, upd: string, extra = {}) => ({ id, date: '2026-10-01', discId: 'x', topicId: T, material: 'livro' as const, source: 's', minutes, createdAt: '2026-10-01T10:00:00.000Z', updatedAt: upd, ...extra })
    A.p = { ...A.p, diary: { k: e('k', 30, '2026-10-02T10:00:00.000Z'), only: e('only', 10, '2026-10-02T10:00:00.000Z') } }
    B.p = { ...B.p, diary: { k: e('k', 99, '2026-10-03T10:00:00.000Z'), z: e('z', 5, '2026-10-02T10:00:00.000Z') } }
    const m1 = mergeProgress(A.p, B.p), m2 = mergeProgress(B.p, A.p)
    expect(fingerprint(m1)).toBe(fingerprint(m2)); expect(m1.diary.k.minutes).toBe(99); expect(Object.keys(m1.diary).sort()).toEqual(['k', 'only', 'z'])
    const C = device({}, 'C'); C.p = { ...C.p, diary: { k: e('k', 99, '2026-10-04T10:00:00.000Z', { deleted: true }) } }
    const m3 = mergeProgress(m1, C.p); expect(m3.diary.k.deleted).toBe(true); expect(entriesOf(m3).map(x => x.id).sort()).toEqual(['only', 'z'])
    expect(fingerprint(mergeProgress(m3, m3))).toBe(fingerprint(m3))
  })
})

describe('Avaliação (Validar meu aprendizado)', () => {
  it('nunca mistura assuntos: respostas de outro assunto são descartadas', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.submitAssessment({ topic: T, mode: 'pratica', sec: 40, answers: [...TQ.map(q => ({ qid: q.id, chosen: q.answer })), { qid: OTHER.id, chosen: OTHER.answer }] }) })
    const [a] = attemptsOf(result.current.p); expect(a.items.map(i => i[0]).sort()).toEqual(TQ.map(q => q.id).sort()); expect(a.items.some(i => i[0] === OTHER.id)).toBe(false)
    expect(result.current.p.answers[OTHER.id]).toBeUndefined()
    act(() => { result.current.submitAssessment({ topic: T, mode: 'pratica', sec: 1, answers: [{ qid: OTHER.id, chosen: 'A' }] }) }); expect(attemptsOf(result.current.p)).toHaveLength(1) // nada válido: nada registrado
  })
  it('registra acertos, erros, duração e vai para o Caderno de Erros; histórico de tentativas é preservado', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.submitAssessment({ topic: T, mode: 'avaliacao', sec: 125, answers: TQ.map((q, i) => ({ qid: q.id, chosen: i < 2 ? wrongOf(q) : q.answer })) }) })
    const [a] = attemptsOf(result.current.p); expect(score(a.items)).toMatchObject({ n: TQ.length, ok: TQ.length - 2 }); expect(a.sec).toBe(125)
    expect(Object.keys(result.current.p.errors).filter(q => TQ.some(x => x.id === q))).toHaveLength(2)
    act(() => { result.current.submitAssessment({ topic: T, mode: 'pratica', sec: 10, answers: TQ.slice(0, 3).map(q => ({ qid: q.id, chosen: q.answer })) }) })
    expect(attemptsOf(result.current.p)).toHaveLength(2)
  })
  it('variável: aceita de 1 a N questões; XP só com 5+ e 1x por assunto por dia', () => {
    const { result } = renderHook(() => useProgress()), bonus = result.current.p.settings.xp.assessment
    act(() => { result.current.submitAssessment({ topic: T, mode: 'pratica', sec: 5, answers: [{ qid: TQ[0].id, chosen: wrongOf(TQ[0]) }] }) })
    expect(attemptsOf(result.current.p)[0].items).toHaveLength(1); expect(result.current.p.events.some(e => e.t === 'rwd' && e.kind === 'asm')).toBe(false)
    const x0 = result.current.p.xp
    act(() => { result.current.submitAssessment({ topic: T, mode: 'avaliacao', sec: 5, answers: TQ.map(q => ({ qid: q.id, chosen: wrongOf(q) })) }) })
    const x1 = result.current.p.xp; expect(x1 - x0).toBe(bonus) // erros não rendem XP de questão; só o bônus da avaliação
    act(() => { result.current.submitAssessment({ topic: T, mode: 'avaliacao', sec: 5, answers: TQ.map(q => ({ qid: q.id, chosen: q.answer })) }) })
    const gained = result.current.p.xp - x1; expect(gained).toBe(TQ.length * result.current.p.settings.xp.question) // 2ª avaliação do dia: sem novo bônus de avaliação
  })
  it('XP não duplica quando dois aparelhos avaliam o mesmo assunto no mesmo dia', () => {
    const A = device({}, 'A'), B = device({}, 'B'), id = `rwd:asm:${T}:${today()}`
    for (const d of [A, B]) { asm(d, T, 'avaliacao', [true, true, true, true, true]); d.ev({ t: 'rwd', kind: 'asm', key: `${T}:${today()}`, xp: 30, id } as never) }
    const m = mergeProgress(A.p, B.p); expect(m.events.filter(e => e.id === id)).toHaveLength(1); expect(m.xp).toBe(30); expect(attemptsOf(m)).toHaveLength(2) // as duas tentativas ficam; a recompensa só uma vez
    expect(fingerprint(mergeProgress(B.p, A.p))).toBe(fingerprint(m))
  })
})

describe('Critério de domínio', () => {
  const v = (s: Record<string, 'validada' | 'pendente' | 'precisa-correcao' | 'precisa-complementacao'>) => (q: string) => s[q] ?? 'pendente'
  const allV = Object.fromEntries(TQ.map(q => [q.id, 'validada' as const]))
  it('consolida só com ≥ meta de acertos, ≥ 2 dias, ≥ N questões distintas e questões validadas', () => {
    const d = mkP(); asm(d, T, 'avaliacao', [true, true, true, true, true], 3); asm(d, T, 'avaliacao', [true, true, true, true, true], 0)
    const m = masteryOf(T, attemptsOf(d.p), v(allV), rules); expect(m.state).toBe('consolidado'); expect(m.days).toBe(2); expect(m.distinct).toBe(Math.min(5, TQ.length))
    expect(topicLearning(d.p, T, { vOf: v(allV) }).status).toBe('dominio')
  })
  it('dois testes no MESMO dia não bastam', () => {
    const d = mkP(); asm(d, T, 'avaliacao', [true, true, true, true, true]); asm(d, T, 'avaliacao', [true, true, true, true, true])
    expect(masteryOf(T, attemptsOf(d.p), v(allV), rules).state).toBe('amostra-insuficiente')
  })
  it('abaixo de N questões distintas não consolida (regra padrão: 10)', () => {
    const d = mkP(DEFAULT_MASTERY); asm(d, T, 'avaliacao', [true, true, true, true, true], 2); asm(d, T, 'avaliacao', [true, true, true, true, true])
    const m = masteryOf(T, attemptsOf(d.p), v(allV), DEFAULT_MASTERY); expect(m.state).not.toBe('consolidado'); expect(masteryText(m)).toContain('questões validadas')
  })
  it('sem questões validadas: "Domínio ainda não avaliado — questões validadas insuficientes."', () => {
    const d = mkP(DEFAULT_MASTERY); const m = masteryOf(T, attemptsOf(d.p), () => 'pendente', DEFAULT_MASTERY)
    expect(m.state).toBe('nao-avaliado'); expect(masteryText(m)).toBe(MASTERY_SHORT); expect(MASTERY_SHORT).toBe('Domínio ainda não avaliado — questões validadas insuficientes.')
  })
  it('prática e questões pendentes nunca contam para o domínio', () => {
    const d = mkP(); asm(d, T, 'pratica', [true, true, true, true, true], 3); asm(d, T, 'pratica', [true, true, true, true, true])
    expect(masteryOf(T, attemptsOf(d.p), v(allV), rules).state).toBe('nao-avaliado')
    const e = mkP(); asm(e, T, 'avaliacao', [true, true, true, true, true], 3); asm(e, T, 'avaliacao', [true, true, true, true, true])
    expect(masteryOf(T, attemptsOf(e.p), () => 'pendente', rules).state).toBe('nao-avaliado') // respostas a questões não validadas não são evidência
  })
  it('questão com erro confirmado sai das avaliações e da evidência; só validadas entram', () => {
    const p = poolOf(T, v({ [TQ[0].id]: 'precisa-correcao', [TQ[1].id]: 'validada', [TQ[2].id]: 'precisa-complementacao' }))
    expect(p.validated.map(q => q.id)).toEqual([TQ[1].id]); expect(p.practice.some(q => q.id === TQ[0].id)).toBe(false); expect(p.excluded.map(q => q.id)).toEqual([TQ[0].id]); expect(p.practice.some(q => q.id === TQ[2].id)).toBe(true)
    const d = mkP(); asm(d, T, 'avaliacao', [true, true, true, true, true], 3); asm(d, T, 'avaliacao', [true, true, true, true, true])
    const m = masteryOf(T, attemptsOf(d.p), v({ ...allV, [TQ[0].id]: 'precisa-correcao', [TQ[1].id]: 'precisa-correcao' }), rules); expect(m.distinct).toBe(Math.min(5, TQ.length) - 2)
  })
  it('abaixo da meta, ou última avaliação abaixo da meta: não consolida', () => {
    const d = mkP(); asm(d, T, 'avaliacao', [true, true, true, true, true], 3); asm(d, T, 'avaliacao', [false, false, true, true, true])
    expect(masteryOf(T, attemptsOf(d.p), v(allV), rules).state).toBe('nao-atingido')
  })
  it('as regras são configuráveis (mudam o resultado sem apagar nada)', () => {
    const d = mkP(); asm(d, T, 'avaliacao', [true, true, true, false, true], 3); asm(d, T, 'avaliacao', [true, true, true, false, true])
    expect(masteryOf(T, attemptsOf(d.p), v(allV), { ...rules, minPct: 90 }).state).toBe('nao-atingido'); expect(masteryOf(T, attemptsOf(d.p), v(allV), { ...rules, minPct: 70 }).state).toBe('consolidado')
  })
  it('validação padrão é pendente e nunca vira "validada" sozinha; ajuste manual sincroniza por data', () => {
    expect(QUESTIONS.every(q => validationOf(q.id) === 'pendente')).toBe(true)
    setValidation(TQ[0].id, 'validada'); expect(validationOf(TQ[0].id)).toBe('validada'); setValidation(TQ[0].id, 'precisa-correcao'); expect(validationOf(TQ[0].id)).toBe('precisa-correcao')
  })
})

describe('Status por assunto (regras testáveis)', () => {
  const v = () => 'validada' as const
  const st = (p: Progress) => topicLearning(p, T, { vOf: v }).status
  it('nao-iniciado → estudando → teoria → aguardando → reforcar → revisao → bom → dominio', () => {
    const d = mkP(); expect(st(d.p)).toBe('nao-iniciado')
    d.p = { ...d.p, marks: { [T]: { state: 'estudando', at: new Date().toISOString() } } }; expect(st(d.p)).toBe('estudando')
    d.p = { ...d.p, marks: { [T]: { state: 'teoria', at: new Date().toISOString() } } }; expect(st(d.p)).toBe('teoria')
    d.p = { ...d.p, marks: { [T]: { state: 'teoria', at: new Date(Date.now() - 2 * 864e5).toISOString() } } }; expect(st(d.p)).toBe('aguardando') // declarado há dias, sem avaliação
    asm(d, T, 'avaliacao', [false, false, false, true, false], 1); expect(st(d.p)).toBe('reforcar') // 20% < 60%
    d.p = { ...d.p, marks: { [T]: { state: 'teoria', at: new Date(Date.now() + 1000).toISOString() } } }; expect(st(d.p)).toBe('aguardando') // estudou de novo depois da avaliação
    d.p = { ...d.p, marks: {} }; d.ev({ t: 'rev', card: 'zz', rating: 2 } as never); asm(d, T, 'avaliacao', [true, true, false, false, true], 0); expect(st(d.p)).toBe('revisao') // 60%: intermediário
    asm(d, T, 'avaliacao', [true, true, true, true, true], 0); expect(st(d.p)).toBe('bom') // 100%, mas só 1 dia
    const e = mkP(); asm(e, T, 'avaliacao', [true, true, true, true, true], 2); asm(e, T, 'avaliacao', [true, true, true, true, true], 0); expect(st(e.p)).toBe('dominio')
  })
  it('aula concluída no modelo anterior NÃO vira estudo externo; só aparece como contagem separada', () => {
    const p = normalize({ completed: { [`${T}-aula`]: '2026-09-01' }, xp: 40 }), L = topicLearning(p, T, { vOf: v })
    expect(L.status).toBe('nao-iniciado'); expect(L.studied).toBe(false); expect(Object.keys(p.marks)).toHaveLength(0); expect(p.diary).toEqual({})
  })
})

describe('Três métricas separadas', () => {
  it('abrir aula/resumo e concluir aula antiga não contam como estudo, avaliação ou domínio', () => {
    const lessonTopic = DISCIPLINES.flatMap(d => d.topics)[0].id
    const p = normalize({ completed: { x: '2026-09-01' }, lastLessonId: 'x' }); const c = coverage(p, { vOf: () => 'validada' })
    expect(c.study.n).toBe(0); expect(c.assessment.n).toBe(0); expect(c.mastery.n).toBe(0); expect(lessonTopic).toBeTruthy()
  })
  it('cada métrica avança independentemente', () => {
    const d = mkP(); d.p = { ...d.p, marks: { [T]: { state: 'teoria', at: new Date().toISOString() } } }
    let c = coverage(d.p, { vOf: () => 'validada' }); expect([c.study.n, c.assessment.n, c.mastery.n]).toEqual([1, 0, 0])
    asm(d, T, 'pratica', [true, true, true, true, true]); c = coverage(d.p, { vOf: () => 'validada' }); expect([c.study.n, c.assessment.n, c.assessment.validated, c.mastery.n]).toEqual([1, 1, 0, 0]) // prática: avaliado, não "validado"
    const e = mkP(); asm(e, T, 'avaliacao', [true, true, true, true, true], 2); asm(e, T, 'avaliacao', [true, true, true, true, true]); c = coverage(e.p, { vOf: () => 'validada' })
    expect([c.study.n, c.assessment.n, c.mastery.n]).toEqual([0, 1, 1]) // avaliar e dominar sem ter registrado estudo: cobertura de estudo continua 0
  })
  it('desempenho por disciplina separa prática de avaliação; evolução compara tentativas', () => {
    const d = mkP(); asm(d, T, 'pratica', [true, false, false, false, false], 3); asm(d, T, 'avaliacao', [true, true, true, false, false], 2); asm(d, T, 'avaliacao', [true, true, true, true, false], 0)
    const [row] = performanceByDiscipline(attemptsOf(d.p)); expect(row.practice).toMatchObject({ n: 5, ok: 1 }); expect(row.evaluation).toMatchObject({ n: 10, ok: 7 })
    const ev = evolution(attemptsOf(d.p), T); expect(ev.list.map(x => x.pct)).toEqual([20, 60, 80]); expect(ev.delta).toBe(20)
  })
  it('sugestões de reforço usam o desempenho registrado (sem IA)', () => {
    const d = mkP(), low = TQ.map(q => [q.id, wrongOf(q), 0] as AsmItem), hi = TQ.map(q => [q.id, q.answer, 1] as AsmItem)
    const a = suggestionsFor(d.p, T, low, false).map(x => x.id), b = suggestionsFor(d.p, T, hi, false).map(x => x.id)
    expect(a).toContain('externo'); expect(a).toContain('erros'); expect(a).toContain('reavaliar'); expect(b).not.toContain('erros'); expect(b).not.toContain('externo')
  })
})

describe('Migração v2 → v3 e preservação', () => {
  const v2 = () => ({ schemaVersion: 2, xp: 120, completed: { l1: '2026-09-01' }, answers: { q1: { chosen: 'A', correct: true, at: '2026-09-02', everCorrect: true } }, errors: { q2: { count: 2, lastAt: '2026-09-03', resolved: false } }, cards: { c1: { ease: 2.5, interval: 3, due: '2026-12-01', reps: 2, lapses: 0, last: '2026-09-03' } }, favorites: ['q1'], notes: { 'topic:t': { text: 'oi', updatedAt: '2026-09-01' } }, mocks: [{ id: 'm1', kind: 'rapido', date: '2026-09-04', secondsUsed: 100, qids: ['q1'], answers: { q1: 'A' }, correct: 1, wrong: 0, blank: 0, score: 10 }], dark: true, achievements: { first: '2026-09-01' }, settings: { xp: { lesson: 33, question: 9, review: 15, dailyMission: 50, mock: 100 } } })
  it('preserva XP, concluídas, respostas, erros, cards, favoritos, anotações, simulados, conquistas e preferências; é idempotente', () => {
    const a = normalize(v2()), b = normalize(JSON.parse(JSON.stringify(a)))
    expect(fingerprint(b)).toBe(fingerprint(a)); expect(fingerprint(toCurrent(a))).toBe(fingerprint(a)); expect(fingerprint(rebuild(a))).toBe(fingerprint(a))
    expect(a).toMatchObject({ schemaVersion: 3, xp: 120, completed: { l1: '2026-09-01' }, favorites: ['q1'], dark: true, achievements: { first: '2026-09-01' } })
    expect(a.answers.q1.correct).toBe(true); expect(a.errors.q2.count).toBe(2); expect(a.cards.c1.interval).toBe(3); expect(a.mocks).toHaveLength(1); expect(a.notes['topic:t'].text).toBe('oi')
    expect(a.settings.xp.lesson).toBe(33); expect(a.settings.xp.assessment).toBeGreaterThan(0); expect(a.settings.mastery).toEqual(DEFAULT_MASTERY) // novos campos recebem padrão; os antigos não mudam
    expect(a.diary).toEqual({}); expect(a.marks).toEqual({}) // aula antiga NÃO vira estudo externo
  })
  it('o hook guarda uma cópia antes de migrar e não repete a cópia depois de migrado', () => {
    localStorage.setItem('aprova-tjsp:v1', JSON.stringify(v2()))
    const { result } = renderHook(() => useProgress())
    const keys = () => Object.keys(localStorage).filter(k => k.includes('antes-da-migracao-v2')); expect(keys().length).toBe(1)
    expect(JSON.parse(localStorage.getItem(keys()[0])!)).toMatchObject({ schemaVersion: 2, xp: 120, completed: { l1: '2026-09-01' } }) // cópia fiel do original
    expect(result.current.p.xp).toBe(120); expect(JSON.parse(localStorage.getItem('aprova-tjsp:v1')!).schemaVersion).toBe(3)
    renderHook(() => useProgress()); expect(keys().length).toBe(1)
  })
  it('dados da versão 1 (sem eventos) também chegam inteiros ao modelo atual', () => {
    const p = normalize({ xp: 55, completed: { l9: '2026-08-01' }, mocks: [], answers: {} }); expect(p.xp).toBe(55); expect(p.schemaVersion).toBe(3); expect(p.completed.l9).toBe('2026-08-01')
  })
  it('troca de conta (clearLocal) esvazia diário e marcações locais; nada vaza para a outra conta', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.saveStudy({ date: today(), topicId: T, material: 'livro', source: 's', minutes: 20 }); result.current.setMark(T, 'teoria') })
    expect(entriesOf(result.current.p)).toHaveLength(1)
    act(() => { result.current.clearLocal() }); expect(entriesOf(result.current.p)).toHaveLength(0); expect(result.current.p.marks).toEqual({})
  })
  it('simulados e flashcards continuam funcionando no estado novo (mesclagem não perde)', () => {
    const a = normalize(v2()), b = device({}, 'B'); b.p = { ...b.p, mocks: [{ id: 'm2', kind: 'completo', date: '2026-09-05', secondsUsed: 1, qids: [], answers: {}, correct: 0, wrong: 0, blank: 0, score: 0 }] }
    const m = mergeProgress(a, b.p); expect(m.mocks.map(x => x.id).sort()).toEqual(['m1', 'm2']); expect(m.cards.c1).toBeTruthy()
  })
})

describe('Gamificação', () => {
  it('conquistas antigas são mantidas e as novas dependem de atividade real', () => {
    const p = normalize({ achievements: { first: '2026-09-01', streak10: '2026-09-02' } }); expect(p.achievements.first).toBe('2026-09-01')
    const ach = achievements(p); expect(ach.find(a => a.id === 'first')).toBeTruthy(); for (const id of ['diary5', 'asm1', 'asm10', 'improve', 'mastery1']) expect(ach.find(a => a.id === id)!.ok).toBe(false)
    const d = mkP(); asm(d, T, 'avaliacao', [true, true, false, false, true], 2); asm(d, T, 'avaliacao', [true, true, true, true, true]); const a2 = achievements(d.p)
    expect(a2.find(a => a.id === 'improve')!.ok).toBe(true)
  })
})
