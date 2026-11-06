import { AUDIT } from '../src/data/audit'
const v = Object.values(AUDIT); const c: Record<string, number> = {}
v.forEach(r => (c[r.proposed] = (c[r.proposed] || 0) + 1))
const byDisc: Record<string, Record<string, number>> = {}
v.forEach(r => { (byDisc[r.discipline] ??= {}); byDisc[r.discipline][r.proposed] = (byDisc[r.discipline][r.proposed] || 0) + 1 })
console.log(JSON.stringify({ total: v.length, status: c, comAchados: v.filter(r => r.issues.length).length, semReferencia: v.filter(r => !r.reference).length, humana: v.filter(r => r.methods.includes('validacao-humana')).length, normativa: v.filter(r => r.methods.includes('conferencia-normativa')).length, byDisc }, null, 1))
