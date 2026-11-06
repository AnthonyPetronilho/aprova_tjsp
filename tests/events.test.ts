import { describe, expect, it } from 'vitest'
import { commit, normalize } from '../src/lib/useProgress'
import { fingerprint, mergeBase, mergeEvents, mergeProgress, rebuild, toV2 } from '../src/lib/events'
import { FLASHCARDS } from '../src/data/cards'
import { LESSONS } from '../src/data/lessons'
import type { Ev, Progress } from '../src/types'
import { device, fp, rng, today } from './helpers'

const E = (o: Record<string, unknown>) => ({ id: `e-${Math.random()}`, at: new Date().toISOString(), day: today(), ...o }) as unknown as Ev
const lesson = LESSONS[0], card = FLASHCARDS.find(c => c.lessonId === lesson.id)!

// dados reais do formato antigo (v1): sem events/base/schemaVersion
const legacy = () => ({
  xp: 245, completed: { [lesson.id]: '2026-10-01' }, answers: { q1: { chosen: 'A', correct: true, everCorrect: true, at: '2026-10-01' }, q2: { chosen: 'B', correct: false, everCorrect: false, at: '2026-10-02' } },
  studyDays: ['2026-10-01', '2026-10-02'], bonusDays: ['2026-10-01'], dark: true, cards: { [card.id]: { ease: 2.6, interval: 5, due: '2026-10-10', reps: 3, lapses: 0, last: '2026-10-05' } },
  errors: { q2: { count: 2, lastAt: '2026-10-02', resolved: false } }, favorites: ['q1'], reviewLog: [{ at: '2026-10-05', rating: 2 }], reviewXpDays: ['2026-10-05'],
  notes: { 'topic:t1': { text: 'minha nota', updatedAt: '2026-10-03' } }, achievements: { first: '2026-10-01' }, correctStreak: 1, bestCorrectStreak: 4, totalAnswered: 2,
  daily: { '2026-10-01': { qids: ['q1'], correctQids: ['q1'], lessons: 1, reviews: 0, resolved: 0, seconds: 900, xp: 30 } }, settings: { xp: { lesson: 20, question: 10, review: 15, dailyMission: 50, mock: 100 } },
  levelSeen: 3, planMarks: {}, mocks: [{ id: 'm1', kind: 'rapido', date: '2026-10-04', secondsUsed: 100, qids: ['q1'], answers: { q1: 'A' }, correct: 1, wrong: 0, blank: 0, score: 10 }], mockXpDays: ['2026-10-04'], essays: [], essayDrafts: {},
})

describe('migração do formato antigo (compatibilidade)', () => {
  it('preserva XP, aulas, respostas, revisões, erros, anotações, simulados e conquistas', () => {
    const raw = legacy(), p = normalize(raw)
    expect(p.schemaVersion).toBe(3); expect(p.events).toEqual([])
    expect(p.xp).toBe(245); expect(p.completed).toEqual(raw.completed); expect(p.answers).toEqual(raw.answers)
    expect(p.cards[card.id]).toEqual(raw.cards[card.id]); expect(p.errors).toEqual(raw.errors); expect(p.favorites).toEqual(['q1'])
    expect(p.reviewLog).toEqual(raw.reviewLog); expect(p.notes).toEqual(raw.notes); expect(p.achievements).toEqual(raw.achievements)
    expect(p.mocks).toEqual(raw.mocks); expect(p.studyDays).toEqual(raw.studyDays); expect(p.daily['2026-10-01']).toEqual(raw.daily['2026-10-01'])
    expect(p.totalAnswered).toBe(2); expect(p.bestCorrectStreak).toBe(4); expect(p.levelSeen).toBe(3); expect(p.dark).toBe(true)
  })
  it('é idempotente: migrar de novo e reconstruir não muda nada', () => {
    const p = normalize(legacy()); expect(fp(normalize(p))).toBe(fp(p)); expect(fp(rebuild(p))).toBe(fp(p)); expect(fp(toV2(p))).toBe(fp(p))
  })
  it('aulas concluídas no modelo anterior continuam em `completed` sem gerar eventos nem XP novo', () => {
    const p = normalize(legacy()); expect(p.events.length).toBe(0); expect(p.xp).toBe(245)
  })
  it('dados antigos incompletos (fases iniciais) recebem padrões', () => {
    const p = normalize({ xp: 5, completed: {}, answers: {} }); expect(p.cards).toEqual({}); expect(p.schemaVersion).toBe(3); expect(p.settings.xp.lesson).toBeGreaterThan(0)
  })
})

describe('respostas, recompensas e estado derivado', () => {
  it('1ª resposta certa dá XP uma vez; acertar de novo não repete; errar cria erro e card; acertar resolve', () => {
    const d = device(); d.answer('q1', true); expect(d.p.xp).toBe(10)
    d.answer('q1', true); expect(d.p.xp).toBe(10); expect(d.p.events.filter(e => e.t === 'ans').length).toBe(2)
    d.answer('q2', false); expect(d.p.errors.q2).toMatchObject({ count: 1, resolved: false }); expect(d.p.cards['err-q2']).toBeTruthy(); expect(d.p.correctStreak).toBe(0)
    d.answer('q2', true); expect(d.p.errors.q2.resolved).toBe(true); expect(d.p.xp).toBe(20); expect(d.p.daily[today()].resolved).toBe(1)
    expect(d.p.totalAnswered).toBe(2); expect(d.p.answers.q2.everCorrect).toBe(true)
  })
  it('aula concluída: evento único, XP uma vez e flashcards da aula criados', () => {
    let p = normalize({}); const ev = (id: string) => E({ t: 'les', lid: lesson.id, id }), r = (id: string) => E({ t: 'rwd', kind: 'les', key: lesson.id, xp: 20, id })
    p = commit(p, [ev(`les:${lesson.id}`), r(`rwd:les:${lesson.id}`)]); p = commit(p, [ev(`les:${lesson.id}`), r(`rwd:les:${lesson.id}`)])
    expect(p.xp).toBe(20); expect(p.events.length).toBe(2); expect(p.completed[lesson.id]).toBe(today()); expect(p.cards[card.id]).toBeTruthy()
  })
  it('reaplicar o mesmo evento (mesmo id) nunca duplica nada', () => {
    const e = E({ t: 'ans', qid: 'q9', chosen: 'A', correct: true, id: 'fixo-1' }), w = E({ t: 'rwd', kind: 'q', key: 'q9', xp: 10, id: 'rwd:q:q9' })
    let p = normalize({}); for (let i = 0; i < 5; i++) p = commit(p, [e, w])
    expect(p.xp).toBe(10); expect(p.totalAnswered).toBe(1); expect(p.events.length).toBe(2)
  })
})

describe('mesclagem entre aparelhos', () => {
  it('a MESMA 1ª resposta certa em dois aparelhos paga XP uma vez; questões diferentes somam', () => {
    const a = device(), b = device(); a.answer('q1', true); b.answer('q1', true); a.answer('q2', true); b.answer('q3', true)
    const m = mergeProgress(a.p, b.p)
    expect(m.xp).toBe(30); expect(m.events.filter(e => e.t === 'rwd').length).toBe(3); expect(m.events.filter(e => e.t === 'ans').length).toBe(4); expect(m.totalAnswered).toBe(3)
  })
  it('nenhuma resposta é perdida e as duas tentativas ficam registradas', () => {
    const a = device(), b = device(); a.answer('q1', false, 'B'); b.answer('q1', true, 'A')
    const m = mergeProgress(a.p, b.p); expect(m.events.filter(e => e.t === 'ans').length).toBe(2); expect(m.answers.q1.everCorrect).toBe(true); expect(m.errors.q1).toBeTruthy()
  })
  it('é idempotente, comutativa e associativa nos campos sincronizados', () => {
    const a = device(), b = device(), c = device(); a.answer('q1', true); a.answer('q2', false); b.answer('q1', true); b.answer('q4', true); c.answer('q5', false); c.ev({ t: 'fav', qid: 'q1', on: true })
    const ab = mergeProgress(a.p, b.p), ba = mergeProgress(b.p, a.p)
    expect(fp(ab)).toBe(fp(ba)); expect(fp(mergeProgress(ab, ab))).toBe(fp(ab)); expect(fp(mergeProgress(mergeProgress(ab, b.p), a.p))).toBe(fp(ab))
    expect(fp(mergeProgress(mergeProgress(a.p, b.p), c.p))).toBe(fp(mergeProgress(a.p, mergeProgress(b.p, c.p))))
    expect(fp(mergeProgress(mergeProgress(c.p, a.p), b.p))).toBe(fp(mergeProgress(mergeProgress(a.p, c.p), b.p)))
  })
  it('tempo de estudo: contadores por aparelho/dia SOMAM; repetir a mesclagem não infla; o contador do mesmo aparelho só cresce', () => {
    const a = device(), b = device(), day = today()
    a.ev({ t: 'sec', sec: 120, id: `sec:A:${day}` }); b.ev({ t: 'sec', sec: 300, id: `sec:B:${day}` })
    let m = mergeProgress(a.p, b.p); expect(m.daily[day].seconds).toBe(420)
    m = mergeProgress(m, b.p); m = mergeProgress(m, a.p); expect(m.daily[day].seconds).toBe(420)
    a.ev({ t: 'sec', sec: 135, id: `sec:A:${day}` }); m = mergeProgress(m, a.p); expect(m.daily[day].seconds).toBe(435)
    a.ev({ t: 'sec', sec: 60, id: `sec:A:${day}` }) // valor menor (cópia antiga) não derruba o contador
    expect(mergeProgress(m, a.p).daily[day].seconds).toBe(435)
  })
  it('recompensas diárias (missões, revisão, simulado) com id por dia não se duplicam entre aparelhos', () => {
    const a = device(), b = device(), day = today()
    for (const x of [a, b]) { x.ev({ t: 'rwd', kind: 'mission', key: day, xp: 50, id: `rwd:mission:${day}` }); x.ev({ t: 'rwd', kind: 'rev', key: day, xp: 15, id: `rwd:rev:${day}` }); x.ev({ t: 'rwd', kind: 'mock', key: day, xp: 100, id: `rwd:mock:${day}` }) }
    const m = mergeProgress(a.p, b.p); expect(m.xp).toBe(165); expect(m.bonusDays).toContain(day); expect(m.reviewXpDays).toContain(day); expect(m.mockXpDays).toContain(day)
  })
  it('revisões de flashcards dos dois aparelhos entram todas, em ordem determinística, e o card é igual em qualquer ordem de mesclagem', () => {
    const base = device(); base.ev({ t: 'les', lid: lesson.id, id: `les:${lesson.id}` })
    const a = device(base.p), b = device(base.p)
    a.rate(card.id, 2); a.rate(card.id, 3); b.rate(card.id, 0)
    const ab = mergeProgress(a.p, b.p), ba = mergeProgress(b.p, a.p)
    expect(ab.cards[card.id]).toEqual(ba.cards[card.id]); expect(ab.events.filter(e => e.t === 'rev').length).toBe(3); expect(ab.reviewLog.length).toBe(3)
    expect(fp(mergeProgress(ab, a.p))).toBe(fp(ab))
  })
  it('revisão que chega antes do card existir (relógios diferentes) não se perde', () => {
    const a = device(); a.ev({ t: 'les', lid: lesson.id, id: `les:${lesson.id}`, at: '2026-11-05T12:00:00.000Z' })
    const b = device(); b.ev({ t: 'les', lid: lesson.id, id: `les:${lesson.id}`, at: '2026-11-05T12:00:00.000Z' }); b.ev({ t: 'rev', card: card.id, rating: 2, at: '2026-11-05T11:00:00.000Z' })
    expect(mergeProgress(a.p, b.p).reviewLog.length).toBe(1)
  })
  it('favoritos: vale a última ação em ordem determinística', () => {
    const a = device(), b = device(); a.ev({ t: 'fav', qid: 'q1', on: true, at: '2026-11-05T10:00:00.000Z' }); b.ev({ t: 'fav', qid: 'q1', on: false, at: '2026-11-05T10:00:01.000Z' })
    expect(mergeProgress(a.p, b.p).favorites).toEqual([]); expect(mergeProgress(b.p, a.p).favorites).toEqual([])
  })
  it('anotações: a mais recente vence; apagar (lápide) também sincroniza e não ressuscita', () => {
    const a = device({ notes: { n1: { text: 'antiga', updatedAt: '2026-11-01T10:00:00.000Z' } } }), b = device({ notes: { n1: { text: 'antiga', updatedAt: '2026-11-01T10:00:00.000Z' } } })
    b.p = { ...b.p, notes: { n1: { text: '', updatedAt: '2026-11-02T10:00:00.000Z' } } }
    expect(mergeProgress(a.p, b.p).notes.n1.text).toBe(''); expect(mergeProgress(b.p, a.p).notes.n1.text).toBe('')
    a.p = { ...a.p, notes: { n1: { text: 'nova', updatedAt: '2026-11-03T10:00:00.000Z' } } }; expect(mergeProgress(a.p, b.p).notes.n1.text).toBe('nova')
  })
  it('redações: união por id; exclusão registrada não volta', () => {
    const e1 = { id: 'r1', themeId: 't', text: 'x', savedAt: '2026-11-01', seconds: 1 }, e2 = { ...e1, id: 'r2', savedAt: '2026-11-02' }
    const a = device({ essays: [e1] }), b = device({ essays: [e2] }); expect(mergeProgress(a.p, b.p).essays.map(e => e.id)).toEqual(['r1', 'r2'])
    b.p = { ...b.p, essays: [], essaysDeleted: ['r1', 'r2'] }; expect(mergeProgress(a.p, b.p).essays).toEqual([])
  })
  it('"Zerar progresso" (nova época) vence dados antigos e não deixa eventos antigos voltarem; época antiga não derruba a nova', () => {
    const a = device(); a.answer('q1', true)
    const b = device(a.p); b.p = { ...normalize({}), epoch: { id: 'nova', at: '2026-11-06T00:00:00.000Z' } }
    const m = mergeProgress(a.p, b.p); expect(m.xp).toBe(0); expect(m.events).toEqual([]); expect(mergeProgress(b.p, a.p).epoch.id).toBe('nova')
    b.answer('q7', true); expect(mergeProgress(a.p, b.p).xp).toBe(10)
  })
  it('campos de cada aparelho (tema escuro, simulado em andamento, nível visto) não são sobrescritos pelo servidor', () => {
    const a = device(), b = device(); a.p = { ...a.p, dark: true }; b.p = { ...b.p, dark: false, levelSeen: 4 }
    const m = mergeProgress(a.p, b.p); expect(m.dark).toBe(true); expect(m.levelSeen).toBe(4)
  })
  it('dois aparelhos com dados ANTIGOS diferentes: base mesclada de forma determinística, sem perder aulas, erros, cards e notas', () => {
    const r1 = legacy(), r2 = { ...legacy(), xp: 300, completed: { ...legacy().completed, 'outra-aula': '2026-10-09' }, notes: { 'topic:t2': { text: 'outra', updatedAt: '2026-10-09' } }, favorites: ['q7'], errors: { q2: { count: 3, lastAt: '2026-10-08', resolved: true } } }
    const a = device(r1), b = device(r2), m = mergeProgress(a.p, b.p)
    expect(fp(m)).toBe(fp(mergeProgress(b.p, a.p))); expect(fp(mergeProgress(m, m))).toBe(fp(m))
    expect(Object.keys(m.completed).sort()).toEqual([lesson.id, 'outra-aula'].sort()); expect(m.xp).toBe(300); expect(Object.keys(m.notes).sort()).toEqual(['topic:t1', 'topic:t2']); expect(m.favorites).toEqual(['q1', 'q7'])
    expect(m.errors.q2).toEqual({ count: 3, lastAt: '2026-10-08', resolved: true }); expect(mergeBase(a.p.base, a.p.base)).toEqual(a.p.base)
  })
  it('atividade nova depois da migração soma à base antiga (sem tocar nela)', () => {
    const a = device(legacy()); a.answer('q50', true); expect(a.p.xp).toBe(255); expect(a.p.base.xp).toBe(245); expect(a.p.totalAnswered).toBe(3)
  })
  it('união de eventos: ids iguais não duplicam, contadores de tempo usam o maior valor', () => {
    const x = E({ t: 'sec', sec: 10, id: 's' }), y = E({ t: 'sec', sec: 25, id: 's' }), z = E({ t: 'ans', qid: 'a', chosen: 'A', correct: true, id: 'z' })
    const r = mergeEvents([x, z], [y, z]); expect(r.length).toBe(2); expect((r.find(e => e.id === 's') as Extract<Ev, { t: 'sec' }>).sec).toBe(25)
  })
})

describe('propriedade: qualquer ordem de mesclagem converge (3 aparelhos, 60 execuções aleatórias)', () => {
  it('mesmo resultado em todas as ordens, sem duplicar XP nem eventos', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const R = rng(seed), devs = [device(), device(), device()], day = today()
      for (let i = 0; i < 25; i++) {
        const d = devs[Math.floor(R() * 3)], k = R()
        if (k < 0.5) d.answer(`q${Math.floor(R() * 12)}`, R() < 0.6)
        else if (k < 0.65) d.ev({ t: 'sec', sec: 15 * (1 + Math.floor(R() * 40)), id: `sec:${devs.indexOf(d)}:${day}` })
        else if (k < 0.8) d.ev({ t: 'fav', qid: `q${Math.floor(R() * 4)}`, on: R() < 0.5 })
        else if (k < 0.9) d.ev({ t: 'rwd', kind: 'mission', key: day, xp: 50, id: `rwd:mission:${day}` })
        else d.ev({ t: 'les', lid: `L${Math.floor(R() * 3)}`, id: `les:L${Math.floor(R() * 3)}` })
      }
      const [a, b, c] = devs.map(d => d.p), orders = [[a, b, c], [c, b, a], [b, c, a], [a, c, b]]
      const res = orders.map(o => o.reduce((acc, p) => mergeProgress(acc, p)))
      const ids = new Set(res[0].events.map(e => e.id)); expect(ids.size).toBe(res[0].events.length)
      for (const r of res) { expect(fingerprint(r)).toBe(fingerprint(res[0])); expect(fingerprint(mergeProgress(r, a))).toBe(fingerprint(r)) }
      const rewards = res[0].events.filter(e => e.t === 'rwd') as Extract<Ev, { t: 'rwd' }>[]
      expect(res[0].xp).toBe(rewards.reduce((s, e) => s + e.xp, 0))
    }
  })
})

describe('sanidade de tipos do estado', () => {
  it('estado reconstruído tem todos os campos usados pelas telas', () => {
    const p: Progress = normalize({}); for (const k of ['xp', 'completed', 'answers', 'cards', 'errors', 'daily', 'studyDays', 'favorites', 'reviewLog', 'notes', 'mocks', 'settings'] as const) expect(p[k]).toBeDefined()
  })
})
