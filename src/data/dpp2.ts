import type { Flashcard, Lesson, Question } from '../types'
import { mkW, mkC, spread, step, qids } from './helpers'
import { JUIZ_LESSON, JUIZ_QUESTIONS, JUIZ_CARDS, CIT_LESSON, CIT_QUESTIONS, CIT_CARDS, COM_LESSON, COM_QUESTIONS, COM_CARDS, JURI1_LESSON, JURI1_QUESTIONS, JURI1_CARDS, JURI2_LESSON, JURI2_QUESTIONS, JURI2_CARDS } from './dpp'
// Direito Processual Penal, parte 2: recursos (arts. 574–667) e Lei 9.099/1995 (arts. 60–83, 88, 89).
// Fonte: páginas secundárias (projuris.com.br, jus.com.br), lidas em 04/11/2026. Os arts. 62–73 e 77–83 da Lei 9.099 foram escritos de memória (sem conferência em fonte aberta nesta sessão): confirme no Planalto.
const AVISO = 'Aviso: texto em paráfrase próxima, conferido em fontes secundárias (o Planalto não abre para acesso automatizado). Antes da prova, confirme a redação vigente em planalto.gov.br.'

// ───────── 6. Recursos em geral e RESE
export const REC1_LESSON: Lesson = {
  id: 'pp-rec1', topicId: 'dpp-1', title: 'CPP arts. 574 a 592: recursos em geral e recurso em sentido estrito', questionIds: qids('ppr'),
  steps: [
    step('Entenda', [
      'Recursos em geral (arts. 574 a 580): em regra, são voluntários, isto é, dependem de interposição pela parte; o juiz deve recorrer de ofício da sentença que conceder habeas corpus (art. 574, I). Art. 575: não serão prejudicados os recursos que deixarem de ser interpostos, ou que o forem fora do prazo, por erro, falta ou omissão dos funcionários da justiça. Art. 576: o Ministério Público não poderá desistir de recurso que haja interposto. Art. 577: podem recorrer o MP, o querelante e o réu, este por si, por procurador ou por defensor; não se admitirá recurso da parte que não tiver interesse na reforma ou modificação da decisão. Art. 578: o recurso será interposto por petição ou por termo nos autos. Art. 579: salvo a hipótese de má-fé, a parte não será prejudicada pela interposição de um recurso por outro (fungibilidade); se o juiz, desde logo, reconhecer a impropriedade, mandará processá-lo de acordo com o rito do recurso cabível. Art. 580: no concurso de agentes, a decisão do recurso interposto por um dos réus, se fundado em motivos que não sejam de caráter exclusivamente pessoal, aproveitará aos outros.',
      'Recurso em sentido estrito (RESE) — cabimento (art. 581): rejeição da denúncia ou queixa (I); incompetência do juízo (II); procedência de exceções, salvo a de suspeição (III); pronúncia (IV); decisões sobre fiança, prisão preventiva, liberdade provisória e relaxamento de flagrante (V); quebra da fiança (VII); prescrição ou outra causa extintiva da punibilidade (VIII); indeferimento do pedido de reconhecimento da prescrição (IX); concessão ou negativa de habeas corpus (X); suspensão condicional da pena (XI); livramento condicional (XII); anulação da instrução criminal (XIII); inclusão ou exclusão de jurado na lista geral (XIV); denegação de apelação ou julgamento de deserção (XV); suspensão do processo por questão prejudicial (XVI); unificação de penas (XVII); incidente de falsidade (XVIII); medidas de segurança (XIX a XXIII); conversão da multa em detenção ou prisão simples (XXIV); recusa de homologação do acordo de não persecução penal (XXV).',
      'Processamento: o RESE sobe para o tribunal de apelação (art. 582), salvo os casos dos incisos V, X e XIV. Prazo de interposição: 5 dias (art. 586); no caso de inclusão ou exclusão de jurado, 20 dias, contados da publicação definitiva da lista de jurados (art. 586, parágrafo único). Após a interposição, o recorrente tem 2 dias para apresentar razões e o recorrido, 2 dias para contrarrazões (art. 588). Juízo de retratação: o juiz, no prazo de 2 dias, mantém ou reforma a decisão (art. 589). O RESE contra a pronúncia suspende somente o julgamento (art. 584, § 2º). Atenção: o art. 585 (réu só recorre da pronúncia depois de preso), que ainda aparece em páginas desatualizadas, foi revogado em 2008 (Lei 11.689) — confirme no Planalto.',
      AVISO],
      'RESE = rol TAXATIVO, mas a jurisprudência admite interpretação extensiva. Prazo: 5 dias. Razões: 2 dias. Retratação: 2 dias. Art. 579: fungibilidade, salvo má-fé.'),
    step('Exemplo prático', [
      'Caso 1 — o juiz rejeita a denúncia: RESE em 5 dias (art. 581, I).',
      'Caso 2 — o juiz indefere pedido de liberdade provisória ou decide sobre prisão preventiva: RESE (art. 581, V).',
      'Caso 3 — a parte interpõe apelação quando cabia RESE, sem má-fé: o recurso deve ser processado pelo rito do cabível (art. 579).',
      'Caso 4 — o MP interpõe recurso e depois quer desistir: não pode (art. 576).',
      'Caso 5 — um corréu obtém provimento por motivo não pessoal: o benefício aproveita aos demais (art. 580).'],
      'Pergunta-teste: "o rol do art. 581 contém a hipótese?" Sim: RESE. Não, e a decisão é definitiva: em regra, apelação.'),
    step('Resumo essencial', ['Prazos do RESE.'], undefined, { caption: 'RESE', head: ['Ato', 'Prazo', 'Art.'], rows: [
      ['Interposição', '5 dias', '586'],
      ['Interposição (lista de jurados)', '20 dias', '586, p. único'],
      ['Razões e contrarrazões', '2 dias cada', '588'],
      ['Juízo de retratação', '2 dias', '589'],
      ['Remessa ao tribunal', '5 dias', '591']] }),
    step('O que memorizar', ['• Art. 574, I: recurso de ofício da sentença concessiva de HC.', '• Art. 576: MP não desiste de recurso.', '• Art. 579: fungibilidade, salvo má-fé.', '• RESE: 5 dias; razões 2 dias; retratação 2 dias; jurados 20 dias.', '• Pronúncia, rejeição da denúncia, preventiva, prescrição: RESE.'] ),
  ],
}
const r = mkW('ppr', 'dpp-1')
export const REC1_QUESTIONS: Question[] = [
  r(1, 'O prazo para a interposição do recurso em sentido estrito, em regra, é de', ['5 dias.', 'Art. 586, caput.'], [['2 dias.', 'é o prazo para razões e contrarrazões do RESE.'], ['10 dias.', 'não é o prazo do RESE.'], ['15 dias.', 'é o prazo da apelação supletiva.'], ['20 dias.', 'este é o prazo do RESE contra a lista de jurados.']], 'Fácil'),
  r(2, 'Contra a decisão que recebe ou rejeita a denúncia, a espécie recursal cabível para a hipótese de rejeição é', ['o recurso em sentido estrito.', 'Art. 581, I.'], [['a apelação.', 'a apelação é para sentenças definitivas.'], ['os embargos infringentes.', 'não é a hipótese.'], ['a carta testemunhável.', 'só quando se nega seguimento a recurso.'], ['a revisão criminal.', 'a revisão só cabe contra decisões transitadas.']], 'Fácil'),
  r(3, 'Segundo o art. 579 do CPP, salvo a hipótese de má-fé, a parte', ['não será prejudicada pela interposição de um recurso por outro.', 'Princípio da fungibilidade.'], [['perderá o prazo se errar o recurso.', 'o artigo preserva a parte.'], ['sempre será multada.', 'não há multa.'], ['terá o recurso inadmitido.', 'o juiz o processa pelo rito cabível.'], ['só poderá recorrer após o trânsito em julgado.', 'não é o conteúdo do artigo.']], 'Médio'),
  r(4, 'Quanto ao Ministério Público, o art. 576 do CPP dispõe que ele', ['não poderá desistir de recurso que haja interposto.', 'Art. 576.'], [['pode desistir a qualquer tempo.', 'a lei veda a desistência.'], ['só pode desistir com autorização do juiz.', 'a lei veda a desistência.'], ['não tem legitimidade recursal.', 'o MP é legitimado (art. 577).'], ['depende do réu para recorrer.', 'o MP é legitimado.']], 'Médio'),
  r(5, 'O recorrente, no RESE, tem para apresentar as razões o prazo de', ['2 dias.', 'Art. 588.'], [['5 dias.', 'é o prazo de interposição.'], ['8 dias.', 'é o prazo das razões da apelação (art. 600).'], ['10 dias.', 'não é o prazo do art. 588.'], ['15 dias.', 'não é o prazo do art. 588.']], 'Médio'),
]
const cr = mkC('ppr', 'dpp-1', 'pp-rec1')
export const REC1_CARDS: Flashcard[] = [
  cr(1, 'Quando o juiz recorre de ofício (art. 574, I)?', 'Da sentença que concede habeas corpus.'),
  cr(2, 'O que prevê o art. 579?', 'Fungibilidade: a parte não é prejudicada por interpor um recurso por outro, salvo má-fé.'),
  cr(3, 'Prazos do RESE?', 'Interposição: 5 dias (20 dias para lista de jurados). Razões e contrarrazões: 2 dias cada. Retratação: 2 dias.'),
  cr(4, 'Cite quatro hipóteses de RESE.', 'Rejeição da denúncia, incompetência, pronúncia, prisão preventiva/fiança, prescrição, HC (art. 581).'),
  cr(5, 'O MP pode desistir de recurso?', 'Não (art. 576).'),
  cr(6, 'O que dispõe o art. 580?', 'No concurso de agentes, o recurso de um réu, se fundado em motivos não exclusivamente pessoais, aproveita aos demais.'),
]

// ───────── 7. Apelação e embargos
export const REC2_LESSON: Lesson = {
  id: 'pp-rec2', topicId: 'dpp-1', title: 'CPP arts. 593 a 620: apelação, julgamento nos tribunais, embargos infringentes e de declaração', questionIds: qids('ppa'),
  steps: [
    step('Entenda', [
      'Apelação — cabimento (art. 593), no prazo de 5 dias: das sentenças definitivas de condenação ou absolvição proferidas por juiz singular (I); das decisões definitivas, ou com força de definitivas, proferidas por juiz singular nos casos não previstos no capítulo do RESE (II); das decisões do Tribunal do Júri (III), quando: (a) ocorrer nulidade posterior à pronúncia; (b) for a sentença do juiz-presidente contrária à lei expressa ou à decisão dos jurados; (c) houver erro ou injustiça no tocante à aplicação da pena ou medida de segurança; (d) for a decisão dos jurados manifestamente contrária à prova dos autos. Se provido o recurso fundado na letra "d", o réu será submetido a novo julgamento, não se admitindo, pelo mesmo motivo, segunda apelação (§ 3º). Art. 593, § 4º: quando cabível a apelação, não poderá ser usado o RESE, ainda que se recorra somente de parte da decisão.',
      'Efeitos (arts. 596 e 597): a apelação da sentença absolutória não impede que o réu seja posto em liberdade; a apelação de sentença condenatória tem efeito suspensivo, com as exceções legais. Apelação supletiva (art. 598): se o MP não apelar no prazo, o ofendido ou as pessoas do art. 31 poderão fazê-lo, ainda que não habilitados como assistente, no prazo de 15 dias, contados do dia em que terminar o prazo do MP.',
      'Razões (art. 600): terminado o prazo de interposição, o apelante e, depois dele, o apelado terão 8 dias cada um para oferecer razões (3 dias, nas contravenções); o assistente arrazoa em 3 dias após o MP. Os autos sobem em 5 dias, com ou sem razões (art. 601). Julgamento nos tribunais: o prazo de embargos infringentes e de nulidade é de 10 dias, contados da publicação do acórdão, quando não unânime a decisão de segunda instância desfavorável ao réu (art. 609, parágrafo único). Nos crimes punidos com reclusão, após o relatório os autos vão ao revisor, e todos os prazos do art. 610 são dobrados, com 15 minutos para sustentação oral (art. 613). Empate: prevalece a decisão mais favorável ao réu, se o presidente não tiver votado (art. 615, § 1º). Art. 617: o tribunal, câmara ou turma atenderá, nos julgamentos, ao disposto nos arts. 383, 386 e 387; não poderá, porém, ser agravada a pena quando somente o réu houver apelado da sentença (vedação à reformatio in pejus).',
      'Embargos de declaração (arts. 619 e 620): cabem em caso de ambiguidade, obscuridade, contradição ou omissão, no prazo de 2 dias contados da publicação do acórdão, com indicação do ponto. Protesto por novo júri (arts. 607 e 608): revogado pela Lei 11.689/2008, assim como os arts. 594 e 595 (prisão para apelar) e 604 a 606.',
      AVISO],
      'Prazos: apelação 5 dias; razões 8 dias (contravenção 3); subida 5 dias; embargos infringentes 10 dias; embargos de declaração 2 dias; apelação supletiva 15 dias.'),
    step('Exemplo prático', [
      'Caso 1 — sentença condenatória de juiz singular: apelação em 5 dias (art. 593, I); razões em 8 dias.',
      'Caso 2 — decisão dos jurados manifestamente contrária à prova dos autos: apelação (III, "d"); provida, novo julgamento, sem segunda apelação pelo mesmo motivo.',
      'Caso 3 — o MP não apela; a vítima, não habilitada, apela dentro de 15 dias do fim do prazo do MP (art. 598).',
      'Caso 4 — acórdão condenatório não unânime: embargos infringentes e de nulidade em 10 dias (art. 609, p. único).',
      'Caso 5 — só o réu apelou: o tribunal não pode agravar a pena (art. 617).'],
      'Pergunta-teste: "juiz singular, decisão definitiva?" Apelação em 5 dias. "Acórdão não unânime contra o réu?" Infringentes em 10 dias.'),
    step('Resumo essencial', ['Prazos.'], undefined, { caption: 'Apelação e embargos', head: ['Ato', 'Prazo', 'Art.'], rows: [
      ['Apelação', '5 dias', '593'],
      ['Razões (e contrarrazões)', '8 dias cada (3 dias nas contravenções)', '600'],
      ['Razões do assistente', '3 dias', '600, § 1º'],
      ['Subida dos autos', '5 dias', '601'],
      ['Apelação supletiva', '15 dias', '598, p. único'],
      ['Embargos infringentes e de nulidade', '10 dias', '609, p. único'],
      ['Embargos de declaração', '2 dias', '619']] }),
    step('O que memorizar', ['• Apelação: 5 dias; razões: 8 dias.', '• Júri (III): a) nulidade posterior à pronúncia; b) sentença contrária à lei ou aos jurados; c) erro ou injustiça na pena; d) decisão manifestamente contrária à prova.', '• Art. 593, § 4º: cabendo apelação, não cabe RESE.', '• Art. 617: sem reformatio in pejus.', '• Protesto por novo júri: revogado.'] ),
  ],
}
const a = mkW('ppa', 'dpp-1')
export const REC2_QUESTIONS: Question[] = [
  a(1, 'O prazo para a interposição da apelação criminal, nos termos do art. 593 do CPP, é de', ['5 dias.', 'Art. 593, caput.'], [['2 dias.', 'é o prazo dos embargos de declaração.'], ['8 dias.', 'é o prazo das razões (art. 600).'], ['10 dias.', 'é o prazo dos embargos infringentes e de nulidade.'], ['15 dias.', 'é o prazo da apelação supletiva.']], 'Fácil'),
  a(2, 'Das decisões do Tribunal do Júri cabe apelação, entre outras hipóteses, quando', ['a decisão dos jurados for manifestamente contrária à prova dos autos.', 'Art. 593, III, "d".'], [['o réu discordar da pena mínima legal.', 'não é hipótese do art. 593, III.'], ['a defesa preferir novo julgamento sem fundamento.', 'a lei exige hipótese tipificada.'], ['a vítima não comparecer.', 'não é hipótese legal.'], ['o juiz-presidente estiver ausente.', 'não é hipótese legal.']], 'Médio'),
  a(3, 'Provida a apelação com base na decisão manifestamente contrária à prova dos autos, o réu', ['será submetido a novo julgamento, não se admitindo segunda apelação pelo mesmo motivo.', 'Art. 593, § 3º.'], [['será absolvido pelo tribunal.', 'o tribunal determina novo julgamento pelo júri.'], ['terá a pena reduzida pelo tribunal.', 'isso ocorre na hipótese da letra "c".'], ['ficará preso até o trânsito em julgado.', 'não é o conteúdo do parágrafo.'], ['poderá apelar novamente pelo mesmo motivo.', 'a lei veda a segunda apelação.']], 'Médio'),
  a(4, 'Os embargos infringentes e de nulidade, quando não unânime a decisão de segunda instância desfavorável ao réu, devem ser opostos no prazo de', ['10 dias, contados da publicação do acórdão.', 'Art. 609, parágrafo único.'], [['2 dias.', 'este é o prazo dos embargos de declaração.'], ['5 dias.', 'é o prazo da apelação.'], ['15 dias.', 'não é o prazo do artigo.'], ['30 dias.', 'não é o prazo do artigo.']], 'Médio'),
  a(5, 'Se somente o réu houver apelado da sentença, o tribunal', ['não poderá agravar a pena.', 'Art. 617: vedação da reformatio in pejus.'], [['poderá aumentar a pena de ofício.', 'a lei veda.'], ['deverá converter em preventiva.', 'não é o conteúdo do artigo.'], ['deverá intimar o MP para aditar a denúncia.', 'não é consequência do artigo.'], ['julgará extinta a punibilidade.', 'não é consequência.']], 'Fácil'),
]
const ca = mkC('ppa', 'dpp-1', 'pp-rec2')
export const REC2_CARDS: Flashcard[] = [
  ca(1, 'Qual o prazo da apelação e das razões?', 'Apelação: 5 dias. Razões: 8 dias para apelante e depois apelado (3 dias nas contravenções).'),
  ca(2, 'Quais as hipóteses de apelação contra o júri (III)?', 'a) nulidade posterior à pronúncia; b) sentença contrária à lei ou à decisão dos jurados; c) erro ou injustiça na pena/medida de segurança; d) decisão manifestamente contrária à prova.'),
  ca(3, 'O que é apelação supletiva?', 'Apelação do ofendido ou das pessoas do art. 31, mesmo sem habilitação, se o MP não apelar: prazo de 15 dias após o fim do prazo do MP (art. 598).'),
  ca(4, 'Quando cabem embargos infringentes e de nulidade?', 'Contra decisão não unânime de segunda instância desfavorável ao réu; prazo de 10 dias (art. 609, p. único).'),
  ca(5, 'Prazo e hipóteses dos embargos de declaração?', '2 dias; ambiguidade, obscuridade, contradição ou omissão (art. 619).'),
  ca(6, 'Que recurso foi revogado em 2008?', 'O protesto por novo júri (arts. 607 e 608), pela Lei 11.689/2008.'),
]

// ───────── 8. Revisão, RE, carta testemunhável e HC
export const REV_LESSON: Lesson = {
  id: 'pp-revisao', topicId: 'dpp-1', title: 'CPP arts. 621 a 667: revisão criminal, recurso extraordinário, carta testemunhável e habeas corpus', questionIds: qids('ppx'),
  steps: [
    step('Entenda', [
      'Revisão criminal (arts. 621 a 631): ação autônoma que cabe quando (I) a sentença condenatória for contrária ao texto expresso da lei penal ou à evidência dos autos; (II) se fundar em depoimentos, exames ou documentos comprovadamente falsos; (III) após a sentença, se descobrirem novas provas de inocência do condenado ou de circunstância que determine ou autorize diminuição especial da pena. Pode ser pedida a qualquer tempo, antes da extinção da pena ou após (art. 622); podem pedi-la o próprio réu ou procurador legalmente habilitado ou, no caso de morte, o cônjuge, ascendente, descendente ou irmão (art. 623). O tribunal poderá alterar a classificação da infração, absolver o réu, modificar a pena ou anular o processo, mas não poderá agravar a pena imposta pela decisão revista (art. 626). Reconhecido o erro, pode ser fixada indenização, a ser liquidada no juízo cível, devida pela União ou pelo Estado (art. 630); não é devida se o erro ou injustiça derivou de ato ou falta do próprio impetrante (como confissão ou ocultação de prova) ou se a acusação fosse exclusivamente privada.',
      'Recurso extraordinário: os arts. 632 a 636 foram revogados; o recurso extraordinário não suspende a execução da decisão (art. 637), e o RE e o REsp são processados e julgados pelo STF e pelo STJ conforme as leis especiais, o CPC e os regimentos internos (art. 638). Carta testemunhável (arts. 639 a 646): cabe quando o juiz denegar o recurso ou, admitindo-o, obstar a sua expedição e seguimento para o juízo ad quem; a parte requer ao escrivão ou secretário, no prazo de 48 horas, indicando as peças; o serventuário entrega a certidão no prazo de 5 dias (recurso em sentido estrito) ou 60 dias (recurso extraordinário); a carta não tem efeito suspensivo (art. 646).',
      'Habeas corpus (arts. 647 a 667): dar-se-á sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação ilegal na sua liberdade de ir e vir, salvo nos casos de punição disciplinar (art. 647). A coação considerar-se-á ilegal (art. 648): quando não houver justa causa; quando alguém estiver preso por mais tempo do que determina a lei; quando quem ordenar a coação não tiver competência; quando houver cessado o motivo que autorizou a coação; quando não for alguém admitido a prestar fiança, nos casos em que a lei a autoriza; quando o processo for manifestamente nulo; quando extinta a punibilidade. Qualquer pessoa pode impetrar habeas corpus em seu favor ou de outrem, bem como o Ministério Público (art. 654); o juiz ou tribunal pode concedê-lo de ofício (art. 654, § 2º). O juiz decide no prazo de 24 horas (art. 660). Se a ordem for concedida por nulidade do processo, este será renovado (art. 652).',
      AVISO],
      'Revisão criminal: só em favor do réu, a qualquer tempo, sem reformatio in pejus. HC: qualquer pessoa pode impetrar, inclusive de ofício pelo juiz. Carta testemunhável: 48 horas.'),
    step('Exemplo prático', [
      'Caso 1 — após o trânsito em julgado, surgem novas provas de inocência: revisão criminal (art. 621, III).',
      'Caso 2 — o condenado morreu: o cônjuge, ascendente, descendente ou irmão podem pedir a revisão (art. 623).',
      'Caso 3 — o juiz nega seguimento ao RESE: carta testemunhável em 48 horas (art. 640).',
      'Caso 4 — alguém está preso por prazo maior do que o legal: constrangimento ilegal (art. 648, II); cabe habeas corpus.',
      'Caso 5 — um amigo do preso impetra HC em seu favor, sem advogado: possível (art. 654).'],
      'Pergunta-teste: "a decisão já transitou e o objetivo é favorecer o condenado?" Revisão criminal. "Liberdade de locomoção?" Habeas corpus.'),
    step('Resumo essencial', ['Prazos e vedações.'], undefined, { caption: 'Revisão, carta testemunhável e HC', head: ['Instituto', 'Regra-chave', 'Art.'], rows: [
      ['Revisão criminal', 'A qualquer tempo; não agrava a pena', '622 e 626'],
      ['Legitimados na revisão', 'Réu, procurador ou, se morto, cônjuge, ascendente, descendente ou irmão', '623'],
      ['Carta testemunhável', '48 horas para requerer; sem efeito suspensivo', '640 e 646'],
      ['Habeas corpus', 'Qualquer pessoa impetra; decisão em 24 horas', '654 e 660'],
      ['Recurso extraordinário', 'Sem efeito suspensivo', '637']] }),
    step('O que memorizar', ['• Revisão: três hipóteses do art. 621; a qualquer tempo; vedada reformatio in pejus.', '• Carta testemunhável: 48 horas; 5 dias (RESE) ou 60 dias (RE) para a certidão.', '• HC: art. 648, hipóteses de coação ilegal; qualquer pessoa; 24 horas para decidir.'] ),
  ],
}
const x = mkW('ppx', 'dpp-1')
export const REV_QUESTIONS: Question[] = [
  x(1, 'A revisão criminal poderá ser requerida', ['em qualquer tempo, antes da extinção da pena ou após.', 'Art. 622.'], [['no prazo de 5 dias do trânsito em julgado.', 'não há prazo.'], ['somente antes do início do cumprimento da pena.', 'cabe também depois da extinção da pena.'], ['apenas enquanto o condenado estiver vivo.', 'após a morte, cônjuge, ascendente, descendente ou irmão podem pedir.'], ['no prazo de 2 anos.', 'não há prazo.']], 'Fácil'),
  x(2, 'Julgada procedente a revisão criminal, o tribunal', ['não poderá agravar a pena imposta pela decisão revista.', 'Art. 626, parágrafo único.'], [['poderá aumentar a pena se houver novas provas contra o réu.', 'a lei veda o agravamento.'], ['só poderá anular o processo.', 'poderá também absolver, alterar a classificação ou modificar a pena.'], ['deverá sempre determinar novo júri.', 'não é a consequência do artigo.'], ['apenas reconhecerá o direito a indenização.', 'a indenização é possível, mas não é a única consequência.']], 'Médio'),
  x(3, 'A parte pede a carta testemunhável ao escrivão, em regra, no prazo de', ['48 horas, contadas do despacho que denegar o recurso.', 'Art. 640.'], [['5 dias.', 'é o prazo de entrega da carta para o RESE.'], ['10 dias.', 'não é o prazo do artigo.'], ['60 dias.', 'é o prazo de entrega da carta para o recurso extraordinário.'], ['24 horas.', 'é o prazo para o juiz decidir o HC.']], 'Difícil'),
  x(4, 'Nos termos do art. 654 do CPP, o habeas corpus pode ser impetrado', ['por qualquer pessoa, em seu favor ou de outrem, bem como pelo Ministério Público.', 'Art. 654.'], [['somente por advogado.', 'a lei admite qualquer pessoa.'], ['somente pelo Ministério Público.', 'qualquer pessoa pode impetrar.'], ['somente pelo próprio paciente.', 'pode ser impetrado em favor de outrem.'], ['somente pela Defensoria Pública.', 'qualquer pessoa pode impetrar.']], 'Fácil'),
  x(5, 'O juiz deve decidir o habeas corpus, após as diligências e o interrogatório do paciente, em', ['24 horas.', 'Art. 660.'], [['48 horas.', 'é o prazo da carta testemunhável.'], ['5 dias.', 'não é o prazo do art. 660.'], ['10 dias.', 'não é o prazo do art. 660.'], ['30 dias.', 'não é o prazo do art. 660.']], 'Médio'),
]
const cx = mkC('ppx', 'dpp-1', 'pp-revisao')
export const REV_CARDS: Flashcard[] = [
  cx(1, 'Quais as hipóteses de revisão criminal (art. 621)?', 'Sentença contrária à lei expressa ou à evidência dos autos; fundada em provas falsas; novas provas de inocência ou circunstância que reduza a pena.'),
  cx(2, 'Quem pode pedir a revisão?', 'O réu, procurador legalmente habilitado ou, em caso de morte, cônjuge, ascendente, descendente ou irmão (art. 623).'),
  cx(3, 'A revisão pode piorar a situação do réu?', 'Não: a pena não pode ser agravada (art. 626).'),
  cx(4, 'Quando cabe a carta testemunhável e qual o prazo?', 'Quando se denega seguimento a recurso ou se obsta a subida; 48 horas para requerer (art. 640); sem efeito suspensivo.'),
  cx(5, 'Quais as hipóteses de coação ilegal (art. 648)?', 'Sem justa causa; preso por mais tempo que o legal; autoridade incompetente; motivo cessado; fiança negada; processo manifestamente nulo; punibilidade extinta.'),
  cx(6, 'Em quanto tempo o juiz decide o HC?', '24 horas (art. 660).'),
]

// ───────── 9. Lei 9.099/95: parte geral e fase preliminar
export const JC1_LESSON: Lesson = {
  id: 'pp-jecrim1', topicId: 'dpp-2', title: 'Lei 9.099/1995, arts. 60 a 76: Juizado Especial Criminal, composição civil e transação penal', questionIds: qids('pjc'),
  steps: [
    step('Entenda', [
      'Art. 60: o Juizado Especial Criminal, provido por juízes togados ou togados e leigos, tem competência para a conciliação, o julgamento e a execução das infrações penais de menor potencial ofensivo, respeitadas as regras de conexão e continência. Art. 61: consideram-se infrações penais de menor potencial ofensivo as contravenções penais e os crimes a que a lei comine pena máxima não superior a 2 anos, cumulada ou não com multa. Art. 62: o processo orientar-se-á pelos critérios da oralidade, informalidade, economia processual e celeridade, objetivando, sempre que possível, a reparação dos danos sofridos pela vítima e a aplicação de pena não privativa de liberdade. Art. 63: a competência do Juizado será determinada pelo lugar em que foi praticada a infração penal.',
      'Art. 66: a citação será pessoal e far-se-á no próprio Juizado, sempre que possível, ou por mandado. Parágrafo único: não encontrado o acusado para ser citado, o juiz encaminhará as peças existentes ao juízo comum para adoção do procedimento previsto em lei. Art. 69: a autoridade policial que tomar conhecimento da ocorrência lavrará termo circunstanciado e o encaminhará imediatamente ao Juizado, com o autor do fato e a vítima, providenciando-se as requisições dos exames periciais necessários. Ao autor do fato que, após a lavratura do termo, for imediatamente encaminhado ao juizado ou assumir o compromisso de a ele comparecer, não se imporá prisão em flagrante, nem se exigirá fiança.',
      'Fase preliminar (arts. 70 a 76): na audiência preliminar, presentes o representante do MP, o autor do fato, a vítima e, se possível, o responsável civil, acompanhados por seus advogados, o juiz esclarece sobre a possibilidade da composição dos danos e da aceitação da proposta de aplicação imediata de pena não privativa de liberdade (art. 72). Composição civil (art. 74): a composição dos danos civis será reduzida a escrito e, homologada pelo juiz mediante sentença irrecorrível, terá eficácia de título a ser executado no juízo civil competente. Tratando-se de ação penal de iniciativa privada ou de ação penal pública condicionada à representação, o acordo homologado acarreta a renúncia ao direito de queixa ou representação.',
      'Transação penal (art. 76): havendo representação ou tratando-se de crime de ação penal pública incondicionada, não sendo caso de arquivamento, o Ministério Público poderá propor a aplicação imediata de pena restritiva de direitos ou multas, a ser especificada na proposta. Não se admitirá a proposta se ficar comprovado (I) ter sido o autor da infração condenado, pela prática de crime, à pena privativa de liberdade, por sentença definitiva; (II) ter sido o agente beneficiado anteriormente, no prazo de 5 anos, pela aplicação de pena restritiva ou multa, nos termos deste artigo; (III) não indicarem os antecedentes, a conduta social e a personalidade do agente, bem como os motivos e as circunstâncias, ser necessária e suficiente a adoção da medida. Aceita a proposta pelo autor da infração e seu defensor, será submetida à apreciação do juiz; a aceitação não importa reincidência e será registrada apenas para impedir novamente o mesmo benefício no prazo de 5 anos; não constará de certidão de antecedentes criminais. Segundo a Súmula Vinculante 35 do STF, a homologação da transação penal não faz coisa julgada material e, descumpridas suas cláusulas, retoma-se a situação anterior, possibilitando-se ao MP a continuidade da persecução penal.',
      'Os arts. 62 a 73 foram escritos de memória; os arts. 61, 74 e 76 foram conferidos em fonte secundária. Confirme tudo em planalto.gov.br.', AVISO],
      'Menor potencial ofensivo: pena máxima NÃO superior a 2 anos (contravenções incluídas). Transação: não há reincidência; impede nova transação por 5 anos.'),
    step('Exemplo prático', [
      'Caso 1 — crime com pena máxima de 2 anos: infração de menor potencial ofensivo (art. 61).',
      'Caso 2 — o autor do fato é encaminhado ao Juizado e se compromete a comparecer: não há prisão em flagrante nem fiança (art. 69, p. único).',
      'Caso 3 — acordo de danos civis homologado em crime de ação penal pública condicionada: renúncia à representação (art. 74, p. único).',
      'Caso 4 — réu foi beneficiado por transação penal há 3 anos: não cabe nova proposta (art. 76, § 2º, II).',
      'Caso 5 — o acusado aceita a transação: não é reincidente; não consta da certidão de antecedentes.'],
      'Pergunta-teste: "pena máxima de até 2 anos?" Juizado Especial Criminal.'),
    step('Resumo essencial', ['Institutos da fase preliminar.'], undefined, { caption: 'Juizado Especial Criminal', head: ['Instituto', 'Regra', 'Art.'], rows: [
      ['Menor potencial ofensivo', 'Contravenções e crimes com pena máxima de até 2 anos', '61'],
      ['Critérios', 'Oralidade, informalidade, economia processual e celeridade', '62'],
      ['Composição civil', 'Título executivo cível; renúncia à queixa/representação', '74'],
      ['Transação penal', 'Pena restritiva ou multa; não gera reincidência; novo benefício só após 5 anos', '76'],
      ['Termo circunstanciado', 'Sem prisão em flagrante nem fiança se o autor comparecer', '69']] }),
    step('O que memorizar', ['• Art. 61: pena máxima não superior a 2 anos.', '• Art. 74: composição civil homologada = título; renúncia à representação.', '• Art. 76: proposta do MP; 5 anos de intervalo; sem reincidência.', '• SV 35: descumprida a transação, retoma-se a persecução penal.'] ),
  ],
}
const pj = mkW('pjc', 'dpp-2')
export const JC1_QUESTIONS: Question[] = [
  pj(1, 'Nos termos do art. 61 da Lei 9.099/1995, consideram-se infrações penais de menor potencial ofensivo as contravenções penais e os crimes a que a lei comine pena máxima', ['não superior a 2 anos, cumulada ou não com multa.', 'Art. 61.'], [['não superior a 1 ano.', 'o limite é de 2 anos.'], ['não superior a 4 anos.', 'este número separa o rito ordinário do sumário no CPP.'], ['inferior a 8 anos.', 'não é o limite do art. 61.'], ['mínima inferior a 1 ano.', 'esse é o critério da suspensão condicional do processo (art. 89), com a pena mínima.']], 'Fácil'),
  pj(2, 'A composição dos danos civis homologada em ação penal pública condicionada à representação acarreta', ['a renúncia ao direito de representação.', 'Art. 74, parágrafo único.'], [['o prosseguimento obrigatório da ação penal.', 'o acordo extingue a possibilidade de representação.'], ['a aplicação de pena privativa de liberdade.', 'não há pena.'], ['a reincidência do autor.', 'não há reincidência.'], ['a nulidade do termo circunstanciado.', 'o termo é válido.']], 'Médio'),
  pj(3, 'Segundo o art. 76 da Lei 9.099/1995, não se admite a proposta de transação penal ao agente beneficiado anteriormente, no prazo de', ['5 anos, pela aplicação de pena restritiva ou multa.', 'Art. 76, § 2º, II.'], [['1 ano.', 'o prazo é de 5 anos.'], ['2 anos.', 'o prazo é de 5 anos.'], ['3 anos.', 'o prazo é de 5 anos.'], ['10 anos.', 'o prazo é de 5 anos.']], 'Médio'),
  pj(4, 'A aceitação da proposta de transação penal pelo autor da infração', ['não importa reincidência e não consta de certidão de antecedentes criminais.', 'Art. 76, §§ 4º e 6º.'], [['importa reincidência.', 'a lei diz expressamente o contrário.'], ['equivale a confissão e condena o autor.', 'não há condenação nem confissão.'], ['dispensa a homologação do juiz.', 'a proposta é submetida ao juiz.'], ['impede qualquer outro benefício para sempre.', 'o impedimento é de 5 anos.']], 'Médio'),
  pj(5, 'O autor do fato que, após a lavratura do termo circunstanciado, é encaminhado ao Juizado ou assume o compromisso de comparecer a ele', ['não sofrerá prisão em flagrante nem lhe será exigida fiança.', 'Art. 69, parágrafo único.'], [['será sempre preso em flagrante.', 'a lei veda.'], ['pagará fiança obrigatoriamente.', 'a lei veda.'], ['será citado por edital.', 'o art. 66 manda citação pessoal ou por mandado.'], ['responderá em liberdade apenas após condenação.', 'não é o conteúdo.']], 'Fácil'),
]
const cj = mkC('pjc', 'dpp-2', 'pp-jecrim1')
export const JC1_CARDS: Flashcard[] = [
  cj(1, 'O que são infrações de menor potencial ofensivo?', 'Contravenções e crimes com pena máxima não superior a 2 anos, cumulada ou não com multa (art. 61).'),
  cj(2, 'Quais os critérios do processo no Juizado?', 'Oralidade, informalidade, economia processual e celeridade (art. 62).'),
  cj(3, 'Qual o efeito da composição civil homologada?', 'Título executivo no juízo cível; nos crimes de ação privada ou pública condicionada, renúncia à queixa ou representação (art. 74).'),
  cj(4, 'O que é transação penal?', 'Proposta do MP de pena restritiva de direitos ou multa (art. 76), aceita pelo autor e seu defensor e homologada pelo juiz.'),
  cj(5, 'Quando não cabe a transação penal?', 'Condenado a pena privativa de liberdade por sentença definitiva; beneficiado nos últimos 5 anos; antecedentes e circunstâncias desfavoráveis.'),
  cj(6, 'O que diz a Súmula Vinculante 35?', 'A homologação da transação penal não faz coisa julgada material; descumpridas as cláusulas, o MP pode retomar a persecução penal.'),
]

// ───────── 10. Lei 9.099/95: procedimento sumaríssimo, recursos e suspensão
export const JC2_LESSON: Lesson = {
  id: 'pp-jecrim2', topicId: 'dpp-2', title: 'Lei 9.099/1995, arts. 77 a 83, 88 e 89: procedimento sumaríssimo, recursos e suspensão condicional do processo', questionIds: qids('pjd'),
  steps: [
    step('Entenda', [
      'Art. 77: na ação penal de iniciativa pública, quando não houver aplicação de pena pela transação, o MP oferecerá ao juiz, de imediato, denúncia oral, se não houver necessidade de diligências imprescindíveis. Se a complexidade ou circunstâncias do caso não permitirem a formulação da denúncia, o MP poderá requerer ao juiz o encaminhamento das peças existentes ao juízo comum (§ 2º). Art. 78: oferecida a denúncia ou queixa, será reduzida a termo, entregando-se cópia ao acusado, que com ela ficará citado e imediatamente cientificado da designação de dia e hora para a audiência de instrução e julgamento, da qual também tomarão ciência o MP, o ofendido, o responsável civil e seus advogados.',
      'Art. 81: aberta a audiência, será dada a palavra ao defensor para responder à acusação, após o que o juiz receberá, ou não, a denúncia ou queixa; havendo recebimento, serão ouvidas a vítima e as testemunhas de acusação e defesa, interrogando-se a seguir o acusado, se presente, passando-se imediatamente aos debates orais e à prolação da sentença. A sentença, dispensado o relatório, mencionará os elementos de convicção do juiz (art. 81, § 3º).',
      'Recursos (arts. 82 e 83): da decisão de rejeição da denúncia ou queixa e da sentença caberá apelação, que poderá ser julgada por turma composta de três juízes togados, em exercício no primeiro grau de jurisdição, reunidos na sede do Juizado (art. 82). A apelação será interposta no prazo de 10 dias, contados da ciência da sentença pelo MP, pelo réu e seu defensor, por petição escrita, da qual constarão as razões e o pedido do recorrente; o recorrido será intimado para oferecer resposta escrita no prazo de 10 dias. Cabem embargos de declaração quando, em sentença ou acórdão, houver obscuridade, contradição, omissão ou dúvida; os embargos serão opostos por escrito ou oralmente, no prazo de 5 dias, contados da ciência da decisão (art. 83); os embargos de declaração interrompem o prazo para o recurso (§ 2º).',
      'Art. 88: além das hipóteses do Código Penal e da legislação especial, dependerá de representação a ação penal relativa aos crimes de lesões corporais leves e lesões culposas. Art. 89 (suspensão condicional do processo): nos crimes em que a pena mínima cominada for igual ou inferior a 1 ano, abrangidos ou não por esta Lei, o Ministério Público, ao oferecer a denúncia, poderá propor a suspensão do processo, por 2 a 4 anos, desde que o acusado não esteja sendo processado ou não tenha sido condenado por outro crime, presentes os demais requisitos que autorizariam a suspensão condicional da pena (art. 77 do Código Penal). Aceita a proposta pelo acusado e seu defensor, na presença do juiz, este, recebendo a denúncia, poderá suspender o processo, submetendo o acusado a período de prova, sob as seguintes condições (§ 1º): reparação do dano, salvo impossibilidade de fazê-lo; proibição de frequentar determinados lugares; proibição de ausentar-se da comarca onde reside, sem autorização do juiz; comparecimento pessoal e obrigatório a juízo, mensalmente, para informar e justificar suas atividades. O juiz poderá especificar outras condições (§ 2º).',
      'A suspensão será revogada se, no curso do prazo, o beneficiário vier a ser processado por outro crime ou não efetuar, sem motivo justificado, a reparação do dano (§ 3º); poderá ser revogada se vier a ser processado por contravenção ou descumprir qualquer outra condição (§ 4º). Expirado o prazo sem revogação, o juiz declarará extinta a punibilidade (§ 5º). Não correrá a prescrição durante o prazo de suspensão (§ 6º). Se o acusado não aceitar a proposta, o processo prosseguirá (§ 7º). Pelas Súmulas 536 do STJ e a ADC 19, a transação penal e a suspensão condicional do processo não se aplicam aos casos de violência doméstica e familiar contra a mulher (Lei 11.340/2006).',
      'Os arts. 77 a 83 foram escritos de memória e apenas os arts. 88 e 89 foram conferidos em fonte secundária. Confirme tudo em planalto.gov.br.', AVISO],
      'Art. 89: pena MÍNIMA ≤ 1 ano; período de prova de 2 a 4 anos; prescrição não corre; revogação obrigatória (novo processo por crime ou falta de reparação) e facultativa (contravenção ou outra condição).'),
    step('Exemplo prático', [
      'Caso 1 — não houve transação: o MP oferece denúncia oral, que é reduzida a termo e entrega-se cópia ao acusado, que fica citado (art. 78).',
      'Caso 2 — sentença no Juizado: dispensado o relatório (art. 81, § 3º).',
      'Caso 3 — apelação em 10 dias, julgada pela turma recursal de três juízes togados (art. 82).',
      'Caso 4 — crime com pena mínima de 1 ano: o MP pode propor suspensão do processo por 2 a 4 anos (art. 89).',
      'Caso 5 — durante o período de prova o acusado é processado por outro crime: revogação obrigatória (art. 89, § 3º).'],
      'Pergunta-teste: "qual o critério?" Transação: pena máxima ≤ 2 anos. Suspensão do processo: pena mínima ≤ 1 ano.'),
    step('Resumo essencial', ['Prazos e requisitos.'], undefined, { caption: 'Juizado: instrução, recursos e suspensão', head: ['Ato', 'Regra', 'Art.'], rows: [
      ['Denúncia', 'Oral, reduzida a termo', '77 e 78'],
      ['Apelação', '10 dias; turma recursal de três juízes togados', '82'],
      ['Embargos de declaração', '5 dias; interrompem o prazo do recurso', '83'],
      ['Representação', 'Lesões leves e culposas', '88'],
      ['Suspensão condicional do processo', 'Pena mínima ≤ 1 ano; prova de 2 a 4 anos', '89']] }),
    step('O que memorizar', ['• Apelação: 10 dias; embargos de declaração: 5 dias.', '• Sentença sem relatório.', '• Art. 88: lesões leves e culposas exigem representação.', '• Art. 89: mínima ≤ 1 ano; 2 a 4 anos; condições do § 1º; prescrição suspensa; Maria da Penha excluída.'] ),
  ],
}
const pd = mkW('pjd', 'dpp-2')
export const JC2_QUESTIONS: Question[] = [
  pd(1, 'Nos termos do art. 89 da Lei 9.099/1995, a suspensão condicional do processo é cabível nos crimes em que a pena mínima cominada for', ['igual ou inferior a 1 ano.', 'Art. 89, caput.'], [['igual ou inferior a 2 anos.', 'este é o limite da pena máxima da transação (art. 61).'], ['superior a 1 ano.', 'o limite é a pena mínima de até 1 ano.'], ['igual ou inferior a 4 anos.', 'não é o critério do art. 89.'], ['apenas de multa.', 'o critério é a pena mínima de até 1 ano.']], 'Fácil'),
  pd(2, 'O período de prova da suspensão condicional do processo é de', ['2 a 4 anos.', 'Art. 89, caput.'], [['6 meses a 1 ano.', 'não corresponde ao texto.'], ['1 a 2 anos.', 'não corresponde ao texto.'], ['3 a 6 anos.', 'não corresponde ao texto.'], ['5 a 10 anos.', 'não corresponde ao texto.']], 'Fácil'),
  pd(3, 'O prazo para a interposição de apelação nos Juizados Especiais Criminais é de', ['10 dias, contados da ciência da sentença.', 'Art. 82, § 1º.'], [['5 dias.', 'é o prazo dos embargos de declaração no Juizado (art. 83) e o da apelação no CPP.'], ['15 dias.', 'não é o prazo do art. 82.'], ['8 dias.', 'é o prazo das razões no CPP.'], ['2 dias.', 'é o prazo dos embargos de declaração no CPP.']], 'Médio'),
  pd(4, 'Segundo o art. 89, § 6º, durante o prazo de suspensão do processo, a prescrição', ['não correrá.', 'Art. 89, § 6º.'], [['correrá normalmente.', 'o curso é suspenso.'], ['correrá pela metade.', 'não há essa previsão.'], ['será interrompida e reiniciada ao final.', 'o texto fala em não correr.'], ['será extinta de plano.', 'a punibilidade só se extingue ao final do prazo sem revogação.']], 'Médio'),
  pd(5, 'A ação penal relativa aos crimes de lesões corporais leves e lesões culposas, conforme o art. 88, depende de', ['representação.', 'Art. 88.'], [['requisição do Ministro da Justiça.', 'não é o caso.'], ['queixa-crime exclusiva da vítima.', 'a ação continua pública, condicionada à representação.'], ['denúncia incondicionada.', 'a lei exige representação.'], ['autorização do Tribunal.', 'não é o caso.']], 'Médio'),
]
const cd = mkC('pjd', 'dpp-2', 'pp-jecrim2')
export const JC2_CARDS: Flashcard[] = [
  cd(1, 'Como é a denúncia no Juizado?', 'Oral, reduzida a termo, com cópia entregue ao acusado, que fica citado e ciente da audiência (arts. 77 e 78).'),
  cd(2, 'Qual o recurso e o prazo no Juizado?', 'Apelação em 10 dias, julgada por turma de três juízes togados; embargos de declaração em 5 dias (arts. 82 e 83).'),
  cd(3, 'O que diz o art. 88?', 'Lesões corporais leves e lesões culposas dependem de representação.'),
  cd(4, 'Requisitos básicos da suspensão condicional do processo (art. 89)?', 'Pena mínima ≤ 1 ano; acusado sem outro processo ou condenação; requisitos do art. 77 do CP; aceitação do acusado e do defensor.'),
  cd(5, 'Condições do § 1º do art. 89?', 'Reparar o dano; não frequentar certos lugares; não se ausentar da comarca sem autorização; comparecer mensalmente em juízo.'),
  cd(6, 'Quando a suspensão é revogada?', 'Obrigatória: novo processo por crime ou não reparação sem justificativa. Facultativa: processo por contravenção ou descumprimento de outra condição.'),
]

export const DPP_LESSONS = [JUIZ_LESSON, CIT_LESSON, COM_LESSON, JURI1_LESSON, JURI2_LESSON, REC1_LESSON, REC2_LESSON, REV_LESSON, JC1_LESSON, JC2_LESSON]
export const DPP_QUESTIONS = spread([...JUIZ_QUESTIONS, ...CIT_QUESTIONS, ...COM_QUESTIONS, ...JURI1_QUESTIONS, ...JURI2_QUESTIONS, ...REC1_QUESTIONS, ...REC2_QUESTIONS, ...REV_QUESTIONS, ...JC1_QUESTIONS, ...JC2_QUESTIONS], 4)
export const DPP_CARDS = [...JUIZ_CARDS, ...CIT_CARDS, ...COM_CARDS, ...JURI1_CARDS, ...JURI2_CARDS, ...REC1_CARDS, ...REC2_CARDS, ...REV_CARDS, ...JC1_CARDS, ...JC2_CARDS]
