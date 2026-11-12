import { QUESTIONS } from '../src/data/questions'
const pre = process.argv.slice(2)
for (const q of QUESTIONS) {
  if (!pre.some(x => q.id.startsWith(x) || q.topicId.startsWith(x))) continue
  console.log(`# ${q.id} gab=${q.answer}: ${q.stem}`)
  console.log(q.options.map(o => `${o.id}${o.id === q.answer ? '*' : ''}) ${o.text}`).join(' | '))
  const w = q.options.find(o => o.id === q.answer)!.why; console.log('  expl: ' + w)
}
