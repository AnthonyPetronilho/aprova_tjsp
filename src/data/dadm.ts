import type { Flashcard, Lesson, Question } from '../types'
import { mkW, mkC, step, qids } from './helpers'
// Direito Administrativo, parte 1: Lei 10.261/1968 (Estatuto dos Funcionários Públicos Civis do Estado de SP).
// Fonte: página da ALESP (al.sp.gov.br), lida em 05/11/2026 por resumo automatizado; texto em paráfrase.
// Não cobertos (fora do edital): arts. 87 a 170, 176 a 238 e 324 em diante. Art. 77 (arredondamento) e 318 não conferidos.
const AVISO = 'Aviso: texto em paráfrase, lido em resumo automatizado da página da ALESP; a lei tem redações recentes. Confirme a versão vigente em al.sp.gov.br.'

// ───────── 1. Arts. 1º a 25
export const CONC_LESSON: Lesson = {
  id: 'ad-conceitos', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 1º a 25: conceitos, provimento, concurso e substituição', questionIds: qids('adc'),
  steps: [
    step('Entenda', [
      'Âmbito (arts. 1º e 2º): a lei institui o regime jurídico dos funcionários públicos civis do Estado e se aplica aos servidores dos três Poderes e do Tribunal de Contas, salvo conflito com legislação especial. Não se aplica aos empregados de autarquias, entidades paraestatais e serviços industriais, ressalvados os que já eram funcionários por lei anterior.',
      'Conceitos (arts. 3º a 9º): funcionário é a pessoa legalmente investida em cargo público (art. 3º); cargo público é o conjunto de atribuições e responsabilidades atribuídas a um funcionário (art. 4º); os cargos são isolados ou de carreira (art. 5º); referência numérica e grau formam o padrão do cargo (art. 6º); classe é o conjunto de cargos com a mesma denominação (art. 7º); carreira é o conjunto de classes de mesma natureza de trabalho, escalonadas por complexidade e responsabilidade (art. 8º); quadro é o conjunto de carreiras e cargos isolados (art. 9º). É vedado atribuir ao funcionário serviços estranhos ao seu cargo, exceto funções de chefia, direção e comissões legais (art. 10).',
      'Provimento (arts. 11 a 13): os cargos são providos por nomeação, transferência, reintegração, acesso, reversão, aproveitamento e readmissão (sete formas, art. 11). Sem candidato habilitado em concurso, cargos vagos podem ser ocupados sob regime trabalhista por no máximo 2 anos, vedada a recondução (art. 12). As nomeações são vitalícias, em comissão ou efetivas (art. 13).',
      'Concurso (arts. 14 a 22): cargo efetivo exige concurso público de provas ou de provas e títulos; as provas valem de 0 a 100 pontos e os títulos, no máximo 50 (art. 14). Os concursos são centralizados em um único órgão (art. 15), e a nomeação segue a ordem de classificação (art. 20).',
      'Substituição (arts. 23 a 25): há substituição no impedimento legal e temporário de chefe ou diretor; havendo vacância, o substituto responde pelo expediente até o provimento. O substituto exerce o cargo enquanto durar o impedimento, recebe o padrão e as vantagens do cargo substituído, além das pessoais, e perde o vencimento do próprio cargo, salvo se optar por ele (art. 24).',
      AVISO],
      'Sete formas de provimento; regime trabalhista por até 2 anos; provas de 0 a 100 e títulos até 50; substituto recebe o padrão do cargo substituído (ou opta pelo seu).'),
    step('Exemplo prático', [
      'Caso 1 — o Estado contrata sob regime trabalhista por falta de aprovado em concurso: no máximo 2 anos, sem recondução (art. 12).',
      'Caso 2 — o chefe de seção se afasta por impedimento temporário: o substituto assume e recebe o padrão do cargo substituído (art. 24).',
      'Caso 3 — pedem que o escrevente execute serviço estranho ao cargo: é vedado, salvo chefia, direção e comissões legais (art. 10).',
      'Caso 4 — concurso de provas e títulos: provas de 0 a 100, títulos até 50 pontos (art. 14).'],
      'Pergunta-teste: a lei vale para empregados de autarquias? Não (art. 2º), salvo os que já eram funcionários.'),
    step('Resumo essencial', ['Números e conceitos.'], undefined, { caption: 'Arts. 1º a 25', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Aplicação', 'Funcionários dos três Poderes e do TC; não aos empregados de autarquias', '1º e 2º'],
      ['Formas de provimento', 'Nomeação, transferência, reintegração, acesso, reversão, aproveitamento e readmissão', '11'],
      ['Regime trabalhista sem concurso', 'Até 2 anos, sem recondução', '12'],
      ['Pontuação do concurso', 'Provas de 0 a 100; títulos até 50', '14'],
      ['Ordem de nomeação', 'Classificação', '20'],
      ['Substituto', 'Recebe padrão e vantagens do cargo substituído; opta pelo seu vencimento', '24']] }),
    step('O que memorizar', ['• Funcionário é quem ocupa cargo; cargo é conjunto de atribuições e responsabilidades.', '• Sete formas de provimento (art. 11).', '• Regime trabalhista: 2 anos (art. 12).', '• Provas 0 a 100; títulos máximo 50 (art. 14).'] ),
  ],
}
const c = mkW('adc', 'dadm-1')
export const CONC_QUESTIONS: Question[] = [
  c(1, 'Nos termos do art. 12 da Lei 10.261/68, na falta de candidato habilitado em concurso, os cargos vagos podem ser ocupados sob regime trabalhista por, no máximo,', ['2 anos, vedada a recondução.', 'Art. 12.'], [['6 meses, admitida uma recondução.', 'o prazo é de 2 anos e não há recondução.'], ['1 ano, admitida recondução.', 'o prazo é de 2 anos, sem recondução.'], ['5 anos, admitida recondução.', 'o prazo é de 2 anos, sem recondução.'], ['3 anos, prorrogáveis por mais 3.', 'o prazo é de 2 anos, sem recondução.']], 'Médio'),
  c(2, 'No concurso público para cargo efetivo, segundo o art. 14 da Lei 10.261/68, as provas valem de 0 a 100 pontos e os títulos valem, no máximo,', ['50 pontos.', 'Art. 14, parágrafo único.'], [['10 pontos.', 'o máximo de títulos é de 50 pontos.'], ['20 pontos.', 'o máximo de títulos é de 50 pontos.'], ['100 pontos.', 'o máximo de títulos é de 50 pontos.'], ['30 pontos.', 'o máximo de títulos é de 50 pontos.']], 'Médio'),
  c(3, 'Não é forma de provimento de cargo público prevista no art. 11 da Lei 10.261/68:', ['a remoção.', 'A remoção é movimentação entre unidades; as formas do art. 11 são nomeação, transferência, reintegração, acesso, reversão, aproveitamento e readmissão.'], [['a reintegração.', 'é forma de provimento.'], ['o aproveitamento.', 'é forma de provimento.'], ['a readmissão.', 'é forma de provimento.'], ['o acesso.', 'é forma de provimento.']], 'Médio'),
  c(4, 'Durante a substituição de chefe impedido temporariamente, o substituto', ['recebe o padrão e as vantagens do cargo substituído, além das vantagens pessoais, perdendo o vencimento do próprio cargo, salvo se optar por ele.', 'Art. 24, §§ 2º e 3º.'], [['mantém apenas o vencimento do próprio cargo, sem direito a nada mais.', 'ele recebe o padrão do cargo substituído, salvo opção.'], ['acumula o vencimento dos dois cargos.', 'não acumula: perde o próprio, salvo opção.'], ['não recebe qualquer vantagem do cargo substituído.', 'recebe o padrão e as vantagens do cargo substituído.'], ['depende de decreto do Governador para cada pagamento.', 'não é o que a lei prevê.']], 'Difícil'),
  c(5, 'A Lei 10.261/68 não se aplica', ['aos empregados de autarquias, entidades paraestatais e serviços industriais, ressalvados os que já eram funcionários por lei anterior.', 'Art. 2º.'], [['aos servidores do Poder Judiciário.', 'aplica-se aos três Poderes.'], ['aos servidores do Tribunal de Contas.', 'aplica-se ao Tribunal de Contas.'], ['aos servidores do Poder Legislativo.', 'aplica-se aos três Poderes.'], ['aos funcionários ocupantes de cargo em comissão.', 'aplica-se a eles.']], 'Médio'),
]
const cc = mkC('adc', 'dadm-1', 'ad-conceitos')
export const CONC_CARDS: Flashcard[] = [
  cc(1, 'Quais as formas de provimento (art. 11)?', 'Nomeação, transferência, reintegração, acesso, reversão, aproveitamento e readmissão.'),
  cc(2, 'Por quanto tempo se admite regime trabalhista sem concurso (art. 12)?', 'Até 2 anos, sem recondução.'),
  cc(3, 'Pontuação do concurso (art. 14)?', 'Provas de 0 a 100 pontos; títulos, no máximo 50.'),
  cc(4, 'O que é carreira e o que é quadro?', 'Carreira: conjunto de classes de mesma natureza de trabalho (art. 8º). Quadro: conjunto de carreiras e cargos isolados (art. 9º).'),
  cc(5, 'Que vantagens tem o substituto?', 'Padrão e vantagens do cargo substituído, mais as pessoais; perde o vencimento do próprio cargo, salvo se optar por ele (art. 24).'),
  cc(6, 'Pode-se atribuir serviço estranho ao cargo?', 'Não, exceto funções de chefia, direção e comissões legais (art. 10).'),
]

// ───────── 2. Arts. 26 a 45
export const FORM_LESSON: Lesson = {
  id: 'ad-formas', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 26 a 45: transferência, reintegração, acesso, reversão, aproveitamento, readmissão, readaptação e remoção', questionIds: qids('adf'),
  steps: [
    step('Entenda', [
      'Transferência (arts. 26 a 29): passagem de um cargo efetivo para outro, a pedido ou de ofício, considerando a conveniência do serviço e os requisitos do cargo; deve ser para cargo de mesmo padrão ou igual remuneração (na transferência a pedido o vencimento pode ser inferior). A permuta exige requerimento de ambos os interessados.',
      'Reintegração (arts. 30 a 32): reingresso decorrente de decisão judicial transitada em julgado, com ressarcimento dos prejuízos do afastamento. Ocorre no cargo anterior ou no resultante de sua transformação; se estiver ocupado, o ocupante é exonerado (ou reconduzido), sem indenização; se extinto, em cargo equivalente, e não sendo possível, o reintegrado fica em disponibilidade. O decreto de reintegração deve ser expedido em até 30 dias do trânsito em julgado.',
      'Acesso (arts. 33 e 34): elevação, dentro do mesmo quadro e natureza de trabalho, para cargo de maior responsabilidade e complexidade, por aferição de mérito; o interstício é de 3 anos de efetivo exercício.',
      'Reversão (arts. 35 e 36): reingresso do aposentado, a pedido ou de ofício. A reversão de ofício ocorre quando cessam as razões da aposentadoria por invalidez. Não pode reverter quem tiver mais de 58 anos, limite que pode ser ultrapassado na reversão de ofício. Exige inspeção médica; sendo desfavorável o laudo, nova inspeção só após no mínimo 90 dias. A reversão se dá no mesmo cargo.',
      'Aproveitamento (arts. 37 e 38): reingresso do funcionário em disponibilidade, em vagas existentes ou que surgirem, em cargo de natureza e padrão correspondentes, nunca em padrão superior; se o padrão for inferior ao provento, tem direito à diferença. Exige inspeção médica (nova inspeção após no mínimo 90 dias, se o laudo for desfavorável); se for julgado incapaz, é aposentado.',
      'Readmissão (arts. 39 e 40): reingresso de ex-funcionário demitido ou exonerado, sem ressarcimento de prejuízos, mas com contagem do tempo anterior para aposentadoria e disponibilidade. A readmissão de demitido exige reexame prévio do processo; se a demissão foi a bem do serviço público, só após 5 anos do ato.',
      'Readaptação e remoção (arts. 41 a 45): readaptação é a investidura em cargo mais compatível com a capacidade do servidor, mediante inspeção médica, sem alterar a remuneração (art. 41 e 42). Remoção, a pedido ou de ofício, só ocorre entre repartições da mesma Secretaria ou órgãos da mesma repartição, respeitada a lotação (art. 43); a permuta exige requerimento de ambos e anuência das chefias (art. 44).',
      AVISO],
      'Reintegração: decreto em 30 dias. Acesso: 3 anos. Reversão: até 58 anos; nova inspeção em 90 dias. Readmissão a bem do serviço: 5 anos.'),
    step('Exemplo prático', [
      'Caso 1 — decisão judicial transitada em julgado anula a demissão: reintegração, com decreto em até 30 dias.',
      'Caso 2 — aposentado por invalidez recupera a capacidade: reversão de ofício, com inspeção médica.',
      'Caso 3 — ex-funcionário demitido a bem do serviço público quer voltar: só após 5 anos (art. 39, § 2º).',
      'Caso 4 — funcionário em disponibilidade volta ao serviço: aproveitamento, nunca em padrão superior.'],
      'Pergunta-teste: reintegração ou readmissão? Reintegração decorre de decisão judicial, com ressarcimento; readmissão não ressarce prejuízos.'),
    step('Resumo essencial', ['Formas e prazos.'], undefined, { caption: 'Arts. 26 a 45', head: ['Forma', 'Regra-chave', 'Art.'], rows: [
      ['Transferência', 'Cargo efetivo para outro, mesmo padrão ou igual remuneração', '26 a 29'],
      ['Reintegração', 'Decisão judicial transitada; decreto em 30 dias', '30 a 32'],
      ['Acesso', 'Interstício de 3 anos', '33 e 34'],
      ['Reversão', 'Aposentado; limite de 58 anos; reinspeção após 90 dias', '35 e 36'],
      ['Aproveitamento', 'Quem está em disponibilidade; nunca padrão superior', '37 e 38'],
      ['Readmissão', 'Sem ressarcimento; a bem do serviço: após 5 anos', '39 e 40'],
      ['Readaptação', 'Cargo mais compatível; remuneração mantida', '41 e 42']] }),
    step('O que memorizar', ['• Reintegração = decisão judicial; 30 dias.', '• Acesso = 3 anos.', '• Reversão = aposentado, 58 anos, 90 dias.', '• Aproveitamento = disponibilidade.', '• Readmissão a bem do serviço = 5 anos.'] ),
  ],
}
const f = mkW('adf', 'dadm-1')
export const FORM_QUESTIONS: Question[] = [
  f(1, 'O decreto de reintegração deve ser expedido em até', ['30 dias contados do trânsito em julgado da decisão judicial.', 'Art. 32.'], [['5 dias.', 'o prazo é de 30 dias.'], ['15 dias.', 'o prazo é de 30 dias.'], ['60 dias.', 'o prazo é de 30 dias.'], ['90 dias.', 'o prazo é de 90 dias na reinspeção, não no decreto.']], 'Médio'),
  f(2, 'O interstício exigido para concorrer ao acesso é de', ['3 anos de efetivo exercício.', 'Art. 34.'], [['1 ano.', 'o interstício é de 3 anos.'], ['2 anos.', 'o interstício é de 3 anos.'], ['5 anos.', 'o interstício é de 3 anos.'], ['10 anos.', 'o interstício é de 3 anos.']], 'Fácil'),
  f(3, 'Na reversão, não pode reverter quem tiver mais de', ['58 anos, limite que pode ser ultrapassado na reversão de ofício.', 'Art. 35, §§ 2º e 3º.'], [['45 anos, sem exceção.', 'o limite é de 58 anos, com exceção.'], ['60 anos, sem exceção.', 'o limite é de 58 anos, com exceção.'], ['65 anos, sem exceção.', 'o limite é de 58 anos, com exceção.'], ['70 anos, sem exceção.', 'o limite é de 58 anos, com exceção.']], 'Médio'),
  f(4, 'A readmissão de ex-funcionário demitido a bem do serviço público só pode ocorrer após', ['5 anos do ato demissório.', 'Art. 39, § 2º.'], [['1 ano.', 'o prazo é de 5 anos.'], ['2 anos.', 'o prazo é de 5 anos.'], ['10 anos.', 'o prazo é de 5 anos; 10 anos é a incompatibilidade do art. 307 para nova investidura.'], ['nunca poderá ocorrer.', 'a lei admite a readmissão após 5 anos.']], 'Difícil'),
  f(5, 'O aproveitamento é o reingresso', ['do funcionário em disponibilidade, nunca em padrão superior ao do cargo anterior.', 'Arts. 37 e 38.'], [['do aposentado, a pedido ou de ofício.', 'esse é o conceito de reversão.'], ['do ex-funcionário demitido.', 'esse é o conceito de readmissão.'], ['decorrente de decisão judicial transitada em julgado.', 'esse é o conceito de reintegração.'], ['do funcionário readaptado em novo cargo.', 'esse é o conceito de readaptação.']], 'Médio'),
]
const cf = mkC('adf', 'dadm-1', 'ad-formas')
export const FORM_CARDS: Flashcard[] = [
  cf(1, 'O que é a reintegração?', 'Reingresso por decisão judicial transitada em julgado, com ressarcimento de prejuízos; decreto em até 30 dias (arts. 30 a 32).'),
  cf(2, 'Qual o interstício do acesso?', '3 anos de efetivo exercício (art. 34).'),
  cf(3, 'Como é a reversão?', 'Reingresso do aposentado, a pedido ou de ofício; limite de 58 anos; inspeção médica; reinspeção após no mínimo 90 dias (arts. 35 e 36).'),
  cf(4, 'O que é o aproveitamento?', 'Reingresso do funcionário em disponibilidade, em cargo correspondente, nunca em padrão superior (arts. 37 e 38).'),
  cf(5, 'Como funciona a readmissão?', 'Ex-funcionário demitido ou exonerado volta sem ressarcimento, contando o tempo anterior; a bem do serviço, só após 5 anos (arts. 39 e 40).'),
  cf(6, 'Qual a diferença entre readaptação e remoção?', 'Readaptação: cargo mais compatível com a capacidade, remuneração mantida (arts. 41 e 42). Remoção: mudança de repartição dentro da Secretaria ou do órgão (art. 43).'),
]

// ───────── 3. Arts. 46 a 75
export const POSS_LESSON: Lesson = {
  id: 'ad-posse', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 46 a 75: posse, exercício e afastamentos', questionIds: qids('adp'),
  steps: [
    step('Entenda', [
      'Posse (arts. 46 a 55): é o ato que investe o cidadão em cargo público. Requisitos (art. 47): ser brasileiro; ter 18 anos completos; estar quite com as obrigações militares; estar em gozo dos direitos políticos; ter boa conduta; gozar de boa saúde (verificada em perícia oficial para cargo efetivo); ter aptidão; atender às condições especiais do cargo. A posse se efetiva com a assinatura do termo de compromisso (art. 49) e pode ser por procuração em casos específicos (art. 50). O prazo para tomar posse é de 30 dias da publicação do ato de provimento, prorrogável por mais 30 dias a pedido; sem posse no prazo, o ato fica sem efeito (art. 52). A contagem pode ser suspensa por até 120 dias na perícia de ingresso ou por 30 dias na pendência de recurso contra decisão médica, interposto em 5 dias (art. 53).',
      'Exercício (arts. 57 a 69): é o ato de assumir as atribuições do cargo (art. 57). Lotação é o número de servidores previsto para cada unidade (art. 58). O exercício deve começar em 30 dias, contados da posse ou da publicação da remoção, prorrogável por 30 dias; quem não entra em exercício no prazo é exonerado (art. 60). Na mudança de sede há trânsito de até 8 dias (art. 61). Não é permitido exercer em serviço diverso do de lotação, salvo por lei ou autorização do Governador (art. 65); o afastamento autorizado pelo Governador vale para finalidade determinada e prazo certo (art. 66); saídas do Estado ou da sede para missão ou estudo exigem autorização expressa do Governador (art. 68).',
      'Afastamentos (arts. 70 a 75): o servidor preso ou pronunciado fica afastado sem remuneração até a condenação ou absolvição transitada em julgado (art. 70); o servidor no exercício de mandato eletivo federal ou estadual fica afastado sem remuneração (art. 72); o Prefeito ou Vereador remunerado fica afastado, podendo optar entre o subsídio e o vencimento do cargo (art. 73); o Vereador não remunerado se afasta apenas nos dias de sessão, se o horário coincidir com o expediente (art. 74). O afastamento para competições desportivas depende de autorização do Governador e é remunerado se representar o Brasil ou o Estado (art. 75).',
      AVISO],
      'Posse: 30 dias (+30). Exercício: 30 dias (+30). Trânsito: até 8 dias. Perícia: suspensão até 120 dias. 18 anos para tomar posse.'),
    step('Exemplo prático', [
      'Caso 1 — o aprovado nomeado não toma posse em 30 dias e não pediu prorrogação: o ato fica sem efeito (art. 52).',
      'Caso 2 — tomou posse e não entra em exercício em 30 dias (nem pede prorrogação): é exonerado (art. 60).',
      'Caso 3 — servidor removido para outra sede: tem trânsito de até 8 dias (art. 61).',
      'Caso 4 — servidor preso em flagrante e pronunciado: afastado sem remuneração (art. 70).'],
      'Pergunta-teste: posse ou exercício? Posse investe no cargo; exercício é assumir as atribuições.'),
    step('Resumo essencial', ['Prazos.'], undefined, { caption: 'Arts. 46 a 75', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Idade mínima para posse', '18 anos completos', '47'],
      ['Prazo para posse', '30 dias da publicação; prorrogável por 30', '52'],
      ['Suspensão na perícia', 'Até 120 dias; 30 dias com recurso (5 dias para interpor)', '53'],
      ['Prazo para exercício', '30 dias da posse; prorrogável por 30; senão, exoneração', '60'],
      ['Trânsito', 'Até 8 dias na mudança de sede', '61'],
      ['Preso ou pronunciado', 'Afastado sem remuneração', '70'],
      ['Mandato federal ou estadual', 'Afastado sem remuneração', '72']] }),
    step('O que memorizar', ['• Posse: termo de compromisso; 30 dias.', '• Exercício: 30 dias; falta leva à exoneração.', '• Trânsito: 8 dias.', '• Preso ou pronunciado: sem remuneração.'] ),
  ],
}
const p = mkW('adp', 'dadm-1')
export const POSS_QUESTIONS: Question[] = [
  p(1, 'O prazo para a posse é de 30 dias contados da publicação do ato de provimento, e pode ser prorrogado, a pedido, por mais', ['30 dias.', 'Art. 52.'], [['10 dias.', 'a prorrogação é de 30 dias.'], ['15 dias.', 'a prorrogação é de 30 dias.'], ['60 dias.', 'a prorrogação é de 30 dias.'], ['90 dias.', 'a prorrogação é de 30 dias.']], 'Médio'),
  p(2, 'O funcionário que não entra em exercício no prazo legal', ['é exonerado.', 'Art. 60.'], [['é demitido a bem do serviço público.', 'a consequência prevista é a exoneração.'], ['recebe repreensão e novo prazo de 30 dias.', 'a consequência prevista é a exoneração.'], ['é transferido de ofício.', 'a consequência prevista é a exoneração.'], ['fica em disponibilidade.', 'a consequência prevista é a exoneração.']], 'Médio'),
  p(3, 'Na mudança de sede, o funcionário tem direito a trânsito de até', ['8 dias.', 'Art. 61.'], [['2 dias.', 'o trânsito é de até 8 dias.'], ['5 dias.', 'o trânsito é de até 8 dias.'], ['15 dias.', 'o trânsito é de até 8 dias.'], ['30 dias.', 'o trânsito é de até 8 dias.']], 'Médio'),
  p(4, 'Entre os requisitos para a posse, o art. 47 exige idade mínima de', ['18 anos completos.', 'Art. 47.'], [['16 anos completos.', 'a idade exigida é de 18 anos.'], ['21 anos completos.', 'a idade exigida é de 18 anos.'], ['14 anos completos.', 'a idade exigida é de 18 anos.'], ['25 anos completos.', 'a idade exigida é de 18 anos.']], 'Fácil'),
  p(5, 'O servidor preso ou pronunciado', ['fica afastado sem remuneração até a condenação ou absolvição transitada em julgado.', 'Art. 70.'], [['continua recebendo integralmente a remuneração.', 'o afastamento é sem remuneração.'], ['é demitido imediatamente.', 'fica afastado, sem demissão automática.'], ['é transferido de ofício.', 'fica afastado.'], ['recebe metade da remuneração.', 'o afastamento é sem remuneração.']], 'Médio'),
]
const cp = mkC('adp', 'dadm-1', 'ad-posse')
export const POSS_CARDS: Flashcard[] = [
  cp(1, 'Quais os requisitos para a posse (art. 47)?', 'Brasileiro; 18 anos; obrigações militares; direitos políticos; boa conduta; boa saúde (perícia oficial para efetivo); aptidão; condições especiais do cargo.'),
  cp(2, 'Prazo da posse?', '30 dias da publicação, prorrogável por mais 30 a pedido; sem posse, o ato fica sem efeito (art. 52).'),
  cp(3, 'Prazo do exercício?', '30 dias da posse ou da publicação da remoção, prorrogável por 30; sem exercício, exoneração (art. 60).'),
  cp(4, 'Qual o trânsito na mudança de sede?', 'Até 8 dias (art. 61).'),
  cp(5, 'O que é lotação?', 'Número de servidores de carreira e cargos isolados previsto para cada unidade (art. 58).'),
  cp(6, 'Que afastamentos são sem remuneração?', 'Preso ou pronunciado (art. 70) e mandato eletivo federal ou estadual (art. 72).'),
]

// ───────── 4. Arts. 76 a 86
export const TEMP_LESSON: Lesson = {
  id: 'ad-tempo', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 76 a 86: tempo de serviço e vacância', questionIds: qids('adt'),
  steps: [
    step('Entenda', [
      'Tempo de serviço (arts. 76 a 85): conta-se o tempo prestado ao Estado e a suas autarquias; o tempo prestado à União, a outros Estados e a Municípios é contado integralmente para aposentadoria e disponibilidade (art. 76). Contam como efetivo exercício, entre outros, as férias, o casamento, o falecimento de familiares e as licenças previstas (art. 78); alguns afastamentos contam para todos os efeitos, exceto remuneração (art. 80); outros contam para adicional por tempo de serviço, sexta-parte, aposentadoria e disponibilidade (art. 81). O mandato federal, estadual e municipal remunerado conta para aposentadoria e promoção por antiguidade (art. 82). O tempo em disponibilidade conta para aposentadoria (art. 83). É vedada a contagem em duplicidade de tempo prestado simultaneamente em dois cargos (art. 84), e o tempo de serviço gratuito não é computado (art. 85).',
      'Vacância (art. 86): ocorre por exoneração, demissão, transferência, acesso, aposentadoria ou falecimento. A exoneração se dá a pedido, a critério do Governo (para cargo em comissão) ou quando o servidor não entra em exercício no prazo legal; a demissão é penalidade nos casos previstos em lei.',
      'A regra de arredondamento de sobras de tempo (art. 77) e o rol detalhado de dias do art. 78 não foram conferidos com precisão. ' + AVISO],
      'Tempo público contado para aposentadoria e disponibilidade; vedada contagem em duplicidade; tempo gratuito não conta; vacância em seis hipóteses.'),
    step('Exemplo prático', [
      'Caso 1 — servidor acumulou dois períodos simultâneos em cargos distintos: não se conta duas vezes o mesmo tempo (art. 84).',
      'Caso 2 — serviço prestado gratuitamente à Administração: não é computado (art. 85).',
      'Caso 3 — o ocupante de cargo em comissão é dispensado a critério do Governo: exoneração (art. 86, § 1º).',
      'Caso 4 — falecimento: causa de vacância (art. 86).'],
      'Pergunta-teste: demissão é pena ou pedido? Penalidade, nos casos previstos em lei; exoneração é a pedido ou a critério do Governo.'),
    step('Resumo essencial', ['Tempo e vacância.'], undefined, { caption: 'Arts. 76 a 86', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Tempo em outros entes', 'Contado integralmente para aposentadoria e disponibilidade', '76'],
      ['Mandato eletivo remunerado', 'Conta para aposentadoria e promoção por antiguidade', '82'],
      ['Disponibilidade', 'Conta para aposentadoria', '83'],
      ['Tempo simultâneo', 'Vedada a duplicidade', '84'],
      ['Serviço gratuito', 'Não é computado', '85'],
      ['Vacância', 'Exoneração, demissão, transferência, acesso, aposentadoria, falecimento', '86']] }),
    step('O que memorizar', ['• Vacância: exoneração, demissão, transferência, acesso, aposentadoria, falecimento.', '• Não conta tempo em duplicidade nem serviço gratuito.', '• Tempo em disponibilidade conta para aposentadoria.'] ),
  ],
}
const t = mkW('adt', 'dadm-1')
export const TEMP_QUESTIONS: Question[] = [
  t(1, 'Segundo o art. 86 da Lei 10.261/68, a vacância ocorre por', ['exoneração, demissão, transferência, acesso, aposentadoria ou falecimento.', 'Art. 86.'], [['readmissão, reversão ou aproveitamento.', 'são formas de provimento, não de vacância.'], ['remoção, readaptação ou substituição.', 'não são hipóteses de vacância.'], ['posse, exercício ou lotação.', 'não são hipóteses de vacância.'], ['licença, afastamento ou disponibilidade.', 'não são hipóteses de vacância.']], 'Médio'),
  t(2, 'É vedada a contagem em duplicidade de tempo de serviço', ['prestado simultaneamente em dois cargos.', 'Art. 84.'], [['prestado à União.', 'o tempo da União é contado para aposentadoria e disponibilidade.'], ['de licença para tratamento de saúde.', 'a vedação é para tempo simultâneo em dois cargos.'], ['prestado em disponibilidade.', 'esse tempo conta para aposentadoria (art. 83).'], ['de mandato eletivo remunerado.', 'conta para aposentadoria e promoção por antiguidade.']], 'Médio'),
  t(3, 'O tempo de serviço gratuito', ['não é computado.', 'Art. 85.'], [['conta em dobro.', 'não é computado.'], ['conta para adicional por tempo de serviço.', 'não é computado.'], ['conta somente para aposentadoria.', 'não é computado.'], ['conta com redução de 50%.', 'não é computado.']], 'Fácil'),
  t(4, 'A exoneração, segundo o art. 86, § 1º, ocorre', ['a pedido, a critério do Governo (cargo em comissão) ou quando o servidor não entra em exercício no prazo legal.', 'Art. 86, § 1º.'], [['como penalidade nos casos previstos em lei.', 'isso é a demissão (§ 2º).'], ['apenas por decisão judicial.', 'não é o que prevê a lei.'], ['sempre de ofício, sem pedido.', 'a exoneração pode ser a pedido.'], ['somente por falecimento.', 'falecimento é hipótese autônoma de vacância.']], 'Médio'),
  t(5, 'O tempo em disponibilidade', ['conta para aposentadoria.', 'Art. 83.'], [['não conta para nenhum efeito.', 'conta para aposentadoria.'], ['conta somente para promoção.', 'conta para aposentadoria.'], ['conta somente para adicional.', 'conta para aposentadoria.'], ['conta em dobro para aposentadoria.', 'conta para aposentadoria, sem dobra.']], 'Fácil'),
]
const ct = mkC('adt', 'dadm-1', 'ad-tempo')
export const TEMP_CARDS: Flashcard[] = [
  ct(1, 'Quais as hipóteses de vacância?', 'Exoneração, demissão, transferência, acesso, aposentadoria e falecimento (art. 86).'),
  ct(2, 'Quando se dá a exoneração?', 'A pedido; a critério do Governo (cargo em comissão); ou quando não há exercício no prazo (art. 86, § 1º).'),
  ct(3, 'Tempo de outros entes conta?', 'Sim, o tempo prestado à União, a outros Estados e a Municípios conta para aposentadoria e disponibilidade (art. 76).'),
  ct(4, 'Pode contar tempo duplicado?', 'Não: é vedada a contagem de tempo simultâneo em dois cargos (art. 84).'),
  ct(5, 'E o serviço gratuito?', 'Não é computado (art. 85).'),
  ct(6, 'Disponibilidade conta para quê?', 'Para aposentadoria (art. 83).'),
]

// ───────── 5. Arts. 171–175 e 239–250
export const DEV_LESSON: Lesson = {
  id: 'ad-deveres', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 171 a 175 e 239 a 250: acumulação, petição, deveres, proibições e responsabilidade', questionIds: qids('ade'),
  steps: [
    step('Entenda', [
      'Acumulação (arts. 171 a 175): é proibido o acúmulo remunerado de cargos, exceto: um juiz com um cargo de professor; dois cargos de professor; um cargo de professor com outro técnico ou científico; dois cargos privativos de médico; em todos os casos, exige-se correlação de matérias e compatibilidade de horários (art. 171, § 1º). A proibição vale para autarquias, empresas públicas e sociedades de economia mista (§ 2º). Quem é nomeado para cargo em comissão perde a remuneração do cargo efetivo durante o exercício, salvo se optar por ela (art. 172). Comprovada a acumulação irregular em processo administrativo, o servidor é demitido de todos os cargos e restitui o que recebeu indevidamente; havendo boa-fé, permanece no cargo mais antigo; sem boa-fé, fica inabilitado por 5 anos para cargo ou função pública (art. 174). Autoridades, chefes e fiscais devem comunicar o acúmulo de que souberem, e qualquer cidadão pode denunciar (art. 175).',
      'Direito de petição (arts. 239 e 240): qualquer pessoa pode peticionar contra ilegalidade ou abuso de poder e em defesa de direitos, sem pagamento; a Administração não pode recusar protocolo, encaminhamento ou análise. O servidor pode requerer, representar, pedir reconsideração e recorrer no prazo de 30 dias, salvo previsão legal específica (art. 240).',
      'Deveres (art. 241): são 14 deveres, entre eles ser assíduo e pontual, obedecer às ordens (representando contra as manifestamente ilegais), guardar sigilo, comunicar irregularidades, tratar as pessoas com urbanidade, residir no local do trabalho e manter atualizada a declaração de família. Proibições (arts. 242 a 244): entre elas, retirar documentos sem permissão, tratar de interesses particulares na repartição, usar material público em serviço privado, contratar com o Governo, incitar greves, praticar usura, atuar como intermediário perante repartições (salvo para cônjuge ou parente até segundo grau) e fundar ou integrar sindicato de servidores. É vedado trabalhar sob ordens imediatas de parentes até o segundo grau, salvo em função de confiança de livre escolha, com no máximo 2 auxiliares nessas condições (art. 244).',
      'Responsabilidade (arts. 245 a 250): o servidor responde por prejuízos causados à Fazenda por dolo ou culpa (art. 245). Em caso de alcance, desfalque ou falta de recolhimento no prazo, repõe o prejuízo de uma só vez (art. 247); nos demais casos, o desconto no vencimento não pode exceder 1/10 (art. 248). A responsabilidade administrativa não afasta a civil e a criminal e é independente delas; o processo administrativo só pode ser suspenso para aguardar decisão judicial por despacho motivado (art. 250).',
      AVISO],
      'Acumulação: 4 exceções; inabilitação de 5 anos sem boa-fé. Recurso/petição: 30 dias. Desconto: até 1/10; alcance: de uma só vez. Parentes: até 2 auxiliares.'),
    step('Exemplo prático', [
      'Caso 1 — dois cargos de professor, com compatibilidade de horários: acumulação permitida (art. 171).',
      'Caso 2 — acumulação ilegal apurada, servidor de má-fé: demitido de todos os cargos, restitui valores e fica inabilitado por 5 anos (art. 174).',
      'Caso 3 — prejuízo à Fazenda por culpa do servidor, sem alcance: desconto de até 1/10 do vencimento (art. 248).',
      'Caso 4 — servidor condenado criminalmente e também no processo administrativo: as responsabilidades são independentes (art. 250).'],
      'Pergunta-teste: a absolvição administrativa impede a ação penal? Não: as instâncias são independentes.'),
    step('Resumo essencial', ['Números.'], undefined, { caption: 'Arts. 171 a 175 e 239 a 250', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Acumulação lícita', 'Juiz + professor; 2 professores; professor + técnico/científico; 2 médicos', '171'],
      ['Acumulação ilícita com má-fé', 'Demissão de todos os cargos, restituição e inabilitação por 5 anos', '174'],
      ['Prazo para recorrer/requerer', '30 dias', '240'],
      ['Deveres', '14 deveres', '241'],
      ['Parentes como chefes', 'No máximo 2 auxiliares em função de confiança', '244'],
      ['Alcance/desfalque', 'Reposição de uma só vez', '247'],
      ['Desconto nos demais casos', 'Até 1/10 do vencimento', '248'],
      ['Independência das instâncias', 'Administrativa, civil e penal', '250']] }),
    step('O que memorizar', ['• Quatro exceções de acumulação, com correlação e compatibilidade de horários.', '• Má-fé: 5 anos de inabilitação.', '• Prazo de 30 dias.', '• 1/10 do vencimento.'] ),
  ],
}
const e = mkW('ade', 'dadm-1')
export const DEV_QUESTIONS: Question[] = [
  e(1, 'Comprovada a acumulação ilegal de cargos, sem boa-fé, o servidor, além de demitido, fica inabilitado para o exercício de cargo ou função pública pelo prazo de', ['5 anos.', 'Art. 174, § 2º.'], [['1 ano.', 'o prazo é de 5 anos.'], ['2 anos.', 'o prazo é de 5 anos.'], ['10 anos.', 'o prazo é de 5 anos; 10 anos é a incompatibilidade após demissão a bem do serviço (art. 307).'], ['3 anos.', 'o prazo é de 5 anos.']], 'Médio'),
  e(2, 'O servidor pode requerer, representar, pedir reconsideração e recorrer, salvo previsão legal específica, no prazo de', ['30 dias.', 'Art. 240.'], [['5 dias.', 'o prazo é de 30 dias.'], ['10 dias.', 'o prazo é de 30 dias.'], ['120 dias.', 'esse prazo antigo foi revogado.'], ['5 anos.', 'esse prazo antigo foi revogado.']], 'Médio'),
  e(3, 'Nos casos de prejuízo à Fazenda que não sejam de alcance ou desfalque, o desconto no vencimento do servidor não pode exceder', ['1/10.', 'Art. 248.'], [['1/5.', 'o limite é de 1/10.'], ['1/3.', 'o limite é de 1/10.'], ['1/2.', 'o limite é de 1/10.'], ['3/10.', 'o limite é de 1/10.']], 'Difícil'),
  e(4, 'Segundo o art. 250, a responsabilidade administrativa', ['não afasta a civil e a criminal, sendo independentes entre si.', 'Art. 250.'], [['impede a responsabilização civil.', 'as instâncias são independentes.'], ['depende sempre da condenação criminal.', 'as instâncias são independentes.'], ['só existe se houver condenação civil.', 'as instâncias são independentes.'], ['substitui a responsabilidade penal.', 'as instâncias são independentes.']], 'Médio'),
  e(5, 'Quanto ao trabalho sob ordens imediatas de parentes até o segundo grau, a regra do art. 244 admite exceção para função de confiança de livre escolha, com no máximo', ['2 auxiliares nessas condições.', 'Art. 244.'], [['1 auxiliar.', 'o limite é de 2.'], ['3 auxiliares.', 'o limite é de 2.'], ['5 auxiliares.', 'o limite é de 2.'], ['10 auxiliares.', 'o limite é de 2.']], 'Difícil'),
]
const ce = mkC('ade', 'dadm-1', 'ad-deveres')
export const DEV_CARDS: Flashcard[] = [
  ce(1, 'Quais as exceções à proibição de acumular?', 'Juiz com um cargo de professor; dois de professor; um de professor com um técnico ou científico; dois privativos de médico; com correlação de matérias e compatibilidade de horários (art. 171).'),
  ce(2, 'E se a acumulação for de má-fé?', 'Demissão de todos os cargos, restituição e inabilitação por 5 anos (art. 174).'),
  ce(3, 'Qual o prazo para o servidor recorrer?', '30 dias, salvo previsão legal específica (art. 240).'),
  ce(4, 'Como se repara o prejuízo à Fazenda?', 'Alcance ou desfalque: reposição de uma só vez; demais casos: desconto de até 1/10 do vencimento (arts. 247 e 248).'),
  ce(5, 'As responsabilidades são independentes?', 'Sim, administrativa, civil e criminal (art. 250); o processo só é suspenso por despacho motivado.'),
  ce(6, 'O que o servidor não pode fazer (art. 243)?', 'Contratar com o Governo, incitar greves, praticar usura, ser intermediário (salvo parentes), fundar ou integrar sindicato de servidores, entre outras condutas.'),
]

export const DADM_A_LESSONS = [CONC_LESSON, FORM_LESSON, POSS_LESSON, TEMP_LESSON, DEV_LESSON]
export const DADM_A_QUESTIONS = [...CONC_QUESTIONS, ...FORM_QUESTIONS, ...POSS_QUESTIONS, ...TEMP_QUESTIONS, ...DEV_QUESTIONS]
export const DADM_A_CARDS = [...CONC_CARDS, ...FORM_CARDS, ...POSS_CARDS, ...TEMP_CARDS, ...DEV_CARDS]
