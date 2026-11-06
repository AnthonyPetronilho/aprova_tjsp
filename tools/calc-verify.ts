import { QUESTIONS } from '../src/data/questions'
import { CALC_CHECKS, NEW_CALC } from '../src/data/calc-checks'
import { numbersOf } from '../src/lib/numparse'
let ok = 0; const bad: string[] = []
for (const c of [...CALC_CHECKS, ...NEW_CALC]) {
  const q = QUESTIONS.find(x => x.id === c.id)
  if (!q) { bad.push(c.id + ': inexistente'); continue }
  const right = q.options.find(o => o.id === q.answer)!
  const got = numbersOf(right.text)
  const same = (a: number[], b: number[]) => b.every(v => a.some(x => Math.abs(x - v) < 1e-9))
  const good = same(got, c.values)
  const others = q.options.filter(o => o.id !== q.answer && same(numbersOf(o.text), c.values) && !(c.equivalentDistractors || []).includes(o.id))
  if (good && !others.length) ok++; else bad.push(`${c.id}: gab=${right.text} esperado=${c.values} outras=${others.map(o => o.id)}`)
}
console.log({ total: CALC_CHECKS.length, ok, bad })
