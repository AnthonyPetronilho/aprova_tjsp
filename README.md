# Aprova TJSP — MVP (Fase 1)
Plataforma de estudos gamificada para Escrevente Técnico Judiciário TJSP (Edital 02/2026, VUNESP).

## Rodar no VS Code
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```
## Estrutura
- `src/data/edital.ts` — catálogo fiel ao Anexo VIII · `src/data/crase.ts` — 1ª aula + 5 questões inéditas (IA)
- `src/config.ts` — XP, níveis, data da prova · `src/lib/useProgress.ts` — persistência (localStorage), XP, missões, sequência
- Para o backend (Node/Express/MongoDB), substitua `load`/`save` em `useProgress.ts` por chamadas à API.
## Limitações
- Dados só no localStorage do navegador (no Claude Artifacts o armazenamento pode não persistir; localmente persiste).
- Não implementado: ver página "Em breve".
