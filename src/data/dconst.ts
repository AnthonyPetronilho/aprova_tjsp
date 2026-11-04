import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Direito Constitucional (Anexo VIII): CF Título II Cap. I (art. 5º), Cap. II (arts. 6º a 11), Cap. III (arts. 12 e 13);
// Título III Cap. VII Seções I e II (arts. 37 a 41); art. 92.
// Fonte do texto: PDF da CF/88 em site de tribunal de contas, lido em 04/11/2026 (o Planalto bloqueia acesso automatizado). Redação em paráfrase próxima;
// confirme o texto literal em planalto.gov.br, em especial os dispositivos alterados por emendas recentes.
const AVISO = 'Aviso: a redação abaixo é paráfrase próxima do texto da CF/88 conferida em fonte secundária (o Planalto não abre para acesso automatizado). Para decorar o texto literal, use planalto.gov.br.'

// ───────── art. 5º (I a XXXIV)
export const ART5A_LESSON: Lesson = {
  id: 'dc-art5a', topicId: 'dconst-1', title: 'CF art. 5º (1/2): direitos individuais e coletivos, incisos I a XXXIV', questionIds: ['cf5a-1', 'cf5a-2', 'cf5a-3', 'cf5a-4', 'cf5a-5'],
  steps: [
    step('Entenda', ['O art. 5º abre o Título II (Dos Direitos e Garantias Fundamentais), Capítulo I (Dos Direitos e Deveres Individuais e Coletivos). O caput afirma que todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se a brasileiros e a estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade.',
      'Incisos I a XIII (igualdade e liberdades): I mulheres e homens têm direitos e deveres iguais; II ninguém é obrigado a fazer ou deixar de fazer algo senão em virtude de lei (legalidade); III ninguém será submetido a tortura nem a tratamento desumano ou degradante; IV é livre a manifestação do pensamento, vedado o anonimato; V direito de resposta proporcional ao agravo, além de indenização por dano material, moral ou à imagem; VI liberdade de consciência e de crença; VII assistência religiosa; VIII ninguém será privado de direitos por crença ou convicção, salvo se a invocar para eximir-se de obrigação legal a todos imposta e recusar prestação alternativa; IX liberdade de expressão da atividade intelectual, artística, científica e de comunicação, independentemente de censura ou licença; X são invioláveis a intimidade, a vida privada, a honra e a imagem; XI a casa é asilo inviolável; XII é inviolável o sigilo da correspondência e das comunicações; XIII é livre o exercício de qualquer trabalho, ofício ou profissão, atendidas as qualificações profissionais que a lei estabelecer.',
      'Incisos XIV a XXI (informação, reunião, associação): XIV acesso à informação, resguardado o sigilo da fonte; XV livre locomoção no território nacional em tempo de paz; XVI reuniões pacíficas, sem armas, em locais abertos ao público, independentemente de autorização, desde que não frustrem outra reunião anteriormente convocada para o mesmo local, mediante prévio aviso à autoridade; XVII é plena a liberdade de associação para fins lícitos, vedada a de caráter paramilitar; XVIII criação de associações e cooperativas independe de autorização, vedada a interferência estatal; XIX associações só podem ser compulsoriamente dissolvidas ou ter atividades suspensas por decisão judicial (a dissolução exige trânsito em julgado); XX ninguém será compelido a associar-se ou a permanecer associado; XXI entidades associativas, quando expressamente autorizadas, têm legitimidade para representar seus filiados.',
      'Incisos XXII a XXXIV (propriedade e demais): XXII garantido o direito de propriedade; XXIII a propriedade atenderá à sua função social; XXIV desapropriação por necessidade ou utilidade pública, ou por interesse social, mediante justa e prévia indenização em dinheiro, ressalvados os casos da própria Constituição; XXV requisição em caso de iminente perigo público, com indenização ulterior se houver dano; XXVI pequena propriedade rural familiar não será penhorada por débitos decorrentes da atividade produtiva; XXVII a XXIX direitos autorais e propriedade industrial; XXX herança; XXXI sucessão de bens de estrangeiros; XXXII defesa do consumidor; XXXIII direito de receber dos órgãos públicos informações, no prazo da lei, sob pena de responsabilidade, ressalvadas as sigilosas; XXXIV são assegurados, independentemente do pagamento de taxas, o direito de petição e a obtenção de certidões em repartições públicas para defesa de direitos e esclarecimento de situações de interesse pessoal.',
      AVISO],
      'Regra de ouro: quase toda questão do art. 5º troca uma palavra do texto (por exemplo, "prévia" por "posterior", "dinheiro" por "títulos", "dia" por "noite"). Memorize as palavras-chave.'),
    step('Exemplo prático', ['Caso 1 — casa (XI): ninguém pode nela penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro (a qualquer hora), ou, durante o dia, por determinação judicial.',
      'Caso 2 — reunião (XVI): um protesto pacífico, sem armas, em praça pública, independe de autorização; exige apenas prévio aviso à autoridade.',
      'Caso 3 — desapropriação (XXIV): o Estado precisa pagar justa e prévia indenização em dinheiro (exceções constitucionais, como a desapropriação-sanção do art. 182 e do art. 184).',
      'Caso 4 — sigilo (XII): a interceptação telefônica depende de ordem judicial, para fins de investigação criminal ou instrução processual penal, na forma da lei.',
      'Caso 5 — associação (XIX): uma associação só pode ser dissolvida contra a vontade por decisão judicial transitada em julgado; a suspensão de atividades exige decisão judicial (não precisa de trânsito em julgado).'],
      'Pergunta-teste: "quem decide?" Casa à noite: ninguém, salvo flagrante, desastre ou socorro. Casa de dia: juiz também. Interceptação telefônica: juiz. Dissolução de associação: juiz.'),
    step('Resumo essencial', ['Palavras-chave do art. 5º, I a XXXIV.'], undefined, { caption: 'Art. 5º (I a XXXIV)', head: ['Inciso', 'Tema', 'Palavra-chave'], rows: [
      ['II', 'Legalidade', 'Ninguém é obrigado senão em virtude de lei'],
      ['IV', 'Manifestação do pensamento', 'Livre; anonimato vedado'],
      ['V', 'Direito de resposta', 'Proporcional; indenização'],
      ['X', 'Intimidade', 'Invioláveis: intimidade, vida privada, honra e imagem'],
      ['XI', 'Casa', 'Asilo inviolável; de dia, ordem judicial'],
      ['XII', 'Sigilo', 'Interceptação: ordem judicial, fins penais'],
      ['XVI', 'Reunião', 'Sem autorização; prévio aviso'],
      ['XVII a XXI', 'Associação', 'Dissolução: decisão judicial com trânsito em julgado'],
      ['XXIV', 'Desapropriação', 'Justa, prévia e em dinheiro'],
      ['XXXIV', 'Petição e certidões', 'Independentemente de taxas']] }),
    step('O que memorizar', ['• Caput: vida, liberdade, igualdade, segurança e propriedade.',
      '• Casa: flagrante, desastre ou socorro a qualquer hora; ordem judicial só de dia.',
      '• Reunião: pacífica, sem armas, local aberto, sem autorização, com aviso prévio.',
      '• Desapropriação: justa e prévia indenização em dinheiro.',
      '• Dissolução de associação: decisão judicial transitada em julgado.',
      '• Direito de petição e certidões: gratuitos (sem taxas).'] ),
  ],
}
const a5a = mkQ('cf5a', 'dconst-1')
export const ART5A_QUESTIONS: Question[] = [
  a5a(1, 'Nos termos do art. 5º, XI, da Constituição Federal, durante a noite, sem consentimento do morador, é possível penetrar na casa para', [
    o('A', 'cumprir mandado judicial de busca e apreensão.', 'Errada: a ordem judicial só autoriza o ingresso durante o dia.'),
    o('B', 'efetuar prisão determinada por juiz.', 'Errada: a determinação judicial não afasta a restrição de horário.'),
    o('C', 'prestar socorro.', 'Correta: o socorro é uma exceção que vale a qualquer hora, assim como flagrante delito e desastre.'),
    o('D', 'realizar inspeção administrativa de rotina.', 'Errada: não é hipótese constitucional de ingresso sem consentimento.'),
    o('E', 'cumprir ordem do delegado de polícia.', 'Errada: a ordem de delegado não substitui a decisão judicial e não autoriza o ingresso.')], 'C', 'Médio'),
  a5a(2, 'Sobre a manifestação do pensamento, a Constituição Federal estabelece que', [
    o('A', 'é livre, vedado o anonimato.', 'Correta: art. 5º, IV.'),
    o('B', 'é livre, inclusive anonimamente, desde que pacífica.', 'Errada: o anonimato é vedado.'),
    o('C', 'depende de licença prévia da autoridade.', 'Errada: a atividade de expressão independe de censura ou licença (art. 5º, IX).'),
    o('D', 'é limitada aos meios impressos.', 'Errada: não há limitação a meios impressos.'),
    o('E', 'exclui o direito de resposta.', 'Errada: o direito de resposta proporcional ao agravo é assegurado (art. 5º, V).')], 'A', 'Fácil'),
  a5a(3, 'Segundo o art. 5º, XVI, da Constituição Federal, todos podem reunir-se pacificamente, sem armas, em locais abertos ao público,', [
    o('A', 'mediante prévia autorização da autoridade competente.', 'Errada: a reunião independe de autorização.'),
    o('B', 'independentemente de autorização, desde que não frustrem outra reunião anteriormente convocada para o mesmo local, sendo exigido prévio aviso à autoridade competente.', 'Correta: texto do inciso XVI.'),
    o('C', 'sem necessidade de aviso à autoridade.', 'Errada: o prévio aviso à autoridade é exigido.'),
    o('D', 'apenas durante o dia.', 'Errada: o inciso não impõe restrição de horário.'),
    o('E', 'somente por associações registradas.', 'Errada: o direito é de todos.')], 'B', 'Médio'),
  a5a(4, 'A desapropriação por necessidade ou utilidade pública, ou por interesse social, observado o art. 5º, XXIV, depende, em regra, de', [
    o('A', 'indenização posterior, em títulos da dívida pública.', 'Errada: a regra é indenização prévia e em dinheiro; a forma em títulos é exceção constitucional.'),
    o('B', 'justa e prévia indenização em dinheiro.', 'Correta: texto do inciso XXIV, ressalvados os casos previstos na Constituição.'),
    o('C', 'indenização apenas se houver dano comprovado.', 'Errada: essa lógica vale para a requisição do inciso XXV, não para a desapropriação.'),
    o('D', 'autorização do proprietário.', 'Errada: a desapropriação independe de concordância do proprietário.'),
    o('E', 'decisão do Tribunal de Contas.', 'Errada: o Tribunal de Contas não decide sobre desapropriação.')], 'B', 'Fácil'),
  a5a(5, 'De acordo com o art. 5º, XIX, da Constituição Federal, as associações só poderão ser compulsoriamente dissoladas ou ter suas atividades suspensas por', [
    o('A', 'ato do Poder Executivo.', 'Errada: depende de decisão judicial.'),
    o('B', 'decisão judicial, exigindo-se o trânsito em julgado no caso de dissolução.', 'Correta: a suspensão exige decisão judicial, e a dissolução exige trânsito em julgado.'),
    o('C', 'decisão do Ministério Público.', 'Errada: o Ministério Público não pode dissolver associação.'),
    o('D', 'lei complementar.', 'Errada: a Constituição exige decisão judicial.'),
    o('E', 'deliberação da assembleia dos associados, apenas.', 'Errada: a dissolução voluntária é distinta; o inciso trata da dissolução compulsória.')], 'B', 'Médio'),
]
const a5ac = mkC('cf5a', 'dconst-1', 'dc-art5a')
export const ART5A_CARDS: Flashcard[] = [
  a5ac(1, 'Quais os cinco direitos invioláveis do caput do art. 5º?', 'Vida, liberdade, igualdade, segurança e propriedade.'),
  a5ac(2, 'Em que casos é possível entrar na casa sem consentimento do morador?', 'Flagrante delito, desastre ou socorro (a qualquer hora); por determinação judicial, só de dia.'),
  a5ac(3, 'Como é a desapropriação comum (art. 5º, XXIV)?', 'Mediante justa e prévia indenização em dinheiro, ressalvados os casos constitucionais.'),
  a5ac(4, 'O que exige a reunião pacífica (XVI)?', 'Nenhuma autorização, apenas prévio aviso à autoridade; sem armas, local aberto ao público.'),
  a5ac(5, 'Quando se admite a interceptação telefônica (XII)?', 'Por ordem judicial, para investigação criminal ou instrução processual penal, na forma da lei.'),
  a5ac(6, 'Os direitos de petição e de certidões (XXXIV) exigem pagamento de taxas?', 'Não: são assegurados independentemente do pagamento de taxas.'),
]

// ───────── art. 5º (XXXV a LXXVIII e parágrafos)
export const ART5B_LESSON: Lesson = {
  id: 'dc-art5b', topicId: 'dconst-1', title: 'CF art. 5º (2/2): garantias penais e processuais, remédios constitucionais e parágrafos', questionIds: ['cf5b-1', 'cf5b-2', 'cf5b-3', 'cf5b-4', 'cf5b-5'],
  steps: [
    step('Entenda', ['Acesso à Justiça e processo (XXXV a XXXVIII): XXXV a lei não excluirá da apreciação do Judiciário lesão ou ameaça a direito (inafastabilidade da jurisdição); XXXVI a lei não prejudicará o direito adquirido, o ato jurídico perfeito e a coisa julgada; XXXVII não haverá juízo ou tribunal de exceção; XXXVIII é reconhecida a instituição do júri, com plenitude de defesa, sigilo das votações, soberania dos veredictos e competência para os crimes dolosos contra a vida.',
      'Direito penal (XXXIX a LXVII): XXXIX não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal; XL a lei penal não retroagirá, salvo para beneficiar o réu; XLII racismo é crime inafiançável e imprescritível, sujeito à pena de reclusão; XLIII tortura, tráfico ilícito de entorpecentes, terrorismo e crimes hediondos são inafiançáveis e insuscetíveis de graça ou anistia; XLIV ação de grupos armados contra a ordem constitucional e o Estado Democrático é crime inafiançável e imprescritível; XLV nenhuma pena passará da pessoa do condenado; XLVII não haverá penas de morte (salvo em guerra declarada), de caráter perpétuo, de trabalhos forçados, de banimento ou cruéis; XLVIII a pena será cumprida em estabelecimentos distintos, conforme natureza do delito, idade e sexo; XLIX integridade física e moral do preso; LI e LII extradição; LIII ninguém será processado nem sentenciado senão pela autoridade competente; LIV devido processo legal; LV contraditório e ampla defesa; LVI são inadmissíveis as provas obtidas por meios ilícitos; LVII ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória (presunção de inocência).',
      'Prisão (LXI a LXVII): LXI ninguém será preso senão em flagrante delito ou por ordem escrita e fundamentada de autoridade judiciária competente, salvo transgressão militar ou crime propriamente militar; LXII a prisão será comunicada imediatamente ao juiz e à família; LXIII o preso será informado de seus direitos, entre os quais o de permanecer calado, assegurada a assistência da família e de advogado; LXV a prisão ilegal será imediatamente relaxada pela autoridade judiciária; LXVI ninguém será levado à prisão ou nela mantido quando a lei admitir a liberdade provisória, com ou sem fiança; LXVII não haverá prisão civil por dívida, salvo a do responsável pelo inadimplemento voluntário e inescusável de obrigação alimentícia (a prisão do depositário infiel, que consta do texto, é considerada ilícita pela Súmula Vinculante 25 do STF).',
      'Remédios constitucionais (LXVIII a LXXIII): HABEAS CORPUS (LXVIII) protege a liberdade de locomoção; MANDADO DE SEGURANÇA (LXIX) protege direito líquido e certo, não amparado por habeas corpus ou habeas data, contra ilegalidade ou abuso de poder de autoridade; MANDADO DE SEGURANÇA COLETIVO (LXX) pode ser impetrado por partido político com representação no Congresso Nacional e por organização sindical, entidade de classe ou associação legalmente constituída e em funcionamento há pelo menos um ano; MANDADO DE INJUNÇÃO (LXXI) cabe quando a falta de norma regulamentadora torna inviável o exercício de direitos e liberdades constitucionais; HABEAS DATA (LXXII) assegura o conhecimento e a retificação de informações do próprio impetrante em registros públicos; AÇÃO POPULAR (LXXIII) anula ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural, e o autor, salvo má-fé, fica isento de custas.',
      'Outras garantias: LXXIV assistência jurídica integral e gratuita aos que comprovarem insuficiência de recursos; LXXV indenização por erro judiciário ou prisão além do tempo fixado na sentença; LXXVII são gratuitas as ações de habeas corpus e habeas data e, na forma da lei, os atos necessários ao exercício da cidadania; LXXVIII a todos são assegurados a razoável duração do processo e os meios que garantam a celeridade de sua tramitação, no âmbito judicial e administrativo. Parágrafos: § 1º normas definidoras de direitos e garantias fundamentais têm aplicação imediata; § 2º rol não excludente (direitos decorrentes do regime, dos princípios e de tratados); § 3º tratados de direitos humanos aprovados em cada Casa do Congresso, em dois turnos, por três quintos dos votos, equivalem a emendas constitucionais; § 4º o Brasil se submete à jurisdição de Tribunal Penal Internacional a cuja criação tenha manifestado adesão. Há ainda o inciso LXXIX (proteção de dados pessoais, inclusive nos meios digitais).',
      AVISO],
      'Para os remédios, associe: liberdade de ir e vir = habeas corpus; direito líquido e certo = mandado de segurança; falta de norma = mandado de injunção; meus dados = habeas data; patrimônio público/moralidade = ação popular.'),
    step('Exemplo prático', ['Caso 1: uma pessoa é presa sem flagrante e sem ordem escrita de juiz. A prisão é ilegal e será imediatamente relaxada pela autoridade judiciária (LXV); o remédio adequado para proteger a liberdade é o habeas corpus (LXVIII).',
      'Caso 2: um servidor quer saber quais informações a seu respeito constam do cadastro de um órgão público. O remédio é o habeas data (LXXII).',
      'Caso 3: um cidadão descobre contrato lesivo ao patrimônio público. Pode propor ação popular (LXXIII), sem pagar custas, salvo má-fé.',
      'Caso 4: prova obtida por meio de interceptação sem autorização judicial é prova ilícita, inadmissível no processo (LVI).',
      'Caso 5: lei penal posterior mais benéfica retroage em favor do réu (XL); lei penal mais gravosa não retroage.'],
      'Presunção de inocência é "trânsito em julgado": enquanto couber recurso da condenação, ninguém é considerado culpado, na redação do inciso LVII.'),
    step('Resumo essencial', ['Remédios constitucionais.'], undefined, { caption: 'Remédios', head: ['Remédio', 'Inciso', 'Quando cabe'], rows: [
      ['Habeas corpus', 'LXVIII', 'Ameaça ou violação à liberdade de locomoção, por ilegalidade ou abuso de poder'],
      ['Mandado de segurança', 'LXIX', 'Direito líquido e certo, não amparado por HC ou HD, contra autoridade'],
      ['MS coletivo', 'LXX', 'Partido com representação no Congresso; sindicato, entidade de classe ou associação com 1 ano'],
      ['Mandado de injunção', 'LXXI', 'Falta de norma regulamentadora que inviabiliza direitos constitucionais'],
      ['Habeas data', 'LXXII', 'Conhecer ou retificar informações do próprio impetrante'],
      ['Ação popular', 'LXXIII', 'Ato lesivo ao patrimônio público, moralidade, meio ambiente, patrimônio histórico e cultural']] }),
    step('O que memorizar', ['• Inafastabilidade da jurisdição (XXXV); coisa julgada, direito adquirido, ato jurídico perfeito (XXXVI).',
      '• Racismo: inafiançável e imprescritível (XLII).',
      '• Presunção de inocência: trânsito em julgado (LVII); provas ilícitas inadmissíveis (LVI).',
      '• Prisão: flagrante ou ordem escrita e fundamentada de juiz (LXI).',
      '• Prisão civil por dívida: só alimentos (voluntário e inescusável).',
      '• HC e HD são gratuitos (LXXVII); razoável duração do processo (LXXVIII).',
      '• Tratados de direitos humanos com 3/5 em dois turnos têm status de emenda (§ 3º).'] ),
  ],
}
const a5b = mkQ('cf5b', 'dconst-1')
export const ART5B_QUESTIONS: Question[] = [
  a5b(1, 'O remédio constitucional destinado a assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou bancos de dados de entidades governamentais ou de caráter público, é o', [
    o('A', 'habeas corpus.', 'Errada: protege a liberdade de locomoção.'),
    o('B', 'mandado de injunção.', 'Errada: cabe diante da falta de norma regulamentadora.'),
    o('C', 'ação popular.', 'Errada: visa anular ato lesivo ao patrimônio público e a outros bens coletivos.'),
    o('D', 'mandado de segurança.', 'Errada: protege direito líquido e certo não amparado por habeas corpus ou habeas data.'),
    o('E', 'habeas data.', 'Correta: art. 5º, LXXII.')], 'E', 'Fácil'),
  a5b(2, 'Segundo o art. 5º, LVII, da Constituição Federal, ninguém será considerado culpado', [
    o('A', 'até a prolação da sentença de primeiro grau.', 'Errada: o texto fala em trânsito em julgado.'),
    o('B', 'até o oferecimento da denúncia.', 'Errada: o texto fala em trânsito em julgado.'),
    o('C', 'até o trânsito em julgado de sentença penal condenatória.', 'Correta: texto do inciso LVII.'),
    o('D', 'até a decisão do tribunal que confirmar a sentença.', 'Errada: a confirmação em segundo grau não equivale ao trânsito em julgado, que ocorre quando não cabe mais recurso.'),
    o('E', 'até a prisão em flagrante.', 'Errada: a prisão em flagrante não torna ninguém culpado.')], 'C', 'Médio'),
  a5b(3, 'Nos termos do art. 5º, LXI, da Constituição Federal, ninguém será preso senão em flagrante delito ou por', [
    o('A', 'ordem escrita e fundamentada de autoridade judiciária competente, salvo nos casos de transgressão militar ou crime propriamente militar.', 'Correta: texto do inciso LXI.'),
    o('B', 'ordem verbal do delegado de polícia.', 'Errada: a ordem deve ser escrita e de autoridade judiciária.'),
    o('C', 'requisição do Ministério Público.', 'Errada: a requisição do Ministério Público não substitui a ordem judicial.'),
    o('D', 'decisão de órgão administrativo.', 'Errada: a Constituição exige ordem judicial, salvo flagrante e hipóteses militares.'),
    o('E', 'determinação de qualquer autoridade pública.', 'Errada: só a autoridade judiciária competente pode determinar, salvo flagrante e hipóteses militares.')], 'A', 'Médio'),
  a5b(4, 'De acordo com o art. 5º, XLII, da Constituição Federal, a prática do racismo constitui crime', [
    o('A', 'afiançável e prescritível.', 'Errada: é inafiançável e imprescritível.'),
    o('B', 'inafiançável e imprescritível, sujeito à pena de reclusão.', 'Correta: texto do inciso XLII.'),
    o('C', 'afiançável e imprescritível.', 'Errada: é inafiançável.'),
    o('D', 'inafiançável e prescritível em vinte anos.', 'Errada: é imprescritível.'),
    o('E', 'sujeito somente a pena de multa.', 'Errada: a pena é de reclusão.')], 'B', 'Fácil'),
  a5b(5, 'Quanto à prisão civil por dívida, o art. 5º, LXVII, da Constituição Federal admite, como regra, a do', [
    o('A', 'devedor de tributos.', 'Errada: não há prisão civil por dívida tributária.'),
    o('B', 'responsável pelo inadimplemento voluntário e inescusável de obrigação alimentícia.', 'Correta: é a hipótese que subsiste, após a Súmula Vinculante 25 do STF afastar a prisão do depositário infiel.'),
    o('C', 'devedor de aluguel.', 'Errada: não há prisão civil por dívida de aluguel.'),
    o('D', 'devedor de prestações contratuais em geral.', 'Errada: a regra é a ausência de prisão civil por dívida.'),
    o('E', 'locatário que se recusar a desocupar o imóvel.', 'Errada: não é hipótese constitucional de prisão civil.')], 'B', 'Difícil'),
]
const a5bc = mkC('cf5b', 'dconst-1', 'dc-art5b')
export const ART5B_CARDS: Flashcard[] = [
  a5bc(1, 'Qual remédio protege a liberdade de locomoção?', 'Habeas corpus (art. 5º, LXVIII).'),
  a5bc(2, 'Para que serve o habeas data?', 'Conhecer ou retificar informações do próprio impetrante em registros públicos (LXXII).'),
  a5bc(3, 'Quando cabe mandado de injunção?', 'Quando a falta de norma regulamentadora inviabiliza direitos e liberdades constitucionais (LXXI).'),
  a5bc(4, 'O que protege a ação popular?', 'Patrimônio público, moralidade administrativa, meio ambiente e patrimônio histórico e cultural; autor isento de custas, salvo má-fé.'),
  a5bc(5, 'Quais ações são gratuitas por força do art. 5º, LXXVII?', 'Habeas corpus e habeas data (e, na forma da lei, os atos necessários ao exercício da cidadania).'),
  a5bc(6, 'Que status têm tratados de direitos humanos aprovados com 3/5 em dois turnos?', 'Equivalem a emendas constitucionais (art. 5º, § 3º).'),
]

// ───────── direitos sociais (arts. 6º a 11)
export const SOC_LESSON: Lesson = {
  id: 'dc-sociais', topicId: 'dconst-2', title: 'CF arts. 6º a 11: direitos sociais, trabalhadores, sindicatos e greve', questionIds: ['soc-1', 'soc-2', 'soc-3', 'soc-4', 'soc-5'],
  steps: [
    step('Entenda', ['O Capítulo II do Título II trata dos direitos sociais (arts. 6º a 11). Art. 6º: são direitos sociais a educação, a saúde, a alimentação, o trabalho, a moradia, o transporte, o lazer, a segurança, a previdência social, a proteção à maternidade e à infância e a assistência aos desamparados. O parágrafo único assegura a todo brasileiro em situação de vulnerabilidade social uma renda básica familiar, por meio de programa permanente de transferência de renda, na forma da lei.',
      'Art. 7º: direitos dos trabalhadores urbanos e rurais, além de outros que visem à melhoria de sua condição social. Principais: I proteção contra despedida arbitrária ou sem justa causa; II seguro-desemprego; III FGTS; IV salário mínimo nacionalmente unificado; VI irredutibilidade do salário, salvo convenção ou acordo coletivo; VIII décimo terceiro salário; IX remuneração do trabalho noturno superior à do diurno; XIII duração do trabalho normal não superior a oito horas diárias e quarenta e quatro semanais, facultada a compensação de horários e a redução da jornada por acordo ou convenção coletiva; XV repouso semanal remunerado, preferencialmente aos domingos; XVI remuneração do serviço extraordinário superior, no mínimo, em cinquenta por cento à do normal; XVII férias anuais remuneradas com, pelo menos, um terço a mais do que o salário normal; XVIII licença à gestante, sem prejuízo do emprego e do salário, com duração de cento e vinte dias; XIX licença-paternidade, nos termos fixados em lei; XXI aviso prévio proporcional ao tempo de serviço, sendo no mínimo de trinta dias; XXIX ação quanto a créditos resultantes das relações de trabalho, com prazo prescricional de cinco anos para os trabalhadores urbanos e rurais, até o limite de dois anos após a extinção do contrato de trabalho; XXXIII proibição de trabalho noturno, perigoso ou insalubre a menores de dezoito anos e de qualquer trabalho a menores de dezesseis anos, salvo na condição de aprendiz, a partir de quatorze anos.',
      'Art. 8º (liberdade sindical): é livre a associação profissional ou sindical; a lei não pode exigir autorização do Estado para a fundação de sindicato, ressalvado o registro no órgão competente, vedadas ao poder público a interferência e a intervenção; é vedada a criação de mais de uma organização sindical, em qualquer grau, representativa de categoria profissional ou econômica, na mesma base territorial, que será definida pelos trabalhadores ou empregadores interessados, não podendo ser inferior à área de um Município (unicidade sindical); ninguém será obrigado a filiar-se ou a manter-se filiado; é obrigatória a participação dos sindicatos nas negociações coletivas de trabalho; é vedada a dispensa do empregado sindicalizado a partir do registro da candidatura a cargo de direção ou representação sindical e, se eleito, ainda que suplente, até um ano após o final do mandato, salvo falta grave.',
      'Art. 9º: é assegurado o direito de greve, competindo aos trabalhadores decidir sobre a oportunidade de exercê-lo e sobre os interesses que devam por meio dele defender; a lei definirá os serviços ou atividades essenciais e disporá sobre o atendimento das necessidades inadiáveis da comunidade; os abusos cometidos sujeitam os responsáveis às penas da lei. Art. 10: é assegurada a participação dos trabalhadores e empregadores nos colegiados dos órgãos públicos em que seus interesses profissionais ou previdenciários sejam objeto de discussão e deliberação. Art. 11: nas empresas de mais de duzentos empregados, é assegurada a eleição de um representante destes com a finalidade exclusiva de promover-lhes o entendimento direto com os empregadores.',
      AVISO],
      'Para o art. 6º, decore a sigla EDUCAÇÃO-SAÚDE-ALIMENTAÇÃO-TRABALHO-MORADIA-TRANSPORTE-LAZER-SEGURANÇA-PREVIDÊNCIA-MATERNIDADE-ASSISTÊNCIA. Propriedade e liberdade NÃO estão na lista (são do art. 5º).'),
    step('Exemplo prático', ['Caso 1: um empregado cumpre jornada normal de 8 horas por dia e 44 horas por semana: está dentro do limite do art. 7º, XIII.',
      'Caso 2: uma empregada gestante tem direito a 120 dias de licença, sem prejuízo do emprego e do salário (art. 7º, XVIII).',
      'Caso 3: quem trabalha em hora extra recebe, no mínimo, 50% a mais que a hora normal (art. 7º, XVI).',
      'Caso 4: dois sindicatos da mesma categoria na mesma cidade: viola a unicidade sindical do art. 8º, II.',
      'Caso 5: um trabalhador pode ingressar com ação por créditos trabalhistas em até 2 anos após o fim do contrato, cobrando os últimos 5 anos (art. 7º, XXIX).'],
      'Não confunda: o art. 7º trata de trabalhadores urbanos e rurais; os servidores públicos têm parte desses direitos por força do art. 39, § 3º.'),
    step('Resumo essencial', ['Números do art. 7º.'], undefined, { caption: 'Números que mais caem', head: ['Direito', 'Valor', 'Inciso'], rows: [
      ['Jornada normal', '8 h por dia e 44 h por semana', 'XIII'],
      ['Hora extra', 'Adicional mínimo de 50%', 'XVI'],
      ['Férias', 'Remuneração com 1/3 a mais', 'XVII'],
      ['Licença-gestante', '120 dias', 'XVIII'],
      ['Aviso prévio', 'Proporcional; mínimo de 30 dias', 'XXI'],
      ['Prescrição trabalhista', '5 anos, até 2 anos após o fim do contrato', 'XXIX'],
      ['Trabalho de menores', 'Proibido abaixo de 16, salvo aprendiz a partir de 14', 'XXXIII'],
      ['Empresa com representante dos empregados', 'Mais de 200 empregados', 'Art. 11']] }),
    step('O que memorizar', ['• Art. 6º inclui transporte e renda básica familiar (parágrafo único).',
      '• Jornada: 8 h/dia e 44 h/semana; hora extra: mínimo de 50%.',
      '• Férias: 1/3 a mais; licença-gestante: 120 dias; aviso prévio: mínimo de 30 dias.',
      '• Unicidade sindical: base territorial mínima de um Município.',
      '• Ninguém é obrigado a filiar-se a sindicato; dirigente sindical tem proteção contra dispensa.',
      '• Greve: direito dos trabalhadores; lei define serviços essenciais.'] ),
  ],
}
const sq = mkQ('soc', 'dconst-2')
export const SOC_QUESTIONS: Question[] = [
  sq(1, 'Entre os direitos sociais expressamente enumerados no art. 6º da Constituição Federal NÃO se inclui', [
    o('A', 'o transporte.', 'Incluído: o transporte consta do rol do art. 6º.'),
    o('B', 'a moradia.', 'Incluída: a moradia consta do rol do art. 6º.'),
    o('C', 'a alimentação.', 'Incluída: a alimentação consta do rol do art. 6º.'),
    o('D', 'a propriedade.', 'Correta (a que não se inclui): a propriedade é direito individual do art. 5º, e não direito social do art. 6º.'),
    o('E', 'o lazer.', 'Incluído: o lazer consta do rol do art. 6º.')], 'D', 'Médio'),
  sq(2, 'Segundo o art. 7º, XIII, da Constituição Federal, a duração do trabalho normal não será superior a', [
    o('A', 'seis horas diárias e trinta e seis semanais.', 'Errada: essa jornada vale, em regra, para turnos ininterruptos de revezamento, salvo negociação coletiva.'),
    o('B', 'oito horas diárias e quarenta semanais.', 'Errada: o limite semanal é de quarenta e quatro horas.'),
    o('C', 'oito horas diárias e quarenta e quatro semanais.', 'Correta: texto do inciso XIII, facultada a compensação e a redução por acordo ou convenção coletiva.'),
    o('D', 'dez horas diárias e quarenta e quatro semanais.', 'Errada: o limite diário é de oito horas.'),
    o('E', 'oito horas diárias e quarenta e oito semanais.', 'Errada: o limite semanal é de quarenta e quatro horas.')], 'C', 'Fácil'),
  sq(3, 'A remuneração do serviço extraordinário será superior, no mínimo, em', [
    o('A', 'vinte por cento à do normal.', 'Errada: o percentual mínimo constitucional é de cinquenta por cento.'),
    o('B', 'trinta por cento à do normal.', 'Errada: o percentual mínimo constitucional é de cinquenta por cento.'),
    o('C', 'cinquenta por cento à do normal.', 'Correta: art. 7º, XVI.'),
    o('D', 'cem por cento à do normal.', 'Errada: o percentual de cem por cento não é o mínimo constitucional.'),
    o('E', 'um terço à do normal.', 'Errada: um terço é o adicional constitucional de férias.')], 'C', 'Fácil'),
  sq(4, 'De acordo com o art. 7º, XVIII, da Constituição Federal, a licença à gestante, sem prejuízo do emprego e do salário, tem duração de', [
    o('A', 'noventa dias.', 'Errada: a duração prevista é de cento e vinte dias.'),
    o('B', 'cento e vinte dias.', 'Correta: texto do inciso XVIII.'),
    o('C', 'cento e oitenta dias.', 'Errada: a duração prevista na Constituição é de cento e vinte dias.'),
    o('D', 'sessenta dias.', 'Errada: a duração prevista é de cento e vinte dias.'),
    o('E', 'trinta dias.', 'Errada: trinta dias é o prazo mínimo do aviso prévio.')], 'B', 'Fácil'),
  sq(5, 'Sobre a organização sindical, o art. 8º da Constituição Federal estabelece que é vedada a criação de mais de uma organização sindical, em qualquer grau, representativa de categoria profissional ou econômica, na mesma base territorial, que', [
    o('A', 'poderá ser inferior à área de um Município.', 'Errada: a base territorial não pode ser inferior à área de um Município.'),
    o('B', 'será definida pelo Ministério do Trabalho.', 'Errada: é definida pelos trabalhadores ou empregadores interessados.'),
    o('C', 'será definida pelo governo estadual.', 'Errada: é definida pelos trabalhadores ou empregadores interessados.'),
    o('D', 'será definida pelos trabalhadores ou empregadores interessados, não podendo ser inferior à área de um Município.', 'Correta: art. 8º, II (unicidade sindical).'),
    o('E', 'será definida pelo Poder Judiciário.', 'Errada: é definida pelos trabalhadores ou empregadores interessados.')], 'D', 'Médio'),
]
const sc = mkC('soc', 'dconst-2', 'dc-sociais')
export const SOC_CARDS: Flashcard[] = [
  sc(1, 'Quais os direitos sociais do art. 6º?', 'Educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e à infância, assistência aos desamparados.'),
  sc(2, 'Qual a jornada normal máxima do art. 7º, XIII?', '8 horas diárias e 44 semanais.'),
  sc(3, 'Qual o adicional mínimo de hora extra?', '50% sobre a hora normal.'),
  sc(4, 'Qual a duração da licença-gestante na CF?', '120 dias, sem prejuízo do emprego e do salário.'),
  sc(5, 'O que é unicidade sindical (art. 8º, II)?', 'Veda mais de uma organização sindical da mesma categoria na mesma base territorial, no mínimo um Município.'),
  sc(6, 'Quem decide sobre o exercício da greve?', 'Os trabalhadores decidem sobre a oportunidade e os interesses a defender (art. 9º); a lei define os serviços essenciais.'),
]

// ───────── nacionalidade (arts. 12 e 13)
export const NAC_LESSON: Lesson = {
  id: 'dc-nacionalidade', topicId: 'dconst-3', title: 'CF arts. 12 e 13: nacionalidade, brasileiros natos e naturalizados', questionIds: ['nac-1', 'nac-2', 'nac-3', 'nac-4', 'nac-5'],
  steps: [
    step('Entenda', ['Nacionalidade é o vínculo jurídico-político entre a pessoa e o Estado. O art. 12 define quem é brasileiro NATO e quem é NATURALIZADO. A regra é que a lei não pode distinguir entre natos e naturalizados, salvo nos casos previstos na Constituição (art. 12, § 2º).',
      'São brasileiros NATOS (art. 12, I): a) os nascidos na República Federativa do Brasil, ainda que de pais estrangeiros, desde que estes não estejam a serviço de seu país (critério do solo, ius soli); b) os nascidos no estrangeiro, de pai brasileiro ou mãe brasileira, desde que qualquer deles esteja a serviço da República Federativa do Brasil; c) os nascidos no estrangeiro de pai brasileiro ou de mãe brasileira, desde que sejam registrados em repartição brasileira competente ou venham a residir no Brasil e optem, em qualquer tempo, pela nacionalidade brasileira.',
      'São brasileiros NATURALIZADOS (art. 12, II): a) os que, na forma da lei, adquiram a nacionalidade brasileira, exigidas dos originários de países de língua portuguesa apenas residência por um ano ininterrupto e idoneidade moral; b) os estrangeiros de qualquer nacionalidade, residentes na República Federativa do Brasil há mais de quinze anos ininterruptos e sem condenação penal, desde que requeiram a nacionalidade brasileira. § 1º: aos portugueses com residência permanente no País, se houver reciprocidade em favor de brasileiros, serão atribuídos os direitos inerentes ao brasileiro, salvo os casos previstos na Constituição.',
      'Cargos privativos de brasileiro NATO (§ 3º): Presidente e Vice-Presidente da República; Presidente da Câmara dos Deputados; Presidente do Senado Federal; Ministro do Supremo Tribunal Federal; carreira diplomática; oficial das Forças Armadas; Ministro de Estado da Defesa.',
      'Perda da nacionalidade (§ 4º): será declarada a perda da nacionalidade do brasileiro que tiver cancelada sua naturalização, por sentença judicial, em virtude de fraude relacionada ao processo de naturalização ou de atentado contra a ordem constitucional e o Estado Democrático, ou que fizer pedido expresso de perda da nacionalidade perante autoridade brasileira competente, ressalvadas as situações que acarretem apatridia. § 5º: a renúncia da nacionalidade não impede o interessado de readquirir sua nacionalidade originária, nos termos da lei.',
      'Art. 13: a língua portuguesa é o idioma oficial da República Federativa do Brasil. § 1º: são símbolos da República Federativa do Brasil a bandeira, o hino, as armas e o selo nacionais. § 2º: os Estados, o Distrito Federal e os Municípios poderão ter símbolos próprios.',
      AVISO],
      'Atenção: o cargo de Ministro de Estado da Defesa é o ÚNICO ministério privativo de nato. Outros Ministros de Estado (inclusive da Justiça) podem ser naturalizados.'),
    step('Exemplo prático', ['Caso 1: filho de pais japoneses (nenhum a serviço do Japão), nascido em São Paulo → brasileiro nato (ius soli).',
      'Caso 2: filho de brasileira que serve em embaixada brasileira no exterior, nascido lá → brasileiro nato (art. 12, I, b).',
      'Caso 3: português residente no Brasil há um ano ininterrupto, de idoneidade moral comprovada → pode se naturalizar brasileiro (originário de país de língua portuguesa).',
      'Caso 4: norte-americano residente no Brasil há 15 anos ininterruptos, sem condenação penal → só cabe naturalização após mais de quinze anos.',
      'Caso 5: naturalizado não pode ser Ministro do STF, pois o cargo é privativo de brasileiro nato.'],
      'Mnemônico dos cargos privativos de nato: P-V-C-S-M-D-O-D (Presidente/Vice, Câmara, Senado, Ministro STF, Diplomata, Oficial, Defesa).'),
    step('Resumo essencial', ['Natos e naturalizados.'], undefined, { caption: 'Nacionalidade', head: ['Categoria', 'Regra', 'Observação'], rows: [
      ['Nato (a)', 'Nascido no Brasil, ainda que de pais estrangeiros', 'Exceto se os pais estiverem a serviço de seu país'],
      ['Nato (b)', 'Nascido no exterior de brasileiro a serviço do Brasil', 'Pai ou mãe'],
      ['Nato (c)', 'Nascido no exterior, registrado ou residente com opção', 'Opção em qualquer tempo'],
      ['Naturalizado (a)', 'Países de língua portuguesa', '1 ano de residência ininterrupta e idoneidade moral'],
      ['Naturalizado (b)', 'Estrangeiro de qualquer nacionalidade', 'Mais de 15 anos de residência, sem condenação penal, mediante requerimento'],
      ['Cargos privativos de nato', 'Presidente, Vice, Câmara, Senado, STF, diplomata, oficial das Forças Armadas, Defesa', '7 cargos'],
      ['Perda (§ 4º)', 'Cancelamento judicial da naturalização por fraude ou atentado; pedido expresso', 'Sem apatridia']] }),
    step('O que memorizar', ['• Nato: nascido no Brasil (salvo pais a serviço de seu país); nascidos no exterior com regras b e c.',
      '• Naturalizado: 1 ano (língua portuguesa) ou mais de 15 anos e sem condenação penal (demais).',
      '• Sete cargos privativos de nato.',
      '• Perda da nacionalidade: cancelamento judicial da naturalização ou pedido expresso, sem apatridia.',
      '• Art. 13: português é o idioma oficial; símbolos: bandeira, hino, armas e selo.'] ),
  ],
}
const nq = mkQ('nac', 'dconst-3')
export const NAC_QUESTIONS: Question[] = [
  nq(1, 'Segundo o art. 12, I, a, da Constituição Federal, é brasileiro nato o nascido na República Federativa do Brasil, ainda que de pais estrangeiros,', [
    o('A', 'desde que residam no Brasil há mais de quinze anos.', 'Errada: a residência dos pais não é requisito.'),
    o('B', 'desde que estes não estejam a serviço de seu país.', 'Correta: texto da alínea a.'),
    o('C', 'desde que um dos pais seja brasileiro naturalizado.', 'Errada: não é requisito.'),
    o('D', 'desde que optem pela nacionalidade após a maioridade.', 'Errada: a opção refere-se aos nascidos no exterior (alínea c).'),
    o('E', 'sem qualquer exceção.', 'Errada: há a exceção dos pais a serviço de seu país.')], 'B', 'Fácil'),
  nq(2, 'Entre os cargos abaixo, é privativo de brasileiro nato o de', [
    o('A', 'Ministro do Superior Tribunal de Justiça.', 'Errada: o cargo de Ministro do STJ não está entre os privativos de nato; o privativo é o de Ministro do STF.'),
    o('B', 'Senador da República.', 'Errada: o cargo de Senador não é privativo de nato; é privativo o de Presidente do Senado Federal.'),
    o('C', 'Ministro de Estado da Justiça.', 'Errada: entre os Ministros de Estado, só o da Defesa é privativo de nato.'),
    o('D', 'Governador de Estado.', 'Errada: o cargo de Governador não consta do rol de privativos de nato.'),
    o('E', 'Ministro do Supremo Tribunal Federal.', 'Correta: art. 12, § 3º, IV.')], 'E', 'Médio'),
  nq(3, 'De acordo com o art. 12, II, b, da Constituição Federal, são brasileiros naturalizados os estrangeiros de qualquer nacionalidade, residentes na República Federativa do Brasil há', [
    o('A', 'mais de um ano ininterrupto e sem condenação penal, desde que requeiram a nacionalidade.', 'Errada: um ano ininterrupto é o prazo para originários de países de língua portuguesa (alínea a).'),
    o('B', 'mais de dez anos, independentemente de condenação penal.', 'Errada: o prazo é de mais de quinze anos e exige ausência de condenação penal.'),
    o('C', 'mais de quinze anos ininterruptos e sem condenação penal, desde que requeiram a nacionalidade brasileira.', 'Correta: texto da alínea b.'),
    o('D', 'mais de vinte anos, mediante pedido do Ministério Público.', 'Errada: o prazo é de mais de quinze anos e depende de requerimento do interessado.'),
    o('E', 'mais de cinco anos, se casados com brasileiro.', 'Errada: a Constituição não prevê essa hipótese.')], 'C', 'Médio'),
  nq(4, 'Nos termos do art. 12, § 4º, da Constituição Federal, será declarada a perda da nacionalidade do brasileiro que', [
    o('A', 'residir no exterior por mais de dez anos.', 'Errada: residir no exterior não gera a perda da nacionalidade.'),
    o('B', 'tiver cancelada sua naturalização, por sentença judicial, em virtude de fraude relacionada ao processo de naturalização ou de atentado contra a ordem constitucional e o Estado Democrático.', 'Correta: hipótese do inciso I do § 4º, na redação dada pela EC 131/2023.'),
    o('C', 'for condenado por crime hediondo.', 'Errada: a condenação por crime hediondo não é causa de perda da nacionalidade.'),
    o('D', 'servir às Forças Armadas de outro país.', 'Errada: não é causa prevista no § 4º.'),
    o('E', 'deixar de votar em duas eleições seguidas.', 'Errada: o não voto não gera perda da nacionalidade.')], 'B', 'Difícil'),
  nq(5, 'São símbolos da República Federativa do Brasil, nos termos do art. 13, § 1º, da Constituição Federal,', [
    o('A', 'a bandeira, o hino, as armas e o selo nacionais.', 'Correta: texto do § 1º.'),
    o('B', 'a bandeira, o hino e o brasão apenas.', 'Errada: os símbolos são a bandeira, o hino, as armas e o selo.'),
    o('C', 'a bandeira, o hino, a moeda e o selo.', 'Errada: a moeda não consta do rol.'),
    o('D', 'a bandeira e o hino apenas.', 'Errada: o rol inclui as armas e o selo.'),
    o('E', 'a bandeira, o hino, a língua e as armas.', 'Errada: a língua portuguesa é idioma oficial (caput), e o rol de símbolos inclui o selo.')], 'A', 'Fácil'),
]
const nc = mkC('nac', 'dconst-3', 'dc-nacionalidade')
export const NAC_CARDS: Flashcard[] = [
  nc(1, 'Quem é brasileiro nato (art. 12, I, a)?', 'O nascido no Brasil, ainda que de pais estrangeiros, desde que não estejam a serviço de seu país.'),
  nc(2, 'Quais os prazos de naturalização?', '1 ano de residência ininterrupta e idoneidade moral (países de língua portuguesa); mais de 15 anos e sem condenação penal (demais estrangeiros, por requerimento).'),
  nc(3, 'Quais os cargos privativos de brasileiro nato?', 'Presidente e Vice, Presidente da Câmara, Presidente do Senado, Ministro do STF, carreira diplomática, oficial das Forças Armadas, Ministro de Estado da Defesa.'),
  nc(4, 'Quando se perde a nacionalidade (art. 12, § 4º)?', 'Cancelamento judicial da naturalização por fraude ou atentado à ordem constitucional/Estado Democrático, ou pedido expresso, ressalvada a apatridia.'),
  nc(5, 'Qual o idioma oficial do Brasil?', 'A língua portuguesa (art. 13).'),
  nc(6, 'Quais os símbolos nacionais?', 'Bandeira, hino, armas e selo (art. 13, § 1º).'),
]

// ───────── art. 92
export const PJ_LESSON: Lesson = {
  id: 'dc-art92', topicId: 'dconst-5', title: 'CF art. 92: órgãos do Poder Judiciário', questionIds: ['pj-1', 'pj-2', 'pj-3', 'pj-4', 'pj-5'],
  steps: [
    step('Entenda', ['O art. 92 enumera os órgãos do Poder Judiciário: I o Supremo Tribunal Federal; I-A o Conselho Nacional de Justiça (inserido pela EC 45/2004); II o Superior Tribunal de Justiça; II-A o Tribunal Superior do Trabalho (inserido pela EC 92/2016); III os Tribunais Regionais Federais e Juízes Federais; IV os Tribunais e Juízes do Trabalho; V os Tribunais e Juízes Eleitorais; VI os Tribunais e Juízes Militares; VII os Tribunais e Juízes dos Estados e do Distrito Federal e Territórios.',
      '§ 1º: o Supremo Tribunal Federal, o Conselho Nacional de Justiça e os Tribunais Superiores têm sede na Capital Federal. § 2º: o Supremo Tribunal Federal e os Tribunais Superiores têm jurisdição em todo o território nacional.',
      'O Tribunal de Justiça do Estado de São Paulo (TJSP) integra o inciso VII (Tribunais e Juízes dos Estados). Atenção: o CNJ é órgão do Judiciário, mas não exerce função jurisdicional (controla a atuação administrativa e financeira do Poder e o cumprimento dos deveres funcionais dos juízes, na forma do art. 103-B). Os Tribunais Superiores citados no art. 92 são o STJ, o TST e, na Justiça Eleitoral e Militar, os respectivos tribunais superiores previstos em outros artigos.',
      AVISO],
      'Decore a ordem: STF, CNJ, STJ, TST, TRFs/Juízes Federais, Trabalho, Eleitoral, Militar, Estados/DF/Territórios.'),
    step('Exemplo prático', ['Caso 1: o CNJ tem sede em Brasília (§ 1º), mas não julga processos como os tribunais; sua função é de controle administrativo e financeiro.',
      'Caso 2: o TST foi incluído de forma expressa no rol do art. 92 pela EC 92/2016 (inciso II-A).',
      'Caso 3: os Juízes de Direito da Capital paulista integram os "Juízes dos Estados" do inciso VII.',
      'Caso 4: a jurisdição do STF alcança todo o território nacional (§ 2º), como a dos Tribunais Superiores.',
      'Caso 5: o Ministério Público e a Defensoria não são órgãos do Poder Judiciário, ainda que atuem perante ele.'],
      'Pegadinha comum: colocar o Conselho Nacional do Ministério Público (CNMP) como órgão do Judiciário. O CNMP não está no art. 92.'),
    step('Resumo essencial', ['Órgãos do Judiciário.'], undefined, { caption: 'Art. 92', head: ['Inciso', 'Órgão', 'Observação'], rows: [
      ['I', 'Supremo Tribunal Federal', 'Sede em Brasília; jurisdição nacional'],
      ['I-A', 'Conselho Nacional de Justiça', 'Inserido pela EC 45/2004; sede em Brasília'],
      ['II', 'Superior Tribunal de Justiça', 'Tribunal Superior'],
      ['II-A', 'Tribunal Superior do Trabalho', 'Inserido pela EC 92/2016'],
      ['III', 'Tribunais Regionais Federais e Juízes Federais', ''],
      ['IV', 'Tribunais e Juízes do Trabalho', ''],
      ['V', 'Tribunais e Juízes Eleitorais', ''],
      ['VI', 'Tribunais e Juízes Militares', ''],
      ['VII', 'Tribunais e Juízes dos Estados, do DF e dos Territórios', 'Inclui o TJSP']] }),
    step('O que memorizar', ['• Nove incisos (com I-A e II-A): STF, CNJ, STJ, TST, TRFs/Federais, Trabalho, Eleitoral, Militar, Estados/DF/Territórios.',
      '• Sede em Brasília: STF, CNJ e Tribunais Superiores (§ 1º).',
      '• Jurisdição nacional: STF e Tribunais Superiores (§ 2º).',
      '• CNJ: órgão do Judiciário sem função jurisdicional.',
      '• TJSP: inciso VII.'] ),
  ],
}
const pq = mkQ('pj', 'dconst-5')
export const PJ_QUESTIONS: Question[] = [
  pq(1, 'Dentre os órgãos do Poder Judiciário enumerados no art. 92 da Constituição Federal inclui-se o', [
    o('A', 'Conselho Nacional do Ministério Público.', 'Errada: o CNMP integra o sistema do Ministério Público, e não o rol do art. 92.'),
    o('B', 'Tribunal de Contas da União.', 'Errada: o Tribunal de Contas auxilia o Poder Legislativo no controle externo, e não integra o Judiciário.'),
    o('C', 'Conselho Nacional de Justiça.', 'Correta: inciso I-A, inserido pela EC 45/2004.'),
    o('D', 'Defensoria Pública da União.', 'Errada: a Defensoria Pública é instituição essencial à Justiça, e não órgão do Judiciário.'),
    o('E', 'Advocacia-Geral da União.', 'Errada: a AGU integra as funções essenciais à Justiça, e não o Judiciário.')], 'C', 'Médio'),
  pq(2, 'Nos termos do art. 92 da Constituição Federal, têm sede na Capital Federal', [
    o('A', 'apenas o Supremo Tribunal Federal.', 'Errada: o § 1º inclui também o CNJ e os Tribunais Superiores.'),
    o('B', 'o Supremo Tribunal Federal, o Conselho Nacional de Justiça e os Tribunais Superiores.', 'Correta: art. 92, § 1º.'),
    o('C', 'todos os Tribunais Regionais Federais.', 'Errada: os Tribunais Regionais Federais têm sedes em diversas regiões do País.'),
    o('D', 'todos os Tribunais de Justiça dos Estados.', 'Errada: cada Tribunal de Justiça tem sede na capital do respectivo Estado.'),
    o('E', 'somente os Tribunais Superiores.', 'Errada: o § 1º inclui também o STF e o CNJ.')], 'B', 'Médio'),
  pq(3, 'O Supremo Tribunal Federal e os Tribunais Superiores têm jurisdição', [
    o('A', 'restrita ao Distrito Federal.', 'Errada: a jurisdição é nacional.'),
    o('B', 'restrita à sua região.', 'Errada: a jurisdição é nacional.'),
    o('C', 'apenas nos Estados que os provocarem.', 'Errada: a jurisdição é nacional.'),
    o('D', 'em todo o território nacional.', 'Correta: art. 92, § 2º.'),
    o('E', 'apenas na capital de cada Estado.', 'Errada: a jurisdição é nacional.')], 'D', 'Fácil'),
  pq(4, 'O Tribunal Superior do Trabalho passou a constar, de forma expressa, no rol de órgãos do Poder Judiciário do art. 92 por meio da', [
    o('A', 'Emenda Constitucional 45/2004.', 'Errada: a EC 45/2004 inseriu o Conselho Nacional de Justiça.'),
    o('B', 'Emenda Constitucional 19/1998.', 'Errada: a EC 19/1998 tratou da reforma administrativa.'),
    o('C', 'Emenda Constitucional 92/2016.', 'Correta: inciso II-A.'),
    o('D', 'Emenda Constitucional 131/2023.', 'Errada: a EC 131/2023 alterou regras sobre nacionalidade.'),
    o('E', 'Emenda Constitucional 1/1969.', 'Errada: é anterior à Constituição de 1988.')], 'C', 'Difícil'),
  pq(5, 'O Tribunal de Justiça do Estado de São Paulo integra, no rol do art. 92 da Constituição Federal, os', [
    o('A', 'Tribunais e Juízes Federais.', 'Errada: o inciso III trata da Justiça Federal.'),
    o('B', 'Tribunais e Juízes dos Estados e do Distrito Federal e Territórios.', 'Correta: inciso VII.'),
    o('C', 'Tribunais e Juízes do Trabalho.', 'Errada: o inciso IV trata da Justiça do Trabalho.'),
    o('D', 'Tribunais e Juízes Eleitorais.', 'Errada: o inciso V trata da Justiça Eleitoral.'),
    o('E', 'Tribunais Superiores.', 'Errada: o TJSP é tribunal estadual, e não Tribunal Superior.')], 'B', 'Fácil'),
]
const pc = mkC('pj', 'dconst-5', 'dc-art92')
export const PJ_CARDS: Flashcard[] = [
  pc(1, 'Quais são os órgãos do Poder Judiciário (art. 92)?', 'STF, CNJ, STJ, TST, TRFs e Juízes Federais, Tribunais e Juízes do Trabalho, Eleitorais, Militares e dos Estados/DF/Territórios.'),
  pc(2, 'Que EC inseriu o CNJ no art. 92?', 'A EC 45/2004 (inciso I-A).'),
  pc(3, 'Que EC inseriu o TST no art. 92?', 'A EC 92/2016 (inciso II-A).'),
  pc(4, 'Quem tem sede na Capital Federal (§ 1º)?', 'STF, CNJ e Tribunais Superiores.'),
  pc(5, 'Quem tem jurisdição em todo o território nacional (§ 2º)?', 'STF e Tribunais Superiores.'),
  pc(6, 'Em que inciso está o TJSP?', 'Inciso VII: Tribunais e Juízes dos Estados, do DF e dos Territórios.'),
]

// ───────── Administração Pública: art. 37 (caput a XVII)
export const ADM1_LESSON: Lesson = {
  id: 'dc-adm37a', topicId: 'dconst-4', title: 'CF art. 37 (1/2): princípios, concurso, cargos em comissão, acumulação e teto', questionIds: ['adm1-1', 'adm1-2', 'adm1-3', 'adm1-4', 'adm1-5'],
  steps: [
    step('Entenda', ['O Capítulo VII do Título III trata da Administração Pública; a Seção I traz as Disposições Gerais (arts. 37 e 38) e a Seção II, os Servidores Públicos (arts. 39 a 41). O caput do art. 37 dispõe que a administração pública direta e indireta de qualquer dos Poderes da União, dos Estados, do DF e dos Municípios obedecerá aos princípios de LEGALIDADE, IMPESSOALIDADE, MORALIDADE, PUBLICIDADE e EFICIÊNCIA (mnemônico LIMPE).',
      'Incisos principais: I os cargos, empregos e funções públicas são acessíveis aos brasileiros que preencham os requisitos da lei e também aos estrangeiros, na forma da lei; II a investidura em cargo ou emprego público depende de aprovação prévia em concurso público de provas ou de provas e títulos, de acordo com a natureza e a complexidade do cargo, ressalvadas as nomeações para cargo em comissão declarado em lei de livre nomeação e exoneração; III o prazo de validade do concurso público será de até dois anos, prorrogável uma vez, por igual período; IV durante o prazo improrrogável previsto no edital, os aprovados serão convocados com prioridade sobre novos concursados; V as funções de confiança, exercidas exclusivamente por servidores ocupantes de cargo efetivo, e os cargos em comissão, a serem preenchidos por servidores de carreira nos casos, condições e percentuais mínimos previstos em lei, destinam-se apenas às atribuições de direção, chefia e assessoramento; VI livre associação sindical; VII o direito de greve será exercido nos termos e nos limites definidos em lei específica; VIII a lei reservará percentual dos cargos e empregos públicos para as pessoas com deficiência e definirá os critérios de sua admissão; IX a lei estabelecerá os casos de contratação por tempo determinado para atender a necessidade temporária de excepcional interesse público.',
      'Remuneração e acumulação: X a remuneração dos servidores e o subsídio somente poderão ser fixados ou alterados por lei específica, observada a iniciativa privativa em cada caso, assegurada revisão geral anual, sempre na mesma data e sem distinção de índices; XI o teto remuneratório é o subsídio mensal, em espécie, dos Ministros do Supremo Tribunal Federal; XIII é vedada a vinculação ou equiparação de quaisquer espécies remuneratórias para o efeito de remuneração de pessoal do serviço público; XV o subsídio e os vencimentos dos ocupantes de cargos e empregos públicos são irredutíveis, ressalvado o disposto na Constituição; XVI é vedada a acumulação remunerada de cargos públicos, exceto, quando houver compatibilidade de horários, observado em qualquer caso o teto: a) a de dois cargos de professor; b) a de um cargo de professor com outro técnico ou científico; c) a de dois cargos ou empregos privativos de profissionais de saúde, com profissões regulamentadas; XVII a proibição de acumular estende-se a empregos e funções e abrange autarquias, fundações, empresas públicas, sociedades de economia mista, suas subsidiárias e sociedades controladas, direta ou indiretamente, pelo poder público.',
      AVISO],
      'Armadilha do inciso III: o prazo é "até dois anos, prorrogável UMA vez, por igual período". A prorrogação não pode ser por tempo diferente.'),
    step('Exemplo prático', ['Caso 1: um concurso com validade de 2 anos pode ser prorrogado uma única vez, por mais 2 anos, totalizando 4 anos.',
      'Caso 2: um cargo em comissão pode ser provido sem concurso, desde que a lei o declare de livre nomeação e exoneração e se destine a direção, chefia ou assessoramento.',
      'Caso 3: uma professora pode acumular dois cargos de professor, desde que haja compatibilidade de horários e respeitado o teto.',
      'Caso 4: um médico pode acumular dois cargos privativos de profissionais de saúde, com compatibilidade de horários.',
      'Caso 5: nenhum servidor pode receber acima do subsídio dos Ministros do STF (teto), salvo as parcelas fora do teto previstas em lei e na Constituição.'],
      'Em acumulação, pense em "compatibilidade de horários + teto + só nas hipóteses do inciso XVI". Fora delas, é proibida.'),
    step('Resumo essencial', ['Art. 37, caput e incisos I a XVII.'], undefined, { caption: 'Art. 37', head: ['Tema', 'Regra', 'Inciso'], rows: [
      ['Princípios', 'Legalidade, impessoalidade, moralidade, publicidade, eficiência', 'Caput'],
      ['Concurso', 'Provas ou provas e títulos; exceção: cargo em comissão de livre nomeação', 'II'],
      ['Validade do concurso', 'Até 2 anos, prorrogável uma vez, por igual período', 'III'],
      ['Cargos em comissão', 'Só direção, chefia e assessoramento', 'V'],
      ['Pessoas com deficiência', 'Lei reserva percentual de cargos', 'VIII'],
      ['Contratação temporária', 'Necessidade temporária de excepcional interesse público', 'IX'],
      ['Teto', 'Subsídio dos Ministros do STF', 'XI'],
      ['Acumulação', 'Dois de professor; professor + técnico/científico; dois de saúde', 'XVI']] }),
    step('O que memorizar', ['• LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência.',
      '• Concurso vale até 2 anos, prorrogável uma vez por igual período.',
      '• Cargo em comissão: direção, chefia, assessoramento; livre nomeação e exoneração.',
      '• Contratação temporária: necessidade temporária de excepcional interesse público.',
      '• Teto: subsídio de Ministro do STF.',
      '• Acumulação: dois de professor; um de professor e um técnico/científico; dois de saúde regulamentada; compatibilidade de horários.'] ),
  ],
}
const ad1 = mkQ('adm1', 'dconst-4')
export const ADM1_QUESTIONS: Question[] = [
  ad1(1, 'Não está expressamente previsto no caput do art. 37 da Constituição Federal, entre os princípios da administração pública, o princípio da', [
    o('A', 'legalidade.', 'Previsto: a legalidade consta do caput.'),
    o('B', 'impessoalidade.', 'Previsto: a impessoalidade consta do caput.'),
    o('C', 'razoabilidade.', 'Correta (a que não consta): é princípio reconhecido pela doutrina e pela jurisprudência, mas não está expresso no caput.'),
    o('D', 'publicidade.', 'Previsto: a publicidade consta do caput.'),
    o('E', 'eficiência.', 'Previsto: a eficiência consta do caput (inserida pela EC 19/1998).')], 'C', 'Médio'),
  ad1(2, 'Segundo o art. 37, III, da Constituição Federal, o prazo de validade do concurso público será de até', [
    o('A', 'um ano, prorrogável por mais um ano.', 'Errada: o prazo é de até dois anos.'),
    o('B', 'dois anos, prorrogável uma vez, por igual período.', 'Correta: texto do inciso III.'),
    o('C', 'dois anos, prorrogável por tempo indeterminado.', 'Errada: a prorrogação ocorre uma vez, por igual período.'),
    o('D', 'cinco anos, improrrogável.', 'Errada: o prazo é de até dois anos, prorrogável uma vez.'),
    o('E', 'três anos, prorrogável duas vezes.', 'Errada: o prazo é de até dois anos, prorrogável uma vez.')], 'B', 'Fácil'),
  ad1(3, 'De acordo com o art. 37, IX, da Constituição Federal, a lei estabelecerá os casos de contratação por tempo determinado para atender a', [
    o('A', 'necessidade permanente de pessoal.', 'Errada: a contratação temporária não se destina a necessidades permanentes; para estas, faz-se concurso.'),
    o('B', 'qualquer vacância de cargo efetivo.', 'Errada: não é essa a hipótese constitucional.'),
    o('C', 'interesse particular da autoridade.', 'Errada: não é essa a hipótese constitucional.'),
    o('D', 'necessidade temporária de excepcional interesse público.', 'Correta: texto do inciso IX.'),
    o('E', 'qualquer demanda administrativa do órgão.', 'Errada: a Constituição exige necessidade temporária de excepcional interesse público.')], 'D', 'Médio'),
  ad1(4, 'A acumulação remunerada de cargos públicos é admitida, havendo compatibilidade de horários e observado o teto, quando se tratar de', [
    o('A', 'dois cargos de auxiliar administrativo.', 'Errada: não está entre as hipóteses do inciso XVI.'),
    o('B', 'dois cargos de professor.', 'Correta: art. 37, XVI, a.'),
    o('C', 'um cargo de professor e um de chefia administrativa.', 'Errada: a segunda hipótese admite o cargo de professor com outro técnico ou científico.'),
    o('D', 'dois cargos de advogado público.', 'Errada: não está entre as hipóteses do inciso XVI.'),
    o('E', 'qualquer cargo, desde que a soma não ultrapasse o teto.', 'Errada: a acumulação é exceção, restrita às hipóteses do inciso XVI.')], 'B', 'Médio'),
  ad1(5, 'Nos termos do art. 37, V, da Constituição Federal, os cargos em comissão destinam-se', [
    o('A', 'a qualquer atribuição administrativa.', 'Errada: destinam-se apenas às atribuições de direção, chefia e assessoramento.'),
    o('B', 'apenas às atribuições de direção, chefia e assessoramento.', 'Correta: texto do inciso V.'),
    o('C', 'a atividades burocráticas e operacionais de rotina.', 'Errada: essas atribuições são de cargos efetivos, providos por concurso.'),
    o('D', 'exclusivamente a ocupantes de cargo efetivo.', 'Errada: as funções de confiança é que são exercidas exclusivamente por ocupantes de cargo efetivo.'),
    o('E', 'a substituir concursados aprovados.', 'Errada: não é essa a finalidade do cargo em comissão.')], 'B', 'Médio'),
]
const ad1c = mkC('adm1', 'dconst-4', 'dc-adm37a')
export const ADM1_CARDS: Flashcard[] = [
  ad1c(1, 'Quais os princípios do caput do art. 37?', 'Legalidade, impessoalidade, moralidade, publicidade e eficiência (LIMPE).'),
  ad1c(2, 'Qual a validade do concurso público?', 'Até dois anos, prorrogável uma vez, por igual período (art. 37, III).'),
  ad1c(3, 'Para que se destinam os cargos em comissão?', 'Apenas a direção, chefia e assessoramento (art. 37, V).'),
  ad1c(4, 'Quando a contratação temporária é possível?', 'Para atender a necessidade temporária de excepcional interesse público, nos casos previstos em lei (art. 37, IX).'),
  ad1c(5, 'Qual o teto remuneratório?', 'O subsídio mensal, em espécie, dos Ministros do STF (art. 37, XI).'),
  ad1c(6, 'Quais as hipóteses de acumulação de cargos (art. 37, XVI)?', 'Dois de professor; um de professor e outro técnico ou científico; dois privativos de profissionais de saúde regulamentados; com compatibilidade de horários e respeitado o teto.'),
]

// ───────── Administração Pública: art. 37 (§§), 38, 39 e 41
export const ADM2_LESSON: Lesson = {
  id: 'dc-adm37b', topicId: 'dconst-4', title: 'CF arts. 37 (§§), 38, 39 e 41: responsabilidade, improbidade, mandato eletivo e estabilidade', questionIds: ['adm2-1', 'adm2-2', 'adm2-3', 'adm2-4', 'adm2-5'],
  steps: [
    step('Entenda', ['Parágrafos do art. 37: § 1º a publicidade dos atos, programas, obras, serviços e campanhas deverá ter caráter educativo, informativo ou de orientação social, dela não podendo constar nomes, símbolos ou imagens que caracterizem promoção pessoal de autoridades ou servidores públicos; § 2º a não observância do disposto nos incisos II e III implicará a nulidade do ato e a punição da autoridade responsável; § 4º os atos de improbidade administrativa importarão a suspensão dos direitos políticos, a perda da função pública, a indisponibilidade dos bens e o ressarcimento ao erário, na forma e gradação previstas em lei, sem prejuízo da ação penal cabível; § 6º as pessoas jurídicas de direito público e as de direito privado prestadoras de serviços públicos responderão pelos danos que seus agentes, nessa qualidade, causarem a terceiros, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa (responsabilidade objetiva do Estado); § 10 é vedada a percepção simultânea de proventos de aposentadoria com a remuneração de cargo, emprego ou função pública, ressalvados os cargos acumuláveis, os eletivos e os em comissão declarados em lei de livre nomeação e exoneração.',
      'Art. 37, XXI: ressalvados os casos especificados na legislação, as obras, serviços, compras e alienações serão contratados mediante processo de licitação pública que assegure igualdade de condições a todos os concorrentes. Art. 37, XIX: somente por lei específica poderá ser criada autarquia e autorizada a instituição de empresa pública, de sociedade de economia mista e de fundação.',
      'Art. 38 (servidor em mandato eletivo): I tratando-se de mandato eletivo federal, estadual ou distrital, ficará afastado de seu cargo, emprego ou função; II investido no mandato de Prefeito, será afastado do cargo, emprego ou função, sendo-lhe facultado optar pela sua remuneração; III investido no mandato de Vereador, havendo compatibilidade de horários, perceberá as vantagens de seu cargo, emprego ou função, sem prejuízo da remuneração do cargo eletivo; não havendo compatibilidade, será aplicada a norma do inciso anterior; IV em qualquer caso que exija o afastamento para o exercício de mandato eletivo, seu tempo de serviço será contado para todos os efeitos legais, exceto para promoção por merecimento.',
      'Art. 39 (Seção II): § 3º aplica-se aos ocupantes de cargo público o disposto em vários incisos do art. 7º (por exemplo, salário mínimo, décimo terceiro, férias com adicional de um terço), podendo a lei estabelecer requisitos diferenciados de admissão quando a natureza do cargo o exigir; § 4º o membro de Poder, o detentor de mandato eletivo, os Ministros de Estado e os Secretários estaduais e municipais serão remunerados exclusivamente por subsídio fixado em parcela única, vedado o acréscimo de qualquer gratificação, adicional, abono, prêmio, verba de representação ou outra espécie remuneratória; § 6º os Poderes publicarão anualmente os valores do subsídio e da remuneração dos cargos e empregos públicos; § 9º é vedada a incorporação de vantagens de caráter temporário ou vinculadas ao exercício de função de confiança ou de cargo em comissão à remuneração do cargo efetivo.',
      'Art. 41 (estabilidade): são estáveis após três anos de efetivo exercício os servidores nomeados para cargo de provimento efetivo em virtude de concurso público. § 1º o servidor público estável só perderá o cargo: I em virtude de sentença judicial transitada em julgado; II mediante processo administrativo em que lhe seja assegurada ampla defesa; III mediante procedimento de avaliação periódica de desempenho, na forma de lei complementar, assegurada ampla defesa. § 2º invalidada por sentença judicial a demissão do servidor estável, será ele reintegrado, e o eventual ocupante da vaga, se estável, reconduzido ao cargo de origem, sem direito a indenização, aproveitado em outro cargo ou posto em disponibilidade com remuneração proporcional ao tempo de serviço. § 3º extinto o cargo ou declarada a sua desnecessidade, o servidor estável ficará em disponibilidade, com remuneração proporcional ao tempo de serviço, até seu adequado aproveitamento em outro cargo. § 4º como condição para a aquisição da estabilidade, é obrigatória a avaliação especial de desempenho por comissão instituída para essa finalidade.',
      AVISO],
      'Estabilidade exige DOIS requisitos: três anos de efetivo exercício + avaliação especial de desempenho. Nomeação em cargo em comissão não gera estabilidade.'),
    step('Exemplo prático', ['Caso 1: um motorista da prefeitura causa acidente com viatura e danifica carro de terceiro. A prefeitura responde (objetivamente) perante o terceiro e pode cobrar do motorista em regresso, se houve dolo ou culpa (§ 6º).',
      'Caso 2: um servidor eleito Prefeito é afastado do cargo efetivo e pode optar pela remuneração (art. 38, II).',
      'Caso 3: um servidor eleito Vereador, com compatibilidade de horários, acumula a remuneração do cargo com a do mandato (art. 38, III).',
      'Caso 4: servidor estável, após processo administrativo com ampla defesa, é demitido: a demissão é legítima (art. 41, § 1º, II).',
      'Caso 5: servidor aposentado que assume cargo efetivo novo acumula proventos e remuneração? Em regra, não (art. 37, § 10), salvo cargos acumuláveis, eletivos e em comissão.'],
      'Responsabilidade do Estado (§ 6º): objetiva perante o terceiro; o direito de regresso contra o agente exige dolo ou culpa.'),
    step('Resumo essencial', ['Dispositivos essenciais.'], undefined, { caption: 'Arts. 37 (§§), 38 e 41', head: ['Dispositivo', 'Regra', 'Palavra-chave'], rows: [
      ['37, § 4º', 'Improbidade: suspensão de direitos políticos, perda da função, indisponibilidade de bens, ressarcimento', 'Sem prejuízo da ação penal'],
      ['37, § 6º', 'Responsabilidade do Estado e direito de regresso', 'Dolo ou culpa'],
      ['37, § 10', 'Vedada a acumulação de proventos com remuneração', 'Exceções: acumuláveis, eletivos e em comissão'],
      ['37, XXI', 'Licitação', 'Igualdade de condições'],
      ['38', 'Mandato eletivo', 'Prefeito: afastamento e opção; Vereador: compatibilidade'],
      ['39, § 4º', 'Subsídio em parcela única', 'Membros de Poder, Ministros, Secretários'],
      ['41', 'Estabilidade', '3 anos + avaliação especial de desempenho'],
      ['41, § 1º', 'Perda do cargo', 'Sentença transitada; processo administrativo; avaliação periódica']] }),
    step('O que memorizar', ['• Improbidade (§ 4º): suspensão dos direitos políticos, perda da função, indisponibilidade dos bens, ressarcimento ao erário.',
      '• Responsabilidade do Estado (§ 6º): objetiva; regresso contra o agente se houver dolo ou culpa.',
      '• Prefeito afastado e pode optar pela remuneração; Vereador acumula se houver compatibilidade de horários.',
      '• Estabilidade: três anos de efetivo exercício e avaliação especial de desempenho.',
      '• Perda do cargo do estável: sentença transitada em julgado; processo administrativo com ampla defesa; avaliação periódica de desempenho (LC).',
      '• Extinção do cargo: disponibilidade com remuneração proporcional ao tempo de serviço.'] ),
  ],
}
const ad2 = mkQ('adm2', 'dconst-4')
export const ADM2_QUESTIONS: Question[] = [
  ad2(1, 'De acordo com o art. 37, § 6º, da Constituição Federal, as pessoas jurídicas de direito público responderão pelos danos que seus agentes, nessa qualidade, causarem a terceiros, assegurado o direito de regresso contra o responsável nos casos de', [
    o('A', 'culpa leve, apenas.', 'Errada: o texto fala em dolo ou culpa.'),
    o('B', 'dolo ou culpa.', 'Correta: texto do § 6º.'),
    o('C', 'dolo, apenas.', 'Errada: o texto inclui também a culpa.'),
    o('D', 'qualquer dano, independentemente de dolo ou culpa.', 'Errada: o regresso contra o agente depende de dolo ou culpa.'),
    o('E', 'ordem expressa do superior.', 'Errada: não é requisito constitucional do regresso.')], 'B', 'Médio'),
  ad2(2, 'Os atos de improbidade administrativa importarão, nos termos do art. 37, § 4º, da Constituição Federal,', [
    o('A', 'apenas multa civil.', 'Errada: as consequências constitucionais são outras, previstas no § 4º.'),
    o('B', 'a suspensão dos direitos políticos, a perda da função pública, a indisponibilidade dos bens e o ressarcimento ao erário, na forma e gradação previstas em lei, sem prejuízo da ação penal cabível.', 'Correta: texto do § 4º.'),
    o('C', 'somente a demissão do servidor.', 'Errada: o § 4º prevê um conjunto de consequências.'),
    o('D', 'a prisão civil do responsável.', 'Errada: a prisão civil por dívida é vedada, salvo alimentos.'),
    o('E', 'exclusivamente a ação penal.', 'Errada: a ação penal é cabível sem prejuízo das sanções do § 4º.')], 'B', 'Médio'),
  ad2(3, 'Segundo o art. 41 da Constituição Federal, são estáveis após três anos de efetivo exercício os servidores nomeados para cargo de provimento efetivo em virtude de', [
    o('A', 'indicação política.', 'Errada: a estabilidade pressupõe concurso público.'),
    o('B', 'contratação temporária.', 'Errada: a contratação temporária não gera estabilidade.'),
    o('C', 'concurso público.', 'Correta: texto do caput do art. 41; a estabilidade depende ainda de avaliação especial de desempenho (§ 4º).'),
    o('D', 'nomeação para cargo em comissão.', 'Errada: os cargos em comissão são de livre nomeação e exoneração.'),
    o('E', 'processo seletivo simplificado.', 'Errada: o texto exige concurso público.')], 'C', 'Fácil'),
  ad2(4, 'O servidor público estável só perderá o cargo, nos termos do art. 41, § 1º, da Constituição Federal, em virtude de', [
    o('A', 'ato discricionário do chefe do Poder.', 'Errada: a perda do cargo do estável depende das hipóteses constitucionais.'),
    o('B', 'sentença judicial transitada em julgado, processo administrativo com ampla defesa ou procedimento de avaliação periódica de desempenho, na forma de lei complementar.', 'Correta: incisos I a III do § 1º.'),
    o('C', 'simples decisão da chefia imediata.', 'Errada: exige processo com ampla defesa ou sentença transitada em julgado.'),
    o('D', 'cancelamento do concurso.', 'Errada: não é hipótese do § 1º.'),
    o('E', 'vontade da maioria dos servidores do órgão.', 'Errada: não é hipótese do § 1º.')], 'B', 'Médio'),
  ad2(5, 'Segundo o art. 38 da Constituição Federal, o servidor público da administração direta investido no mandato de Prefeito', [
    o('A', 'continuará no cargo, sem afastamento.', 'Errada: será afastado do cargo, emprego ou função.'),
    o('B', 'será afastado do cargo, emprego ou função, sendo-lhe facultado optar pela sua remuneração.', 'Correta: art. 38, II.'),
    o('C', 'acumulará as duas remunerações.', 'Errada: a acumulação sem afastamento é a regra do Vereador com compatibilidade de horários.'),
    o('D', 'perderá o cargo efetivo.', 'Errada: haverá afastamento, e não perda do cargo.'),
    o('E', 'ficará em disponibilidade sem remuneração.', 'Errada: o texto prevê afastamento, com a opção pela remuneração.')], 'B', 'Médio'),
]
const ad2c = mkC('adm2', 'dconst-4', 'dc-adm37b')
export const ADM2_CARDS: Flashcard[] = [
  ad2c(1, 'Qual a regra de responsabilidade do Estado (art. 37, § 6º)?', 'Pessoas jurídicas de direito público respondem pelos danos de seus agentes a terceiros; regresso contra o responsável em caso de dolo ou culpa.'),
  ad2c(2, 'Quais as consequências constitucionais da improbidade (§ 4º)?', 'Suspensão dos direitos políticos, perda da função, indisponibilidade dos bens e ressarcimento ao erário, sem prejuízo da ação penal.'),
  ad2c(3, 'Quando o servidor adquire estabilidade?', 'Após três anos de efetivo exercício em cargo efetivo provido por concurso, com aprovação em avaliação especial de desempenho (art. 41, caput e § 4º).'),
  ad2c(4, 'Como o estável perde o cargo (art. 41, § 1º)?', 'Sentença judicial transitada em julgado; processo administrativo com ampla defesa; avaliação periódica de desempenho (lei complementar).'),
  ad2c(5, 'E se o cargo for extinto?', 'O estável fica em disponibilidade, com remuneração proporcional ao tempo de serviço, até o aproveitamento (art. 41, § 3º).'),
  ad2c(6, 'Como fica o servidor eleito Prefeito?', 'Afastado do cargo, podendo optar pela remuneração (art. 38, II).'),
]
export const DCONST_LESSONS = [ART5A_LESSON, ART5B_LESSON, SOC_LESSON, NAC_LESSON, ADM1_LESSON, ADM2_LESSON, PJ_LESSON]
export const DCONST_QUESTIONS = spread([...ART5A_QUESTIONS, ...ART5B_QUESTIONS, ...SOC_QUESTIONS, ...NAC_QUESTIONS, ...ADM1_QUESTIONS, ...ADM2_QUESTIONS, ...PJ_QUESTIONS], 2)
export const DCONST_CARDS = [...ART5A_CARDS, ...ART5B_CARDS, ...SOC_CARDS, ...NAC_CARDS, ...ADM1_CARDS, ...ADM2_CARDS, ...PJ_CARDS]
