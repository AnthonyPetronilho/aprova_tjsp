# Aprova TJSP — Fase 4C: verificação crítica, correções e consolidação da qualidade do conteúdo

Data: 12/11/2026. Escopo: Edital TJSP 02/2026 (Escrevente), banca VUNESP. Prova prevista: 14/03/2027.
Regra de vigência (Anexo VIII): legislação em vigor até a publicação do edital (19/10/2026), conforme informado pelo responsável pelo projeto.

> **Limitação central.** Toda a verificação desta fase foi feita por IA (a mesma IA das fases anteriores) e por ferramentas automatizadas. Uma segunda leitura pela mesma IA **não equivale a revisão humana independente**. Nenhuma questão tem revisão humana. "Validada" significa *confirmada por conferência documental/cálculo, feita por IA ou ferramenta* — não "certificada". Não se afirma precisão estatística nem certificação jurídica.

## 1. Inventário e resultado atual

524 itens no catálogo (520 originais + 4 substitutas autorais); 4 originais permanecem no catálogo, marcados como substituídos e fora do pool (soc-2, ppj-4, estr-1, pcl-4).

| Grupo | Total | Validada | Precisa de correção | Precisa de complementação | Pendente |
|---|---:|---:|---:|---:|---:|
| Atualidades | 15 | 14 | 0 | 0 | 1 |
| Direito Administrativo | 50 | 49 | 0 | 1 | 0 |
| Direito Constitucional | 36 | 34 | 1 | 0 | 1 |
| Direito Penal | 35 | 35 | 0 | 0 | 0 |
| Direito Processual Civil | 61 | 59 | 1 | 0 | 1 |
| Direito Processual Penal | 51 | 49 | 1 | 0 | 1 |
| Informática | 35 | 28 | 0 | 0 | 7 |
| Legislação Interna do TJSP | 80 | 67 | 0 | 1 | 12 |
| Língua Portuguesa | 65 | 31 | 0 | 0 | 34 |
| Matemática | 75 | 64 | 0 | 0 | 11 |
| Raciocínio Lógico | 21 | 19 | 1 | 0 | 1 |
| **Total** | **524** | **449** | **4** | **2** | **69** |

Método registrado por questão (ver `FASE-4C-RESULTADO-QUESTOES.csv/json`): 361 validadas por conferência documental por IA; 88 por verificação automatizada (cálculo); 0 por revisão humana. A política da plataforma (testada) impede que a leitura textual por IA, sozinha, valide uma questão.

## 2. Etapas e achados

### A — EC 141/2026 (jornada)
- Confirmada em fontes oficiais consultadas (DOU/Câmara): novo art. 7º, XIII (8 h diárias e 40 h semanais), em vigor desde a publicação (16/10/2026), **mas** com regra de transição no art. 6º da EC (teto de 42 h a partir de cerca de 16/12/2026 e 40 h a partir de cerca de 16/12/2027).
- Corrigido: lição de Direitos Sociais (caso 1, linha do inciso XIII, "o que memorizar", flashcard) agora menciona a transição. Questão soc-2 substituída por soc-2b (autoral, **Pendente**: ambiguidade entre texto permanente e transição, sinalizada para revisão humana).
- Limitação: o texto bruto no DOU e no Planalto não foi acessado diretamente (Planalto fora da lista de acesso).

### B — Língua Portuguesa (65)
- Releitura item a item; 31 validadas (conferência por fonte gramatical/normativa registrada), 34 Pendentes (interpretação/estilo, sem fonte normativa que permita validar).
- Nenhum erro de gabarito. Explicações corrigidas: conc-5 (alternativa A, "ides") e clas-5 (alternativa C, "combinação"). Riscos de ambiguidade registrados: fig-2, infer-5, reg-1.

### C — Informática (35)
- 28 validadas com fontes de fabricante/padrão (Microsoft, Google, RFC, CERT.br); itens de Excel agora lastreados em documentação Microsoft (Excel 2016–365), não apenas em LibreOffice. 7 Pendentes (win-4, net-1, net-2, net-3, net-5, od-1, od-2: dependem de versão/interface do software ou de sinônimos/ambiguidade de enunciado sem fonte que permita validar).

### D — Pendências jurídicas
- Res. TJSP 850: mantida Pendente quanto à vigência (Res. 864/2022 incorporada ao texto compilado; nenhuma alteração posterior localizada, mas não comprovada).
- Regimento Interno: Assentos 594/595 datados; Assentos 593/596/597 e Prov. CG 04/2026 **não localizados** → pendências mantidas (ip2-1, ip2-2).
- pcl-4 (Lei 9.099) estava defasada em relação ao recorte; substituída por pcl-4b (autoral, Pendente).
- aim-4 e ip2-3: "precisa de complementação"; reformulações propostas, **não aplicadas** (decisão do responsável).

### E — Segunda auditoria independente por amostra
**Metodologia (definida antes da leitura).** Amostra estratificada de 86 itens, semente 20261112 (`tools/sample4c.ts`): (A) alterações normativas de 2026/substitutas; (B) itens cujo gabarito ou explicação mudou na 4B; (C) todos os itens de CPC/CPP com prazo/exceção; (D) complementações; mais sorteio por disciplina (LI 12, DA 8, DC 6, DP 6, DPP 9, DPC 10, Lei 13.146 3, Atualidades 3). Procedimento: imprimir enunciado e alternativas **sem o gabarito**, derivar a resposta no texto-fonte (PDFs/HTML extraídos; para CPC/CPP, última ocorrência do artigo por haver texto antigo e vigente), só depois comparar com o gabarito armazenado.
**Registro por item** (`FASE-4C-SEGUNDA-AUDITORIA.csv/json`): primeira auditoria, gabarito, resposta da releitura cega, fonte, concordância/divergência, erro, correção, status, "revisão humana: não".

Resultado: 86 itens — 71 concordaram; 14 foram reanalisados em etapas dedicadas (A/B/D) sem leitura cega; **1 divergência inicial (pca-4)**, em que a releitura cega errou (indicou 60 dias; CPC art. 226, III diz 30 dias) e o gabarito armazenado (A: 5, 10 e 30 dias) está correto. **Nenhum erro de gabarito do banco foi encontrado na amostra.** Isso **não** autoriza concluir que o restante do banco esteja livre de erros, nem estimar percentual de precisão; amostra e método não sustentam inferência estatística. Como não houve erro relevante no banco, não houve ampliação de grupo; porém, os erros das etapas A–D (soc-2, ppj-4, estr-1, pcl-4, explicações) já estavam sendo tratados à parte.
Limitação: mesma IA relendo; os mesmos vieses de extração de texto (PDF) podem se repetir.

### F — Matemática, Raciocínio Lógico e Atualidades
- Matemática autoral (oper-5, mmc-6..10, porc-6..10): recalculadas à mão e por teste automatizado (`tests/phase4c.test.ts`), incluindo a coerência dos distratores. Sem erros. Permanecem **Pendentes** por serem autorais (política: autoral só valida com revisão humana).
- Atualidades: fat-1 (TSE, 25/10/2026) já em fonte primária. fat-3 (Selic 13,75%, Copom 15–16/09/2026) agora conferida no Relatório de Política Monetária do BCB. fat-2: placar 42×34 e data 29/04/2026 conferidos na Agência Senado, porém "primeira rejeição em 132 anos" só aparece na imprensa → **fat-2 passou a Pendente**. fat-4 (salário mínimo R$ 1.621): valor/vigência conferidos na Agência Brasil; página do Planalto/decreto bloqueada por verificação anti-robô (não contornada) → mantida Validada com limitação registrada e necessidade de reconferir o decreto. fat-5 (Copa 2026: Espanha 1×0 Argentina, 19/07/2026): dados da ferramenta esportiva reconsultados em 12/11/2026; fonte secundária. **Todos os itens factuais datados devem ser reconferidos perto de 14/03/2027.** Nenhum evento futuro fictício foi incluído.
- Lei 13.146/2015: itens validados a partir do texto compilado (leitura cega de epd1-3 e epd2-2 concordou).

### G — Aulas e flashcards
- Texto anterior → texto novo → justificativa:
  - Lição de Direitos Sociais (EC 141): "40 h" sem transição → com menção à transição do art. 6º (precisão jurídica).
  - Lição LC 1.111, tabela AQ: referência "37-A" → "37-A e 37-B" (os percentuais estão no art. 37-B após a LC 1.441/2026). A dica da questão ilc-4 (que cita "Art. 37-A") **não foi alterada** — pertence ao registro de revisão da questão; ficou como ajuste editorial pendente.
- Observação: a lição de JEC cita dispositivos (arts. 41, 42, 49, 34) além do recorte do edital; não há erro, mas fica como possível enxugamento. Não houve reescrita por estilo.

## 3. Fontes e limitações (resumo)

| Fonte | Dispositivos usados | Versão/data de verificação | Limitação |
|---|---|---|---|
| CF/88 texto compilado (Planalto, PDF) | arts. 5º, 7º, 37, 92 | 06/11/2026 | EC 141/2026 verificada em DOU/Câmara, não no Planalto |
| EC 141/2026 (DOU, Câmara) | art. 7º XIII; art. 6º transitório | 12/11/2026 | texto bruto do DOU não aberto |
| CP, CPP, CPC (PDF compilado Planalto) | prazos e penas da amostra | 06/11/2026 | PDF traz texto antigo e vigente; usada a última ocorrência |
| Lei 9.099/1995, Lei 12.153/2009, Lei 8.429/1992 | arts. citados | 06/11/2026 | — |
| Lei 13.146/2015 | arts. 2º, 6º, 34, 36 | 06/11/2026 | — |
| Lei SP 10.261/1968, LC SP 1.111/2010 (ALESP) | arts. 32, 70, 86, 266, 278; arts. 14, 18, 21, 26, 30, 32, 37-A/B | 06/11/2026 | LC 1.441/2026 incorporada ao texto consultado |
| Regimento Interno TJSP; NSCGJ Tomo I; Res. TJSP 850/2021, 963/2025 | arts. da amostra | 06/11/2026 | Assentos 593/596/597 e Prov. CG 04/2026 não localizados; vigência da Res. 850 não comprovada |
| Microsoft, Google, RFC, CERT.br | Informática | 12/11/2026 | dependem de versão do software |
| TSE, Agência Senado, BCB, Agência Brasil | Atualidades | 12/11/2026 | ver item F |

## 4. Engenharia

- Arquivos novos: `src/data/audit-docs-4c.ts` (registros de Português/Informática com data), `tests/phase4c.test.ts`, `tools/export-4c.ts`, `tools/second-audit-sample.json`, `tools/second-audit-blind.json`, `docs/FASE-4C-*`.
- Arquivos alterados: `src/data/{dconst,dint,dpc2,replacements,revisions-extra,audit,audit-docs,audit-docs-extra}.ts`, `tests/bank.test.ts`.
- Migração/histórico: substituições mantêm o ID antigo no catálogo (`supersededBy`), invalidam a maestria só do item substituído; correções de explicação não invalidam maestria nem XP. Nenhuma alteração destrutiva em banco de dados; autenticação/login/cadastro não tocados.
- Testes **executados nesta fase**: Vitest do frontend — 13 arquivos, 146 testes aprovados (inclui integridade, IDs únicos, status, substituições, revisões, compatibilidade de histórico, critérios de domínio, simulados/Diário, e os novos testes 4C); testes do servidor (`npm --prefix server test`) — 12 aprovados, 0 falhas; `tsc --noEmit` sem erros; `npm run build` concluído (aviso de tamanho de chunk > 500 kB, não é falha). Testes de sincronização/backend são os do servidor (sem MongoDB real nesta sessão). Passar nos testes prova coerência estrutural, não correção jurídica.
- Riscos: dependência de PDFs com texto antigo+vigente (leitura da última ocorrência); itens com data (Atualidades) envelhecem; PDFs extraídos por IA.

## 5. Conclusão realista

- **Conferido documentalmente (por IA):** 361 itens contra texto-fonte; **por cálculo/ferramenta:** 88; **aguardando fonte/decisão:** 69 Pendentes (34 Português, 7 Informática, 11 Matemática autoral, 12 Legislação Interna — itt-1..5 e itm-1..5 por vigência não comprovada da Res. 850, ip2-1/ip2-2 por Assentos/Prov. CG —, 1 Atualidades, e os demais de outras disciplinas); **6 itens** com status de correção/complementação (4 deles são originais já substituídos).
- **Revisão humana:** nenhuma. Recomenda-se revisão humana, no mínimo, de: Res. 850 (vigência), Prov. CG 04/2026 e Assentos 593/596/597, EC 141/2026 (soc-2b e texto bruto do DOU), reformulações de aim-4 e ip2-3, as 4 substitutas autorais, Lei 15.484/2026 (vigência), fat-2/fat-4 e reconferência de Atualidades antes da prova.
- Esta fase **não** declara a plataforma certificada nem com precisão garantida, e **não** avança para a Fase 5.
