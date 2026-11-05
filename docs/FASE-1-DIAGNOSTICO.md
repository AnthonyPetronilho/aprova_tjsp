# Aprova TJSP — Fase 1: diagnóstico e plano

Data: 05/11/2026. Base analisada: o código do `aprova-tjsp_2.zip` (idêntico ao meu, incluindo o filtro de "Estudar") e o edital 02/2026 (Anexo VIII, p. 61–63). **Nada foi alterado no projeto nesta fase**; este arquivo é a única adição.
O "relatório de auditoria" citado no pedido não veio anexo. Os problemas abaixo vêm só do que li no código e do que reproduzi.

## 0. O que foi verificado e como

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` + `npm run build` | passam |
| Testes do servidor (`server`, `npm test`) | 7/7 passam |
| Reprodução do conflito de sincronização (2 dispositivos simulados, servidor em memória) | **reproduzido** (ver 1.1) |
| Cobertura de artigos do edital × aulas e questões (script) | feita (ver 2.2) |
| Conferência de texto legal contra fonte oficial | **não feita**: é a Fase 4 |

## 1. Problemas técnicos, por criticidade

### 🔴 Crítico

**1.1 Sincronização gera "conflito" sem alteração real.** Reproduzi: cadastro no dispositivo A, login no B, depois só movimento de mouse por 35 s nos dois. Resultado: A entrou em estado **"conflito"**, sem nenhuma resposta ou estudo.
Causas, em `src/lib/useProgress.ts`, `src/lib/sync.ts` e `src/App.tsx`:
1. O app soma `seconds` ao progresso a cada 15 s de interação. Isso muda o documento e agenda um envio (debounce de 3 s) em **todo dispositivo aberto**.
2. O servidor aceita só `baseVersion` igual à versão atual (correto). Mas dois dispositivos ativos se alternam e um deles sempre recebe 409.
3. Ao receber 409, o cliente adota a versão do servidor **sem mesclar** e marca os dois documentos (progresso e conteúdo) como conflitados.
4. A resolução é "manter servidor" ou "manter este navegador", documento inteiro. Quem escolher o lado errado perde dados. É a regra "último vence" que o pedido proíbe.
5. Em estado de conflito, `scheduleSync` para de enviar. Nada mais sincroniza até a escolha manual.
6. O `reconcile` roda só no login e no botão "Sincronizar agora". Ao reabrir o app ou voltar ao foco, nada é puxado.
7. Sem tentativas repetidas nem fila offline: erro de rede vira mensagem e pronto.
8. Duas abas no mesmo navegador compartilham o `localStorage`, mas cada uma guarda as versões na própria memória.

**1.2 "Concluir aula" não mede aprendizado** (`Lesson.tsx`, `useProgress.ts`, `status.ts`). A aula conclui quando **todas as questões foram respondidas**, mesmo com 5 erros em 5, e ainda paga XP. `topicStatus` vira "Estudado" nessa hora. "Dominado" depende só de os flashcards estarem maduros no repetidor espaçado, sem olhar o desempenho em questões. Não há histórico de tentativas, tempo por questão nem amostra mínima.

**1.3 O Admin não corrige o conteúdo embutido** (`src/lib/content.ts`, `Admin.tsx`).
- Aulas, questões e flashcards embutidos (510/102/616) são somente leitura. O Admin só cria itens `u-…` novos.
- Esses itens ficam **no navegador de cada usuário**, sem servidor de conteúdo global.
- O "modo editor" é um interruptor local, **sem senha e sem papel de administrador no servidor** (a própria página "Em breve" admite isso).
- Corrigir um gabarito embutido exige editar o código e reimplantar.

### 🟠 Alto

**1.4 Nenhum teste de frontend está no repositório.** Só existe `server/test/api.test.js`. Os testes de dados, lógica, progressão e Admin que usei até agora ficaram fora do projeto. O `package.json` da raiz não tem script `test`. Na Fase 2 eles entram no repo.

**1.5 Segurança.** O que **está bom** (conferido no código): helmet, CORS com lista de origens, limite de tentativas no login/cadastro (20 por 15 min), bcrypt custo 12, hash falso para igualar o tempo de resposta, JWT HS256 com segredo ≥ 32 caracteres, validação de e-mail e senha, `.env` fora do git (`git ls-files` só lista os `.env.example`), nada sensível no frontend.
O que **falta**:
- Não existe papel de admin (ver 1.3).
- JWT de 7 dias, sem renovação nem revogação, guardado no `localStorage`.
- O servidor aceita qualquer objeto JSON como "progresso", até 1 MB, **sem validar o formato**. Dado corrompido de um dispositivo é replicado aos outros.
- Sem `trust proxy`: atrás de um proxy, o limitador enxerga um IP só.
- Sem limite de taxa nas rotas `/api/data`.
- `DELETE /api/me` apaga a conta sem pedir a senha.
- O cadastro responde "e-mail já cadastrado" (enumeração de usuários). É um compromisso comum, mas o requisito de recuperação de senha pede cuidado.
- Sem CSP para o frontend publicado.
- **Higiene:** o zip enviado continha `server/.env` com credenciais reais. Não envie esse arquivo. Além disso, **meu comando de conferência imprimiu, por erro, os primeiros caracteres do `JWT_SECRET` no log desta sessão.** O risco é baixo, mas recomendo **trocar o `JWT_SECRET`** (isso encerra as sessões ativas) e confirmar que a senha do MongoDB não é a de nenhum outro serviço.

### 🟡 Médio

**1.6 Textos desatualizados** (`Soon.tsx`, `Dashboard.tsx`, `README.md`):
- `Soon.tsx` ainda lista como planejado: "Demais aulas e questões do edital (hoje: Crase e Peculato)" e "Login/cadastro e dados no servidor". As duas coisas já existem.
- `Dashboard.tsx`: "Pronta para conquistar sua aprovação no TJSP?" promete resultado.
- Há 102 aulas que se apresentam como "Aula" completa, em desacordo com o novo posicionamento (reforço, não curso).
- O README descreve o produto por "Fases" antigas.

## 2. Conteúdo contra o edital

### 2.1 Estado de validação (hoje)
- **510 de 510 questões** estão marcadas `inedita-ia`. Nenhuma tem status de conferência. O tipo `Question` já prevê `ia-revisada`, mas nenhuma usa.
- **Nenhuma das 102 aulas tem campo de validação.** O aviso "confirme no site oficial" existe como texto solto em parte das aulas (32 de 102 não têm nenhum aviso; são sobretudo Português, Matemática, Informática, Raciocínio Lógico e Atualidades).
- A origem de cada fonte, o que foi lido e o que não foi, só consta no README (notas dos lotes 10 a 12), sem campo estruturado.
- **Classificação inicial proposta:** todo o conteúdo jurídico entra como "Pendente de verificação externa". Nada é "Validado" sem conferência contra fonte oficial.

### 2.2 Artigos do edital × o que as aulas citam
Método: um script extrai números de artigos do texto de aulas e questões. "Citado" não significa "bem explicado".

| Norma (edital) | Artigos exigidos | Não citados em nenhuma aula nem questão |
|---|---|---|
| CP (293–305; 307; 308; 311-A; 312–317; 319–333; 336–337; 339–347; 357; 359) | 49 + 311-A | nenhum por faixa; na medida rígida, **294, 295 e 301** nunca aparecem individualmente |
| CPP (251–258; 261–267; 274; 351–372; 394–497; 531–538; 541–548; 574–667) | 252 | **423–435, 447, 450–452, 473–481, 492–497** |
| Lei 9.099 (60–83; 88–89) | 26 | nenhum |
| CPC (144–155; 188–275; 294–311; 318–538; 994–1026) | 372 | **481–484** |
| Lei 9.099 (3º–19) | 17 | nenhum |
| Lei 10.261/68 (1–86; 171–175; 239–323) | 176 | nenhum |
| CF (art. 5; 6–11; 12–13; 37–41; 92) | 15 | **art. 40 sem citação explícita** (a verificar) |
| Lei 13.146 (1–13; 34–38) | 18 | nenhum |

- **Lacuna real e mais importante:** no Júri (CPP), os títulos das aulas pulam trechos do próprio intervalo 394–497 do edital. Hoje as aulas dizem "arts. 406 a 421 e 436 a 446" e "arts. 453 a 472 e 482 a 491". Ficam de fora 422–435, 447–452, 473–481 e 492–497.
- Numa medida mais rígida (só números citados um a um, sem expandir faixas) há dezenas de artigos "não citados individualmente" no CPP (≈104), CPC (≈159) e Lei 10.261 (≈44). Isso **não prova lacuna**, porque a aula pode cobrir por faixa. Indica onde a conferência manual precisa olhar.
- **Profundidade:** Direito Penal tem 7 aulas/35 questões para 49 artigos. O edital não informa peso por matéria dentro das 30 questões de Direito, então não afirmo desequilíbrio. Cada aula tem só 5 questões, o que é pouco para estimar domínio (ver 3.3).

### 2.3 Regra temporal do edital
O Anexo VIII manda considerar a legislação com as alterações **vigentes até a data da publicação do edital**. O edital está assinado em **14/10/2026** (confirmar a data da publicação no DEJESP). Legislação posterior só vale se for superveniente ou complementar a um tópico já previsto.
**Problema encontrado:** o texto das Normas da CGJ que li para o Lote 12 estava "atualizado até 22/10/2026", **depois** do marco. Pode haver dispositivo alterado depois de 14/10. Essas 9 aulas, além das Res. 850/963, LC 1.111 e Regimento, entram como "Pendente de verificação externa".

### 2.4 Riscos específicos
- **Atualidades** ("fatos a partir do 1º semestre de 2026"): conteúdo datado, precisa de fonte e data em cada fato.
- **Matemática (65 questões):** os cálculos nunca foram refeitos por script. Isso é feito na Fase 4.
- **Eliminatório:** Blocos I e II exigem **50% de acerto cada** (≥ 15 das 30 de Direito). O diagnóstico deve mostrar o desempenho **por bloco**.

## 3. Plano por fase

### Fase 2 — Segurança e integridade dos dados
**Arquivos:** `src/lib/sync.ts`, novo `src/lib/merge.ts`, `src/lib/useProgress.ts`, `src/App.tsx`, `src/pages/Settings.tsx`, `server/src/app.js`, `server/src/repo.*.js`, testes novos.
**Solução:**
1. **Mesclagem por campo, sem escolha de lado.** `answers` por questão (vence a resposta mais recente); `completed` por união (menor data); `cards` por cartão (mais revisado vence); `errors` por contador máximo e `resolved` pela data; `studyDays`, `bonusDays`, `reviewXpDays`, `mockXpDays` e `favorites` por união; `notes` por `updatedAt`; `mocks` por `id`; XP e contadores diários por máximo (e XP recalculado do que é derivável).
2. O tempo de estudo (`seconds`) deixa de disparar envio sozinho: só entra junto com outra alteração, ou a cada alguns minutos.
3. No 409, o cliente baixa, **mescla, reenvia** e só mostra algo ao usuário se a mesclagem for impossível. Antes de qualquer mescla destrutiva, guarda uma cópia local de segurança.
4. Puxar ao abrir o app e ao voltar ao foco; tentativas com espera crescente; estado "sem conexão" claro; proteção entre abas.
5. Servidor: validar o formato do progresso (`schemaVersion` e tipos), limitar taxa em `/api/data`, `trust proxy` configurável, pedir senha para apagar conta, papel `admin` por variável de ambiente (`ADMIN_EMAILS`) já aplicado nas rotas administrativas.
6. Colocar no repositório os testes de frontend, com `npm test` na raiz.
**Testes novos:** mesclagem (propriedades: idempotente, comutativa, sem perda de resposta), dois clientes simultâneos contra o servidor em memória, reconexão após queda, dispositivo B antigo (offline) voltando, e o cenário que reproduzi hoje (35 s só com mouse não pode gerar conflito).
**Limitações:** o conflito humano só ocorre se o mesmo campo for editado nos dois lados de modo incompatível (ex.: a mesma nota). Aí a regra é "mais recente vence" com aviso e cópia de segurança.

### Fase 3 — Nova metodologia
**Arquivos:** `Lesson.tsx` (vira "Estudo → Teste → Reforço"), `Edital.tsx`, `status.ts`, nova página `Validar.tsx`, `Dashboard.tsx`, `Stats.tsx`, `plan.ts`, `missions.ts`, `gamification.ts`, `types.ts`, `useProgress.ts`.
**Modelo de dados (aditivo, com `schemaVersion`):** por assunto `{ studyDoneAt, source? }`; `attempts[]` com data, questões, acertos, tempo e por questão `{id, chosen, correct, seconds}`. As três métricas ficam separadas: **cobertura de estudo**, **cobertura de avaliação** e **domínio estimado**.
**Status (os 8 do pedido):** Não iniciado, Estudando externamente, Estudo teórico realizado, Aguardando avaliação, Precisa reforçar, Em revisão, Bom desempenho, Domínio consolidado.
**Regra de domínio (proposta, a confirmar):** "Domínio consolidado" só com acertos ≥ 80% em **pelo menos 2 avaliações em dias diferentes**, e mínimo de **10 questões distintas** respondidas no assunto. Abaixo disso aparece "amostra insuficiente". Como cada aula tem 5 questões, assuntos grandes vão precisar de mais questões (Fase 4), ou o diagnóstico agrupa por assunto do edital em vez de por aula.
**XP:** XP de aula deixa de ser dado por "responder tudo". Passa a ser dado por "marcar estudo" (valor menor) e por desempenho em teste. Conquistas e missões que contam "aulas concluídas" são reescritas para contar avaliações.
**Migração:** `completed[lessonId]` vira "Estudo teórico realizado", rotulado "migrado", e **nunca** vira domínio. `answers` atuais viram uma tentativa "legada" por assunto, sem tempo. Antes de migrar, grava-se `aprova-tjsp:v1:backup`. XP, nível, conquistas, simulados, anotações e flashcards ficam intactos.
**Nova página "Validar meu aprendizado":** disciplina → assunto → "Já estudei" → diagnóstico (só questões do assunto, sem completar com outros assuntos) → resultado comentado, tópicos com erro, recomendações e evolução entre tentativas.

### Fase 4 — Qualidade do conteúdo
1. Acrescentar a cada aula, questão e flashcard o campo `validation` (`validado`, `complementar`, `corrigir`, `pendente`) e as fontes. **Ponto de partida: tudo jurídico = `pendente`.**
2. Suprir as lacunas de 2.2 (Júri do CPP, CPC 481–484, CF art. 40) e conferir as de leitura manual.
3. Conferir artigo por artigo contra fonte oficial; o Planalto não abre aqui, então uso ALESP, Senado e API do TJSP e registro cada conferência (ou a pendência).
4. Refazer por script as contas da Matemática e do Raciocínio Lógico.
5. Questão com gabarito incerto sai das avaliações de desempenho (flag `excluida`) até ser corrigida.
6. Reavaliar as 9 aulas da CGJ contra a regra de 14/10/2026.
**Limitação:** sem acesso às fontes oficiais primárias, o máximo que posso afirmar é "conferido em fonte secundária"; só você (ou a banca) decide "validado".

### Fase 5 — Admin e documentação
Conteúdo embutido vira dado do **servidor**, carregado uma vez a partir dos arquivos atuais e **sem sobrescrever o que o admin editou**. IDs atuais são mantidos, para não quebrar progresso. Se o gabarito de uma questão mudar, as respostas antigas dela são revalidadas. Edição de resumos, questões, gabaritos e flashcards, referências, status de validação, publicar/retirar e histórico de alterações; acesso por papel `admin` no servidor. Textos desatualizados (1.6) e README reescritos.

### Fase 6 — Complementares
Recuperação de senha (token de uso único, validade curta, guardado só como hash, limite de tentativas, resposta idêntica exista ou não o e-mail) e importação de PDF no Admin (rascunho, nunca publicado automaticamente, com origem registrada). **Dependem de um provedor de e-mail real**: não vou simular envio. A Tutora TJSP continua fora do escopo.

## 4. Riscos de migração
- Os dados reais estão no `localStorage` (`aprova-tjsp:v1`) e no servidor (documento `progress`/`content` em texto JSON). Cada mudança de formato precisa de `schemaVersion`, de migração idempotente e de backup antes de aplicar.
- Mudar gabarito ou texto de questão pode contradizer respostas já gravadas. Será preciso guardar a versão do conteúdo em cada resposta.
- Mover o conteúdo para o servidor cria dependência de rede. O app precisa continuar abrindo sem servidor, com o conteúdo embutido como reserva.
- Banco do servidor em produção: não conheço o estado dele. Antes de tocar nele, é preciso um backup.

## 5. O que fica preservado
Identidade visual, dashboard, contas e login, XP, níveis e conquistas, simulados, flashcards e repetição espaçada, anotações, cronograma, redação, filtro novo de "Estudar", execução local pelo VS Code e o deploy atual.

## 6. Pendências e decisões para começar a Fase 2
1. **Trocar o `JWT_SECRET`** (ver 1.5). Isso desconecta quem estiver logado.
2. **Quem é o admin?** Proponho `ADMIN_EMAILS` no `.env` do servidor. Você me passa o e-mail.
3. **Meta de domínio** (80% em 2 avaliações, ≥ 10 questões): aceita ou prefere outra?
