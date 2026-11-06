# Fase 4 — Auditoria e ampliação do banco de questões

Data: 06/11/2026. **Resumo honesto:** a infraestrutura de auditoria foi entregue e 64 questões de Matemática foram validadas por recálculo em código. **A auditoria jurídica NÃO foi concluída**: as fontes oficiais (Planalto, Câmara, TJSP) não puderam ser acessadas neste ambiente, então nenhuma questão de Direito, Legislação Interna ou Atualidades foi confirmada contra o texto oficial e todas continuam **Pendente**. Os testes automatizados verificam a estrutura do banco; **não** provam que o conteúdo jurídico está correto.

## 1. Inventário (Etapa A)
Banco após a fase: **520 questões, 61 assuntos** (510 existentes + 10 novas autorais), 102 aulas, 616 flashcards. IDs únicos, nenhum assunto inexistente, nenhuma alternativa sem explicação, gabaritos válidos (ver `tests/bank.test.ts`).

| Disciplina | Assuntos | Questões | Assuntos com ≥10 questões | Validadas | Não validadas |
|---|---|---|---|---|---|
| Língua Portuguesa | 13 | 65 | 0 | 0 | 65 |
| Direito Penal | 5 | 35 | 2 | 0 | 35 |
| Direito Processual Penal | 2 | 50 | 2 | 0 | 50 |
| Direito Processual Civil | 3 | 60 | 1 | 0 | 60 |
| Direito Constitucional | 5 | 35 | 2 | 0 | 35 |
| Direito Administrativo | 2 | 50 | 2 | 0 | 50 |
| Legislação Interna do TJSP | 5 | 80 | 4 | 0 | 80 |
| Atualidades | 2 | 15 | 1 | 0 | 15 |
| Matemática | 13 | 75 | 2 | 64 | 11 |
| Informática | 7 | 35 | 0 | 0 | 35 |
| Raciocínio Lógico | 4 | 20 | 0 | 0 | 20 |
| **Total** | **61** | **520** | **16** | **64** | **456** |

- **Correspondência com o edital 02/2026 (Anexo VIII):** os 61 assuntos seguem o Anexo VIII; não foram criados, removidos nem renomeados assuntos nesta fase. Não identifiquei assunto duplicado ou fora do edital; também não houve reclassificação de questões. Observação: o edital completo não foi reaberto nesta etapa — a comparação usa o mapeamento já conferido nas fases anteriores.
- **Duplicidade:** nenhum par de questões com enunciado e alternativas idênticos. Há enunciados genéricos repetidos (ex.: "Assinale a alternativa em que a concordância verbal está correta") com alternativas diferentes — são itens distintos, não duplicatas (pares inspecionados: conc-2/5, col-1/3, reg-1/3/4, pont-1/3, inter-1/2/3).
- **Cobertura:** nenhum assunto tem 10 questões *validadas*. A meta de 10 só foi alcançada em número de questões (16 assuntos), não em validação.

## 2. Auditoria (Etapas B e D)
Resultados verificáveis (`tools/audit-summary.ts`, `docs/FASE-4-AUDITORIA.json`):

| Item | Quantidade |
|---|---|
| Questões com registro de auditoria | 520 de 520 |
| Lidas integralmente por IA (revisão textual) | 520 |
| Conferidas contra **fonte oficial** | **0** |
| Revisadas por **humano** | **0** |
| Recalculadas por código (Matemática) | 64 (+10 novas) |
| Validada | 64 |
| Pendente | 456 |
| Precisa de correção / Precisa de complementação | 0 / 0 |
| Com achados de qualidade registrados | 307 (249 com explicação curta; 146 com alternativa correta mais longa; 4 jurídicas sem referência explícita) |
| Risco alto / médio / baixo (para conferência) | 145 / 215 / 160 |

**O que cada método significa** (registrado em cada ficha, campo `methods`): `revisao-ia-textual` = leitura por IA com base no conhecimento do modelo, sem cotejo com texto oficial; `calculo-automatizado` = resposta recalculada em código (`src/data/calc-checks.ts`), com teste que exige que o gabarito coincida e que nenhuma outra alternativa tenha o mesmo valor; `conferencia-normativa` e `validacao-humana` = nenhuma questão as tem.

**Direito (prioridade):** li Penal, Processual Penal, Processual Civil, Constitucional, Administrativo (CF e Lei 10.261/68, Lei 8.429/92 pós-14.230) e Legislação Interna. Não encontrei erro evidente, mas isso é apenas julgamento do modelo. Pontos que mais exigem conferência humana/oficial: números de artigos e prazos da Lei 10.261/68 (ex.: `adn-2`, inassiduidade), resoluções TJSP alteradas com frequência (ex.: `itt-2`, Res. 850/2021 "na redação original"), Normas da Corregedoria (prazos em dias/horas), `nac-4` (art. 12, § 4º, CF após a EC 131/2023) e todo o bloco de Legislação Interna. As fontes eram resumos automatizados de páginas secundárias, como registrado nos comentários dos arquivos de dados.

**Matemática:** 64 questões validadas por recálculo. A conferência também confirmou que os distratores "iguais ao gabarito" (`razao-1` alternativa E = 6/15 não simplificada; `geo-4` alternativa C = 24 m²) são intencionais e estão corretamente explicados. **Recomendo ainda uma leitura editorial humana do enunciado** dessas 64.

**Português, Raciocínio Lógico (lógica), Informática, Atualidades:** revisão textual por IA, Pendente. Atualidades são fatos datados (04–05/11/2026) e devem ser reconferidos perto da prova.

## 3. Correções (Etapa C)
**Nenhum erro foi confirmado em fonte oficial, portanto nenhum gabarito, enunciado ou explicação existente foi alterado e nenhuma questão recebeu "Precisa de correção".** Isso não significa ausência de erros — significa ausência de erro *comprovado*. O que foi entregue:
- `src/data/revisions.ts`: histórico de revisões (versão, data, motivo, fonte, conteúdo anterior, `supersededBy`, `invalidatesMastery`), hoje vazio. Política: correção que não muda o sentido mantém o ID; mudança de gabarito/sentido encerra a questão antiga (`substituicao`) e cria novo ID. O ID antigo permanece no catálogo, de modo que respostas, simulados e XP históricos não são reinterpretados nem recalculados; ele só sai de novas avaliações e do domínio (`poolOf` em `src/lib/learning.ts`).
- Os 307 achados de qualidade (explicações curtas, pista de tamanho) ficaram registrados nas fichas, **sem reescrita em massa**, para não alterar silenciosamente questões já respondidas.
- Aulas jurídicas, flashcards e caderno de erros: não foram alterados (sem erro confirmado a refletir). Revisão desses materiais contra fonte oficial permanece pendente.

## 4. Ampliação (Etapa E)
Um lote controlado: **10 questões autorais de IA** (`src/data/batch-f4a.ts`, origem `autoral`) em MMC/MDC (`mmc-6..10`) e Porcentagem (`porc-6..10`), estilo VUNESP mas **não oficiais** e sem cópia de banco comercial. Todas **nascem Pendente** (regra da fase), com explicação por alternativa e resposta recalculada em código. Não ampliei Direito/Legislação: sem fonte oficial acessível, criar questões novas aumentaria o volume de itens não verificáveis, contra a prioridade de qualidade definida. Meta de 10 questões *validadas* por assunto: **não atingida em nenhum assunto**.

## 5. Qualidade, fontes e limitações
- Fontes oficiais inacessíveis: planalto.gov.br, camara.leg.br, tjsp.jus.br (bloqueio de rede). Nenhuma consulta oficial foi feita nesta fase; portanto "data de consulta" e "versão da norma" de conferência normativa **não existem** para nenhuma questão.
- Respostas das fichas: data de revisão 06/11/2026 (revisão IA) — não confundir com data de consulta oficial.
- Itens para revisão humana: todas as 456 Pendentes; prioridade pelo campo `risk` (145 de risco alto), começando por Legislação Interna e Lei 10.261/68.
- Percentuais de validação: 64/520 validadas (12,3%) — todas por cálculo, nenhuma jurídica.

## 6. Engenharia
- **Novos:** `src/data/audit.ts` (fichas e regras), `src/data/revisions.ts`, `src/data/calc-checks.ts`, `src/data/batch-f4a.ts`, `src/data/questions-raw.ts`, `src/lib/numparse.ts`, `tests/bank.test.ts` (20 testes), `tools/` (`inventory`, `audit-structural`, `audit-summary`, `calc-verify`, `export-audit`, `dump`, `brief`), `docs/FASE-4-AUDITORIA.json`.
- **Alterados:** `src/data/questions.ts` (agora aplica o status do registro de auditoria ao catálogo), `src/lib/learning.ts` (`poolOf` ignora questões substituídas), `tests/learning.test.ts` (o teste "tudo pendente" passou a refletir a regra: só validadas por cálculo).
- **Migração não destrutiva:** nenhum dado de usuário foi tocado. O status do catálogo é só o valor *padrão*; a validação por conta (`content.validations`) continua prevalecendo (LWW). Contas existentes passam a ver as 64 de Matemática como Validada por padrão, salvo sobrescrita local.
- **Compatibilidade com a Fase 3:** prática aceita Pendente/Complementação; "Precisa de correção" fica fora das avaliações; só Validada conta para domínio (testes). Histórico, XP, simulados, flashcards e sync não foram alterados (suítes de eventos, compactação e sync passam).
- **Testes executados:** Vitest 130/130; servidor (`node --test`) 12/12; `tsc` sem erros; build ok; E2E `tests/e2e/learning-flow.cjs` ok (modo local). O E2E de auth não foi reexecutado (nada de auth/sync mudou). **Testes estruturais ≠ validação jurídica.**
- **Publicação/administração:** a validação local por conta **não** é aprovação oficial global. Correções de catálogo chegam aos usuários com o deploy do app (arquivos `src/data`); sobrescritas locais de validação não são apagadas. Publicação global segura (aprovar uma vez para todos, com perfil admin no backend) depende do backend administrativo da Fase 5; nada foi feito para contornar isso nem foram criadas permissões de admin inseguras.
- **Riscos:** (1) os 64 "Validada" dependem de a leitura do enunciado estar correta; (2) 456 Pendentes dependem de conferência humana/oficial; (3) `origin` das 510 antigas permanece `inedita-ia`.

Não avancei para a Fase 5.
