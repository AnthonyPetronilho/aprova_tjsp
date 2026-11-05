import type { Flashcard, Lesson, Question } from '../types'
import { mkW, mkC, spread, step, qids } from './helpers'
import { DADM_A_LESSONS, DADM_A_QUESTIONS, DADM_A_CARDS } from './dadm'
// Direito Administrativo, parte 2: Lei 10.261/68 (penas, apuração, processo) e Lei 8.429/92 (redação da Lei 14.230/2021).
// Fontes: página da ALESP (Lei 10.261) e legis.senado.leg.br (Lei 14.230), lidas em 05/11/2026 por resumo automatizado.
// Não cobertos: Lei 10.261 arts. 267-A a 267-P (autocomposição) só em resumo; Lei 8.429 arts. 4º a 8º-A, 13 a 15, 18 a 20, 22 e 24 em diante.
const AVISO = 'Aviso: texto em paráfrase, lido em resumo automatizado de fonte oficial secundária; confirme a redação vigente em al.sp.gov.br (Lei 10.261) e planalto.gov.br (Lei 8.429).'

// ───────── 6. Penas (arts. 251 a 263)
export const PENA_LESSON: Lesson = {
  id: 'ad-penas', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 251 a 263: penas disciplinares e prescrição', questionIds: qids('adn'),
  steps: [
    step('Entenda', [
      'Penas (art. 251): repreensão, suspensão, multa, demissão, demissão a bem do serviço público e cassação de aposentadoria ou disponibilidade. Na aplicação, consideram-se a natureza e a gravidade da infração e os danos ao serviço público (art. 252).',
      'Repreensão: por escrito, nos casos de indisciplina ou descumprimento de deveres (art. 253). Suspensão: até 90 dias, para falta grave ou reincidência; pode ser convertida em multa de 50% da remuneração por dia, mantido o servidor em serviço (art. 254). Multa: forma e casos previstos em lei ou regulamento (art. 255).',
      'Demissão (art. 256): procedimento irregular grave, ineficiência e inassiduidade, entre outros casos. Inassiduidade é a ausência injustificada por mais de 15 dias consecutivos ou mais de 20 dias úteis intercalados em um ano (§ 1º). Para demitir por ineficiência exige-se a impossibilidade de readaptação (§ 2º). Demissão a bem do serviço público (art. 257): crimes contra a administração, insubordinação grave, agressões em serviço, lesão ao patrimônio, recebimento de propinas e improbidade, entre outros. O ato deve citar o dispositivo legal em que se fundamenta (art. 258). Cassação de aposentadoria ou disponibilidade: inativo que cometeu falta grave em atividade, aceitou cargo ilegalmente, aceitou representação estrangeira sem autorização ou praticou usura (art. 259).',
      'Competência (art. 260): o Governador aplica todas as penas; Secretários, Procurador Geral, Controlador Geral e superintendentes de autarquia, todas as penas; Chefes de Gabinete, até suspensão; Coordenadores, suspensão até 60 dias; Diretores de Departamento e Divisão, suspensão até 30 dias.',
      'Prescrição (art. 261): em 2 anos para repreensão, suspensão e multa; em 5 anos para demissão, demissão a bem do serviço e cassação; para faltas que também são crimes, aplica-se o prazo penal, se superior a 5 anos. A portaria de instauração de sindicância ou processo interrompe a prescrição. Todas as penas são anotadas no assentamento individual (art. 263).',
      AVISO],
      'Suspensão: até 90 dias (conversão em multa de 50%). Inassiduidade: 15 dias consecutivos ou 20 intercalados. Prescrição: 2 anos (leves) e 5 anos (demissão e cassação).'),
    step('Exemplo prático', [
      'Caso 1 — falta grave: suspensão de até 90 dias; pode converter-se em multa de 50% por dia (art. 254).',
      'Caso 2 — ausência de 16 dias consecutivos sem justificativa: inassiduidade, ensejando demissão (art. 256, § 1º).',
      'Caso 3 — Coordenador aplica suspensão de 45 dias: dentro do limite de 60 dias (art. 260).',
      'Caso 4 — fato punível com repreensão ocorrido há 3 anos sem interrupção: prescrito (2 anos).'],
      'Pergunta-teste: quem pode demitir? O Governador, os Secretários e as autoridades equiparadas; Coordenadores e Diretores só aplicam suspensão até seus limites.'),
    step('Resumo essencial', ['Penas e prazos.'], undefined, { caption: 'Arts. 251 a 263', head: ['Item', 'Regra', 'Art.'], rows: [
      ['Penas', 'Repreensão, suspensão, multa, demissão, demissão a bem do serviço, cassação', '251'],
      ['Suspensão', 'Até 90 dias; converte-se em multa de 50% por dia', '254'],
      ['Inassiduidade', 'Mais de 15 dias consecutivos ou 20 dias úteis intercalados em um ano', '256, § 1º'],
      ['Coordenador', 'Suspensão até 60 dias', '260'],
      ['Diretor de Departamento/Divisão', 'Suspensão até 30 dias', '260'],
      ['Prescrição leve', '2 anos (repreensão, suspensão, multa)', '261'],
      ['Prescrição grave', '5 anos (demissão, a bem do serviço, cassação)', '261']] }),
    step('O que memorizar', ['• Seis penas (art. 251).', '• Suspensão: 90 dias; conversão em multa de 50%.', '• Inassiduidade: 15 consecutivos ou 20 intercalados.', '• Prescrição: 2 e 5 anos.'] ),
  ],
}
const n = mkW('adn', 'dadm-1')
export const PENA_QUESTIONS: Question[] = [
  n(1, 'A pena de suspensão, na Lei 10.261/68, não excederá', ['90 dias.', 'Art. 254.'], [['30 dias.', 'o limite é de 90 dias (30 dias é a alçada do Diretor).'], ['60 dias.', 'o limite é de 90 dias (60 dias é a alçada do Coordenador).'], ['120 dias.', 'o limite é de 90 dias.'], ['180 dias.', 'o limite é de 90 dias; 180 dias é o afastamento preventivo.']], 'Médio'),
  n(2, 'Configura inassiduidade a ausência injustificada por mais de', ['15 dias consecutivos ou mais de 20 dias úteis intercalados em um ano.', 'Art. 256, § 1º.'], [['5 dias consecutivos ou 10 intercalados.', 'os números são 15 e 20.'], ['30 dias consecutivos ou 60 intercalados.', 'os números são 15 e 20.'], ['8 dias consecutivos ou 15 intercalados.', 'os números são 15 e 20.'], ['90 dias consecutivos.', 'os números são 15 e 20.']], 'Médio'),
  n(3, 'Prescreve em 2 anos a punibilidade da falta sujeita a', ['repreensão, suspensão ou multa.', 'Art. 261, I.'], [['demissão.', 'prescreve em 5 anos.'], ['demissão a bem do serviço público.', 'prescreve em 5 anos.'], ['cassação de aposentadoria.', 'prescreve em 5 anos.'], ['cassação de disponibilidade.', 'prescreve em 5 anos.']], 'Médio'),
  n(4, 'O Coordenador pode aplicar suspensão até', ['60 dias.', 'Art. 260.'], [['30 dias.', 'esse é o limite do Diretor de Departamento ou Divisão.'], ['90 dias.', 'esse é o limite máximo da suspensão, exercido por autoridades superiores.'], ['15 dias.', 'o limite é de 60 dias.'], ['120 dias.', 'o limite é de 60 dias.']], 'Difícil'),
  n(5, 'A suspensão pode ser convertida em multa de', ['50% da remuneração por dia, mantido o servidor em serviço.', 'Art. 254, § 2º.'], [['10% da remuneração por dia.', 'o percentual é de 50%.'], ['25% da remuneração por dia.', 'o percentual é de 50%.'], ['100% da remuneração por dia.', 'o percentual é de 50%.'], ['1/10 da remuneração mensal.', 'o percentual é de 50% por dia.']], 'Difícil'),
]
const cn = mkC('adn', 'dadm-1', 'ad-penas')
export const PENA_CARDS: Flashcard[] = [
  cn(1, 'Quais as penas disciplinares (art. 251)?', 'Repreensão, suspensão, multa, demissão, demissão a bem do serviço público e cassação de aposentadoria ou disponibilidade.'),
  cn(2, 'Qual o limite da suspensão?', 'Até 90 dias; pode ser convertida em multa de 50% da remuneração por dia (art. 254).'),
  cn(3, 'O que é inassiduidade?', 'Ausência injustificada por mais de 15 dias consecutivos ou mais de 20 dias úteis intercalados em um ano (art. 256, § 1º).'),
  cn(4, 'Alçada de suspensão por autoridade?', 'Chefes de Gabinete: até suspensão; Coordenadores: até 60 dias; Diretores: até 30 dias (art. 260).'),
  cn(5, 'Prazos de prescrição?', '2 anos: repreensão, suspensão e multa. 5 anos: demissão, a bem do serviço e cassação; faltas que são crimes seguem o prazo penal se maior (art. 261).'),
  cn(6, 'Quando se demite por ineficiência?', 'Só quando é impossível a readaptação (art. 256, § 2º).'),
]

// ───────── 7. Apuração (arts. 264 a 278)
export const APU_LESSON: Lesson = {
  id: 'ad-apuracao', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 264 a 278: apuração preliminar, afastamento preventivo, sindicância e processo', questionIds: qids('ada'),
  steps: [
    step('Entenda', [
      'Providências preliminares (arts. 264 a 267): a autoridade que souber de irregularidade deve adotar providências imediatas de apuração (art. 264). A apuração preliminar, de caráter investigativo, cabe quando a infração não está caracterizada ou a autoria é indefinida, e deve ser concluída em 30 dias (art. 265, § 1º). O Chefe de Gabinete pode determinar afastamento preventivo, sem perda de vencimentos, por até 180 dias, prorrogável uma vez por igual período (art. 266); esse afastamento conta como efetivo exercício e não é descontado de eventual suspensão (art. 267).',
      'Práticas autocompositivas e TAC (arts. 267-A a 267-P): preveem mediação, justiça restaurativa e termo de ajustamento de conduta, com cumprimento de 1 a 2 anos e requisitos (sem dolo, mais de 5 anos de exercício, sem punição disciplinar nos últimos 5 anos e sem TAC nos últimos 3), além de suspensão condicional da sindicância por 1 a 2 anos. Estes artigos foram lidos apenas em resumo.',
      'Sindicância e processo (arts. 268 a 278): a apuração se faz por sindicância ou processo, com contraditório e ampla defesa (art. 268). Sindicância é cabível quando a falta puder gerar repreensão, suspensão ou multa (art. 269); processo administrativo é obrigatório quando puder gerar demissão, demissão a bem do serviço ou cassação (art. 270). A sindicância admite até 3 testemunhas por parte e deve ser concluída em 60 dias (art. 273). É vedado atuar como apurador quem for amigo íntimo ou inimigo, parente até o terceiro grau, cônjuge ou companheiro do denunciante ou acusado, ou subordinado deste (art. 275). No processo, a portaria sai em 8 dias do recebimento da determinação e a conclusão se dá em 90 dias da citação (art. 277). A citação deve ser pessoal, com 2 dias de antecedência; frustrada, por edital publicado no Diário Oficial com 10 dias de antecedência (art. 278).',
      AVISO],
      'Apuração preliminar: 30 dias. Afastamento preventivo: 180 dias + 180. Sindicância: 3 testemunhas e 60 dias. Processo: portaria em 8 dias e 90 dias. Citação: 2 dias; edital: 10 dias.'),
    step('Exemplo prático', [
      'Caso 1 — notícia de irregularidade com autoria incerta: apuração preliminar, concluída em 30 dias.',
      'Caso 2 — falta que pode gerar demissão: processo administrativo obrigatório (art. 270).',
      'Caso 3 — o presidente do processo é cônjuge do acusado: impedido (art. 275).',
      'Caso 4 — acusado não encontrado: citação por edital, com 10 dias de antecedência (art. 278).'],
      'Pergunta-teste: sindicância ou processo? Penas leves (repreensão, suspensão, multa): sindicância; penas graves: processo.'),
    step('Resumo essencial', ['Prazos da apuração.'], undefined, { caption: 'Arts. 264 a 278', head: ['Item', 'Regra', 'Art.'], rows: [
      ['Apuração preliminar', 'Concluída em 30 dias', '265, § 1º'],
      ['Afastamento preventivo', 'Até 180 dias, prorrogável uma vez; conta como efetivo exercício', '266 e 267'],
      ['Sindicância', 'Até 3 testemunhas por parte; 60 dias', '273'],
      ['Processo obrigatório', 'Demissão, demissão a bem do serviço, cassação', '270'],
      ['Portaria do processo', 'Em 8 dias; conclusão em 90 dias da citação', '277'],
      ['Citação', 'Pessoal, 2 dias antes; edital com 10 dias', '278']] }),
    step('O que memorizar', ['• 30 dias, 180 dias, 60 dias, 90 dias.', '• Sindicância para penas leves; processo para penas graves.', '• Citação pessoal com 2 dias; edital com 10.'] ),
  ],
}
const a = mkW('ada', 'dadm-1')
export const APU_QUESTIONS: Question[] = [
  a(1, 'O afastamento preventivo do servidor, sem perda de vencimentos, pode durar até', ['180 dias, prorrogável uma vez por igual período.', 'Art. 266.'], [['30 dias, improrrogáveis.', 'o prazo é de 180 dias, prorrogável uma vez.'], ['60 dias, prorrogáveis por mais 60.', 'o prazo é de 180 dias, prorrogável uma vez.'], ['90 dias, prorrogáveis duas vezes.', 'o prazo é de 180 dias, prorrogável uma vez.'], ['1 ano, improrrogável.', 'o prazo é de 180 dias, prorrogável uma vez.']], 'Médio'),
  a(2, 'O processo administrativo é obrigatório quando a falta puder ensejar', ['demissão, demissão a bem do serviço público ou cassação de aposentadoria ou disponibilidade.', 'Art. 270.'], [['repreensão.', 'para penas leves, a sindicância.'], ['suspensão.', 'para penas leves, a sindicância.'], ['multa.', 'para penas leves, a sindicância.'], ['qualquer pena, sem distinção.', 'a sindicância é cabível para repreensão, suspensão e multa.']], 'Médio'),
  a(3, 'A sindicância deve ser concluída em', ['60 dias, com até 3 testemunhas por parte.', 'Art. 273.'], [['30 dias, com até 5 testemunhas.', 'o prazo é de 60 dias e o limite é de 3 testemunhas.'], ['90 dias, com até 3 testemunhas.', 'o prazo da sindicância é de 60 dias; 90 dias é o do processo.'], ['15 dias, sem testemunhas.', 'o prazo é de 60 dias.'], ['120 dias, com até 10 testemunhas.', 'o prazo é de 60 dias.']], 'Difícil'),
  a(4, 'A apuração preliminar deve ser concluída em', ['30 dias.', 'Art. 265, § 1º.'], [['8 dias.', 'o prazo é de 30 dias.'], ['60 dias.', 'o prazo é de 30 dias; 60 dias é o da sindicância.'], ['90 dias.', 'o prazo é de 30 dias.'], ['180 dias.', 'esse é o afastamento preventivo.']], 'Médio'),
  a(5, 'No processo administrativo disciplinar, frustrada a citação pessoal, ela será feita por edital publicado no Diário Oficial com antecedência de', ['10 dias.', 'Art. 278.'], [['2 dias.', 'esse é o prazo da citação pessoal.'], ['5 dias.', 'o prazo é de 10 dias.'], ['30 dias.', 'o prazo é de 10 dias.'], ['15 dias.', 'o prazo é de 10 dias.']], 'Difícil'),
]
const ca = mkC('ada', 'dadm-1', 'ad-apuracao')
export const APU_CARDS: Flashcard[] = [
  ca(1, 'Prazo da apuração preliminar?', '30 dias (art. 265, § 1º).'),
  ca(2, 'Afastamento preventivo?', 'Até 180 dias, prorrogável uma vez; sem perda de vencimentos; conta como efetivo exercício (arts. 266 e 267).'),
  ca(3, 'Quando cabe sindicância e quando processo?', 'Sindicância: repreensão, suspensão ou multa. Processo: demissão, demissão a bem do serviço ou cassação (arts. 269 e 270).'),
  ca(4, 'Prazos da sindicância?', '60 dias para concluir; até 3 testemunhas por parte (art. 273).'),
  ca(5, 'Prazos do processo?', 'Portaria em 8 dias; conclusão em 90 dias da citação (art. 277).'),
  ca(6, 'Como é a citação?', 'Pessoal, com 2 dias de antecedência; por edital, com 10 dias de antecedência, se frustrada (art. 278).'),
]

// ───────── 8. Processo, recursos e revisão (arts. 279 a 323)
export const PROC_LESSON: Lesson = {
  id: 'ad-processo', topicId: 'dadm-1', title: 'Lei 10.261/68, arts. 279 a 323: instrução, recursos e revisão', questionIds: qids('adq'),
  steps: [
    step('Entenda', [
      'Instrução (arts. 279 a 291): o acusado revel tem advogado dativo nomeado (art. 281); pode constituir advogado a qualquer tempo (art. 282). Após o interrogatório, abre-se prazo de 3 dias para pedir ou apresentar provas; o presidente e o acusado arrolam até 5 testemunhas cada (art. 283). Ouvem-se primeiro as testemunhas do presidente e depois as do acusado (art. 284). O presidente só pode indeferir, por decisão fundamentada, provas ilícitas, impertinentes, desnecessárias ou protelatórias (art. 290).',
      'Defesa e julgamento (arts. 292 a 299): encerrada a prova, a defesa tem 7 dias para alegações finais (art. 292); o relatório sai em 10 dias (art. 293); a autoridade tem 20 dias para julgar ou determinar diligência (art. 295); determinada a diligência, há 15 dias para cumpri-la, com vista à defesa por 5 dias (art. 296). As decisões são publicadas no DOE em 8 dias e averbadas no registro funcional (art. 299). Não se declara nulidade de ato que não influa na verdade substancial ou na decisão (art. 305). Crime imputado leva à instauração de inquérito policial (art. 302). Após 5 anos de efetivo exercício do cumprimento da sanção, sem nova infração, ela não pesa contra o servidor, inclusive para reincidência; demissão e demissão a bem do serviço geram incompatibilidade para nova investidura por 5 e 10 anos, respectivamente (art. 307).',
      'Inassiduidade (arts. 308 a 311): o superior comunica as faltas com a ficha funcional; não se instaura processo contra servidor que já pediu exoneração (art. 309); o processo só por inassiduidade se extingue se o indiciado pedir exoneração até o interrogatório (art. 310); a defesa só pode alegar força maior, coação ilegal ou motivo legalmente justificável (art. 311).',
      'Recursos e revisão (arts. 312 a 321): cabe um único recurso da decisão que aplique penalidade, em 30 dias, contados da publicação no DOE ou da intimação pessoal; a autoridade que aplicou a pena tem 10 dias para manter ou reformar; se mantida, vai ao superior hierárquico (art. 312). Cabe pedido de reconsideração, não renovável, de decisão do Governador em única instância, em 30 dias (art. 313). Os recursos não têm efeito suspensivo (art. 314). A revisão da punição pode ser pedida a qualquer tempo, havendo fatos não apreciados ou vícios insanáveis; alegar apenas injustiça não basta; o ônus da prova é do requerente (art. 315). A revisão não pode agravar a pena (art. 316), é pedida por advogado (art. 317) e conduzida por servidor efetivo, confirmado, que não tenha atuado no processo punitivo (art. 319); o requerente tem 8 dias para indicar provas (art. 320). Julgada procedente, pode reclassificar a infração, absolver, modificar a pena ou anular o processo (art. 321).',
      'Os prazos previstos na lei são contados em dias corridos, sem contar o dia inicial, prorrogando-se para o primeiro dia útil se vencerem em dia sem expediente (art. 323, conforme o resumo lido; confirme). ' + AVISO],
      'Provas: 3 dias; 5 testemunhas; alegações finais: 7 dias; relatório: 10 dias; julgamento: 20 dias; publicação: 8 dias; recurso: 30 dias (1 só); revisão: a qualquer tempo, sem agravar.'),
    step('Exemplo prático', [
      'Caso 1 — após o interrogatório: 3 dias para pedir provas, com até 5 testemunhas por parte.',
      'Caso 2 — alegações finais da defesa em 7 dias; relatório em 10; julgamento em 20.',
      'Caso 3 — penalidade imposta: um único recurso em 30 dias, sem efeito suspensivo.',
      'Caso 4 — punição definitiva, surgem fatos novos: pedido de revisão, que não pode agravar a pena.'],
      'Pergunta-teste: a revisão tem prazo? Não, pode ser pedida a qualquer tempo.'),
    step('Resumo essencial', ['Prazos.'], undefined, { caption: 'Arts. 279 a 323', head: ['Etapa', 'Prazo/regra', 'Art.'], rows: [
      ['Pedir provas', '3 dias após o interrogatório; até 5 testemunhas', '283'],
      ['Alegações finais', '7 dias', '292'],
      ['Relatório', '10 dias', '293'],
      ['Julgamento', '20 dias', '295'],
      ['Publicação da decisão', '8 dias no DOE', '299'],
      ['Recurso', 'Um só, 30 dias, sem efeito suspensivo', '312 e 314'],
      ['Revisão', 'Qualquer tempo; não agrava; 8 dias para provas', '315, 316 e 320'],
      ['Reabilitação funcional', '5 anos sem nova infração', '307']] }),
    step('O que memorizar', ['• 3, 7, 10, 20 e 8 dias.', '• Recurso único de 30 dias, sem efeito suspensivo.', '• Revisão: qualquer tempo, ônus do requerente, sem agravamento.'] ),
  ],
}
const q = mkW('adq', 'dadm-1')
export const PROC_QUESTIONS: Question[] = [
  q(1, 'Encerrada a instrução, a defesa tem para apresentar alegações finais o prazo de', ['7 dias.', 'Art. 292.'], [['3 dias.', 'o prazo é de 7 dias; 3 dias é o prazo para pedir provas.'], ['10 dias.', 'o prazo é de 7 dias; 10 dias é o do relatório.'], ['15 dias.', 'o prazo é de 7 dias.'], ['20 dias.', 'o prazo é de 7 dias; 20 dias é o da autoridade para julgar.']], 'Médio'),
  q(2, 'Da decisão que aplicar penalidade cabe recurso', ['único, no prazo de 30 dias, sem efeito suspensivo.', 'Arts. 312 e 314.'], [['duplo, no prazo de 10 dias, com efeito suspensivo.', 'o recurso é único, em 30 dias, sem efeito suspensivo.'], ['único, no prazo de 5 dias, com efeito suspensivo.', 'o prazo é de 30 dias e não há efeito suspensivo.'], ['ilimitado, no prazo de 30 dias.', 'o recurso é único.'], ['somente ao Governador, no prazo de 8 dias.', 'o prazo é de 30 dias.']], 'Médio'),
  q(3, 'A revisão do processo disciplinar', ['pode ser pedida a qualquer tempo, não pode agravar a pena e exige que o requerente prove suas alegações.', 'Arts. 315 e 316.'], [['só pode ser pedida em até 1 ano.', 'pode ser pedida a qualquer tempo.'], ['pode agravar a pena aplicada.', 'a revisão não pode agravar a pena.'], ['pode ser pedida sem a presença de advogado.', 'o pedido é feito por advogado (art. 317).'], ['admite reiteração com o mesmo fundamento.', 'não se reitera pedido com o mesmo fundamento.']], 'Difícil'),
  q(4, 'A autoridade a quem o relatório é encaminhado tem para julgar o prazo de', ['20 dias.', 'Art. 295.'], [['8 dias.', 'esse é o prazo de publicação da decisão.'], ['10 dias.', 'esse é o prazo do relatório.'], ['30 dias.', 'o prazo é de 20 dias.'], ['60 dias.', 'o prazo é de 20 dias.']], 'Médio'),
  q(5, 'Após o interrogatório, o acusado e o presidente podem arrolar testemunhas em número de até', ['5 cada.', 'Art. 283, § 1º.'], [['3 cada.', 'o limite do processo é de 5 (3 é o da sindicância).'], ['8 cada.', 'o limite é de 5.'], ['10 cada.', 'o limite é de 5.'], ['2 cada.', 'o limite é de 5.']], 'Médio'),
]
const cq = mkC('adq', 'dadm-1', 'ad-processo')
export const PROC_CARDS: Flashcard[] = [
  cq(1, 'Sequência de prazos do processo?', 'Provas em 3 dias; alegações finais em 7; relatório em 10; julgamento em 20; publicação em 8 dias.'),
  cq(2, 'Quantas testemunhas no processo?', 'Até 5 para o presidente e 5 para o acusado (art. 283).'),
  cq(3, 'Como é o recurso?', 'Um só, em 30 dias; a autoridade tem 10 dias para manter ou reformar; sem efeito suspensivo (arts. 312 a 314).'),
  cq(4, 'O que é o pedido de reconsideração?', 'Contra decisão do Governador em única instância; não renovável; 30 dias (art. 313).'),
  cq(5, 'Como é a revisão?', 'A qualquer tempo; fatos novos ou vícios insanáveis; ônus do requerente; não agrava a pena; por advogado (arts. 315 a 317).'),
  cq(6, 'Efeitos do tempo sem nova infração?', 'Após 5 anos de efetivo exercício, a sanção não pesa contra o servidor; demissão gera incompatibilidade de 5 anos e demissão a bem do serviço, de 10 (art. 307).'),
]

// ───────── 9. Improbidade I (arts. 1º a 3º, 9º, 10 e 11)
export const IMP1_LESSON: Lesson = {
  id: 'ad-improb1', topicId: 'dadm-2', title: 'Lei 8.429/92 (Lei 14.230/21): sujeitos, dolo e os atos dos arts. 9º, 10 e 11', questionIds: qids('aim'),
  steps: [
    step('Entenda', [
      'Sistema (art. 1º): protege a probidade na organização do Estado e no exercício de suas funções e a integridade do patrimônio público e social. Só são atos de improbidade as condutas dolosas tipificadas nos arts. 9º, 10 e 11. Dolo é a vontade livre e consciente de alcançar o resultado ilícito; a mera voluntariedade não basta. O mero exercício da função, sem prova de ato doloso com fim ilícito, afasta a improbidade. Aplicam-se os princípios do direito administrativo sancionador. Divergência interpretativa baseada em jurisprudência, mesmo não pacificada, não configura improbidade.',
      'Sujeitos (arts. 2º e 3º): agente público é o agente político, o servidor e quem exerce mandato, cargo, emprego ou função, ainda que transitoriamente ou sem remuneração. O particular que firma convênio, contrato de repasse, contrato de gestão, termo de parceria ou ajuste equivalente responde pelos recursos públicos recebidos. A lei alcança também quem, não sendo agente público, induz ou concorre dolosamente para o ato. Sócios, cotistas, diretores e colaboradores de pessoa jurídica privada respondem nos limites de sua participação, se comprovados participação e benefício direto. As sanções não se aplicam à pessoa jurídica quando o mesmo fato já for sancionado pela Lei 12.846/2013. O sucessor ou herdeiro responde apenas pela reparação, até o limite da herança ou do patrimônio recebido (art. 8º).',
      'Enriquecimento ilícito (art. 9º): auferir, mediante ato doloso, vantagem patrimonial indevida em razão do cargo, mandato, função, emprego ou atividade. Entre os exemplos: usar em obra ou serviço particular bem móvel ou o trabalho de servidores, empregados ou terceiros contratados; receber vantagem para fazer declaração falsa sobre dado técnico de obra ou serviço; adquirir bens com valor desproporcional à evolução patrimonial ou à renda, cabendo ao agente demonstrar a licitude da origem.',
      'Lesão ao erário (art. 10): ação ou omissão dolosa que cause, efetiva e comprovadamente, perda patrimonial, desvio, apropriação, malbaratamento ou dilapidação de bens ou haveres. Sem perda patrimonial efetiva, não há ressarcimento (§ 1º). A perda patrimonial decorrente da atividade econômica não é improbidade, salvo ato doloso com essa finalidade (§ 2º).',
      'Violação de princípios (art. 11): ação ou omissão dolosa que viole os deveres de honestidade, imparcialidade e legalidade, com um rol de condutas (por exemplo, revelar fato sigiloso, negar publicidade a atos oficiais, frustrar o caráter concorrencial de concurso, deixar de prestar contas para ocultar irregularidades, nomear cônjuge, companheiro ou parente até o terceiro grau para cargo de confiança, e fazer publicidade que enalteça agente público). Exige-se a finalidade de obter proveito ou benefício indevido (§ 1º), demonstração objetiva da ilegalidade (§ 3º) e lesividade relevante ao bem jurídico (§ 4º).',
      AVISO],
      'Só dolo (fim das modalidades culposas); art. 9º: enriquecimento; art. 10: perda patrimonial efetiva; art. 11: princípios, com finalidade de proveito indevido e lesividade relevante.'),
    step('Exemplo prático', [
      'Caso 1 — gestor adquire bens incompatíveis com a renda: art. 9º, VII; cabe a ele demonstrar a licitude.',
      'Caso 2 — ato culposo que causa prejuízo ao erário: não é mais improbidade, que exige dolo.',
      'Caso 3 — nomeação de parente até o terceiro grau para cargo de confiança: art. 11, XI.',
      'Caso 4 — ilegalidade sem dolo: não configura improbidade (art. 17-C, § 1º).'],
      'Pergunta-teste: dano presumido gera improbidade do art. 10? Não, a perda deve ser efetiva e comprovada.'),
    step('Resumo essencial', ['Tipos.'], undefined, { caption: 'Atos de improbidade', head: ['Art.', 'Tipo', 'Núcleo'], rows: [
      ['9º', 'Enriquecimento ilícito', 'Vantagem patrimonial indevida em razão do cargo, por ato doloso'],
      ['10', 'Lesão ao erário', 'Perda patrimonial efetiva e comprovada, dolosa'],
      ['11', 'Violação de princípios', 'Honestidade, imparcialidade e legalidade; proveito indevido e lesividade relevante'],
      ['2º', 'Agente público', 'Político, servidor e quem exerce função, mesmo sem remuneração'],
      ['3º', 'Terceiro', 'Quem induz ou concorre dolosamente; sócios só com benefício direto comprovado']] }),
    step('O que memorizar', ['• Dolo é requisito de todos os tipos.', '• Art. 10 exige perda patrimonial efetiva.', '• Art. 11 tem rol de condutas; exige proveito indevido e lesividade relevante.', '• Herdeiro responde até o limite da herança.'] ),
  ],
}
const m = mkW('aim', 'dadm-2')
export const IMP1_QUESTIONS: Question[] = [
  m(1, 'Após a Lei 14.230/2021, os atos de improbidade administrativa tipificados nos arts. 9º, 10 e 11 da Lei 8.429/92', ['exigem conduta dolosa.', 'Art. 1º, § 1º.'], [['admitem modalidade culposa apenas no art. 10.', 'a modalidade culposa foi suprimida.'], ['admitem modalidade culposa apenas no art. 11.', 'todos exigem dolo.'], ['dispensam o dolo quando há prejuízo ao erário.', 'todos exigem dolo.'], ['admitem responsabilidade objetiva.', 'todos exigem dolo.']], 'Fácil'),
  m(2, 'Segundo o art. 1º, § 2º, da Lei 8.429/92, dolo é', ['a vontade livre e consciente de alcançar o resultado ilícito tipificado, não bastando a voluntariedade do agente.', 'Art. 1º, § 2º.'], [['a mera voluntariedade do agente.', 'a lei diz que a mera voluntariedade não basta.'], ['a negligência na gestão de recursos.', 'isso seria culpa.'], ['a violação de qualquer norma legal.', 'o dolo exige vontade de alcançar o resultado ilícito.'], ['o descumprimento de orientação de órgão de controle.', 'não se confunde com dolo.']], 'Médio'),
  m(3, 'A lesão ao erário prevista no art. 10 da Lei 8.429/92 exige', ['perda patrimonial efetiva e comprovada, decorrente de ação ou omissão dolosa.', 'Art. 10, caput.'], [['apenas a presunção de prejuízo.', 'o dano deve ser efetivo e comprovado.'], ['somente a violação de princípios.', 'isso é o art. 11.'], ['enriquecimento do agente.', 'isso é o art. 9º.'], ['conduta culposa grave.', 'a lei exige dolo.']], 'Médio'),
  m(4, 'Segundo a nova redação do art. 9º, VII, adquirir bens de valor desproporcional à evolução patrimonial ou à renda', ['configura improbidade, cabendo ao agente demonstrar a licitude da origem dos bens.', 'Art. 9º, VII.'], [['só configura se o MP provar a origem ilícita.', 'o ônus de demonstrar a licitude é do agente.'], ['é causa de lesão ao erário (art. 10).', 'trata-se de enriquecimento ilícito.'], ['é violação de princípios (art. 11).', 'trata-se de enriquecimento ilícito.'], ['não configura improbidade.', 'configura enriquecimento ilícito.']], 'Difícil'),
  m(5, 'Quanto ao sucessor ou herdeiro de quem praticou ato de improbidade, a lei prevê que ele', ['responde apenas pela reparação do dano, até o limite do valor da herança ou do patrimônio transferido.', 'Art. 8º.'], [['responde pelas sanções pessoais.', 'só responde pela reparação.'], ['responde ilimitadamente.', 'o limite é o da herança ou patrimônio recebido.'], ['não responde por nada.', 'responde pela reparação, nos limites.'], ['responde pela perda da função pública.', 'sanções pessoais não se transmitem.']], 'Difícil'),
]
const cm = mkC('aim', 'dadm-2', 'ad-improb1')
export const IMP1_CARDS: Flashcard[] = [
  cm(1, 'O que é preciso para haver improbidade?', 'Conduta dolosa tipificada nos arts. 9º, 10 ou 11 (art. 1º, § 1º); o dolo é a vontade livre e consciente de alcançar o resultado ilícito.'),
  cm(2, 'Quem é agente público (art. 2º)?', 'Agente político, servidor e quem exerce mandato, cargo, emprego ou função, ainda que transitoriamente ou sem remuneração.'),
  cm(3, 'E o particular?', 'Responde quem induz ou concorre dolosamente; sócios e dirigentes só nos limites da participação e do benefício direto comprovado (art. 3º).'),
  cm(4, 'O que é o art. 9º?', 'Enriquecimento ilícito: vantagem patrimonial indevida em razão do cargo, por ato doloso.'),
  cm(5, 'O que é o art. 10?', 'Lesão ao erário: perda patrimonial efetiva e comprovada por ação ou omissão dolosa; sem perda efetiva, não há ressarcimento.'),
  cm(6, 'Como é o art. 11?', 'Violação de princípios com rol de condutas; exige finalidade de proveito indevido, demonstração objetiva da ilegalidade e lesividade relevante.'),
]

// ───────── 10. Improbidade II (sanções, indisponibilidade, ação, acordo e prescrição)
export const IMP2_LESSON: Lesson = {
  id: 'ad-improb2', topicId: 'dadm-2', title: 'Lei 8.429/92: sanções (art. 12), indisponibilidade, ação, acordo e prescrição', questionIds: qids('aij'),
  steps: [
    step('Entenda', [
      'Sanções (art. 12): independem do ressarcimento integral e de sanções penais, civis e administrativas, e podem ser aplicadas isolada ou cumulativamente. Art. 9º: perda dos bens acrescidos ilicitamente, perda da função pública, suspensão dos direitos políticos por até 14 anos, multa civil igual ao acréscimo e proibição de contratar com o poder público ou receber benefícios por até 14 anos. Art. 10: perda dos bens acrescidos (se houver), perda da função, suspensão dos direitos políticos por até 12 anos, multa civil igual ao valor do dano e proibição de contratar por até 12 anos. Art. 11: multa civil de até 24 vezes o valor da remuneração do agente e proibição de contratar por até 4 anos (não há suspensão dos direitos políticos nem perda da função). A perda da função atinge só o vínculo de mesma natureza (§ 1º); a multa pode ser dobrada se ineficaz (§ 2º); em atos de menor ofensa, aplica-se só multa (§ 5º); a sanção só é executada após o trânsito em julgado (§ 9º).',
      'Indisponibilidade de bens (art. 16): pode ser pedida em caráter antecedente ou incidental, para garantir o ressarcimento ou o acréscimo ilícito, e exige perigo de dano irreparável ou risco ao resultado útil e convicção de probabilidade, com oitiva do réu em 5 dias; não alcança até 40 salários mínimos em poupança, aplicações ou conta-corrente nem o bem de família, salvo se fruto de vantagem indevida (art. 9º).',
      'Ação (art. 17): segue o procedimento comum do CPC; a inicial deve individualizar a conduta e apontar indícios do fato e do dolo; os réus têm 30 dias para contestar; para cada ato, a inicial indica apenas um tipo dos arts. 9º, 10 e 11; é nula a decisão que condene por tipo diverso do da inicial; não se aplicam revelia com presunção de veracidade, inversão do ônus da prova nem reexame necessário (sentença, art. 17-C, § 3º). A ação é repressiva e sancionatória, de caráter pessoal, não sendo ação civil pública (art. 17-D). O texto da Lei 14.230 atribuiu a ação ao Ministério Público; o STF reconheceu legitimidade concorrente dos entes públicos (ADIs 7042 e 7043, a confirmar).',
      'Acordo de não persecução civil (art. 17-B): o MP pode celebrá-lo, assegurado, no mínimo, o integral ressarcimento e a reversão da vantagem indevida; exige oitiva do ente lesado, aprovação em até 60 dias pelo órgão revisor do MP, se anterior à ação, e homologação judicial; descumprindo, fica impedido de novo acordo por 5 anos.',
      'Prescrição (art. 23): a ação prescreve em 8 anos, contados do fato ou, nas infrações permanentes, do dia em que cessou a permanência. O inquérito civil ou processo administrativo suspende o prazo por no máximo 180 dias; o inquérito civil deve concluir-se em 365 dias, prorrogáveis uma vez por igual período; encerrado o prazo, a ação deve ser proposta em 30 dias. Interrompem a prescrição o ajuizamento da ação, a sentença condenatória e acórdãos confirmatórios da condenação ou reformadores da improcedência; após a interrupção, o prazo recomeça pela metade (4 anos). A prescrição intercorrente ocorre se, entre dois marcos interruptivos, transcorrer esse prazo de 4 anos (§ 8º). Art. 23-B: nas ações e acordos não há adiantamento de custas; na improcedência, só há honorários se comprovada a má-fé.',
      AVISO],
      'Art. 9º: 14 anos; art. 10: 12 anos; art. 11: 4 anos e multa de até 24 remunerações. Prescrição: 8 anos, recomeço pela metade (4). Contestação: 30 dias. Acordo: 60 dias; 5 anos de impedimento.'),
    step('Exemplo prático', [
      'Caso 1 — enriquecimento ilícito: suspensão dos direitos políticos por até 14 anos e multa igual ao acréscimo.',
      'Caso 2 — violação de princípios (art. 11): multa de até 24 vezes a remuneração; sem suspensão de direitos políticos.',
      'Caso 3 — a ação é ajuizada, interrompendo a prescrição: o prazo recomeça pela metade, 4 anos.',
      'Caso 4 — inicial pede condenação por art. 9º, 10 e 11 pelo mesmo ato: deve indicar um só tipo (art. 17, § 10-D).'],
      'Pergunta-teste: sanção executada quando? Após o trânsito em julgado.'),
    step('Resumo essencial', ['Sanções e prazos.'], undefined, { caption: 'Improbidade: sanções e prazos', head: ['Item', 'Regra', 'Art.'], rows: [
      ['Art. 9º', 'Direitos políticos até 14 anos; proibição de contratar até 14 anos; multa igual ao acréscimo', '12, I'],
      ['Art. 10', 'Direitos políticos até 12 anos; proibição até 12 anos; multa igual ao dano', '12, II'],
      ['Art. 11', 'Multa até 24 vezes a remuneração; proibição até 4 anos', '12, III'],
      ['Execução', 'Após o trânsito em julgado', '12, § 9º'],
      ['Contestação', '30 dias', '17, § 7º'],
      ['ANPC', 'Aprovação do órgão revisor em 60 dias; impedimento de 5 anos se descumprido', '17-B'],
      ['Prescrição', '8 anos; interrupção recomeça pela metade', '23'],
      ['Inquérito civil', '365 dias, prorrogável uma vez', '23, § 2º']] }),
    step('O que memorizar', ['• 14, 12 e 4 anos.', '• 8 anos de prescrição; 4 após interrupção.', '• Sem reexame necessário, sem revelia presumida.', '• Um só tipo por ato na inicial.'] ),
  ],
}
const j = mkW('aij', 'dadm-2')
export const IMP2_QUESTIONS: Question[] = [
  j(1, 'Pela prática de ato de improbidade que importe enriquecimento ilícito (art. 9º), a suspensão dos direitos políticos pode chegar a', ['14 anos.', 'Art. 12, I.'], [['4 anos.', 'a suspensão dos direitos políticos no art. 9º vai a 14 anos.'], ['8 anos.', 'a suspensão no art. 9º vai a 14 anos.'], ['12 anos.', '12 anos é o limite do art. 10.'], ['20 anos.', 'o limite é de 14 anos.']], 'Médio'),
  j(2, 'A multa civil pela violação de princípios da administração (art. 11) é de até', ['24 vezes o valor da remuneração percebida pelo agente.', 'Art. 12, III.'], [['3 vezes o valor do dano.', 'a multa do art. 11 é de até 24 remunerações.'], ['igual ao valor do dano.', 'essa é a multa do art. 10.'], ['igual ao acréscimo patrimonial.', 'essa é a multa do art. 9º.'], ['100 salários mínimos.', 'a multa do art. 11 é de até 24 remunerações.']], 'Médio'),
  j(3, 'Segundo o art. 23 da Lei 8.429/92, a ação para a aplicação das sanções prescreve em', ['8 anos, contados do fato ou, nas infrações permanentes, do dia em que cessou a permanência.', 'Art. 23, caput.'], [['5 anos, contados da data da decisão.', 'a prescrição é de 8 anos.'], ['10 anos, contados da ciência do fato.', 'a prescrição é de 8 anos.'], ['4 anos, contados do fato.', 'a prescrição é de 8 anos; 4 anos é o prazo após a interrupção.'], ['2 anos, contados da instauração do inquérito.', 'a prescrição é de 8 anos.']], 'Médio'),
  j(4, 'Interrompida a prescrição, o prazo recomeça', ['pela metade, ou seja, 4 anos.', 'Art. 23, § 5º.'], [['por inteiro, 8 anos.', 'recomeça pela metade.'], ['por 2 anos.', 'recomeça pela metade, 4 anos.'], ['por 1 ano.', 'recomeça pela metade, 4 anos.'], ['não recomeça.', 'recomeça pela metade.']], 'Difícil'),
  j(5, 'Na ação de improbidade administrativa, os réus são citados para contestar no prazo de', ['30 dias.', 'Art. 17, § 7º.'], [['5 dias.', 'o prazo é de 30 dias.'], ['10 dias.', 'o prazo é de 30 dias.'], ['15 dias.', 'o prazo é de 30 dias.'], ['60 dias.', 'o prazo é de 30 dias.']], 'Médio'),
]
const cj = mkC('aij', 'dadm-2', 'ad-improb2')
export const IMP2_CARDS: Flashcard[] = [
  cj(1, 'Sanções do art. 9º?', 'Perda dos bens acrescidos e da função; direitos políticos até 14 anos; multa igual ao acréscimo; proibição de contratar até 14 anos.'),
  cj(2, 'Sanções do art. 10?', 'Perda dos bens (se houver) e da função; direitos políticos até 12 anos; multa igual ao dano; proibição até 12 anos.'),
  cj(3, 'Sanções do art. 11?', 'Multa de até 24 vezes a remuneração e proibição de contratar por até 4 anos.'),
  cj(4, 'Prazos da ação?', 'Contestação em 30 dias; prescrição em 8 anos; recomeço pela metade (4 anos) após interrupção (arts. 17 e 23).'),
  cj(5, 'O que o ANPC exige?', 'Ressarcimento integral e reversão da vantagem; oitiva do ente lesado; aprovação em 60 dias pelo órgão revisor; homologação; impedimento de 5 anos se descumprido (art. 17-B).'),
  cj(6, 'O que não se aplica à ação?', 'Revelia com presunção de veracidade, inversão do ônus da prova e reexame necessário (art. 17, § 19, e 17-C, § 3º).'),
]

export const DADM_LESSONS = [...DADM_A_LESSONS, PENA_LESSON, APU_LESSON, PROC_LESSON, IMP1_LESSON, IMP2_LESSON]
export const DADM_QUESTIONS = spread([...DADM_A_QUESTIONS, ...PENA_QUESTIONS, ...APU_QUESTIONS, ...PROC_QUESTIONS, ...IMP1_QUESTIONS, ...IMP2_QUESTIONS], 2)
export const DADM_CARDS = [...DADM_A_CARDS, ...PENA_CARDS, ...APU_CARDS, ...PROC_CARDS, ...IMP1_CARDS, ...IMP2_CARDS]
