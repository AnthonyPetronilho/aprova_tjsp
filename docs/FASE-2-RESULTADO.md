# Aprova TJSP — Fase 2: segurança e integridade dos dados

Data: 05/11/2026. A Fase 3 **não foi iniciada**.

## 1. Problemas resolvidos

| Problema (Fase 1) | Resultado |
|---|---|
| 1.1 Conflito de sincronização sem alteração real | **Resolvido e verificado.** O cenário que reproduzi (dois aparelhos, 35 s só com mouse) agora termina "sincronizado" nos dois, em teste automatizado e no navegador. |
| "Último vence" e perda de dados na escolha manual | **Removido.** Não há mais escolha entre servidor e navegador. A sincronização mescla por registros com id único. |
| Sem recuperação de queda de rede | Estado "sem conexão", dados locais intactos, nova tentativa com espera crescente (5 s, 15 s, 45 s… até 5 min) e ao voltar a conexão. |
| Nada era puxado ao abrir o app | Puxa e mescla ao entrar, abrir, voltar à aba, reconectar e a cada 1 min (consulta leve de versão). |
| Duas abas do mesmo navegador se sobrescreviam | A aba que recebe o evento `storage` mescla em vez de substituir. |
| Servidor aceitava qualquer JSON como progresso | Validação de formato (422): tipos, ids únicos, tipos de evento, limites de XP e tempo, versão futura. |
| Sem papel de administrador | `ADMIN_EMAILS` no servidor; verificação a cada requisição; teste com token forjado. |
| Apagar conta só com o token | Exige a senha. |
| Sem limite nas rotas de dados / sem `trust proxy` | Limite por usuário e `TRUST_PROXY` configurável. |
| Sem backups | Cópias locais antes de migrar, mesclar, restaurar e zerar; histórico de 10 versões no servidor. |
| Testes de frontend fora do repositório | Vitest no repositório: 49 testes, mais 12 do servidor. |

## 2. Como funciona (resumo técnico)

**Eventos com id único** (`src/lib/events.ts`). Cada atividade é um registro imutável:
- `ans` (resposta, id aleatório), `rev` (revisão de flashcard, id aleatório), `les` (aula concluída, `les:<aula>`), `fav` (favorito), `rwd` (recompensa de XP) e `sec` (tempo de estudo).
- As recompensas têm **id determinístico**: `rwd:q:<questão>` (1ª resposta certa), `rwd:les:<aula>`, `rwd:rev:<dia>`, `rwd:mock:<dia>`, `rwd:mission:<dia>`. Duas máquinas que ganham a mesma recompensa geram o mesmo id e ela conta uma vez.
- **XP é a soma das recompensas**, nunca um número copiado ou o "maior valor". **Tempo de estudo** é um contador por (aparelho, dia): cada contador só é escrito por um aparelho, então tomar o máximo por contador é exato, e o total é a **soma** entre aparelhos.
- O estado exibido (`answers`, `errors`, `cards`, `daily`, `xp`, sequências…) é **derivado** por `rebuild(base + eventos)`, em ordem determinística (data/hora, id). O mesmo caminho serve para ações locais e para mesclagem, então os dois concordam.

**Compatibilidade.** Os dados antigos (sem eventos) viram uma `base` congelada. Nada é descartado, convertido nem atribuído a uma ação nova: XP, aulas "concluídas no modelo anterior", respostas, erros, cards, anotações, simulados e conquistas continuam iguais (teste dedicado). Se dois aparelhos tiverem dados antigos diferentes, a base é mesclada de forma determinística (máximo/união, só para esse legado).

**Sincronização** (`src/lib/sync.ts`): envia com a versão conhecida; em 409 o servidor devolve o documento atual, o cliente mescla e reenvia (até 6 tentativas). Só envia o que mudou (resumo canônico dos campos sincronizados, que ignora tema escuro, simulado em andamento etc.). Dados do servidor inválidos ou de uma versão mais nova do app **nunca são sobrescritos**: aparece um aviso e os dados locais ficam como estão.

**Conteúdo do editor:** mesclagem por id (vence a edição mais recente) com lápides para exclusões.

## 3. Arquivos

Novos: `src/lib/events.ts`, `src/lib/backup.ts`, `server/src/validate.js`, `vitest.config.ts`, `tsconfig.tests.json`, `tests/` (`events`, `sync`, `content-backup`, `helpers`, `legacy/*`, `e2e/two-devices.cjs`), `docs/FASE-2-RESULTADO.md`.

Modificados:
- **Frontend:** `src/types.ts`, `src/lib/useProgress.ts` (todas as mutações passam por `commit`), `src/lib/sync.ts` (reescrito), `src/lib/content.ts` (lápides e mesclagem), `src/App.tsx`, `src/pages/Settings.tsx`, `src/pages/Review.tsx`, `src/pages/Progress.tsx`, `src/pages/Notes.tsx`.
- **Servidor:** `server/src/app.js`, `server/src/index.js`, `server/src/repo.memory.js`, `server/src/repo.mongo.js`, `server/.env.example`, `server/test/api.test.js`.
- **Projeto:** `package.json` (scripts `test`, `test:front`, `typecheck`; devDependencies `vitest` e `@types/node`), `README.md`.

## 4. Testes executados (todos passaram)

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` em `src` e em `tests` | sem erros |
| `npm run build` | ok |
| Vitest (front) | **49/49** |
| Servidor (`node --test`) | **12/12** |
| E2E de conteúdo (102 aulas, 600 flashcards, simulado) | ok |
| E2E manual com dois aparelhos (`tests/e2e/two-devices.cjs`) | ok |

Cobertura principal: migração de dados antigos; resposta/recompensa sem duplicar; **mesclagem idempotente, comutativa e associativa** (60 execuções aleatórias com 3 aparelhos); tempo de estudo somado sem inflar; recompensas diárias dedupadas; revisões de dois aparelhos; favoritos, anotações (com exclusão), redações, "zerar"; servidor real com concorrência, queda e volta de rede, aparelho antigo, dado inválido ou de versão futura, sessão expirada, apagar conta, papel de admin e token forjado.

## 5. Limitações (honestas)

1. **O repositório MongoDB não foi executado.** Mudei `repo.mongo.js` (histórico de versões e `returnDocument: 'before'`) e não há MongoDB neste ambiente. A mesma lógica está testada no repositório em memória. **Antes de implantar**, teste com seu Mongo local ou Atlas: duas gravações seguidas num documento e conferir se `docs_history` recebe a versão anterior.
2. **O registro de eventos só cresce.** Cada resposta e revisão ocupa cerca de 150 bytes. Estimativa grosseira: 100 atividades por dia até a prova ≈ 2 MB. O limite do servidor agora é 4,5 MB. **Falta a compactação** (resumir eventos antigos em um retrato). Recomendo fazê-la no começo da Fase 3.
3. **Cada envio manda o documento inteiro.** Funciona, mas é pesado em conexões fracas quando o documento cresce. O envio incremental (só os eventos novos) fica como melhoria.
4. **Dados de antes do modelo de eventos** (base) só podem ser mesclados por máximo/união. Se dois aparelhos tinham valores diferentes de XP antigo, vale o maior. Isso vale só para o legado.
5. **Relógios diferentes** podem mudar qual é a "última" resposta de uma mesma questão ou a ordem de revisões do mesmo card entre aparelhos (o resultado é sempre o mesmo em todos, mas pode não ser o que ocorreu primeiro de fato). Nenhuma atividade se perde.
6. **Anotações, preferências e plano:** vale o mais recente por anotação e, para plano, configurações de XP e rascunhos, o grupo mais recente. Edições simultâneas do mesmo item perdem uma das versões (a cópia automática "antes de mesclar" fica no navegador).
7. **"Zerar progresso"** em um aparelho vence na sincronização e descarta atividade ainda não enviada de outros aparelhos (é uma decisão deliberada; há cópia "antes de zerar").
8. **Administração:** só o `GET /api/admin/whoami` existe. As rotas de conteúdo e a edição do conteúdo embutido são da Fase 5; até lá o "modo editor" do front continua local e sem senha, e **não concede acesso a nada no servidor**. `ADMIN_EMAILS` só é lido ao iniciar o servidor.
9. **Sessão:** o JWT dura 7 dias, não pode ser revogado e fica no `localStorage`. Não há renovação nem encerramento remoto de sessões. Também não há política de CSP para o front publicado (configuração da hospedagem).
10. **`npm audit`** aponta vulnerabilidades moderadas na cadeia de desenvolvimento do Vite/Vitest (servidor de desenvolvimento, não o app publicado). Não atualizei versões maiores para não introduzir mudanças fora do escopo.
11. O **cadastro** continua dizendo "e-mail já cadastrado" (permite descobrir se um e-mail existe). A proteção contra enumeração fica para o fluxo de recuperação de senha (Fase 6).

## 6. Preservado

Identidade visual, dashboard, contas e login, XP, níveis e conquistas, simulados, flashcards e repetição espaçada, anotações, cronograma, redação, filtro de "Estudar", execução local pelo VS Code, deploy (variáveis novas são opcionais) e todos os dados existentes (a chave `aprova-tjsp:v1` não mudou; o formato antigo é lido e migrado, com cópia do original).

## 7. Pendências e decisões para a Fase 3

1. Compactação do registro de eventos (item 2 acima), a ser feita antes de acrescentar as tentativas detalhadas da Fase 3.
2. Seus rótulos: "Concluído no modelo anterior" para `completed` legado. Em dados, ele já fica separado em `base.completed`; a Fase 3 só precisa exibi-lo assim e **não** convertê-lo em estudo teórico.
3. "Domínio consolidado" só com questões jurídicas **revisadas e validadas**. Como hoje nenhuma foi, o domínio jurídico ficará "não avaliado / amostra insuficiente" até a Fase 4. Isso exigirá o campo `validation` em cada questão (começa em `pendente`).
4. Você trocar o `JWT_SECRET` e definir `ADMIN_EMAILS` no `.env` do servidor, e testar o `repo.mongo.js` (item 1 das limitações).
