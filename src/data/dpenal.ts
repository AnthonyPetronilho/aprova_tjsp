import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Direito Penal (Anexo VIII): CP arts. 293–305, 307, 308, 311-A; 313–317; 319–333; 336, 337, 339–347, 357, 359 (o art. 312, peculato, está em peculato.ts).
// Fonte: páginas públicas secundárias (goias.gov.br, TJDFT, Estratégia, JusBrasil-like), lidas em 04/11/2026; o Planalto bloqueia acesso automatizado.
// Penas dos arts. 293–296, 300–303 e 305 foram escritas sem conferência direta: estão marcadas nas aulas e NÃO são usadas em questões.
const AVISO = 'Aviso: texto em paráfrase próxima, conferido em fontes secundárias (o Planalto não abre para acesso automatizado). Antes da prova, confirme a redação e as penas em planalto.gov.br.'
const NAOCONF = 'Atenção: as penas dos arts. 293 a 296, 300 a 303 e 305 abaixo vieram sem conferência em fonte aberta nesta sessão. Confirme-as no Planalto antes de decorar. Nenhuma questão desta aula depende delas.'

// Gera uma questão com a certa na posição C (o spread depois gira o gabarito).
type W = [string, string]
const mk = (prefix: string, topicId: string) => {
  const m = mkQ(prefix, topicId)
  return (n: number, stem: string, right: W, wrongs: [W, W, W, W], d: Question['difficulty']): Question =>
    m(n, stem, [o('A', wrongs[0][0], 'Errada: ' + wrongs[0][1]), o('B', wrongs[1][0], 'Errada: ' + wrongs[1][1]), o('C', right[0], 'Correta: ' + right[1]), o('D', wrongs[2][0], 'Errada: ' + wrongs[2][1]), o('E', wrongs[3][0], 'Errada: ' + wrongs[3][1])], 'C', d)
}
const ids = (p: string) => [1, 2, 3, 4, 5].map(n => `${p}-${n}`)

// ───────── 1. Falsidades e fraude em certames
export const FALS_LESSON: Lesson = {
  id: 'dp-falsidades', topicId: 'dpenal-1', title: 'CP arts. 293 a 311-A: falsidades, falsa identidade e fraude em certames', questionIds: ids('fals'),
  steps: [
    step('Entenda', [
      'Estes artigos estão no Título X (Crimes contra a Fé Pública). O bem protegido é a confiança coletiva em documentos, sinais e identidades. Os arts. 293 a 296 tratam de papéis públicos (selos, estampilhas, petrechos de falsificação); os arts. 297 a 305 tratam da falsidade documental.',
      'Falsidade MATERIAL (arts. 297 e 298): o documento é fabricado ou adulterado na forma (falsificar, no todo ou em parte, ou alterar documento verdadeiro). Art. 297 = documento PÚBLICO: reclusão de 2 a 6 anos e multa; § 1º, aumento de sexta parte se o funcionário comete o crime prevalecendo-se do cargo. Art. 298 = documento PARTICULAR: reclusão de 1 a 5 anos e multa.',
      'Falsidade IDEOLÓGICA (art. 299): o documento é formalmente verdadeiro, mas o conteúdo é falso — omitir declaração que devia constar, ou inserir (ou fazer inserir) declaração falsa ou diversa da que devia ser escrita, com fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante. Pena: reclusão de 1 a 5 anos e multa, se o documento é público; de 1 a 3 anos e multa, se particular. Parágrafo único: aumento de sexta parte se o agente é funcionário e se prevalece do cargo, ou se a falsificação é de assentamento de registro civil.',
      'Art. 304 (uso de documento falso): fazer uso de qualquer dos papéis falsificados ou alterados a que se referem os arts. 297 a 302. A pena é a cominada à falsificação ou à alteração.',
      'Art. 307 (falsa identidade): atribuir-se ou atribuir a terceiro falsa identidade para obter vantagem, em proveito próprio ou alheio, ou para causar dano a outrem. Pena: detenção de 3 meses a 1 ano, ou multa, se o fato não constitui elemento de crime mais grave. Art. 308: usar como próprio passaporte, título de eleitor, caderneta de reservista ou qualquer documento de identidade alheio, ou ceder a outrem, para que dele se utilize, documento dessa natureza, próprio ou de terceiro. Pena: detenção de 4 meses a 2 anos e multa, se o fato não constitui elemento de crime mais grave.',
      'Art. 311-A (fraudes em certames de interesse público): utilizar ou divulgar, indevidamente, com o fim de beneficiar a si ou a outrem, ou de comprometer a credibilidade do certame, conteúdo sigiloso de concurso público, avaliação ou exame públicos, processo seletivo para ingresso no ensino superior, ou exame ou processo seletivo previstos em lei. Pena: reclusão de 1 a 4 anos e multa. § 1º: nas mesmas penas, quem permite ou facilita, por qualquer meio, o acesso de pessoas não autorizadas às informações sigilosas. § 2º: se da ação resulta dano à administração pública, reclusão de 2 a 6 anos e multa. § 3º: aumenta-se a pena de um terço se o fato é cometido por funcionário público.',
      NAOCONF, AVISO],
      'Material = mexeu no papel (forma). Ideológica = o papel é "verdadeiro", mas mente no conteúdo. Pública: reclusão de 2 a 6 (297). Particular: de 1 a 5 (298). Ideológica: 1 a 5 (público) ou 1 a 3 (particular).'),
    step('Exemplo prático', [
      'Caso 1 — alguém altera a data de um diploma expedido por universidade pública: falsidade material de documento público (art. 297).',
      'Caso 2 — um servidor, de ofício, insere declaração falsa em certidão que ele próprio tem competência para emitir: falsidade ideológica (art. 299), com aumento de sexta parte se se prevalece do cargo.',
      'Caso 3 — o candidato apresenta a CNH falsificada por terceiro: uso de documento falso (art. 304), com a pena da falsificação.',
      'Caso 4 — alguém diz ser outra pessoa a um policial para evitar a prisão: em regra, art. 307 (confirme na jurisprudência do STJ se a conduta de autodefesa é punida).',
      'Caso 5 — um servidor repassa o gabarito sigiloso de um concurso a um candidato: art. 311-A, com aumento de um terço pela condição de funcionário (§ 3º).'],
      'Pergunta-teste: "o que é falso, o papel ou a declaração?" Papel: 297/298. Declaração: 299. Quem apenas usa: 304.'),
    step('Resumo essencial', ['Penas conferidas dos artigos da aula.'], undefined, { caption: 'Falsidades e fraude em certames', head: ['Art.', 'Crime', 'Pena'], rows: [
      ['297', 'Falsificação de documento público', 'Reclusão 2–6 anos e multa'],
      ['298', 'Falsificação de documento particular', 'Reclusão 1–5 anos e multa'],
      ['299', 'Falsidade ideológica', 'Público: 1–5 e multa; particular: 1–3 e multa'],
      ['304', 'Uso de documento falso', 'A mesma pena da falsificação'],
      ['307', 'Falsa identidade', 'Detenção 3 meses–1 ano, ou multa'],
      ['308', 'Uso de documento de identidade alheio', 'Detenção 4 meses–2 anos e multa'],
      ['311-A', 'Fraudes em certames', 'Reclusão 1–4 anos e multa']] }),
    step('O que memorizar', [
      '• 297 público: reclusão de 2 a 6 e multa. 298 particular: de 1 a 5 e multa.',
      '• 299 ideológica: conteúdo falso; público 1–5, particular 1–3.',
      '• 304: pena de quem falsificou.',
      '• 307 = atribuir falsa identidade (detenção 3 meses–1 ano ou multa); 308 = usar documento de identidade alheio (detenção 4 meses–2 anos e multa).',
      '• 311-A: conteúdo sigiloso de certame; reclusão de 1 a 4 e multa; § 3º funcionário: aumento de um terço.'] ),
  ],
}
const f = mk('fals', 'dpenal-1')
export const FALS_QUESTIONS: Question[] = [
  f(1, 'Segundo o Código Penal, falsificar, no todo ou em parte, documento público, ou alterar documento público verdadeiro, é crime punido com', ['reclusão, de dois a seis anos, e multa.', 'Art. 297, caput.'], [['detenção, de seis meses a dois anos.', 'a pena é de reclusão e bem mais elevada.'], ['reclusão, de um a cinco anos, e multa.', 'essa é a pena do documento particular (art. 298).'], ['reclusão, de dois a doze anos, e multa.', 'esse intervalo é o do peculato e da corrupção.'], ['detenção, de três meses a um ano, ou multa.', 'essa é a pena da falsa identidade (art. 307).']], 'Fácil'),
  f(2, 'Em um documento formalmente verdadeiro, o agente insere declaração diversa da que devia ser escrita, com o fim de alterar a verdade sobre fato juridicamente relevante. Trata-se de', ['falsidade ideológica (art. 299).', 'A falsidade está no conteúdo; a forma do documento é autêntica.'], [['falsificação de documento público (art. 297).', 'o art. 297 pune a falsidade material, na forma do papel.'], ['falsa identidade (art. 307).', 'o art. 307 exige atribuir-se ou atribuir a terceiro falsa identidade.'], ['uso de documento falso (art. 304).', 'o art. 304 pune quem faz uso do papel falsificado.'], ['fraude em certame (art. 311-A).', 'este artigo trata de conteúdo sigiloso de concursos e exames.']], 'Médio'),
  f(3, 'Quem faz uso de documento público falsificado por terceiro, referido nos arts. 297 a 302, responde por', ['uso de documento falso, com a pena cominada à falsificação ou à alteração.', 'Art. 304.'], [['detenção de três meses a um ano.', 'a pena não é a da falsa identidade; segue a da falsificação.'], ['pena sempre menor que a do falsificador.', 'a lei manda aplicar a mesma pena cominada à falsificação.'], ['crime de falsidade ideológica.', 'o uso é crime autônomo, do art. 304.'], ['fato atípico, pois ele não falsificou.', 'o uso é típico e punido.']], 'Fácil'),
  f(4, 'Atribuir-se falsa identidade para obter vantagem em proveito próprio, se o fato não constitui elemento de crime mais grave, é punido com', ['detenção, de três meses a um ano, ou multa.', 'Art. 307.'], [['reclusão, de um a quatro anos, e multa.', 'essa é a pena do art. 311-A.'], ['detenção, de quatro meses a dois anos, e multa.', 'essa é a pena do art. 308 (uso de documento de identidade alheio).'], ['reclusão, de dois a seis anos.', 'é a pena da falsificação de documento público.'], ['detenção de quinze dias a um mês.', 'pena de crimes bem menores, como a condescendência criminosa.']], 'Médio'),
  f(5, 'Quem utiliza indevidamente conteúdo sigiloso de concurso público para beneficiar a si ou a outrem, sendo funcionário público, responde pelo art. 311-A, com', ['pena de reclusão de um a quatro anos e multa, aumentada de um terço por ser funcionário público.', 'Art. 311-A, caput e § 3º.'], [['pena de detenção, sem aumento.', 'a pena é de reclusão, com aumento para funcionário.'], ['pena apenas de multa.', 'a multa vem somada à reclusão.'], ['diminuição de um terço pela condição de servidor.', 'a condição de servidor agrava a pena.'], ['pena de reclusão de seis meses a dois anos.', 'o intervalo é de um a quatro anos.']], 'Difícil'),
]
const fc = mkC('fals', 'dpenal-1', 'dp-falsidades')
export const FALS_CARDS: Flashcard[] = [
  fc(1, 'Qual a pena do art. 297 (falsificação de documento público)?', 'Reclusão de 2 a 6 anos e multa; aumento de sexta parte se o funcionário se prevalece do cargo (§ 1º).'),
  fc(2, 'Qual a pena do art. 298 (documento particular)?', 'Reclusão de 1 a 5 anos e multa.'),
  fc(3, 'Falsidade material x ideológica?', 'Material: o papel é falsificado ou adulterado (297/298). Ideológica: papel verdadeiro com declaração falsa ou omitida (299).'),
  fc(4, 'Penas do art. 299?', 'Documento público: reclusão de 1 a 5 anos e multa. Particular: 1 a 3 anos e multa.'),
  fc(5, 'Qual a pena do uso de documento falso (art. 304)?', 'A mesma pena cominada à falsificação ou à alteração.'),
  fc(6, 'Diferença entre os arts. 307 e 308?', '307: atribuir-se ou atribuir a terceiro falsa identidade (detenção 3 meses–1 ano ou multa). 308: usar documento de identidade alheio ou cedê-lo (detenção 4 meses–2 anos e multa).'),
]

// ───────── 2. Arts. 313 a 317
export const P313_LESSON: Lesson = {
  id: 'dp-313', topicId: 'dpenal-3', title: 'CP arts. 313 a 317: peculato por erro, sistemas de informação, concussão e corrupção passiva', questionIds: ids('p313'),
  steps: [
    step('Entenda', [
      'Estes artigos integram o Capítulo I do Título XI (crimes praticados por funcionário público contra a administração em geral). O art. 312 (peculato) tem aula própria.',
      'Art. 313 (peculato mediante erro de outrem): apropriar-se de dinheiro ou qualquer utilidade que, no exercício do cargo, recebeu por erro de outrem. Pena: reclusão de 1 a 4 anos e multa. O funcionário não provoca o erro; apenas se aproveita dele.',
      'Art. 313-A (inserção de dados falsos em sistema de informações): inserir ou facilitar a inserção de dados falsos, alterar ou excluir indevidamente dados corretos nos sistemas informatizados ou bancos de dados da Administração Pública, com o fim de obter vantagem indevida para si ou para outrem ou para causar dano. Pena: reclusão de 2 a 12 anos e multa. Art. 313-B (modificação ou alteração não autorizada de sistema de informações): modificar ou alterar sistema de informações ou programa de informática sem autorização ou solicitação de autoridade competente. Pena: detenção de 3 meses a 2 anos e multa; aumento de um terço até a metade se resulta dano para a Administração ou para o administrado.',
      'Art. 314 (extravio, sonegação ou inutilização de livro ou documento): extraviar livro oficial ou qualquer documento de que tem a guarda em razão do cargo; sonegá-lo ou inutilizá-lo, total ou parcialmente. Pena: reclusão de 1 a 4 anos, se o fato não constitui crime mais grave. Art. 315 (emprego irregular de verbas ou rendas públicas): dar às verbas ou rendas públicas aplicação diversa da estabelecida em lei. Pena: detenção de 1 a 3 meses, ou multa.',
      'Art. 316 (concussão): EXIGIR, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida. Pena: reclusão de 2 a 8 anos e multa. § 1º (excesso de exação): exigir tributo ou contribuição social que sabe ou deveria saber indevido, ou, quando devido, empregar na cobrança meio vexatório ou gravoso que a lei não autoriza. Pena: reclusão de 3 a 8 anos e multa. § 2º: se o funcionário desvia, em proveito próprio ou de outrem, o que recebeu indevidamente para recolher aos cofres públicos: reclusão de 2 a 12 anos e multa.',
      'Art. 317 (corrupção passiva): SOLICITAR ou RECEBER, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida, ou ACEITAR promessa de tal vantagem. Pena: reclusão de 2 a 12 anos e multa. § 1º: aumento de um terço se, em consequência da vantagem ou promessa, o funcionário retarda ou deixa de praticar ato de ofício, ou o pratica infringindo dever funcional. § 2º: se pratica, deixa de praticar ou retarda ato de ofício, com infração de dever funcional, cedendo a pedido ou influência de outrem: detenção de 3 meses a 1 ano, ou multa.',
      AVISO],
      'Verbos-chave: concussão = EXIGIR; corrupção passiva = SOLICITAR, RECEBER ou ACEITAR promessa. Dois crimes, as mesmas penas básicas (concussão 2–8; corrupção passiva 2–12).'),
    step('Exemplo prático', [
      'Caso 1 — o servidor recebe de um cidadão valor pago a mais, por engano, e o guarda para si: peculato mediante erro (art. 313).',
      'Caso 2 — o servidor autorizado altera, no sistema do órgão, o saldo de horas de um amigo para vantagem indevida: art. 313-A.',
      'Caso 3 — o fiscal diz ao comerciante: "pague R$ 500 ou fecho sua loja": concussão (art. 316), porque exigiu.',
      'Caso 4 — o servidor pede dinheiro para agilizar a análise do processo: corrupção passiva (art. 317), pois solicitou.',
      'Caso 5 — o secretário usa a verba da educação para pagar evento, contra a destinação legal: emprego irregular de verbas (art. 315).'],
      'Pergunta-teste: "quem tomou a iniciativa e como?" Exigiu: 316. Pediu, recebeu ou aceitou: 317.'),
    step('Resumo essencial', ['Penas dos arts. 313 a 317.'], undefined, { caption: 'Arts. 313 a 317', head: ['Art.', 'Crime', 'Pena'], rows: [
      ['313', 'Peculato mediante erro de outrem', 'Reclusão 1–4 anos e multa'],
      ['313-A', 'Inserção de dados falsos em sistema', 'Reclusão 2–12 anos e multa'],
      ['313-B', 'Alteração não autorizada de sistema', 'Detenção 3 meses–2 anos e multa'],
      ['314', 'Extravio, sonegação ou inutilização de documento', 'Reclusão 1–4 anos'],
      ['315', 'Emprego irregular de verbas', 'Detenção 1–3 meses, ou multa'],
      ['316', 'Concussão', 'Reclusão 2–8 anos e multa'],
      ['317', 'Corrupção passiva', 'Reclusão 2–12 anos e multa']] }),
    step('O que memorizar', [
      '• 313: aproveitar-se do erro de outrem (reclusão de 1 a 4 e multa).',
      '• 313-A: reclusão de 2 a 12; 313-B: detenção de 3 meses a 2 anos.',
      '• 316: EXIGIR; 316, § 1º, excesso de exação: de 3 a 8.',
      '• 317: SOLICITAR, RECEBER, ACEITAR PROMESSA; de 2 a 12.',
      '• 317, § 1º: aumento de um terço; § 2º: detenção de 3 meses a 1 ano ou multa.'] ),
  ],
}
const p3 = mk('p313', 'dpenal-3')
export const P313_QUESTIONS: Question[] = [
  p3(1, 'O funcionário público que se apropria de dinheiro que, no exercício do cargo, recebeu por erro de outrem pratica', ['peculato mediante erro de outrem (art. 313), punido com reclusão de um a quatro anos e multa.', 'Art. 313.'], [['concussão (art. 316).', 'a concussão exige a conduta de exigir.'], ['corrupção passiva (art. 317).', 'não há solicitação ou recebimento de vantagem em razão da função.'], ['extravio de documento (art. 314).', 'o objeto aqui é dinheiro ou utilidade.'], ['emprego irregular de verbas (art. 315).', 'esse crime trata de destinação de verbas públicas.']], 'Fácil'),
  p3(2, 'O verbo nuclear do crime de concussão (art. 316 do CP) é', ['exigir.', 'Diferencia-se da corrupção passiva, que tem "solicitar, receber e aceitar promessa".'], [['solicitar.', 'é verbo da corrupção passiva.'], ['aceitar promessa.', 'é verbo da corrupção passiva.'], ['oferecer.', 'é verbo da corrupção ativa (art. 333).'], ['sonegar.', 'é verbo do art. 314.']], 'Fácil'),
  p3(3, 'A pena de reclusão do art. 317, caput (corrupção passiva), é de', ['dois a doze anos e multa.', 'Art. 317, caput.'], [['um a quatro anos e multa.', 'é a pena do peculato por erro.'], ['dois a oito anos e multa.', 'é a pena da concussão.'], ['três a oito anos e multa.', 'é a do excesso de exação (art. 316, § 1º).'], ['três meses a um ano.', 'é a do § 2º do art. 317 (privilegiada).']], 'Médio'),
  p3(4, 'Segundo o art. 313-A, a conduta do funcionário autorizado que insere dados falsos em sistema informatizado da Administração, para obter vantagem indevida, é punida com', ['reclusão, de dois a doze anos, e multa.', 'Art. 313-A.'], [['detenção, de três meses a dois anos, e multa.', 'essa é a pena do art. 313-B (alteração sem autorização).'], ['reclusão de um a quatro anos.', 'é a pena do art. 314.'], ['detenção de um a três meses.', 'é a pena do art. 315.'], ['multa apenas.', 'há reclusão e multa.']], 'Médio'),
  p3(5, 'No art. 317, § 2º, o funcionário que pratica ato de ofício com infração de dever funcional, cedendo a pedido ou influência de outrem, sujeita-se a', ['detenção, de três meses a um ano, ou multa.', 'É a corrupção passiva privilegiada.'], [['reclusão de dois a doze anos.', 'é a pena do caput.'], ['aumento de um terço sobre a pena do caput.', 'o aumento é do § 1º, quando há vantagem ou promessa.'], ['reclusão de um a quatro anos.', 'não é a pena do § 2º.'], ['isenção de pena.', 'a conduta é punida.']], 'Difícil'),
]
const c3 = mkC('p313', 'dpenal-3', 'dp-313')
export const P313_CARDS: Flashcard[] = [
  c3(1, 'O que é o peculato do art. 313?', 'Apropriar-se de dinheiro ou utilidade recebidos, no exercício do cargo, por erro de outrem. Reclusão de 1 a 4 anos e multa.'),
  c3(2, 'Qual a diferença entre 313-A e 313-B?', '313-A: inserir dados falsos ou alterar/excluir dados corretos com fim de vantagem ou dano (reclusão 2–12 e multa). 313-B: alterar sistema sem autorização (detenção 3 meses–2 anos e multa).'),
  c3(3, 'Qual a pena do art. 314?', 'Reclusão de 1 a 4 anos, se o fato não constitui crime mais grave.'),
  c3(4, 'Qual a pena do art. 315?', 'Detenção de 1 a 3 meses, ou multa.'),
  c3(5, 'Concussão x corrupção passiva?', 'Concussão (316): EXIGIR, 2 a 8 anos. Corrupção passiva (317): SOLICITAR, RECEBER ou ACEITAR PROMESSA, 2 a 12 anos.'),
  c3(6, 'O que é o excesso de exação (art. 316, § 1º)?', 'Exigir tributo que sabe ou deveria saber indevido, ou usar meio vexatório ou gravoso na cobrança. Reclusão de 3 a 8 anos e multa.'),
]

// ───────── 3. Arts. 319 a 327
export const P319_LESSON: Lesson = {
  id: 'dp-319', topicId: 'dpenal-4', title: 'CP arts. 319 a 327: prevaricação, advocacia administrativa, abandono de função e conceito de funcionário', questionIds: ids('p319'),
  steps: [
    step('Entenda', [
      'Art. 319 (prevaricação): retardar ou deixar de praticar, indevidamente, ato de ofício, ou praticá-lo contra disposição expressa de lei, para satisfazer interesse ou sentimento pessoal. Pena: detenção de 3 meses a 1 ano e multa. O traço decisivo é o ELEMENTO SUBJETIVO: a finalidade pessoal. Art. 319-A: deixar o Diretor de Penitenciária e/ou agente público de cumprir seu dever de vedar ao preso o acesso a aparelho telefônico, de rádio ou similar. Pena: detenção de 3 meses a 1 ano.',
      'Art. 320 (condescendência criminosa): deixar o funcionário, por indulgência, de responsabilizar subordinado que cometeu infração no exercício do cargo ou, quando lhe falte competência, não levar o fato ao conhecimento da autoridade competente. Pena: detenção de 15 dias a 1 mês, ou multa.',
      'Art. 321 (advocacia administrativa): patrocinar, direta ou indiretamente, interesse privado perante a administração pública, valendo-se da qualidade de funcionário. Pena: detenção de 1 a 3 meses, ou multa. Parágrafo único: se o interesse é ilegítimo, detenção de 3 meses a 1 ano, além da multa.',
      'Art. 322 (violência arbitrária): praticar violência no exercício de função ou a pretexto de exercê-la. Pena: detenção de 6 meses a 3 anos, além da pena correspondente à violência. Art. 323 (abandono de função): abandonar cargo público, fora dos casos permitidos em lei. Pena: detenção de 15 dias a 1 mês, ou multa. § 1º: se do fato resulta prejuízo público, detenção de 3 meses a 1 ano e multa. § 2º: em lugar compreendido na faixa de fronteira, detenção de 1 a 3 anos e multa.',
      'Art. 324 (exercício funcional ilegalmente antecipado ou prorrogado): entrar no exercício de função pública antes de satisfeitas as exigências legais, ou continuar a exercê-la, sem autorização, depois de saber oficialmente que foi exonerado, removido, substituído ou suspenso. Pena: detenção de 15 dias a 1 mês, ou multa.',
      'Art. 325 (violação de sigilo funcional): revelar fato de que tem ciência em razão do cargo e que deva permanecer em segredo, ou facilitar-lhe a revelação. Pena: detenção de 6 meses a 2 anos, ou multa, se o fato não constitui crime mais grave. § 1º: nas mesmas penas incorre quem permite ou facilita, mediante atribuição, fornecimento ou empréstimo de senha ou qualquer outra forma, o acesso de pessoas não autorizadas a sistemas de informações ou banco de dados da Administração; ou se utiliza, indevidamente, do acesso restrito. § 2º: se da ação ou omissão resulta dano à Administração Pública ou a outrem: reclusão de 2 a 6 anos e multa.',
      'Art. 326: consta do intervalo do edital, mas é considerado revogado (violação do sigilo de proposta de concorrência, que passou à lei de licitações). Confirme a situação no Planalto.',
      'Art. 327 (conceito): considera-se funcionário público, para os efeitos penais, quem, embora transitoriamente ou sem remuneração, exerce cargo, emprego ou função pública. § 1º: equipara-se a funcionário público quem exerce cargo, emprego ou função em entidade paraestatal, e quem trabalha para empresa prestadora de serviço contratada ou conveniada para a execução de atividade típica da Administração Pública. § 2º: a pena é aumentada da terça parte quando os autores dos crimes previstos neste Capítulo forem ocupantes de cargos em comissão ou de função de direção ou assessoramento de órgão da administração direta, sociedade de economia mista, empresa pública ou fundação instituída pelo poder público.',
      AVISO],
      'Prevaricação exige "interesse ou sentimento pessoal". Sem essa finalidade, o fato não é prevaricação. Funcionário público, para a lei penal, inclui quem trabalha sem remuneração ou transitoriamente.'),
    step('Exemplo prático', [
      'Caso 1 — o servidor retarda o andamento de um processo por antipatia pelo interessado: prevaricação (art. 319).',
      'Caso 2 — o chefe sabe que o subordinado cometeu infração e nada faz, por pena: condescendência criminosa (art. 320).',
      'Caso 3 — o servidor leva ao setor um amigo e o recomenda com insistência a favor de pedido ilegítimo: advocacia administrativa (art. 321), com pena maior pela ilegitimidade.',
      'Caso 4 — o servidor revela a terceiros o conteúdo de processo sigiloso: violação de sigilo funcional (art. 325).',
      'Caso 5 — o estagiário voluntário, sem remuneração, comete peculato: é funcionário público para a lei penal (art. 327).'],
      'Pergunta-teste: "o servidor tinha o dever e deixou de agir por motivo pessoal?" Prevaricação.'),
    step('Resumo essencial', ['Penas dos arts. 319 a 325.'], undefined, { caption: 'Arts. 319 a 327', head: ['Art.', 'Crime', 'Pena'], rows: [
      ['319', 'Prevaricação', 'Detenção 3 meses–1 ano e multa'],
      ['319-A', 'Omissão quanto a celular de preso', 'Detenção 3 meses–1 ano'],
      ['320', 'Condescendência criminosa', 'Detenção 15 dias–1 mês, ou multa'],
      ['321', 'Advocacia administrativa', 'Detenção 1–3 meses, ou multa'],
      ['322', 'Violência arbitrária', 'Detenção 6 meses–3 anos, além da violência'],
      ['323', 'Abandono de função', 'Detenção 15 dias–1 mês, ou multa'],
      ['324', 'Exercício funcional ilegalmente antecipado ou prorrogado', 'Detenção 15 dias–1 mês, ou multa'],
      ['325', 'Violação de sigilo funcional', 'Detenção 6 meses–2 anos, ou multa']] }),
    step('O que memorizar', [
      '• 319: interesse ou sentimento pessoal; detenção de 3 meses a 1 ano e multa.',
      '• 321: patrocinar interesse privado perante a administração; ilegítimo = pena maior.',
      '• 323: abandono; faixa de fronteira = de 1 a 3 anos.',
      '• 325: § 1º trata de senha e acesso indevido; § 2º, dano = reclusão de 2 a 6.',
      '• 326: revogado (confirme). 327: transitoriamente ou sem remuneração; § 2º aumenta de um terço para cargo em comissão, direção ou assessoramento.'] ),
  ],
}
const p9 = mk('p319', 'dpenal-4')
export const P319_QUESTIONS: Question[] = [
  p9(1, 'No crime de prevaricação (art. 319 do CP), a finalidade exigida do agente é', ['satisfazer interesse ou sentimento pessoal.', 'Esse é o elemento subjetivo do tipo.'], [['obter vantagem econômica indevida.', 'o enriquecimento é traço da corrupção, não da prevaricação.'], ['causar prejuízo à Administração.', 'a lei exige interesse ou sentimento pessoal.'], ['ocultar crime anterior.', 'não é a finalidade do tipo.'], ['cumprir ordem superior.', 'a ordem superior não é a finalidade típica.']], 'Fácil'),
  p9(2, 'Patrocinar, direta ou indiretamente, interesse privado perante a administração pública, valendo-se da qualidade de funcionário, é', ['advocacia administrativa (art. 321), punida com pena maior se o interesse é ilegítimo.', 'Art. 321 e parágrafo único.'], [['prevaricação.', 'a prevaricação exige retardar ou omitir ato de ofício.'], ['concussão.', 'a concussão exige exigir vantagem.'], ['tráfico de influência.', 'esse crime é cometido por qualquer pessoa, a pretexto de influir em ato de funcionário.'], ['condescendência criminosa.', 'esse crime trata da omissão do chefe diante da falta do subordinado.']], 'Médio'),
  p9(3, 'Segundo o art. 327 do CP, para os efeitos penais, funcionário público é quem exerce cargo, emprego ou função pública', ['ainda que transitoriamente ou sem remuneração.', 'Art. 327, caput.'], [['somente se for efetivo.', 'o conceito é mais amplo, inclui os transitórios.'], ['somente se remunerado.', 'a lei diz expressamente "sem remuneração".'], ['somente se aprovado em concurso.', 'o conceito não depende de concurso.'], ['somente na administração direta.', 'o § 1º equipara pessoas de entidades paraestatais e de empresas contratadas.']], 'Fácil'),
  p9(4, 'No art. 327, § 2º, a pena é aumentada da terça parte quando os autores dos crimes do capítulo forem', ['ocupantes de cargos em comissão ou de função de direção ou assessoramento de órgão da administração direta, de sociedade de economia mista, de empresa pública ou de fundação instituída pelo poder público.', 'Art. 327, § 2º.'], [['servidores efetivos com mais de dez anos de carreira.', 'o critério é cargo em comissão, direção ou assessoramento.'], ['funcionários equiparados de empresa contratada.', 'o § 1º apenas os equipara; o aumento é do § 2º.'], ['servidores em estágio probatório.', 'o texto não fala em estágio probatório.'], ['estagiários.', 'os estagiários não são o alvo do aumento.']], 'Médio'),
  p9(5, 'No art. 325, o parágrafo que prevê reclusão de 2 a 6 anos e multa trata de', ['violação de sigilo funcional da qual resulta dano à Administração Pública ou a outrem.', 'Art. 325, § 2º.'], [['abandono de cargo em faixa de fronteira.', 'essa hipótese está no art. 323, § 2º, e a pena é de detenção.'], ['advocacia administrativa com interesse ilegítimo.', 'essa hipótese está no art. 321, parágrafo único.'], ['condescendência criminosa.', 'a pena do art. 320 é bem menor.'], ['prevaricação.', 'a pena do art. 319 é detenção.']], 'Difícil'),
]
const c9 = mkC('p319', 'dpenal-4', 'dp-319')
export const P319_CARDS: Flashcard[] = [
  c9(1, 'Quais os elementos da prevaricação?', 'Retardar ou deixar de praticar ato de ofício (ou praticá-lo contra a lei) para satisfazer interesse ou sentimento pessoal. Detenção de 3 meses a 1 ano e multa.'),
  c9(2, 'O que é condescendência criminosa (art. 320)?', 'Deixar, por indulgência, de responsabilizar subordinado infrator ou de comunicar à autoridade competente. Detenção de 15 dias a 1 mês, ou multa.'),
  c9(3, 'Qual a pena da advocacia administrativa?', 'Detenção de 1 a 3 meses, ou multa; se o interesse é ilegítimo, detenção de 3 meses a 1 ano, além da multa.'),
  c9(4, 'Quais as penas do abandono de função (art. 323)?', 'Caput: 15 dias a 1 mês, ou multa. § 1º (prejuízo público): 3 meses a 1 ano e multa. § 2º (faixa de fronteira): 1 a 3 anos e multa.'),
  c9(5, 'O que o art. 325, § 1º, pune?', 'Permitir ou facilitar, mediante senha ou outra forma, o acesso de pessoas não autorizadas a sistemas de informações da Administração, e usar indevidamente o acesso restrito.'),
  c9(6, 'O que o art. 327, § 1º, equipara a funcionário público?', 'Quem exerce cargo, emprego ou função em entidade paraestatal e quem trabalha para empresa contratada ou conveniada para executar atividade típica da Administração.'),
]

// ───────── 4. Arts. 328 a 333
export const P328_LESSON: Lesson = {
  id: 'dp-328', topicId: 'dpenal-4', title: 'CP arts. 328 a 333: usurpação, resistência, desobediência, desacato e corrupção ativa', questionIds: ids('p328'),
  steps: [
    step('Entenda', [
      'Estes artigos formam o Capítulo II do Título XI: crimes praticados por PARTICULAR contra a administração em geral. Qualquer pessoa pode ser autora.',
      'Art. 328 (usurpação de função pública): usurpar o exercício de função pública. Pena: detenção de 3 meses a 2 anos e multa. Parágrafo único: se do fato o agente aufere vantagem, reclusão de 2 a 5 anos e multa.',
      'Art. 329 (resistência): opor-se à execução de ato legal, mediante violência ou ameaça a funcionário competente para executá-lo ou a quem lhe esteja prestando auxílio. Pena: detenção de 2 meses a 2 anos. § 1º: se o ato, em razão da resistência, não se executa: reclusão de 1 a 3 anos. § 2º: as penas são aplicáveis sem prejuízo das correspondentes à violência.',
      'Art. 330 (desobediência): desobedecer a ordem legal de funcionário público. Pena: detenção de 15 dias a 6 meses e multa. Art. 331 (desacato): desacatar funcionário público no exercício da função ou em razão dela. Pena: detenção de 6 meses a 2 anos, ou multa. O Supremo Tribunal Federal entendeu que o desacato foi recepcionado pela Constituição (ADPF 496); confirme o acórdão se precisar citá-lo.',
      'Art. 332 (tráfico de influência): solicitar, exigir, cobrar ou obter, para si ou para outrem, vantagem ou promessa de vantagem, a pretexto de influir em ato praticado por funcionário público no exercício da função. Pena: reclusão de 2 a 5 anos e multa. Parágrafo único: a pena é aumentada da metade, se o agente alega ou insinua que a vantagem é também destinada ao funcionário.',
      'Art. 333 (corrupção ativa): oferecer ou prometer vantagem indevida a funcionário público, para determiná-lo a praticar, omitir ou retardar ato de ofício. Pena: reclusão de 2 a 12 anos e multa. Parágrafo único: a pena é aumentada de um terço, se, em razão da vantagem ou promessa, o funcionário retarda ou omite ato de ofício, ou o pratica infringindo dever funcional.',
      AVISO],
      'Corrupção ativa (333) é a "outra face" da passiva (317): o particular OFERECE ou PROMETE. A pena é a mesma (2 a 12 anos). Tráfico de influência (332) é diferente: o agente vende uma influência que invoca ter.'),
    step('Exemplo prático', [
      'Caso 1 — um cidadão, sem ser servidor, passa-se por fiscal e realiza vistorias: usurpação de função pública (art. 328).',
      'Caso 2 — o motorista ameaça com faca o policial que vai lhe aplicar a multa: resistência (art. 329), além da pena da ameaça ou violência.',
      'Caso 3 — o cidadão descumpre ordem legal de parar o veículo dada por agente de trânsito, sem violência: desobediência (art. 330).',
      'Caso 4 — o cidadão xinga o servidor no balcão, em razão da função: desacato (art. 331).',
      'Caso 5 — o cidadão oferece dinheiro ao fiscal para ele não lavrar a multa: corrupção ativa (art. 333).'],
      'Pergunta-teste: "o agente é particular e ofereceu vantagem?" 333. "Cobrou vantagem a pretexto de influenciar servidor?" 332. "Usou violência ou ameaça contra ato legal?" 329.'),
    step('Resumo essencial', ['Penas dos arts. 328 a 333.'], undefined, { caption: 'Arts. 328 a 333', head: ['Art.', 'Crime', 'Pena'], rows: [
      ['328', 'Usurpação de função pública', 'Detenção 3 meses–2 anos e multa'],
      ['329', 'Resistência', 'Detenção 2 meses–2 anos'],
      ['330', 'Desobediência', 'Detenção 15 dias–6 meses e multa'],
      ['331', 'Desacato', 'Detenção 6 meses–2 anos, ou multa'],
      ['332', 'Tráfico de influência', 'Reclusão 2–5 anos e multa'],
      ['333', 'Corrupção ativa', 'Reclusão 2–12 anos e multa']] }),
    step('O que memorizar', [
      '• 328: usurpar função; se obtém vantagem, reclusão de 2 a 5 e multa.',
      '• 329: violência ou ameaça; se o ato não se executa, reclusão de 1 a 3.',
      '• 330: desobediência sem violência; 331: desacato, detenção de 6 meses a 2 anos ou multa.',
      '• 332: pretexto de influir; aumento da metade se alega que o dinheiro também vai ao funcionário.',
      '• 333: oferecer ou prometer; reclusão de 2 a 12 e multa; aumento de um terço.'] ),
  ],
}
const p8 = mk('p328', 'dpenal-4')
export const P328_QUESTIONS: Question[] = [
  p8(1, 'Oferecer ou prometer vantagem indevida a funcionário público, para determiná-lo a praticar, omitir ou retardar ato de ofício, configura', ['corrupção ativa (art. 333), punida com reclusão de dois a doze anos e multa.', 'Art. 333, caput.'], [['corrupção passiva (art. 317).', 'esta é praticada pelo funcionário, que solicita, recebe ou aceita promessa.'], ['tráfico de influência (art. 332).', 'neste crime, o agente cobra vantagem a pretexto de influir em ato do funcionário.'], ['concussão (art. 316).', 'a concussão é do funcionário que exige.'], ['desacato (art. 331).', 'o desacato é ofensa ao funcionário.']], 'Fácil'),
  p8(2, 'Opor-se à execução de ato legal, mediante violência ou ameaça a funcionário competente para executá-lo, é', ['resistência (art. 329).', 'Art. 329: o crime exige violência ou ameaça.'], [['desobediência (art. 330).', 'a desobediência não envolve violência ou ameaça.'], ['desacato (art. 331).', 'o desacato consiste em ofender o funcionário.'], ['coação no curso do processo (art. 344).', 'esse crime é praticado contra pessoa que intervém em processo.'], ['usurpação de função pública (art. 328).', 'esse crime consiste em exercer indevidamente a função pública.']], 'Fácil'),
  p8(3, 'Se, em razão da resistência, o ato legal não se executa, a pena prevista no art. 329, § 1º, é de', ['reclusão, de um a três anos.', 'Art. 329, § 1º.'], [['detenção, de dois meses a dois anos.', 'é a pena do caput.'], ['reclusão, de dois a cinco anos.', 'é a pena do tráfico de influência.'], ['detenção de quinze dias a seis meses.', 'é a pena da desobediência.'], ['detenção de três meses a dois anos.', 'é a pena da usurpação (caput).']], 'Médio'),
  p8(4, 'Solicitar vantagem a pretexto de influir em ato praticado por funcionário público no exercício da função é', ['tráfico de influência (art. 332), com pena aumentada da metade se o agente alega que a vantagem também se destina ao funcionário.', 'Art. 332 e parágrafo único.'], [['corrupção ativa, com aumento de um terço.', 'o aumento de um terço pertence ao art. 333.'], ['concussão, com pena de reclusão de dois a oito anos.', 'a concussão é praticada por funcionário.'], ['advocacia administrativa.', 'esta é praticada pelo funcionário, que patrocina interesse privado.'], ['exploração de prestígio, em qualquer hipótese.', 'a exploração de prestígio (art. 357) refere-se a influência sobre pessoas da Justiça.']], 'Difícil'),
  p8(5, 'A pena do desacato (art. 331) é de', ['detenção, de seis meses a dois anos, ou multa.', 'Art. 331.'], [['detenção, de quinze dias a seis meses, e multa.', 'é a pena da desobediência.'], ['reclusão, de dois a cinco anos.', 'é a do tráfico de influência.'], ['detenção, de dois meses a dois anos.', 'é a da resistência.'], ['reclusão, de dois a doze anos.', 'é a da corrupção.']], 'Médio'),
]
const c8 = mkC('p328', 'dpenal-4', 'dp-328')
export const P328_CARDS: Flashcard[] = [
  c8(1, 'Qual a pena da usurpação de função pública?', 'Detenção de 3 meses a 2 anos e multa; se obtém vantagem, reclusão de 2 a 5 anos e multa.'),
  c8(2, 'Resistência x desobediência?', 'Resistência (329): violência ou ameaça. Desobediência (330): descumprir ordem legal sem violência.'),
  c8(3, 'Qual a pena da desobediência?', 'Detenção de 15 dias a 6 meses e multa.'),
  c8(4, 'Qual a pena do desacato?', 'Detenção de 6 meses a 2 anos, ou multa.'),
  c8(5, 'O que é tráfico de influência?', 'Solicitar, exigir, cobrar ou obter vantagem a pretexto de influir em ato de funcionário. Reclusão de 2 a 5 anos e multa; aumento da metade se disser que a vantagem também vai ao funcionário.'),
  c8(6, 'Qual a pena da corrupção ativa?', 'Reclusão de 2 a 12 anos e multa; aumento de um terço se o funcionário retarda, omite ou pratica o ato com infração de dever.'),
]

// ───────── 5. Arts. 336, 337, 339 a 341
export const P336_LESSON: Lesson = {
  id: 'dp-336', topicId: 'dpenal-5', title: 'CP arts. 336, 337 e 339 a 341: inutilização de edital, subtração de documento e falsas comunicações', questionIds: ids('p336'),
  steps: [
    step('Entenda', [
      'Art. 336 (inutilização de edital ou de sinal): rasgar ou, de qualquer forma, inutilizar ou conspurcar edital afixado por ordem de funcionário público; violar ou inutilizar selo ou sinal empregado, por determinação legal ou por ordem de funcionário público, para identificar ou cerrar qualquer objeto. Pena: detenção de 1 mês a 1 ano, ou multa.',
      'Art. 337 (subtração ou inutilização de livro ou documento): subtrair, ou inutilizar, total ou parcialmente, livro oficial, processo ou documento confiado à custódia de funcionário, em razão de ofício, ou de particular em serviço público. Pena: reclusão de 2 a 5 anos, se o fato não constitui crime mais grave.',
      'Art. 339 (denunciação caluniosa): dar causa à instauração de investigação policial, de processo judicial, de investigação administrativa, de inquérito civil ou de ação de improbidade administrativa contra alguém, imputando-lhe crime, infração ético-disciplinar ou ato ímprobo de que o sabe inocente. Pena: reclusão de 2 a 8 anos e multa. § 1º: a pena é aumentada de sexta parte, se o agente se serve de anonimato ou de nome suposto. § 2º: a pena é diminuída de metade, se a imputação é de prática de contravenção.',
      'Art. 340 (comunicação falsa de crime ou de contravenção): provocar a ação de autoridade, comunicando-lhe a ocorrência de crime ou de contravenção que sabe não se ter verificado. Pena: detenção de 1 a 6 meses, ou multa. Art. 341 (autoacusação falsa): acusar-se, perante a autoridade, de crime inexistente ou praticado por outrem. Pena: detenção de 3 meses a 2 anos, ou multa.',
      AVISO],
      'Denunciação caluniosa (339) tem alvo CERTO (uma pessoa que se sabe inocente). Comunicação falsa (340) não aponta culpado. Autoacusação falsa (341): a pessoa acusa A SI MESMA.'),
    step('Exemplo prático', [
      'Caso 1 — alguém arranca de propósito um edital de concurso afixado no fórum: art. 336.',
      'Caso 2 — o particular que presta serviço ao tribunal faz desaparecer um processo que estava sob sua guarda: art. 337.',
      'Caso 3 — o cidadão registra boletim de ocorrência contra o vizinho, sabendo-o inocente, e o inquérito é instaurado: denunciação caluniosa (art. 339).',
      'Caso 4 — o cidadão liga ao 190 dizendo que houve assalto, sabendo que nada ocorreu: comunicação falsa de crime (art. 340).',
      'Caso 5 — o irmão vai à delegacia e diz que cometeu o crime praticado por outro, para livrá-lo: autoacusação falsa (art. 341).'],
      'Pergunta-teste: "há uma pessoa certa, que o agente sabe inocente, apontada como culpada?" Sim: 339. Não: 340.'),
    step('Resumo essencial', ['Penas dos arts. 336 a 341.'], undefined, { caption: 'Arts. 336 a 341', head: ['Art.', 'Crime', 'Pena'], rows: [
      ['336', 'Inutilização de edital ou de sinal', 'Detenção 1 mês–1 ano, ou multa'],
      ['337', 'Subtração ou inutilização de livro ou documento', 'Reclusão 2–5 anos'],
      ['339', 'Denunciação caluniosa', 'Reclusão 2–8 anos e multa'],
      ['340', 'Comunicação falsa de crime', 'Detenção 1–6 meses, ou multa'],
      ['341', 'Autoacusação falsa', 'Detenção 3 meses–2 anos, ou multa']] }),
    step('O que memorizar', [
      '• 336: edital ou sinal; detenção de 1 mês a 1 ano, ou multa.',
      '• 337: livro, processo ou documento sob custódia; reclusão de 2 a 5.',
      '• 339: reclusão de 2 a 8 e multa; aumento de sexta parte (anonimato/nome suposto); diminuição de metade (contravenção).',
      '• 340: crime que sabe não ter ocorrido. 341: acusar-se de crime inexistente ou de outrem.'] ),
  ],
}
const p6 = mk('p336', 'dpenal-5')
export const P336_QUESTIONS: Question[] = [
  p6(1, 'Dar causa à instauração de investigação policial contra alguém, imputando-lhe crime de que o sabe inocente, é', ['denunciação caluniosa (art. 339), punida com reclusão de dois a oito anos e multa.', 'Art. 339, caput.'], [['comunicação falsa de crime (art. 340).', 'neste não há pessoa certa e determinada que se sabe inocente.'], ['autoacusação falsa (art. 341).', 'neste o agente acusa a si mesmo.'], ['falso testemunho (art. 342).', 'este é cometido por testemunha, perito etc. em processo.'], ['fraude processual (art. 347).', 'a fraude processual consiste em inovar o estado de lugar, de coisa ou de pessoa.']], 'Fácil'),
  p6(2, 'Se o agente da denunciação caluniosa se serve de anonimato ou de nome suposto, a pena é', ['aumentada de sexta parte.', 'Art. 339, § 1º.'], [['diminuída de sexta parte.', 'não há diminuição nessa hipótese.'], ['aumentada da metade.', 'o aumento é de sexta parte.'], ['diminuída de metade.', 'a diminuição pela metade ocorre quando a imputação é de contravenção.'], ['inalterada.', 'a lei prevê aumento.']], 'Médio'),
  p6(3, 'Comunicar à autoridade a ocorrência de crime que se sabe não ter ocorrido configura', ['comunicação falsa de crime ou de contravenção (art. 340), com detenção de um a seis meses, ou multa.', 'Art. 340.'], [['denunciação caluniosa, com reclusão de dois a oito anos.', 'esta exige imputação a pessoa certa que se sabe inocente.'], ['autoacusação falsa, com detenção de três meses a dois anos.', 'esta é acusar-se de crime inexistente ou de outrem.'], ['desobediência.', 'não há desobediência de ordem legal.'], ['atipicidade, por ser mero trote.', 'a conduta é típica.']], 'Fácil'),
  p6(4, 'A pena do art. 337 (subtração ou inutilização de livro ou documento confiado à custódia de funcionário) é de', ['reclusão, de dois a cinco anos, se o fato não constitui crime mais grave.', 'Art. 337.'], [['reclusão, de um a quatro anos.', 'essa é a pena do extravio (art. 314), cometido por quem tem a guarda.'], ['detenção, de um mês a um ano, ou multa.', 'essa é a pena do art. 336.'], ['detenção de três meses a dois anos.', 'não é a pena do art. 337.'], ['reclusão de dois a oito anos e multa.', 'é a pena da denunciação caluniosa.']], 'Difícil'),
  p6(5, 'Acusar-se, perante a autoridade, de crime inexistente ou praticado por outrem é', ['autoacusação falsa (art. 341), punida com detenção de três meses a dois anos, ou multa.', 'Art. 341.'], [['falso testemunho.', 'o falso testemunho é cometido por testemunha, perito etc.'], ['favorecimento pessoal.', 'este crime não está entre os artigos do edital.'], ['denunciação caluniosa.', 'esta recai sobre terceiro inocente.'], ['comunicação falsa de crime, com detenção de um a seis meses.', 'esta recai sobre ocorrência inexistente, sem a pessoa se acusar.']], 'Médio'),
]
const c6 = mkC('p336', 'dpenal-5', 'dp-336')
export const P336_CARDS: Flashcard[] = [
  c6(1, 'O que protege o art. 336?', 'Edital afixado por ordem de funcionário, selo ou sinal legal. Detenção de 1 mês a 1 ano, ou multa.'),
  c6(2, 'Qual a pena do art. 337?', 'Reclusão de 2 a 5 anos, se o fato não constitui crime mais grave.'),
  c6(3, 'Penas e variações da denunciação caluniosa (339)?', 'Reclusão de 2 a 8 anos e multa; aumento de sexta parte (anonimato/nome suposto); diminuição de metade (contravenção).'),
  c6(4, 'Denunciação caluniosa x comunicação falsa?', '339: imputa a pessoa certa, que sabe inocente. 340: comunica crime que sabe não ter ocorrido.'),
  c6(5, 'Qual a pena da comunicação falsa de crime?', 'Detenção de 1 a 6 meses, ou multa.'),
  c6(6, 'O que é autoacusação falsa e qual a pena?', 'Acusar-se de crime inexistente ou praticado por outrem. Detenção de 3 meses a 2 anos, ou multa.'),
]

// ───────── 6. Arts. 342 a 347, 357, 359
export const P342_LESSON: Lesson = {
  id: 'dp-342', topicId: 'dpenal-5', title: 'CP arts. 342 a 347, 357 e 359: crimes contra a administração da Justiça', questionIds: ids('p342'),
  steps: [
    step('Entenda', [
      'Art. 342 (falso testemunho ou falsa perícia): fazer afirmação falsa, ou negar ou calar a verdade, como testemunha, perito, contador, tradutor ou intérprete em processo judicial, ou administrativo, inquérito policial, ou em juízo arbitral. Pena: reclusão de 2 a 4 anos e multa. § 1º: a pena aumenta-se de um sexto a um terço, se o crime é praticado mediante suborno ou cometido com o fim de obter prova destinada a produzir efeito em processo penal, ou em processo civil em que for parte entidade da administração pública direta ou indireta. § 2º: o fato deixa de ser punível se, antes da sentença no processo em que ocorreu o ilícito, o agente se retrata ou declara a verdade.',
      'Art. 343 (corrupção ativa de testemunha ou perito): dar, oferecer ou prometer dinheiro ou qualquer outra vantagem a testemunha, perito, contador, tradutor ou intérprete, para fazer afirmação falsa, negar ou calar a verdade. Pena: reclusão de 3 a 4 anos e multa. Art. 344 (coação no curso do processo): usar de violência ou grave ameaça, com o fim de favorecer interesse próprio ou alheio, contra autoridade, parte, ou qualquer outra pessoa que funciona ou é chamada a intervir em processo judicial, policial ou administrativo, ou em juízo arbitral. Pena: reclusão de 1 a 4 anos e multa, além da pena correspondente à violência.',
      'Art. 345 (exercício arbitrário das próprias razões): fazer justiça pelas próprias mãos, para satisfazer pretensão, embora legítima, salvo quando a lei o permite. Pena: detenção de 15 dias a 1 mês, ou multa, além da pena correspondente à violência. Parágrafo único: se não há emprego de violência, somente se procede mediante queixa. Art. 346 (subtração ou dano de coisa própria em poder de terceiro): tirar, suprimir, destruir ou danificar coisa própria, que se acha em poder de terceiro por determinação judicial ou convenção. Pena: detenção de 6 meses a 2 anos e multa.',
      'Art. 347 (fraude processual): inovar artificiosamente, na pendência de processo civil ou administrativo, o estado de lugar, de coisa ou de pessoa, com o fim de induzir a erro o juiz ou o perito. Pena: detenção de 3 meses a 2 anos e multa. Parágrafo único: se a inovação se destina a produzir efeito em processo penal, ainda que não iniciado, as penas aplicam-se em dobro.',
      'Art. 357 (exploração de prestígio): solicitar ou receber dinheiro ou qualquer outra utilidade, a pretexto de influir em juiz, jurado, órgão do Ministério Público, funcionário de justiça, perito, tradutor, intérprete ou testemunha. Pena: reclusão de 1 a 5 anos e multa. Parágrafo único: as penas aumentam-se de um terço, se o agente alega ou insinua que o dinheiro ou utilidade também se destina a qualquer das pessoas referidas. Art. 359 (desobediência a decisão judicial sobre perda ou suspensão de direito): exercer função, atividade, direito, autoridade ou múnus, de que foi suspenso ou privado por decisão judicial. Pena: detenção de 3 meses a 2 anos, ou multa.',
      AVISO],
      'Falso testemunho (342): quem MENTE em processo. Corrupção ativa de testemunha (343): quem PAGA para ela mentir. Retratação antes da sentença no processo em que ocorreu o ilícito torna o fato não punível (342, § 2º).'),
    step('Exemplo prático', [
      'Caso 1 — a testemunha afirma em audiência ter visto o réu na cena, sabendo que não viu: falso testemunho (art. 342).',
      'Caso 2 — a testemunha, antes da sentença, volta e declara a verdade: o fato deixa de ser punível (art. 342, § 2º).',
      'Caso 3 — o réu oferece dinheiro à testemunha para mentir: corrupção ativa de testemunha (art. 343).',
      'Caso 4 — o credor toma à força o bem do devedor para pagar dívida: exercício arbitrário das próprias razões (art. 345), mais a pena da violência.',
      'Caso 5 — alguém muda a cena de um acidente para enganar o perito civil: fraude processual (art. 347); se for para processo penal, as penas dobram.'],
      'Pergunta-teste: "quem mentiu em processo?" 342. "Quem pagou para mentir?" 343. "Quem ameaçou quem atua no processo?" 344.'),
    step('Resumo essencial', ['Penas dos arts. 342 a 347, 357 e 359.'], undefined, { caption: 'Crimes contra a administração da Justiça', head: ['Art.', 'Crime', 'Pena'], rows: [
      ['342', 'Falso testemunho ou falsa perícia', 'Reclusão 2–4 anos e multa'],
      ['343', 'Corrupção ativa de testemunha ou perito', 'Reclusão 3–4 anos e multa'],
      ['344', 'Coação no curso do processo', 'Reclusão 1–4 anos e multa, além da violência'],
      ['345', 'Exercício arbitrário das próprias razões', 'Detenção 15 dias–1 mês, ou multa, além da violência'],
      ['346', 'Subtração ou dano de coisa própria em poder de terceiro', 'Detenção 6 meses–2 anos e multa'],
      ['347', 'Fraude processual', 'Detenção 3 meses–2 anos e multa'],
      ['357', 'Exploração de prestígio', 'Reclusão 1–5 anos e multa'],
      ['359', 'Desobediência a decisão judicial sobre perda ou suspensão de direito', 'Detenção 3 meses–2 anos, ou multa']] }),
    step('O que memorizar', [
      '• 342: 2 a 4 anos e multa; retratação antes da sentença exclui a punibilidade.',
      '• 343: 3 a 4 anos e multa. 344: 1 a 4 anos e multa, mais a violência.',
      '• 345: sem violência, só se procede mediante queixa.',
      '• 347: processo civil ou administrativo; no penal, as penas em dobro.',
      '• 357: reclusão de 1 a 5; aumento de um terço. 359: detenção de 3 meses a 2 anos, ou multa.'] ),
  ],
}
const p7 = mk('p342', 'dpenal-5')
export const P342_QUESTIONS: Question[] = [
  p7(1, 'Nos termos do art. 342, § 2º, do Código Penal, o fato de falso testemunho deixa de ser punível se', ['antes da sentença no processo em que ocorreu o ilícito, o agente se retrata ou declara a verdade.', 'Art. 342, § 2º.'], [['o agente se retrata após o trânsito em julgado.', 'o momento é antes da sentença.'], ['o agente se retrata em qualquer momento, mesmo após a sentença.', 'após a sentença a retratação não exclui a punibilidade.'], ['a testemunha é parente da parte.', 'o parentesco não exclui a punibilidade.'], ['não há prejuízo à parte.', 'o crime é formal, e o prejuízo não é exigido.']], 'Médio'),
  p7(2, 'A pena de reclusão do art. 343 (corrupção ativa de testemunha ou perito) é de', ['três a quatro anos e multa.', 'Art. 343.'], [['dois a quatro anos e multa.', 'é a pena do falso testemunho.'], ['um a quatro anos e multa.', 'é a pena da coação no curso do processo.'], ['dois a doze anos e multa.', 'é a pena da corrupção ativa do art. 333.'], ['um a cinco anos e multa.', 'é a pena da exploração de prestígio.']], 'Difícil'),
  p7(3, 'No exercício arbitrário das próprias razões (art. 345), se não há emprego de violência,', ['somente se procede mediante queixa.', 'Art. 345, parágrafo único.'], [['a ação é pública incondicionada.', 'sem violência, a ação é de iniciativa privada.'], ['o fato é atípico.', 'o fato é típico, mas só se procede mediante queixa.'], ['a pena é dobrada.', 'a pena não é dobrada.'], ['somente se procede mediante requisição do Ministro da Justiça.', 'não é o caso.']], 'Médio'),
  p7(4, 'Inovar artificiosamente, na pendência de processo civil, o estado de lugar, de coisa ou de pessoa, para induzir a erro o juiz ou o perito é', ['fraude processual (art. 347); se a inovação visa produzir efeito em processo penal, ainda que não iniciado, as penas são aplicadas em dobro.', 'Art. 347 e parágrafo único.'], [['falso testemunho (art. 342).', 'este é praticado por testemunha, perito etc. por afirmação falsa.'], ['coação no curso do processo (art. 344).', 'a coação exige violência ou grave ameaça.'], ['denunciação caluniosa (art. 339).', 'esta exige imputação a inocente.'], ['exploração de prestígio (art. 357).', 'esta exige solicitar ou receber vantagem a pretexto de influir em pessoas da Justiça.']], 'Médio'),
  p7(5, 'Solicitar ou receber dinheiro, a pretexto de influir em juiz, jurado, órgão do Ministério Público, perito ou testemunha, configura', ['exploração de prestígio (art. 357), com pena de reclusão de um a cinco anos e multa, aumentada de um terço se o agente alega que o valor também se destina a essas pessoas.', 'Art. 357 e parágrafo único.'], [['tráfico de influência (art. 332), com aumento da metade.', 'o art. 332 trata de influência em funcionário público; o art. 357 trata de pessoas da Justiça.'], ['corrupção ativa de testemunha (art. 343).', 'esta consiste em oferecer ou prometer vantagem à testemunha ou perito.'], ['advocacia administrativa (art. 321).', 'esta é praticada pelo funcionário.'], ['desobediência (art. 330).', 'não há descumprimento de ordem legal.']], 'Difícil'),
]
const c7 = mkC('p342', 'dpenal-5', 'dp-342')
export const P342_CARDS: Flashcard[] = [
  c7(1, 'Quem pode praticar o falso testemunho (art. 342)?', 'Testemunha, perito, contador, tradutor ou intérprete, em processo judicial ou administrativo, inquérito policial ou juízo arbitral. Reclusão de 2 a 4 anos e multa.'),
  c7(2, 'Quando o falso testemunho deixa de ser punível?', 'Se, antes da sentença no processo em que ocorreu o ilícito, o agente se retrata ou declara a verdade (art. 342, § 2º).'),
  c7(3, 'Falso testemunho x corrupção ativa de testemunha?', '342: o depoente mente. 343: quem dá, oferece ou promete vantagem para ele mentir (3 a 4 anos e multa).'),
  c7(4, 'Qual a pena da coação no curso do processo?', 'Reclusão de 1 a 4 anos e multa, além da pena correspondente à violência.'),
  c7(5, 'Como funciona a fraude processual (art. 347)?', 'Inovar artificiosamente o estado de lugar, coisa ou pessoa para enganar juiz ou perito. Detenção de 3 meses a 2 anos e multa; em dobro se para processo penal.'),
  c7(6, 'Qual a diferença entre os arts. 357 e 332?', '357 (exploração de prestígio): pretexto de influir em pessoas da Justiça (reclusão 1–5, aumento de 1/3). 332 (tráfico de influência): pretexto de influir em funcionário público (reclusão 2–5, aumento da metade).'),
]

export const DPENAL_LESSONS = [FALS_LESSON, P313_LESSON, P319_LESSON, P328_LESSON, P336_LESSON, P342_LESSON]
export const DPENAL_QUESTIONS = spread([...FALS_QUESTIONS, ...P313_QUESTIONS, ...P319_QUESTIONS, ...P328_QUESTIONS, ...P336_QUESTIONS, ...P342_QUESTIONS], 3)
export const DPENAL_CARDS = [...FALS_CARDS, ...P313_CARDS, ...P319_CARDS, ...P328_CARDS, ...P336_CARDS, ...P342_CARDS]
