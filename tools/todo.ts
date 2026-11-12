import { QUESTIONS } from '../src/data/questions'
import { DOC_AUDIT_BY_ID } from '../src/data/audit-docs'
const m: Record<string, string[]> = {}
for (const q of QUESTIONS) { if (DOC_AUDIT_BY_ID[q.id]) continue; (m[q.topicId] ||= []).push(q.id) }
for (const [k, v] of Object.entries(m)) console.log(k, v.length, v.slice(0, 3).join(','), '..', v[v.length - 1])
console.log('total', Object.values(m).reduce((a, b) => a + b.length, 0))
