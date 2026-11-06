import { writeFileSync } from 'node:fs'
import { AUDIT, AUDIT_DATE } from '../src/data/audit'
writeFileSync('docs/FASE-4-AUDITORIA.json', JSON.stringify({ geradoEm: AUDIT_DATE, aviso: 'Registro de auditoria por questão. Revisão por IA não é revisão humana nem conferência em fonte oficial.', registros: Object.values(AUDIT) }, null, 1))
