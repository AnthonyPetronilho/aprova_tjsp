# Aprova TJSP — Fase 3: reestruturação da experiência de aprendizagem

Data: 05/11/2026. A Fase 4 **não foi iniciada**.

## 1. Resumo das funcionalidades

**Método.** A plataforma organiza o estudo, avalia, identifica dificuldades, reforça e acompanha a evolução. A teoria é estudada fora do app. O conteúdo existente (resumos, explicações, exemplos, flashcards, caderno de erros, simulados) foi preservado como **material complementar**. A jornada *estudar externamente → registrar → validar → identificar dificuldades → reforçar → revisar → reavaliar* guia o menu (“Minha jornada”, “Reforçar e revisar”, “Praticar”, “Planejar”), o painel, as missões e as sugestões.

| Item | O que foi feito |
|---|---|
| **Compactação segura de eventos** | Eventos antigos de resposta/revisão são resumidos num retrato (`base`) com um *checkpoint* (`cp`). XP, ids de recompensa, respostas, erros, cards e histórico ficam idênticos. Aparelho que ficou offline e volta não reaplica o que já foi resumido, e seus eventos novos são mantidos. Detalhes na seção 3. |
| **Diário de Estudos** (`#/diary`) | Criar, editar, excluir, histórico, filtro por disciplina e período, tempo por disciplina, vínculo com o assunto do edital (ids existentes; assunto inexistente é recusado). Tipos: Videoaula, Apostila, Livro, Curso preparatório, Legislação, Outro. Sincroniza pela arquitetura da Fase 2. O tempo é **manual** e aparece separado do tempo ativo do app; nunca se somam. |
| **Validar meu aprendizado** (`#/validate`) | 6 etapas: assunto e situação atual → estudo teórico (+ vínculo opcional ao Diário) → questões (Avaliação ou Prática, quantidade variável, tempo medido) → resultado (acertos, erros, %, tempo, explicações, pontos a revisar) → reforço → reavaliação com comparação. Só usa questões **do assunto escolhido**; nunca completa com outros. |
| **8 status por assunto** | Não iniciado, Estudando externamente, Estudo teórico realizado, Aguardando avaliação, Precisa reforçar, Em revisão, Bom desempenho, Domínio consolidado. Regras determinísticas em `learning.ts` (`topicLearning`), explicadas na tela “Edital” (“O que significa cada status?”). |
| **3 métricas separadas** | Cobertura de estudo, Cobertura de avaliação e Domínio estimado (painel, Edital e Evolução). Abrir aula ou ver resumo não entra em nenhuma. |
| **Critério de domínio (configurável)** | Padrão: ≥ 80% de acertos, avaliações em ≥ 2 dias diferentes, ≥ 10 questões distintas, só questões **validadas**. A última avaliação também precisa atingir a meta. Sem isso: “Domínio ainda não avaliado — questões validadas insuficientes.” Regras em Configurações. |
| **Validação de questões** | Campo Pendente / Precisa de correção / Precisa de complementação / Validada. Todas começam **pendentes** (nada vira “validada” sozinho). “Precisa de correção” sai das avaliações e da prática. **Avaliação** usa só validadas e conta para o domínio; **Prática** (pendentes e em complementação) nunca conta. Edição no Admin; selo no Banco de Questões. |
| **Reforço** | Sugestões a partir do desempenho registrado (sem IA, sem custo): voltar ao material externo, reler o resumo, refazer erradas, flashcards, nova avaliação em outro dia. |
| **Gamificação** | XP e conquistas antigos preservados. Novos XP: avaliação de ≥ 5 questões (30 XP, 1x por assunto/dia, id `rwd:asm:<assunto>:<dia>`) e registro de ≥ 10 min no Diário (5 XP, 1x/dia, id `rwd:study:<dia>`). Marcar “estudei” não rende XP. Missões novas (registrar estudo, validar assunto). Conquistas novas: Diário em dia, Primeira validação, Mapa de dificuldades, Evolução comprovada, Domínio consolidado. |
| **Painel** | Boas-vindas, acesso rápido (Registrar estudo, Validar aprendizado, Revisar conteúdos, Diário), as 3 coberturas, tempo externo × app, avaliações, revisões pendentes, desempenho por disciplina (avaliação × prática), missões, XP e conquistas, cronograma do dia. |
| **Cronograma e Evolução** | Blocos de teoria externa, teste diagnóstico, questões, revisão semanal e simulados na reta final. Evolução: tempo externo × app, nº de avaliações/práticas, desempenho por disciplina, evolução entre tentativas, questões validadas × pendentes. Sem dados fictícios. |

## 2. Arquivos

**Criados:** `src/lib/learning.ts`, `src/pages/Diary.tsx`, `src/pages/Validate.tsx`, `tests/compact.test.ts`, `tests/learning.test.ts`, `tests/e2e/learning-flow.cjs`, `docs/FASE-3-RESULTADO.md`.

**Modificados:** `src/types.ts`, `src/config.ts`, `src/App.tsx` (menu, rotas, ligação da compactação ao sync), `src/lib/events.ts` (esquema 3, checkpoint, `compact`, mesclagem), `src/lib/useProgress.ts` (produtor/sequência, `saveStudy`, `deleteStudy`, `setMark`, `submitAssessment`, `setMastery`), `src/lib/sync.ts` (`prepare`/`committed`), `src/lib/content.ts` (validações), `src/lib/missions.ts`, `src/lib/gamification.ts`, `src/lib/plan.ts`, `src/lib/route.ts`, `src/pages/Dashboard.tsx`, `Edital.tsx`, `Stats.tsx`, `Plan.tsx`, `Settings.tsx`, `Bank.tsx`, `Admin.tsx`, `Lesson.tsx`, `server/src/validate.js`, `server/test/api.test.js`, `tests/helpers.ts`, `tests/events.test.ts`, `tests/e2e/two-devices.cjs`, `package.json` (devDependencies `jsdom` e `@testing-library/react`, só para testes), `README.md`.

Nenhuma alteração em autenticação, perfil, logout, sessão, welcome/login, repositórios MongoDB/memória, rotas do servidor (só a validação do formato), simulados, redação ou administração além do campo de validação.

## 3. Mudanças no modelo de dados

- **`schemaVersion` 3** (era 2). Aditivo: todos os campos novos são opcionais ou têm padrão.
- **Progresso:** `diary` (id → `StudyEntry`, com lápide `deleted`), `marks` (assunto → `estudando|teoria|limpo`, última escrita vence), `cp` (checkpoint), `settings.mastery` (`minPct 80, minDays 2, minDistinct 10, weakBelow 60`), `settings.xp.assessment` e `.study`.
- **Eventos:** novo `asm` (tentativa: assunto, modo, itens `[questão, alternativa, 0|1]`, duração, vínculo opcional ao Diário). `ans`/`rev` ganham `dev` (produtor) e `n` (sequência); `ans` ganha `asm` (id da tentativa). Recompensas novas: `rwd:asm:…` e `rwd:study:…`.
- **Checkpoint:** `{ id, gen, at, vec: {produtor → maior n resumido}, legacy: [ids antigos resumidos] }`.
- **Conteúdo:** `validations` (questão → `{ v, at }`), mesclado por data (a mais recente vence). A situação padrão é `pendente`.
- **Servidor:** `validate.js` aceita esquema ≤ 3 e valida `asm`, `dev`/`n`, recompensas novas, `cp`, `diary`, `marks` e `validations`. Clientes antigos (v2) recusam documentos v3 em vez de sobrescrevê-los.

### Compactação — como evita perda e duplicação
1. Só eventos `ans`/`rev` com mais de 14 dias entram no resumo, e só o **prefixo contíguo** por produtor (sem buracos); eventos antigos sem `dev/n` (Fase 2) entram pelo id em `cp.legacy`.
2. O resumo é calculado com o mesmo `rebuild` do app e só vale **depois que o servidor aceita** o envio (controle de versão da Fase 2). Se outro aparelho gravou antes, o servidor devolve 409, o cliente mescla e recalcula.
3. Evento coberto por um checkpoint nunca é reaplicado. Evento novo de um aparelho offline (não coberto) é aplicado normalmente; os guardas de “evento tardio” impedem que ele altere o que já foi resumido (por exemplo, a data da primeira resposta correta e o XP).
4. Recompensas (`rwd`, `les`, `fav`, `sec`) **não** são resumidas: o id delas continua visível, então não há XP em dobro.
5. Cópia recuperável: `antes-de-compactar` (navegador) antes de aplicar e histórico de 10 versões no servidor. Nenhuma operação destrutiva no banco.
6. Medição sintética (120 dias × 100 respostas/dia): 12.510 eventos / 2,35 MB → 1.910 eventos / 0,81 MB, com XP e estado derivado idênticos.

## 4. Migrações

- **v1/v2 → v3**, automática na primeira abertura, **versionada, idempotente e com cópia**: o original fica em `antes-da-migracao-v<versão>` (Configurações → cópias automáticas) antes de qualquer conversão. Rodar de novo não muda nada (teste).
- **Aulas “Concluídas no modelo anterior”** continuam em `completed`/`base.completed`. **Não** viram estudo externo: o status do assunto permanece “Não iniciado” até haver registro ou avaliação, e a tela mostra “N aula(s) concluída(s) no modelo anterior” como informação separada.
- Preservados: XP, níveis, conquistas, respostas, erros, flashcards e revisões, anotações, simulados, preferências, favoritos, redações. Nada é apagado.

## 5. Testes executados (todos passaram)

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` (src e tests) | sem erros |
| `npm run build` | ok |
| Vitest (front) | **110/110** em 11 arquivos |
| Servidor (`node --test`) | **12/12** |
| E2E no navegador (`tests/e2e/learning-flow.cjs`) | ok (22 verificações) |

Cobertura nova (`compact.test.ts`, 14 testes; `learning.test.ts`, 31 testes):
compactação com estado idêntico (30 execuções aleatórias), idempotência, XP sem duplicar, limites, relógio adiantado, eventos antigos; **aparelho antigo voltando** (eventos recentes e tardios), propriedade com 3 aparelhos e compactações aleatórias, servidor real com concorrência, queda de rede e aparelho desatualizado; registro, edição, exclusão e sincronização do Diário; tempo manual fora do tempo ativo; histórico de avaliações; desempenho por disciplina; critério de domínio (dias, distintas, validadas, meta, configuração); questões pendentes e com erro confirmado; status e transições; as três coberturas; migração v1/v2 → v3 com cópia; XP sem duplicar entre aparelhos; troca de conta; simulados e flashcards preservados; conquistas.
Fiz também testes de mutação manuais (quebrando de propósito a regra de dias e a regra de status) para confirmar que os testes falham quando deveriam.

## 6. Problemas corrigidos no caminho

- Duas compactações aplicadas às cegas em aparelhos diferentes perdiam eventos. Desenhei o protocolo para que **só o servidor decida qual vale** (ver 3.2) e adicionei um teste que documenta o risco.
- Documento compactado não era idêntico após mesclar consigo mesmo (ordem das listas); a forma canônica foi uniformizada.
- A quantidade de questões da prática ficava presa em 1 depois de trocar de modo; agora volta ao padrão (até 10).
- O teste de “versão futura” do servidor passou a usar o esquema 4, já que o 3 agora é válido.

## 7. Limitações (honestas)

1. **Nenhuma questão está validada.** Como todas começam pendentes e a validação jurídica é da Fase 4, hoje as avaliações “de verdade” só existem para questões que você marcar como validadas no Admin; o domínio mostrará “não avaliado” até lá. Isso é o comportamento pedido.
2. **A edição da validação no Admin é local da conta** (modo editor sem papel no servidor). A autorização de administrador para conteúdo é da Fase 5; até lá, a validação vale por conta e sincroniza entre seus aparelhos.
3. **Eventos tardios** (de aparelho offline muito tempo) são aplicados depois do resumo; o XP e as contagens ficam corretos, mas a ordem de “última resposta” pode diferir da cronológica (já era assim na Fase 2).
4. **Duas compactações simultâneas por aparelhos diferentes** são resolvidas pelo servidor (uma vence, a outra refaz sobre o resultado). Sem servidor (modo local), compacta-se localmente.
5. O resumo cresce menos, mas **não é constante**: listas por dia (`daily`) e `answers` continuam crescendo devagar (0,8 MB para 12 mil respostas). O limite de 4,5 MB do servidor cobre muitos anos de uso.
6. `cp.legacy` e `cp.vec` crescem lentamente (um item por evento antigo sem produtor / um produtor por abertura de página). Aceitável agora; podem ser podados numa fase futura.
7. O XP padrão da aula concluída continua 20 (valor já configurado por usuários existentes); aulas são finitas e a recompensa tem id único por aula. Você pode reduzi-lo em Configurações.
8. **O repositório MongoDB continua sem execução neste ambiente** (como na Fase 2): teste a gravação do documento v3 e o histórico de versões no seu Atlas/local.
9. Continuam pendentes da Fase 2 por sua conta: trocar o `JWT_SECRET` e definir `ADMIN_EMAILS`.
10. Fora do escopo desta fase (não implementados, sem botões inativos): recuperação de senha, importação de PDF, Tutora TJSP.

## 8. Pendências para a Fase 4 (revisão jurídica das questões)

1. Conferir questão a questão as de Direito e marcar como Validada / Precisa de correção / Precisa de complementação (a estrutura e a tela já existem).
2. Corrigir as com erro confirmado (elas já ficam fora das avaliações enquanto isso).
3. Ampliar o banco por assunto até haver ≥ 10 questões validadas (hoje 14 dos 61 assuntos têm 10 ou mais questões; os demais têm 5 a 9, abaixo do mínimo do critério de domínio).
4. Decidir se a validação passa a ser exclusiva de administradores no servidor (Fase 5).
5. Revisar o texto dos resumos jurídicos como material complementar.

**Parei aqui. Aguardo sua aprovação antes de iniciar a Fase 4.**
