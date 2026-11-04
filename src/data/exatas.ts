import type { Flashcard, Lesson, Question } from '../types'
// Aulas inéditas de Matemática (Anexo VIII: "MMC e MDC", "Porcentagem") e Raciocínio Lógico ("Estruturas lógicas",
// "Diagramas lógicos"). Conteúdo conceitual (sem legislação). Todas as contas das questões foram conferidas por cálculo.
import { o, mkQ, mkC, place } from './helpers'
// ───────────── MMC e MDC
export const MMC_LESSON: Lesson = {
  id: 'mat-mmc-mdc', topicId: 'mat-2', title: 'MMC e MDC', questionIds: ['mmc-1', 'mmc-2', 'mmc-3', 'mmc-4', 'mmc-5'],
  steps: [
    { title: 'Entenda',
      body: ['MMC (mínimo múltiplo comum) e MDC (máximo divisor comum) respondem a dois tipos de pergunta bem diferentes. O MMC trata de "quando as coisas se encontram de novo" (coisas que se repetem em ciclos). O MDC trata de "como dividir tudo em partes iguais, o maior possível" (sem sobra).',
        'Múltiplos de um número são os resultados da sua tabuada (de 4: 4, 8, 12, 16…). Divisores são os números que dividem exatamente (de 12: 1, 2, 3, 4, 6, 12). MMC = o menor múltiplo que dois números têm em comum. MDC = o maior divisor que dois números têm em comum.',
        'Como calcular: decomponha em fatores primos. MMC: multiplique TODOS os fatores, pegando os de MAIOR expoente. MDC: multiplique apenas os fatores COMUNS, pegando os de MENOR expoente. Exemplo com 12 = 2² × 3 e 18 = 2 × 3²: MMC = 2² × 3² = 36; MDC = 2 × 3 = 6.'],
      alt: 'Pense em dois semáforos que ficam verdes juntos agora. Um repete o ciclo a cada 12 segundos, o outro a cada 18. Quando eles ficam verdes juntos de novo? Quando o tempo for múltiplo dos dois: 36 segundos. Isso é o MMC. Agora pense em cortar duas fitas, de 12 cm e 18 cm, em pedaços iguais sem sobrar nada, o maior possível: cada pedaço terá 6 cm. Isso é o MDC.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — encontro (MMC): duas viaturas fazem revisão a cada 10 e a cada 15 dias e hoje foram revisadas juntas. Voltam a coincidir em MMC(10, 15) = 30 dias.',
        'Caso 2 — divisão sem sobra (MDC): há 30 pastas azuis e 45 pastas verdes. Quer-se montar o maior número de conjuntos iguais, sem sobrar pasta. O número de conjuntos é MDC(30, 45) = 15; cada conjunto leva 2 azuis e 3 verdes.',
        'Caso 3 — maior tamanho possível (MDC): cortar uma corda de 40 m e outra de 60 m em pedaços do mesmo tamanho, o maior possível. O tamanho é MDC(40, 60) = 20 m; saem 2 + 3 = 5 pedaços.',
        'Como saber qual usar? Se o enunciado fala em "de novo", "ao mesmo tempo", "daqui a quanto tempo", "menor prazo" → MMC. Se fala em "maior possível", "partes iguais", "sem sobrar", "dividir em grupos" → MDC.'],
      alt: 'Truque de leitura: palavras de repetição no tempo apontam para MMC. Palavras de repartir igualmente apontam para MDC.' },
    { title: 'Resumo essencial',
      body: ['A relação mais útil de lembrar: para dois números, MMC × MDC = produto dos números. Se você sabe três dessas quatro informações, descobre a quarta.'],
      table: { caption: 'MMC × MDC', head: ['', 'MMC', 'MDC'], rows: [
        ['Pergunta típica', 'Quando se encontram de novo?', 'Qual o maior tamanho/grupo igual?'],
        ['Fatores primos', 'Todos, com o maior expoente', 'Só os comuns, com o menor expoente'],
        ['Resultado em relação aos números', 'Maior ou igual a eles', 'Menor ou igual a eles'],
        ['Exemplo (12 e 18)', '36', '6']] } },
    { title: 'O que memorizar',
      body: ['• MMC = menor número que é múltiplo dos dois (ciclos, encontros). MDC = maior número que divide os dois (partes iguais, sem sobra).',
        '• Fatores primos: MMC pega todos (maior expoente); MDC pega só os comuns (menor expoente).',
        '• Para dois números a e b: MMC(a, b) × MDC(a, b) = a × b.',
        '• Se um número é múltiplo do outro, o MMC é o maior deles e o MDC é o menor (MMC de 6 e 12 = 12; MDC = 6).',
        '• Com três números, calcule o MMC (ou MDC) de todos juntos, na decomposição simultânea.',
        '• Sempre confira o que a pergunta pede: o valor do MDC, o número de grupos ou o número total de pedaços podem ser coisas diferentes.'] },
  ],
}
const mq = mkQ('mmc', 'mat-2')
export const MMC_QUESTIONS: Question[] = [
  mq(1, 'O máximo divisor comum (MDC) de 48 e 72 é', [
    o('A', '6', 'Errada: 6 divide os dois, mas não é o maior divisor comum.'),
    o('B', '12', 'Errada: 12 divide 48 e 72, mas existe divisor comum maior (24).'),
    o('C', '18', 'Errada: 18 não divide 48.'),
    o('D', '24', 'Correta: 48 = 2⁴ × 3 e 72 = 2³ × 3²; fatores comuns com menor expoente: 2³ × 3 = 24.'),
    o('E', '144', 'Errada: 144 é o MMC de 48 e 72, não o MDC.')], 'D', 'Fácil'),
  mq(2, 'O mínimo múltiplo comum (MMC) de 12 e 18 é', [
    o('A', '6', 'Errada: 6 é o MDC de 12 e 18.'),
    o('B', '24', 'Errada: 24 é múltiplo de 12, mas não de 18.'),
    o('C', '36', 'Correta: 12 = 2² × 3 e 18 = 2 × 3²; todos os fatores com maior expoente: 2² × 3² = 36.'),
    o('D', '72', 'Errada: 72 é múltiplo comum, mas não o menor (36 é menor).'),
    o('E', '216', 'Errada: é o produto 12 × 18, que só coincide com o MMC quando os números não têm fator comum.')], 'C', 'Fácil'),
  mq(3, 'Duas fitas, uma com 120 cm e outra com 180 cm, serão cortadas em pedaços de mesmo comprimento, o maior possível, sem sobras. O número total de pedaços obtidos será', [
    o('A', '3', 'Errada: 3 é o número de pedaços da fita de 180 cm; falta somar os da outra.'),
    o('B', '5', 'Correta: MDC(120, 180) = 60 cm; saem 120 ÷ 60 = 2 e 180 ÷ 60 = 3 pedaços, total 5.'),
    o('C', '6', 'Errada: não resulta de 120 ÷ 60 + 180 ÷ 60.'),
    o('D', '60', 'Errada: 60 é o comprimento de cada pedaço, não a quantidade.'),
    o('E', '360', 'Errada: 360 é o MMC de 120 e 180; o problema pede o MDC e depois a contagem.')], 'B', 'Médio'),
  mq(4, 'O MDC de dois números é 6 e o MMC deles é 72. Se um dos números é 18, o outro é', [
    o('A', '12', 'Errada: MDC(12, 18) = 6, mas MMC(12, 18) = 36, não 72.'),
    o('B', '24', 'Correta: MMC × MDC = produto; 72 × 6 = 432 = 18 × x, logo x = 24 (e MDC(18, 24) = 6; MMC = 72).'),
    o('C', '36', 'Errada: MDC(18, 36) = 18, não 6.'),
    o('D', '54', 'Errada: MDC(18, 54) = 18, não 6.'),
    o('E', '72', 'Errada: MDC(18, 72) = 18, não 6.')], 'B', 'Difícil'),
  mq(5, 'Três linhas de ônibus partem do mesmo terminal às 8 h, juntas. A primeira sai a cada 10 minutos, a segunda a cada 12 e a terceira a cada 15. Elas voltarão a partir juntas pela primeira vez às', [
    o('A', '8 h 30 min', 'Errada: 30 min é múltiplo de 10 e 15, mas não de 12.'),
    o('B', '8 h 45 min', 'Errada: 45 não é múltiplo de 10 nem de 12.'),
    o('C', '9 h', 'Correta: MMC(10, 12, 15) = 60 minutos, ou seja, 9 h.'),
    o('D', '9 h 30 min', 'Errada: 90 não é múltiplo de 12; o primeiro reencontro é em 60 min.'),
    o('E', '10 h', 'Errada: 120 min é múltiplo comum, mas não o primeiro.')], 'C', 'Médio'),
]
const mc = mkC('mmc', 'mat-2', 'mat-mmc-mdc')
export const MMC_CARDS: Flashcard[] = [
  mc(1, 'Que tipo de pergunta se resolve com MMC?', 'Quando eventos que se repetem em ciclos voltam a coincidir ("daqui a quanto tempo", "ao mesmo tempo", "menor prazo").'),
  mc(2, 'Que tipo de pergunta se resolve com MDC?', 'Dividir em partes/grupos iguais, o maior possível, sem sobra ("maior tamanho", "sem sobrar", "partes iguais").'),
  mc(3, 'Como calcular MMC e MDC por fatores primos?', 'MMC: todos os fatores, com o maior expoente. MDC: só os fatores comuns, com o menor expoente.'),
  mc(4, 'Qual a relação entre MMC, MDC e o produto de dois números?', 'MMC × MDC = a × b (vale para dois números).'),
  mc(5, 'Quanto valem o MMC e o MDC de 12 e 18?', 'MMC = 36 e MDC = 6.'),
  mc(6, 'Se um número é múltiplo do outro, quais são o MMC e o MDC?', 'O MMC é o maior deles e o MDC é o menor. Ex.: 6 e 12 → MMC 12, MDC 6.'),
]

// ───────────── Porcentagem
export const PORC_LESSON: Lesson = {
  id: 'mat-porcentagem', topicId: 'mat-4', title: 'Porcentagem', questionIds: ['porc-1', 'porc-2', 'porc-3', 'porc-4', 'porc-5'],
  steps: [
    { title: 'Entenda',
      body: ['Porcentagem é uma fração de denominador 100. "15%" significa "15 em cada 100", ou 15/100, ou 0,15. Calcular "15% de 240" é multiplicar: 0,15 × 240 = 36.',
        'A forma mais segura de resolver é trabalhar com o FATOR MULTIPLICADOR. Aumento de 8% → multiplica por 1,08. Desconto de 20% → multiplica por 0,80 (100% − 20% = 80%). Assim, aumento e desconto viram uma simples multiplicação.',
        'Para descobrir quantos por cento uma parte é do todo: divida a parte pelo todo e multiplique por 100. Exemplo: 45 de 180 é 45 ÷ 180 = 0,25 = 25%.'],
      alt: 'Pense em 100 como uma barra de chocolate cortada em 100 quadradinhos. 15% é pegar 15 quadradinhos. Se a barra tem 240 g no total, cada 1% pesa 2,4 g, e 15% pesam 15 × 2,4 = 36 g.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — parte de um valor: um servidor ganha R$ 2.500 e tem reajuste de 8%. Novo salário = 2.500 × 1,08 = R$ 2.700.',
        'Caso 2 — descobrir o valor original: um item custa R$ 160 após desconto de 20%. Como 160 corresponde a 80% do original, original = 160 ÷ 0,80 = R$ 200. (Erro comum: somar 20% a 160 e achar 192. Os 20% foram tirados do preço ORIGINAL, não do preço final.)',
        'Caso 3 — aumentos e descontos sucessivos NÃO se anulam: R$ 100 com aumento de 10% vira 110; um desconto de 10% sobre 110 dá 99. Os percentuais incidem sobre bases diferentes. Multiplique os fatores: 1,10 × 0,90 = 0,99.'],
      alt: 'Regra de ouro: toda vez que a base mudar, a porcentagem muda de valor. Um desconto sobre o preço final não "desfaz" um aumento anterior. Resolva sempre em etapas, multiplicando pelos fatores.' },
    { title: 'Resumo essencial',
      body: ['Guarde a tabela de fatores: ela resolve a maioria das questões em uma conta.'],
      table: { caption: 'Fator multiplicador', head: ['Situação', 'Fator', 'Exemplo'], rows: [
        ['Aumento de i%', '1 + i/100', '+25% → × 1,25'],
        ['Desconto de i%', '1 − i/100', '−20% → × 0,80'],
        ['Parte em porcentagem', 'parte ÷ todo', '45 de 180 → 0,25 = 25%'],
        ['Voltar ao valor original', 'dividir pelo fator', '160 ÷ 0,80 = 200']] } },
    { title: 'O que memorizar',
      body: ['• x% de N = (x ÷ 100) × N.',
        '• Aumento: multiplique por (1 + taxa). Desconto: multiplique por (1 − taxa).',
        '• Variações sucessivas: multiplique os fatores. Aumento de 25% seguido de desconto de 20% dá 1,25 × 0,80 = 1,00 (volta ao preço inicial neste caso; com 10% e 10% não volta).',
        '• Para achar o original, DIVIDA o valor final pelo fator (não aplique a taxa de volta sobre o valor final).',
        '• Percentual de uma parte: (parte ÷ todo) × 100.',
        '• Cuidado: "pontos percentuais" (diferença entre taxas) não é o mesmo que "variação percentual".'] },
  ],
}
const pq = mkQ('porc', 'mat-4')
export const PORC_QUESTIONS: Question[] = [
  pq(1, 'Em uma lista de 240 processos, 15% já foram julgados. O número de processos julgados é', [
    o('A', '24', 'Errada: 24 corresponde a 10% de 240.'),
    o('B', '30', 'Errada: 30 corresponde a 12,5% de 240.'),
    o('C', '36', 'Correta: 0,15 × 240 = 36.'),
    o('D', '40', 'Errada: 40 seria cerca de 16,7% de 240.'),
    o('E', '45', 'Errada: 45 seria 18,75% de 240.')], 'C', 'Fácil'),
  pq(2, 'Um produto custa R$ 80,00. Ele sofre um aumento de 25% e, em seguida, um desconto de 20% sobre o novo preço. O preço final é', [
    o('A', 'R$ 60,00', 'Errada: não resulta das contas 80 × 1,25 × 0,80.'),
    o('B', 'R$ 76,00', 'Errada: corresponderia a uma queda líquida de 5% (80 × 0,95), e não ao produto 1,25 × 0,80.'),
    o('C', 'R$ 80,00', 'Correta: 80 × 1,25 = 100; 100 × 0,80 = 80.'),
    o('D', 'R$ 84,00', 'Errada: é o resultado de somar +25% e −20% como se fossem +5% sobre 80; os percentuais incidem sobre bases diferentes.'),
    o('E', 'R$ 100,00', 'Errada: é o preço após o aumento, antes do desconto.')], 'C', 'Médio'),
  pq(3, 'Um servidor recebe R$ 2.500,00 de salário e terá reajuste de 8%. Após o reajuste, seu salário será de', [
    o('A', 'R$ 2.508,00', 'Errada: somou 8 reais em vez de 8% do salário.'),
    o('B', 'R$ 2.600,00', 'Errada: corresponde a um reajuste de 4%.'),
    o('C', 'R$ 2.650,00', 'Errada: corresponde a um reajuste de 6%.'),
    o('D', 'R$ 2.700,00', 'Correta: 2.500 × 1,08 = 2.700.'),
    o('E', 'R$ 2.800,00', 'Errada: corresponde a um reajuste de 12%.')], 'D', 'Fácil'),
  pq(4, 'Em uma vara, 45 dos 180 processos em andamento são de natureza criminal. Esse número representa, do total, a porcentagem de', [
    o('A', '20%', 'Errada: 20% de 180 seria 36.'),
    o('B', '22,5%', 'Errada: 22,5% de 180 seria 40,5.'),
    o('C', '25%', 'Correta: 45 ÷ 180 = 0,25 = 25%.'),
    o('D', '30%', 'Errada: 30% de 180 seria 54.'),
    o('E', '45%', 'Errada: 45 é o número de processos criminais, não a porcentagem.')], 'C', 'Fácil'),
  pq(5, 'Após um desconto de 20%, um equipamento passou a custar R$ 160,00. O preço original, antes do desconto, era de', [
    o('A', 'R$ 128,00', 'Errada: é 80% de 160, ou seja, aplicou o desconto de novo sobre o preço final.'),
    o('B', 'R$ 180,00', 'Errada: 20% de 180 é 36, e 180 − 36 = 144, não 160.'),
    o('C', 'R$ 192,00', 'Errada: somou 20% sobre o preço final; o desconto foi calculado sobre o preço original (192 × 0,80 = 153,60).'),
    o('D', 'R$ 200,00', 'Correta: 160 corresponde a 80% do original; 160 ÷ 0,80 = 200.'),
    o('E', 'R$ 320,00', 'Errada: dobrou o preço final, o que corresponderia a um desconto de 50%.')], 'D', 'Médio'),
]
const pc = mkC('porc', 'mat-4', 'mat-porcentagem')
export const PORC_CARDS: Flashcard[] = [
  pc(1, 'Como calcular x% de um valor N?', 'Multiplique N por x/100. Ex.: 15% de 240 = 0,15 × 240 = 36.'),
  pc(2, 'Qual é o fator multiplicador de um aumento de 8%? E de um desconto de 20%?', 'Aumento de 8%: × 1,08. Desconto de 20%: × 0,80.'),
  pc(3, 'Como descobrir o preço original sabendo o preço após um desconto?', 'Divida o preço final pelo fator do desconto. Ex.: 160 ÷ 0,80 = 200 (para desconto de 20%).'),
  pc(4, 'Um aumento de 10% seguido de um desconto de 10% volta ao valor inicial?', 'Não. 1,10 × 0,90 = 0,99: o resultado é 1% menor, porque as bases são diferentes.'),
  pc(5, 'Como saber quantos por cento uma parte é do todo?', '(parte ÷ todo) × 100. Ex.: 45 de 180 → 0,25 → 25%.'),
  pc(6, 'Qual a diferença entre "pontos percentuais" e "variação percentual"?', 'Pontos percentuais é a diferença simples entre duas taxas (de 10% para 12% = 2 pontos). A variação percentual compara os valores (de 10% para 12% é um aumento relativo de 20%).'),
]

// ───────────── Estruturas lógicas
export const ESTR_LESSON: Lesson = {
  id: 'rl-estruturas', topicId: 'rl-1', title: 'Estruturas lógicas: proposições, conectivos e negação', questionIds: ['estr-1', 'estr-2', 'estr-3', 'estr-4', 'estr-5'],
  steps: [
    { title: 'Entenda',
      body: ['Proposição é uma frase declarativa que pode ser julgada como verdadeira (V) ou falsa (F), e não as duas. "Brasília é a capital do Brasil" é uma proposição (V). "Que horas são?" e "Feche a porta" não são proposições, porque não se pode dizer que são verdadeiras ou falsas.',
        'Conectivos ligam proposições: "e" (conjunção), "ou" (disjunção), "se... então" (condicional) e "se e somente se" (bicondicional). O valor lógico da frase composta depende dos valores das partes.',
        'Regras que mais caem: (1) "p e q" só é verdadeira se AS DUAS forem verdadeiras. (2) "p ou q" só é falsa se AS DUAS forem falsas. (3) "se p então q" só é falsa quando p é verdadeira e q é falsa (a "promessa quebrada").'],
      alt: 'Imagine a promessa: "Se eu passar no concurso, então dou uma festa". Ela só foi quebrada se eu passei e não dei festa. Se não passei, a promessa não foi desrespeitada, aconteça a festa ou não. Por isso o condicional é falso em um único caso.' },
    { title: 'Exemplo prático',
      body: ['Negação de "e" e de "ou" (leis de De Morgan): para negar uma frase com "e", troque por "ou" e negue cada parte. "Ana é juíza e Paulo é advogado" → negação: "Ana não é juíza OU Paulo não é advogado". E vice-versa: a negação de "ou" vira "e" com as partes negadas.',
        'Negação do condicional: "se p então q" é negado por "p E não q". Exemplo: "Se o prazo venceu, então o recurso é intempestivo" → negação: "O prazo venceu e o recurso não é intempestivo".',
        'Equivalência do condicional (contrapositiva): "se p então q" equivale a "se não q então não p". "Se chove, a rua molha" equivale a "Se a rua não molha, então não chove". Atenção: NÃO equivale a "se q então p" (isso é a recíproca) nem a "se não p então não q" (isso é a inversa).'],
      alt: 'Truque para o condicional: mantenha a primeira, nega a segunda e troque o "se...então" por "e" para NEGAR. Para ACHAR O EQUIVALENTE, inverta a ordem e negue as duas partes.' },
    { title: 'Resumo essencial',
      body: ['Memorize os quatro "fatos" abaixo, pois resolvem a maior parte das questões de estruturas lógicas.'],
      table: { caption: 'Negações e equivalências', head: ['Frase', 'Negação', 'Equivalente'], rows: [
        ['p e q', 'não p ou não q', '—'],
        ['p ou q', 'não p e não q', '—'],
        ['se p então q', 'p e não q', 'se não q então não p'],
        ['não p', 'p', '—']] } },
    { title: 'O que memorizar',
      body: ['• Proposição: frase declarativa com valor V ou F. Pergunta, ordem e exclamação pura não são proposições.',
        '• "p e q": V só quando as duas são V. "p ou q": F só quando as duas são F.',
        '• "se p então q": F só quando p é V e q é F. Com p falso, o condicional é verdadeiro.',
        '• Negação de "e" → "ou" com partes negadas. Negação de "ou" → "e" com partes negadas.',
        '• Negação de "se p então q" → "p e não q".',
        '• Equivalente do condicional: contrapositiva (se não q então não p). Recíproca e inversa NÃO são equivalentes.'] },
  ],
}
const eq = mkQ('estr', 'rl-1')
const ESTR_RAW: Question[] = [
  eq(1, 'A negação da proposição "Marta é escrevente e Paulo é oficial de justiça" é', [
    o('A', 'Marta não é escrevente e Paulo não é oficial de justiça.', 'Errada: manteve o "e"; ao negar uma conjunção, o conectivo muda para "ou".'),
    o('B', 'Marta não é escrevente ou Paulo não é oficial de justiça.', 'Correta: pela lei de De Morgan, nega-se cada parte e troca-se "e" por "ou".'),
    o('C', 'Marta é escrevente ou Paulo é oficial de justiça.', 'Errada: trocou o conectivo, mas não negou as partes.'),
    o('D', 'Se Marta é escrevente, então Paulo não é oficial de justiça.', 'Errada: um condicional não é a negação de uma conjunção.'),
    o('E', 'Marta é escrevente e Paulo não é oficial de justiça.', 'Errada: negou só uma das partes e manteve o "e".')], 'B', 'Fácil'),
  eq(2, 'A proposição "Se chove, então a rua fica molhada" é logicamente equivalente a', [
    o('A', 'Se a rua fica molhada, então chove.', 'Errada: é a recíproca, que não é equivalente.'),
    o('B', 'Se não chove, então a rua não fica molhada.', 'Errada: é a inversa, que não é equivalente (a rua pode estar molhada por outro motivo).'),
    o('C', 'Se a rua não fica molhada, então não chove.', 'Correta: é a contrapositiva (inverte a ordem e nega as duas partes).'),
    o('D', 'Chove e a rua não fica molhada.', 'Errada: é a negação do condicional.'),
    o('E', 'Não chove ou a rua não fica molhada.', 'Errada: a forma equivalente por "ou" seria "não chove OU a rua fica molhada".')], 'C', 'Médio'),
  eq(3, 'A negação da proposição "Se o processo foi protocolado, então o prazo começou a correr" é', [
    o('A', 'Se o processo não foi protocolado, então o prazo não começou a correr.', 'Errada: é a inversa do condicional, que não é sua negação.'),
    o('B', 'Se o prazo não começou a correr, então o processo não foi protocolado.', 'Errada: é a contrapositiva, equivalente (e não oposta) à proposição original.'),
    o('C', 'O processo não foi protocolado e o prazo começou a correr.', 'Errada: a negação mantém a primeira parte e nega apenas a segunda.'),
    o('D', 'O processo foi protocolado e o prazo não começou a correr.', 'Correta: a negação de "se p então q" é "p e não q".'),
    o('E', 'O processo não foi protocolado ou o prazo não começou a correr.', 'Errada: nega as duas partes e usa "ou"; a negação do condicional é "p e não q".')], 'D', 'Médio'),
  eq(4, 'Considere a proposição "Se 5 é um número par, então 7 é um número primo". Sobre ela, é correto afirmar que é', [
    o('A', 'falsa, porque 5 não é par.', 'Errada: o fato de 5 não ser par torna o antecedente falso, e isso deixa o condicional verdadeiro.'),
    o('B', 'verdadeira, porque o antecedente é falso.', 'Correta: o antecedente (5 é par) é falso; um condicional com antecedente falso é verdadeiro (7 também é primo, o que reforça).'),
    o('C', 'falsa, porque 7 é primo.', 'Errada: o consequente verdadeiro nunca torna um condicional falso.'),
    o('D', 'uma frase que não é proposição.', 'Errada: tem valor lógico definido, portanto é proposição.'),
    o('E', 'verdadeira apenas se 5 for par.', 'Errada: o condicional não depende de 5 ser par para ser verdadeiro.')], 'B', 'Médio'),
  eq(5, 'A proposição "p ou q" é falsa quando', [
    o('A', 'p e q são verdadeiras.', 'Errada: com as duas verdadeiras, a disjunção é verdadeira.'),
    o('B', 'p é verdadeira e q é falsa.', 'Errada: basta uma parte verdadeira para a disjunção ser verdadeira.'),
    o('C', 'p é falsa e q é verdadeira.', 'Errada: basta uma parte verdadeira para a disjunção ser verdadeira.'),
    o('D', 'p e q são falsas.', 'Correta: a disjunção só é falsa quando as duas proposições são falsas.'),
    o('E', 'p e q têm valores lógicos diferentes.', 'Errada: valores diferentes significam que uma é verdadeira, e então a disjunção é verdadeira.')], 'D', 'Fácil'),
]
export const ESTR_QUESTIONS: Question[] = ESTR_RAW.map((q, i) => place(q, (['E', 'A', 'E', 'B', 'A'] as const)[i]))
const ec = mkC('estr', 'rl-1', 'rl-estruturas')
export const ESTR_CARDS: Flashcard[] = [
  ec(1, 'O que é uma proposição lógica?', 'Frase declarativa à qual se pode atribuir valor verdadeiro ou falso (e só um deles). Perguntas e ordens não são proposições.'),
  ec(2, 'Quando "p e q" é verdadeira? E "p ou q" é falsa?', '"p e q" é V só quando as duas são V. "p ou q" é F só quando as duas são F.'),
  ec(3, 'Quando "se p então q" é falso?', 'Somente quando p é verdadeiro e q é falso.'),
  ec(4, 'Como negar uma frase com "e" ou com "ou"?', 'Troque o conectivo ("e" ↔ "ou") e negue cada parte (leis de De Morgan).'),
  ec(5, 'Qual a negação de "se p então q"?', '"p e não q".'),
  ec(6, 'Qual a frase equivalente a "se p então q"?', 'A contrapositiva: "se não q então não p". Recíproca e inversa não são equivalentes.'),
]

// ───────────── Diagramas lógicos
export const DIAG_LESSON: Lesson = {
  id: 'rl-diagramas', topicId: 'rl-3', title: 'Diagramas lógicos: todo, algum e nenhum', questionIds: ['diag-1', 'diag-2', 'diag-3', 'diag-4', 'diag-5'],
  steps: [
    { title: 'Entenda',
      body: ['Os quantificadores "todo", "algum" e "nenhum" descrevem como grupos se relacionam, e podem ser desenhados como círculos (diagramas de Venn/Euler).',
        '"Todo A é B": o círculo A fica DENTRO do círculo B. "Nenhum A é B": os dois círculos ficam SEPARADOS, sem interseção. "Algum A é B": os círculos têm pelo menos uma parte em comum (em lógica, "algum" significa "pelo menos um", podendo ser todos). "Algum A não é B": existe pelo menos um elemento de A fora de B.',
        'Em questões de conclusão, vale apenas o que é NECESSÁRIO, ou seja, o que acontece em todos os desenhos possíveis. O que só acontece em alguns desenhos não pode ser afirmado.'],
      alt: 'Pense em gavetas dentro de gavetas. "Todo escrevente é servidor": a gaveta dos escreventes está dentro da gaveta dos servidores. "Nenhum estagiário é juiz": duas gavetas separadas, sem nada em comum.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — encadeamento: "Todo escrevente é servidor" e "Todo servidor é concursado". Os círculos ficam um dentro do outro: escrevente ⊂ servidor ⊂ concursado. Conclusão necessária: todo escrevente é concursado.',
        'Caso 2 — negações: a negação de "Todo A é B" é "Algum A não é B". A negação de "Nenhum A é B" é "Algum A é B". A negação de "Algum A é B" é "Nenhum A é B". Dica: o oposto de "todo" é "algum... não" e o oposto de "nenhum" é "algum".',
        'Caso 3 — contagem com dois conjuntos: em um grupo de 40 candidatos, 25 estudaram Português, 18 estudaram Matemática e 8 estudaram as duas. Quem estudou pelo menos uma: 25 + 18 − 8 = 35 (subtrai-se a interseção para não contar duas vezes). Logo 40 − 35 = 5 não estudaram nenhuma.'],
      alt: 'Na contagem com dois círculos, comece sempre pelo meio (a interseção) e vá para fora: só Português = 25 − 8 = 17; só Matemática = 18 − 8 = 10; as duas = 8; nenhuma = 40 − (17 + 10 + 8) = 5.' },
    { title: 'Resumo essencial',
      body: ['Memorize as negações dos quantificadores: elas se repetem em provas.'],
      table: { caption: 'Negação dos quantificadores', head: ['Frase', 'Negação'], rows: [
        ['Todo A é B', 'Algum A não é B'],
        ['Nenhum A é B', 'Algum A é B'],
        ['Algum A é B', 'Nenhum A é B'],
        ['Algum A não é B', 'Todo A é B']] } },
    { title: 'O que memorizar',
      body: ['• Todo A é B: A dentro de B. Nenhum A é B: círculos separados. Algum A é B: há interseção.',
        '• "Algum" em lógica = "pelo menos um" (pode ser todos).',
        '• Negação de "todo" → "algum não". Negação de "nenhum" → "algum".',
        '• "Algum A é B" equivale a "algum B é A" (a ordem pode inverter). "Todo A é B" NÃO equivale a "todo B é A".',
        '• Em conclusões, aceite só o que vale em TODOS os desenhos possíveis.',
        '• Dois conjuntos: n(A ou B) = n(A) + n(B) − n(A e B).'] },
  ],
}
const dq = mkQ('diag', 'rl-3')
const DIAG_RAW: Question[] = [
  dq(1, 'Sabe-se que "todo escrevente é servidor" e que "todo servidor é concursado". Dessas premissas, conclui-se necessariamente que', [
    o('A', 'todo concursado é escrevente.', 'Errada: a relação não é reversível; podem existir concursados que não são escreventes.'),
    o('B', 'todo concursado é servidor.', 'Errada: a relação dada é no sentido inverso (todo servidor é concursado).'),
    o('C', 'algum concursado não é servidor.', 'Errada: nada nas premissas permite afirmar isso.'),
    o('D', 'todo escrevente é concursado.', 'Correta: escrevente está dentro de servidor, que está dentro de concursado.'),
    o('E', 'nenhum servidor é escrevente.', 'Errada: contradiz a primeira premissa, que diz que todo escrevente é servidor.')], 'D', 'Fácil'),
  dq(2, 'A negação da proposição "Todo servidor chegou no horário" é', [
    o('A', 'Nenhum servidor chegou no horário.', 'Errada: afirmar que nenhum chegou é mais forte do que a negação lógica.'),
    o('B', 'Algum servidor chegou no horário.', 'Errada: pode ser verdadeira mesmo que todos tenham chegado, então não nega a original.'),
    o('C', 'Todo servidor chegou atrasado.', 'Errada: é um contrário (mais forte); a negação lógica é mais fraca.'),
    o('D', 'Algum servidor não chegou no horário.', 'Correta: a negação de "todo" é "algum... não".'),
    o('E', 'Nem todo servidor chegou atrasado.', 'Errada: fala de atraso, e não nega a proposição original sobre chegar no horário.')], 'D', 'Fácil'),
  dq(3, 'A negação da proposição "Nenhum candidato foi aprovado" é', [
    o('A', 'Todos os candidatos foram aprovados.', 'Errada: é mais forte do que a negação; basta um aprovado para negar "nenhum".'),
    o('B', 'Algum candidato foi aprovado.', 'Correta: a negação de "nenhum" é "pelo menos um".'),
    o('C', 'Algum candidato não foi aprovado.', 'Errada: é compatível com "nenhum foi aprovado"; não nega a proposição.'),
    o('D', 'Nenhum candidato foi reprovado.', 'Errada: equivale a dizer que todos foram aprovados, o que é mais forte do que a negação.'),
    o('E', 'Todos os candidatos foram reprovados.', 'Errada: é equivalente à proposição original, e não a sua negação.')], 'B', 'Médio'),
  dq(4, 'Considere as premissas: "Todos os escreventes são atentos" e "Alguns atentos são pontuais". Dessas premissas, a conclusão que decorre necessariamente é:', [
    o('A', 'Alguns escreventes são pontuais.', 'Errada: os pontuais podem estar entre os atentos que não são escreventes.'),
    o('B', 'Todo atento é escrevente.', 'Errada: escreventes estão dentro dos atentos, mas pode haver atentos que não são escreventes.'),
    o('C', 'Alguns pontuais são atentos.', 'Correta: "algum atento é pontual" equivale a "algum pontual é atento".'),
    o('D', 'Nenhum pontual é escrevente.', 'Errada: não é possível garantir isso; pontuais podem ser escreventes.'),
    o('E', 'Todo pontual é atento.', 'Errada: só se sabe que alguns pontuais são atentos.')], 'C', 'Difícil'),
  dq(5, 'Em um grupo de 40 candidatos, 25 estudaram Português, 18 estudaram Matemática e 8 estudaram as duas disciplinas. O número de candidatos que não estudaram nenhuma das duas é', [
    o('A', '0', 'Errada: 25 + 18 − 8 = 35 estudaram ao menos uma; sobram 5.'),
    o('B', '3', 'Errada: não corresponde ao cálculo 40 − 35.'),
    o('C', '5', 'Correta: 25 + 18 − 8 = 35 estudaram pelo menos uma; 40 − 35 = 5.'),
    o('D', '8', 'Errada: 8 é o número dos que estudaram as duas.'),
    o('E', '15', 'Errada: seria o resultado se a interseção fosse somada em vez de subtraída.')], 'C', 'Médio'),
]
export const DIAG_QUESTIONS: Question[] = DIAG_RAW.map((q, i) => i < 4 ? place(q, (['A', 'E', 'D', 'A'] as const)[i]) : q)
const dc = mkC('diag', 'rl-3', 'rl-diagramas')
export const DIAG_CARDS: Flashcard[] = [
  dc(1, 'Como se desenha "Todo A é B"?', 'O círculo de A fica totalmente dentro do círculo de B.'),
  dc(2, 'O que significa "algum" em lógica?', '"Pelo menos um" (pode ser até todos).'),
  dc(3, 'Qual a negação de "Todo A é B"?', '"Algum A não é B".'),
  dc(4, 'Qual a negação de "Nenhum A é B"?', '"Algum A é B".'),
  dc(5, '"Algum A é B" equivale a "algum B é A"? E "todo A é B" a "todo B é A"?', 'A primeira sim; a segunda não.'),
  dc(6, 'Como contar elementos de dois conjuntos que se sobrepõem?', 'n(A ou B) = n(A) + n(B) − n(A e B). Subtrai-se a interseção para não contar duas vezes.'),
]

export const EXATAS_LESSONS = [MMC_LESSON, PORC_LESSON, ESTR_LESSON, DIAG_LESSON]
export const EXATAS_QUESTIONS = [...MMC_QUESTIONS, ...PORC_QUESTIONS, ...ESTR_QUESTIONS, ...DIAG_QUESTIONS]
export const EXATAS_CARDS = [...MMC_CARDS, ...PORC_CARDS, ...ESTR_CARDS, ...DIAG_CARDS]
