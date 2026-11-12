import { QUESTIONS } from '../src/data/questions'
const pre = process.argv.slice(2)
for (const q of QUESTIONS) {
  if (!pre.some(x => q.id.startsWith(x))) continue
  console.log(`# ${q.id} [${q.validation}] gab=${q.answer}: ${q.stem}`)
  q.options.forEach(o => console.log(`  ${o.id}${o.id === q.answer ? '*' : ' '}) ${o.text}  ← ${o.why}`))
}
