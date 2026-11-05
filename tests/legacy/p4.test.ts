import { normalize } from '../../src/lib/useProgress'
import { buildTemplate, allocate, interleave, dayBlocks, missed, blocksPerDay, weights, finalStart } from '../../src/lib/plan'
import { AREAS, availability, canStartComplete, pickQuick, pickComplete, analyze } from '../../src/lib/mocks'
import { analyzeEssay, copiedShare } from '../../src/lib/essay'
import { THEMES } from '../../src/data/essays'
import { addDays, todayStr } from '../../src/lib/dates'
import { EXAM_DATE } from '../../src/config'
const eq = (a: unknown, b: unknown, m: string) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error('FALHA', m, 'obtido', JSON.stringify(a), 'esperado', JSON.stringify(b)); throw new Error(m) } console.log('ok -', m) }
const tr = (c: boolean, m: string) => eq(c, true, m)
const p0 = normalize({}), t = todayStr()
// ---- plano
const S = { weekdays: [1, 2, 3, 4, 5], hoursPerDay: 2, level: 'iniciante' as const, hard: ['dpenal'], style: 'misto' as const }
eq(blocksPerDay(2), 4, '2h = 4 blocos'); eq(blocksPerDay(0.5), 1, '0,5h = 1 bloco'); eq(blocksPerDay(20), 16, 'teto 16 blocos')
const al = allocate(30, weights(p0, S)); eq(Object.values(al).reduce((a, b) => a + b, 0), 30, 'alocação soma o total'); tr(Object.values(al).every(v => v >= 1), 'toda matéria recebe ≥1 bloco')
tr(al.pt > al.mat, 'Português (16q) recebe mais que Matemática (4q)')
eq(Object.values(allocate(5, weights(p0, S))).reduce((a, b) => a + b, 0), 5, 'poucos blocos: soma ok')
const seq = interleave({ a: 3, b: 3, c: 1 }, ['a', 'b', 'c']); eq(seq.length, 7, 'interleave mantém total'); tr(seq.every((x, i) => i === 0 || x !== seq[i - 1]), 'interleave sem repetição seguida')
const tpl = buildTemplate(p0, S); const flat = tpl.flat(); const cnt = (id: string) => flat.filter(b => b.disc === id).length
tr(cnt('dpenal') > cnt('dpp'), `matéria difícil marcada recebe mais blocos (${cnt('dpenal')} > ${cnt('dpp')})`); tr(cnt('pt') > cnt('mat'), 'Português recebe mais que Matemática no ciclo'); tr(tpl.length >= 5, `ciclo de ${tpl.length / 5} semana(s)`)
tr(flat.length === tpl.length * 4, 'cada dia tem 4 blocos'); tr(new Set(flat.map(b => b.disc)).size >= 11, 'ciclo cobre todas as 11 matérias')
tr(tpl.filter((_, i) => i % 5 === 4).every(d => d[d.length - 1].kind === 'revisao'), 'último dia de cada semana termina com revisão geral')
tr(flat.every(b => b.min === 30), 'blocos de 30 min')
const tiny = buildTemplate(p0, { ...S, weekdays: [6], hoursPerDay: 0.5 }); tr(tiny.length >= 1 && tiny.flat().length >= 1, 'carga mínima não quebra')
const plan = { settings: S, createdAt: t, from: t, template: tpl }
let d = t; while (new Date(d + 'T12:00:00').getDay() === 0 || new Date(d + 'T12:00:00').getDay() === 6) d = addDays(d, 1)
eq(dayBlocks(plan, d)!.length, 4, 'dia útil tem blocos')
const sat = (() => { let x = t; while (new Date(x + 'T12:00:00').getDay() !== 6) x = addDays(x, 1); return x })(); eq(dayBlocks(plan, sat), null, 'sábado fora dos dias escolhidos = null')
eq(dayBlocks(plan, EXAM_DATE), null, 'dia da prova sem estudo'); eq(dayBlocks(plan, addDays(EXAM_DATE, 3)), null, 'depois da prova sem estudo')
const fs = finalStart(); let fd = fs; while ([0, 6].includes(new Date(fd + 'T12:00:00').getDay())) fd = addDays(fd, 1)
tr(dayBlocks(plan, fd)!.every(b => ['simulado', 'revisao', 'erros'].includes(b.kind) && b.disc === 'geral'), 'reta final: só simulado/revisão/erros')
eq(dayBlocks({ ...plan, from: addDays(t, 3) }, t), null, 'antes do início do plano = null')
// pendências: plano começou há 3 dias, nada marcado
const old = { ...p0, plan: { ...plan, from: addDays(t, -3) }, planMarks: {} }
const m1 = missed(old, addDays(t, -3), t); tr(m1.length > 0, 'pendências detectadas'); tr(m1.every(x => x.date < t), 'pendências só de dias passados')
const first = m1[0]; const m2 = missed({ ...old, planMarks: { [first.date]: { [first.idx]: 'done' as const } } }, addDays(t, -3), t); eq(m2.length, m1.length - 1, 'marcar feito remove pendência')
const m3 = missed({ ...old, planMarks: { [first.date]: { [first.idx]: 'skip' as const } } }, addDays(t, -3), t); eq(m3.length, m1.length - 1, 'dispensar também remove (sem culpa)')
// ---- simulados
const av = availability(); eq(av.map(a => a.n), [16, 30, 4, 4, 9, 7], 'distribuição 16/30/4/4/9/7'); eq(AREAS.reduce((a, b) => a + b.n, 0), 70, 'total 70')
eq(canStartComplete(), true, 'banco atual comporta simulado completo'); { const pc = pickComplete(); eq(!!pc && pc.length, 70, 'pickComplete devolve 70 questões'); eq(new Set(pc!).size, 70, 'sem repetidas') }
const q10 = pickQuick(p0, 10, 'auto'); eq(q10.length, 10, 'rápido automático pega as 10 do banco'); eq(new Set(q10).size, 10, 'sem repetição')
eq(pickQuick(p0, 5, ['dpenal']).every(i => /^(pec|fals|p313|p319|p328|p336|p342)-/.test(i)) && pickQuick(p0, 5, ['dpenal']).length === 5, true, 'manual por matéria filtra só Direito Penal')
const wrongPec = { ...p0, errors: { 'pec-1': { count: 1, lastAt: t, resolved: false } } }; let hits = 0; for (let i = 0; i < 30; i++) if (pickQuick(wrongPec, 1, 'auto')[0] === 'pec-1') hits++; tr(hits >= 25, `auto prioriza erro em aberto (${hits}/30)`)
const res = { id: 'x', kind: 'rapido' as const, date: t, secondsUsed: 60, qids: ['crase-1', 'crase-2', 'pec-1', 'pec-2'], answers: { 'crase-1': 'C', 'crase-2': 'A', 'pec-1': 'C' } as Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>, correct: 2, wrong: 1, blank: 1, score: 5 }
const an = analyze(res); eq(an.byArea.map(a => [a.id, a.correct, a.total]), [['pt', 1, 2], ['dir', 1, 2]], 'análise por área'); eq(an.rules, null, 'rápido não aplica critérios eliminatórios'); eq(an.review.length, 2, 'tópicos para revisar (erro + em branco)')
// critérios do completo: simulando 70 questões sintéticas
import { QUESTIONS } from '../../src/data/questions'
const mk = (ptOk: number, dirOk: number, score: number) => { const base = { ...res, kind: 'completo' as const, score }; const pt = QUESTIONS.filter(q => q.topicId === 'pt-12'); const dir = QUESTIONS.filter(q => q.topicId === 'dpenal-2'); const ans: Record<string, any> = {}; pt.forEach((q, i) => ans[q.id] = i < ptOk ? q.answer : 'A' === q.answer ? 'B' : 'A'); dir.forEach((q, i) => ans[q.id] = i < dirOk ? q.answer : 'A' === q.answer ? 'B' : 'A'); return analyze({ ...base, qids: [...pt, ...dir].map(q => q.id), answers: ans }) }
const ok1 = mk(3, 3, 6).rules!; eq(ok1.map(r => r.ok), [true, true, true], '≥50% nos blocos e nota ≥5 = cumpriu')
const ok2 = mk(2, 3, 6).rules!; eq(ok2[0].ok, false, 'Bloco I abaixo de 50% reprova no critério')
const ok3 = mk(3, 3, 4.9).rules!; eq(ok3[2].ok, false, 'nota < 5,0 reprova no critério')
// ---- redação
const th = THEMES[0], src = th.texts
const weak = 'A linguagem simples é essencial para que o cidadão compreenda decisões judiciais e exerça seus direitos de modo efetivo.\n\nEm primeiro lugar, termos excessivamente técnicos criam barreiras entre a instituição e quem a procura. Consequentemente, prazos podem ser perdidos, o que compromete garantias fundamentais. Além disso, a desconfiança social tende a crescer.\n\nPortanto, os órgãos públicos devem adotar comunicados claros e objetivos.'
const good = 'A linguagem simples é essencial para que o cidadão compreenda decisões judiciais e exerça seus direitos de modo efetivo. Sem ela, o acesso formal à Justiça perde parte de seu sentido prático.\n\nEm primeiro lugar, termos excessivamente técnicos criam barreiras entre a instituição e quem a procura. Consequentemente, prazos podem ser perdidos, o que compromete garantias fundamentais. Além disso, a desconfiança social tende a crescer.\n\nPortanto, os órgãos públicos devem adotar comunicados claros e objetivos. Treinamento contínuo dos servidores e revisão periódica dos modelos de documentos completam a solução.'
const g = analyzeEssay(good, src); eq(g.flags.filter(f => f.level === 'atencao').length, 0, 'texto bom: nenhum ponto de atenção'); eq(g.paragraphs, 3, '3 parágrafos')
eq(analyzeEssay(weak, src).flags.some(f => f.id === 'periodo-unico'), true, 'aponta predominância de parágrafos de um só período (introdução e conclusão de 1 frase)')
eq(analyzeEssay('Texto curto.', src).flags.some(f => f.id === 'curto'), true, 'aponta texto curto')
eq(analyzeEssay(good.replace(/\n+/g, ' '), src).flags.some(f => f.id === 'monobloco'), true, 'aponta monobloco')
eq(analyzeEssay(good + ' Eu acho que isso é importante.', src).flags.some(f => f.id === 'primeira'), true, 'aponta 1ª pessoa')
eq(analyzeEssay(good + ' Você deve entender isso.', src).flags.some(f => f.id === 'segunda'), true, 'aponta 2ª pessoa')
eq(analyzeEssay(good + ' Como afirma o primeiro texto, isso importa.', src).flags.some(f => f.id === 'referencia'), true, 'aponta referência direta ao texto de apoio')
eq(analyzeEssay(good + ' Conforme o texto I, tudo muda.', src).flags.some(f => f.id === 'referencia'), true, 'aponta "texto I"')
const copy = src.join('\n\n') ; eq(analyzeEssay(copy, src).flags.some(f => f.id === 'copia'), true, 'aponta cópia da coletânea'); tr(copiedShare(good, src) < 0.1, 'texto original quase sem cópia')
eq(analyzeEssay('', src).words, 0, 'vazio seguro'); tr(THEMES.length >= 4 && THEMES.every(t => t.texts.length >= 2 && t.prompt && t.tip), 'temas completos')
eq(analyzeEssay('Os meios são úteis. Meus colegas também. A mesma ideia.\n\nOutro parágrafo qualquer com bastante texto e muito conteúdo relevante sobre o assunto em debate aqui hoje.', src).flags.some(f => f.id === 'primeira'), true, 'detecta “meus”')
eq(analyzeEssay('O sistema promove a igualdade entre os cidadãos perante a lei de maneira ampla e irrestrita em todo o território nacional brasileiro.\n\nOs resultados demonstram a eficácia dessa medida para toda a sociedade brasileira atual.\n\nConclui-se que o caminho é positivo para o país inteiro nos próximos anos.', src).flags.some(f => f.id === 'primeira'), false, 'sem falso positivo de 1ª pessoa em texto impessoal')
console.log('P4 LÓGICA OK')

import { it } from 'vitest'
it('script legado: p4 executa sem falhas', () => {})
