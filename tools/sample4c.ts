// Fase 4C — amostra estratificada para a segunda auditoria (critérios definidos ANTES da leitura).
// Estratos obrigatórios (todos entram): (A) alterações normativas de 2026 / substitutas; (B) gabarito ou explicação alterados na 4B;
// (C) questões com prazo/exceção explícitos em Direito Processual (CPC/CPP) com PDFs de texto antigo+vigente; (D) complementações.
// Estrato aleatório: por disciplina, sorteio com semente fixa até o alvo: LI 12, DA 8, DC 6, DP 6, DPP 9, DPC 10, Lei 13.146 3.
import { QUESTIONS } from '../src/data/questions'
import { REVISIONS } from '../src/data/revisions'
import { AUDIT } from '../src/data/audit'
import { writeFileSync } from 'node:fs'
let seed = 20261112; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296
const pref: Record<string, string> = { 'Legislação Interna do TJSP': 'LI', 'Direito Administrativo': 'DA', 'Direito Constitucional': 'DC', 'Direito Penal': 'DP', 'Direito Processual Penal': 'DPP', 'Direito Processual Civil': 'DPC', 'Atualidades': 'AT' }
const target: Record<string, number> = { LI: 12, DA: 8, DC: 6, DP: 6, DPP: 9, DPC: 10, AT: 3 }
const mandatory = new Map<string, string[]>()
const add = (id: string, why: string) => mandatory.set(id, [...(mandatory.get(id) ?? []), why])
for (const r of REVISIONS) { if (r.kind === 'substituicao') { add(r.id, 'B: gabarito corrigido/substituído'); if (r.supersededBy) add(r.supersededBy, 'A/B: substituta') } else add(r.id, 'B/D: explicação alterada (' + r.kind + ')') }
for (const id of ['ip2-1', 'ip2-2', 'ird-4', 'aim-4']) add(id, 'A: alteração normativa de 2026 / pendência')
for (const q of QUESTIONS) { if (/^(dpc|dpp)/.test(q.topicId) && /\b(\d+ dias|prazo|exceto|salvo)\b/i.test(q.stem + q.options.find(o => o.id === q.answer)!.text)) add(q.id, 'C: prazo/exceção em CPC/CPP') }
const picked = new Set(mandatory.keys())
const rows: { id: string; estrato: string; disciplina: string }[] = []
const pool = QUESTIONS.filter(q => AUDIT[q.id] && pref[AUDIT[q.id].discipline] && q.validation === 'validada' && !picked.has(q.id))
const by: Record<string, string[]> = {}
for (const q of pool) (by[pref[AUDIT[q.id].discipline]] ??= []).push(q.id)
const have: Record<string, number> = {}
for (const id of picked) { const k = pref[AUDIT[id]?.discipline]; if (k) have[k] = (have[k] || 0) + 1 }
const random: string[] = []
for (const [k, ids] of Object.entries(by)) { const need = Math.max(0, target[k] - (have[k] || 0)); const a = [...ids]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } random.push(...a.slice(0, need)) }
const all = [...picked, ...random]
for (const id of all) rows.push({ id, estrato: mandatory.get(id)?.join('; ') ?? 'E: aleatória (semente 20261112)', disciplina: AUDIT[id]?.discipline ?? '?' })
writeFileSync('/tmp/claude-0/-home-claude/a3674ad1-9a84-5e0b-8255-163cb184c923/scratchpad/sample.json', JSON.stringify(rows, null, 1))
const c: Record<string, number> = {}; rows.forEach(r => (c[r.disciplina] = (c[r.disciplina] || 0) + 1)); console.log(rows.length, c)
console.log(rows.map(r => r.id).join(' '))
