# Aprova TJSP — Fases 1 e 2
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

## Fase 2 (aprendizagem)
- `src/lib/srs.ts` — repetição espaçada (estilo SM-2, em dias; teto de 60 dias). Esqueci/Difícil/Bom/Fácil.
- `src/data/cards.ts` — flashcards das aulas; cards de erro são derivados da questão errada.
- Páginas: Revisões (Central), Questões (banco com filtros), Erros (Caderno de Erros).
- Dados da Fase 1 já salvos no navegador são migrados automaticamente (cards das aulas concluídas e erros antigos).
- XP de revisão: +15 uma vez por dia ao concluir uma sessão (configurável em `src/config.ts`).

## Fase 3 (gamificação e anotações)
- **Anotações** (`NoteBox`, `lib/notes.ts`): por card (durante a revisão), por questão (depois de responder) e por tópico/aula. Card de erro e questão compartilham a mesma anotação. Tela "Anotações" com busca, edição e exclusão. Salvam sozinhas.
- **Missões diárias** (`lib/missions.ts`): 3 a 5, geradas 1x por dia conforme pendências, desempenho e ritmo recente; +XP ao completar todas.
- **Conquistas** (`lib/gamification.ts`): as 6 da especificação, com progresso real e data de desbloqueio. "Mente brilhante" e "Dominando o Direito" dependem de mais conteúdo.
- **Sequência tolerante**: 1 dia de folga não quebra; hoje só conta como perdido depois de passar.
- **Tempo ativo de estudo**: soma 15 s por intervalo com a aba visível e interação no último minuto.
- **Configurações**: XP editável, backup (baixar/restaurar JSON) e zerar progresso.
- Dados das fases anteriores são migrados automaticamente.
