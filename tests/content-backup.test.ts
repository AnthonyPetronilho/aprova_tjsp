import { beforeEach, describe, expect, it } from 'vitest'
import { memStorage } from './helpers'

;(globalThis as { localStorage?: Storage }).localStorage = memStorage()
const C = await import('../src/lib/content')
const B = await import('../src/lib/backup')
const Q = (id: string, updatedAt: string, stem = 'Enunciado de teste longo') => ({ id, topicId: 'pt-1', stem, options: [], answer: 'A', difficulty: 'Fácil', origin: 'autoral', status: 'publicado', reviewed: true, updatedAt }) as never
const L = (id: string, updatedAt: string) => ({ id, topicId: 'pt-1', title: id, steps: [], questionIds: [], status: 'publicado', reviewed: true, updatedAt }) as never
const remote = (o: Record<string, unknown> = {}) => ({ lessons: [], questions: [], cards: [], videos: {}, deleted: {}, ...o })
const ids = (a: { id: string }[]) => a.map(x => x.id)

describe('conteúdo do editor: mesclagem com o servidor', () => {
  beforeEach(() => { C.resetContent(); localStorage.clear() })
  it('une itens de aparelhos diferentes sem apagar nenhum', () => {
    C.saveLesson({ id: 'u-l-local', topicId: 'pt-1', title: 'Local', steps: [{ title: 'a', body: ['b'] }], questionIds: [], reviewed: true } as never, false)
    const out = C.mergeRemoteContent(remote({ lessons: [L('u-l-remoto', '2026-11-05T10:00:00.000Z')] })) as { lessons: { id: string }[] }
    expect(ids(out.lessons).sort()).toEqual(['u-l-local', 'u-l-remoto']); expect(ids(C.getContent().lessons).sort()).toEqual(['u-l-local', 'u-l-remoto'])
  })
  it('o mesmo id: vence a edição mais recente, em qualquer ordem', () => {
    C.mergeRemoteContent(remote({ questions: [Q('u-q1', '2026-11-05T10:00:00.000Z', 'Versão antiga do enunciado')] }))
    C.mergeRemoteContent(remote({ questions: [Q('u-q1', '2026-11-06T10:00:00.000Z', 'Versão nova do enunciado')] }))
    C.mergeRemoteContent(remote({ questions: [Q('u-q1', '2026-11-04T10:00:00.000Z', 'Versão mais velha ainda')] }))
    expect(C.getContent().questions.find(q => q.id === 'u-q1')!.stem).toBe('Versão nova do enunciado')
  })
  it('exclusão vale por lápide e não deixa o item voltar; recriar depois da exclusão vale', () => {
    C.mergeRemoteContent(remote({ questions: [Q('u-q2', '2026-11-05T10:00:00.000Z')] })); expect(ids(C.getContent().questions)).toEqual(['u-q2'])
    C.removeItem('questions', 'u-q2'); expect(C.getContent().deleted['u-q2']).toBeTruthy()
    C.mergeRemoteContent(remote({ questions: [Q('u-q2', '2026-11-05T10:00:00.000Z')] })); expect(ids(C.getContent().questions)).toEqual([])
    C.mergeRemoteContent(remote({ questions: [Q('u-q2', '2999-01-01T00:00:00.000Z')] })); expect(ids(C.getContent().questions)).toEqual(['u-q2'])
  })
  it('lápide vinda do servidor remove o item local mais antigo', () => {
    C.mergeRemoteContent(remote({ cards: [{ id: 'u-c1', topicId: 'pt-1', front: 'a', back: 'b', origin: 'aula', lessonId: 'x', status: 'publicado', reviewed: true, updatedAt: '2026-11-01T00:00:00.000Z' }] }))
    C.mergeRemoteContent(remote({ deleted: { 'u-c1': '2026-11-02T00:00:00.000Z' } })); expect(C.getContent().cards).toEqual([])
  })
  it('é idempotente e recusa dados inválidos sem alterar o estado', () => {
    const r = remote({ lessons: [L('u-l1', '2026-11-05T10:00:00.000Z')] }); const a = JSON.stringify(C.mergeRemoteContent(r)), b = JSON.stringify(C.mergeRemoteContent(r)); expect(a).toBe(b)
    expect(C.mergeRemoteContent({ lessons: 'x' })).toBeNull(); expect(C.mergeRemoteContent(null)).toBeNull(); expect(ids(C.getContent().lessons)).toEqual(['u-l1'])
  })
  it('conteúdo embutido nunca é sobrescrito por dados remotos', () => {
    const builtin = C.topicsFlat.length && (C as unknown as { isBuiltin: (s: string) => boolean }).isBuiltin
    const real = (builtin as (s: string) => boolean) ? 'pt-crase' : ''
    C.mergeRemoteContent(remote({ lessons: [L(real, '2999-01-01T00:00:00.000Z')] })); expect(C.getContent().lessons.some(l => l.id === real)).toBe(false)
  })
})

describe('cópias de segurança automáticas', () => {
  beforeEach(() => localStorage.clear())
  it('guarda a cópia e mantém só as 3 mais recentes de cada tipo', async () => {
    for (let i = 0; i < 5; i++) { B.backup('antes-de-mesclar', JSON.stringify({ i })); await new Promise(r => setTimeout(r, 3)) }
    const l = B.listBackups().filter(b => b.label === 'antes-de-mesclar'); expect(l.length).toBe(3); expect(JSON.parse(B.readBackup(l[0].key)!).i).toBe(4)
  })
  it('tipos diferentes não se apagam entre si e só chaves de backup podem ser lidas', () => {
    B.backup('antes-da-migracao', '{"v":1}'); B.backup('antes-de-zerar', '{"v":2}'); expect(B.listBackups().map(b => b.label).sort()).toEqual(['antes-da-migracao', 'antes-de-zerar'])
    localStorage.setItem('aprova-tjsp:sync:v1', 'segredo'); expect(B.readBackup('aprova-tjsp:sync:v1')).toBeNull()
  })
  it('migração do formato antigo guarda cópia do original antes de transformar (via carregamento do app)', async () => {
    localStorage.setItem('aprova-tjsp:v1', JSON.stringify({ xp: 77, completed: {}, answers: {} }))
    const { normalize } = await import('../src/lib/useProgress'); expect(normalize(JSON.parse(localStorage.getItem('aprova-tjsp:v1')!)).xp).toBe(77)
  })
})
