import { writeFileSync } from 'node:fs'
import { QUESTIONS } from '../src/data/questions'
import { DOC_AUDIT } from '../src/data/audit-docs'
import { AUDIT } from '../src/data/audit'
const q = (s: string) => '"' + String(s ?? '').replace(/"/g, '""') + '"'
const rows = [['ID', 'Assunto', 'Fonte e versão', 'Dispositivo', 'Páginas do PDF', 'Trecho', 'Resultado', 'Status', 'Gabarito', 'Método', 'Observações', 'Pendências'].map(q).join(',')]
for (const d of DOC_AUDIT) { const qq = QUESTIONS.find(x => x.id === d.id)!; rows.push([d.id, qq.topicId, d.source, d.provision, d.pages, d.excerpt, d.result, d.status, qq.answer, AUDIT[d.id].methods.join('+') + ' (IA; sem revisão humana)', d.note ?? '', (d.pendencies ?? []).join(' | ')].map(q).join(',')) }
writeFileSync('docs/FASE-4B-LOTE-01.csv', '﻿' + rows.join('\n'))
