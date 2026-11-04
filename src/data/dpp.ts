import type { Flashcard, Lesson, Question } from '../types'
import { mkW, mkC, spread, step, qids } from './helpers'
// Direito Processual Penal (Anexo VIII), parte 1: CPP arts. 251–258, 261–267, 274; 351–372; 394–405, 531–538, 541–548; 406–421, 436–446, 453–472, 482–491.
// Fonte: páginas secundárias de comentários (projuris.com.br etc.), lidas em 04/11/2026; o Planalto bloqueia acesso automatizado. Texto em paráfrase.
// Não conferidos nesta sessão (por isso não aparecem): arts. 262, 264, 267, 473–481, 492–497.
const AVISO = 'Aviso: texto em paráfrase próxima, conferido em fontes secundárias (o Planalto não abre para acesso automatizado). Antes da prova, confirme a redação vigente em planalto.gov.br.'

// ───────── 1. Juiz, MP, defensor
export const JUIZ_LESSON: Lesson = {
  id: 'pp-juiz', topicId: 'dpp-1', title: 'CPP arts. 251 a 258, 261 a 266 e 274: juiz, impedimento, suspeição e defensor', questionIds: qids('ppj'),
  steps: [
    step('Entenda', [
      'Art. 251: ao juiz incumbe prover à regularidade do processo e manter a ordem no curso dos respectivos atos, podendo, para tal fim, requisitar a força pública.',
      'IMPEDIMENTO (art. 252): o juiz não pode exercer jurisdição no processo em que (I) tiver funcionado seu cônjuge ou parente, consanguíneo ou afim, em linha reta ou colateral, até o terceiro grau, como defensor ou advogado, órgão do Ministério Público, autoridade policial, auxiliar da justiça ou perito; (II) ele próprio tiver desempenhado qualquer dessas funções ou servido como testemunha; (III) tiver funcionado como juiz de outra instância, pronunciando-se, de fato ou de direito, sobre a questão; (IV) ele próprio, seu cônjuge ou parente (até o terceiro grau) for parte ou diretamente interessado no feito. Art. 253: nos juízos coletivos, não podem servir no mesmo processo juízes que sejam parentes, consanguíneos ou afins, em linha reta ou colateral até o terceiro grau.',
      'SUSPEIÇÃO (art. 254): o juiz deve declarar-se suspeito, e pode ser recusado por qualquer das partes, se for amigo íntimo ou inimigo capital de qualquer delas; se ele, seu cônjuge ou ascendente/descendente estiver respondendo a processo por fato análogo, sobre cujo caráter criminoso haja controvérsia; se ele, seu cônjuge ou parente, até o terceiro grau, sustentar demanda ou responder a processo que tenha de ser julgado por qualquer das partes; se tiver aconselhado qualquer das partes; se for credor ou devedor, tutor ou curador de qualquer das partes; se for sócio, acionista ou administrador de sociedade interessada no processo. Art. 256: a suspeição não pode ser declarada nem reconhecida quando a parte injuriar o juiz ou de propósito der motivo para criá-la.',
      'Art. 255: o impedimento ou suspeição decorrente de parentesco por afinidade cessa com a dissolução do casamento que lhe deu causa, salvo se do matrimônio resultou descendente; mesmo assim, o sogro, o padrasto, o cunhado, o genro ou enteado de quem for parte no processo não poderá servir como juiz. Art. 257: ao Ministério Público cabe promover, privativamente, a ação penal pública e fiscalizar a execução da lei. Art. 258: os órgãos do Ministério Público não funcionarão nos processos em que incorrer qualquer das causas de impedimento ou suspeição previstas para os juízes, no que lhes for aplicável. Art. 274: as prescrições sobre suspeição dos juízes estendem-se aos serventuários e funcionários de justiça, no que lhes for aplicável.',
      'Defensor: art. 261, nenhum acusado, ainda que ausente ou foragido, será processado ou julgado sem defensor (a defesa técnica, quando realizada por defensor público ou dativo, é sempre exercida através de manifestação fundamentada). Art. 263: se o acusado não o tiver, ser-lhe-á nomeado defensor pelo juiz, ressalvado o direito de, a todo tempo, nomear outro de sua confiança, ou a si mesmo defender-se, caso tenha habilitação. Art. 265: o defensor não poderá abandonar o processo senão por motivo imperioso, comunicado previamente o juiz, sob pena de multa de 10 a 100 salários mínimos, sem prejuízo das demais sanções cabíveis; a audiência poderá ser adiada se, por motivo justificado, o defensor não puder comparecer, cabendo-lhe provar o impedimento até a abertura da audiência. Art. 266: a constituição de defensor independe de instrumento de mandato, se o acusado o indicar por ocasião do interrogatório.',
      'Os arts. 262, 264 e 267 não foram conferidos em fonte aberta nesta sessão e ficam fora desta aula; consulte-os no Planalto.', AVISO],
      'Impedimento = situação OBJETIVA (função anterior no processo, parentesco): dispensa prova do ânimo. Suspeição = situação SUBJETIVA (amizade íntima, inimizade capital, interesse). Ambos valem para o juiz, o MP e os serventuários.'),
    step('Exemplo prático', [
      'Caso 1 — o juiz da ação penal foi o delegado que presidiu o inquérito: impedimento (art. 252, II).',
      'Caso 2 — o juiz é padrinho de casamento do réu (amigo íntimo): suspeição (art. 254, I).',
      'Caso 3 — o casamento que criava afinidade entre o juiz e a parte foi dissolvido, sem descendentes: o impedimento por afinidade cessa (art. 255). Mesmo assim, sogro, padrasto, cunhado, genro ou enteado de quem é parte não podem julgar.',
      'Caso 4 — o defensor constituído abandona o plenário sem motivo imperioso nem aviso: multa de 10 a 100 salários mínimos, sem prejuízo de outras sanções (art. 265).',
      'Caso 5 — o acusado indica um advogado verbalmente no interrogatório: a procuração é dispensável (art. 266).'],
      'Pergunta-teste: "a causa é uma função ou parentesco (impedimento) ou um sentimento/interesse (suspeição)?"'),
    step('Resumo essencial', ['Principais regras.'], undefined, { caption: 'Juiz, MP e defensor', head: ['Art.', 'Tema', 'Regra'], rows: [
      ['252', 'Impedimento', 'Função anterior no processo ou parentesco até o 3º grau'],
      ['254', 'Suspeição', 'Amizade íntima, inimizade capital, interesse, conselho a parte'],
      ['256', 'Suspeição provocada', 'Não pode ser declarada se a parte injuriou o juiz de propósito'],
      ['258', 'Ministério Público', 'Aplicam-se os impedimentos e suspeições dos juízes'],
      ['261', 'Defensor', 'Nenhum acusado é processado sem defensor'],
      ['265', 'Abandono', 'Multa de 10 a 100 salários mínimos'],
      ['266', 'Mandato', 'Dispensado se o acusado indica o defensor no interrogatório']] }),
    step('O que memorizar', ['• Parentesco: até o 3º grau, consanguíneo ou afim.', '• Impedimento (252) x suspeição (254).', '• Abandono do processo pelo defensor: multa de 10 a 100 salários mínimos (art. 265).', '• Art. 261: ninguém é processado sem defensor.', '• Art. 266: procuração dispensada se indicado no interrogatório.'] ),
  ],
}
const j = mkW('ppj', 'dpp-1')
export const JUIZ_QUESTIONS: Question[] = [
  j(1, 'O juiz que, no mesmo processo, tenha desempenhado a função de testemunha está', ['impedido, nos termos do art. 252, II, do CPP.', 'Haver servido como testemunha é causa de impedimento.'], [['suspeito, por amizade íntima.', 'a amizade íntima é causa de suspeição e não se confunde com ter sido testemunha.'], ['livre para julgar, pois a testemunha não é parte.', 'o art. 252, II, veda expressamente.'], ['suspeito, nos termos do art. 254, V.', 'este inciso trata de credor, devedor, tutor ou curador.'], ['apenas obrigado a comunicar o fato ao tribunal, sem afastamento.', 'o impedimento impede o exercício da jurisdição.']], 'Fácil'),
  j(2, 'Segundo o art. 254 do CPP, é causa de suspeição do juiz', ['ser amigo íntimo ou inimigo capital de qualquer das partes.', 'Art. 254, I.'], [['ter funcionado como juiz de outra instância no processo.', 'é causa de impedimento (art. 252, III).'], ['ser parente do réu em segundo grau.', 'o parentesco do juiz com a parte ou defensor etc. está no art. 252 (impedimento).'], ['ter atuado como perito no mesmo processo.', 'também é impedimento (art. 252, II).'], ['ter sido autoridade policial no mesmo processo.', 'também é impedimento (art. 252, II).']], 'Fácil'),
  j(3, 'A suspeição não poderá ser declarada nem reconhecida quando', ['a parte injuriar o juiz ou de propósito der motivo para criá-la.', 'Art. 256.'], [['o juiz for amigo íntimo do réu.', 'esta é justamente causa de suspeição.'], ['a parte for o Ministério Público.', 'o MP também está sujeito às regras de suspeição.'], ['houver mais de um acusado.', 'o número de acusados é irrelevante.'], ['o juiz já tiver proferido sentença.', 'não é a hipótese do art. 256.']], 'Médio'),
  j(4, 'O defensor que abandona o processo sem motivo imperioso fica sujeito, segundo o art. 265 do CPP, a', ['multa de 10 a 100 salários mínimos, sem prejuízo das demais sanções cabíveis.', 'Art. 265, caput.'], [['prisão administrativa de até 30 dias.', 'o artigo prevê multa, não prisão.'], ['multa de 1 a 10 salários mínimos.', 'esse é o intervalo da multa do jurado faltoso (art. 436, § 2º).'], ['advertência verbal apenas.', 'a lei prevê multa.'], ['exclusão automática dos quadros da OAB.', 'a sanção disciplinar é da OAB; o artigo prevê multa.']], 'Médio'),
  j(5, 'Nos termos do art. 266 do CPP, a constituição de defensor independe de instrumento de mandato se', ['o acusado o indicar por ocasião do interrogatório.', 'Art. 266.'], [['o advogado alegar urgência.', 'a lei não dispensa a procuração por urgência.'], ['o juiz assim determinar de ofício.', 'não é a hipótese do artigo.'], ['o acusado for revel.', 'o artigo trata da indicação no interrogatório.'], ['houver assistente da acusação.', 'a presença de assistente é irrelevante.']], 'Médio'),
]
const jc = mkC('ppj', 'dpp-1', 'pp-juiz')
export const JUIZ_CARDS: Flashcard[] = [
  jc(1, 'Qual é a diferença entre impedimento e suspeição do juiz?', 'Impedimento (art. 252): função anterior no processo ou parentesco. Suspeição (art. 254): amizade íntima, inimizade capital, interesse, conselho à parte etc.'),
  jc(2, 'Até que grau vai o parentesco do art. 252?', 'Até o terceiro grau, consanguíneo ou afim, em linha reta ou colateral.'),
  jc(3, 'O que diz o art. 258 sobre o Ministério Público?', 'Os órgãos do MP não funcionam em processo em que haja impedimento ou suspeição previstos para os juízes.'),
  jc(4, 'O que diz o art. 261?', 'Nenhum acusado, ainda que ausente ou foragido, será processado ou julgado sem defensor.'),
  jc(5, 'Qual a multa do defensor que abandona o processo sem motivo imperioso?', 'De 10 a 100 salários mínimos (art. 265), sem prejuízo de outras sanções.'),
  jc(6, 'Quando a suspeição não pode ser declarada (art. 256)?', 'Quando a parte injuriar o juiz ou de propósito der motivo para criá-la.'),
]

// ───────── 2. Citações e intimações
export const CIT_LESSON: Lesson = {
  id: 'pp-citacao', topicId: 'dpp-1', title: 'CPP arts. 351 a 372: citação, revelia e intimação', questionIds: qids('ppc'),
  steps: [
    step('Entenda', [
      'Citação inicial por mandado (art. 351): quando o réu estiver no território sujeito à jurisdição do juiz que a houver ordenado. Se estiver fora, por carta precatória (art. 353). Se estiver no estrangeiro, em lugar sabido, por carta rogatória, suspendendo-se o curso do prazo prescricional até o seu cumprimento (art. 368). O art. 357 exige que o oficial leia o mandado ao citado e lhe entregue a contrafé, certificando a entrega e se ele a aceitou ou recusou.',
      'Casos especiais: o militar é citado por intermédio do chefe do respectivo serviço (art. 358); o funcionário público é citado e, em seguida, notificado o chefe da repartição (art. 359); o réu preso é citado pessoalmente (art. 360).',
      'Citação por edital (art. 361): se o réu não for encontrado, será citado por edital, com o prazo de 15 dias. Citação com hora certa (art. 362): verificando que o réu se oculta para não ser citado, o oficial certifica e procede-se à citação com hora certa, na forma dos arts. 227 a 229 do CPC; completada a citação com hora certa, se o acusado não comparecer, ser-lhe-á nomeado defensor dativo.',
      'Art. 366: se o acusado, citado por edital, não comparecer nem constituir advogado, ficarão suspensos o processo e o curso do prazo prescricional; o juiz poderá determinar a produção antecipada das provas consideradas urgentes e, se for o caso, decretar prisão preventiva. Art. 367: o processo seguirá sem a presença do acusado que, citado ou intimado pessoalmente para qualquer ato, deixar de comparecer sem motivo justificado, ou, no caso de mudança de residência, não comunicar o novo endereço ao juízo.',
      'Intimação (arts. 370 a 372): aplicam-se as regras da citação no que couber. A intimação do defensor constituído, do advogado do querelante e do assistente far-se-á por publicação no órgão incumbido da publicidade dos atos judiciais da comarca (§ 1º); a intimação do Ministério Público e do defensor nomeado será pessoal (§ 4º). Art. 372: adiada, por qualquer motivo, a instrução criminal, o juiz marcará desde logo, na presença das partes e testemunhas, dia e hora para seu prosseguimento, do que se lavrará termo nos autos.',
      AVISO],
      'Edital: 15 dias. Citação por edital sem comparecimento: suspende o processo e a prescrição (art. 366). Carta rogatória: suspende a prescrição até o cumprimento (art. 368).'),
    step('Exemplo prático', [
      'Caso 1 — o réu mora em outra comarca: citação por precatória (art. 353).',
      'Caso 2 — o oficial certifica que o réu se esconde: citação por hora certa (art. 362); se não comparecer, defensor dativo.',
      'Caso 3 — o réu citado por edital não aparece nem constitui advogado: suspensão do processo e da prescrição (art. 366).',
      'Caso 4 — o réu foi citado pessoalmente, soube da audiência e não compareceu sem justificativa: o processo segue sem ele (art. 367).',
      'Caso 5 — o promotor e o defensor dativo precisam ser intimados pessoalmente; o advogado constituído, por publicação (art. 370, §§ 1º e 4º).'],
      'Pergunta-teste: "onde está o réu?" Na comarca: mandado. Em outra comarca: precatória. No exterior: rogatória. Escondido: hora certa. Em lugar incerto: edital.'),
    step('Resumo essencial', ['Formas de citação.'], undefined, { caption: 'Citação e intimação', head: ['Situação', 'Forma', 'Base'], rows: [
      ['Réu na jurisdição', 'Mandado', 'Art. 351'],
      ['Réu em outra comarca', 'Carta precatória', 'Art. 353'],
      ['Réu no exterior, em lugar sabido', 'Carta rogatória; suspende a prescrição', 'Art. 368'],
      ['Réu não encontrado', 'Edital, prazo de 15 dias', 'Art. 361'],
      ['Réu se oculta', 'Hora certa; defensor dativo se não comparecer', 'Art. 362'],
      ['Edital sem comparecimento', 'Suspende processo e prescrição', 'Art. 366'],
      ['MP e defensor nomeado', 'Intimação pessoal', 'Art. 370, § 4º']] }),
    step('O que memorizar', ['• Edital: 15 dias.', '• Art. 366: suspensão do processo e da prescrição.', '• Art. 367: revelia (processo segue).', '• Militar: pelo chefe do serviço; réu preso: pessoal.', '• Intimação do MP e do defensor nomeado: pessoal.'] ),
  ],
}
const c = mkW('ppc', 'dpp-1')
export const CIT_QUESTIONS: Question[] = [
  c(1, 'Nos termos do art. 361 do CPP, não sendo encontrado o réu, será citado por edital, com o prazo de', ['15 dias.', 'Art. 361.'], [['5 dias.', 'prazo menor que o legal.'], ['10 dias.', 'é o prazo de resposta à acusação (art. 396).'], ['30 dias.', 'não é o prazo do edital no art. 361.'], ['60 dias.', 'é o prazo máximo para a audiência no procedimento ordinário.']], 'Fácil'),
  c(2, 'Citado por edital, o acusado não comparece nem constitui advogado. Segundo o art. 366 do CPP, ficam suspensos', ['o processo e o curso do prazo prescricional.', 'Art. 366.'], [['apenas o prazo prescricional.', 'suspende-se também o processo.'], ['apenas o processo, correndo a prescrição.', 'a prescrição também fica suspensa.'], ['somente a execução da pena.', 'o art. 366 trata do processo e da prescrição.'], ['a competência do juízo.', 'o artigo não trata de competência.']], 'Médio'),
  c(3, 'Verificando o oficial de justiça que o réu se oculta para não ser citado, procede-se à', ['citação com hora certa, nomeando-se defensor dativo se o acusado não comparecer.', 'Art. 362.'], [['citação por edital, sem outras consequências.', 'o art. 362 manda proceder à hora certa.'], ['decretação imediata de revelia sem defensor.', 'nomeia-se defensor dativo.'], ['expedição de carta rogatória.', 'esta serve para réu no estrangeiro.'], ['arquivamento do processo.', 'o processo prossegue.']], 'Médio'),
  c(4, 'O militar, segundo o art. 358 do CPP, será citado', ['por intermédio do chefe do respectivo serviço.', 'Art. 358.'], [['por edital obrigatório.', 'não há exigência de edital.'], ['apenas pessoalmente, sem intermediação.', 'a lei prevê a via do chefe do serviço.'], ['por carta rogatória.', 'esta é para réu no exterior.'], ['pelo comandante da Força Aérea, sempre.', 'a lei fala do chefe do respectivo serviço.']], 'Fácil'),
  c(5, 'De acordo com o art. 370, § 4º, do CPP, a intimação do Ministério Público e do defensor nomeado será', ['pessoal.', 'Art. 370, § 4º.'], [['por edital.', 'não é a forma legal.'], ['por simples publicação no órgão oficial.', 'a publicação serve ao defensor constituído, ao querelante e ao assistente.'], ['dispensada.', 'é obrigatória.'], ['feita apenas por correio.', 'a lei exige intimação pessoal.']], 'Médio'),
]
const cc = mkC('ppc', 'dpp-1', 'pp-citacao')
export const CIT_CARDS: Flashcard[] = [
  cc(1, 'Quando se cita por carta precatória?', 'Quando o réu está fora da jurisdição do juiz (art. 353).'),
  cc(2, 'Qual o prazo do edital no art. 361?', '15 dias.'),
  cc(3, 'O que ocorre se o réu citado por edital não comparece nem constitui advogado?', 'Ficam suspensos o processo e o prazo prescricional (art. 366); podem-se produzir provas urgentes e decretar preventiva.'),
  cc(4, 'Quando o processo segue sem a presença do réu (art. 367)?', 'Quando, citado ou intimado pessoalmente, deixa de comparecer sem justificativa, ou muda de endereço e não comunica.'),
  cc(5, 'Como se cita o réu preso?', 'Pessoalmente (art. 360).'),
  cc(6, 'Como se intima o defensor constituído?', 'Por publicação no órgão oficial da comarca (art. 370, § 1º); a omissão do nome do acusado torna nula a intimação.'),
]

// ───────── 3. Procedimento comum (ordinário, sumário) e restauração de autos
export const COM_LESSON: Lesson = {
  id: 'pp-comum', topicId: 'dpp-1', title: 'CPP arts. 394 a 405, 531 a 538 e 541 a 548: procedimento comum, sumário e restauração de autos', questionIds: qids('ppo'),
  steps: [
    step('Entenda', [
      'Art. 394: o procedimento comum é ordinário (crime com pena máxima igual ou superior a 4 anos), sumário (crime com pena máxima inferior a 4 anos) ou sumaríssimo (infrações de menor potencial ofensivo, na forma da lei). O procedimento ordinário aplica-se subsidiariamente aos demais. Art. 394-A: os processos que apurem a prática de crime hediondo terão prioridade de tramitação em todas as instâncias.',
      'Art. 395: a denúncia ou queixa será rejeitada quando (I) for manifestamente inepta, (II) faltar pressuposto processual ou condição para o exercício da ação penal, ou (III) faltar justa causa. Art. 396: não rejeitada, o juiz recebe e ordena a citação do acusado para responder à acusação, por escrito, no prazo de 10 dias (no caso de edital, o prazo começa do comparecimento pessoal ou do defensor constituído). Art. 396-A: na resposta, o acusado pode arguir preliminares, oferecer documentos e justificações, especificar provas e arrolar testemunhas; se não apresentar no prazo, o juiz nomeia defensor, que terá 10 dias para oferecê-la.',
      'Art. 397: após a resposta, o juiz deve absolver sumariamente o acusado quando verificar (I) a existência manifesta de causa excludente da ilicitude do fato; (II) a existência manifesta de causa excludente da culpabilidade, salvo inimputabilidade; (III) que o fato narrado evidentemente não constitui crime; ou (IV) extinta a punibilidade do agente. Art. 399: recebida a denúncia ou queixa, o juiz designa dia e hora para a audiência, ordenando a intimação do acusado, de seu defensor, do MP e, se for o caso, do querelante e do assistente. O juiz que presidiu a instrução deverá proferir a sentença (§ 2º).',
      'Art. 400 (audiência de instrução e julgamento): realiza-se no prazo máximo de 60 dias. Ordem: declarações do ofendido, inquirição das testemunhas arroladas pela acusação e depois pela defesa, esclarecimentos dos peritos, acareações, reconhecimento de pessoas e coisas e, por último, o interrogatório do acusado. Art. 401: serão inquiridas até 8 testemunhas arroladas pela acusação e 8 pela defesa (não se computam as que não prestem compromisso e as referidas). Art. 403: não havendo requerimento de diligências (art. 402), ou sendo indeferido, serão oferecidas alegações finais orais por 20 minutos, respectivamente, pela acusação e pela defesa, prorrogáveis por mais 10; em seguida o juiz proferirá a sentença. Se a complexidade do caso ou o número de acusados o exigir, poderá conceder prazo de 5 dias sucessivos para memoriais, e terá 10 dias para sentenciar (§ 3º; art. 404, parágrafo único, após diligência indispensável).',
      'Procedimento sumário (art. 531 e seguintes): a audiência de instrução e julgamento realiza-se no prazo máximo de 30 dias (art. 531); serão ouvidas até 5 testemunhas de cada parte (art. 532); as alegações finais são orais, por 20 minutos para cada parte, prorrogáveis por mais 10 (art. 534). Art. 538: nas infrações de menor potencial ofensivo, quando o juizado especial criminal encaminhar peças existentes ao juízo comum, o procedimento a ser adotado é o sumário.',
      'Restauração de autos extraviados (arts. 541 a 548): em caso de perda ou destruição dos autos originais, serão restaurados (art. 541). Se não houver cópia ou certidão, o juiz determina, de ofício ou a requerimento, que o escrivão certifique o estado do processo, que se solicitem cópias a órgãos públicos, e que as partes sejam citadas por edital, se não encontradas, para, no prazo de 10 dias, se manifestarem. Salvo motivo de força maior, as diligências devem se encerrar em 20 dias (art. 544). Os selos e custas já pagos não serão cobrados de novo (art. 545); quem der causa ao desaparecimento pagará as custas em dobro, sem prejuízo da responsabilidade criminal (art. 546). Julgada a restauração, os autos restaurados valerão como os originais (art. 547). Até o julgamento, a sentença condenatória em execução continua em vigor, desde que conste da guia de recolhimento (art. 548).',
      AVISO],
      'Números do rito: ordinário (pena máx. ≥ 4 anos): audiência em 60 dias, 8 testemunhas. Sumário (pena máx. < 4 anos): audiência em 30 dias, 5 testemunhas. Resposta à acusação: 10 dias. Alegações orais: 20 + 10 minutos.'),
    step('Exemplo prático', [
      'Caso 1 — crime com pena máxima de 3 anos e 6 meses: procedimento sumário (art. 394, § 1º, II).',
      'Caso 2 — denúncia sem narrar o fato criminoso com circunstâncias: inepta, a ser rejeitada (art. 395, I).',
      'Caso 3 — após a resposta, fica evidente legítima defesa: absolvição sumária (art. 397, I).',
      'Caso 4 — o acusado não apresenta a resposta no prazo de 10 dias: o juiz nomeia defensor (art. 396-A, § 2º).',
      'Caso 5 — a defesa quer ouvir 9 testemunhas no rito ordinário: o limite é de 8 (art. 401).'],
      'Pergunta-teste: "qual a pena máxima?" 4 anos ou mais: ordinário. Menos de 4: sumário.'),
    step('Resumo essencial', ['Prazos e números.'], undefined, { caption: 'Ordinário x sumário', head: ['Item', 'Ordinário', 'Sumário'], rows: [
      ['Pena máxima', '4 anos ou mais', 'Menos de 4 anos'],
      ['Resposta à acusação', '10 dias', '10 dias'],
      ['Audiência de instrução', 'Até 60 dias', 'Até 30 dias'],
      ['Testemunhas por parte', 'Até 8', 'Até 5'],
      ['Debates orais', '20 min + 10', '20 min + 10'],
      ['Memoriais / sentença (art. 403, § 3º)', '5 dias sucessivos / 10 dias', 'Não detalhado nesta aula']] }),
    step('O que memorizar', ['• Art. 394: 4 anos de pena máxima separa ordinário de sumário.', '• Art. 395: rejeição por inépcia, falta de pressuposto/condição ou justa causa.', '• Art. 397: absolvição sumária (4 hipóteses).', '• Restauração: 10 dias (partes), 20 dias (diligências); custas em dobro para quem der causa.'] ),
  ],
}
const o3 = mkW('ppo', 'dpp-1')
export const COM_QUESTIONS: Question[] = [
  o3(1, 'Segundo o art. 394 do CPP, adota-se o procedimento comum ordinário quando o crime tiver pena máxima', ['igual ou superior a 4 anos de privação de liberdade.', 'Art. 394, § 1º, I.'], [['superior a 2 anos.', 'o critério do art. 394 para o ordinário é a pena máxima de 4 anos ou mais; 2 anos é o limite da infração de menor potencial ofensivo (Lei 9.099).'], ['inferior a 4 anos.', 'este é o sumário.'], ['superior a 8 anos.', 'o limite do ordinário é 4 anos.'], ['superior a 1 ano.', 'não é o critério legal.']], 'Fácil'),
  o3(2, 'No procedimento ordinário, o prazo máximo para a realização da audiência de instrução e julgamento é de', ['60 dias.', 'Art. 400, caput.'], [['30 dias.', 'é o prazo do procedimento sumário (art. 531).'], ['10 dias.', 'é o prazo de resposta à acusação.'], ['90 dias.', 'é o prazo para conclusão da primeira fase do júri (art. 412).'], ['15 dias.', 'não é prazo da audiência.']], 'Médio'),
  o3(3, 'O número máximo de testemunhas que cada parte pode arrolar no procedimento sumário é', ['5.', 'Art. 532.'], [['3.', 'não é o limite legal.'], ['8.', 'é o limite do procedimento ordinário (art. 401).'], ['10.', 'não é o limite legal.'], ['sem limite.', 'a lei fixa limite.']], 'Médio'),
  o3(4, 'Após a resposta à acusação, o juiz deve absolver sumariamente o acusado quando verificar', ['a existência manifesta de causa excludente da ilicitude do fato.', 'Art. 397, I.'], [['que a pena máxima é de 4 anos.', 'a pena não é fundamento de absolvição sumária.'], ['que o réu é reincidente.', 'a reincidência não leva à absolvição.'], ['a ausência do réu na audiência.', 'não é hipótese do art. 397.'], ['a confissão do acusado.', 'a confissão não é hipótese de absolvição sumária.']], 'Médio'),
  o3(5, 'No procedimento de restauração de autos extraviados, a regra do art. 546 estabelece que quem deu causa ao desaparecimento', ['pagará as custas em dobro, sem prejuízo da responsabilidade criminal.', 'Art. 546.'], [['ficará isento de custas.', 'o texto determina o pagamento em dobro.'], ['pagará custas simples.', 'o texto fala em dobro.'], ['responderá apenas administrativamente.', 'há também responsabilidade criminal.'], ['será preso preventivamente.', 'não é consequência do artigo.']], 'Difícil'),
]
const co = mkC('ppo', 'dpp-1', 'pp-comum')
export const COM_CARDS: Flashcard[] = [
  co(1, 'O que separa o rito ordinário do sumário?', 'Pena máxima: 4 anos ou mais = ordinário; menos de 4 anos = sumário (art. 394, § 1º).'),
  co(2, 'Quais as hipóteses de rejeição da denúncia (art. 395)?', 'Inépcia manifesta; falta de pressuposto processual ou condição da ação; falta de justa causa.'),
  co(3, 'Prazo da resposta à acusação?', '10 dias (art. 396).'),
  co(4, 'Quais as hipóteses de absolvição sumária (art. 397)?', 'Excludente de ilicitude; excludente de culpabilidade (salvo inimputabilidade); fato que evidentemente não é crime; extinção da punibilidade.'),
  co(5, 'Prazos e testemunhas: ordinário x sumário?', 'Ordinário: audiência em 60 dias, 8 testemunhas. Sumário: 30 dias, 5 testemunhas.'),
  co(6, 'Quais os prazos da restauração de autos?', '10 dias para as partes; 20 dias para as diligências (art. 544).'),
]

// ───────── 4. Júri: primeira fase e jurados
export const JURI1_LESSON: Lesson = {
  id: 'pp-juri1', topicId: 'dpp-1', title: 'CPP arts. 406 a 421 e 436 a 446: júri, primeira fase (sumário da culpa), decisões e jurados', questionIds: qids('ppu'),
  steps: [
    step('Entenda', [
      'O procedimento do júri tem duas fases: o judicium accusationis (arts. 406 a 421), perante o juiz togado, e o judicium causae (a partir do art. 422), perante o Conselho de Sentença. Art. 406: o juiz, ao receber a denúncia ou queixa, ordena a citação do acusado para responder à acusação por escrito, em 10 dias. A acusação deve arrolar, na denúncia, até 8 testemunhas; a defesa, na resposta, também até 8 (§§ 2º e 3º). Se a resposta não for apresentada no prazo, o juiz nomeia defensor para oferecê-la em 10 dias (art. 408). Apresentada a defesa, o MP ou o querelante é ouvido em 5 dias (art. 409); o juiz determina as diligências em até 10 dias (art. 410).',
      'Art. 411: na audiência de instrução, ouvem-se o ofendido, as testemunhas de acusação e defesa, os esclarecimentos dos peritos, acareações e reconhecimentos, o interrogatório e os debates orais: 20 minutos cada, prorrogáveis por 10 (§ 4º); o assistente fala por 10 minutos após o MP (§ 6º). Encerrados os debates, o juiz proferirá a sua decisão em audiência ou no prazo de 10 dias (§ 9º). Art. 412: o procedimento será concluído no prazo máximo de 90 dias.',
      'Decisões ao final da primeira fase. PRONÚNCIA (art. 413): o juiz, fundamentadamente, pronuncia o acusado se convencido da materialidade do fato e da existência de indícios suficientes de autoria ou de participação; a fundamentação limita-se à indicação da materialidade e dos indícios, e especifica as qualificadoras e causas de aumento. IMPRONÚNCIA (art. 414): não se convencendo da materialidade ou de indícios suficientes de autoria, o juiz impronuncia; enquanto não extinta a punibilidade, poderá ser formulada nova denúncia ou queixa se houver prova nova. ABSOLVIÇÃO SUMÁRIA (art. 415): quando provada a inexistência do fato, provado não ser ele autor ou partícipe do fato, o fato não constituir infração penal, ou demonstrada causa de isenção de pena ou de exclusão do crime. Art. 416: contra a sentença de impronúncia ou de absolvição sumária cabe apelação (contra a pronúncia, cabe recurso em sentido estrito, art. 581, IV).',
      'Outros dispositivos: art. 417 (indícios de outras pessoas: os autos voltam ao MP por 15 dias); art. 418 (o juiz pode dar ao fato definição jurídica diversa, ainda que o acusado fique sujeito a pena mais grave); art. 419 (crime diverso, de outra competência: remessa ao juiz competente, ficando o acusado preso à disposição); art. 420 (intimação da pronúncia: pessoal ao acusado, ao defensor nomeado e ao MP; ao defensor constituído, ao querelante e ao assistente, por publicação; o acusado solto e não encontrado é intimado por edital); art. 421 (preclusa a pronúncia, os autos vão ao juiz presidente do Tribunal do Júri).',
      'Jurados (arts. 436 a 446): o serviço do júri é obrigatório, para cidadãos maiores de 18 anos de notória idoneidade (art. 436); a recusa injustificada acarreta multa de 1 a 10 salários mínimos, conforme a condição econômica do jurado (§ 2º). Estão isentos, entre outros, o Presidente da República, ministros de Estado, governadores, parlamentares, prefeitos, magistrados, membros do MP e da Defensoria, servidores da segurança pública, militares em serviço ativo, maiores de 70 anos que requeiram dispensa (art. 437). Recusa por convicção religiosa, filosófica ou política: serviço alternativo, sob pena de suspensão dos direitos políticos (art. 438). O exercício efetivo da função de jurado constituirá serviço público relevante e estabelecerá presunção de idoneidade moral (art. 439); preferência, em igualdade de condições, em licitações, concursos e promoções (art. 440); sem desconto de vencimentos (art. 441). O jurado que faltar sem causa legítima ou retirar-se antes da dispensa paga multa de 1 a 10 salários mínimos (art. 442); a escusa deve ser apresentada, em regra, até a chamada (art. 443); o jurado responde criminalmente como se fosse funcionário público (art. 445).',
      AVISO],
      'Pronúncia = há prova da materialidade e indícios suficientes de autoria (vai a júri). Impronúncia = faltou isso (pode haver nova denúncia com prova nova). Absolvição sumária = o juiz já absolve (4 hipóteses do art. 415).'),
    step('Exemplo prático', [
      'Caso 1 — há prova do homicídio e indícios suficientes de autoria: pronúncia (art. 413); recurso: RESE.',
      'Caso 2 — falta prova da materialidade: impronúncia (art. 414); recurso: apelação; nova denúncia possível com prova nova.',
      'Caso 3 — provado que o réu não foi o autor: absolvição sumária (art. 415, II); recurso: apelação.',
      'Caso 4 — o cidadão sorteado falta sem justificativa: multa de 1 a 10 salários mínimos (art. 442).',
      'Caso 5 — o jurado recusa o serviço por convicção religiosa: serviço alternativo, sob pena de suspensão de direitos políticos (art. 438).'],
      'Pergunta-teste: "o juiz está convencido da materialidade e de indícios suficientes?" Sim: pronúncia. Não: impronúncia.'),
    step('Resumo essencial', ['Decisões da primeira fase.'], undefined, { caption: 'Júri: primeira fase', head: ['Decisão', 'Art.', 'Recurso'], rows: [
      ['Pronúncia', '413', 'Recurso em sentido estrito (art. 581, IV)'],
      ['Impronúncia', '414', 'Apelação (art. 416)'],
      ['Absolvição sumária', '415', 'Apelação (art. 416)'],
      ['Desclassificação', '419', 'Remessa ao juiz competente']] }),
    step('O que memorizar', ['• 1ª fase: resposta em 10 dias, até 8 testemunhas, conclusão em 90 dias.', '• Debates: 20 minutos + 10.', '• Pronúncia (RESE); impronúncia e absolvição sumária (apelação).', '• Jurado: 18 anos, multa de 1 a 10 salários mínimos, isenção para maiores de 70 que pedirem.'] ),
  ],
}
const u = mkW('ppu', 'dpp-1')
export const JURI1_QUESTIONS: Question[] = [
  u(1, 'Na primeira fase do procedimento do júri, o prazo máximo para a conclusão do procedimento é de', ['90 dias.', 'Art. 412.'], [['60 dias.', 'é o prazo da audiência no rito ordinário.'], ['30 dias.', 'é o prazo da audiência no rito sumário.'], ['120 dias.', 'não é o prazo legal.'], ['10 dias.', 'é o prazo da resposta à acusação.']], 'Médio'),
  u(2, 'Convencido o juiz da materialidade do fato e da existência de indícios suficientes de autoria ou de participação, ele deve', ['pronunciar o acusado, em decisão fundamentada.', 'Art. 413.'], [['impronunciar o acusado.', 'a impronúncia ocorre quando faltam materialidade ou indícios suficientes.'], ['absolver sumariamente o acusado.', 'este exige prova das hipóteses do art. 415.'], ['condenar o acusado, dispensando o júri.', 'o julgamento de mérito é do júri.'], ['arquivar o processo.', 'o arquivamento não é a consequência.']], 'Fácil'),
  u(3, 'Contra a decisão de impronúncia ou de absolvição sumária cabe', ['apelação.', 'Art. 416.'], [['recurso em sentido estrito.', 'o RESE cabe contra a pronúncia.'], ['embargos infringentes.', 'não é o recurso do art. 416.'], ['revisão criminal.', 'a revisão é ação autônoma contra decisão transitada em julgado.'], ['carta testemunhável.', 'só cabe quando se nega seguimento a recurso.']], 'Fácil'),
  u(4, 'A multa aplicada ao jurado que, sem causa legítima, deixa de comparecer ou se retira antes de dispensado, nos termos do art. 442, é de', ['1 a 10 salários mínimos, conforme sua condição econômica.', 'Art. 442.'], [['10 a 100 salários mínimos.', 'é a multa do defensor que abandona o processo (art. 265).'], ['1 a 5 salários mínimos.', 'não corresponde ao texto.'], ['5 a 20 salários mínimos.', 'não corresponde ao texto.'], ['um salário mínimo fixo.', 'a lei prevê intervalo.']], 'Médio'),
  u(5, 'Segundo o art. 437 do CPP, podem requerer dispensa do serviço do júri os maiores de', ['70 anos.', 'Art. 437, IX.'], [['60 anos.', 'a idade prevista é 70.'], ['65 anos.', 'a idade prevista é 70.'], ['75 anos.', 'a idade prevista é 70.'], ['80 anos.', 'a idade prevista é 70.']], 'Fácil'),
]
const cu = mkC('ppu', 'dpp-1', 'pp-juri1')
export const JURI1_CARDS: Flashcard[] = [
  cu(1, 'Quais as duas fases do júri?', 'Sumário da culpa (arts. 406 a 421), perante o juiz togado, e julgamento em plenário pelo Conselho de Sentença (a partir do art. 422).'),
  cu(2, 'Em que prazo conclui-se a primeira fase?', '90 dias (art. 412).'),
  cu(3, 'Diferença entre pronúncia, impronúncia e absolvição sumária?', 'Pronúncia: materialidade + indícios de autoria (vai a júri). Impronúncia: falta isso. Absolvição sumária: art. 415, provada uma das hipóteses.'),
  cu(4, 'Qual o recurso contra a pronúncia? E contra a impronúncia?', 'Pronúncia: recurso em sentido estrito (art. 581, IV). Impronúncia e absolvição sumária: apelação (art. 416).'),
  cu(5, 'Quem é isento do serviço do júri?', 'Presidente, ministros, governadores, parlamentares, prefeitos, magistrados, MP, Defensoria, segurança pública, militares em serviço ativo, maiores de 70 que pedirem etc. (art. 437).'),
  cu(6, 'Qual a multa do jurado faltoso?', 'De 1 a 10 salários mínimos, conforme sua condição econômica (art. 442).'),
]

// ───────── 5. Júri: sessão de julgamento
export const JURI2_LESSON: Lesson = {
  id: 'pp-juri2', topicId: 'dpp-1', title: 'CPP arts. 453 a 472 e 482 a 491: sessão do júri, Conselho de Sentença, quesitos e votação', questionIds: qids('ppv'),
  steps: [
    step('Entenda', [
      'Antes da sessão (arts. 454 a 461): o juiz presidente decide sobre dispensas, escusas e pedidos de adiamento. Se o MP não comparecer, o julgamento é adiado para o primeiro dia desimpedido da mesma reunião, com comunicação ao Procurador-Geral (art. 455). Se faltar o defensor sem escusa legítima, o presidente da OAB seccional é comunicado; o adiamento por esse motivo só ocorre uma vez; se o acusado não tiver outro defensor, a Defensoria Pública será intimada, com intervalo mínimo de 10 dias para a nova data (art. 456). O julgamento não é adiado pela ausência do acusado solto, do assistente ou do advogado do querelante regularmente intimados (art. 457). A testemunha faltosa sujeita-se à multa do art. 436, § 2º (art. 458); as testemunhas ficam incomunicáveis (art. 460).',
      'Abertura da sessão (arts. 462 a 466): verifica-se se a urna contém as cédulas dos 25 jurados sorteados; se comparecerem pelo menos 15, o juiz declara instalados os trabalhos (art. 463). Não havendo número, sorteiam-se suplentes e marca-se nova data (art. 464). O juiz adverte os jurados dos impedimentos, suspeições e incompatibilidades (arts. 448 e 449) e de que, uma vez sorteados, não poderão comunicar-se entre si nem manifestar sua opinião sobre o processo, sob pena de exclusão do Conselho e multa (art. 466, § 1º).',
      'Formação do Conselho de Sentença (arts. 467 a 472): o juiz sorteia 7 jurados. A defesa e depois o MP podem recusar, cada um, até 3 jurados sem motivação (recusas peremptórias, art. 468). Havendo mais de um réu, as recusas podem ser feitas por um só defensor (art. 469); a separação só ocorre se as recusas impedirem a formação do Conselho (menos de 7 jurados). Compromisso (art. 472): o juiz, de pé, exorta os jurados, e cada um, chamado nominalmente, responde: "Assim o prometo".',
      'Questionário e votação (arts. 482 a 491): o Conselho de Sentença será questionado sobre matéria de fato e se o acusado deve ser absolvido. Os quesitos serão formulados em proposições afirmativas, simples e distintas (art. 482), na ordem: I - a materialidade do fato; II - a autoria ou participação; III - se o acusado deve ser absolvido; IV - se existe causa de diminuição de pena alegada pela defesa; V - se existe circunstância qualificadora ou causa de aumento de pena reconhecidas na pronúncia (art. 483). Se mais de 3 jurados responderem negativamente a qualquer dos dois primeiros quesitos, o acusado é absolvido (§ 1º); respondidos afirmativamente por mais de 3 jurados os dois primeiros, será formulado o terceiro: "O jurado absolve o acusado?" (§ 2º). A votação é secreta: cada jurado recebe 7 cédulas "sim" e 7 "não" (art. 486), e as decisões são tomadas por maioria de votos (art. 489). Se a resposta a um quesito for contraditória com outras, o juiz explica e submete novamente a votação (art. 490).',
      AVISO],
      'Números do plenário: 25 jurados sorteados; 15 para instalar a sessão; 7 no Conselho; 3 recusas imotivadas por parte; votação secreta por maioria; mais de 3 negativas no 1º ou 2º quesito = absolvição.'),
    step('Exemplo prático', [
      'Caso 1 — comparecem 14 jurados: não há quórum; sorteiam-se suplentes e marca-se nova data (art. 464).',
      'Caso 2 — a defesa recusa 3 jurados sem justificar: permitido (art. 468). A quarta recusa precisa de motivo.',
      'Caso 3 — o defensor falta sem motivo e o acusado não tem outro: comunica-se a OAB; adia-se uma vez (art. 456).',
      'Caso 4 — 4 jurados respondem "não" ao quesito da autoria: o acusado é absolvido (art. 483, § 1º).',
      'Caso 5 — os 7 jurados votam "sim" na materialidade e na autoria: formula-se o quesito "o jurado absolve o acusado?" (art. 483, § 2º).'],
      'Pergunta-teste: "quantos?" 25 sorteados, 15 mínimos, 7 sentenciam, 3 recusas.'),
    step('Resumo essencial', ['Números e ordem.'], undefined, { caption: 'Plenário do júri', head: ['Item', 'Regra', 'Art.'], rows: [
      ['Jurados sorteados', '25', '462'],
      ['Quórum para instalar a sessão', '15', '463'],
      ['Conselho de Sentença', '7 jurados', '467'],
      ['Recusas peremptórias', '3 para a defesa e 3 para o MP', '468'],
      ['Decisão', 'Maioria de votos; votação secreta', '489 e 486'],
      ['Ordem dos quesitos', 'Materialidade, autoria, absolvição, diminuição, qualificadoras', '483']] }),
    step('O que memorizar', ['• 25 – 15 – 7 – 3.', '• Ordem dos quesitos: I materialidade; II autoria; III absolve?; IV diminuição; V qualificadoras/aumento.', '• Mais de 3 "não" em I ou II: absolvição.', '• Defensor ausente: adia só uma vez, com Defensoria intimada com 10 dias de antecedência.'] ),
  ],
}
const v = mkW('ppv', 'dpp-1')
export const JURI2_QUESTIONS: Question[] = [
  v(1, 'Para a instalação da sessão do Tribunal do Júri, exige-se o comparecimento de, no mínimo, quantos dos 25 jurados sorteados?', ['15.', 'Art. 463.'], [['7.', 'este é o número de jurados do Conselho de Sentença.'], ['12.', 'não é o quórum legal.'], ['20.', 'não é o quórum legal.'], ['25.', 'o quórum é de 15.']], 'Fácil'),
  v(2, 'O número de recusas peremptórias (sem motivação) a que a defesa tem direito na formação do Conselho de Sentença é de', ['3.', 'Art. 468.'], [['1.', 'a lei concede 3.'], ['2.', 'a lei concede 3.'], ['5.', 'a lei concede 3.'], ['7.', 'este é o número de jurados do Conselho.']], 'Fácil'),
  v(3, 'Segundo o art. 483 do CPP, a ordem correta dos quesitos é', ['materialidade; autoria ou participação; absolvição; causa de diminuição; qualificadora ou causa de aumento.', 'Art. 483, I a V.'], [['autoria; materialidade; qualificadora; absolvição; diminuição.', 'a materialidade vem primeiro, e o quesito da absolvição vem antes das causas de diminuição e qualificadoras.'], ['absolvição; materialidade; autoria; diminuição; qualificadora.', 'a absolvição só é perguntada depois dos dois primeiros.'], ['materialidade; autoria; qualificadora; diminuição; absolvição.', 'o quesito da absolvição é o terceiro.'], ['diminuição; qualificadora; materialidade; autoria; absolvição.', 'a ordem legal começa pela materialidade.']], 'Médio'),
  v(4, 'Se mais de 3 jurados responderem negativamente ao quesito da materialidade ou da autoria, o resultado é', ['a absolvição do acusado, encerrando-se a votação.', 'Art. 483, § 1º.'], [['a repetição da votação.', 'não há repetição.'], ['a formulação do quesito sobre qualificadoras.', 'a votação encerra com a absolvição.'], ['a remessa ao tribunal.', 'o juiz profere a sentença absolutória.'], ['a dissolução do Conselho.', 'o Conselho decide pela absolvição.']], 'Médio'),
  v(5, 'A votação dos quesitos no júri é feita com', ['cédulas "sim" e "não" (sete de cada) e por maioria de votos.', 'Arts. 486 e 489.'], [['voto aberto, por escrito, com identificação do jurado.', 'a votação é sigilosa.'], ['unanimidade obrigatória.', 'a decisão é por maioria.'], ['três cédulas por jurado.', 'cada jurado recebe sete cédulas de cada tipo.'], ['voto de qualidade do presidente.', 'o juiz não vota.']], 'Médio'),
]
const cv = mkC('ppv', 'dpp-1', 'pp-juri2')
export const JURI2_CARDS: Flashcard[] = [
  cv(1, 'Quais os números do plenário do júri?', '25 jurados sorteados, 15 para instalar, 7 no Conselho de Sentença, 3 recusas peremptórias por parte.'),
  cv(2, 'Qual a ordem dos quesitos (art. 483)?', 'Materialidade; autoria/participação; absolvição; causa de diminuição; qualificadora/causa de aumento.'),
  cv(3, 'Quando o acusado é absolvido logo nos primeiros quesitos?', 'Quando mais de 3 jurados respondem "não" ao quesito da materialidade ou da autoria (art. 483, § 1º).'),
  cv(4, 'O que acontece se o defensor faltar ao julgamento sem escusa legítima?', 'Comunica-se a OAB; adia-se uma única vez; se o acusado não tiver outro defensor, intima-se a Defensoria com 10 dias de intervalo (art. 456).'),
  cv(5, 'Como se vota?', 'Em sala especial, com cédulas opacas (sete "sim" e sete "não"), em votação secreta e por maioria (arts. 485 a 489).'),
  cv(6, 'O que o juiz adverte aos jurados sorteados (art. 466, § 1º)?', 'Que não podem comunicar-se entre si nem manifestar opinião sobre o processo, sob pena de exclusão e multa.'),
]
