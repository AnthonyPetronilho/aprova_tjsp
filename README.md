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

**Como sincroniza (Fase 2):** veja a seção "Fase 2" abaixo. Resumo: não há mais "escolha entre servidor e navegador"; os dados dos aparelhos são mesclados automaticamente.

**Segurança implementada:** senha com bcrypt (custo 12), JWT HS256 com expiração de 7 dias, mensagem de login genérica, limite de tentativas, helmet, CORS restrito a `CORS_ORIGIN`, validação de entrada, limite de tamanho, isolamento por usuário. Em produção use HTTPS e um `JWT_SECRET` forte.

**Testes:** `npm test` na raiz roda os testes do front (Vitest) e os do servidor (`node --test`); veja "Fase 2". O repositório MongoDB (`repo.mongo.js`) segue a mesma interface, mas **não pôde ser executado no ambiente de desenvolvimento (sem MongoDB)** — teste-o na sua máquina.

**Ainda não implementado:** Tutora TJSP (IA), recuperação de senha por e-mail, importação de PDF.

## Fase 2 – Segurança e integridade dos dados
Detalhes, arquivos e limitações: `docs/FASE-2-RESULTADO.md`.

- **Modelo de eventos.** Cada resposta, revisão, aula concluída, favorito, recompensa de XP e contador de tempo de estudo é um registro com **id único** (`src/lib/events.ts`). XP, estatísticas, erros e flashcards são **derivados** desses registros (`rebuild`). Os dados antigos viram uma "base" congelada: nada é descartado nem reatribuído.
- **Sincronização por mesclagem.** O envio usa número de versão; se outro aparelho salvou antes (409), o app baixa o documento do servidor, **mescla** (união por id, idempotente) e reenvia. Mesclar duas vezes não duplica respostas, revisões nem XP. A mesma 1ª resposta certa em dois aparelhos paga XP uma vez (`rwd:q:<questão>`). O tempo de estudo é um contador por aparelho e dia; o total é a soma.
- **Quando sincroniza:** ao entrar, ao abrir o app, ao voltar à aba, ao reconectar e a cada minuto (consulta leve de versão); alterações enviam em ~3 s. Sem conexão: dados ficam locais, o app mostra "sem conexão" e tenta de novo com espera crescente.
- **Backups.** Antes de migrar o formato antigo, de mesclar, de restaurar um arquivo ou de zerar, o navegador guarda uma cópia (3 por tipo; Configurações → "Cópias automáticas"). O servidor guarda as últimas 10 versões de cada documento (`docs_history`).
- **Zerar progresso** cria uma nova "época" e vence na sincronização. **Restaurar backup** passa a *somar* o arquivo ao progresso atual.
- **Administradores.** Defina `ADMIN_EMAILS` (separados por vírgula) no `.env` **do servidor**. O servidor confere o e-mail a cada requisição (o token não carrega papel). Por ora só existe `GET /api/admin/whoami`; as rotas de conteúdo chegam na Fase 5. O "modo editor" do front continua local até lá.
- **Servidor:** validação do formato dos documentos (422), limite de requisições por usuário nas rotas de dados, `TRUST_PROXY` configurável, apagar conta exige a senha.
- **Testes** (`npm test`): `tests/events.test.ts` (migração, mesclagem, propriedades com 3 aparelhos), `tests/sync.test.ts` (servidor real: concorrência, queda de rede, aparelho antigo, dados inválidos, 401), `tests/content-backup.test.ts`, `tests/legacy/*` (integridade dos dados, simulados, cronograma, Admin) e `server/test/api.test.js`. `npm run typecheck` verifica `src` e `tests`. E2E manual com dois aparelhos: `tests/e2e/two-devices.cjs` (precisa de Playwright).

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
- **Lote 9 – Processo Penal (2/2 tópicos, 10 aulas):** CPP: juiz/impedimentos/defensor, citações e intimações, procedimentos comum/sumário e restauração de autos, júri (1ª fase, jurados e plenário), recursos (RESE, apelação, embargos), revisão, carta testemunhável e habeas corpus; Lei 9.099/95 criminal (arts. 60–83, 88, 89). Fontes secundárias; os arts. 62–73 e 77–83 da Lei 9.099 foram escritos de memória. Não cobertos por falta de fonte conferida: CPP arts. 262, 264, 267, 473–481, 492–497. Atenção: art. 585 (revogado) aparece em páginas desatualizadas.
- **Lote 10 – Processo Civil (3/3 tópicos, 12 aulas):** CPC: juiz e partes, atos processuais e prazos, citação e intimação, tutela provisória, petição inicial e resposta, saneamento, provas, sentença/coisa julgada/liquidação, cumprimento de sentença e recursos; Lei 9.099/95 cível (arts. 3º–19) e Lei 12.153/2009. Fontes secundárias (projuris e PDFs de tribunais); as leis 9.099 e 12.153 podem refletir a redação original: confirme no Planalto. Não conferidos e fora das aulas: CPC arts. 149, 200–211, 217, 233–237, 350, 355–356, 381–384, 389–441, 481–484, 497–501 e 538. Conteúdo gerado por IA: revisar.
- **Lote 11 – Direito Administrativo (2/2 tópicos, 10 aulas):** Lei 10.261/68 (arts. 1º–86, 171–175 e 239–323: conceitos, provimento, posse e exercício, tempo e vacância, acumulação, deveres, penas, apuração, processo, recursos e revisão) e Lei 8.429/92 na redação da Lei 14.230/2021 (sujeitos, arts. 9º–11, sanções, indisponibilidade, ação, ANPC e prescrição). Fontes: página da ALESP e legis.senado.leg.br, lidas por resumo automatizado (o Planalto bloqueia acesso). Não conferidos com precisão: arts. 77 e 78 (rol de dias) da Lei 10.261, arts. 267-A a 267-P (lidos só em resumo), art. 323 (contagem de prazos) e a legitimidade concorrente (ADIs 7042/7043). Conteúdo gerado por IA: revisar.
- **Lote 12 – Legislação Interna do TJSP (5/5 tópicos, 16 aulas):** Res. 850/2021 (teletrabalho de servidores e magistrados), Res. 963/2025 (eproc), LC 1.111/2010 (estrutura e carreira), Regimento Interno (arts. 1–45) e Normas de Serviço da CGJ, Tomo I (Cap. II, Cap. III e Cap. XI). Fontes: portal do TJSP, ALESP e Senado, lidas por resumo automatizado. Não conferidos: Res. 850 só no texto original (alterada pela 864/2022); Res. 963 só arts. 1º–2º; anexos (imagens) da LC 1.111; Regimento só arts. 1–45; Cap. XI lido em resumo (arts. 1.228–1.289 só pontos principais). Seções III, IV e IV-A do Cap. III estão fora do edital. As Normas mudam por provimentos frequentes: confirmar no portal. Conteúdo gerado por IA: revisar.
- Banco: 510 questões, 102 aulas, 616 flashcards. Cobertura para o simulado completo (70): Matemática 65/4 ✅, Raciocínio Lógico 20/7 ✅, Português 65/16 ✅, Direito 310/30 ✅ (Constitucional, Penal, Processo Penal, Processo Civil, Administrativo e Legislação Interna do TJSP), Informática 35/9 ✅, Atualidades 15/4 ✅. Todos os 61 tópicos do edital têm aula.
