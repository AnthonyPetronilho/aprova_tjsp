// Fase 4C — exporta a tabela da segunda auditoria (amostra estratificada) e o registro por questão.
// A "segunda auditoria" é uma releitura feita pela MESMA IA (leitura cega do enunciado/alternativas, derivação da resposta
// no texto-fonte, e só depois comparação com o gabarito armazenado). NÃO equivale a revisão humana independente.
import { readFileSync, writeFileSync } from 'node:fs'
import { QUESTIONS } from '../src/data/questions'
import { AUDIT } from '../src/data/audit'
import { DOC_AUDIT_BY_ID } from '../src/data/audit-docs'

const sample: { id: string; estrato: string; disciplina: string }[] = JSON.parse(readFileSync('tools/second-audit-sample.json', 'utf8'))
const blind: Record<string, { blind: string; src: string }> = JSON.parse(readFileSync('tools/second-audit-blind.json', 'utf8'))
const MANUAL: Record<string, string> = {
  'ip2-3': 'Reanalisada na etapa D (sem leitura cega): permanece "precisa de complementação"; reformulação proposta, não aplicada.',
  'aim-4': 'Reanalisada na etapa D (sem leitura cega): permanece "precisa de complementação"; reformulação proposta, não aplicada.',
  'ip2-1': 'Reanalisada na etapa D: Assentos 594/595 datados; pendência de Assentos 593/596/597 mantida.',
  'ip2-2': 'Reanalisada na etapa D: pendência de Prov. CG 04/2026 mantida (texto não localizado).',
  'soc-2': 'Etapa A: EC 141/2026 confirmada em fontes oficiais (DOU/Câmara); questão corrigida por transição do art. 6º.',
  'soc-2b': 'Etapa A: substituta autoral; mantida Pendente (ambiguidade texto permanente x transição).',
  'ppj-4': 'Gabarito substituído na 4B (ppj-4b).', 'ppj-4b': 'Substituta autoral; Pendente.',
  'estr-1': 'Gabarito substituído na 4B (estr-1b).', 'estr-1b': 'Substituta autoral; Pendente.',
  'pcl-4': 'Etapa D: item defasado quanto ao recorte da Lei 9.099; substituído por pcl-4b.', 'pcl-4b': 'Substituta autoral (art. 18, §3º, Lei 9.099); Pendente.',
  'conc-5': 'Etapa B: explicação corrigida (alternativa A, "ides"); gabarito mantido.',
  'clas-5': 'Etapa B: explicação complementada (alternativa C); gabarito mantido.',
}
const rows = sample.map(s => {
  const q = QUESTIONS.find(x => x.id === s.id)!, a = AUDIT[s.id], d = DOC_AUDIT_BY_ID[s.id], b = blind[s.id]
  const acordo = b ? (b.blind === q.answer ? 'concordância' : 'divergência inicial') : 'sem leitura cega (reanálise dedicada)'
  return {
    id: s.id, estrato: s.estrato, disciplina: s.disciplina,
    primeiraAuditoria: d ? `${d.result} (${d.source.slice(0, 60)}; ${d.provision})` : a.verification.slice(0, 120),
    gabaritoArmazenado: q.answer, segundaLeituraCega: b?.blind ?? '—', fonteSegundaAuditoria: b?.src ?? MANUAL[s.id] ?? '',
    resultadoComparacao: acordo,
    erroEncontrado: s.id === 'pca-4' ? 'não (erro da leitura cega: confundiu 30 dias com 60; gabarito armazenado A confere com CPC art. 226, III)' : (b ? 'não' : '—'),
    correcao: b ? 'nenhuma' : (MANUAL[s.id] ?? ''), statusFinal: a.proposed, revisaoHumana: 'não',
  }
})
const cols = Object.keys(rows[0]) as (keyof typeof rows[0])[]
const esc = (x: unknown) => '"' + String(x ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"'
writeFileSync('docs/FASE-4C-SEGUNDA-AUDITORIA.csv', '﻿' + [cols.map(esc).join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n'))
const cnt: Record<string, number> = {}; rows.forEach(r => (cnt[r.resultadoComparacao] = (cnt[r.resultadoComparacao] || 0) + 1))
writeFileSync('docs/FASE-4C-SEGUNDA-AUDITORIA.json', JSON.stringify({
  geradoEm: '2026-11-12', semente: 20261112,
  aviso: 'Releitura pela mesma IA; não é revisão humana independente. Amostra não permite inferir percentual de precisão do banco.',
  total: rows.length, contagem: cnt, itens: rows,
}, null, 1))
console.log(rows.length, cnt)
