import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Atualidades (Anexo VIII): atual-1 fatos a partir do 1º semestre de 2026; atual-2 Lei 13.146/2015, arts. 1º a 13 e 34 a 38.
// FATOS: pesquisados na web em 04/11/2026; só entram os confirmados por fonte oficial ou por 2+ veículos. Conteúdo datado: reconfira antes da prova.
// LEI: o Planalto bloqueia acesso automatizado; o texto foi paráfrase conferida em fontes secundárias (normas.leg.br e outras). Confirme em planalto.gov.br.

// ───────── atual-1
export const FATOS_LESSON: Lesson = {
  id: 'atual-fatos-2026', topicId: 'atual-1', title: 'Fatos de 2026: eleição, economia, STF, Copa e cultura', questionIds: ['fat-1', 'fat-2', 'fat-3', 'fat-4', 'fat-5'],
  steps: [
    step('Entenda', ['O edital cobra "fatos políticos, econômicos, sociais e culturais a partir do 1º semestre de 2026". Como a prova é em 14/03/2027, cabe estudar o que aconteceu de janeiro de 2026 em diante, e não só o 1º semestre.',
      'Estratégia: guarde o FATO CENTRAL (quem, o quê, quando, quanto) e um DETALHE que a banca gosta de cobrar (número, ordem, "primeira vez"). Questões de Atualidades costumam pedir o dado exato ou uma relação de causa e efeito.',
      'Aviso importante: esta aula foi montada com pesquisa na web em 04/11/2026, com fatos confirmados em fonte oficial (por exemplo, o TSE) ou em dois ou mais veículos. Notícias mudam; complemente com jornais e, perto da prova, com um resumo atualizado. Fatos de uma única fonte foram deixados de fora de propósito.'],
      'Para memorizar: monte uma linha do tempo de 2026 (janeiro → outubro) com um fato por mês. A ordem ajuda a lembrar os números.'),
    step('Fatos confirmados', ['POLÍTICA — Eleição presidencial: o 2º turno foi em 25/10/2026. Luiz Inácio Lula da Silva (PT) foi reeleito, com 64.256.232 votos (51,79% dos votos válidos), contra Flávio Bolsonaro (PL), com 59.826.041 votos (48,21%) (fonte: TSE). Abstenção de cerca de 19,2% no 2º turno.',
      'JUDICIÁRIO — STF: em 29/04/2026, o Senado rejeitou a indicação de Jorge Messias ao Supremo, com 42 votos contrários. Foi o primeiro indicado ao STF rejeitado em 132 anos (várias fontes).',
      'ECONOMIA — Juros: a Selic foi mantida em 15% ao ano em janeiro; depois houve cortes consecutivos de 0,25 ponto percentual: 14,25% (junho), 14% (agosto) e 13,75% (16/09/2026, o quinto corte consecutivo do ciclo). O Copom define a Selic; em outubro não há reunião (o calendário tem oito reuniões por ano).',
      'ECONOMIA — Salário mínimo e IR: o mínimo de 2026 é R$ 1.621 (reajuste de 6,79% sobre R$ 1.518). Desde janeiro de 2026, rendimentos mensais de até R$ 5.000 ficam isentos de Imposto de Renda; entre R$ 5.000,01 e R$ 7.350 há redução parcial; acima disso vale a tabela progressiva (alíquota máxima de 27,5%).',
      'ESPORTE/SOCIAL — Copa do Mundo: a Copa de 2026 foi a primeira com 48 seleções, sediada conjuntamente por Estados Unidos, Canadá e México. A Espanha foi campeã ao vencer a Argentina por 1 x 0 na final, em 19/07/2026.',
      'CULTURA — Oscar: na cerimônia de 15/03/2026, "Uma Batalha Após a Outra" foi o Melhor Filme. O brasileiro "O Agente Secreto" concorreu, entre outras, a Melhor Filme, Filme Internacional e Ator (Wagner Moura), mas não recebeu prêmios.'],
      'Atenção a "primeira vez": "primeira vez em 132 anos" (rejeição de indicado ao STF) e "primeira Copa com 48 seleções" são detalhes típicos de questão.'),
    step('Resumo essencial', ['Linha do tempo e números.'], undefined, { caption: 'Fatos de 2026', head: ['Quando', 'Fato', 'Dado-chave'], rows: [
      ['Jan/2026', 'Salário mínimo e isenção do IR', 'R$ 1.621; IR isento até R$ 5.000'],
      ['15/03/2026', 'Oscar', 'Melhor Filme: Uma Batalha Após a Outra'],
      ['29/04/2026', 'Senado rejeita Jorge Messias ao STF', '42 votos contrários; 1º em 132 anos'],
      ['Jan–set/2026', 'Selic', '15% → 14,25% → 14% → 13,75%'],
      ['19/07/2026', 'Final da Copa', 'Espanha 1 x 0 Argentina'],
      ['25/10/2026', '2º turno presidencial', 'Lula 51,79% × Flávio Bolsonaro 48,21%']] }),
    step('O que memorizar', ['• Lula reeleito no 2º turno de 25/10/2026, com 51,79% dos votos válidos.',
      '• Senado rejeitou Jorge Messias ao STF em 29/04/2026 (42 votos contrários; 1º caso em 132 anos).',
      '• Selic: 15% em janeiro → 13,75% em 16/09/2026 (cinco cortes seguidos de 0,25 p.p. no ciclo).',
      '• Salário mínimo R$ 1.621; IR isento até R$ 5.000 por mês.',
      '• Copa 2026: 48 seleções; EUA, Canadá e México; campeã Espanha.',
      '• Oscar 2026: Melhor Filme "Uma Batalha Após a Outra".'] ),
  ],
}
const fq = mkQ('fat', 'atual-1')
export const FATOS_QUESTIONS: Question[] = [
  fq(1, 'No 2º turno da eleição presidencial de 25 de outubro de 2026, foi eleito, segundo o TSE,', [
    o('A', 'Flávio Bolsonaro, com 51,79% dos votos válidos.', 'Errada: Flávio Bolsonaro obteve 48,21% dos votos válidos.'),
    o('B', 'Luiz Inácio Lula da Silva, com 51,79% dos votos válidos.', 'Correta: Lula foi reeleito com 64.256.232 votos.'),
    o('C', 'Luiz Inácio Lula da Silva, com 48,21% dos votos válidos.', 'Errada: 48,21% foi o percentual do segundo colocado.'),
    o('D', 'Flávio Bolsonaro, com 48,21% dos votos válidos.', 'Errada: esse percentual não elegeu ninguém; Lula venceu.'),
    o('E', 'nenhum candidato, pois não houve 2º turno.', 'Errada: o 2º turno ocorreu em 25 de outubro.')], 'B', 'Fácil'),
  fq(2, 'Em abril de 2026, o Senado Federal rejeitou a indicação de Jorge Messias para uma vaga no', [
    o('A', 'Superior Tribunal de Justiça.', 'Errada: a indicação rejeitada era para o Supremo Tribunal Federal.'),
    o('B', 'Tribunal Superior Eleitoral.', 'Errada: a indicação era para o STF.'),
    o('C', 'Tribunal de Contas da União.', 'Errada: a indicação era para o STF.'),
    o('D', 'Supremo Tribunal Federal, o que não ocorria havia 132 anos.', 'Correta: foi a primeira rejeição de indicado ao STF em 132 anos.'),
    o('E', 'Conselho Nacional de Justiça.', 'Errada: a indicação era para o STF.')], 'D', 'Médio'),
  fq(3, 'Em 16 de setembro de 2026, o Copom reduziu a taxa Selic para', [
    o('A', '15,00% ao ano.', 'Errada: foi o patamar mantido em janeiro, antes dos cortes.'),
    o('B', '14,25% ao ano.', 'Errada: foi o patamar atingido em junho.'),
    o('C', '14,00% ao ano.', 'Errada: foi o patamar de agosto, antes do corte de setembro.'),
    o('D', '13,75% ao ano.', 'Correta: quinto corte consecutivo de 0,25 ponto percentual do ciclo.'),
    o('E', '13,00% ao ano.', 'Errada: o corte de setembro foi de apenas 0,25 ponto percentual.')], 'D', 'Médio'),
  fq(4, 'Em 2026, o salário mínimo nacional passou a ser de', [
    o('A', 'R$ 1.518.', 'Errada: foi o valor anterior, de 2025.'),
    o('B', 'R$ 1.621.', 'Correta: reajuste de 6,79% sobre R$ 1.518.'),
    o('C', 'R$ 1.636.', 'Errada: seria o valor sem a limitação do arcabouço fiscal, segundo o governo.'),
    o('D', 'R$ 1.700.', 'Errada: não corresponde ao valor fixado.'),
    o('E', 'R$ 1.500.', 'Errada: valor inferior ao anterior.')], 'B', 'Fácil'),
  fq(5, 'A Copa do Mundo de 2026 foi a primeira disputada com 48 seleções, sediada por Estados Unidos, Canadá e México, e teve como campeã', [
    o('A', 'a Argentina.', 'Errada: a Argentina perdeu a final por 1 x 0.'),
    o('B', 'o Brasil.', 'Errada: o Brasil não chegou à final.'),
    o('C', 'a França.', 'Errada: a final foi Espanha x Argentina.'),
    o('D', 'a Alemanha.', 'Errada: a final foi Espanha x Argentina.'),
    o('E', 'a Espanha.', 'Correta: venceu a Argentina por 1 x 0 em 19/07/2026.')], 'E', 'Fácil'),
]
const fc = mkC('fat', 'atual-1', 'atual-fatos-2026')
export const FATOS_CARDS: Flashcard[] = [
  fc(1, 'Quem venceu o 2º turno de 2026 e com quanto?', 'Lula (PT), com 51,79% dos votos válidos, contra Flávio Bolsonaro (PL), 48,21%. (TSE)'),
  fc(2, 'O que aconteceu com a indicação de Jorge Messias ao STF?', 'Foi rejeitada pelo Senado em 29/04/2026 (42 votos contrários), a primeira rejeição em 132 anos.'),
  fc(3, 'Qual a Selic após o Copom de 16/09/2026?', '13,75% ao ano (quinto corte consecutivo de 0,25 p.p.).'),
  fc(4, 'Qual o salário mínimo de 2026 e a faixa de isenção do IR?', 'R$ 1.621; IR isento até R$ 5.000 mensais (redução parcial até R$ 7.350).'),
  fc(5, 'Quem foi a campeã da Copa de 2026?', 'Espanha, 1 x 0 na Argentina (19/07/2026), em Copa com 48 seleções e sede tripla (EUA, Canadá e México).'),
  fc(6, 'Qual filme levou o Oscar de Melhor Filme em 2026?', '"Uma Batalha Após a Outra"; "O Agente Secreto" (Brasil) não recebeu prêmios.'),
]

// ───────── atual-2 (parte 1: arts. 1º a 13)
const AVISO = 'Aviso: a redação abaixo é uma paráfrase fiel conferida em fontes secundárias, porque o Planalto não abre para acesso automatizado. Para decorar o texto literal, use planalto.gov.br.'
export const EPD1_LESSON: Lesson = {
  id: 'atual-epd-1-13', topicId: 'atual-2', title: 'Estatuto da Pessoa com Deficiência (Lei 13.146/2015): arts. 1º a 13', questionIds: ['epd1-1', 'epd1-2', 'epd1-3', 'epd1-4', 'epd1-5'],
  steps: [
    step('Entenda', ['A Lei 13.146/2015 institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência). Seu objetivo é assegurar e promover, em condições de igualdade, o exercício dos direitos e das liberdades fundamentais da pessoa com deficiência, visando à inclusão social e à cidadania. Tem como base a Convenção sobre os Direitos das Pessoas com Deficiência da ONU (art. 1º).',
      'Conceito (art. 2º): pessoa com deficiência é aquela que tem impedimento de longo prazo de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade, em igualdade de condições com as demais pessoas. Quando necessária, a avaliação é BIOPSICOSSOCIAL, feita por equipe multiprofissional e interdisciplinar, considerando impedimentos nas funções e estruturas do corpo, fatores socioambientais, psicológicos e pessoais, limitação no desempenho de atividades e restrição de participação.',
      'Art. 3º traz as definições (acessibilidade, desenho universal, tecnologia assistiva, barreiras, comunicação, adaptações razoáveis, mobilidade reduzida, atendente pessoal, profissional de apoio escolar, acompanhante etc.). As BARREIRAS podem ser urbanísticas, arquitetônicas, nos transportes, nas comunicações e na informação, atitudinais e tecnológicas.',
      AVISO],
      'Para lembrar das barreiras, pense nos prefixos: urbanísticas (ruas), arquitetônicas (prédios), transportes, comunicações/informação, atitudinais (preconceito) e tecnológicas.'),
    step('Direitos e garantias (arts. 4º a 13)', ['Art. 4º: toda pessoa com deficiência tem direito à igualdade de oportunidades e não sofrerá nenhuma espécie de discriminação. Considera-se discriminação toda forma de distinção, restrição ou exclusão que prejudique o exercício de direitos, inclusive a recusa de adaptações razoáveis e de fornecimento de tecnologias assistivas. A pessoa não é obrigada a fruir de benefícios decorrentes de ação afirmativa.',
      'Art. 5º: proteção contra toda forma de negligência, discriminação, exploração, violência, tortura, crueldade, opressão e tratamento desumano ou degradante. Crianças, adolescentes, mulheres e idosos com deficiência estão em situação de maior vulnerabilidade.',
      'Art. 6º: a deficiência NÃO afeta a plena capacidade civil, inclusive para casar-se e constituir união estável; exercer direitos sexuais e reprodutivos; decidir sobre o número de filhos; conservar sua fertilidade (é VEDADA a esterilização compulsória); exercer o direito à família e à convivência; e exercer guarda, tutela, curatela e adoção, em igualdade de oportunidades.',
      'Art. 7º: é dever de todos comunicar à autoridade competente qualquer ameaça ou violação de direitos; juízes e tribunais que tomarem conhecimento de violações devem remeter peças ao Ministério Público.',
      'Art. 8º: é dever do Estado, da sociedade e da família assegurar, COM PRIORIDADE, os direitos (vida, saúde, educação, trabalho, moradia, transporte, cultura, acessibilidade, dignidade etc.).',
      'Art. 9º: direito a ATENDIMENTO PRIORITÁRIO (proteção e socorro; serviços ao público; recursos humanos e tecnológicos; transporte acessível; informação acessível; restituição do imposto de renda; tramitação processual e procedimentos judiciais e administrativos em que for parte). Os direitos são extensivos ao acompanhante ou atendente pessoal, EXCETO quanto à restituição do imposto de renda e à tramitação processual. Nos serviços de emergência, a prioridade segue os protocolos de atendimento médico.',
      'Art. 10: compete ao poder público garantir a dignidade da pessoa com deficiência ao longo de toda a vida; em situações de risco, emergência ou calamidade, ela é considerada vulnerável.',
      'Art. 11: ninguém pode ser obrigado a intervenção clínica ou cirúrgica, tratamento ou institucionalização forçada; o consentimento de pessoa curatelada pode ser suprido, na forma da lei.',
      'Art. 12: o consentimento prévio, livre e esclarecido é indispensável para tratamento, procedimento, hospitalização e pesquisa científica. A pesquisa com tutelados ou curatelados é excepcional.',
      'Art. 13: só se atende sem consentimento prévio, livre e esclarecido em caso de risco de morte e de emergência em saúde, resguardado o superior interesse e adotadas as salvaguardas legais.'],
      'Atenção ao art. 9º: acompanhante tem os direitos do atendimento prioritário, MENOS restituição do IR e tramitação processual. É pegadinha clássica.'),
    step('Resumo essencial', ['Artigo por artigo.'], undefined, { caption: 'Arts. 1º a 13', head: ['Artigo', 'Conteúdo', 'Palavra-chave'], rows: [
      ['1º', 'Institui o Estatuto; base na Convenção da ONU', 'Inclusão, cidadania'],
      ['2º', 'Conceito de pessoa com deficiência; avaliação biopsicossocial', 'Impedimento de longo prazo + barreiras'],
      ['3º', 'Definições (acessibilidade, barreiras, tecnologia assistiva…)', '6 tipos de barreiras'],
      ['4º', 'Igualdade e não discriminação', 'Recusa de adaptação razoável = discriminação'],
      ['5º', 'Proteção contra violência e maus-tratos', 'Vulnerabilidade'],
      ['6º', 'Capacidade civil plena', 'Esterilização compulsória vedada'],
      ['7º', 'Dever de comunicar violações', 'Ministério Público'],
      ['8º', 'Dever do Estado, sociedade e família', 'Com prioridade'],
      ['9º', 'Atendimento prioritário', 'Acompanhante, exceto IR e tramitação'],
      ['10', 'Dignidade ao longo da vida', 'Vulnerável em calamidade'],
      ['11 a 13', 'Consentimento e tratamento', 'Livre e esclarecido; exceção: risco de morte']] }),
    step('O que memorizar', ['• Definição: impedimento de longo prazo + barreiras → participação plena.',
      '• Avaliação biopsicossocial, por equipe multiprofissional e interdisciplinar.',
      '• Recusa de adaptação razoável ou de tecnologia assistiva = discriminação.',
      '• Capacidade civil plena; esterilização compulsória vedada.',
      '• Atendimento prioritário: acompanhante tem, exceto restituição de IR e tramitação processual.',
      '• Consentimento livre e esclarecido; sem consentimento só em risco de morte ou emergência.'] ),
  ],
}
const e1 = mkQ('epd1', 'atual-2')
export const EPD1_QUESTIONS: Question[] = [
  e1(1, 'Segundo a Lei 13.146/2015, a avaliação da deficiência, quando necessária, será', [
    o('A', 'exclusivamente médica, realizada por um único profissional.', 'Errada: a avaliação não é exclusivamente médica nem individual.'),
    o('B', 'biopsicossocial, realizada por equipe multiprofissional e interdisciplinar.', 'Correta: art. 2º, § 1º.'),
    o('C', 'apenas social, feita por assistente social.', 'Errada: é biopsicossocial e multiprofissional.'),
    o('D', 'obrigatória em todos os casos, sem exceção.', 'Errada: é feita quando necessária.'),
    o('E', 'feita somente por autoridade judicial.', 'Errada: não depende de autoridade judicial.')], 'B', 'Médio'),
  e1(2, 'De acordo com o Estatuto da Pessoa com Deficiência, constitui discriminação por motivo de deficiência, inclusive,', [
    o('A', 'a adoção de ações afirmativas.', 'Errada: as ações afirmativas não são discriminação; a pessoa não é obrigada a fruir seus benefícios.'),
    o('B', 'o atendimento prioritário em serviços públicos.', 'Errada: é um direito garantido pelo art. 9º.'),
    o('C', 'a recusa de adaptações razoáveis e de fornecimento de tecnologias assistivas.', 'Correta: art. 4º, § 1º.'),
    o('D', 'o uso de tecnologia assistiva.', 'Errada: é um recurso de apoio.'),
    o('E', 'a avaliação biopsicossocial.', 'Errada: é um instrumento previsto pela lei.')], 'C', 'Médio'),
  e1(3, 'Nos termos do art. 6º do Estatuto, a deficiência não afeta a plena capacidade civil da pessoa, inclusive para', [
    o('A', 'ser submetida à esterilização compulsória.', 'Errada: a esterilização compulsória é vedada.'),
    o('B', 'ser internada à força em qualquer hipótese.', 'Errada: ninguém pode ser obrigado a institucionalização forçada (art. 11).'),
    o('C', 'casar-se e constituir união estável.', 'Correta: art. 6º, I.'),
    o('D', 'ser proibida de exercer a guarda e a adoção.', 'Errada: a lei garante guarda, tutela, curatela e adoção em igualdade de oportunidades.'),
    o('E', 'ficar dispensada de consentimento em pesquisas científicas.', 'Errada: o consentimento livre e esclarecido é indispensável (art. 12).')], 'C', 'Fácil'),
  e1(4, 'O atendimento prioritário garantido à pessoa com deficiência é extensivo ao acompanhante ou ao atendente pessoal, EXCETO quanto', [
    o('A', 'à proteção e ao socorro em quaisquer circunstâncias.', 'Errada: esse direito se estende ao acompanhante.'),
    o('B', 'ao atendimento em instituições de serviço ao público.', 'Errada: esse direito se estende ao acompanhante.'),
    o('C', 'à tramitação processual e à restituição do imposto de renda.', 'Correta: art. 9º, § 1º; esses direitos não se estendem.'),
    o('D', 'à disponibilização de pontos de parada acessíveis.', 'Errada: esse direito se estende ao acompanhante.'),
    o('E', 'ao acesso a informações em formatos acessíveis.', 'Errada: esse direito se estende ao acompanhante.')], 'C', 'Difícil'),
  e1(5, 'A pessoa com deficiência somente pode ser atendida sem seu consentimento prévio, livre e esclarecido nos casos de', [
    o('A', 'qualquer tratamento de interesse da família.', 'Errada: não existe essa hipótese na lei.'),
    o('B', 'risco de morte e de emergência em saúde.', 'Correta: art. 13, resguardado o superior interesse e adotadas as salvaguardas legais.'),
    o('C', 'internação por conveniência administrativa.', 'Errada: ninguém pode ser obrigado à institucionalização forçada.'),
    o('D', 'pesquisa científica, em qualquer caso.', 'Errada: a pesquisa com tutelados e curatelados é excepcional e exige requisitos.'),
    o('E', 'tratamento estético.', 'Errada: não há essa hipótese.')], 'B', 'Médio'),
]
const e1c = mkC('epd1', 'atual-2', 'atual-epd-1-13')
export const EPD1_CARDS: Flashcard[] = [
  e1c(1, 'Quem é pessoa com deficiência (art. 2º)?', 'Quem tem impedimento de longo prazo (físico, mental, intelectual ou sensorial) que, com barreiras, pode obstruir sua participação plena.'),
  e1c(2, 'Como é a avaliação da deficiência?', 'Biopsicossocial, por equipe multiprofissional e interdisciplinar.'),
  e1c(3, 'Que tipos de barreiras o art. 3º prevê?', 'Urbanísticas, arquitetônicas, nos transportes, nas comunicações e na informação, atitudinais e tecnológicas.'),
  e1c(4, 'O que é discriminação segundo o art. 4º?', 'Distinção, restrição ou exclusão que prejudique direitos, inclusive a recusa de adaptações razoáveis e de tecnologias assistivas.'),
  e1c(5, 'O que o art. 6º veda?', 'A esterilização compulsória; a deficiência não afeta a plena capacidade civil.'),
  e1c(6, 'O que não se estende ao acompanhante no atendimento prioritário?', 'Restituição do imposto de renda e tramitação processual (art. 9º, § 1º).'),
]

// ───────── atual-2 (parte 2: arts. 34 a 38)
export const EPD2_LESSON: Lesson = {
  id: 'atual-epd-34-38', topicId: 'atual-2', title: 'Estatuto da Pessoa com Deficiência: direito ao trabalho (arts. 34 a 38)', questionIds: ['epd2-1', 'epd2-2', 'epd2-3', 'epd2-4', 'epd2-5'],
  steps: [
    step('Entenda', ['Os arts. 34 a 38 tratam do DIREITO AO TRABALHO. Art. 34: a pessoa com deficiência tem direito ao trabalho de sua livre escolha e aceitação, em ambiente acessível e inclusivo, em igualdade de oportunidades com as demais pessoas.',
      '§ 1º: pessoas jurídicas de direito público, privado ou de qualquer natureza são obrigadas a garantir ambientes de trabalho acessíveis e inclusivos. § 2º: direito a condições justas e favoráveis de trabalho, incluindo igual remuneração por trabalho de igual valor. § 3º: é vedada qualquer restrição ou discriminação em razão da deficiência em todas as etapas (recrutamento, seleção, contratação, admissão, exames admissional e periódico, permanência, ascensão profissional e reabilitação), bem como a exigência de aptidão plena. § 4º: direito a cursos, treinamentos, educação continuada, planos de carreira, promoções, bonificações e incentivos em igualdade com os demais empregados. § 5º: acessibilidade em cursos de formação e capacitação.',
      'Art. 35: as políticas públicas de trabalho e emprego têm a finalidade de promover e garantir condições de acesso e de permanência da pessoa com deficiência no campo de trabalho. Parágrafo único: programas de estímulo ao empreendedorismo e ao trabalho autônomo (cooperativismo e associativismo) devem prever comercialização de bens e serviços, capacitação técnica e gerencial, assistência técnica e linha de crédito especial.',
      AVISO],
      'Frase-chave do art. 34: livre escolha e aceitação + ambiente acessível e inclusivo + igualdade de oportunidades.'),
    step('Habilitação, colocação competitiva e seleção (arts. 36 a 38)', ['Art. 36: o poder público deve implementar serviços e programas completos de HABILITAÇÃO e REABILITAÇÃO PROFISSIONAL para que a pessoa com deficiência possa ingressar, continuar ou retornar ao campo de trabalho, respeitados sua livre escolha, vocação e interesse. Equipe multidisciplinar indica o programa; a habilitação pode ocorrer em instituições de ensino ou, por formalização do contrato de emprego, em empresas, como a lei prevê.',
      'Art. 37: é modalidade de inclusão a COLOCAÇÃO COMPETITIVA, em igualdade de oportunidades com as demais pessoas, atendidos os requisitos de acessibilidade, o fornecimento de tecnologia assistiva e a adaptação razoável no ambiente de trabalho. A colocação competitiva pode ocorrer por meio de TRABALHO COM APOIO, observadas diretrizes como: prioridade a quem tem maior dificuldade de inserção; suportes individualizados (inclusive tecnologia assistiva, agente facilitador e apoio no ambiente de trabalho); respeito ao perfil vocacional e ao interesse; aconselhamento e apoio aos empregadores; avaliação periódica; articulação intersetorial das políticas públicas; participação de organizações da sociedade civil.',
      'Art. 38: a entidade contratada para realizar processo seletivo público ou privado para cargo, função ou emprego está obrigada a adotar normas compatíveis com a lei e com as demais normas de acessibilidade vigentes.'],
      'Distinga: HABILITAÇÃO = aprender a profissão/ocupação; REABILITAÇÃO = retornar ao trabalho depois de perder capacidade ou afastamento.'),
    step('Resumo essencial', ['Arts. 34 a 38.'], undefined, { caption: 'Direito ao trabalho', head: ['Artigo', 'Conteúdo', 'Palavra-chave'], rows: [
      ['34, caput', 'Trabalho de livre escolha e aceitação', 'Ambiente acessível e inclusivo'],
      ['34, § 1º', 'Obrigação das pessoas jurídicas de qualquer natureza', 'Ambientes acessíveis'],
      ['34, § 2º', 'Condições justas; igual remuneração por trabalho de igual valor', 'Igualdade salarial'],
      ['34, § 3º', 'Vedada discriminação em todas as etapas', 'Vedada exigência de aptidão plena'],
      ['35', 'Políticas públicas de trabalho e emprego', 'Acesso e permanência'],
      ['36', 'Habilitação e reabilitação profissional', 'Ingressar, continuar ou retornar'],
      ['37', 'Colocação competitiva; trabalho com apoio', 'Tecnologia assistiva e adaptação razoável'],
      ['38', 'Entidade que realiza processo seletivo', 'Normas de acessibilidade']] }),
    step('O que memorizar', ['• Trabalho de livre escolha e aceitação, em ambiente acessível e inclusivo.',
      '• Qualquer pessoa jurídica (pública, privada ou outra) deve garantir ambientes acessíveis.',
      '• Igual remuneração por trabalho de igual valor; vedada a exigência de aptidão plena.',
      '• Poder público oferece habilitação e reabilitação profissional.',
      '• Colocação competitiva (e trabalho com apoio) é modalidade de inclusão.',
      '• Quem faz o processo seletivo deve cumprir as normas de acessibilidade.'] ),
  ],
}
const e2 = mkQ('epd2', 'atual-2')
export const EPD2_QUESTIONS: Question[] = [
  e2(1, 'Segundo o art. 34 do Estatuto da Pessoa com Deficiência, a pessoa com deficiência tem direito ao trabalho', [
    o('A', 'designado pelo Estado, sem necessidade de aceitação.', 'Errada: o trabalho é de livre escolha e aceitação.'),
    o('B', 'de sua livre escolha e aceitação, em ambiente acessível e inclusivo.', 'Correta: art. 34, caput.'),
    o('C', 'apenas em entidades públicas.', 'Errada: a lei obriga pessoas jurídicas de direito público, privado ou de qualquer natureza.'),
    o('D', 'com remuneração inferior, em razão da deficiência.', 'Errada: a lei garante igual remuneração por trabalho de igual valor.'),
    o('E', 'somente em atividades de baixa complexidade.', 'Errada: não há essa restrição.')], 'B', 'Fácil'),
  e2(2, 'No contexto do direito ao trabalho, a Lei 13.146/2015 veda, expressamente, a discriminação em todas as etapas do vínculo, bem como', [
    o('A', 'o fornecimento de tecnologia assistiva.', 'Errada: a lei exige o fornecimento de tecnologia assistiva.'),
    o('B', 'a participação em cursos de capacitação.', 'Errada: a lei garante a participação.'),
    o('C', 'a promoção na carreira.', 'Errada: a lei garante planos de carreira e promoções em igualdade.'),
    o('D', 'a adaptação razoável do ambiente.', 'Errada: a lei exige a adaptação razoável.'),
    o('E', 'a exigência de aptidão plena.', 'Correta: art. 34, § 3º.')], 'E', 'Médio'),
  e2(3, 'De acordo com o art. 36, o poder público deve implementar serviços e programas completos de', [
    o('A', 'aposentadoria compulsória por deficiência.', 'Errada: não há essa previsão no artigo.'),
    o('B', 'habilitação profissional e de reabilitação profissional.', 'Correta: para que a pessoa possa ingressar, continuar ou retornar ao campo de trabalho.'),
    o('C', 'seleção exclusiva para cargos públicos.', 'Errada: não é o objeto do art. 36.'),
    o('D', 'trabalho forçado.', 'Errada: a lei garante trabalho de livre escolha e aceitação.'),
    o('E', 'substituição do trabalho por benefício assistencial.', 'Errada: a lei busca a inclusão no trabalho.')], 'B', 'Médio'),
  e2(4, 'A modalidade de inclusão da pessoa com deficiência no trabalho, em igualdade de oportunidades com as demais pessoas, que atende os requisitos de acessibilidade, o fornecimento de tecnologia assistiva e a adaptação razoável, é a', [
    o('A', 'colocação competitiva.', 'Correta: art. 37, caput; pode ocorrer por meio de trabalho com apoio.'),
    o('B', 'aposentadoria por invalidez.', 'Errada: não é modalidade de inclusão no trabalho.'),
    o('C', 'colocação exclusiva em oficinas protegidas.', 'Errada: a lei trata de colocação competitiva, em igualdade de oportunidades.'),
    o('D', 'dispensa de acessibilidade.', 'Errada: a acessibilidade é requisito.'),
    o('E', 'terceirização obrigatória.', 'Errada: não há essa previsão.')], 'A', 'Médio'),
  e2(5, 'A entidade contratada para realizar processo seletivo público ou privado para cargo, função ou emprego, nos termos do art. 38, está obrigada a', [
    o('A', 'reservar todas as vagas a pessoas com deficiência.', 'Errada: a lei não prevê essa reserva.'),
    o('B', 'divulgar o edital apenas em meio impresso.', 'Errada: não há essa previsão e isso poderia violar normas de acessibilidade.'),
    o('C', 'dispensar a pessoa com deficiência das provas.', 'Errada: não há essa previsão.'),
    o('D', 'adotar normas compatíveis com a lei e com as demais normas de acessibilidade vigentes.', 'Correta: art. 38.'),
    o('E', 'cobrar taxa de inscrição maior da pessoa com deficiência.', 'Errada: não há essa previsão e seria discriminatório.')], 'D', 'Médio'),
]
const e2c = mkC('epd2', 'atual-2', 'atual-epd-34-38')
export const EPD2_CARDS: Flashcard[] = [
  e2c(1, 'O que garante o art. 34, caput?', 'Direito ao trabalho de livre escolha e aceitação, em ambiente acessível e inclusivo, em igualdade de oportunidades.'),
  e2c(2, 'Quem deve garantir ambientes de trabalho acessíveis (art. 34, § 1º)?', 'Pessoas jurídicas de direito público, privado ou de qualquer natureza.'),
  e2c(3, 'O que é vedado no art. 34, § 3º?', 'Restrição ao trabalho e discriminação em todas as etapas, inclusive a exigência de aptidão plena.'),
  e2c(4, 'O que prevê o art. 35?', 'Políticas públicas para promover acesso e permanência no trabalho; apoio ao empreendedorismo e ao trabalho autônomo.'),
  e2c(5, 'O que o art. 36 manda o poder público implementar?', 'Serviços e programas de habilitação e reabilitação profissional.'),
  e2c(6, 'O que é colocação competitiva (art. 37)?', 'Inclusão no trabalho em igualdade de oportunidades, com acessibilidade, tecnologia assistiva e adaptação razoável; pode ser por trabalho com apoio.'),
]
export const ATUAL_LESSONS = [FATOS_LESSON, EPD1_LESSON, EPD2_LESSON]
export const ATUAL_QUESTIONS = spread([...FATOS_QUESTIONS, ...EPD1_QUESTIONS, ...EPD2_QUESTIONS], 1)
export const ATUAL_CARDS = [...FATOS_CARDS, ...EPD1_CARDS, ...EPD2_CARDS]
