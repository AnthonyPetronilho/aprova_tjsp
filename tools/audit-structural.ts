// Verificações ESTRUTURAIS e de coerência interna (não são conferência jurídica). Uso: npx tsx tools/audit-structural.ts
import { QUESTIONS } from '../src/data/questions'
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim()
const issues: Record<string, string[]> = {}, add = (id: string, m: string) => (issues[id] ??= []).push(m)
const sim = (a: string, b: string) => { const A = new Set(norm(a).split(' ')), B = new Set(norm(b).split(' ')); const i = [...A].filter(x => B.has(x)).length; return i / Math.max(1, Math.min(A.size, B.size)) }
for (const q of QUESTIONS) {
  const right = q.options.find(o => o.id === q.answer)!, wrong = q.options.filter(o => o.id !== q.answer)
  if (!/^correta/i.test(right.why)) add(q.id, `por que da alternativa correta (${right.id}) não começa com "Correta": "${right.why.slice(0, 50)}"`)
  for (const w of wrong) if (/^correta/i.test(w.why)) add(q.id, `alternativa errada ${w.id} explicada como "Correta"`)
  for (const w of wrong) if (!/^errada/i.test(w.why)) add(q.id, `alternativa errada ${w.id} não começa com "Errada"`)
  const texts = q.options.map(o => norm(o.text)); if (new Set(texts).size !== texts.length) add(q.id, 'alternativas com texto repetido')
  const L = q.options.map(o => o.text.length), mx = Math.max(...L); if (right.text.length === mx && right.text.length > 1.6 * (L.reduce((a, b) => a + b, 0) - mx) / (L.length - 1) && right.text.length > 40) add(q.id, 'a alternativa correta é bem mais longa que as demais (pista de gabarito)')
  if (q.stem.length < 25) add(q.id, 'enunciado muito curto')
  if (/\b(sempre|nunca|apenas|somente|exclusivamente)\b/i.test(right.text)) add(q.id, `alternativa correta contém absoluto ("${right.text.match(/\b(sempre|nunca|apenas|somente|exclusivamente)\b/i)![0]}") — conferir`)
  if (q.options.some(o => o.why.length < 25)) add(q.id, 'explicação de alternativa muito curta')
  if (/conforme a legislação|segundo a lei vigente|de acordo com a lei\.?$/i.test(right.why)) add(q.id, 'explicação genérica')
  if (!/(art\.|arts\.|artigo|lei |CF|CP|CPP|CPC|Res|Súmula|LC|Regimento|NSCGJ|§)/i.test(right.why + q.stem) && /^(dpenal|dpp|dpc|dconst|dadm|dint)/.test(q.topicId)) add(q.id, 'questão jurídica sem referência explícita a dispositivo no enunciado nem na explicação')
}
const ids = QUESTIONS, dups: string[][] = []
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if (ids[i].topicId === ids[j].topicId && sim(ids[i].stem, ids[j].stem) > 0.9) dups.push([ids[i].id, ids[j].id])
console.log(JSON.stringify({ comProblema: Object.keys(issues).length, porTipo: Object.values(issues).flat().map(m => m.replace(/\(.*?\)|".*?"|\b[A-E]\b/g, '').slice(0, 60)).reduce((a: Record<string, number>, k) => ((a[k] = (a[k] ?? 0) + 1), a), {}), parecidas: dups, issues }, null, 1))
