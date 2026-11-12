// Fase 4B — gera o resultado individual de todas as questões (CSV + JSON), relatórios por lote e dados para o relatório final.
import { writeFileSync, mkdirSync } from 'node:fs'
import { RAW_QUESTIONS } from '../src/data/questions-raw'
import { QUESTIONS } from '../src/data/questions'
import { AUDIT, AUDIT_DATE } from '../src/data/audit'
import { DOC_AUDIT } from '../src/data/audit-docs'
import { REVISIONS, supersededIds } from '../src/data/revisions'
import { DISCIPLINES } from '../src/data/edital'

const topicName = new Map<string, string>(); DISCIPLINES.forEach(d => d.topics.forEach(t => topicName.set(t.id, t.name)))
const docBy = new Map(DOC_AUDIT.map(d => [d.id, d]))
const sup = supersededIds()
const final = new Map(QUESTIONS.map(q => [q.id, q]))
const METH: Record<string, string> = {
  'revisao-ia-textual': 'Revisão textual por IA (não humana)',
  'conferencia-normativa': 'Conferência documental por IA (não humana)',
  'calculo-automatizado': 'Verificação automatizada (ferramenta)',
  'validacao-humana': 'Revisão humana',
}
const REVIEW_LABEL: Record<string, string> = { validada: 'Validada', 'precisa-correcao': 'Precisa de correção', 'precisa-complementacao': 'Precisa de complementação', pendente: 'Pendente' }
const rows = RAW_QUESTIONS.map(r => {
  const a = AUDIT[r.id]; const d = docBy.get(r.id); const q = final.get(r.id) ?? r
  const revs = REVISIONS.filter(x => x.id === r.id)
  return {
    id: r.id, disciplina: a.discipline, assuntoId: r.topicId, assunto: topicName.get(r.topicId) ?? '',
    lote: d ? (d.lote ?? '01') : '—', status: REVIEW_LABEL[a.proposed], statusId: a.proposed, statusAnterior: REVIEW_LABEL[a.previous],
    metodos: a.methods.map(m => METH[m]).join(' + '), revisaoHumana: a.methods.includes('validacao-humana') ? 'sim' : 'não',
    gabarito: q.answer, fonte: d?.source ?? a.reference, dispositivo: d?.provision ?? '', paginas: d?.pages ?? '', trecho: d?.excerpt ?? '',
    resultadoDocumental: d?.result ?? '', versaoQuestao: revs.reduce((m, x) => Math.max(m, x.version), 1),
    revisoes: revs.map(x => `v${x.version} ${x.kind}${x.supersededBy ? ' → ' + x.supersededBy : ''}`).join('; '),
    substituidaPor: revs.find(x => x.supersededBy)?.supersededBy ?? '', excluidaDoBanco: sup.has(r.id) ? 'sim' : 'não',
    origem: r.origin ?? '', achados: [...a.issues, ...(d?.note ? [d.note] : [])].join(' | '), pendencias: [...a.pendencies, ...(d?.pendencies ?? [])].join(' | '),
    verificacao: a.verification,
  }
})
mkdirSync('docs', { recursive: true })
const cols = Object.keys(rows[0]) as (keyof typeof rows[0])[]
const esc = (s: unknown) => '"' + String(s ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"'
writeFileSync('docs/FASE-4B-RESULTADO-QUESTOES.csv', '﻿' + [cols.map(esc).join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n'))
writeFileSync('docs/FASE-4B-RESULTADO-QUESTOES.json', JSON.stringify({ geradoEm: AUDIT_DATE, aviso: 'Revisão por IA não é revisão humana. "Validada" = confirmada pelo método indicado, não por revisor humano.', total: rows.length, questoes: rows }, null, 1))
// re-exporta o registro estruturado da Fase 4
writeFileSync('docs/FASE-4-AUDITORIA.json', JSON.stringify({ geradoEm: AUDIT_DATE, aviso: 'Registro de auditoria por questão. Revisão por IA não é revisão humana.', registros: Object.values(AUDIT) }, null, 1))

// contagens
const cnt = (f: (r: typeof rows[0]) => string) => { const m: Record<string, Record<string, number>> = {}; rows.forEach(r => { const k = f(r); (m[k] ??= {}); m[k][r.statusId] = (m[k][r.statusId] || 0) + 1 }); return m }
const byDisc = cnt(r => r.disciplina), byLote = cnt(r => r.lote)
writeFileSync('/tmp/4b-counts.json', JSON.stringify({ byDisc, byLote }, null, 1))
const T = (m: Record<string, Record<string, number>>) => {
  const o = ['| Grupo | Total | Validada | Precisa de correção | Precisa de complementação | Pendente |', '|---|---:|---:|---:|---:|---:|']
  let t = [0, 0, 0, 0, 0]
  Object.entries(m).sort().forEach(([k, v]) => { const a = [v.validada || 0, v['precisa-correcao'] || 0, v['precisa-complementacao'] || 0, v.pendente || 0]; const s = a.reduce((x, y) => x + y, 0); o.push(`| ${k} | ${s} | ${a.join(' | ')} |`); t = t.map((x, i) => x + (i === 0 ? s : a[i - 1])) })
  o.push(`| **Total** | **${t[0]}** | **${t[1]}** | **${t[2]}** | **${t[3]}** | **${t[4]}** |`); return o.join('\n')
}
writeFileSync('/tmp/4b-table-disc.md', T(byDisc)); writeFileSync('/tmp/4b-table-lote.md', T(byLote))

// relatórios por lote
const LOTE_NAME: Record<string, string> = { '01': 'Legislação Interna — Res. 850, Res. 963, LC 1.111 (piloto)', '02': 'Legislação Interna — Regimento Interno e NSCGJ', '03': 'Direito Administrativo', '04': 'Direito Constitucional', '05': 'Direito Penal', '06': 'Direito Processual Penal e Lei 9.099', '07': 'Direito Processual Civil', '08': 'Língua Portuguesa', '09': 'Informática', '10': 'Raciocínio Lógico', '11': 'Atualidades e Lei 13.146/2015' }
for (const [lote, nome] of Object.entries(LOTE_NAME)) {
  const rs = rows.filter(r => r.lote === lote); if (!rs.length) continue
  const c: Record<string, number> = {}; rs.forEach(r => (c[r.status] = (c[r.status] || 0) + 1))
  const L = [`# Fase 4B — Lote ${lote}: ${nome}`, '', `Gerado em ${AUDIT_DATE}. Conferência feita por IA (documental/automatizada); **nenhuma revisão humana**.`, '', `Questões com conferência documental registrada neste lote: **${rs.length}**.`, '', Object.entries(c).map(([k, v]) => `- ${k}: ${v}`).join('\n'), '', '## Questões', '', '| ID | Status | Método | Fonte / dispositivo | Págs. | Resultado | Pendências |', '|---|---|---|---|---|---|---|']
  rs.forEach(r => L.push(`| ${r.id} | ${r.status} | ${r.metodos} | ${(r.fonte + (r.dispositivo ? ' — ' + r.dispositivo : '')).replace(/\|/g, '/').slice(0, 220)} | ${r.paginas} | ${r.resultadoDocumental} | ${(r.pendencias || r.achados).replace(/\|/g, '/').slice(0, 260)} |`))
  writeFileSync(`docs/FASE-4B-LOTE-${lote}.md`, L.join('\n') + '\n')
}
console.log(JSON.stringify({ total: rows.length, lotes: Object.fromEntries(Object.entries(byLote).map(([k, v]) => [k, v])) }))
