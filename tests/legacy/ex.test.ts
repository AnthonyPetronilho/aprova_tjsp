import { QUESTIONS } from '../../src/data/questions'
// confere, por cálculo, as contas das questões numéricas e que o gabarito é a alternativa correta
const q = (id: string) => QUESTIONS.find(x => x.id === id)!, txt = (id: string) => q(id).options.find(o => o.id === q(id).answer)!.text
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a, lcm = (a: number, b: number) => a * b / gcd(a, b)
const eq = (a: unknown, b: unknown, m: string) => { if (a !== b) { console.error('FALHA', m, a, b); throw new Error(m) } console.log('ok -', m) }
eq(txt('mmc-1'), String(gcd(48, 72)), 'mmc-1'); eq(txt('mmc-2'), String(lcm(12, 18)), 'mmc-2')
eq(txt('mmc-3'), String(120 / gcd(120, 180) + 180 / gcd(120, 180)), 'mmc-3'); eq(txt('mmc-4'), String(72 * 6 / 18), 'mmc-4')
eq(txt('mmc-5'), '9 h', 'mmc-5'); eq(lcm(lcm(10, 12), 15), 60, 'lcm 3')
eq(txt('porc-1'), String(0.15 * 240), 'porc-1'); eq(txt('porc-2'), 'R$ ' + (80 * 1.25 * 0.8).toFixed(2).replace('.', ',') , 'porc-2')
eq(txt('porc-3'), 'R$ 2.' + String(2500 * 1.08).slice(1) + ',00', 'porc-3'); eq(txt('porc-4'), '25%', 'porc-4'); eq(txt('porc-5'), 'R$ ' + (160 / 0.8).toFixed(2).replace('.', ','), 'porc-5')
eq(txt('diag-5'), String(40 - (25 + 18 - 8)), 'diag-5')
// as questões novas não podem ter gabarito sempre na mesma letra
const l = QUESTIONS.filter(x => /^(mmc|porc|estr|diag)-/.test(x.id)).map(x => x.answer); console.log(l.join(''))
for (const c of 'ABCDE') if (!l.includes(c as never)) { console.error('letra ausente', c); throw new Error('letra ausente ' + c) }
console.log('CONTAS OK')

import { it } from 'vitest'
it('script legado: ex executa sem falhas', () => {})
