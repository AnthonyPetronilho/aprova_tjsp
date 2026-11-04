import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Língua Portuguesa (Anexo VIII), parte 2: interpretação e estudo do léxico (pt-1 a pt-8).
// Todos os textos de exemplo são originais, escritos para este app; não são trechos de provas nem de obras.

// ───────── pt-1
export const INTER_LESSON: Lesson = {
  id: 'pt-interpretacao', topicId: 'pt-1', title: 'Compreensão e interpretação de textos', questionIds: ['inter-1', 'inter-2', 'inter-3', 'inter-4', 'inter-5'],
  steps: [
    step('Entenda', ['Interpretar é entender o que o texto diz (e como diz). Comece pelo TEMA (assunto geral) e pela IDEIA CENTRAL (o que o autor afirma sobre o tema). O restante do texto são ideias secundárias: exemplos, dados, explicações.',
      'Textos VERBAIS usam palavras; NÃO VERBAIS usam imagens, cores, símbolos, gráficos; e os MISTOS (charges, tirinhas, placas, cartazes) combinam os dois: o sentido nasce da relação entre texto e imagem. Textos LITERÁRIOS trabalham a linguagem com função estética (conotação, figuras, ritmo); os NÃO LITERÁRIOS (notícia, ofício, artigo, manual) têm função informativa, argumentativa ou instrucional e linguagem mais direta.',
      'Método para a prova: (1) leia o comando da questão ("segundo o texto", "é possível inferir", "NÃO", "EXCETO"); (2) leia o texto procurando a ideia central; (3) volte ao trecho que sustenta cada alternativa; (4) elimine as que acrescentam informação, generalizam demais ("sempre", "nunca", "todos") ou invertem o sentido.'],
      'A resposta certa está APOIADA no texto. Se você precisa de um conhecimento de fora para justificar a alternativa, desconfie.'),
    step('Exemplo prático', ['Texto: "A Vara de Família passou a atender por hora marcada. Antes, as pessoas formavam fila desde a madrugada e muitas iam embora sem atendimento. Agora a espera é menor, mas servidores alertam que parte do público, sem acesso à internet, ainda tem dificuldade para marcar o horário."',
      'Tema: atendimento no fórum. Ideia central: o agendamento reduziu a espera, mas ainda deixa de fora quem não tem internet.',
      'Alternativa tentadora e errada: "o agendamento acabou com os problemas de atendimento". Ela generaliza (o texto fala em dificuldade remanescente).',
      'Texto misto: em uma charge, um cidadão olha um relógio que marca 17h05 diante de um guichê com a placa "Atendimento: 8h às 17h". O relógio e a placa, juntos, produzem o sentido: ele chegou depois do encerramento.'],
      'Em textos mistos, pergunte: o que a imagem acrescenta ao que está escrito? Muitas vezes, o humor ou a crítica está nessa soma.'),
    step('Resumo essencial', ['Tipos de texto e como lê-los.'], undefined, { caption: 'Textos', head: ['Tipo', 'Característica', 'O que observar'], rows: [
      ['Verbal', 'Só palavras', 'Ideia central, argumentos, conectivos'],
      ['Não verbal', 'Imagem, gráfico, símbolo', 'Elementos visuais e legenda'],
      ['Misto (charge, tirinha, placa)', 'Palavra + imagem', 'Relação entre os dois códigos'],
      ['Literário', 'Linguagem conotativa, função estética', 'Figuras de linguagem, tom'],
      ['Não literário', 'Linguagem direta, informativa/argumentativa', 'Tese, dados, finalidade']] }),
    step('O que memorizar', ['• Tema ≠ ideia central: tema é o assunto; ideia central é o que se diz sobre ele.',
      '• Cuidado com "sempre", "nunca", "todos", "apenas": costumam tornar a alternativa errada.',
      '• Leia o comando: "segundo o texto" (literal), "infere-se" (conclusão), "NÃO" (a falsa).',
      '• Em texto misto, o sentido vem da soma de imagem e palavra.',
      '• Literário: conotação e função estética; não literário: informação clara.'] ),
  ],
}
const iq = mkQ('inter', 'pt-1')
const TXT_VARA = 'Texto: "A Vara de Família passou a atender por hora marcada. Antes, as pessoas formavam fila desde a madrugada e muitas iam embora sem atendimento. Agora a espera é menor, mas servidores alertam que parte do público, sem acesso à internet, ainda tem dificuldade para marcar o horário."'
export const INTER_QUESTIONS: Question[] = [
  iq(1, TXT_VARA + ' A ideia central do texto é que', [
    o('A', 'o atendimento por hora marcada eliminou todos os problemas do fórum.', 'Errada: generaliza; o texto aponta uma dificuldade que continua.'),
    o('B', 'os servidores são contrários ao atendimento por hora marcada.', 'Errada: eles apenas alertam para uma dificuldade, sem se opor ao sistema.'),
    o('C', 'o agendamento reduziu a espera, mas ainda é difícil para quem não tem internet.', 'Correta: resume o avanço e a limitação apontados no texto.'),
    o('D', 'as filas de madrugada continuam, apesar do agendamento.', 'Errada: o texto diz que a espera agora é menor.'),
    o('E', 'a internet é o principal problema do Judiciário.', 'Errada: extrapola o texto, que trata de um caso específico.')], 'C', 'Médio'),
  iq(2, TXT_VARA + ' Segundo o texto, antes do atendimento por hora marcada, muitas pessoas', [
    o('A', 'conseguiam marcar horário pela internet.', 'Errada: o agendamento é a novidade, e não a situação anterior.'),
    o('B', 'iam embora sem ser atendidas.', 'Correta: informação literal do segundo período.'),
    o('C', 'eram atendidas em poucos minutos.', 'Errada: o texto fala em fila desde a madrugada.'),
    o('D', 'preferiam o atendimento presencial.', 'Errada: o texto não registra preferência.'),
    o('E', 'desistiam de procurar a Vara de Família.', 'Errada: o texto diz que iam embora sem atendimento, não que desistiam do serviço.')], 'B', 'Fácil'),
  iq(3, TXT_VARA + ' Segundo o texto, a dificuldade que ainda persiste atinge', [
    o('A', 'todos os servidores da Vara.', 'Errada: a dificuldade é do público.'),
    o('B', 'quem prefere o atendimento presencial.', 'Errada: o texto não fala em preferência.'),
    o('C', 'apenas os moradores da madrugada.', 'Errada: informação inexistente.'),
    o('D', 'a parte do público sem acesso à internet.', 'Correta: é quem tem dificuldade para marcar o horário.'),
    o('E', 'os advogados, mas não a população em geral.', 'Errada: o texto fala em público, sem restringir a advogados.')], 'D', 'Fácil'),
  iq(4, 'Em uma charge, um cidadão está diante de um guichê com a placa "Atendimento: 8h às 17h" e olha para um relógio que marca 17h05, com expressão desanimada. O elemento não verbal (o relógio) contribui para o sentido ao indicar que o cidadão', [
    o('A', 'chegou cedo e aguarda a abertura.', 'Errada: o relógio marca 17h05, depois do horário final.'),
    o('B', 'chegou logo após o encerramento do atendimento.', 'Correta: a diferença de cinco minutos explica o desânimo.'),
    o('C', 'foi atendido rapidamente.', 'Errada: a expressão desanimada contraria essa leitura.'),
    o('D', 'desconhece o horário de funcionamento.', 'Errada: a placa mostra o horário; o que explica a cena é o horário do relógio.'),
    o('E', 'deseja reclamar da placa.', 'Errada: nada na cena indica reclamação sobre a placa.')], 'B', 'Médio'),
  iq(5, 'Entre as frases abaixo, a que apresenta linguagem predominantemente literária (conotativa) é', [
    o('A', 'O formulário deve ser preenchido em duas vias.', 'Errada: linguagem direta e instrucional.'),
    o('B', 'O balcão de atendimento fica no segundo andar.', 'Errada: informação objetiva.'),
    o('C', 'A fila era um rio parado que desaguava no balcão.', 'Correta: usa imagens figuradas (metáfora) com função estética.'),
    o('D', 'O processo foi arquivado.', 'Errada: informação objetiva e jurídica.'),
    o('E', 'O fórum funciona das 8h às 17h.', 'Errada: informação objetiva.')], 'C', 'Médio'),
]
const ic = mkC('inter', 'pt-1', 'pt-interpretacao')
export const INTER_CARDS: Flashcard[] = [
  ic(1, 'Diferença entre tema e ideia central?', 'Tema é o assunto; ideia central é o que o autor afirma sobre ele.'),
  ic(2, 'O que é um texto misto?', 'Combina palavras e imagens (charge, tirinha, placa); o sentido vem da relação entre os dois.'),
  ic(3, 'Texto literário x não literário?', 'Literário: função estética e conotação. Não literário: informativo, argumentativo ou instrucional, linguagem direta.'),
  ic(4, 'Que palavras costumam tornar uma alternativa errada?', 'Generalizações como "sempre", "nunca", "todos", "apenas".'),
  ic(5, 'O que fazer antes de ler o texto?', 'Ler o comando da questão ("segundo o texto", "infere-se", "NÃO").'),
  ic(6, 'Como confirmar uma alternativa?', 'Voltando ao trecho do texto que a sustenta.'),
]

// ───────── pt-2
export const INFER_LESSON: Lesson = {
  id: 'pt-inferencias', topicId: 'pt-2', title: 'Informações literais e inferências', questionIds: ['infer-1', 'infer-2', 'infer-3', 'infer-4', 'infer-5'],
  steps: [
    step('Entenda', ['INFORMAÇÃO LITERAL é a que está escrita, dita às claras. INFERÊNCIA é a conclusão que decorre do texto, mesmo sem estar escrita. A inferência correta é obrigatória ou muito provável a partir do que se leu; a EXTRAPOLAÇÃO vai além do texto e inventa informação.',
      'Duas fontes de inferência na língua: o PRESSUPOSTO (ideia que está embutida em certas palavras e é verdadeira para o autor) e o SUBENTENDIDO (sugestão que o leitor deduz pelo contexto, e que o autor pode negar). Palavras como "deixar de", "continuar", "voltar a", "ainda" carregam pressupostos: "Marta deixou de levar o caderno" pressupõe que antes ela levava.',
      'Quantificadores também geram inferência: "apenas dois de dez concluíram" permite concluir que oito não concluíram. Mas não permite concluir POR QUÊ.'],
      'Teste da inferência: se o texto fosse verdadeiro, a conclusão teria de ser verdadeira? Se sim, é inferência. Se "talvez", é extrapolação.'),
    step('Exemplo prático', ['Caso 1: "Depois do novo sistema, Marta deixou de levar o caderno ao trabalho." Inferência: antes, ela levava o caderno.',
      'Caso 2: "Só dois dos dez servidores concluíram o curso." Inferência: oito servidores não concluíram. Extrapolação: o curso era difícil ou ruim.',
      'Caso 3: "A biblioteca do fórum fechou para reforma na segunda-feira." Inferência: antes da reforma estava aberta. Extrapolação: a reforma vai durar um mês.',
      'Caso 4: "O réu não compareceu à audiência, embora tivesse sido intimado duas vezes." Literal: foi intimado duas vezes. Inferência: era esperado que comparecesse.'],
      'Atenção ao "embora": ele sinaliza que o fato seguinte contraria uma expectativa, e isso ajuda a inferir o que era esperado.'),
    step('Resumo essencial', ['Três categorias.'], undefined, { caption: 'Literal, inferência, extrapolação', head: ['Categoria', 'Como reconhecer', 'Exemplo'], rows: [
      ['Literal', 'Está escrito', '"Foi intimado duas vezes."'],
      ['Inferência', 'Decorre necessariamente do texto', '"Deixou de levar" → antes levava'],
      ['Extrapolação', 'Acrescenta o que o texto não diz', '"O curso era difícil"'],
      ['Pressuposto', 'Embutido em palavras como deixar de, voltar a', '"Voltou a estudar" → já estudou antes']] }),
    step('O que memorizar', ['• Inferência decorre do texto; extrapolação vai além.',
      '• Palavras de pressuposto: deixar de, parar de, continuar, voltar a, ainda, já.',
      '• Números e quantificadores permitem inferências matemáticas simples (10 − 2 = 8), mas não causas.',
      '• Em "não se sustenta no texto", procure a alternativa que acrescenta informação.'] ),
  ],
}
const inq = mkQ('infer', 'pt-2')
export const INFER_QUESTIONS: Question[] = [
  inq(1, 'Texto: "Depois da instalação do novo sistema, Marta deixou de levar o caderno de anotações ao trabalho." Do texto, infere-se que Marta', [
    o('A', 'perdeu o caderno de anotações.', 'Errada: o texto não fala em perda do caderno.'),
    o('B', 'foi demitida após a instalação do sistema.', 'Errada: ela continua indo ao trabalho; só deixou de levar o caderno.'),
    o('C', 'antes da instalação, costumava levar o caderno ao trabalho.', 'Correta: "deixar de" pressupõe que o hábito existia.'),
    o('D', 'não gosta do novo sistema.', 'Errada: extrapolação; o texto não registra opinião.'),
    o('E', 'nunca usou o caderno de anotações.', 'Errada: contraria o pressuposto de "deixou de levar".')], 'C', 'Fácil'),
  inq(2, 'Texto: "O réu não compareceu à audiência, embora tivesse sido intimado duas vezes." A informação que aparece literalmente no texto é que o réu', [
    o('A', 'foi intimado duas vezes.', 'Correta: está explícita no trecho "embora tivesse sido intimado duas vezes".'),
    o('B', 'se recusou a comparecer por medo.', 'Errada: o texto não informa o motivo.'),
    o('C', 'será preso por não comparecer.', 'Errada: extrapolação sobre consequência.'),
    o('D', 'perdeu o prazo de defesa.', 'Errada: o texto não trata de prazo de defesa.'),
    o('E', 'mudou de endereço.', 'Errada: informação inexistente.')], 'A', 'Fácil'),
  inq(3, 'Texto: "Só dois dos dez servidores da seção concluíram o curso." Do texto, é correto inferir que', [
    o('A', 'oito servidores da seção não concluíram o curso.', 'Correta: dez menos dois são oito.'),
    o('B', 'o curso era muito difícil.', 'Errada: o texto não informa a dificuldade do curso.'),
    o('C', 'os oito servidores foram reprovados.', 'Errada: não concluir não significa necessariamente ser reprovado.'),
    o('D', 'o curso foi cancelado.', 'Errada: houve conclusão por parte de dois servidores.'),
    o('E', 'a seção tem apenas dois servidores.', 'Errada: o texto diz que a seção tem dez.')], 'A', 'Médio'),
  inq(4, 'Texto: "Apenas metade dos documentos solicitados foi entregue até sexta-feira." Pode-se concluir, com base no texto, que', [
    o('A', 'nenhum documento foi entregue.', 'Errada: metade foi entregue.'),
    o('B', 'o responsável agiu de má-fé.', 'Errada: extrapolação; o texto não fala em intenção.'),
    o('C', 'a outra metade dos documentos ainda não havia sido entregue na sexta-feira.', 'Correta: se só metade foi entregue, a outra metade não foi.'),
    o('D', 'o prazo foi prorrogado.', 'Errada: o texto não fala em prorrogação.'),
    o('E', 'a entrega estava completa.', 'Errada: contraria o texto.')], 'C', 'Médio'),
  inq(5, 'Texto: "A biblioteca do fórum fechou para reforma na segunda-feira." A conclusão que NÃO se sustenta apenas com base no texto é', [
    o('A', 'A biblioteca estava aberta antes da reforma.', 'Sustenta-se: "fechou" pressupõe que estava aberta antes.'),
    o('B', 'A reforma começou na segunda-feira.', 'Sustenta-se: o fechamento ocorreu para reforma na segunda-feira.'),
    o('C', 'A biblioteca fica em um fórum.', 'Sustenta-se: está explícito.'),
    o('D', 'A reforma vai durar um mês.', 'Correta (a que não se sustenta): o texto nada informa sobre a duração.'),
    o('E', 'Houve uma reforma na biblioteca.', 'Sustenta-se: é a razão do fechamento.')], 'D', 'Difícil'),
]
const inc = mkC('infer', 'pt-2', 'pt-inferencias')
export const INFER_CARDS: Flashcard[] = [
  inc(1, 'O que é inferência?', 'Conclusão que decorre do texto, mesmo sem estar escrita.'),
  inc(2, 'O que é extrapolação?', 'Acrescentar ao texto informação que ele não traz.'),
  inc(3, 'O que é pressuposto?', 'Ideia embutida em palavras como "deixar de", "voltar a", "ainda".'),
  inc(4, 'O que "Marta deixou de levar o caderno" pressupõe?', 'Que antes ela levava o caderno.'),
  inc(5, 'Qual o teste da inferência?', 'Sendo o texto verdadeiro, a conclusão tem de ser verdadeira.'),
  inc(6, 'Números no texto permitem inferir causas?', 'Permitem inferir contas simples; não permitem inferir causas não ditas.'),
]

// ───────── pt-3
export const PV_LESSON: Lesson = {
  id: 'pt-ponto-de-vista', topicId: 'pt-3', title: 'Ponto de vista do autor', questionIds: ['pv-1', 'pv-2', 'pv-3', 'pv-4', 'pv-5'],
  steps: [
    step('Entenda', ['Ponto de vista é a posição do autor diante do assunto: a favor, contra, neutro, crítico, irônico. Ele aparece nas escolhas de linguagem, mesmo quando o autor não diz "eu acho".',
      'Pistas: (1) adjetivos e advérbios valorativos ("injusta", "lamentavelmente"); (2) verbos de opinião ("considero", "acredito", "parece"); (3) modalizadores ("infelizmente", "felizmente", "evidentemente"); (4) aspas irônicas; (5) comparações e metáforas ("a passos de tartaruga"); (6) conectivos de oposição, que mostram qual ideia o autor privilegia.',
      'FATO é o que pode ser verificado ("o prédio tem sete andares"); OPINIÃO é uma avaliação ("o prédio é feio"). Em textos jornalísticos, o autor pode apenas relatar as vozes de outras pessoas ("segundo o prefeito…") sem aderir a elas.'],
      'Pergunte: se eu retirar esta palavra, a frase muda de informação ou apenas de avaliação? Se muda apenas a avaliação, ali está o ponto de vista.'),
    step('Exemplo prático', ['Caso 1: "Infelizmente, a reforma, que já deveria ter terminado, avança a passos de tartaruga." Ponto de vista: crítico/insatisfeito ("infelizmente", "a passos de tartaruga").',
      'Caso 2: "O \'eficiente\' sistema ficou fora do ar por três dias." As aspas e o fato (três dias fora do ar) mostram ironia: o sistema não é eficiente.',
      'Caso 3: "Considero injusta a decisão." O verbo "considero" e o adjetivo "injusta" revelam opinião; "A decisão foi publicada" apenas informa.',
      'Caso 4: "O prefeito afirmou que as obras terminarão em março. Os moradores, no entanto, duvidam." O texto apresenta duas posições; "no entanto" marca contraste, mas o autor apenas relata.'],
      'Ironia: o sentido pretendido é o oposto do literal. As aspas e o contexto mostram que a palavra está sendo usada com ar de crítica.'),
    step('Resumo essencial', ['Marcas do ponto de vista.'], undefined, { caption: 'Pistas', head: ['Pista', 'Exemplo', 'O que revela'], rows: [
      ['Modalizador', 'Infelizmente, felizmente', 'Avaliação do autor'],
      ['Adjetivo valorativo', 'Decisão injusta', 'Opinião'],
      ['Verbo de opinião', 'Considero, acredito', 'Posição explícita'],
      ['Aspas irônicas', '"eficiente" sistema', 'Ironia/crítica'],
      ['Metáfora/comparação', 'A passos de tartaruga', 'Avaliação (lentidão)']] }),
    step('O que memorizar', ['• Fato é verificável; opinião é avaliação.',
      '• Modalizadores (infelizmente, felizmente) revelam ponto de vista.',
      '• Aspas podem indicar ironia (sentido oposto).',
      '• O autor pode apenas relatar vozes alheias sem concordar com elas.',
      '• Atenção ao "segundo fulano": a opinião é de fulano, não do autor.'] ),
  ],
}
const pq = mkQ('pv', 'pt-3')
export const PV_QUESTIONS: Question[] = [
  pq(1, 'Texto: "Infelizmente, a reforma do prédio, que já deveria ter terminado, avança a passos de tartaruga." Pelas escolhas de linguagem, o autor demonstra', [
    o('A', 'satisfação com o andamento da obra.', 'Errada: "infelizmente" e "passos de tartaruga" indicam insatisfação.'),
    o('B', 'neutralidade absoluta.', 'Errada: há palavras e imagens valorativas.'),
    o('C', 'insatisfação com a lentidão da obra.', 'Correta: o modalizador e a metáfora marcam a crítica.'),
    o('D', 'indiferença quanto ao prazo.', 'Errada: o autor lembra que já deveria ter terminado.'),
    o('E', 'incerteza quanto à existência da obra.', 'Errada: a obra é afirmada.')], 'C', 'Fácil'),
  pq(2, 'Assinale a frase que expressa uma OPINIÃO, e não um fato.', [
    o('A', 'O prédio do fórum tem sete andares.', 'Errada: pode ser verificado; é fato.'),
    o('B', 'A sessão começou às 9h.', 'Errada: pode ser verificado; é fato.'),
    o('C', 'O atendimento é, sem dúvida, o pior da região.', 'Correta: "o pior" é avaliação subjetiva.'),
    o('D', 'O processo foi distribuído na terça-feira.', 'Errada: pode ser verificado; é fato.'),
    o('E', 'O formulário tem duas páginas.', 'Errada: pode ser verificado; é fato.')], 'C', 'Fácil'),
  pq(3, 'Texto: "O \'eficiente\' sistema ficou fora do ar por três dias." O uso das aspas em "eficiente" sugere', [
    o('A', 'citação literal de um documento.', 'Errada: não há indicação de citação.'),
    o('B', 'ironia, pois o fato contraria a ideia de eficiência.', 'Correta: o sistema ficou fora do ar, o que desmente "eficiente".'),
    o('C', 'elogio sincero ao sistema.', 'Errada: o contexto desmente o elogio.'),
    o('D', 'palavra estrangeira.', 'Errada: "eficiente" é palavra do português.'),
    o('E', 'mero destaque gráfico, sem efeito de sentido.', 'Errada: o contexto indica sentido irônico.')], 'B', 'Médio'),
  pq(4, 'Em "Considero injusta a decisão", o ponto de vista do autor é revelado principalmente por', [
    o('A', 'o verbo "considero" e o adjetivo "injusta".', 'Correta: ambos indicam avaliação pessoal.'),
    o('B', 'o artigo "a".', 'Errada: é um elemento neutro.'),
    o('C', 'o substantivo "decisão" apenas.', 'Errada: o substantivo, sozinho, não indica avaliação.'),
    o('D', 'a ausência de pontuação.', 'Errada: a pontuação não revela o ponto de vista aqui.'),
    o('E', 'a ordem das palavras, apenas.', 'Errada: a ordem não traz a avaliação.')], 'A', 'Médio'),
  pq(5, 'Texto: "O prefeito afirmou que as obras terminarão em março. Os moradores, no entanto, duvidam." Nesse trecho, o autor', [
    o('A', 'concorda com o prefeito.', 'Errada: não há marca de adesão ao prefeito.'),
    o('B', 'concorda com os moradores.', 'Errada: relata a dúvida deles, sem aderir explicitamente.'),
    o('C', 'apresenta duas posições opostas, sem manifestar adesão explícita a nenhuma.', 'Correta: "no entanto" marca o contraste entre as vozes relatadas.'),
    o('D', 'ironiza o prefeito.', 'Errada: não há ironia marcada.'),
    o('E', 'nega que haja obras.', 'Errada: o texto fala em obras que terminarão em março.')], 'C', 'Médio'),
]
const pvc = mkC('pv', 'pt-3', 'pt-ponto-de-vista')
export const PV_CARDS: Flashcard[] = [
  pvc(1, 'O que é ponto de vista do autor?', 'A posição do autor diante do assunto, revelada pelas escolhas de linguagem.'),
  pvc(2, 'Diferença entre fato e opinião?', 'Fato pode ser verificado; opinião é avaliação.'),
  pvc(3, 'Para que servem os modalizadores?', 'Para expressar avaliação do autor (infelizmente, felizmente, evidentemente).'),
  pvc(4, 'O que podem indicar aspas em uma palavra?', 'Citação, destaque ou ironia (sentido oposto ao literal).'),
  pvc(5, '"Segundo o prefeito, ..." é opinião de quem?', 'Do prefeito; o autor apenas relata.'),
  pvc(6, 'Que pistas revelam o ponto de vista?', 'Adjetivos valorativos, advérbios, verbos de opinião, modalizadores, metáforas e ironia.'),
]

// ───────── pt-4
export const COES_LESSON: Lesson = {
  id: 'pt-coesao', topicId: 'pt-4', title: 'Estruturação do texto: relações entre ideias e coesão', questionIds: ['coes-1', 'coes-2', 'coes-3', 'coes-4', 'coes-5'],
  steps: [
    step('Entenda', ['COESÃO é a ligação entre palavras, frases e parágrafos por meio de elementos gramaticais. COERÊNCIA é a lógica de sentido do texto. Neste tópico, o foco é identificar a RELAÇÃO que cada conectivo estabelece entre as ideias.',
      'Relações e conectivos: ADIÇÃO (e, além disso); OPOSIÇÃO (mas, porém, contudo, todavia, no entanto, entretanto); CONCESSÃO (embora, ainda que, apesar de, mesmo que: admite um fato contrário, mas não impede o outro); CAUSA (porque, já que, visto que, pois); CONSEQUÊNCIA (de modo que, tanto que, de forma que); CONCLUSÃO (portanto, logo, assim); CONDIÇÃO (se, caso, desde que); FINALIDADE (para que, a fim de que); CONFORMIDADE (conforme, segundo); TEMPO (quando, enquanto, assim que).',
      'Coesão REFERENCIAL: retoma-se um termo por pronomes (ele, o, lhe, isso), sinônimos ("o juiz" → "o magistrado"), hiperônimos e elipse. Coesão SEQUENCIAL: conectivos e advérbios ligam as partes do texto.'],
      'Atenção: concessão não é oposição simples. Em "Embora estivesse cansado, terminou o relatório", o cansaço seria um obstáculo, mas não impediu a ação.'),
    step('Exemplo prático', ['Caso 1 — oposição: "Estudou muito, contudo não foi aprovado."',
      'Caso 2 — concessão: "Embora estivesse cansado, concluiu o relatório."',
      'Caso 3 — consequência: "O sistema caiu, de modo que o atendimento foi suspenso."',
      'Caso 4 — causa: "O processo atrasou porque faltaram funcionários."',
      'Caso 5 — referência: "Maria entregou o relatório ao diretor. Ele o leu na mesma tarde." → "Ele" retoma "o diretor"; "o" retoma "o relatório".',
      'Caso 6 — substituição lexical: trocar "o juiz" por "o magistrado" evita repetição e mantém a retomada do mesmo referente.'],
      'Teste: troque o conectivo pelo que você acha que expressa a relação. Se o sentido mudar, a relação era outra.'),
    step('Resumo essencial', ['Conectivos por relação.'], undefined, { caption: 'Relações entre ideias', head: ['Relação', 'Conectivos', 'Exemplo'], rows: [
      ['Adição', 'e, além disso', 'Chegou e assinou.'],
      ['Oposição', 'mas, porém, contudo, todavia, no entanto', 'Estudou, mas não passou.'],
      ['Concessão', 'embora, ainda que, apesar de', 'Embora cansado, terminou.'],
      ['Causa', 'porque, já que, visto que', 'Atrasou porque faltou gente.'],
      ['Consequência', 'de modo que, tanto que', 'Caiu, de modo que parou.'],
      ['Conclusão', 'portanto, logo, assim', 'Pagou; logo, está quite.'],
      ['Condição', 'se, caso, desde que', 'Se pagar, quita.'],
      ['Finalidade', 'para que, a fim de que', 'Veio para que fosse ouvido.']] }),
    step('O que memorizar', ['• Mas/porém/contudo/todavia/no entanto: oposição.',
      '• Embora/ainda que/apesar de: concessão.',
      '• Porque/já que/visto que: causa. De modo que/tanto que: consequência.',
      '• Portanto/logo: conclusão.',
      '• Pronomes e sinônimos retomam termos (coesão referencial).'] ),
  ],
}
const cq = mkQ('coes', 'pt-4')
export const COES_QUESTIONS: Question[] = [
  cq(1, 'Na frase "Estudou muito, ____ não foi aprovado", a lacuna é adequadamente preenchida por', [
    o('A', 'porque', 'Errada: expressa causa; aqui há contraste entre esforço e resultado.'),
    o('B', 'portanto', 'Errada: expressa conclusão.'),
    o('C', 'contudo', 'Correta: conectivo de oposição.'),
    o('D', 'caso', 'Errada: expressa condição.'),
    o('E', 'conforme', 'Errada: expressa conformidade.')], 'C', 'Fácil'),
  cq(2, 'Na frase "____ estivesse cansado, concluiu o relatório", a lacuna deve ser preenchida por', [
    o('A', 'Porque', 'Errada: expressa causa, o que inverteria a lógica.'),
    o('B', 'Embora', 'Correta: concessão; o cansaço não impediu a conclusão.'),
    o('C', 'Portanto', 'Errada: expressa conclusão.'),
    o('D', 'Se', 'Errada: expressa condição e exigiria outra construção.'),
    o('E', 'Assim que', 'Errada: expressa tempo.')], 'B', 'Médio'),
  cq(3, 'Em "O sistema caiu, de modo que o atendimento foi suspenso", a expressão "de modo que" introduz uma ideia de', [
    o('A', 'causa.', 'Errada: a causa é a queda do sistema, expressa na primeira oração.'),
    o('B', 'oposição.', 'Errada: não há contraste.'),
    o('C', 'concessão.', 'Errada: não há obstáculo que fosse superado.'),
    o('D', 'condição.', 'Errada: não há hipótese.'),
    o('E', 'consequência.', 'Correta: a suspensão do atendimento é o resultado da queda.')], 'E', 'Médio'),
  cq(4, 'Em "Maria entregou o relatório ao diretor. Ele o leu na mesma tarde", o pronome "o" retoma', [
    o('A', 'Maria.', 'Errada: Maria é retomada, se for o caso, por "ela".'),
    o('B', 'o diretor.', 'Errada: o diretor é retomado por "Ele".'),
    o('C', 'a tarde.', 'Errada: "tarde" não é retomada por pronome.'),
    o('D', 'o relatório.', 'Correta: o pronome "o" é o objeto direto de "leu".'),
    o('E', 'a entrega.', 'Errada: o objeto lido é o relatório.')], 'D', 'Médio'),
  cq(5, 'Em um texto, a troca de "o juiz" por "o magistrado" na segunda menção é um recurso de coesão por', [
    o('A', 'oposição.', 'Errada: não há contraste.'),
    o('B', 'substituição por sinônimo (coesão referencial).', 'Correta: retoma o mesmo referente com outra expressão.'),
    o('C', 'conclusão.', 'Errada: não há ideia de conclusão.'),
    o('D', 'concessão.', 'Errada: não há obstáculo superado.'),
    o('E', 'repetição obrigatória do termo.', 'Errada: a troca evita justamente a repetição.')], 'B', 'Fácil'),
]
const cc = mkC('coes', 'pt-4', 'pt-coesao')
export const COES_CARDS: Flashcard[] = [
  cc(1, 'Conectivos de oposição?', 'Mas, porém, contudo, todavia, no entanto, entretanto.'),
  cc(2, 'Conectivos de concessão?', 'Embora, ainda que, apesar de, mesmo que.'),
  cc(3, 'Conectivos de causa e de consequência?', 'Causa: porque, já que, visto que. Consequência: de modo que, tanto que.'),
  cc(4, 'Conectivos de conclusão?', 'Portanto, logo, assim.'),
  cc(5, 'O que é coesão referencial?', 'Retomada de termos por pronomes, sinônimos ou elipse.'),
  cc(6, 'Qual a diferença entre coesão e coerência?', 'Coesão é a ligação gramatical entre as partes; coerência é a lógica de sentido do texto.'),
]

// ───────── pt-5
export const SIGN_LESSON: Lesson = {
  id: 'pt-significacao', topicId: 'pt-5', title: 'Significação contextual de palavras e expressões', questionIds: ['sign-1', 'sign-2', 'sign-3', 'sign-4', 'sign-5'],
  steps: [
    step('Entenda', ['Uma mesma palavra pode ter vários sentidos (POLISSEMIA). Quem define o sentido é o CONTEXTO: as palavras vizinhas, o assunto, a situação. Por isso, a pergunta "o que significa X no texto?" não se responde com o dicionário isolado, e sim com a leitura da frase.',
      'Estratégia: (1) leia a frase inteira; (2) substitua a palavra pelas alternativas e veja qual mantém o sentido; (3) desconfie do sentido mais comum quando ele não combina com o contexto; (4) lembre que expressões fixas ("pôr em xeque", "dar de ombros") têm sentido próprio e não podem ser lidas palavra por palavra.',
      'No vocabulário jurídico e administrativo, muitas palavras têm sentido técnico: "correr" (um processo corre = tramita), "acolher" (um pedido = aceitá-lo, deferir), "honrar" (um compromisso = cumprir), "firme" (testemunho firme = seguro, convicto).'],
      'Substituição é a melhor ferramenta: troque a palavra por cada alternativa e leia a frase em voz baixa.'),
    step('Exemplo prático', ['Caso 1: "O processo corre em segredo de justiça." → "corre" = tramita (e não "se desloca rápido").',
      'Caso 2: "Ele honrou o compromisso assumido." → "honrou" = cumpriu.',
      'Caso 3: "A testemunha foi firme em seu depoimento." → "firme" = segura, convicta.',
      'Caso 4: "Ela ocupa uma cadeira no conselho." → "cadeira" = lugar de membro, assento no conselho.',
      'Caso 5: "O clima da audiência estava pesado." → "pesado" = tenso.'],
      'Se uma alternativa parecer "boa demais", teste a substituição. Muitas armadilhas usam o sentido mais comum da palavra.'),
    step('Resumo essencial', ['Palavras em contexto.'], undefined, { caption: 'Sentidos', head: ['Frase', 'Palavra', 'Sentido no contexto'], rows: [
      ['O processo corre em segredo de justiça.', 'corre', 'tramita'],
      ['Honrou o compromisso.', 'honrou', 'cumpriu'],
      ['A testemunha foi firme.', 'firme', 'segura, convicta'],
      ['Ocupa uma cadeira no conselho.', 'cadeira', 'lugar de membro'],
      ['O clima estava pesado.', 'pesado', 'tenso']] }),
    step('O que memorizar', ['• Contexto define o sentido (polissemia).',
      '• Teste por substituição.',
      '• Expressões fixas não se leem palavra por palavra.',
      '• No jurídico: processo corre = tramita; acolher = aceitar/deferir; honrar = cumprir.'] ),
  ],
}
const sgq = mkQ('sign', 'pt-5')
export const SIGN_QUESTIONS: Question[] = [
  sgq(1, 'Em "O processo corre em segredo de justiça", o verbo "corre" tem o sentido de', [
    o('A', 'move-se rapidamente.', 'Errada: é o sentido físico, que não combina com "processo".'),
    o('B', 'foge.', 'Errada: não combina com o contexto.'),
    o('C', 'tramita.', 'Correta: sentido técnico, de seguir seu andamento.'),
    o('D', 'escorre.', 'Errada: sentido físico, que não combina com "processo".'),
    o('E', 'passa (o tempo).', 'Errada: não é o sentido da frase.')], 'C', 'Fácil'),
  sgq(2, 'Em "Ele honrou o compromisso assumido", o verbo "honrou" significa', [
    o('A', 'elogiou.', 'Errada: não é o sentido de "honrar um compromisso".'),
    o('B', 'ignorou.', 'Errada: é o oposto.'),
    o('C', 'cancelou.', 'Errada: é o oposto.'),
    o('D', 'cumpriu.', 'Correta: honrar um compromisso é cumpri-lo.'),
    o('E', 'adiou.', 'Errada: honrar não significa adiar.')], 'D', 'Fácil'),
  sgq(3, 'Em "A testemunha foi firme em seu depoimento", o adjetivo "firme" indica que a testemunha foi', [
    o('A', 'rígida fisicamente.', 'Errada: sentido físico, que não combina com "depoimento".'),
    o('B', 'segura e convicta.', 'Correta: o depoimento manteve-se coerente e seguro.'),
    o('C', 'agressiva.', 'Errada: firmeza não é agressividade.'),
    o('D', 'hesitante.', 'Errada: é o oposto.'),
    o('E', 'distraída.', 'Errada: não há relação.')], 'B', 'Fácil'),
  sgq(4, 'Em "Ela ocupa uma cadeira no conselho", a palavra "cadeira" refere-se a', [
    o('A', 'um móvel do conselho.', 'Errada: é o sentido literal, que não combina com "ocupa uma cadeira no conselho".'),
    o('B', 'um prêmio recebido.', 'Errada: não há essa ideia.'),
    o('C', 'uma pessoa que visita o conselho.', 'Errada: a frase fala de quem faz parte do conselho.'),
    o('D', 'um cargo temporário de limpeza.', 'Errada: informação inexistente.'),
    o('E', 'um lugar de membro do conselho.', 'Correta: sentido figurado de assento/vaga de membro.')], 'E', 'Médio'),
  sgq(5, 'Em "O clima da audiência estava pesado", o adjetivo "pesado" significa', [
    o('A', 'com muito peso físico.', 'Errada: sentido literal, que não combina com "clima".'),
    o('B', 'tenso.', 'Correta: sentido figurado de ambiente carregado.'),
    o('C', 'alegre.', 'Errada: é o oposto.'),
    o('D', 'silencioso.', 'Errada: a palavra não indica ausência de som.'),
    o('E', 'organizado.', 'Errada: não há relação.')], 'B', 'Fácil'),
]
const sgc = mkC('sign', 'pt-5', 'pt-significacao')
export const SIGN_CARDS: Flashcard[] = [
  sgc(1, 'O que é polissemia?', 'Quando uma palavra tem vários sentidos; o contexto define qual vale.'),
  sgc(2, 'Qual a melhor técnica para achar o sentido no contexto?', 'Substituir a palavra por cada alternativa e testar a frase.'),
  sgc(3, '"O processo corre": qual o sentido de "corre"?', 'Tramita.'),
  sgc(4, '"Honrar um compromisso" significa?', 'Cumpri-lo.'),
  sgc(5, '"Testemunha firme" é?', 'Testemunha segura, convicta.'),
  sgc(6, 'Pode-se ler expressões fixas palavra por palavra?', 'Não: têm sentido próprio, como um todo.'),
]

// ───────── pt-6
export const SIN_LESSON: Lesson = {
  id: 'pt-sinonimos', topicId: 'pt-6', title: 'Sinônimos e antônimos', questionIds: ['sin-1', 'sin-2', 'sin-3', 'sin-4', 'sin-5'],
  steps: [
    step('Entenda', ['SINÔNIMOS são palavras de sentido igual ou muito próximo; ANTÔNIMOS têm sentidos opostos. A sinonímia raramente é perfeita: depende do contexto, do registro (formal ou comum) e da regência (dirimir uma dúvida, prescindir DE algo).',
      'Em provas de concurso, as palavras mais cobradas são as do vocabulário formal e jurídico. Vale conhecer pares frequentes e saber o antônimo mais comum.',
      'Não confunda com PARÔNIMOS (palavras parecidas na escrita, de sentidos diferentes: "emigrar/imigrar", "infringir/infligir") nem com HOMÔNIMOS (mesma pronúncia ou grafia, sentidos diferentes: "cessão/seção/sessão").'],
      'Na dúvida, monte uma frase com a palavra e depois troque pela alternativa. Se a frase continua fazendo sentido, é sinônimo naquele contexto.'),
    step('Exemplo prático', ['Mitigar → atenuar, abrandar. Ex.: "mitigar os efeitos do atraso".',
      'Dirimir → resolver, solucionar. Ex.: "dirimir uma dúvida".',
      'Coibir → reprimir, impedir. Ex.: "coibir abusos".',
      'Prescindir → dispensar, abrir mão. Ex.: "prescindir de testemunhas".',
      'Profícuo → proveitoso, útil. Inócuo → inofensivo, sem efeito. Profuso → abundante.',
      'Antônimos: efêmero × duradouro; veemente × brando; lícito × ilícito; parcimônia × desperdício.'],
      'Veja o par de ideias, não só a palavra: "efêmero" é o que dura pouco; o antônimo é o que dura muito.'),
    step('Resumo essencial', ['Pares para memorizar.'], undefined, { caption: 'Sinônimos e antônimos', head: ['Palavra', 'Sinônimo', 'Antônimo'], rows: [
      ['Mitigar', 'Atenuar, abrandar', 'Agravar'],
      ['Dirimir', 'Resolver, solucionar', 'Complicar'],
      ['Coibir', 'Reprimir, impedir', 'Permitir, estimular'],
      ['Prescindir', 'Dispensar', 'Necessitar'],
      ['Profícuo', 'Proveitoso, útil', 'Inútil'],
      ['Efêmero', 'Passageiro', 'Duradouro, perene'],
      ['Veemente', 'Enérgico, intenso', 'Brando, ameno'],
      ['Parcimônia', 'Moderação, economia', 'Desperdício']] }),
    step('O que memorizar', ['• Sinônimo depende do contexto.',
      '• Mitigar = atenuar; dirimir = resolver; coibir = reprimir; prescindir = dispensar.',
      '• Efêmero ≠ duradouro; veemente ≠ brando.',
      '• Não confundir sinônimos com parônimos ou homônimos.'] ),
  ],
}
const snq = mkQ('sin', 'pt-6')
export const SIN_QUESTIONS: Question[] = [
  snq(1, 'O sinônimo de "mitigar", em "mitigar os efeitos do atraso", é', [
    o('A', 'agravar.', 'Errada: é o oposto.'),
    o('B', 'ignorar.', 'Errada: mitigar é agir sobre o problema, e não ignorá-lo.'),
    o('C', 'atenuar.', 'Correta: mitigar é abrandar, reduzir a intensidade.'),
    o('D', 'multiplicar.', 'Errada: é o oposto.'),
    o('E', 'ampliar.', 'Errada: é o oposto.')], 'C', 'Fácil'),
  snq(2, 'Em "O juiz dirimiu a dúvida das partes", o verbo "dirimir" pode ser substituído, sem alteração de sentido, por', [
    o('A', 'ampliou.', 'Errada: dirimir não é ampliar.'),
    o('B', 'ocultou.', 'Errada: dirimir não é ocultar.'),
    o('C', 'resolveu.', 'Correta: dirimir uma dúvida é solucioná-la.'),
    o('D', 'criou.', 'Errada: dirimir não é criar.'),
    o('E', 'adiou.', 'Errada: dirimir não é adiar.')], 'C', 'Médio'),
  snq(3, 'O antônimo de "efêmero" é', [
    o('A', 'passageiro.', 'Errada: é sinônimo de efêmero.'),
    o('B', 'breve.', 'Errada: é sinônimo de efêmero.'),
    o('C', 'fugaz.', 'Errada: é sinônimo de efêmero.'),
    o('D', 'duradouro.', 'Correta: efêmero dura pouco; duradouro dura muito.'),
    o('E', 'momentâneo.', 'Errada: é sinônimo de efêmero.')], 'D', 'Fácil'),
  snq(4, 'Em "Algumas diligências podem prescindir de autorização prévia", o verbo "prescindir" tem o sentido de', [
    o('A', 'depender.', 'Errada: é o oposto.'),
    o('B', 'exigir.', 'Errada: é o oposto.'),
    o('C', 'requerer.', 'Errada: é o oposto.'),
    o('D', 'dispensar.', 'Correta: prescindir de é dispensar, abrir mão de.'),
    o('E', 'suspeitar.', 'Errada: não há relação.')], 'D', 'Médio'),
  snq(5, 'O antônimo de "veemente", em "um discurso veemente", é', [
    o('A', 'enérgico.', 'Errada: é sinônimo de veemente.'),
    o('B', 'ardente.', 'Errada: é sinônimo próximo de veemente.'),
    o('C', 'brando.', 'Correta: veemente é intenso; brando é suave, sem intensidade.'),
    o('D', 'intenso.', 'Errada: é sinônimo de veemente.'),
    o('E', 'apaixonado.', 'Errada: é sinônimo próximo de veemente.')], 'C', 'Médio'),
]
const snc = mkC('sin', 'pt-6', 'pt-sinonimos')
export const SIN_CARDS: Flashcard[] = [
  snc(1, 'Sinônimo de mitigar?', 'Atenuar, abrandar.'),
  snc(2, 'Sinônimo de dirimir (uma dúvida)?', 'Resolver, solucionar.'),
  snc(3, 'Sinônimo de coibir?', 'Reprimir, impedir.'),
  snc(4, 'Prescindir significa?', 'Dispensar, abrir mão (prescindir DE algo).'),
  snc(5, 'Antônimo de efêmero?', 'Duradouro, perene.'),
  snc(6, 'Antônimo de veemente?', 'Brando.'),
]

// ───────── pt-7
export const FIG_LESSON: Lesson = {
  id: 'pt-sentido-figurado', topicId: 'pt-7', title: 'Sentido próprio e figurado', questionIds: ['fig-1', 'fig-2', 'fig-3', 'fig-4', 'fig-5'],
  steps: [
    step('Entenda', ['Sentido PRÓPRIO (denotação) é o sentido literal, de dicionário. Sentido FIGURADO (conotação) é o sentido ampliado ou transferido, criado pelo contexto. "Queimou a mão no fogão" é próprio; "queimou a largada" é figurado.',
      'Figuras de linguagem mais cobradas: METÁFORA (comparação implícita: "Aquele juiz é uma rocha"); COMPARAÇÃO (com "como", "tal qual"); METONÍMIA (troca por relação de proximidade: "Li Machado de Assis" = a obra do autor); PERSONIFICAÇÃO/PROSOPOPEIA (ação humana a algo inanimado: "A sala dormia em silêncio"); HIPÉRBOLE (exagero: "Esperei uma eternidade"); EUFEMISMO (suavização: "ele nos deixou" = morreu); ANTÍTESE (oposição de ideias: "amor e ódio"); IRONIA (dizer o oposto do que se pensa).',
      'Não confunda metáfora e comparação: a comparação traz o conectivo ("é como uma rocha"); a metáfora identifica direto ("é uma rocha").'],
      'Pergunta-chave: dá para entender literalmente? Se não, é figurado. Depois descubra que figura é.'),
    step('Exemplo prático', ['Caso 1: "Aquele juiz é uma rocha." → metáfora (firmeza).',
      'Caso 2: "A sala dormia em silêncio." → personificação.',
      'Caso 3: "Li Machado de Assis nas férias." → metonímia (autor pela obra).',
      'Caso 4: "Esperei uma eternidade na fila." → hipérbole.',
      'Caso 5: "Queimou o dedo no fogão" (próprio) × "Queimou a largada" × "Queimou etapas" × "Queimou o filme" (figurados).',
      'Caso 6: "Ele nos deixou ontem" (eufemismo para "morreu").'],
      'Dica de prova: leia a frase sem a figura. Se ficar um absurdo literal, a figura estava ali para produzir um efeito.'),
    step('Resumo essencial', ['Figuras de linguagem.'], undefined, { caption: 'Figuras', head: ['Figura', 'O que faz', 'Exemplo'], rows: [
      ['Metáfora', 'Identifica duas coisas sem conectivo', 'O juiz é uma rocha.'],
      ['Comparação', 'Compara com conectivo', 'Firme como uma rocha.'],
      ['Metonímia', 'Troca por proximidade (autor/obra, parte/todo)', 'Li Machado de Assis.'],
      ['Personificação', 'Humaniza o inanimado', 'A sala dormia.'],
      ['Hipérbole', 'Exagera', 'Esperei uma eternidade.'],
      ['Eufemismo', 'Suaviza', 'Ele nos deixou.'],
      ['Ironia', 'Diz o contrário do que pensa', '"Que ótimo" dito diante de um problema.']] }),
    step('O que memorizar', ['• Próprio = literal; figurado = transferido.',
      '• Metáfora sem conectivo; comparação com conectivo.',
      '• Metonímia: autor pela obra, parte pelo todo, continente pelo conteúdo.',
      '• Personificação: ação humana em coisa.',
      '• Hipérbole exagera; eufemismo suaviza.'] ),
  ],
}
const fq = mkQ('fig', 'pt-7')
export const FIG_QUESTIONS: Question[] = [
  fq(1, 'Na frase "Aquele juiz é uma rocha", a figura de linguagem empregada é', [
    o('A', 'comparação.', 'Errada: não há conectivo comparativo.'),
    o('B', 'metáfora.', 'Correta: identifica o juiz com uma rocha, sem conectivo.'),
    o('C', 'hipérbole.', 'Errada: não se trata de exagero de quantidade ou intensidade.'),
    o('D', 'eufemismo.', 'Errada: não suaviza expressão.'),
    o('E', 'ironia.', 'Errada: o sentido não é o oposto do que se diz.')], 'B', 'Fácil'),
  fq(2, 'Em "A sala dormia em silêncio", há', [
    o('A', 'antítese.', 'Errada: não há ideias opostas.'),
    o('B', 'metonímia.', 'Errada: não há troca por proximidade.'),
    o('C', 'eufemismo.', 'Errada: não há suavização de ideia desagradável.'),
    o('D', 'comparação.', 'Errada: não há conectivo comparativo.'),
    o('E', 'personificação.', 'Correta: atribui ação humana (dormir) a algo inanimado (a sala).')], 'E', 'Fácil'),
  fq(3, 'Na frase "Li Machado de Assis durante as férias", ocorre metonímia porque', [
    o('A', 'o nome do autor substitui a obra.', 'Correta: troca por relação de proximidade (autor pela obra).'),
    o('B', 'há exagero na quantidade lida.', 'Errada: isso seria hipérbole.'),
    o('C', 'há comparação entre o autor e as obras.', 'Errada: não há comparação.'),
    o('D', 'o autor é humanizado.', 'Errada: isso seria personificação.'),
    o('E', 'há ideia oposta à literal.', 'Errada: isso seria ironia.')], 'A', 'Médio'),
  fq(4, 'A frase "Esperei uma eternidade na fila" apresenta', [
    o('A', 'hipérbole.', 'Correta: exagero para enfatizar a longa espera.'),
    o('B', 'eufemismo.', 'Errada: não há suavização.'),
    o('C', 'metonímia.', 'Errada: não há troca por proximidade.'),
    o('D', 'antítese.', 'Errada: não há oposição de ideias.'),
    o('E', 'personificação.', 'Errada: não há humanização de algo inanimado.')], 'A', 'Fácil'),
  fq(5, 'Em qual das frases a palavra "queimar" é empregada em seu sentido PRÓPRIO?', [
    o('A', 'Ele queimou o dedo no fogão.', 'Correta: sentido literal de ferir com calor.'),
    o('B', 'O atleta queimou a largada.', 'Errada: sentido figurado (partiu antes do sinal).'),
    o('C', 'Ela queimou etapas na carreira.', 'Errada: sentido figurado (avançou rápido).'),
    o('D', 'O candidato queimou o filme.', 'Errada: sentido figurado (prejudicou a imagem).'),
    o('E', 'Ele queimou as pestanas nos estudos.', 'Errada: sentido figurado (estudou muito).')], 'A', 'Médio'),
]
const fc = mkC('fig', 'pt-7', 'pt-sentido-figurado')
export const FIG_CARDS: Flashcard[] = [
  fc(1, 'Diferença entre sentido próprio e figurado?', 'Próprio é o literal; figurado é o transferido, criado pelo contexto.'),
  fc(2, 'Metáfora x comparação?', 'Comparação traz conectivo (como); metáfora identifica direto.'),
  fc(3, 'O que é metonímia?', 'Troca de termo por relação de proximidade (autor pela obra, parte pelo todo).'),
  fc(4, 'O que é personificação?', 'Atribuir ação ou sentimento humano a algo inanimado.'),
  fc(5, 'Hipérbole x eufemismo?', 'Hipérbole exagera; eufemismo suaviza.'),
  fc(6, 'O que é ironia?', 'Dizer o contrário do que se pensa, com intenção crítica ou humorística.'),
]

// ───────── pt-8
export const CLAS_LESSON: Lesson = {
  id: 'pt-classes', topicId: 'pt-8', title: 'Classes de palavras: emprego e sentido', questionIds: ['clas-1', 'clas-2', 'clas-3', 'clas-4', 'clas-5'],
  steps: [
    step('Entenda', ['A gramática tradicional reconhece dez classes de palavras. VARIÁVEIS: substantivo, adjetivo, artigo, numeral, pronome e verbo. INVARIÁVEIS: advérbio, preposição, conjunção e interjeição.',
      'A classe de uma palavra depende da FUNÇÃO que ela exerce na frase, e não da palavra isolada. A mesma forma pode pertencer a classes diferentes: "cedo" (advérbio) em "Ela chegou cedo"; "só" é advérbio (= somente) em "Só estudei hoje" e adjetivo (= sozinho, varia) em "Elas ficaram sós".',
      'O "QUE" é o campeão de pegadinhas: PRONOME RELATIVO quando retoma um termo anterior e pode ser trocado por "o qual" ("O parecer que li é longo" → "o qual li"); CONJUNÇÃO INTEGRANTE quando introduz uma oração que completa o verbo e pode ser trocado por "isso" ("Espero que o prazo seja prorrogado" → "Espero isso").',
      'Contrações: "ao" = a (preposição) + o (artigo); "do" = de + o; "no" = em + o; "pela" = por + a.'],
      'Pergunta de ouro: o que a palavra FAZ aqui? Modifica um verbo (advérbio)? Liga orações (conjunção)? Retoma um substantivo (pronome relativo)?'),
    step('Exemplo prático', ['Caso 1: "Ela chegou cedo." → "cedo" = advérbio de tempo (modifica o verbo "chegou").',
      'Caso 2: "O parecer que li é longo." → "que" = pronome relativo (retoma "parecer"; equivale a "o qual").',
      'Caso 3: "Espero que o prazo seja prorrogado." → "que" = conjunção integrante (introduz o complemento de "espero").',
      'Caso 4: "Elas ficaram sós em casa." → "sós" = adjetivo (concorda com "elas").',
      'Caso 5: "O servidor entregou o ofício ao diretor." → "ao" = preposição "a" + artigo "o".'],
      'Quando duas classes parecem possíveis, aplique o teste da troca: por "o qual" (relativo), por "isso" (integrante), por "somente" (advérbio só), por "sozinho" (adjetivo só).'),
    step('Resumo essencial', ['As dez classes.'], undefined, { caption: 'Classes de palavras', head: ['Classe', 'Função', 'Exemplo'], rows: [
      ['Substantivo', 'Nomeia seres e coisas', 'processo, justiça'],
      ['Adjetivo', 'Caracteriza o substantivo', 'parecer longo'],
      ['Artigo', 'Define/indefine o substantivo', 'o, a, um'],
      ['Numeral', 'Indica quantidade ou ordem', 'dois, segundo'],
      ['Pronome', 'Substitui/acompanha substantivo', 'ele, que, meu'],
      ['Verbo', 'Ação, estado, fenômeno', 'entregar, ser, chover'],
      ['Advérbio', 'Modifica verbo, adjetivo ou advérbio', 'cedo, muito'],
      ['Preposição', 'Liga termos', 'de, para, com'],
      ['Conjunção', 'Liga orações ou termos', 'e, mas, que'],
      ['Interjeição', 'Expressa emoção', 'Ai! Puxa!']] }),
    step('O que memorizar', ['• Variáveis: substantivo, adjetivo, artigo, numeral, pronome, verbo.',
      '• Invariáveis: advérbio, preposição, conjunção, interjeição.',
      '• A classe depende da função na frase.',
      '• Que relativo = "o qual"; que integrante = "isso".',
      '• Só: advérbio (somente) ou adjetivo (sozinho).'] ),
  ],
}
const clq = mkQ('clas', 'pt-8')
export const CLAS_QUESTIONS: Question[] = [
  clq(1, 'Na frase "Ela chegou cedo", a palavra "cedo" é', [
    o('A', 'adjetivo.', 'Errada: não caracteriza um substantivo.'),
    o('B', 'advérbio de tempo.', 'Correta: modifica o verbo "chegou", indicando tempo.'),
    o('C', 'substantivo.', 'Errada: não nomeia ser ou coisa.'),
    o('D', 'preposição.', 'Errada: não liga termos.'),
    o('E', 'conjunção.', 'Errada: não liga orações.')], 'B', 'Fácil'),
  clq(2, 'Em "O parecer que li é longo", o vocábulo "que" é', [
    o('A', 'conjunção integrante.', 'Errada: não introduz oração que completa o verbo "li"; retoma "parecer".'),
    o('B', 'advérbio de intensidade.', 'Errada: não intensifica adjetivo ou verbo.'),
    o('C', 'pronome relativo.', 'Correta: retoma "parecer" e equivale a "o qual".'),
    o('D', 'preposição.', 'Errada: não liga termos com sentido de relação.'),
    o('E', 'interjeição.', 'Errada: não expressa emoção.')], 'C', 'Médio'),
  clq(3, 'Em "Espero que o prazo seja prorrogado", o vocábulo "que" é', [
    o('A', 'pronome relativo.', 'Errada: não retoma nenhum termo anterior.'),
    o('B', 'pronome interrogativo.', 'Errada: não há pergunta.'),
    o('C', 'advérbio.', 'Errada: não modifica verbo ou adjetivo.'),
    o('D', 'conjunção integrante.', 'Correta: introduz a oração que completa o verbo "espero" (= espero isso).'),
    o('E', 'artigo.', 'Errada: não acompanha substantivo para defini-lo.')], 'D', 'Médio'),
  clq(4, 'Em "Elas ficaram sós em casa", a palavra "sós" é', [
    o('A', 'advérbio, pois significa "somente".', 'Errada: com esse sentido, o advérbio "só" não varia; aqui há concordância com "elas".'),
    o('B', 'adjetivo, pois concorda com "elas" e significa "sozinhas".', 'Correta: o plural revela que é adjetivo.'),
    o('C', 'substantivo.', 'Errada: não nomeia um ser ou uma coisa.'),
    o('D', 'preposição.', 'Errada: não liga termos.'),
    o('E', 'conjunção.', 'Errada: não liga orações.')], 'B', 'Médio'),
  clq(5, 'Em "O servidor entregou o ofício ao diretor", a palavra "ao" resulta da combinação de', [
    o('A', 'preposição "a" + artigo "o".', 'Correta: contração da preposição "a" com o artigo definido "o".'),
    o('B', 'conjunção "a" + pronome "o".', 'Errada: "a" não é conjunção aqui.'),
    o('C', 'preposição "em" + artigo "o".', 'Errada: essa contração é "no".'),
    o('D', 'preposição "de" + artigo "o".', 'Errada: essa contração é "do".'),
    o('E', 'advérbio "a" + artigo "o".', 'Errada: "a" não é advérbio aqui.')], 'A', 'Fácil'),
]
const clc = mkC('clas', 'pt-8', 'pt-classes')
export const CLAS_CARDS: Flashcard[] = [
  clc(1, 'Quais são as classes variáveis e as invariáveis?', 'Variáveis: substantivo, adjetivo, artigo, numeral, pronome, verbo. Invariáveis: advérbio, preposição, conjunção, interjeição.'),
  clc(2, 'Como distinguir "que" relativo de "que" integrante?', 'Relativo retoma um termo e equivale a "o qual"; integrante introduz oração que completa o verbo e equivale a "isso".'),
  clc(3, 'Em que casos "só" é advérbio e em quais é adjetivo?', 'Advérbio = somente (invariável); adjetivo = sozinho (varia: sós).'),
  clc(4, 'A classe de uma palavra depende de quê?', 'Da função que ela exerce na frase.'),
  clc(5, '"Ao", "do", "no", "pela" são o quê?', 'Contrações de preposição + artigo (a+o, de+o, em+o, por+a).'),
  clc(6, 'O que faz um advérbio?', 'Modifica verbo, adjetivo ou outro advérbio.'),
]
export const PORT2_LESSONS = [INTER_LESSON, INFER_LESSON, PV_LESSON, COES_LESSON, SIGN_LESSON, SIN_LESSON, FIG_LESSON, CLAS_LESSON]
export const PORT2_QUESTIONS = spread([...INTER_QUESTIONS, ...INFER_QUESTIONS, ...PV_QUESTIONS, ...COES_QUESTIONS, ...SIGN_QUESTIONS, ...SIN_QUESTIONS, ...FIG_QUESTIONS, ...CLAS_QUESTIONS], 0)
export const PORT2_CARDS = [...INTER_CARDS, ...INFER_CARDS, ...PV_CARDS, ...COES_CARDS, ...SIGN_CARDS, ...SIN_CARDS, ...FIG_CARDS, ...CLAS_CARDS]
