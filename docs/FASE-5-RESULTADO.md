# Fase 5 — Painel administrativo, gestão de conteúdo e publicação segura

Data: 2026-11-12. Escopo: catálogo editorial central (backend/MongoDB), painel Admin, versionamento, revisão, publicação, substituição, concorrência e compatibilidade. Não foi iniciada a Fase 6.

## 1. Resumo honesto
- Implementado e testado em **repositório em memória** (mesmo contrato do repositório MongoDB): autorização, importação idempotente, CRUD/rascunho/revisão/publicação de questões, aulas e flashcards, substituição, arquivamento, histórico/restauração, concorrência (409), isolamento do progresso.
- **NÃO foi testado contra um MongoDB real** (o ambiente de desenvolvimento não tem mongod e o download foi bloqueado). O código `server/src/repo.mongo.js` (coleções `ed_items`, `ed_history`, `ed_meta`) está escrito e a **mesma suíte** roda contra ele quando `MONGODB_TEST_URI` está definido (seção 13). Até você rodar isso, a persistência real em Atlas é **não verificada**.
- A interface do Admin compila (TypeScript) e o build passa, mas **não foi exercitada manualmente em navegador** nesta sessão; só há testes automatizados da lógica de cliente (catálogo) e do servidor. Recomendo um passeio manual (seção 12).
- Nenhuma classificação de validação foi alterada automaticamente. Os números da Fase 4C permanecem: 524 questões; 449 validadas, 4 precisam de correção, 2 de complementação, 69 pendentes. “Validada” da auditoria = conferência por IA/ferramentas, **não** revisão humana independente.

## 2. Arquitetura
Modelo de **sobreposição (overlay)** aditivo, sem migração destrutiva:
- O catálogo embutido (TypeScript) continua sendo a base. O servidor guarda, por conteúdo, um registro editorial; só o que foi **publicado/arquivado/substituído/validado** é exposto aos estudantes via `GET /api/catalog` (ETag `W/"cat-<rev>"`, 304 quando igual).
- O front aplica o overlay em `content.ts rebuild()`; revisão do catálogo é monotônica (cópia mais antiga/igual nunca substitui a mais nova; cache local `aprova-tjsp:catalog:v1`). Sem rede, vale a última cópia conhecida.
- O catálogo editorial é **separado** do progresso: nada em eventos, checkpoints, backups ou controle de conflito foi alterado; aplicar um catálogo não lê nem escreve o progresso (teste).

## 3. Modelo de dados (MongoDB)
- `ed_items` (um por conteúdo; chave `{kind,id}`): `kind` (question|lesson|card), `id`, `rev` (versão otimista), `origin` (catalogo|admin), `pub` (rascunho|publicada|arquivada), `live` (dados publicados; null se o base está intocado), `draft{data,state(rascunho|em-revisao),by,at,reason}`, `validation`, `validationSource` (auditoria-ia | revisao-humana-administrador | revisao-profissional-declarada | reaberta-por-edicao | nenhuma), `validationNote/Ref/By/At`, `supersededBy`, `replaces`, `baseTopic`, `baseLesson`, timestamps.
- `ed_history` (índice único `{kind,id,rev}`): id, versão, autor, data, tipo de alteração, justificativa, antes/depois, referência, estado de publicação.
- `ed_meta`: contador de revisão do catálogo publicado.
- Duas dimensões independentes: **validação** (Pendente / Precisa de correção / Precisa de complementação / Validada) e **publicação** (Rascunho / Em revisão / Publicada / Arquivada).

## 4. Endpoints
Todos `/api/admin/*` exigem token válido **e** e-mail na lista de admins (verificada no servidor, por requisição); limitador 300/15 min por usuário nas escritas.
- `GET /api/admin/overview`, `/items`, `/items/:kind/:id`, `/history`, `/export`; `POST /api/admin/import` (idempotente).
- `POST /api/admin/items/:kind` (criar; idempotente por `clientKey`), `PUT …/:id/draft`, `DELETE …/:id/draft`, `POST …/:id/state` (em-revisao | rascunho | publicada | arquivada), `POST …/question/:id/validation` (revisão), `POST …/question/:id/replace`, `POST …/:id/restore`.
- Público autenticado: `GET /api/catalog`. `GET /api/me` informa `admin` (só para exibir o menu).

## 5. Autorização
- `ADMIN_EMAILS` normalizado (trim + minúsculas); decisão sempre a partir do e-mail do usuário no banco; JWT carrega apenas `sub` — claims forjadas (ex.: `admin:true`) são ignoradas (testado).
- Sem token → 401; token inválido → 401; usuário comum → 403 (testados). O frontend esconde o menu, mas a segurança é só do backend.
- **Risco documentado**: o cadastro não verifica e-mail. Como o admin é definido por e-mail, quem registrar o e-mail de admin **antes** do dono poderia obter acesso. Registre sua conta admin primeiro (você já tem `ADMIN_EMAILS`); considere verificação de e-mail numa fase futura.

## 6. Fluxos de edição, revisão e publicação
- Questão do catálogo: só `explicação por alternativa` e `referência` são editáveis in-place; qualquer mudança de enunciado/alternativas/gabarito/assunto exige **Substituir** (nova questão, ID antigo rastreável via `supersededBy`/`replaces`; a substituída nunca volta ao pool, histórico e respostas antigas preservados).
- Questão criada no Admin: conteúdo completo; depois de publicada, não muda enunciado/opções/gabarito/assunto (422 → usar Substituir).
- Rascunho → (Em revisão) → Publicada. Publicar exige conteúdo válido e, vindo de rascunho, `confirmReviewed:true`. `precisa-correcao` bloqueia publicação. Publicar edição de questão `validada` **reabre** a validação para pendente (a menos que `keepValidation`).
- Revisão: o painel registra “revisão humana do administrador” ou “revisão profissional declarada” com nota/referência/autor/data; o texto “revisada por especialista” só aparece se a fonte for declarada como tal (o sistema não comprova credenciais).
- Aulas e flashcards: criar/editar texto, rascunho, revisão, publicar, arquivar/restaurar; IDs preservados; assunto (e aula do card) de itens do catálogo imutáveis; citações/tabelas das aulas preservadas. Arquivados somem das listas do estudante; progresso e histórico permanecem.
- Rascunhos nunca chegam ao estudante.

## 7. Histórico e versionamento
Cada mutação grava uma versão (`rev` +1) com autor, data, tipo, justificativa, antes/depois. Restaurar uma versão antiga **cria um novo rascunho** (não sobrescreve), com nova versão no histórico.

## 8. Migração do catálogo
- `npx tsx tools/export-seed.ts` gera `server/data/catalog-seed.json` (524 questões, 102 aulas, 616 flashcards) — ids, assuntos, validação e substituições.
- Na subida, o servidor importa a semente com `$setOnInsert` (só insere o que falta; **nunca** sobrescreve edição existente). Reexecutar é idempotente (testado). Nenhum dado existente é apagado ou modificado; a migração é aditiva. Backups recuperáveis = histórico por versão + `GET /api/admin/export`. Faça um snapshot do Atlas antes do primeiro deploy.
- Se o catálogo embutido mudar, regenere a semente (teste do front confere semente × catálogo).

## 9. Compatibilidade com Fases 3 e 4
- Critério de domínio **inalterado**. Só questões Validada + publicadas + elegíveis contam; arquivadas/substituídas/`precisa-correcao` ficam fora de pools (também corrigido: antes `precisa-correcao` podia vazar para simulados/banco via novo `activeQuestions()`).
- Precedência de validação no cliente: catálogo do servidor > edição local antiga (legado) > auditoria embutida > pendente. Questões novas do Admin entram como pendentes.
- Sincronização de progresso, eventos, XP, checkpoints e backups sem alteração. Cliente offline ou com catálogo antigo mantém todo o progresso; respostas antigas a questões depois arquivadas/substituídas continuam consultáveis.
- Conteúdo local criado antes (modo editor) **não** foi migrado automaticamente; fica acessível na aba “Conteúdo local (legado)”. O cartão “Modo editor” das Configurações foi removido (o Admin agora depende só do servidor).

## 10. Testes executados (nesta sessão)
| Verificação | Resultado |
|---|---|
| `npx tsc --noEmit -p .` | sem erros |
| `npx vitest run` (frontend) | 153/153 passaram (146 anteriores + 7 novos da Fase 5) |
| `npm --prefix server test` | 33 passaram, 0 falharam, 1 pulado (suíte MongoDB real, sem `MONGODB_TEST_URI`) |
| `npm run build` | ok |
Servidor (**repositório em memória**, 21 cenários compartilhados): autorização 401/403/JWT forjado; importação e contagens (524; 449/69/4/2); criar/publicar/visibilidade; conteúdo inválido; criação idempotente; correção de explicação com histórico; mudança de sentido recusada; validação reaberta; erro confirmado bloqueia publicação; rótulos de revisão humana; substituição; arquivar/restaurar; aulas; flashcards; concorrência (PUT paralelo → 200 + 409); restaurar versão; progresso isolado; ETag/304; overview/export.
Frontend (7): semente × catálogo, rev monotônica, exclusão de arquivadas/substituídas, precedência de validação e exclusão de `precisa-correcao`, questão admin como pendente, descarte de lixo, progresso intocado.
**Não executado**: suíte contra MongoDB real; teste manual da interface no navegador; testes de componentes React do Admin.

## 11. Limitações e pendências
1. Persistência Mongo real não testada (seção 13).
2. Interface do Admin sem teste automatizado de componentes nem passeio manual.
3. Renderização somente texto (HTML recusado na entrada e nunca injetado); sem negrito/listas.
4. Referências (`ref`) são guardadas e editáveis, mas ainda não exibidas ao estudante.
5. Cadastro sem verificação de e-mail (seção 5).
6. Semente deve ser regenerada quando o catálogo embutido mudar.
7. Conteúdo local legado (aulas/questões/vídeos do modo editor) não migrado automaticamente.
8. As 69 pendências continuam sem revisão humana; nada foi validado automaticamente.
9. Limitador de taxa é por processo (em várias instâncias, cada uma conta separado).

## 12. Como usar o Admin
1. No servidor, `ADMIN_EMAILS` com seu e-mail (já configurado) e `MONGODB_URI`; suba o servidor (a importação roda sozinha).
2. Entre com essa conta: aparece “Admin” no menu.
3. **Visão geral**: totais, validação, publicação, últimas alterações. **Questões**: filtre/busque; abra uma; edite explicação/referência (ou crie nova), salve rascunho (justificativa obrigatória), envie para revisão, publique. **Revisão**: registre sua revisão pessoal (ou profissional declarada). **Substituir** para mudar sentido. **Aulas / Flashcards**: mesmo fluxo. **Auditoria**: lista as pendentes (filtro padrão) com fonte, dispositivo, página, data, riscos.
4. Conflito: se outra aba/admin alterou antes, aparece “alterado por outra pessoa” com opção de carregar a versão atual; nada é sobrescrito em silêncio.
5. Passeio manual sugerido: criar rascunho → confirmar que o aluno (outra conta) não vê → publicar → ver aparecer após recarregar → arquivar → sumir do pool.

## 13. Verificar em MongoDB Atlas
1. Crie um banco de teste (nunca o de produção) e um usuário só para ele.
2. `cd server && MONGODB_TEST_URI='mongodb+srv://…/aprova_test' npm test` — a suíte compartilhada roda contra `repo.mongo.js` (índices únicos, `bulkWrite` com `$setOnInsert`, CAS por `rev`). Informe-me o resultado.
3. Em ambiente real: após o primeiro boot, `GET /api/admin/overview` deve mostrar 524 / 102 / 616; reiniciar o servidor não deve alterar nada (idempotência); no Atlas, confira as coleções `ed_items`, `ed_history`, `ed_meta` e os índices únicos.
4. Não coloque a string de conexão em arquivos versionados.

Nenhum segredo está neste documento nem no pacote (`.env` excluído).
