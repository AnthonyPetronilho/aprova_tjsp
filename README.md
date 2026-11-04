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

## Aulas jurídicas (Peculato)
- `src/data/peculato.ts` — aula do art. 312 do CP (tópico `dpenal-2`), 5 questões inéditas e, em `data/cards.ts`, 9 flashcards.
- O Direito Penal do edital foi dividido em 5 módulos com exatamente os mesmos artigos do Anexo VIII (nenhum incluído ou removido). Só o módulo do art. 312 tem aula; os demais aparecem como "Sem aula ainda".
- Aulas aceitam `quotes` (citação da lei) e `table` (comparação) em cada etapa. Para criar nova aula: adicionar em `data/`, registrar em `data/lessons.ts` e `data/questions.ts`.
- A redação do art. 312 foi conferida em fontes públicas (o site do Planalto bloqueou o acesso automatizado). Confirme a redação vigente em planalto.gov.br.

## Fase 4 – Cronograma, Simulados, Estatísticas e Redação
- **Cronograma** (`/Cronograma`): 5 perguntas (horas/dia, dias da semana, matérias difíceis, ritmo) → plano até 14/03/2027 com blocos de 30 min, pesos pelo nº de questões do edital (os 30 de Direito divididos igualmente entre as 6 disciplinas jurídicas — premissa declarada), intercalação, revisão geral semanal e reta final (14 dias) de simulados/erros. Dias perdidos não punem; "Recalcular" reorganiza a partir de hoje.
- **Simulados**: rápido (5/10/15/20 questões, automático ou por disciplina) e completo (70 questões, 5 h). O completo só libera quando o banco tiver a distribuição do edital (16/30/4/4/9/7) — hoje o banco tem 10 questões, então fica bloqueado.
- **Evolução**: abas Visão geral / Estatísticas / Conquistas.
- **Redação**: 4 temas originais, cronômetro, rascunho automático, histórico, autoavaliação pelos critérios do edital. Os "pontos de atenção" são heurísticas, **não nota**. Análise por IA e OCR de manuscrito: em breve.
- Menu reorganizado (Estudar / Praticar / Planejar / Mais).

## Fase 4b – Administração de conteúdo (modo editor local)
- Ative em **Configurações → Modo editor**. Aparece **Admin** no menu (grupo "Mais"). Sem senha: é um modo local, o conteúdo fica no navegador (`aprova-tjsp:content:v1`).
- Crie/edite/exclua **aulas** (etapas, texto, "Não entendi", questões do teste), **questões** (A–E com comentário por alternativa e gabarito) e **flashcards** (ligados a uma aula).
- **Rascunho × Publicado**: só o publicado entra no app. Para publicar é preciso passar na validação e marcar "Conferi o conteúdo" (conteúdo de IA deve ser revisado por você).
- **Reforço em vídeo**: cole um link (YouTube é incorporado via `youtube-nocookie`; Vimeo também; outros https viram link externo; http é recusado). Vale para suas aulas e para as aulas do app. O app nunca sugere ou inventa links.
- Conteúdo do app (Crase, Peculato) é somente leitura (exceto vídeo). **Exportar/Importar conteúdo** em JSON (aba Backup) — será a base da migração para o servidor.
- Não implementado: login/permissões reais, importação de PDF, geração de rascunhos por IA (dependem do backend).
- Arquitetura: `src/lib/content.ts` reconstrói em memória os arrays `LESSONS/QUESTIONS/FLASHCARDS` (embutido + publicado), então o resto do app não mudou.

## Fase 5a – Servidor (Express + MongoDB + JWT) e sincronização
O app continua funcionando 100% local. Com o servidor, você ganha conta e sincronização entre aparelhos.

**Rodar o servidor** (pasta `server/`):
1. `cd server && npm install`
2. Copie `.env.example` para `.env` e preencha `MONGODB_URI` (Atlas ou local) e `JWT_SECRET` (comando para gerar está no arquivo). Para testar sem banco: `STORE=memory` (dados somem ao reiniciar).
3. `npm run dev` → API em http://localhost:3001 (`/api/health` para conferir).

**Ligar o front-end:** na raiz, copie `.env.example` para `.env` (`VITE_API_URL=http://localhost:3001`) e reinicie `npm run dev`. Em Configurações aparece "Conta e sincronização" (criar conta, entrar, sair, apagar conta).

**Como sincroniza:** progresso e conteúdo do Admin são enviados ~3 s após cada mudança. Cada documento tem número de versão: se outro aparelho salvou antes, o app avisa e você escolhe manter o do servidor ou o deste navegador (nada é sobrescrito em silêncio). No primeiro login, se só um lado tem dados, ele é usado; se os dois têm, você escolhe.

**Segurança implementada:** senha com bcrypt (custo 12), JWT HS256 com expiração de 7 dias, mensagem de login genérica, limite de tentativas, helmet, CORS restrito a `CORS_ORIGIN`, validação de entrada, limite de tamanho, isolamento por usuário. Em produção use HTTPS e um `JWT_SECRET` forte.

**Testes:** `cd server && npm test` (7 testes de API contra o repositório em memória). O repositório MongoDB (`repo.mongo.js`) segue a mesma interface, mas **não pôde ser executado no ambiente de desenvolvimento (sem MongoDB)** — teste-o na sua máquina.

**Ainda não implementado:** Tutora TJSP (IA), recuperação de senha por e-mail, importação de PDF.

## Conteúdo
- **Lote 1 – Matemática e Raciocínio Lógico:** MMC e MDC, Porcentagem, Estruturas lógicas, Diagramas lógicos.
- **Lote 2 – Língua Portuguesa:** Concordância verbal e nominal, Regência verbal e nominal, Colocação pronominal, Pontuação (a aula de Crase já existia).
- **Lote 3 – Matemática (restante) e Raciocínio Lógico:** Operações, Razão/proporção, Regra de três, Médias, Juros simples, Equações, Sistemas, Grandezas/tabelas/gráficos, Medidas, Geometria, Situações-problema, Lógicas de argumentação, Sequências. **Matemática (13/13) e Raciocínio Lógico (4/4) completos.**
- **Lote 4 – Informática (7/7 tópicos):** Windows, Word, Excel, E-mail, Internet, Teams, OneDrive. Menus mudam entre versões do Microsoft 365; atalhos do Word seguem a versão em português. Confira na versão que o edital/banca indicar.
- **Lote 5 – Língua Portuguesa (13/13 tópicos):** Interpretação, Inferências, Ponto de vista, Coesão, Significação contextual, Sinônimos/antônimos, Sentido figurado, Classes de palavras. Os textos de exemplo são originais, escritos para o app.
- **Lote 6 – Atualidades (2/2 tópicos):** Fatos de 2026 (pesquisados na web em 04/11/2026; só fatos confirmados em fonte oficial ou 2+ veículos; conteúdo datado — reconfira antes da prova) e Estatuto da Pessoa com Deficiência, arts. 1º–13 e 34–38 (paráfrase conferida em fontes secundárias; confirme o texto literal em planalto.gov.br).
- **Lote 7 – Direito Constitucional (5/5 tópicos, 7 aulas):** CF art. 5º (duas aulas), arts. 6º–11, arts. 12–13, art. 37 (duas aulas, incluindo §§ e arts. 38, 39 e 41) e art. 92. Texto da CF conferido em PDF secundário (o Planalto bloqueia acesso automatizado): confirme o literal em planalto.gov.br.
- Cada aula: explicação, exemplos, tabela-resumo, 5 questões comentadas por alternativa e 6 flashcards. Contas conferidas por cálculo; casos de Português em que as gramáticas divergem foram evitados. Conteúdo gerado por IA: **revise antes de estudar**.
- **Lote 8 – Direito Penal (5/5 tópicos, 6 aulas novas + Peculato):** arts. 293–311-A (falsidades, falsa identidade, fraude em certames), 313–317, 319–327, 328–333, 336–341 e 342–347/357/359. Penas conferidas em fontes secundárias; as penas dos arts. 293–296, 300–303 e 305 aparecem sem conferência e estão sinalizadas na aula (nenhuma questão depende delas). Art. 326 consta como revogado: confirme no Planalto.
- Banco: 270 questões, 54 aulas, 328 flashcards. Cobertura para o simulado completo (70): Matemática 65/4 ✅, Raciocínio Lógico 20/7 ✅, Português 65/16 ✅, Direito 70/30 ✅ (Constitucional e Penal; Processuais, Administrativo e Interna ainda faltam), Informática 35/9 ✅, Atualidades 15/4 ✅ — o simulado completo já está liberado, mas a parte de Direito ainda não cobre todos os tópicos do edital.
