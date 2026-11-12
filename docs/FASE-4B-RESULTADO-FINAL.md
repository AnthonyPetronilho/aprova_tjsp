# Fase 4B — Resultado final da auditoria do banco de questões

Data: 06/11/2026 · Referência temporal: edital publicado em 19/10/2026 (informado pelo proprietário; **sem comprovação documental independente**), inscrições 28/10/2026, prova 14/03/2027 · Regra do Anexo VIII aplicada (legislação com alterações em vigor até a publicação do edital).

> **Leia primeiro.** Todas as conferências foram feitas por IA (leitura dos PDFs/textos fornecidos, páginas web e execução de ferramentas). **Nenhuma questão teve revisão humana.** "Validada" significa "confirmada pelo método indicado na coluna Método do arquivo individual", não "aprovada por revisor humano". **A base NÃO está integralmente validada**: 112 questões continuam Pendentes.

## 1. Totais

- Questões do banco original auditadas: **520** (523 no catálogo atual = 520 + 3 substitutas novas, ver §5).
- Validadas: **406** · Precisa de correção: **3** (as três antigas, já substituídas) · Precisa de complementação: **2** · Pendentes: **112**.
- Revisão humana: **0**.

### Por disciplina
| Grupo | Total | Validada | Precisa de correção | Precisa de complementação | Pendente |
|---|---:|---:|---:|---:|---:|
| Atualidades | 15 | 15 | 0 | 0 | 0 |
| Direito Administrativo | 50 | 49 | 0 | 1 | 0 |
| Direito Constitucional | 36 | 34 | 1 | 0 | 1 |
| Direito Penal | 35 | 35 | 0 | 0 | 0 |
| Direito Processual Civil | 60 | 59 | 0 | 0 | 1 |
| Direito Processual Penal | 51 | 49 | 1 | 0 | 1 |
| Informática | 35 | 9 | 0 | 0 | 26 |
| Legislação Interna do TJSP | 80 | 67 | 0 | 1 | 12 |
| Língua Portuguesa | 65 | 6 | 0 | 0 | 59 |
| Matemática | 75 | 64 | 0 | 0 | 11 |
| Raciocínio Lógico | 21 | 19 | 1 | 0 | 1 |
| **Total** | **523** | **406** | **3** | **2** | **112** |

### Por lote de auditoria
Lote "—" = questões sem registro documental individual (Matemática, Português e Informática não documentados).
| Grupo | Total | Validada | Precisa de correção | Precisa de complementação | Pendente |
|---|---:|---:|---:|---:|---:|
| 01 | 25 | 15 | 0 | 0 | 10 |
| 02 | 55 | 52 | 0 | 1 | 2 |
| 03 | 50 | 49 | 0 | 1 | 0 |
| 04 | 36 | 34 | 1 | 0 | 1 |
| 05 | 35 | 35 | 0 | 0 | 0 |
| 06 | 51 | 49 | 1 | 0 | 1 |
| 07 | 60 | 59 | 0 | 0 | 1 |
| 08 | 6 | 6 | 0 | 0 | 0 |
| 09 | 9 | 9 | 0 | 0 | 0 |
| 10 | 21 | 19 | 1 | 0 | 1 |
| 11 | 15 | 15 | 0 | 0 | 0 |
| — | 160 | 64 | 0 | 0 | 96 |
| **Total** | **523** | **406** | **3** | **2** | **112** |

## 2. O que "validada" significa em cada grupo

| Grupo | Método | Observação |
|---|---|---|
| Direito (Legislação Interna, Administrativo, Constitucional, Penal, Proc. Penal, Proc. Civil) | Conferência documental por IA contra o texto de fonte (PDF/compilado), com dispositivo, página e trecho registrados | Em CPC/CPP usou-se a **última** ocorrência do artigo (PDFs imprimem texto revogado antes do vigente) |
| Raciocínio Lógico | Verificação automatizada (`tools/verify_rl.py`: tabelas-verdade/enumeração de modelos) | 21 questões conferidas |
| Matemática | Recálculo automatizado (`src/data/calc-checks.ts`, testado) **+ revisão editorial por IA** de enunciados/alternativas (06/11/2026) | 64 validadas; revisão editorial não achou defeito. Não há registro individual de página/fonte (não se aplica) |
| Informática | 4 de Word/Teams por páginas do Microsoft Support; 5 de Excel executadas em LibreOffice/openpyxl | Páginas da Microsoft não informam número de versão; edital diz "MS-Windows 10 ou superior" |
| Língua Portuguesa | 6 confrontadas com páginas web (TRF3/EMAG, Correio Braziliense) | |
| Atualidades + Lei 13.146 | Fatos: TSE, imprensa e dados esportivos; Lei 13.146: texto compilado | Fatos devem ser reconferidos perto da prova; fontes primárias (Senado, BCB, DOU) não foram consultadas diretamente |

## 3. Correções de gabarito (substituição versionada; nada foi apagado)

As questões antigas permanecem no catálogo (histórico, XP e respostas preservados), saem de novas avaliações e têm `supersededBy`; as substitutas são **autorais e nascem Pendentes**.

| Antiga | Substituta | Problema | Fonte |
|---|---|---|---|
| soc-2 | soc-2b | Jornada: art. 7º, XIII, CF agora prevê 8 h diárias/40 h semanais (EC 141/2026). Data de promulgação 16/10/2026 obtida de fontes secundárias; **publicação no DOU não confirmada** | Texto compilado CF + imprensa |
| ppj-4 | ppj-4b | CPP art. 265: multa de 10 a 100 salários mínimos foi retirada pela Lei 14.752/2023; hoje o defensor responde por infração disciplinar | CPP compilado (última ocorrência do art. 265) |
| estr-1 | estr-1b | Duas alternativas corretas: "se a então não b" ≡ ¬(a∧b); explicação negava a equivalência | Tabela-verdade (`tools/verify_rl.py`) |

## 4. Correções/complementações de explicação (gabarito intacto; versão 2 com texto anterior registrado)

- **Correção:** itt-5 (piso de 90 dias inexistente), ilc-4 (art. 37-B, I, não 37-A), ppu-4 (multa 10–100 SM pertencia ao art. 265 antigo).
- **Complementação de referência:** itm-5, ilr-1..5, ird-2, icg-4, ico-3, adp-5, ada-1, ada-5 (artigo/inciso precisados).
- **Complementação de conteúdo:** ip2-3 (prazo de 45 dias do art. 1.258, § 2º, vale para os incisos I a VIII), aim-4 (a lei "assegura" ao agente demonstrar a licitude; não inverte o ônus da prova). Ambas continuam com status **Precisa de complementação** porque a reformulação do enunciado depende de decisão humana.

## 5. Materiais complementares revisados (somente erros confirmados)

- Aula/flashcard de Constitucional (jornada 8 h/40 h, EC 141/2026): lição `SOC_LESSON` (texto, caso, tabela, "memorizar"), flashcard e `questionIds` → soc-2b.
- Aula/flashcard de Proc. Penal (art. 265): lição `JUIZ_LESSON` e flashcard jc(5), `questionIds` → ppj-4b.
- Aula de Raciocínio Lógico (estruturas): `questionIds` → estr-1b.
- Busca por repetições do erro de ppu-4 nos materiais: nenhuma outra ocorrência encontrada. Demais textos de aulas/flashcards **não** foram relidos integralmente (limitação).

## 6. Fontes utilizadas

Regimento Interno do TJSP (PDF, 117 p.); Res. TJSP 850/2021 (compilada até 25/04/2022) e 963/2025; LC SP 1.111/2010 (atualizada até a LC 1.441/2026); NSCGJ Tomo I (PDF, 431 p., capa 2013); Lei SP 10.261/1968; Lei 8.429/1992 (com Lei 14.230/2021); CF/88, CP, CPP, CPC, Leis 9.099/1995, 12.153/2009 e 13.146/2015 (textos compilados do Planalto, impressos em 06/11/2026); Microsoft Support (Word, Teams); LibreOffice/openpyxl; ConexãoEMAG/TRF3; Correio Braziliense; TSE; imprensa e dados esportivos (SportRadar); Edital 02/2026. Referências exatas (documento, dispositivo, páginas, trecho) por questão em `docs/FASE-4B-RESULTADO-QUESTOES.csv`.

## 7. Alterações normativas consideradas

EC 141/2026 (jornada); Lei 14.752/2023 (CPP, art. 265); Lei 15.484/2026 (relevância da questão federal — altera CPC arts. 998 e 1.029 ss., **nenhum artigo citado pelas questões auditadas**; vigência não aprofundada); LC 1.441/2026 (atualiza LC 1.111); nota do portal TJSP "Vide Provimento CSM 2.834/2026" na Res. 963; Provimento CG 04/2026 (NSCGJ — data pendente); EC 131/2023 (art. 12, § 4º, CF).

## 8. Pendências que exigem decisão ou revisão humana

1. **Res. TJSP 850/2021 (itt-1..5, itm-1..5, 10 questões):** vigência após 25/04/2022 não comprovada → mantidas Pendentes por determinação.
2. Comprovação independente da data de publicação do edital (19/10/2026).
3. Regimento Interno: datas de Assentos Regimentais.
4. NSCGJ: ip2-1 e ip2-2 pendentes até confirmar data do Provimento CG 04/2026; ip2-3 reformular.
5. aim-4: reformulação do enunciado.
6. pcl-4 (Lei 9.099, art. 42): **fora do recorte do edital** (arts. 3–19) → decidir manter/remover.
7. EC 141/2026: data de publicação no DOU e eventual regra de transição (soc-2b).
8. Lei 15.484/2026: vigência (sem impacto nas questões auditadas).
9. As 3 substitutas (soc-2b, ppj-4b, estr-1b) e as 11 autorais de Matemática (oper-5, mmc-6..10, porc-6..10): revisão humana.
10. **Língua Portuguesa (59 pendentes) e Informática (26 pendentes):** só tiveram revisão textual por IA ("nenhum erro encontrado"), sem confronto com referência externa → não validadas. Falta confrontar com gramática/Manual e documentação versionada.
11. Atualidades: reconferir fatos perto de 14/03/2027 e consultar fontes primárias.
12. **Toda questão "Validada" pede amostragem/revisão humana** (nenhuma tem `validacao-humana`).

## 9. Arquivos modificados / criados

- Dados: `src/data/audit-docs.ts`, `audit-docs-extra.ts`, `audit.ts`, `replacements.ts` (novo), `revisions-extra.ts`, `questions-raw.ts`, `dconst.ts`, `dpp.ts`, `exatas.ts`.
- Testes: `tests/bank.test.ts`.
- Ferramentas: `tools/opts.ts`, `todo.ts`, `verify_rl.py`, `export-4b.ts`.
- Documentação: `docs/FASE-4B-LOTE-01..11.md`, `docs/FASE-4B-RESULTADO-QUESTOES.csv/.json` (resultado individual das 523 questões), `docs/FASE-4-AUDITORIA.json` (reexportado), este relatório.

## 10. Testes executados (06/11/2026)

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | sem erros |
| Vitest (frontend + dados + e2e de aprendizagem): 12 arquivos | **134/134 passaram** |
| Servidor `node --test` | **12/12 passaram** |
| `vite build` | concluído (aviso de chunk > 500 kB, pré-existente) |

Cobertura dos testes: IDs únicos; alternativas/gabaritos; assuntos do edital; revisões (gabarito e alternativas intactos, texto anterior registrado); substituições (antiga sai do pool e permanece no catálogo, substituta Pendente); compatibilidade com questões respondidas; preservação de XP; exclusão de questões problemáticas; critérios de domínio da Fase 3; simulados/flashcards; sincronização/eventos/compactação/backup. **Testes estruturais não comprovam correção jurídica.**

## 11. Limitações

- Nenhuma revisão humana. Planalto/Câmara/TJSP diretos frequentemente inacessíveis: usaram-se os PDFs/compilados fornecidos e páginas web alternativas.
- PDFs misturam texto antigo e vigente; o critério da última ocorrência pode falhar em casos atípicos.
- Português e Informática: validação parcial (6/65 e 9/35).
- Matemática: sem registro individual por questão além dos cálculos automatizados.
- Não houve alteração destrutiva no banco de produção; XP histórico e respostas passadas não foram recalculados.
- Fase 5 **não** iniciada.
