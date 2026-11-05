import { parseVideo } from '../../src/lib/video'
import * as C from '../../src/lib/content'
import { LESSONS } from '../../src/data/lessons'
import { QUESTIONS } from '../../src/data/questions'
import { FLASHCARDS } from '../../src/data/cards'
const eq = (a: unknown, b: unknown, m: string) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error('FALHA', m, 'obtido', JSON.stringify(a), 'esperado', JSON.stringify(b)); throw new Error(m) } console.log('ok -', m) }
const mem: Record<string, string> = {}; (globalThis as any).localStorage = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v } }
// vídeo
const id = 'dQw4w9WgXcQ'
for (const u of [`https://www.youtube.com/watch?v=${id}`, `https://youtu.be/${id}?t=30`, `https://m.youtube.com/shorts/${id}`, `https://www.youtube.com/embed/${id}`]) eq((parseVideo(u) as any)?.embedUrl?.startsWith(`https://www.youtube-nocookie.com/embed/${id}`), true, 'yt ' + u)
eq((parseVideo(`https://youtu.be/${id}?t=30`) as any).embedUrl.endsWith('?start=30'), true, 'início em segundos')
eq((parseVideo('https://vimeo.com/123456789') as any).embedUrl, 'https://player.vimeo.com/video/123456789', 'vimeo')
eq(parseVideo('http://youtu.be/' + id), null, 'http recusado')
eq(parseVideo('javascript:alert(1)'), null, 'javascript: recusado')
eq(parseVideo('https://www.youtube.com/watch?v=curto'), null, 'id inválido')
eq(parseVideo('lixo'), null, 'texto não é url')
eq(parseVideo('https://exemplo.com/aula')?.kind, 'link', 'outro https vira link externo')
eq(parseVideo('https://evil.com/?https://youtube.com/watch?v=' + id)?.kind, 'link', 'domínio falso não vira embed')
// conteúdo
C.loadContent()
const n0 = [LESSONS.length, QUESTIONS.length, FLASHCARDS.length]
const goodQ = { id: 'u-q-1', topicId: 'pt-12', stem: 'Qual frase usa corretamente a crase?', answer: 'B' as const, difficulty: 'Médio' as const, origin: 'autoral' as const, options: (['A', 'B', 'C', 'D', 'E'] as const).map(o => ({ id: o, text: 'alt ' + o, why: 'porque ' + o })) }
eq(C.saveQuestion({ ...goodQ, reviewed: false }, true).length, 1, 'publicar sem conferir é bloqueado')
eq(QUESTIONS.length, n0[1], 'nada entra no banco sem publicar')
eq(C.saveQuestion({ ...goodQ, stem: 'curto', reviewed: true }, true).length > 0, true, 'enunciado curto bloqueia')
eq(C.saveQuestion({ ...goodQ, options: goodQ.options.map(o => ({ ...o, text: 'igual' })), reviewed: true }, true).some(e => e.includes('repetido')), true, 'alternativas repetidas bloqueiam')
eq(C.saveQuestion({ ...goodQ, topicId: 'nao-existe', reviewed: true }, true).length, 1, 'assunto inexistente bloqueia')
eq(C.saveQuestion({ ...goodQ, reviewed: true }, false), [], 'rascunho salva')
eq(QUESTIONS.length, n0[1], 'rascunho não entra no banco')
eq(C.saveQuestion({ ...goodQ, reviewed: true }, true), [], 'publica')
eq(QUESTIONS.length, n0[1] + 1, 'publicada entra no banco (mesmo array do app)')
const lesson = { id: 'u-l-1', topicId: 'pt-12', title: 'Minha aula', steps: [{ title: 'E1', body: ['texto', '', '  '] }], questionIds: ['u-q-1', 'fantasma'], video: { url: `https://youtu.be/${id}` } }
eq(C.saveLesson({ ...lesson, video: { url: 'http://x' }, reviewed: true }, true).length > 0, true, 'vídeo inválido bloqueia aula')
eq(C.saveLesson({ ...lesson, reviewed: true }, true), [], 'aula publicada')
eq(LESSONS.length, n0[0] + 1, 'aula entra em LESSONS')
const L = LESSONS.find(l => l.id === 'u-l-1')!
eq([L.questionIds, L.steps[0].body], [['u-q-1'], ['texto']], 'limpa questão fantasma e parágrafos vazios')
eq(C.saveCard({ id: 'u-c-1', topicId: 'pt-12', front: 'f', back: 'b', origin: 'aula', lessonId: 'u-l-1', reviewed: true }, true), [], 'card publicado')
eq(FLASHCARDS.length, n0[2] + 1, 'card no baralho')
eq(C.saveCard({ id: 'u-c-2', topicId: 'pt-12', front: 'f', back: 'b', origin: 'aula', reviewed: true }, true).length, 1, 'card sem aula bloqueia')
// vídeo em aula embutida
C.setVideo('pt-crase', { url: `https://youtu.be/${id}` }); eq(LESSONS.find(l => l.id === 'pt-crase')!.video?.url, `https://youtu.be/${id}`, 'vídeo em aula do app')
C.setVideo('pt-crase', null); eq(LESSONS.find(l => l.id === 'pt-crase')!.video, undefined, 'remove vídeo')
// persistência: recarrega
const snap = mem['aprova-tjsp:content:v1']; C.loadContent()
eq([LESSONS.length, QUESTIONS.length, FLASHCARDS.length], [n0[0] + 1, n0[1] + 1, n0[2] + 1], 'recarregar não duplica nem perde')
// importação
eq(C.importContent({ foo: 1 }).ok, false, 'importa inválido → recusa')
const exp = JSON.parse(C.exportContent()); eq(C.importContent(exp), { ok: true, added: 0 }, 'reimportar o mesmo não duplica')
eq(C.importContent({ ...exp, questions: [{ ...goodQ, id: 'crase-1', status: 'publicado' }], lessons: [], cards: [] }).added, 0, 'import não sobrescreve conteúdo do app')
eq(QUESTIONS.filter(q => q.id === 'crase-1').length, 1, 'id do app continua único')
// excluir questão remove da aula
C.removeItem('questions', 'u-q-1'); eq([QUESTIONS.length, LESSONS.find(l => l.id === 'u-l-1')!.questionIds], [n0[1], []], 'excluir questão limpa a aula')
C.removeItem('questions', 'crase-1'); eq(QUESTIONS.length, n0[1], 'conteúdo do app não é excluível')
C.removeItem('lessons', 'u-l-1'); eq(LESSONS.length, n0[0], 'excluir aula'); eq(C.getContent().cards[0].status, 'rascunho', 'card órfão volta a rascunho')
C.resetContent(); eq([LESSONS.length, QUESTIONS.length, FLASHCARDS.length], n0, 'reset volta ao conteúdo do app')
console.log('ADMIN LÓGICA OK')

import { it } from 'vitest'
it('script legado: admin executa sem falhas', () => {})
