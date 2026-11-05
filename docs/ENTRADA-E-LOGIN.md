# Aprova TJSP — Tela inicial, login/cadastro e menu de perfil

Data: 05/11/2026. A Fase 3 **não foi iniciada**.

## 1. Fluxo
Visitante → `#/` (boas-vindas) → `#/login` ou `#/register` → `#/dashboard` (ou a página que tentava abrir). Conectado → dashboard direto. Sem `VITE_API_URL` o app continua 100% local, sem telas de conta.

## 2. Arquivos
Novos: `src/lib/route.ts`, `src/lib/session.ts`, `src/lib/auth.ts`, `src/lib/authForm.ts`, `src/pages/Welcome.tsx`, `src/pages/Auth.tsx`, `src/components/PublicShell.tsx`, `src/components/ProfileMenu.tsx`, `tests/route.test.ts`, `tests/session.test.ts`, `tests/e2e/auth-flow.cjs`, este documento.
Modificados: `src/App.tsx` (rota por hash, proteção, menu), `src/pages/Settings.tsx` (sem formulário de login; "Sair" e "Apagar conta" passam pela troca segura de dados), `src/lib/sync.ts` (`authenticate` devolve resultado e aceita um gancho pré-sincronização; `verifySession`; `reload`), `src/lib/useProgress.ts` (`clearLocal`, `toast` exposto), `src/lib/content.ts` (`clearContentLocal`), `src/index.css`, `tests/helpers.ts` (relógio crescente: corrigiu um teste que podia falhar por acaso), `tests/e2e/two-devices.cjs`, `README.md`.
Não alterados: servidor, `repo.mongo.js`, JWT, validações, modelo de eventos e mesclagem.

## 3. Decisões
- **Hash em vez de caminhos** (`#/login` e não `/login`): funciona em qualquer hospedagem sem configurar reescrita. As rotas antigas não existiam (a navegação era por estado); agora cada página tem endereço.
- **Uma só autenticação**: login/cadastro continuam em `sync.authenticate`; a validação do formulário repete as regras do servidor (e-mail válido, senha de 8 a 72). Acrescentei "Repita a senha" no cadastro, porque a recuperação por e-mail só vem na Fase 6.
- **Sem "Esqueci minha senha" e sem botões de recursos futuros.**
- **Dono dos dados**: o navegador guarda de qual conta são os dados locais. Ao entrar com outra conta, os dados da anterior são guardados numa cópia própria e o estado ativo é esvaziado (sem criar "época" e sem apagar nada no servidor).
- **Sair da conta**: envia pendências (até 5 s) → guarda cópia da conta → encerra sessão → esvazia estado → página inicial. Sem conexão, as alterações não enviadas ficam na cópia e voltam, somadas, quando a mesma conta entrar de novo.
- **Sessão**: só 401 derruba; rede/5xx/timeout mantêm o usuário. Sessão expirada leva ao login com aviso e mantém os dados locais.
- Outra aba que sai da conta faz esta aba também limpar a memória, para que dados da conta anterior não "revivam".

## 4. Testes executados
| Verificação | Resultado |
|---|---|
| `tsc` (app e testes) | sem erros |
| `npm run build` | ok |
| Vitest (front) | **65/65** (16 novos: rotas/proteção, validação, login/logout/troca de conta contra servidor real) |
| Servidor | **12/12** |
| E2E no navegador, `auth-flow.cjs` | **todas as verificações passaram**: boas-vindas, validação, login inválido, cadastro, confirmação, sessão ao atualizar sem piscar o login, redirecionamento e retorno ao destino, menu por mouse/teclado/toque fora, Configurações sem login duplicado, logout, troca de contas A↔B no mesmo navegador, sessão expirada, backend fora do ar, celular 390 px sem rolagem lateral, 0 violações axe (WCAG A/AA) em boas-vindas, login, cadastro e menu, sem erros de JavaScript |
| E2E de dois aparelhos (`two-devices.cjs`, atualizado) | ok: migração, sincronização e 35 s sem conflito |

## 5. Limitações
1. Acessibilidade medida com axe só nas telas novas. **O restante do app já tinha violações** (contraste dos títulos do menu lateral e `select` sem nome na página Questões); não mexi para não alterar o visual existente. Vale tratar numa etapa própria.
2. Se o armazenamento do navegador estiver cheio, a cópia local da conta pode não caber; o app então mantém os dados locais ao sair com pendências (nada se perde), mas num caso extremo de sessão expirada + troca de conta + armazenamento cheio, dados não enviados da conta anterior podem não ser guardados.
3. A cópia de uma conta fica no navegador depois do logout (é o que protege contra perda). Em computador compartilhado, limpe os dados do site se quiser removê-la.
4. O token continua no `localStorage` e dura 7 dias; sem revogação (como na Fase 2).
5. O limite de tentativas de login (20 por 15 min por IP) continua valendo: o roteiro E2E exige reiniciar o servidor de teste entre execuções.
6. Não testei contra o MongoDB Atlas (você já validou a sincronização); os testes usam o repositório em memória, que é o mesmo caminho de código do cliente.
7. Telas testadas no Chromium (Playwright); Safari/Firefox não foram testados.

## 6. Preservado
Endpoints, JWT, validações, histórico de respostas, XP, conquistas, simulados, flashcards, backups e a sincronização entre dispositivos. Quem já estava conectado continua conectado.
