import type { Flashcard, Lesson, Question } from '../types'
import { mkW, mkC, step, qids } from './helpers'
// Legislação Interna do TJSP, parte 1: Res. TJSP 850/2021, Res. TJSP 963/2025, LC 1.111/2010 e Regimento Interno.
// Fontes lidas em 05/11/2026 por resumo automatizado: Migalhas (texto da Res. 850), TJSP (notícia da Res. 864/2022), PDF da Res. 963, ALESP (LC 1.111), PDF do Regimento Interno.
// Limites: Res. 850 lida na redação original (alterada pela Res. 864/2022); Res. 963 só arts. 1º e 2º; Regimento só arts. 1º a 45.
const AVISO_R = 'Aviso: texto em paráfrase, lido em resumo automatizado; resoluções são alteradas com frequência. Confirme a redação vigente no portal do TJSP.'

// ───────── 1. Res. 850/2021 – servidores
export const TS_LESSON: Lesson = {
  id: 'in-tele-serv', topicId: 'dint-1', title: 'Res. TJSP 850/2021: teletrabalho dos servidores', questionIds: qids('itt'),
  steps: [
    step('Entenda', [
      'Conceito e custos (arts. 1º a 6º): teletrabalho é o exercício das atividades funcionais de servidores e magistrados fora das unidades do TJSP, por meio de ambiente virtual. Quem o exerce mantém os mesmos direitos do presencial, inclusive auxílio-alimentação, mas não recebe auxílio-transporte. Não pode gerar despesa ao Tribunal: mesa, cadeira, computador, internet, software e impressora são por conta do servidor. As dúvidas são decididas pela Presidência, observadas as Resoluções CNJ 227/2016 e 343/2020.',
      'Alcance e regras (arts. 7º a 9º): aplica-se a escreventes técnicos, assistentes judiciários, assistentes jurídicos, psicólogos e assistentes sociais do setor técnico; para os demais cargos, o pedido é justificado pelo gestor e decidido pela Presidência. Só podem ser feitas atividades de processamento digital. Limites do quadro: até 70% nas unidades ligadas à Presidência, Vice-Presidência, Corregedoria e Presidências de Seção; até 50% nas unidades de 1º grau, exceto gabinetes (arredondamento para cima); nos gabinetes, o número é definido pelo juiz ou desembargador. Havendo excesso de interessados, o gestor escolhe e pode propor revezamento de no mínimo 90 dias. Reuniões virtuais, no mínimo mensais. Almoço de 30 minutos, com tolerância de 15, entre 12h e 14h. A frequência é registrada por log in e log off. Atingir a meta equivale a cumprir a jornada; superá-la não gera horas extras nem banco de horas.',
      'Adesão e vedações (arts. 10 e 11): é facultativa, por requerimento eletrônico dirigido à SGP, com autorização prévia, e por prazo indeterminado; as autorizações são publicadas no DJE e os nomes divulgados no Portal da Transparência. Após 3 meses, a estação de trabalho no Tribunal pode ser desativada. Não podem aderir: quem tenha contraindicação médica por laudo; sofreu penalidade disciplinar nos 2 anos anteriores; foi desligado do teletrabalho nos últimos 6 meses; foi relotado por remoção nos últimos 6 meses; não tem conceito positivo na última avaliação de desempenho; ou está no primeiro ano do estágio probatório.',
      'Deveres, controle e desligamento (arts. 12 a 22): são doze deveres (cumprir a meta com qualidade, manter contatos atualizados, consultar diariamente o e-mail institucional, comparecer quando convocado, preservar o sigilo, executar pessoalmente as tarefas, não contatar partes ou advogados sem ciência do gestor, entre outros). Diante de descumprimento, o servidor tem 2 dias úteis para esclarecer, e o gestor pode suspender o teletrabalho. A produtividade em teletrabalho deve superar a da atividade presencial da unidade. O gestor envia relatório semestral à SGP. O desligamento ocorre a pedido, por fim do teletrabalho na unidade, por interesse da Administração, por não atingir metas ou por decisão do gestor ou da Presidência; o retorno ao presencial se dá em até 5 dias úteis. O GA-Tel analisa os resultados em período máximo semestral.',
      'A Resolução 864/2022 alterou a Resolução 850: flexibilizou o revezamento (mantidas as porcentagens máximas, como 50% no 1º grau), admitiu estagiários, servidores cedidos por municípios e voluntários na modalidade a distância e deu liberdade aos magistrados para ajustar as equipes dos gabinetes. O texto estudado aqui é o da redação original da Res. 850. ' + AVISO_R],
      'Limites: 70% (Presidência, Vice, Corregedoria, Seções) e 50% (1º grau, exceto gabinetes). Vedações: 2 anos (penalidade), 6 meses (desligamento e remoção), 1º ano de estágio. Esclarecer em 2 dias úteis; voltar em 5 dias úteis.'),
    step('Exemplo prático', [
      'Caso 1 — vara com 10 servidores: no máximo 5 (50%) em teletrabalho, arredondando para cima.',
      'Caso 2 — servidor punido com repreensão há 1 ano: não pode aderir (2 anos).',
      'Caso 3 — servidor cumpre a meta antes do fim do expediente: cumpriu a jornada, sem hora extra.',
      'Caso 4 — meta descumprida: o gestor pode suspender o teletrabalho, e o servidor volta ao presencial em até 5 dias úteis.'],
      'Pergunta-teste: o teletrabalhador recebe auxílio-transporte? Não; recebe auxílio-alimentação.'),
    step('Resumo essencial', ['Números da Res. 850 (servidores).'], undefined, { caption: 'Teletrabalho dos servidores', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Auxílios', 'Mantém alimentação; sem transporte', '3º'],
      ['Teto no 1º grau', '50% do quadro (exceto gabinetes)', '9º, III'],
      ['Teto nas unidades da cúpula', '70% do quadro', '9º, II'],
      ['Revezamento', 'No mínimo 90 dias', '9º, V'],
      ['Reuniões virtuais', 'No mínimo mensais', '9º, VI'],
      ['Vedação por penalidade', 'Disciplinar nos 2 anos anteriores', '11, II'],
      ['Esclarecimentos', '2 dias úteis', '13'],
      ['Retorno ao presencial', 'Até 5 dias úteis', '19, § 1º']] }),
    step('O que memorizar', ['• 70% e 50%; gabinetes definidos pelo magistrado.', '• Sem despesa para o Tribunal; sem auxílio-transporte.', '• Vedações: 2 anos e 6 meses; 1º ano de estágio.', '• Teletrabalho facultativo; produtividade maior que a presencial.'] ),
  ],
}
const tt = mkW('itt', 'dint-1')
export const TS_QUESTIONS: Question[] = [
  tt(1, 'Segundo a Res. TJSP 850/2021, o servidor em teletrabalho', ['mantém o auxílio-alimentação, mas não recebe auxílio-transporte.', 'Art. 3º.'], [['recebe auxílio-transporte, mas não auxílio-alimentação.', 'é o contrário: mantém alimentação, sem transporte.'], ['não recebe nenhum auxílio.', 'mantém o auxílio-alimentação.'], ['recebe ressarcimento das despesas de internet.', 'o Tribunal não custeia a estrutura (arts. 4º e 5º).'], ['recebe auxílio para a compra do computador.', 'a estrutura é por conta do servidor.']], 'Médio'),
  tt(2, 'Nas unidades de 1º grau, exceto gabinetes, o teletrabalho pode alcançar, no máximo, na redação original da Res. 850/2021,', ['50% do quadro, com arredondamento para cima.', 'Art. 9º, III.'], [['30% do quadro, com arredondamento para baixo.', 'o limite é de 50%, arredondado para cima.'], ['70% do quadro.', '70% é o limite das unidades ligadas à Presidência, Vice-Presidência, Corregedoria e Presidências de Seção.'], ['100% do quadro.', 'o limite é de 50%.'], ['20% do quadro.', 'o limite é de 50%.']], 'Médio'),
  tt(3, 'Não pode aderir ao teletrabalho o servidor que tenha sofrido penalidade disciplinar nos', ['2 anos anteriores.', 'Art. 11, II.'], [['6 meses anteriores.', '6 meses é o prazo de quem foi desligado do teletrabalho ou relotado por remoção.'], ['5 anos anteriores.', 'o prazo é de 2 anos.'], ['90 dias anteriores.', 'o prazo é de 2 anos.'], ['10 anos anteriores.', 'o prazo é de 2 anos.']], 'Médio'),
  tt(4, 'Diante de descumprimento das regras, o servidor em teletrabalho tem para prestar esclarecimentos o prazo de', ['2 dias úteis.', 'Art. 13.'], [['24 horas corridas.', 'o prazo é de 2 dias úteis.'], ['5 dias úteis.', '5 dias úteis é o prazo de retorno ao presencial.'], ['10 dias úteis.', '10 dias úteis é o prazo para informar a SGP.'], ['30 dias corridos.', 'o prazo é de 2 dias úteis.']], 'Difícil'),
  tt(5, 'Desligado do teletrabalho, o servidor retorna ao regime presencial em até', ['5 dias úteis.', 'Art. 19, § 1º.'], [['48 horas.', 'o prazo é de 5 dias úteis.'], ['10 dias úteis.', 'o prazo é de 5 dias úteis.'], ['30 dias.', 'o prazo é de 5 dias úteis.'], ['90 dias.', '90 dias é o prazo mínimo de revezamento.']], 'Médio'),
]
const ctt = mkC('itt', 'dint-1', 'in-tele-serv')
export const TS_CARDS: Flashcard[] = [
  ctt(1, 'O que é teletrabalho (art. 1º)?', 'Exercício das atividades funcionais de servidores e magistrados fora das unidades do TJSP, por meio de ambiente virtual.'),
  ctt(2, 'Quais os tetos do quadro?', 'Até 70% nas unidades da Presidência, Vice-Presidência, Corregedoria e Seções; até 50% no 1º grau, exceto gabinetes; gabinetes definidos pelo magistrado (art. 9º).'),
  ctt(3, 'Quais as vedações de adesão (art. 11)?', 'Contraindicação médica; penalidade nos 2 anos anteriores; desligamento do teletrabalho ou relotação por remoção nos últimos 6 meses; sem conceito positivo na avaliação; 1º ano do estágio probatório.'),
  ctt(4, 'Como se registra a frequência?', 'Por log in e log off, que valem como ponto; atingir a meta equivale à jornada, sem horas extras (art. 9º).'),
  ctt(5, 'Quem paga a estrutura?', 'O servidor ou magistrado; o Tribunal não custeia bens ou serviços (arts. 4º, 5º e 20).'),
  ctt(6, 'O que mudou com a Res. 864/2022?', 'Flexibilizou o revezamento, admitiu estagiários, cedidos e voluntários e deu liberdade aos magistrados nos gabinetes.'),
]

// ───────── 2. Res. 850/2021 – magistrados e PcD
export const TM_LESSON: Lesson = {
  id: 'in-tele-mag', topicId: 'dint-1', title: 'Res. TJSP 850/2021: magistrados, pessoas com deficiência e disposições finais', questionIds: qids('itm'),
  steps: [
    step('Entenda', [
      'Magistrados (arts. 23 a 27): os juízes de 1º grau podem optar pelo teletrabalho. Titulares de comarcas de entrância final e de entrância intermediária com mais de 3 varas comparecem ao fórum ao menos 3 dias úteis por semana; titulares de intermediária com até 3 varas, de entrância inicial e juízes substitutos, ao menos 4 dias úteis. Nos dias remotos, o magistrado fica na comarca onde foi autorizado a residir. O juiz diretor submete a escala de presença à Presidência e à Corregedoria, com ao menos 1/3 dos magistrados em exercício presentes por dia útil (não se aplica a varas únicas). A Corregedoria pode encerrar o teletrabalho a qualquer tempo, por exemplo por produtividade insuficiente ou aumento de processos conclusos há mais de 100 dias. A produtividade deve ser igual ou superior à média de varas semelhantes. Durante o expediente, o magistrado deve ser contactável pelo Teams ou sistema equivalente e acessar diariamente o e-mail funcional, presumindo-se lidas as mensagens no primeiro dia útil seguinte.',
      'Pessoas com deficiência, necessidades especiais ou doença grave, e seus dependentes (arts. 28 a 37): o capítulo vale para quem tenha essa condição ou filhos ou dependentes legais nela. Os conceitos vêm das Leis 13.146/2015, 12.764/2012 e 7.713/88. O pedido vai diretamente à Presidência, sem prejuízo da remuneração e independentemente de compensação posterior, com justificativa fundamentada e laudo técnico (pode haver perícia ou equipe multidisciplinar); a manutenção exige laudo médico anual. A condição é revista se a situação mudar, e o interessado comunica a alteração em 5 dias. A condição especial não justifica discriminação em vantagens, remoção, promoção ou funções de confiança. Além do teletrabalho, há designação provisória fora da comarca, apoio à unidade e jornada especial.',
      'Disposições finais (arts. 38 e 39): os casos omissos são decididos pela Presidência, ouvida a Corregedoria no que tange ao Capítulo III. A resolução entraria em vigor 30 dias após o fim do trabalho remoto extraordinário da pandemia, por ato da Presidência; o Capítulo IV vigora desde a publicação. ' + AVISO_R],
      'Presença do juiz: 3 dias (entrância final e intermediária com mais de 3 varas) ou 4 dias (demais). Escala: 1/3 por dia. PcD: laudo anual; comunicar mudança em 5 dias.'),
    step('Exemplo prático', [
      'Caso 1 — titular de comarca de entrância final: comparece ao menos 3 dias úteis por semana.',
      'Caso 2 — juiz substituto: comparece ao menos 4 dias úteis por semana.',
      'Caso 3 — aumento de processos conclusos há mais de 100 dias: a Corregedoria pode encerrar o teletrabalho.',
      'Caso 4 — servidor com filho com deficiência: pedido à Presidência, com laudo; manutenção com laudo médico anual.'],
      'Pergunta-teste: a que órgão o servidor com deficiência dirige o pedido? Diretamente à Presidência.'),
    step('Resumo essencial', ['Magistrados e PcD.'], undefined, { caption: 'Res. 850: capítulos III a V', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Presença: entrância final', 'Ao menos 3 dias úteis por semana', '24'],
      ['Presença: substitutos e entrância inicial', 'Ao menos 4 dias úteis por semana', '24, § 1º'],
      ['Escala', 'Ao menos 1/3 dos magistrados por dia útil', '25, § 1º'],
      ['Conclusos', 'Mais de 100 dias pode ensejar o fim do teletrabalho', '26'],
      ['PcD: pedido', 'Diretamente à Presidência, com laudo', '32'],
      ['PcD: manutenção', 'Laudo médico anual', '32, § 5º'],
      ['PcD: mudança', 'Comunicar em 5 dias', '33']] }),
    step('O que memorizar', ['• Juiz: 3 ou 4 dias de presença; escala de 1/3.', '• Corregedoria encerra o teletrabalho do juiz.', '• PcD: pedido à Presidência, laudo, renovação anual.'] ),
  ],
}
const tm = mkW('itm', 'dint-1')
export const TM_QUESTIONS: Question[] = [
  tm(1, 'Titulares de comarcas de entrância final devem comparecer ao fórum ao menos', ['3 dias úteis por semana.', 'Art. 24, caput.'], [['1 dia útil por semana.', 'o mínimo é de 3 dias úteis.'], ['2 dias úteis por semana.', 'o mínimo é de 3 dias úteis.'], ['4 dias úteis por semana.', '4 dias é o mínimo dos juízes substitutos e das entrâncias menores.'], ['5 dias úteis por semana.', 'o mínimo é de 3 dias úteis.']], 'Médio'),
  tm(2, 'Os juízes substitutos em teletrabalho devem comparecer ao fórum ao menos', ['4 dias úteis por semana.', 'Art. 24, § 1º.'], [['3 dias úteis por semana.', '3 dias é o mínimo dos titulares de entrância final.'], ['2 dias úteis por semana.', 'o mínimo é de 4 dias.'], ['1 dia útil por semana.', 'o mínimo é de 4 dias.'], ['apenas nas correições.', 'a presença é semanal; nas correições ela é obrigatória.']], 'Médio'),
  tm(3, 'Na escala de presença dos magistrados, deve haver em cada dia útil, ao menos,', ['1/3 dos magistrados em exercício presentes.', 'Art. 25, § 1º.'], [['metade dos magistrados.', 'o piso é de 1/3.'], ['2/3 dos magistrados.', 'o piso é de 1/3.'], ['1/4 dos magistrados.', 'o piso é de 1/3.'], ['todos os magistrados.', 'o piso é de 1/3.']], 'Difícil'),
  tm(4, 'Para manter o teletrabalho das pessoas com deficiência ou doença grave, a resolução exige', ['laudo médico anual.', 'Art. 32, § 5º.'], [['laudo médico a cada 5 anos.', 'o laudo é anual.'], ['apenas declaração do interessado.', 'exige-se laudo.'], ['laudo apenas na concessão.', 'a manutenção exige laudo anual.'], ['renovação por decreto do Governador.', 'o pedido vai à Presidência do Tribunal.']], 'Médio'),
  tm(5, 'Alterada a situação que justificou a condição especial, o interessado deve comunicar a alteração em', ['5 dias.', 'Art. 33.'], [['48 horas.', 'o prazo é de 5 dias.'], ['10 dias.', 'o prazo é de 5 dias.'], ['30 dias.', 'o prazo é de 5 dias.'], ['60 dias.', 'o prazo é de 5 dias.']], 'Difícil'),
]
const ctm = mkC('itm', 'dint-1', 'in-tele-mag')
export const TM_CARDS: Flashcard[] = [
  ctm(1, 'Quantos dias o magistrado deve comparecer?', '3 dias úteis por semana (entrância final e intermediária com mais de 3 varas); 4 dias úteis (demais e substitutos) — art. 24.'),
  ctm(2, 'Qual o piso da escala de presença?', 'Ao menos 1/3 dos magistrados em exercício por dia útil; não vale para varas únicas (art. 25).'),
  ctm(3, 'Quando a Corregedoria pode encerrar o teletrabalho do juiz?', 'A qualquer tempo, por exemplo por baixa produtividade, aumento de conclusos há mais de 100 dias ou recusa de atendimento remoto (art. 26).'),
  ctm(4, 'Como a pessoa com deficiência pede o teletrabalho?', 'Diretamente à Presidência, com justificativa e laudo técnico; manutenção com laudo médico anual (art. 32).'),
  ctm(5, 'Quanto tempo para comunicar mudança da condição?', '5 dias (art. 33).'),
  ctm(6, 'Quando a resolução entrou em vigor?', '30 dias após o fim do trabalho remoto extraordinário da pandemia, por ato da Presidência; o Capítulo IV vigora desde a publicação (art. 39).'),
]

// ───────── 3. Res. 963/2025 – eproc
export const EP_LESSON: Lesson = {
  id: 'in-eproc', topicId: 'dint-2', title: 'Res. TJSP 963/2025: governança e utilização do eproc', questionIds: qids('ipr'),
  steps: [
    step('Entenda', [
      'Identificação: a Resolução 963/2025, do Órgão Especial, dispõe sobre a governança e a utilização do sistema eproc nas unidades do Poder Judiciário do Estado de São Paulo. Foi publicada no Diário da Justiça Eletrônico de 29 de maio de 2025 (edição 4212). Invoca o art. 18 da Lei 11.419/2006 (informatização do processo judicial) e a deliberação do Órgão Especial de 24 de julho de 2024, que aprovou a adesão ao eproc.',
      'Objeto (art. 1º): estabelecer regras sobre a governança e o uso do eproc nas unidades do Judiciário paulista.',
      'Princípios (art. 2º): o uso, a implantação, a sustentação e a evolução do eproc seguem estes princípios: (I) aderência à versão nacional, preservando o módulo base e evitando fragmentações que afetem a estabilidade, a segurança ou a interoperabilidade; (II) desenvolvimento colaborativo, priorizando soluções comuns à Justiça estadual e federal; (III) automação e simplificação, automatizando atividades sempre que possível, depois de revisar e eliminar rotinas que não agregam valor; (IV) pragmatismo e efetividade, pensando no impacto amplo e no maior número de casos, e não em exceções ou preferências individuais; (V) instrumentalidade e autonomia, com flexibilidade, eficiência e produtividade e rastreabilidade das ações dos usuários. Todos os usuários compartilham a responsabilidade por promover e preservar essas diretrizes (parágrafo único).',
      'Implantação: o eproc decorre do Acordo de Cooperação Técnica 552/2024, com o TRF da 4ª Região e os Tribunais de Justiça do Rio Grande do Sul e de Santa Catarina. Pelo Comunicado Conjunto 403/2025, a partir de 2 de junho de 2025, nas unidades da 6ª RAJ (Ribeirão Preto) com competência de Juizado Especial Cível, os novos processos de conhecimento e de execução de título extrajudicial são distribuídos exclusivamente pelo eproc, e os recursos contra suas decisões também são interpostos nele; os incidentes de cumprimento de sentença de processos que tramitaram no SAJ continuam, por ora, cadastrados no e-SAJ. Notícias indicam que o eproc entrou em operação em 31 de março de 2025 nos Juizados de São Paulo, Campinas, Santos, São José dos Campos e Sorocaba, nas Turmas Recursais e nos Cejuscs.',
      'ATENÇÃO: apenas os arts. 1º e 2º e o comunicado foram lidos. A estrutura de governança (comitês, competências, regras de uso e de transição) não foi conferida e não entra nas questões. Leia o texto integral da Res. 963/2025. ' + AVISO_R],
      'Publicação: DJE de 29/05/2025. Adesão aprovada em 24/07/2024. Cinco princípios no art. 2º. Distribuição exclusiva no eproc na 6ª RAJ (JEC) desde 2/6/2025.'),
    step('Exemplo prático', [
      'Caso 1 — pedido de customização do sistema para atender a preferência de uma unidade: contraria o princípio do pragmatismo (impacto amplo, não exceções).',
      'Caso 2 — rotina que não agrega valor ao fluxo: deve ser revisada e eliminada antes de ser automatizada.',
      'Caso 3 — nova ação de conhecimento no JEC da 6ª RAJ após 2/6/2025: distribuída exclusivamente pelo eproc.',
      'Caso 4 — cumprimento de sentença de processo que tramitou no SAJ: continua, por ora, no e-SAJ.'],
      'Pergunta-teste: de quem é a responsabilidade de preservar as diretrizes? De todos os usuários do eproc.'),
    step('Resumo essencial', ['Res. 963/2025.'], undefined, { caption: 'Res. 963/2025 (arts. 1º e 2º)', head: ['Item', 'Conteúdo', 'Base'], rows: [
      ['Objeto', 'Governança e uso do eproc nas unidades do Judiciário paulista', 'Art. 1º'],
      ['Princípio I', 'Aderência à versão nacional', 'Art. 2º, I'],
      ['Princípio II', 'Desenvolvimento colaborativo (Justiça estadual e federal)', 'Art. 2º, II'],
      ['Princípio III', 'Automação e simplificação', 'Art. 2º, III'],
      ['Princípio IV', 'Pragmatismo e efetividade', 'Art. 2º, IV'],
      ['Princípio V', 'Instrumentalidade e autonomia, com rastreabilidade', 'Art. 2º, V'],
      ['Publicação', 'DJE de 29/05/2025', 'Resolução']] }),
    step('O que memorizar', ['• Cinco princípios: versão nacional, colaboração, automação, pragmatismo, instrumentalidade/autonomia.', '• Todos os usuários compartilham a responsabilidade.', '• Rastreabilidade das ações dos usuários.'] ),
  ],
}
const pr = mkW('ipr', 'dint-2')
export const EP_QUESTIONS: Question[] = [
  pr(1, 'Segundo o art. 2º, I, da Res. TJSP 963/2025, o eproc deve observar o princípio da', ['aderência à versão nacional, preservando o módulo base e evitando fragmentações.', 'Art. 2º, I.'], [['customização livre por unidade judicial.', 'o princípio é a aderência à versão nacional, sem fragmentações.'], ['independência total em relação ao sistema nacional.', 'o sistema deve seguir a versão nacional.'], ['substituição integral do módulo base.', 'o módulo base deve ser preservado.'], ['criação de versões regionais.', 'fragmentações são evitadas.']], 'Médio'),
  pr(2, 'No pragmatismo e efetividade (art. 2º, IV), as regras e evoluções do eproc devem considerar', ['o impacto amplo, com foco na maioria dos casos e não em exceções ou preferências individuais.', 'Art. 2º, IV.'], [['sobretudo as preferências individuais dos usuários.', 'o foco não são preferências individuais.'], ['apenas os casos excepcionais.', 'o foco é a maioria dos casos.'], ['exclusivamente as necessidades da área de TI.', 'a norma fala do impacto amplo.'], ['a vontade da unidade com maior número de processos.', 'a norma não prevê esse critério.']], 'Médio'),
  pr(3, 'A Resolução 963/2025 do TJSP dispõe sobre', ['a governança e a utilização do sistema eproc nas unidades do Judiciário paulista.', 'Art. 1º.'], [['o teletrabalho de servidores e magistrados.', 'isso é a Res. 850/2021.'], ['o Plano de Cargos e Carreiras dos servidores.', 'isso é a LC 1.111/2010.'], ['o Regimento Interno do Tribunal.', 'é outro ato normativo.'], ['as normas de serviço dos cartórios extrajudiciais.', 'não é o objeto da resolução.']], 'Fácil'),
  pr(4, 'Quanto à responsabilidade pela preservação das diretrizes da resolução, o parágrafo único do art. 2º estabelece que', ['todos os usuários do eproc compartilham a responsabilidade por promovê-las e preservá-las.', 'Art. 2º, parágrafo único.'], [['apenas a área de tecnologia é responsável.', 'a responsabilidade é de todos os usuários.'], ['apenas o Órgão Especial é responsável.', 'a responsabilidade é de todos os usuários.'], ['apenas os magistrados são responsáveis.', 'a responsabilidade é de todos os usuários.'], ['ninguém responde individualmente.', 'todos compartilham a responsabilidade.']], 'Médio'),
  pr(5, 'Pelo princípio da instrumentalidade e autonomia (art. 2º, V), o eproc deve favorecer flexibilidade e produtividade, mantendo', ['a rastreabilidade das ações dos usuários.', 'Art. 2º, V.'], [['o anonimato das ações dos usuários.', 'a norma exige rastreabilidade.'], ['o sigilo absoluto sobre os registros.', 'a norma exige rastreabilidade.'], ['a exclusão automática dos registros antigos.', 'a norma exige rastreabilidade.'], ['o acesso restrito à Presidência.', 'a norma exige rastreabilidade.']], 'Difícil'),
]
const cpr = mkC('ipr', 'dint-2', 'in-eproc')
export const EP_CARDS: Flashcard[] = [
  cpr(1, 'O que é a Res. TJSP 963/2025?', 'Resolução do Órgão Especial sobre a governança e a utilização do eproc nas unidades do Judiciário paulista; publicada no DJE de 29/05/2025.'),
  cpr(2, 'Quais os princípios do art. 2º?', 'Aderência à versão nacional; desenvolvimento colaborativo; automação e simplificação; pragmatismo e efetividade; instrumentalidade e autonomia.'),
  cpr(3, 'O que é aderência à versão nacional?', 'Seguir a versão nacional do sistema, preservar o módulo base e evitar fragmentações que afetem estabilidade, segurança ou interoperabilidade.'),
  cpr(4, 'O que diz o princípio da automação e simplificação?', 'Automatizar sempre que possível, depois de revisar e eliminar rotinas que não agregam valor ao fluxo processual.'),
  cpr(5, 'Quem compartilha a responsabilidade pelas diretrizes?', 'Todos os usuários do eproc (art. 2º, parágrafo único).'),
  cpr(6, 'O que o Comunicado Conjunto 403/2025 determinou?', 'Desde 2/6/2025, nos JEC da 6ª RAJ (Ribeirão Preto), novos processos de conhecimento e de execução de título extrajudicial são distribuídos exclusivamente pelo eproc; cumprimentos de processos do SAJ seguem no e-SAJ por ora.'),
]

// ───────── 4. LC 1.111/2010 – estrutura
export const LCE_LESSON: Lesson = {
  id: 'in-lc-estrutura', topicId: 'dint-3', title: 'LC 1.111/2010: estrutura do quadro, ingresso, estágio probatório e remuneração', questionIds: qids('ilc'),
  steps: [
    step('Entenda', [
      'Objeto e quadro (arts. 1º e 2º): a LC 1.111/2010 institui o Plano de Cargos e Carreiras dos servidores do TJSP. O quadro compreende cargos efetivos e cargos em comissão. Os cargos efetivos têm 8 referências (números 1 a 8), cada uma com 18 graus (letras A a R); a Área Saúde tinha as referências 11 a 13; os cargos em comissão têm 2 níveis de 14 referências, em algarismos romanos de I a XIV (art. 3º). Os valores valem para jornadas de 40 e 30 horas semanais; os cargos em comissão têm 40 horas (art. 4º).',
      'Substituição e opção (arts. 5º e 6º): os cargos em comissão de Secretário, Diretor, Coordenador, Supervisor, Chefe de Seção Técnica, Chefe de Seção e Assistente Jurídico podem ter substituto nos afastamentos do titular. O servidor efetivo nomeado para cargo em comissão ou para substituição pode optar pelo vencimento do cargo efetivo.',
      'Remuneração (art. 7º): além do vencimento, há adicional por tempo de serviço de 5% por quinquênio, sexta-parte, 13º salário, salário-família e outras vantagens previstas em lei, inclusive gratificações.',
      'Ingresso e estágio probatório (arts. 8º a 11): o ingresso é por concurso público de provas ou de provas e títulos, no padrão inicial da classe. O estágio probatório dura 36 meses e avalia assiduidade, pontualidade, aptidão, capacidade e eficiência. Quem muda de cargo efetivo por concurso fica dispensado do estágio, se já o cumpriu (art. 40). O Escrevente Técnico Judiciário exige Ensino Médio completo (Anexo VII).',
      'Gratificações e adicionais: a Gratificação Judiciária é mantida nos termos do art. 52 da LC 715/1993 (art. 35). Pesquisador tem gratificação de 75% e Estenotipista, de 158%, sobre o Padrão 1-A, para jornada de 40 horas (art. 36). O Oficial de Justiça recebe a gratificação do RETEJ de 31,74% sobre o padrão, com incidência do adicional por tempo de serviço e da sexta-parte, e incorporação aos vencimentos (art. 37). O Adicional de Qualificação (AQ) incide, em percentuais não cumulativos, na razão de 20% para doutor, 15% para mestre, 10% para especialização e 7,5% para graduação, exige cursos reconhecidos pelo MEC e pós-graduação lato sensu de no mínimo 360 horas, e não se incorpora aos vencimentos (arts. 37-A e 37-B). A lei foi publicada em 25/05/2010, com efeitos desde 1º/07/2010 (art. 50), e a remoção é a mudança de posto de trabalho a pedido do servidor, conforme critérios da Presidência (art. 51).',
      'Os anexos de tabelas são imagens e não puderam ser lidos; valores de vencimento e a referência de cada cargo não foram conferidos. ' + AVISO_R],
      'Estágio probatório: 36 meses. Graus A a R (18). Quinquênio: 5%. AQ: 20/15/10/7,5%. RETEJ: 31,74%. Pesquisador 75%; Estenotipista 158%.'),
    step('Exemplo prático', [
      'Caso 1 — aprovado em concurso para escrevente: cumpre estágio probatório de 36 meses.',
      'Caso 2 — servidor com mestrado reconhecido e pós-graduação de 360 horas: AQ de 15%, que não se incorpora aos vencimentos.',
      'Caso 3 — servidor efetivo nomeado para comissão: pode optar pelo vencimento do cargo efetivo.',
      'Caso 4 — oficial de justiça: RETEJ de 31,74% sobre o padrão.'],
      'Pergunta-teste: o AQ se incorpora? Não.'),
    step('Resumo essencial', ['LC 1.111/2010.'], undefined, { caption: 'Estrutura e remuneração', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Referências e graus', '8 referências; 18 graus (A a R)', '3º'],
      ['Jornada', '40 e 30 horas; comissão: 40', '4º'],
      ['Adicional por tempo de serviço', '5% por quinquênio', '7º'],
      ['Estágio probatório', '36 meses', '11'],
      ['RETEJ', '31,74% sobre o padrão', '37'],
      ['AQ', 'Doutor 20%; mestre 15%; especialização 10%; graduação 7,5%', '37-A'],
      ['Pesquisador / Estenotipista', '75% / 158% sobre o Padrão 1-A', '36']] }),
    step('O que memorizar', ['• Estágio probatório: 36 meses.', '• Quinquênio de 5% e sexta-parte.', '• AQ não cumulativo e não incorporável.', '• Escrevente: Ensino Médio.'] ),
  ],
}
const lc = mkW('ilc', 'dint-3')
export const LCE_QUESTIONS: Question[] = [
  lc(1, 'Segundo a LC 1.111/2010, o estágio probatório dos servidores do TJSP dura', ['36 meses.', 'Art. 11.'], [['12 meses.', 'o estágio dura 36 meses.'], ['24 meses.', 'o estágio dura 36 meses.'], ['60 meses.', 'o estágio dura 36 meses.'], ['6 meses.', 'o estágio dura 36 meses.']], 'Fácil'),
  lc(2, 'Os cargos efetivos do quadro do TJSP têm 8 referências, cada uma com', ['18 graus, de A a R.', 'Art. 3º.'], [['10 graus, de A a J.', 'são 18 graus, de A a R.'], ['14 graus, de I a XIV.', 'os algarismos romanos de I a XIV são dos cargos em comissão.'], ['20 graus, de A a T.', 'são 18 graus, de A a R.'], ['12 graus, de A a L.', 'são 18 graus, de A a R.']], 'Médio'),
  lc(3, 'O adicional por tempo de serviço previsto na LC 1.111/2010 é de', ['5% por quinquênio.', 'Art. 7º.'], [['1% por ano.', 'a regra é 5% por quinquênio.'], ['10% por quinquênio.', 'a regra é 5% por quinquênio.'], ['5% por biênio.', 'a regra é 5% por quinquênio.'], ['2% por triênio.', 'a regra é 5% por quinquênio.']], 'Médio'),
  lc(4, 'No Adicional de Qualificação (AQ), o percentual para o servidor com título de doutor é de', ['20%, não cumulativo e sem incorporação aos vencimentos.', 'Art. 37-A.'], [['15%, cumulativo com os demais.', '15% é o do mestre e os percentuais não são cumulativos.'], ['10%, incorporado aos vencimentos.', '10% é o da especialização; o AQ não se incorpora.'], ['7,5%, cumulativo.', '7,5% é o da graduação.'], ['30%, incorporado.', 'o percentual do doutor é 20%.']], 'Difícil'),
  lc(5, 'Quanto à escolaridade, o cargo de Escrevente Técnico Judiciário exige', ['Ensino Médio completo.', 'Anexo VII.'], [['Ensino Fundamental completo.', 'o Fundamental é exigido de outros cargos, como Agente Administrativo.'], ['Ensino Superior completo.', 'o Superior é exigido de outros cargos, como Analista e Contador.'], ['Ensino Superior em Direito.', 'o cargo exige Ensino Médio.'], ['pós-graduação.', 'o cargo exige Ensino Médio.']], 'Fácil'),
]
const clc = mkC('ilc', 'dint-3', 'in-lc-estrutura')
export const LCE_CARDS: Flashcard[] = [
  clc(1, 'Como é a escala de vencimentos dos cargos efetivos?', '8 referências (1 a 8), com 18 graus cada (A a R); comissão: 2 níveis de 14 referências (I a XIV) — art. 3º.'),
  clc(2, 'Qual a duração do estágio probatório?', '36 meses; avalia assiduidade, pontualidade, aptidão, capacidade e eficiência (art. 11).'),
  clc(3, 'Quais as vantagens do art. 7º?', 'Adicional por tempo de serviço de 5% por quinquênio, sexta-parte, 13º salário, salário-família e outras vantagens.'),
  clc(4, 'O que é o AQ?', 'Adicional de Qualificação: doutor 20%, mestre 15%, especialização 10%, graduação 7,5%; não cumulativo; não se incorpora.'),
  clc(5, 'Quanto é o RETEJ?', '31,74% sobre o padrão, para o Oficial de Justiça, jornada de 40 horas (art. 37).'),
  clc(6, 'O servidor efetivo nomeado para comissão pode manter o vencimento?', 'Sim, pode optar pelo vencimento do cargo efetivo (art. 6º).'),
]

// ───────── 5. LC 1.111/2010 – carreira
export const LCC_LESSON: Lesson = {
  id: 'in-lc-carreira', topicId: 'dint-3', title: 'LC 1.111/2010: progressão, promoção, acesso e Comitê de Recursos Humanos', questionIds: qids('ilr'),
  steps: [
    step('Entenda', [
      'Progressão (arts. 13 a 20): é a passagem de um grau para o imediatamente superior, na mesma referência e nível. Exige interstício mínimo de 1 ano no mesmo cargo e grau (antes eram 2 anos) e avaliação anual de desempenho com resultado final positivo (antes exigiam-se dois resultados). O servidor pode recorrer ao Comitê de Recursos Humanos em 30 dias corridos da publicação. O interstício é interrompido nos afastamentos para outra função, com exceções (gratificação pro labore, cargo em comissão, substituição, cursos de aperfeiçoamento e afastamentos de até 90 dias para eventos da área).',
      'Promoção (arts. 21 a 28): é a passagem para o nível e grau imediatamente superiores, na mesma referência. Exige interstício mínimo de 1 ano no último grau do nível (antes, 2 anos) e combina experiência, cursos específicos selecionados pelo Tribunal e avaliação de desempenho. O recurso também é de 30 dias corridos.',
      'Acesso (arts. 29 a 33): é o provimento vertical de cargos em comissão de direção, coordenação, supervisão ou chefia por servidores efetivos, nas proporções de 100% para Chefe de Seção e Chefe de Seção Técnica, no mínimo 90% para Supervisor de Serviço, 90% para Coordenador e 70% para Diretor. Exigem-se experiência prévia em cargo de mesma natureza (ou experiência adequada), declaração de interesse, habilitação legal, as 3 últimas avaliações anuais positivas e cursos selecionados.',
      'Comitê de Recursos Humanos (art. 34): normatiza a avaliação de desempenho e o estágio probatório, acompanha seus resultados e decide os recursos de progressão e promoção; devia ser regulamentado por portaria da Presidência em até 180 dias. Outros pontos: o art. 42 criou cargos efetivos (técnicos em informática, administradores, analistas, arquitetos e engenheiros), o art. 43 extinguiu sete classes de assistentes técnicos e o art. 38 extinguiu cargos como Auxiliar de Administração Pública Judiciário à medida que vagassem. ' + AVISO_R],
      'Progressão e promoção: 1 ano de interstício; recurso em 30 dias corridos. Acesso: 100% (chefe de seção), mín. 90% (supervisor), 90% (coordenador), 70% (diretor); 3 últimas avaliações positivas.'),
    step('Exemplo prático', [
      'Caso 1 — escrevente com 1 ano no grau e avaliação positiva: elegível à progressão.',
      'Caso 2 — resultado negativo na avaliação: recurso ao Comitê em 30 dias corridos da publicação.',
      'Caso 3 — vagas de Diretor: 70% por acesso de servidores efetivos.',
      'Caso 4 — candidato ao acesso sem as 3 últimas avaliações positivas: não preenche o requisito.'],
      'Pergunta-teste: progressão ou promoção? Progressão muda o grau; promoção muda o nível e o grau.'),
    step('Resumo essencial', ['Desenvolvimento na carreira.'], undefined, { caption: 'Progressão, promoção e acesso', head: ['Instituto', 'Regra', 'Art.'], rows: [
      ['Progressão', 'Interstício de 1 ano; avaliação positiva; recurso em 30 dias corridos', '13 a 20'],
      ['Promoção', 'Interstício de 1 ano no último grau do nível; cursos e avaliação', '21 a 28'],
      ['Acesso: Chefe de Seção', '100%', '29 a 33'],
      ['Acesso: Supervisor', 'Mínimo de 90%', '29 a 33'],
      ['Acesso: Coordenador', '90%', '29 a 33'],
      ['Acesso: Diretor', '70%', '29 a 33'],
      ['Requisito do acesso', '3 últimas avaliações anuais positivas', '29 a 33']] }),
    step('O que memorizar', ['• Progressão e promoção: 1 ano.', '• Recurso: 30 dias corridos ao Comitê de RH.', '• Acesso: 100, 90, 90 e 70%.', '• Três últimas avaliações positivas.'] ),
  ],
}
const lr = mkW('ilr', 'dint-3')
export const LCC_QUESTIONS: Question[] = [
  lr(1, 'O interstício mínimo para a progressão funcional, na redação atual da LC 1.111/2010, é de', ['1 ano no mesmo cargo e grau.', 'Arts. 13 a 20.'], [['2 anos.', '2 anos era o interstício antes da alteração.'], ['6 meses.', 'o interstício é de 1 ano.'], ['3 anos.', '3 anos é o interstício do acesso no Estatuto, não da progressão.'], ['5 anos.', 'o interstício é de 1 ano.']], 'Médio'),
  lr(2, 'O recurso ao Comitê de Recursos Humanos contra o resultado da progressão ou promoção deve ser interposto em', ['30 dias corridos da publicação.', 'Arts. 13 a 28.'], [['5 dias úteis.', 'o prazo é de 30 dias corridos.'], ['10 dias úteis.', 'o prazo é de 30 dias corridos.'], ['15 dias úteis.', 'o prazo é de 30 dias corridos.'], ['60 dias corridos.', 'o prazo é de 30 dias corridos.']], 'Médio'),
  lr(3, 'No acesso, a proporção dos cargos de Diretor a ser provida por servidores efetivos é de', ['70%.', 'Arts. 29 a 33.'], [['100%.', '100% é a proporção de Chefe de Seção.'], ['90%.', '90% é a de Coordenador.'], ['50%.', 'a proporção é de 70%.'], ['30%.', 'a proporção é de 70%.']], 'Difícil'),
  lr(4, 'Entre os requisitos do acesso, exige-se que o servidor tenha', ['as 3 últimas avaliações anuais de desempenho positivas.', 'Arts. 29 a 33.'], [['a última avaliação anual positiva.', 'exigem-se as 3 últimas.'], ['as 5 últimas avaliações positivas.', 'exigem-se as 3 últimas.'], ['qualquer resultado na avaliação, desde que haja curso.', 'as avaliações positivas são exigidas.'], ['mais de 20 anos de serviço.', 'não é o requisito legal.']], 'Difícil'),
  lr(5, 'A passagem para o nível e grau imediatamente superiores, na mesma referência, é chamada de', ['promoção.', 'Arts. 21 a 28.'], [['progressão.', 'progressão é a passagem ao grau imediatamente superior no mesmo nível.'], ['acesso.', 'acesso é o provimento vertical de cargos em comissão por servidores efetivos.'], ['remoção.', 'remoção é a mudança de posto de trabalho.'], ['readaptação.', 'não é o instituto descrito.']], 'Médio'),
]
const clr = mkC('ilr', 'dint-3', 'in-lc-carreira')
export const LCC_CARDS: Flashcard[] = [
  clr(1, 'O que é progressão?', 'Passagem ao grau imediatamente superior na mesma referência e nível; interstício de 1 ano e avaliação positiva.'),
  clr(2, 'O que é promoção?', 'Passagem ao nível e grau imediatamente superiores; interstício de 1 ano no último grau do nível; cursos e avaliação.'),
  clr(3, 'O que é acesso?', 'Provimento vertical de cargos em comissão de direção, coordenação, supervisão ou chefia por servidores efetivos.'),
  clr(4, 'Quais as proporções do acesso?', 'Chefe de Seção e Chefe de Seção Técnica 100%; Supervisor mínimo de 90%; Coordenador 90%; Diretor 70%.'),
  clr(5, 'Prazo de recurso em progressão e promoção?', '30 dias corridos da publicação, ao Comitê de Recursos Humanos.'),
  clr(6, 'O que faz o Comitê de Recursos Humanos?', 'Normatiza a avaliação de desempenho e o estágio probatório, acompanha resultados e decide recursos de progressão e promoção (art. 34).'),
]

// ───────── 6. Regimento Interno – órgãos
export const RO_LESSON: Lesson = {
  id: 'in-ri-orgaos', topicId: 'dint-4', title: 'Regimento Interno do TJSP: Tribunal Pleno, Órgão Especial e Conselho Superior da Magistratura', questionIds: qids('iro'),
  steps: [
    step('Entenda', [
      'Estrutura (arts. 1º a 7º): o Regimento disciplina o funcionamento, as competências, os processos e os serviços do Tribunal. O Tribunal é composto por Pleno, Órgão Especial, Conselho Superior da Magistratura, cargos de direção, Seções, Turmas, Grupos, Câmaras e comissões. O Tribunal Pleno reúne todos os desembargadores e elege o Presidente, o Vice-Presidente, o Corregedor Geral e doze membros do Órgão Especial, entre outras atribuições.',
      'Órgão Especial (arts. 8º a 14): é composto por 25 desembargadores — os três dirigentes natos (Presidente, Vice-Presidente e Corregedor Geral) e os demais das classes de antiguidade e de eleitos; desembargadores oriundos do Ministério Público e da Advocacia ocupam, em alternância, a quinta cadeira reservada a essas origens. O quórum de instalação é de 13 desembargadores (art. 11). Havendo vaga, o Presidente convoca eleição em até 15 dias, com edital publicado 20 dias antes, e os eleitos tomam posse no dia seguinte (art. 10). Compete-lhe, em matéria jurisdicional, processar e julgar originariamente autoridades e matérias previstas nas Constituições, mandados de segurança e habeas data contra atos de órgãos específicos, incidentes de inconstitucionalidade, conflitos de competência entre órgãos do Tribunal de Seções diversas e arguições de impedimento ou suspeição de desembargador; em matéria administrativa, a elaboração de listas tríplices, a apreciação de promoções e remoções de magistrados, a instauração de processos disciplinares e a aprovação de projetos de lei de iniciativa do Judiciário (art. 13).',
      'Conselho Superior da Magistratura (arts. 15 e 16): é composto pelo Presidente do Tribunal, que o preside, pelo Vice-Presidente, pelo Corregedor Geral, pelo Decano e pelos Presidentes das Seções; em caso de empate, prevalece o voto do Presidente do Conselho. Compete-lhe, entre outras funções, oferecer ao Órgão Especial listas de promoção de juízes e opinar sobre remoções e permutas, apresentar listas do quinto constitucional, apreciar suspeições por foro íntimo de juízes de primeiro grau, julgar dúvidas de serventuários dos Registros Públicos, velar pela judicatura de primeiro grau e aprovar o quadro geral de antiguidade dos juízes.',
      'Os arts. 17 a 25 (Mesa, comissões e outros) e os arts. 46 a 290 não foram lidos em detalhe. ' + AVISO_R],
      'Órgão Especial: 25 desembargadores; quórum 13; eleição em 15 dias com edital de 20. Pleno elege doze membros do OE. CSM: Presidente, Vice, Corregedor, Decano e Presidentes das Seções.'),
    step('Exemplo prático', [
      'Caso 1 — vaga no Órgão Especial: o Presidente convoca eleição em até 15 dias, com edital 20 dias antes.',
      'Caso 2 — sessão do Órgão Especial com 12 desembargadores: não há quórum de instalação (13).',
      'Caso 3 — lista de promoção de juízes: o CSM a oferece ao Órgão Especial.',
      'Caso 4 — empate no CSM: prevalece o voto do Presidente.'],
      'Pergunta-teste: o Corregedor Geral integra o Órgão Especial? Sim, como membro nato.'),
    step('Resumo essencial', ['Números do Regimento.'], undefined, { caption: 'Pleno, OE e CSM', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Composição do OE', '25 desembargadores; Presidente, Vice e Corregedor natos', '8º'],
      ['Membros eleitos pelo Pleno', 'Doze membros do OE', '4º a 7º'],
      ['Quórum de instalação do OE', '13 desembargadores', '11'],
      ['Eleição para vaga', 'Convocada em até 15 dias; edital 20 dias antes', '10'],
      ['CSM', 'Presidente, Vice, Corregedor, Decano e Presidentes das Seções', '15'],
      ['Empate no CSM', 'Voto do Presidente prevalece', '15']] }),
    step('O que memorizar', ['• OE: 25 membros; quórum 13.', '• Eleição em 15 dias; edital de 20.', '• CSM: Presidente, Vice, Corregedor, Decano e Presidentes das 3 Seções.'] ),
  ],
}
const ro = mkW('iro', 'dint-4')
export const RO_QUESTIONS: Question[] = [
  ro(1, 'Segundo o Regimento Interno do TJSP, o Órgão Especial é composto por', ['25 desembargadores.', 'Art. 8º.'], [['15 desembargadores.', 'são 25 desembargadores.'], ['21 desembargadores.', 'são 25 desembargadores.'], ['30 desembargadores.', 'são 25 desembargadores.'], ['12 desembargadores.', 'doze é o número de membros que o Pleno elege.']], 'Fácil'),
  ro(2, 'O quórum mínimo para a instalação do Órgão Especial é de', ['13 desembargadores.', 'Art. 11.'], [['9 desembargadores.', 'o quórum é de 13.'], ['15 desembargadores.', 'o quórum é de 13.'], ['25 desembargadores.', 'esse é o número total de membros.'], ['7 desembargadores.', 'o quórum é de 13.']], 'Médio'),
  ro(3, 'Havendo vaga no Órgão Especial, o Presidente convoca a eleição em até', ['15 dias, com edital publicado 20 dias antes.', 'Art. 10.'], [['5 dias, com edital 10 dias antes.', 'o prazo é de 15 dias e o edital, 20 dias antes.'], ['30 dias, com edital 15 dias antes.', 'o prazo é de 15 dias e o edital, 20 dias antes.'], ['10 dias, sem edital.', 'há edital publicado 20 dias antes.'], ['60 dias, com edital 30 dias antes.', 'o prazo é de 15 dias e o edital, 20 dias antes.']], 'Difícil'),
  ro(4, 'Integram o Conselho Superior da Magistratura:', ['o Presidente, o Vice-Presidente, o Corregedor Geral, o Decano e os Presidentes das Seções.', 'Art. 15.'], [['apenas o Presidente e o Vice-Presidente.', 'integram também o Corregedor, o Decano e os Presidentes das Seções.'], ['todos os desembargadores do Tribunal.', 'esses compõem o Tribunal Pleno.'], ['os 25 membros do Órgão Especial.', 'esses compõem o Órgão Especial.'], ['os Presidentes das Câmaras.', 'não integram o Conselho.']], 'Médio'),
  ro(5, 'O Tribunal Pleno elege o Presidente, o Vice-Presidente, o Corregedor Geral e', ['doze membros do Órgão Especial.', 'Arts. 4º a 7º.'], [['todos os 25 membros do Órgão Especial.', 'os três dirigentes são natos; o Pleno elege doze.'], ['os Presidentes das Seções.', 'a eleição dos Presidentes de Seção não é do Pleno.'], ['o Decano.', 'o Decano é o desembargador mais antigo.'], ['os juízes de primeiro grau.', 'não é atribuição do Pleno eleger juízes.']], 'Difícil'),
]
const cro = mkC('iro', 'dint-4', 'in-ri-orgaos')
export const RO_CARDS: Flashcard[] = [
  cro(1, 'Como é composto o Órgão Especial?', '25 desembargadores: Presidente, Vice-Presidente e Corregedor natos e os demais das classes de antiguidade e eleitos (art. 8º).'),
  cro(2, 'Qual o quórum de instalação do OE?', '13 desembargadores (art. 11).'),
  cro(3, 'Como se elege para vaga no OE?', 'O Presidente convoca em até 15 dias, com edital 20 dias antes; posse no dia seguinte (art. 10).'),
  cro(4, 'Quem compõe o CSM?', 'Presidente (que o preside), Vice-Presidente, Corregedor Geral, Decano e Presidentes das Seções; empate: voto do Presidente (art. 15).'),
  cro(5, 'Competências administrativas do OE?', 'Listas tríplices, promoções e remoções de magistrados, processos disciplinares e projetos de lei do Judiciário (art. 13).'),
  cro(6, 'O que o Pleno elege?', 'Presidente, Vice-Presidente, Corregedor Geral e doze membros do Órgão Especial.'),
]

// ───────── 7. Regimento Interno – direção, Seções e Câmaras
export const RD_LESSON: Lesson = {
  id: 'in-ri-direcao', topicId: 'dint-4', title: 'Regimento Interno do TJSP: Presidência, Corregedoria, Seções, Câmaras e quóruns', questionIds: qids('ird'),
  steps: [
    step('Entenda', [
      'Presidência (art. 26): em matéria jurisdicional, decide certas questões urgentes antes da distribuição, aprecia pedidos de suspensão de segurança e admite recursos extraordinários e especiais de processos do Órgão Especial. Em matéria administrativa, administra o Tribunal, preside o Plenário, o Órgão Especial e o Conselho Superior e apresenta, até a última sessão ordinária de fevereiro, o relatório anual de trabalhos. Vice-Presidência (art. 27): substitui o Presidente em impedimentos e afastamentos, preside a distribuição de processos do Órgão Especial, a Câmara Especial e a Comissão de Assuntos Administrativos.',
      'Corregedoria-Geral (art. 28): superintende, em primeiro grau, a distribuição de feitos, recebe reclamações e instaura sindicâncias contra juízes, fiscaliza a atividade judicial de primeiro grau, presídios e delegações notariais e de registro, organiza as correições e designa, com aprovação do Conselho Superior, os corregedores permanentes, com a relação publicada na segunda quinzena de janeiro. Decano (art. 29): exerce as substituições previstas no Regimento, recebe atribuições delegadas pelos ocupantes de cargos de direção e integra comissões permanentes. Ouvidoria (arts. 29-A a 29-F): ouvidor e substituto são eleitos pelo Órgão Especial para mandatos de dois anos, com limite de quatro anos consecutivos.',
      'Seções e Câmaras (arts. 30 a 45): há três Seções (Direito Criminal, Direito Privado e Direito Público), além da Câmara Especial e da Câmara Especial de Presidentes, desvinculadas das Seções. A Câmara Especial é presidida pelo Vice-Presidente e integrada pelos Presidentes das Seções e pelo Decano; julga, entre outros, suspeição e impedimento de juízes de primeiro grau e conflitos de competência entre juízes. A Câmara Especial de Presidentes é presidida pelo Presidente do Tribunal e integrada pelo Vice-Presidente e pelos Presidentes das Seções; julga agravos contra decisões das presidências. As Câmaras têm cinco desembargadores cada (art. 34) e julgam com três; nos embargos infringentes criminais ou no julgamento do art. 942 do CPC, participam os cinco. Os Grupos reúnem duas Câmaras e julgam, por exemplo, mandados de segurança contra atos de Câmaras e revisões criminais. Os presidentes das Turmas, Grupos e Câmaras são eleitos por seis meses a um ano (art. 38). Órgão Especial, Turmas, Grupos e Câmaras só se instalam com maioria absoluta de seus integrantes (art. 43), e o Conselho Superior se reúne com ao menos dois ocupantes de cargos de direção e dois outros membros (art. 44).',
      'Não foram lidos os arts. 46 a 290 (comissões, desembargadores, juízes, competência, sessões e recursos). ' + AVISO_R],
      'Relatório do Presidente: até a última sessão ordinária de fevereiro. Corregedores permanentes: lista na 2ª quinzena de janeiro. Câmaras: 5 desembargadores; julgam com 3. Presidentes de Câmara: 6 meses a 1 ano.'),
    step('Exemplo prático', [
      'Caso 1 — impedimento do Presidente: o Vice-Presidente o substitui.',
      'Caso 2 — embargos infringentes criminais: julgam os cinco integrantes da Câmara.',
      'Caso 3 — conflito de competência entre juízes de primeiro grau: Câmara Especial.',
      'Caso 4 — agravo contra decisão da Presidência: Câmara Especial de Presidentes.'],
      'Pergunta-teste: quem preside a Câmara Especial? O Vice-Presidente.'),
    step('Resumo essencial', ['Direção e órgãos fracionários.'], undefined, { caption: 'Presidência, Seções e Câmaras', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Relatório anual do Presidente', 'Até a última sessão ordinária de fevereiro', '26'],
      ['Designação de corregedores permanentes', 'Corregedor Geral, com aprovação do CSM; lista na 2ª quinzena de janeiro', '28'],
      ['Seções', 'Criminal, Privado e Público', '30'],
      ['Câmara Especial', 'Presidida pelo Vice-Presidente', '33'],
      ['Câmara Especial de Presidentes', 'Presidida pelo Presidente', '33-A'],
      ['Câmaras', 'Cinco desembargadores; julgam com três', '34 e 41'],
      ['Presidentes de Câmara', 'Eleitos por 6 meses a 1 ano', '38'],
      ['Instalação', 'Maioria absoluta dos integrantes', '43']] }),
    step('O que memorizar', ['• Três Seções; Câmaras de cinco; turma de três.', '• Câmara Especial: Vice; Câmara Especial de Presidentes: Presidente.', '• Presidentes de Câmara: 6 meses a 1 ano.', '• Ouvidor: 2 anos, até 4 consecutivos.'] ),
  ],
}
const rd = mkW('ird', 'dint-4')
export const RD_QUESTIONS: Question[] = [
  rd(1, 'As Câmaras do Tribunal de Justiça de São Paulo são compostas por', ['cinco desembargadores, e julgam, em regra, com três.', 'Arts. 34 e 41.'], [['três desembargadores, e julgam com todos.', 'têm cinco e julgam, em regra, com três.'], ['sete desembargadores, e julgam com cinco.', 'têm cinco e julgam, em regra, com três.'], ['nove desembargadores, e julgam com sete.', 'têm cinco e julgam, em regra, com três.'], ['dois desembargadores, e julgam em dupla.', 'têm cinco e julgam, em regra, com três.']], 'Médio'),
  rd(2, 'O Presidente do Tribunal apresenta o relatório anual de trabalhos até', ['a última sessão ordinária de fevereiro.', 'Art. 26.'], [['a última sessão ordinária de dezembro.', 'o prazo é a última sessão ordinária de fevereiro.'], ['o dia 31 de março.', 'o prazo é a última sessão ordinária de fevereiro.'], ['a primeira sessão de janeiro.', 'o prazo é a última sessão ordinária de fevereiro.'], ['o fim do semestre.', 'o prazo é a última sessão ordinária de fevereiro.']], 'Difícil'),
  rd(3, 'A Câmara Especial do Tribunal é presidida', ['pelo Vice-Presidente do Tribunal.', 'Art. 33.'], [['pelo Presidente do Tribunal.', 'o Presidente preside a Câmara Especial de Presidentes.'], ['pelo Corregedor Geral.', 'a Câmara Especial é presidida pelo Vice-Presidente.'], ['pelo Decano.', 'o Decano a integra, mas não a preside.'], ['pelo desembargador mais moderno.', 'a Câmara Especial é presidida pelo Vice-Presidente.']], 'Médio'),
  rd(4, 'Os presidentes das Turmas, Grupos e Câmaras são eleitos por período de', ['seis meses a um ano.', 'Art. 38.'], [['dois anos, vedada a recondução.', 'o período é de seis meses a um ano.'], ['três anos.', 'o período é de seis meses a um ano.'], ['quatro anos.', 'quatro anos é o limite consecutivo do Ouvidor.'], ['trinta dias.', 'o período é de seis meses a um ano.']], 'Difícil'),
  rd(5, 'O Corregedor Geral designa os corregedores permanentes com aprovação do', ['Conselho Superior da Magistratura, com a relação publicada na segunda quinzena de janeiro.', 'Art. 28.'], [['Tribunal Pleno, com publicação em dezembro.', 'a aprovação é do Conselho Superior da Magistratura.'], ['Órgão Especial, com publicação em julho.', 'a aprovação é do Conselho Superior.'], ['Presidente, com publicação em março.', 'a aprovação é do Conselho Superior.'], ['Conselho Nacional de Justiça.', 'a aprovação é do Conselho Superior da Magistratura.']], 'Difícil'),
]
const crd = mkC('ird', 'dint-4', 'in-ri-direcao')
export const RD_CARDS: Flashcard[] = [
  crd(1, 'Quais as três Seções do TJSP?', 'Direito Criminal, Direito Privado e Direito Público (art. 30).'),
  crd(2, 'Como são as Câmaras?', 'Têm cinco desembargadores e julgam, em regra, com três; nos embargos infringentes criminais e no art. 942 do CPC, participam os cinco.'),
  crd(3, 'Quem preside a Câmara Especial e a Câmara Especial de Presidentes?', 'A Câmara Especial: o Vice-Presidente. A Câmara Especial de Presidentes: o Presidente do Tribunal.'),
  crd(4, 'O que faz o Corregedor Geral?', 'Fiscaliza o primeiro grau, presídios e delegações; instaura sindicâncias contra juízes; designa corregedores permanentes com aprovação do CSM (art. 28).'),
  crd(5, 'Qual o mandato do Ouvidor?', 'Dois anos, com limite de quatro anos consecutivos; eleito pelo Órgão Especial (arts. 29-A a 29-F).'),
  crd(6, 'Quando os órgãos se instalam?', 'Com maioria absoluta dos integrantes (art. 43); o CSM com ao menos dois dirigentes e dois outros membros (art. 44).'),
]

export const DINT_A_LESSONS = [TS_LESSON, TM_LESSON, EP_LESSON, LCE_LESSON, LCC_LESSON, RO_LESSON, RD_LESSON]
export const DINT_A_QUESTIONS = [...TS_QUESTIONS, ...TM_QUESTIONS, ...EP_QUESTIONS, ...LCE_QUESTIONS, ...LCC_QUESTIONS, ...RO_QUESTIONS, ...RD_QUESTIONS]
export const DINT_A_CARDS = [...TS_CARDS, ...TM_CARDS, ...EP_CARDS, ...LCE_CARDS, ...LCC_CARDS, ...RO_CARDS, ...RD_CARDS]
