// Despeja questões de um assunto/disciplina em texto compacto para revisão. Uso: npx tsx tools/dump.ts <prefixo-de-assunto>
import { QUESTIONS } from '../src/data/questions'
const pre = process.argv[2] ?? ''
const ids = process.argv.slice(3)
for (const q of QUESTIONS.filter(q => (ids.length ? ids.includes(q.id) : q.topicId === pre || q.topicId.startsWith(pre + '-')))) {
  console.log(`## ${q.id} [${q.topicId}] ${q.difficulty} gab=${q.answer}\n${q.stem}`)
  for (const o of q.options) console.log(`${o.id}) ${o.text}\n   ↳ ${o.why}`)
}
