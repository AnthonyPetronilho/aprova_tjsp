import { QUESTIONS } from '../src/data/questions'
const p = process.argv.slice(2)
for (const q of QUESTIONS) {
  if (!p.some(x => q.id.startsWith(x) || q.topicId.startsWith(x))) continue
  const c = q.options.find(o=>o.id===q.answer)!
  console.log(`${q.id}|${q.stem.slice(0,230)}\n  => ${c.text.slice(0,170)} || ${c.why.slice(0,200)}`)
}
