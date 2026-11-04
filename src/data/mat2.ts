import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Matemática (Anexo VIII): operações com números reais, razão e proporção, regra de três, médias e juros simples. Contas conferidas por cálculo.

// ───────── mat-1
export const OPER_LESSON: Lesson = {
  id: 'mat-operacoes', topicId: 'mat-1', title: 'Operações com números reais', questionIds: ['oper-1', 'oper-2', 'oper-3', 'oper-4', 'oper-5'],
  steps: [
    step('Entenda', ['Os números reais reúnem os racionais (que podem virar fração: inteiros, decimais exatos e dízimas periódicas) e os irracionais (decimais infinitos sem repetição, como √2 e π). Na prova, quase tudo é conta com racionais.',
      'ORDEM DAS OPERAÇÕES: (1) parênteses, colchetes e chaves, de dentro para fora; (2) potências e raízes; (3) multiplicações e divisões, da esquerda para a direita; (4) somas e subtrações, da esquerda para a direita. Esquecer isso é a maior fonte de erro.',
      'REGRA DE SINAIS: sinais iguais na multiplicação/divisão dão resultado positivo; sinais diferentes, negativo. Potência de base negativa: expoente par dá positivo ((−2)² = 4), expoente ímpar dá negativo ((−2)³ = −8). Cuidado: −2² = −4 (o sinal não está na base).'],
      'Pense numa receita com ordem obrigatória: primeiro o que está entre parênteses, depois potências e raízes, depois multiplicar/dividir e, por último, somar/subtrair. Trocar a ordem muda o resultado: 3 + 4 × 2 = 11, e não 14.'),
    step('Exemplo prático', ['Caso 1: 3 + 4 × 2² − 10 ÷ 5. Potência: 2² = 4. Multiplicação e divisão: 4 × 4 = 16 e 10 ÷ 5 = 2. Soma e subtração: 3 + 16 − 2 = 17.',
      'Caso 2 — frações: 1/2 + 1/3 − 1/6. MMC dos denominadores = 6: 3/6 + 2/6 − 1/6 = 4/6 = 2/3. Para multiplicar frações, multiplique numeradores e denominadores; para dividir, multiplique pelo inverso.',
      'Caso 3 — decimais: 0,25 + 0,4 × 0,5. A multiplicação vem antes: 0,4 × 0,5 = 0,2; depois 0,25 + 0,2 = 0,45.',
      'Caso 4 — raízes e potências: √144 − √49 + 2³ = 12 − 7 + 8 = 13.'],
      'Em frações, o erro típico é somar denominadores (1/2 + 1/3 ≠ 2/5). Primeiro iguale os denominadores com o MMC; só então some os numeradores.'),
    step('Resumo essencial', ['Mantenha estas regras à mão.'], undefined, { caption: 'Regras de bolso', head: ['Tema', 'Regra', 'Exemplo'], rows: [
      ['Ordem das operações', 'Parênteses → potências/raízes → × ÷ → + −', '3 + 4 × 2 = 11'],
      ['Sinais (× e ÷)', 'Iguais: +; diferentes: −', '(−3) × (−2) = 6'],
      ['Potência de base negativa', 'Par: +; ímpar: −', '(−2)³ = −8'],
      ['Soma de frações', 'Igualar denominadores (MMC)', '1/2 + 1/3 = 5/6'],
      ['Divisão de frações', 'Multiplicar pelo inverso', '1/2 ÷ 1/4 = 2']] }),
    step('O que memorizar', ['• Ordem: parênteses, potências/raízes, × e ÷, + e − (da esquerda para a direita nos de mesma prioridade).',
      '• Irracional = decimal infinito não periódico (√2, π). Dízima periódica é racional.',
      '• (−a)² = a², mas −a² = −(a²).',
      '• Frações: some só com denominadores iguais; multiplique numerador com numerador e denominador com denominador.',
      '• Decimais: alinhe as vírgulas na soma; na multiplicação, conte as casas decimais.'] ),
  ],
}
const oq = mkQ('oper', 'mat-1')
export const OPER_QUESTIONS: Question[] = [
  oq(1, 'O valor da expressão 3 + 4 × 2² − 10 ÷ 5 é', [
    o('A', '9', 'Errada: calculou 4 × 2 sem elevar o 2 ao quadrado (3 + 8 − 2).'),
    o('B', '17', 'Correta: 2² = 4; 4 × 4 = 16; 10 ÷ 5 = 2; 3 + 16 − 2 = 17.'),
    o('C', '19', 'Errada: esqueceu de subtrair 10 ÷ 5 (3 + 16).'),
    o('D', '26', 'Errada: somou 3 + 4 antes de multiplicar ((7 × 4) − 2).'),
    o('E', '29', 'Errada: trocou a divisão por soma (3 + 16 + 10).')], 'B', 'Fácil'),
  oq(2, 'O valor de (−2)³ + (−2)² é', [
    o('A', '−12', 'Errada: tratou (−2)² como negativo (−8 − 4).'),
    o('B', '−4', 'Correta: (−2)³ = −8 e (−2)² = 4; −8 + 4 = −4.'),
    o('C', '0', 'Errada: não resulta de (−8) + 4.'),
    o('D', '4', 'Errada: ignora que (−2)³ é negativo.'),
    o('E', '12', 'Errada: trata as duas potências como positivas (8 + 4).')], 'B', 'Médio'),
  oq(3, 'O resultado de 1/2 + 1/3 − 1/6 é', [
    o('A', '1/3', 'Errada: não resulta do MMC 6 (3/6 + 2/6 − 1/6 = 4/6).'),
    o('B', '1/2', 'Errada: 3/6 é apenas o primeiro termo; falta somar e subtrair os demais.'),
    o('C', '2/3', 'Correta: 3/6 + 2/6 − 1/6 = 4/6 = 2/3.'),
    o('D', '3/4', 'Errada: não corresponde ao cálculo com denominador comum 6.'),
    o('E', '2/5', 'Errada: é o erro de somar numeradores e denominadores (1 + 1 = 2; 2 + 3 = 5).')], 'C', 'Médio'),
  oq(4, 'O valor de 0,25 + 0,4 × 0,5 é', [
    o('A', '0,2', 'Errada: é apenas o produto 0,4 × 0,5; falta somar 0,25.'),
    o('B', '0,325', 'Errada: é (0,25 + 0,4) × 0,5, que soma antes de multiplicar.'),
    o('C', '0,45', 'Correta: 0,4 × 0,5 = 0,2 e 0,25 + 0,2 = 0,45.'),
    o('D', '0,65', 'Errada: é 0,25 + 0,4, sem a multiplicação por 0,5.'),
    o('E', '0,9', 'Errada: soma os três números sem respeitar a multiplicação.')], 'C', 'Médio'),
  oq(5, 'Entre os números abaixo, o único irracional é', [
    o('A', '√16', 'Errada: √16 = 4, que é inteiro (racional).'),
    o('B', '0,333...', 'Errada: dízima periódica; equivale a 1/3, portanto racional.'),
    o('C', '22/7', 'Errada: é uma fração (racional), apesar de aproximar π.'),
    o('D', '√2', 'Correta: √2 tem infinitas casas decimais sem repetição.'),
    o('E', '−5', 'Errada: inteiro negativo, portanto racional.')], 'D', 'Fácil'),
]
const oc = mkC('oper', 'mat-1', 'mat-operacoes')
export const OPER_CARDS: Flashcard[] = [
  oc(1, 'Qual a ordem das operações?', 'Parênteses/colchetes/chaves → potências e raízes → multiplicação e divisão → soma e subtração (esquerda para direita).'),
  oc(2, 'Qual a diferença entre (−2)² e −2²?', '(−2)² = 4 (a base é −2); −2² = −4 (o sinal fica fora da potência).'),
  oc(3, 'Como somar frações com denominadores diferentes?', 'Iguale os denominadores pelo MMC e some os numeradores: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.'),
  oc(4, 'Como dividir frações?', 'Multiplique a primeira pelo inverso da segunda.'),
  oc(5, 'O que é número irracional? Dê exemplos.', 'Decimal infinito sem repetição, que não vira fração: √2, π.'),
  oc(6, 'Dízima periódica é racional ou irracional?', 'Racional: pode ser escrita como fração (0,333… = 1/3).'),
]

// ───────── mat-3
export const RAZAO_LESSON: Lesson = {
  id: 'mat-razao', topicId: 'mat-3', title: 'Razão e proporção', questionIds: ['razao-1', 'razao-2', 'razao-3', 'razao-4', 'razao-5'],
  steps: [
    step('Entenda', ['Razão é a comparação entre duas grandezas por divisão: a razão de a para b é a/b (ou a : b). A razão 12 para 30 é 12/30, que simplifica para 2/5. A ORDEM importa: a razão de 30 para 12 é outra (5/2).',
      'Proporção é a igualdade entre duas razões: a/b = c/d. Propriedade fundamental: o produto dos meios é igual ao produto dos extremos (a × d = b × c). É daí que se tira o valor desconhecido: x/9 = 8/12 → 12x = 72 → x = 6.',
      'Divisão proporcional: para repartir um total em partes proporcionais a certos números, some os números, descubra quanto vale cada "parte" (total ÷ soma) e multiplique. Repartir 900 em partes proporcionais a 2, 3 e 4: soma = 9; cada parte = 100; resultados: 200, 300 e 400.'],
      'Pense em uma pizza dividida por "pesos": se uma pessoa tem peso 2 e outra peso 3, a pizza vira 5 fatias iguais; uma leva 2 fatias e outra 3. Descobrir o valor de uma fatia é o passo-chave.'),
    step('Exemplo prático', ['Caso 1 — razão e total: a razão entre homens e mulheres de um grupo é 3/5 e o grupo tem 40 pessoas. As "partes" são 3 + 5 = 8; cada parte vale 40 ÷ 8 = 5; logo, 15 homens e 25 mulheres.',
      'Caso 2 — dois números na razão 4 : 7 com soma 66: 4 + 7 = 11; cada parte = 6; os números são 24 e 42 e a diferença entre eles é 18.',
      'Caso 3 — proporção: 6 está para 9 assim como x está para 12 → 6/9 = x/12 → 9x = 72 → x = 8.',
      'Atenção: razão não tem unidade quando as grandezas são do mesmo tipo (percentual, por exemplo), e tem unidade quando são diferentes (km/h).'],
      'Truque: "soma das partes" é sempre o primeiro passo em problemas de repartição. Depois, uma divisão resolve.'),
    step('Resumo essencial', ['Passos para os problemas mais comuns.'], undefined, { caption: 'Razão e proporção', head: ['Problema', 'Como resolver', 'Exemplo'], rows: [
      ['Simplificar razão', 'Dividir os dois termos pelo MDC', '12/30 = 2/5'],
      ['Achar termo desconhecido', 'Produto dos meios = produto dos extremos', 'x/9 = 8/12 → x = 6'],
      ['Repartir em partes proporcionais', 'Somar as partes; total ÷ soma; multiplicar', '900 em 2, 3, 4 → 200, 300, 400'],
      ['Razão e soma conhecidas', 'Partes = soma da razão; valor da parte = total ÷ partes', '4 : 7, soma 66 → 24 e 42']] }),
    step('O que memorizar', ['• Razão = divisão; a ordem dos termos importa.',
      '• Proporção: a/b = c/d ⇔ a × d = b × c.',
      '• Divisão proporcional: valor de cada parte = total ÷ soma das partes.',
      '• Razão 3 : 5 não significa 3 e 5 unidades: significa 3 e 5 "partes" iguais.',
      '• Sempre reconfira: a soma das partes deve voltar ao total.'] ),
  ],
}
const zq = mkQ('razao', 'mat-3')
export const RAZAO_QUESTIONS: Question[] = [
  zq(1, 'A razão de 12 para 30, na forma mais simples, é', [
    o('A', '1/3', 'Errada: 1/3 equivale a 10/30, e não a 12/30.'),
    o('B', '2/5', 'Correta: dividindo 12 e 30 por 6, obtém-se 2/5.'),
    o('C', '3/5', 'Errada: 3/5 = 18/30.'),
    o('D', '5/2', 'Errada: é a razão inversa (30 para 12).'),
    o('E', '6/15', 'Errada: equivale a 2/5, mas não está na forma mais simples.')], 'B', 'Fácil'),
  zq(2, 'Se x/9 = 8/12, o valor de x é', [
    o('A', '4', 'Errada: 12 × 4 = 48, e 9 × 8 = 72.'),
    o('B', '5', 'Errada: 12 × 5 = 60, que não é 72.'),
    o('C', '6', 'Correta: 12x = 9 × 8 = 72, logo x = 6.'),
    o('D', '7', 'Errada: 12 × 7 = 84, que não é 72.'),
    o('E', '12', 'Errada: 12 × 12 = 144, que não é 72.')], 'C', 'Fácil'),
  zq(3, 'Uma quantia de R$ 900,00 será dividida em partes diretamente proporcionais a 2, 3 e 4. A maior das partes será de', [
    o('A', 'R$ 200,00', 'Errada: é a menor das partes (2 × 100).'),
    o('B', 'R$ 300,00', 'Errada: é a parte intermediária (3 × 100).'),
    o('C', 'R$ 350,00', 'Errada: não corresponde a nenhum múltiplo de R$ 100,00 (valor de cada parte).'),
    o('D', 'R$ 400,00', 'Correta: soma das partes = 9; 900 ÷ 9 = 100; a maior parte é 4 × 100 = 400.'),
    o('E', 'R$ 450,00', 'Errada: seria a metade do total, e não 4/9 dele.')], 'D', 'Médio'),
  zq(4, 'Em um grupo de 40 pessoas, a razão entre o número de homens e o de mulheres é 3/5. O número de mulheres é', [
    o('A', '15', 'Errada: é o número de homens (3 × 5).'),
    o('B', '16', 'Errada: não é múltiplo da parte (5).'),
    o('C', '24', 'Errada: com 24 mulheres e 16 homens, a razão seria 2/3.'),
    o('D', '25', 'Correta: 3 + 5 = 8 partes; 40 ÷ 8 = 5; mulheres = 5 × 5 = 25.'),
    o('E', '32', 'Errada: com 32 mulheres e 8 homens, a razão seria 1/4.')], 'D', 'Médio'),
  zq(5, 'Dois números estão na razão 4 : 7 e sua soma é 66. A diferença entre o maior e o menor é', [
    o('A', '6', 'Errada: é o valor de cada parte, não a diferença.'),
    o('B', '12', 'Errada: seria 2 partes de 6.'),
    o('C', '18', 'Correta: 4 + 7 = 11 partes; 66 ÷ 11 = 6; números 24 e 42; diferença 18 (3 partes).'),
    o('D', '24', 'Errada: é o menor dos números (4 × 6).'),
    o('E', '42', 'Errada: é o maior dos números (7 × 6).')], 'C', 'Médio'),
]
const zc = mkC('razao', 'mat-3', 'mat-razao')
export const RAZAO_CARDS: Flashcard[] = [
  zc(1, 'O que é razão?', 'A comparação entre duas grandezas por divisão (a/b). A ordem dos termos importa.'),
  zc(2, 'Qual a propriedade fundamental das proporções?', 'Em a/b = c/d, o produto dos meios é igual ao produto dos extremos: a × d = b × c.'),
  zc(3, 'Como dividir um valor em partes proporcionais a 2, 3 e 4?', 'Some as partes (9), divida o total por 9 para achar o valor de cada parte e multiplique por 2, 3 e 4.'),
  zc(4, 'A razão 3 : 5 em um grupo de 40 pessoas, quanto vale cada grupo?', '3 + 5 = 8 partes; 40 ÷ 8 = 5; logo 15 e 25.'),
  zc(5, 'Como simplificar uma razão?', 'Divida os dois termos pelo MDC. 12/30 = 2/5.'),
  zc(6, 'Como conferir a divisão proporcional?', 'A soma das partes obtidas deve ser igual ao total.'),
]

// ───────── mat-5
export const TRES_LESSON: Lesson = {
  id: 'mat-regra-de-tres', topicId: 'mat-5', title: 'Regra de três simples e composta', questionIds: ['tres-1', 'tres-2', 'tres-3', 'tres-4', 'tres-5'],
  steps: [
    step('Entenda', ['Regra de três é um método para achar um valor desconhecido quando se conhecem outros três (simples) ou mais (composta) que se relacionam de forma proporcional.',
      'Passo-chave: descobrir se as grandezas são DIRETAMENTE proporcionais (se uma aumenta, a outra aumenta na mesma proporção) ou INVERSAMENTE proporcionais (se uma aumenta, a outra diminui). Mais canetas custam mais (direta). Mais servidores terminam o serviço em menos dias (inversa).',
      'Na regra de três simples DIRETA, multiplica-se em "cruz" (produto dos meios = produto dos extremos). Na INVERSA, inverte-se uma das razões antes de montar. Na regra de três COMPOSTA há três ou mais grandezas: compara-se cada uma com a grandeza que contém a incógnita.'],
      'Pergunte-se: "se dobro a primeira, o que acontece com a segunda?". Dobra? Direta. Cai pela metade? Inversa. Só depois monte a conta.'),
    step('Exemplo prático', ['Caso 1 — simples direta: 6 canetas custam R$ 15,00; 10 canetas custam x. 6/10 = 15/x → x = 150 ÷ 6 = R$ 25,00.',
      'Caso 2 — simples inversa: 4 servidores concluem um serviço em 12 dias; 6 servidores levariam x dias. Mais servidores, menos dias (inversa): 4 × 12 = 6 × x → x = 8 dias.',
      'Caso 3 — composta: 5 servidores trabalhando 8 h por dia durante 10 dias analisam 400 processos. Quantos processos analisariam 10 servidores, 4 h por dia, em 15 dias? Todas as grandezas são diretamente proporcionais aos processos. Produção por servidor-hora = 400 ÷ (5 × 8 × 10) = 1. Novo total = 10 × 4 × 15 × 1 = 600 processos.',
      'Dica: na composta, uma saída segura é achar a "unidade" (por servidor, por hora) e depois multiplicar.'],
      'Duas perguntas resolvem tudo: (1) direta ou inversa? (2) qual é a incógnita? Em contas compostas, reduza tudo à unidade (por pessoa, por hora) e multiplique.'),
    step('Resumo essencial', ['Como identificar cada caso.'], undefined, { caption: 'Regra de três', head: ['Tipo', 'Como reconhecer', 'Montagem'], rows: [
      ['Simples direta', 'Aumenta uma, aumenta a outra', 'a/b = c/x → x = bc/a'],
      ['Simples inversa', 'Aumenta uma, diminui a outra', 'a × b = c × x → x = ab/c'],
      ['Composta', 'Três ou mais grandezas', 'Comparar cada uma com a que tem o x; ou reduzir à unidade']] }),
    step('O que memorizar', ['• Primeiro classifique: direta ou inversa.',
      '• Direta: multiplica em cruz. Inversa: produto das grandezas associadas é constante.',
      '• Velocidade × tempo (mesma distância): inversa. Pessoas × dias (mesmo serviço): inversa.',
      '• Composta: reduzir à unidade evita erros de montagem.',
      '• Confira o resultado: se aumentou a quantidade de trabalhadores, o tempo deve ter diminuído.'] ),
  ],
}
const tq = mkQ('tres', 'mat-5')
export const TRES_QUESTIONS: Question[] = [
  tq(1, 'Seis canetas iguais custam R$ 15,00. Dez dessas canetas custam', [
    o('A', 'R$ 20,00', 'Errada: seria o preço para 8 canetas.'),
    o('B', 'R$ 22,50', 'Errada: seria o preço para 9 canetas.'),
    o('C', 'R$ 25,00', 'Correta: cada caneta custa 15 ÷ 6 = 2,50; 10 canetas custam R$ 25,00.'),
    o('D', 'R$ 30,00', 'Errada: seria o preço para 12 canetas.'),
    o('E', 'R$ 90,00', 'Errada: multiplicou 6 por 15, o que não faz sentido na relação.')], 'C', 'Fácil'),
  tq(2, 'Quatro servidores concluem um serviço em 12 dias. Mantido o mesmo ritmo, seis servidores concluiriam o mesmo serviço em', [
    o('A', '6 dias', 'Errada: 6 dias exigiria 8 servidores (4 × 12 ÷ 6).'),
    o('B', '8 dias', 'Correta: grandezas inversas; 4 × 12 = 48; 48 ÷ 6 = 8.'),
    o('C', '9 dias', 'Errada: 9 dias exigiria 48 ÷ 9 ≈ 5,3 servidores.'),
    o('D', '16 dias', 'Errada: seria o resultado se fossem 3 servidores (48 ÷ 3).'),
    o('E', '18 dias', 'Errada: aplicou a proporção direta (12 × 6 ÷ 4), mas as grandezas são inversas.')], 'B', 'Médio'),
  tq(3, 'Cinco servidores, trabalhando 8 horas por dia durante 10 dias, analisam 400 processos. Dez servidores, trabalhando 4 horas por dia durante 15 dias, no mesmo ritmo, analisarão', [
    o('A', '300 processos', 'Errada: não considerou a duplicação de servidores e o aumento de dias.'),
    o('B', '400 processos', 'Errada: as variações não se compensam exatamente; o total muda.'),
    o('C', '500 processos', 'Errada: não corresponde ao produto servidores × horas × dias.'),
    o('D', '600 processos', 'Correta: 400 ÷ (5 × 8 × 10) = 1 processo por servidor-hora; 10 × 4 × 15 = 600.'),
    o('E', '800 processos', 'Errada: seria o dobro do original, ignorando a redução da jornada.')], 'D', 'Difícil'),
  tq(4, 'Um veículo, a 90 km/h, faz um percurso em 2 horas. Mantendo o mesmo percurso, a 60 km/h ele levará', [
    o('A', '1 h 20 min', 'Errada: a velocidade diminuiu, então o tempo deve aumentar.'),
    o('B', '2 h 30 min', 'Errada: o tempo correto é maior que esse.'),
    o('C', '3 horas', 'Correta: distância = 90 × 2 = 180 km; 180 ÷ 60 = 3 h (grandezas inversas).'),
    o('D', '3 h 30 min', 'Errada: é maior do que o necessário.'),
    o('E', '4 horas', 'Errada: seria o tempo a 45 km/h.')], 'C', 'Médio'),
  tq(5, 'Uma impressora imprime 45 páginas em 3 minutos. No mesmo ritmo, em 10 minutos imprimirá', [
    o('A', '135 páginas', 'Errada: seria o resultado em 9 minutos.'),
    o('B', '140 páginas', 'Errada: não corresponde ao ritmo de 15 páginas por minuto.'),
    o('C', '150 páginas', 'Correta: 45 ÷ 3 = 15 páginas por minuto; 15 × 10 = 150.'),
    o('D', '160 páginas', 'Errada: não corresponde ao ritmo de 15 páginas por minuto.'),
    o('E', '450 páginas', 'Errada: multiplicou 45 por 10 sem considerar os 3 minutos.')], 'C', 'Fácil'),
]
const tc = mkC('tres', 'mat-5', 'mat-regra-de-tres')
export const TRES_CARDS: Flashcard[] = [
  tc(1, 'Qual o primeiro passo em uma regra de três?', 'Decidir se as grandezas são diretamente ou inversamente proporcionais.'),
  tc(2, 'Dê um exemplo de grandezas inversamente proporcionais.', 'Número de servidores e dias para concluir o mesmo serviço; velocidade e tempo para o mesmo percurso.'),
  tc(3, 'Como se resolve regra de três simples direta?', 'Multiplicando em cruz: a/b = c/x → x = (b × c)/a.'),
  tc(4, 'Como se resolve regra de três simples inversa?', 'O produto das duas grandezas associadas é constante: a × b = c × x.'),
  tc(5, 'Como lidar com regra de três composta?', 'Compare cada grandeza com a que tem a incógnita (ou reduza à unidade: por pessoa, por hora) e multiplique.'),
  tc(6, 'Como conferir a resposta de uma regra de três?', 'Se mais pessoas trabalham, o tempo deve diminuir; se mais itens, o preço total deve aumentar. Veja se o resultado faz sentido.'),
]

// ───────── mat-6
export const MEDIA_LESSON: Lesson = {
  id: 'mat-medias', topicId: 'mat-6', title: 'Média aritmética simples e ponderada', questionIds: ['media-1', 'media-2', 'media-3', 'media-4', 'media-5'],
  steps: [
    step('Entenda', ['Média aritmética simples é a soma dos valores dividida pela quantidade deles. A média de 6, 8, 7 e 9 é (6 + 8 + 7 + 9) ÷ 4 = 30 ÷ 4 = 7,5.',
      'Média ponderada é usada quando os valores têm "pesos" diferentes. Multiplica-se cada valor pelo seu peso, soma-se tudo e divide-se pela soma dos pesos. Notas 6 (peso 2) e 8 (peso 3): (6 × 2 + 8 × 3) ÷ (2 + 3) = 36 ÷ 5 = 7,2.',
      'A ideia mais útil: média × quantidade = soma. Com isso se resolve quase tudo: se a média de 5 números é 8, a soma é 40; se um número sai ou entra, a soma muda e a nova média é recalculada.'],
      'Pense na média como "nivelar": se todos os valores fossem iguais e a soma continuasse a mesma, cada um valeria a média.'),
    step('Exemplo prático', ['Caso 1 — um número sai: a média de 5 números é 8 e um deles, 14, é retirado. Soma original = 40; sem o 14, soma = 26; nova média = 26 ÷ 4 = 6,5.',
      'Caso 2 — alguém entra: a média das idades de 3 pessoas é 30 e chega uma pessoa de 50 anos. Soma = 90; com a nova pessoa = 140; nova média = 140 ÷ 4 = 35.',
      'Caso 3 — nota necessária: para ter média 7 em 4 provas, a soma deve ser 28. Se as três primeiras somam 5 + 7 + 8 = 20, a quarta precisa ser 8.',
      'Caso 4 — ponderada: uma prova tem duas partes, uma de peso 2 e outra de peso 3. A parte de peso maior influencia mais a média final.'],
      'Problemas do tipo "qual nota preciso tirar" são sempre soma necessária menos soma já obtida.'),
    step('Resumo essencial', ['Fórmulas e atalhos.'], undefined, { caption: 'Médias', head: ['Conceito', 'Fórmula', 'Exemplo'], rows: [
      ['Média simples', 'soma ÷ quantidade', '(6 + 8 + 7 + 9) ÷ 4 = 7,5'],
      ['Média ponderada', 'Σ(valor × peso) ÷ Σ(pesos)', '(6×2 + 8×3) ÷ 5 = 7,2'],
      ['Soma a partir da média', 'média × quantidade', '5 números, média 8 → soma 40'],
      ['Nota necessária', 'soma exigida − soma obtida', '28 − 20 = 8']] }),
    step('O que memorizar', ['• Média simples = soma ÷ quantidade.',
      '• Média ponderada: divida pela SOMA DOS PESOS, e não pela quantidade de valores.',
      '• média × quantidade = soma (use para recalcular quando alguém entra ou sai).',
      '• A média fica sempre entre o menor e o maior valor.',
      '• Se todos os valores aumentam em k, a média aumenta em k.'] ),
  ],
}
const mq = mkQ('media', 'mat-6')
export const MEDIA_QUESTIONS: Question[] = [
  mq(1, 'A média aritmética simples das notas 6, 8, 7 e 9 é', [
    o('A', '7', 'Errada: a soma (30) dividida por 4 dá 7,5.'),
    o('B', '7,5', 'Correta: (6 + 8 + 7 + 9) ÷ 4 = 30 ÷ 4 = 7,5.'),
    o('C', '8', 'Errada: não resulta de 30 ÷ 4.'),
    o('D', '7,75', 'Errada: não resulta de 30 ÷ 4.'),
    o('E', '30', 'Errada: é a soma, e não a média.')], 'B', 'Fácil'),
  mq(2, 'Um aluno obteve nota 6 em uma prova de peso 2 e nota 8 em outra de peso 3. Sua média ponderada é', [
    o('A', '6,5', 'Errada: não corresponde a (12 + 24) ÷ 5.'),
    o('B', '7,0', 'Errada: é a média simples (6 + 8) ÷ 2, que ignora os pesos.'),
    o('C', '7,2', 'Correta: (6 × 2 + 8 × 3) ÷ (2 + 3) = 36 ÷ 5 = 7,2.'),
    o('D', '7,5', 'Errada: não corresponde ao cálculo ponderado.'),
    o('E', '36', 'Errada: é a soma dos produtos; falta dividir pela soma dos pesos.')], 'C', 'Médio'),
  mq(3, 'A média aritmética de cinco números é 8. Retirando-se o número 14, a média dos quatro restantes passa a ser', [
    o('A', '5,5', 'Errada: soma restante = 26; 26 ÷ 4 = 6,5.'),
    o('B', '6', 'Errada: soma restante = 26; 26 ÷ 4 = 6,5.'),
    o('C', '6,5', 'Correta: soma = 5 × 8 = 40; sem o 14, 26; 26 ÷ 4 = 6,5.'),
    o('D', '7', 'Errada: não resulta da soma 26 dividida por 4.'),
    o('E', '8', 'Errada: a média só se mantém se o número retirado for igual a ela (8).')], 'C', 'Médio'),
  mq(4, 'A média das idades de três pessoas é 30 anos. Quando uma quarta pessoa, de 50 anos, se junta ao grupo, a média das idades passa a ser', [
    o('A', '32 anos', 'Errada: soma nova = 90 + 50 = 140; 140 ÷ 4 = 35.'),
    o('B', '33 anos', 'Errada: soma nova = 140; 140 ÷ 4 = 35.'),
    o('C', '35 anos', 'Correta: 3 × 30 = 90; 90 + 50 = 140; 140 ÷ 4 = 35.'),
    o('D', '40 anos', 'Errada: é a média simples entre 30 e 50, ignorando o número de pessoas.'),
    o('E', '45 anos', 'Errada: não resulta de 140 ÷ 4.')], 'C', 'Médio'),
  mq(5, 'Para ser aprovado, um candidato precisa de média 7 em quatro provas. Tirou 5, 7 e 8 nas três primeiras. Na quarta prova ele precisa tirar, no mínimo,', [
    o('A', '6', 'Errada: soma seria 26; média 6,5.'),
    o('B', '7', 'Errada: soma seria 27; média 6,75.'),
    o('C', '8', 'Correta: soma exigida = 4 × 7 = 28; já tem 20; precisa de 8.'),
    o('D', '9', 'Errada: é mais do que o necessário (soma 29).'),
    o('E', '10', 'Errada: é mais do que o necessário (soma 30).')], 'C', 'Médio'),
]
const mc = mkC('media', 'mat-6', 'mat-medias')
export const MEDIA_CARDS: Flashcard[] = [
  mc(1, 'Como calcular média aritmética simples?', 'Some os valores e divida pela quantidade.'),
  mc(2, 'Como calcular média ponderada?', 'Σ(valor × peso) ÷ Σ(pesos).'),
  mc(3, 'Por que "média × quantidade = soma" é útil?', 'Permite recalcular a média quando um valor entra ou sai, trabalhando com a soma.'),
  mc(4, 'Como descobrir a nota necessária para atingir uma média?', 'Soma exigida (média × quantidade) menos soma já obtida.'),
  mc(5, 'A média pode ser maior que o maior valor?', 'Não. Fica sempre entre o menor e o maior.'),
  mc(6, 'Na ponderada, divide-se por quê?', 'Pela soma dos pesos, e não pela quantidade de valores.'),
]

// ───────── mat-7
export const JUROS_LESSON: Lesson = {
  id: 'mat-juros-simples', topicId: 'mat-7', title: 'Juros simples', questionIds: ['juros-1', 'juros-2', 'juros-3', 'juros-4', 'juros-5'],
  steps: [
    step('Entenda', ['Juros são o "aluguel do dinheiro": o valor pago por usar um capital durante um período. No regime de juros SIMPLES, os juros são calculados sempre sobre o capital inicial, sem "juros sobre juros".',
      'Fórmula: J = C × i × t, em que J são os juros, C é o capital (valor inicial), i é a taxa (em forma decimal: 3% = 0,03) e t é o tempo. A taxa e o tempo precisam estar na mesma unidade (taxa ao mês com tempo em meses). O montante é M = C + J.',
      'Regime simples tem crescimento linear: a cada período, os juros somados são iguais. Taxas são proporcionais: 12% ao ano equivale a 1% ao mês (12 ÷ 12).'],
      'Pense numa escada com degraus iguais: a cada mês, o valor sobe sempre o mesmo tanto (C × i). Não há "degrau cada vez maior" como nos juros compostos.'),
    step('Exemplo prático', ['Caso 1 — juros: capital R$ 2.000,00, taxa 3% ao mês, 5 meses. J = 2.000 × 0,03 × 5 = R$ 300,00.',
      'Caso 2 — montante: R$ 1.500,00 a 2% ao mês durante 10 meses. J = 1.500 × 0,02 × 10 = 300; M = 1.500 + 300 = R$ 1.800,00.',
      'Caso 3 — capital: juros de R$ 360,00 em 6 meses a 2% ao mês. C = 360 ÷ (0,02 × 6) = R$ 3.000,00.',
      'Caso 4 — taxa: capital R$ 5.000,00, juros R$ 750,00 em 3 meses. i = 750 ÷ (5.000 × 3) = 0,05 = 5% ao mês.',
      'Caso 5 — conversão: 12% ao ano, capital R$ 1.200,00, por 6 meses: taxa mensal proporcional = 1%; J = 1.200 × 0,01 × 6 = R$ 72,00.'],
      'Armadilha clássica: usar 3 (por cento) em vez de 0,03, ou misturar taxa mensal com tempo em anos. Sempre ajuste as unidades antes de calcular.'),
    step('Resumo essencial', ['Cada fórmula é a mesma J = C × i × t, reorganizada.'], undefined, { caption: 'Juros simples', head: ['Quero achar', 'Fórmula', 'Exemplo'], rows: [
      ['Juros (J)', 'C × i × t', '2.000 × 0,03 × 5 = 300'],
      ['Montante (M)', 'C + J', '1.500 + 300 = 1.800'],
      ['Capital (C)', 'J ÷ (i × t)', '360 ÷ (0,02 × 6) = 3.000'],
      ['Taxa (i)', 'J ÷ (C × t)', '750 ÷ (5.000 × 3) = 5%'],
      ['Tempo (t)', 'J ÷ (C × i)', '—']] }),
    step('O que memorizar', ['• J = C × i × t; M = C + J.',
      '• Taxa em decimal (3% = 0,03) e tempo na mesma unidade da taxa.',
      '• Taxas proporcionais: 12% a.a. = 1% a.m. (divide-se).',
      '• Juros simples crescem de forma linear (mesmo valor a cada período).',
      '• Para achar C, i ou t, isole a fórmula.'] ),
  ],
}
const jq = mkQ('juros', 'mat-7')
export const JUROS_QUESTIONS: Question[] = [
  jq(1, 'Um capital de R$ 2.000,00 é aplicado a juros simples, à taxa de 3% ao mês, durante 5 meses. O valor dos juros é', [
    o('A', 'R$ 150,00', 'Errada: corresponde a apenas 2,5 meses de juros.'),
    o('B', 'R$ 200,00', 'Errada: corresponde a 2% ao mês em 5 meses.'),
    o('C', 'R$ 300,00', 'Correta: J = 2.000 × 0,03 × 5 = 300.'),
    o('D', 'R$ 2.300,00', 'Errada: é o montante (capital + juros), e não os juros.'),
    o('E', 'R$ 30.000,00', 'Errada: usou 3 em vez de 0,03 (2.000 × 3 × 5).')], 'C', 'Fácil'),
  jq(2, 'Um capital de R$ 1.500,00 foi aplicado a juros simples, a 2% ao mês, por 10 meses. O montante ao final do período foi de', [
    o('A', 'R$ 1.530,00', 'Errada: corresponde a apenas 1 mês de juros.'),
    o('B', 'R$ 1.650,00', 'Errada: corresponde a 5 meses de juros.'),
    o('C', 'R$ 1.800,00', 'Correta: J = 1.500 × 0,02 × 10 = 300; M = 1.800.'),
    o('D', 'R$ 1.950,00', 'Errada: corresponde a 15 meses de juros.'),
    o('E', 'R$ 300,00', 'Errada: são apenas os juros; o montante inclui o capital.')], 'C', 'Médio'),
  jq(3, 'Os juros simples de uma aplicação, à taxa de 2% ao mês, foram de R$ 360,00 após 6 meses. O capital aplicado foi de', [
    o('A', 'R$ 2.000,00', 'Errada: 2.000 × 0,02 × 6 = 240.'),
    o('B', 'R$ 2.500,00', 'Errada: 2.500 × 0,02 × 6 = 300.'),
    o('C', 'R$ 3.000,00', 'Correta: C = 360 ÷ (0,02 × 6) = 3.000.'),
    o('D', 'R$ 3.600,00', 'Errada: 3.600 × 0,02 × 6 = 432.'),
    o('E', 'R$ 18.000,00', 'Errada: dividiu apenas pela taxa (360 ÷ 0,02), esquecendo o tempo.')], 'C', 'Médio'),
  jq(4, 'Um capital de R$ 5.000,00 rendeu R$ 750,00 de juros simples em 3 meses. A taxa mensal foi de', [
    o('A', '3%', 'Errada: 5.000 × 0,03 × 3 = 450.'),
    o('B', '4%', 'Errada: 5.000 × 0,04 × 3 = 600.'),
    o('C', '5%', 'Correta: i = 750 ÷ (5.000 × 3) = 0,05.'),
    o('D', '6%', 'Errada: 5.000 × 0,06 × 3 = 900.'),
    o('E', '15%', 'Errada: 15% é a taxa total no período (750 ÷ 5.000), e não a mensal.')], 'C', 'Médio'),
  jq(5, 'Uma aplicação de R$ 1.200,00 rende juros simples à taxa de 12% ao ano. Os juros obtidos em 6 meses são de', [
    o('A', 'R$ 12,00', 'Errada: corresponde a 1% de R$ 1.200,00 sem considerar os 6 meses.'),
    o('B', 'R$ 72,00', 'Correta: taxa proporcional de 1% ao mês; 1.200 × 0,01 × 6 = 72.'),
    o('C', 'R$ 144,00', 'Errada: são os juros de um ano completo (1.200 × 0,12).'),
    o('D', 'R$ 864,00', 'Errada: aplicou 12% ao ano por 6 anos (1.200 × 0,12 × 6).'),
    o('E', 'R$ 1.272,00', 'Errada: é o montante (capital + juros), e não os juros.')], 'B', 'Médio'),
]
const jc = mkC('juros', 'mat-7', 'mat-juros-simples')
export const JUROS_CARDS: Flashcard[] = [
  jc(1, 'Qual a fórmula dos juros simples?', 'J = C × i × t (taxa em decimal e tempo na mesma unidade da taxa).'),
  jc(2, 'Como calcular o montante?', 'M = C + J.'),
  jc(3, 'Qual a diferença entre juros simples e compostos?', 'Nos simples, os juros incidem sempre sobre o capital inicial; nos compostos, também sobre os juros acumulados.'),
  jc(4, 'Quanto vale 12% ao ano em taxa mensal proporcional?', '1% ao mês (12 ÷ 12).'),
  jc(5, 'Como achar o capital conhecendo J, i e t?', 'C = J ÷ (i × t).'),
  jc(6, 'Erro comum nas contas de juros?', 'Usar a taxa em % (3) em vez de decimal (0,03) e misturar unidades de tempo e taxa.'),
]
export const MAT2_LESSONS = [OPER_LESSON, RAZAO_LESSON, TRES_LESSON, MEDIA_LESSON, JUROS_LESSON]
export const MAT2_QUESTIONS = spread([...OPER_QUESTIONS, ...RAZAO_QUESTIONS, ...TRES_QUESTIONS, ...MEDIA_QUESTIONS, ...JUROS_QUESTIONS], 1)
export const MAT2_CARDS = [...OPER_CARDS, ...RAZAO_CARDS, ...TRES_CARDS, ...MEDIA_CARDS, ...JUROS_CARDS]
