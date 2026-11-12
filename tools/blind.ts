import { QUESTIONS } from '../src/data/questions'
import { DOC_AUDIT_BY_ID } from '../src/data/audit-docs'
for (const id of process.argv.slice(2)) {
  const q = QUESTIONS.find(x => x.id === id); if (!q) { console.log('# ' + id + ' ?'); continue }
  const d = DOC_AUDIT_BY_ID[id]
  console.log(`# ${id} | ${d ? d.provision : '—'} | ${d ? d.source.slice(0, 40) : ''}`)
  console.log(q.stem); q.options.forEach(o => console.log(`  ${o.id}) ${o.text}`))
}
