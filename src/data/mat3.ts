import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Matemática (Anexo VIII), parte 2: equações, sistemas, grandezas/tabelas/gráficos, medidas, geometria e situações-problema.
// Todas as contas foram conferidas por cálculo independente.

// ───────── mat-8
export const EQ_LESSON: Lesson = {
  id: 'mat-equacoes', topicId: 'mat-8', title: 'Equações do 1º e do 2º graus', questionIds: ['eq-1', 'eq-2', 'eq-3', 'eq-4', 'eq-5'],
  steps: [
    step('Entenda', ['Equação é uma igualdade com um valor desconhecido (incógnita). Resolver é achar o valor que torna a igualdade verdadeira.',
      'Equação do 1º grau (ax + b = 0): junte os termos com x de um lado e os números do outro, lembrando de trocar o sinal de quem muda de lado. 3x − 7 = 2x + 5 → 3x − 2x = 5 + 7 → x = 12.',
      'Equação do 2º grau (ax² + bx + c = 0, com a ≠ 0): usa-se a fórmula de Bhaskara, x = (−b ± √Δ) ÷ 2a, em que Δ = b² − 4ac. Se Δ > 0, há duas raízes reais diferentes; Δ = 0, uma raiz; Δ < 0, nenhuma raiz real. Atalhos: soma das raízes = −b/a e produto = c/a.'],
      'Imagine uma balança em equilíbrio: tudo o que você faz de um lado, faz do outro. Passar um número para o outro lado trocando o sinal é só um jeito rápido de dizer isso.'),
    step('Exemplo prático', ['Caso 1 — 1º grau: o dobro de um número, aumentado de 7, é 31. 2x + 7 = 31 → 2x = 24 → x = 12.',
      'Caso 2 — 2º grau incompleto: 2x² − 8 = 0 → x² = 4 → x = 2 ou x = −2 (a raiz quadrada tem dois sinais).',
      'Caso 3 — 2º grau completo: x² − 5x + 6 = 0. Δ = 25 − 24 = 1; x = (5 ± 1) ÷ 2 → x = 3 ou x = 2. Conferindo: soma = 5 (= −b/a) e produto = 6 (= c/a).',
      'Caso 4 — x² + 2x − 15 = 0. Δ = 4 + 60 = 64; x = (−2 ± 8) ÷ 2 → x = 3 ou x = −5. A raiz positiva é 3.'],
      'Na dúvida, teste a resposta: substitua o valor encontrado na equação original. Se a igualdade se mantiver, está certo.'),
    step('Resumo essencial', ['Fórmulas e atalhos.'], undefined, { caption: 'Equações', head: ['Tipo', 'Como resolver', 'Exemplo'], rows: [
      ['1º grau', 'Isolar x trocando o sinal ao mudar de lado', '3x − 7 = 2x + 5 → x = 12'],
      ['2º grau incompleto (b = 0)', 'x² = −c/a, tirar a raiz (±)', '2x² − 8 = 0 → x = ±2'],
      ['2º grau completo', 'Bhaskara: x = (−b ± √Δ) ÷ 2a', 'x² − 5x + 6 = 0 → 2 e 3'],
      ['Soma e produto', 'S = −b/a; P = c/a', 'x² − 5x + 6: S = 5, P = 6']] }),
    step('O que memorizar', ['• Δ = b² − 4ac; raízes: (−b ± √Δ) ÷ 2a.',
      '• Δ < 0: sem raízes reais. Δ = 0: uma raiz (dupla).',
      '• S = −b/a e P = c/a.',
      '• Ao tirar a raiz de x² = k (k > 0), há duas soluções: ±√k.',
      '• Problemas: traduza para equação ("o dobro de x" = 2x; "x a mais" = x + n).'] ),
  ],
}
const eq = mkQ('eq', 'mat-8')
export const EQ_QUESTIONS: Question[] = [
  eq(1, 'Se 3x − 7 = 2x + 5, o valor de x é', [
    o('A', '−2', 'Errada: resulta de somar 7 em vez de subtrair do lado oposto (3x − 2x = 5 − 7).'),
    o('B', '2', 'Errada: resulta de 7 − 5; o correto é 5 + 7.'),
    o('C', '5', 'Errada: é o termo independente do lado direito, não a solução.'),
    o('D', '12', 'Correta: 3x − 2x = 5 + 7, logo x = 12.'),
    o('E', '14', 'Errada: duplicou o 7 (7 + 7), sem usar o 5.')], 'D', 'Fácil'),
  eq(2, 'As raízes da equação x² − 5x + 6 = 0 são', [
    o('A', '−2 e −3', 'Errada: a soma das raízes deve ser +5, e aqui seria −5.'),
    o('B', '1 e 6', 'Errada: o produto é 6, mas a soma é 7 (e não 5).'),
    o('C', '2 e 3', 'Correta: Δ = 1; x = (5 ± 1) ÷ 2 → 3 e 2 (soma 5; produto 6).'),
    o('D', '−1 e −6', 'Errada: a soma seria −7.'),
    o('E', '5 e 6', 'Errada: a soma seria 11.')], 'C', 'Médio'),
  eq(3, 'As soluções da equação 2x² − 8 = 0 são', [
    o('A', 'apenas 2', 'Errada: esqueceu da raiz negativa, pois (−2)² também é 4.'),
    o('B', '2 e −2', 'Correta: x² = 4, logo x = 2 ou x = −2.'),
    o('C', '4 e −4', 'Errada: 4 é o valor de x², não de x.'),
    o('D', '√2 e −√2', 'Errada: x² = 4, e não 2.'),
    o('E', 'nenhuma solução real', 'Errada: x² = 4 tem solução real.')], 'B', 'Médio'),
  eq(4, 'O dobro de um número, aumentado de 7, é igual a 31. Esse número é', [
    o('A', '9', 'Errada: 2 × 9 + 7 = 25.'),
    o('B', '12', 'Correta: 2x + 7 = 31 → x = 12.'),
    o('C', '15', 'Errada: 2 × 15 + 7 = 37.'),
    o('D', '19', 'Errada: 2 × 19 + 7 = 45.'),
    o('E', '24', 'Errada: é o valor de 2x, e não de x.')], 'B', 'Fácil'),
  eq(5, 'A raiz positiva da equação x² + 2x − 15 = 0 é', [
    o('A', '1', 'Errada: 1 + 2 − 15 ≠ 0.'),
    o('B', '2', 'Errada: 4 + 4 − 15 ≠ 0.'),
    o('C', '3', 'Correta: Δ = 64; x = (−2 ± 8) ÷ 2 → 3 ou −5.'),
    o('D', '5', 'Errada: 25 + 10 − 15 = 20 ≠ 0 (a raiz −5 é a negativa).'),
    o('E', '15', 'Errada: é o valor de c em módulo, e não uma raiz.')], 'C', 'Médio'),
]
const ec = mkC('eq', 'mat-8', 'mat-equacoes')
export const EQ_CARDS: Flashcard[] = [
  ec(1, 'Qual a fórmula de Bhaskara?', 'x = (−b ± √Δ) ÷ 2a, com Δ = b² − 4ac.'),
  ec(2, 'O que o sinal do Δ informa?', 'Δ > 0: duas raízes reais; Δ = 0: uma raiz; Δ < 0: sem raízes reais.'),
  ec(3, 'Quais são a soma e o produto das raízes de ax² + bx + c = 0?', 'S = −b/a e P = c/a.'),
  ec(4, 'Quantas soluções tem x² = 4?', 'Duas: x = 2 e x = −2.'),
  ec(5, 'Como isolar x em uma equação do 1º grau?', 'Junte os termos com x de um lado e os números do outro, trocando o sinal de quem muda de lado.'),
  ec(6, 'Como verificar uma solução?', 'Substitua na equação original; a igualdade deve se manter.'),
]

// ───────── mat-9
export const SIST_LESSON: Lesson = {
  id: 'mat-sistemas', topicId: 'mat-9', title: 'Sistemas de equações do 1º grau', questionIds: ['sist-1', 'sist-2', 'sist-3', 'sist-4', 'sist-5'],
  steps: [
    step('Entenda', ['Um sistema é um conjunto de equações com as mesmas incógnitas. O sistema 2×2 mais comum tem duas equações e duas incógnitas (x e y), e a solução é o par de valores que satisfaz as duas ao mesmo tempo.',
      'Dois métodos resolvem quase tudo. ADIÇÃO: some (ou subtraia) as equações para eliminar uma incógnita. x + y = 10 e x − y = 2 → somando: 2x = 12 → x = 6; então y = 4. SUBSTITUIÇÃO: isole uma incógnita em uma equação e troque na outra.',
      'Em problemas, a parte difícil é traduzir o enunciado: escolha as incógnitas (o que a pergunta pede), escreva uma equação para cada informação e resolva.'],
      'É como dois pistas independentes sobre o mesmo mistério. Uma só não basta; juntas, elas "fecham" a resposta.'),
    step('Exemplo prático', ['Caso 1 — adição: x + y = 10 e x − y = 2 → x = 6 e y = 4.',
      'Caso 2: 2x + y = 11 e x − y = 1. Somando: 3x = 12 → x = 4; y = x − 1 = 3.',
      'Caso 3 — problema: uma caneta e um caderno custam R$ 12,00 juntos, e o caderno custa R$ 4,00 a mais que a caneta. c + (c + 4) = 12 → 2c = 8 → caneta R$ 4,00 e caderno R$ 8,00.',
      'Caso 4 — total e diferença: em um grupo de 35 pessoas, há 5 homens a mais que mulheres. h + m = 35 e h − m = 5 → h = 20 e m = 15.',
      'Caso 5 — subtração: 3 canetas e 2 cadernos custam R$ 26,00; 1 caneta e 2 cadernos custam R$ 14,00. Subtraindo: 2 canetas = R$ 12,00 → caneta R$ 6,00; então 2 cadernos = R$ 8,00 → caderno R$ 4,00.'],
      'Quando uma incógnita aparece com o mesmo coeficiente nas duas equações, subtrair elimina; quando aparece com sinais opostos, somar elimina.'),
    step('Resumo essencial', ['Escolha o método pela forma do sistema.'], undefined, { caption: 'Métodos', head: ['Método', 'Quando usar', 'Ideia'], rows: [
      ['Adição', 'Coeficientes iguais ou opostos', 'Somar/subtrair as equações para eliminar uma incógnita'],
      ['Substituição', 'Uma incógnita já isolada ou com coeficiente 1', 'Isolar e trocar na outra equação'],
      ['Problemas', 'Enunciado em texto', 'Definir incógnitas e montar uma equação por informação']] }),
    step('O que memorizar', ['• Sistema 2×2: duas equações, duas incógnitas.',
      '• Adição: eliminar uma incógnita somando/subtraindo.',
      '• Substituição: isolar e trocar.',
      '• Sempre confira a solução nas duas equações.',
      '• Em problemas, responda ao que foi pedido (muitas vezes é só uma das incógnitas).'] ),
  ],
}
const sq = mkQ('sist', 'mat-9')
export const SIST_QUESTIONS: Question[] = [
  sq(1, 'Se x + y = 10 e x − y = 2, o valor de x é', [
    o('A', '2', 'Errada: é o valor de x − y.'),
    o('B', '4', 'Errada: é o valor de y (4), e não de x.'),
    o('C', '5', 'Errada: seria o valor se x = y.'),
    o('D', '6', 'Correta: somando as equações, 2x = 12 → x = 6 (e y = 4).'),
    o('E', '12', 'Errada: é a soma das equações (2x), e não x.')], 'D', 'Fácil'),
  sq(2, 'Se 2x + y = 11 e x − y = 1, o valor de y é', [
    o('A', '1', 'Errada: é o valor de x − y.'),
    o('B', '2', 'Errada: não satisfaz as duas equações (x = 3; 2 × 3 + 2 = 8).'),
    o('C', '3', 'Correta: somando, 3x = 12 → x = 4; y = x − 1 = 3.'),
    o('D', '4', 'Errada: é o valor de x.'),
    o('E', '5', 'Errada: com y = 5, x = 6 e 2 × 6 + 5 = 17 ≠ 11.')], 'C', 'Médio'),
  sq(3, 'Uma caneta e um caderno custam, juntos, R$ 12,00. O caderno custa R$ 4,00 a mais que a caneta. O preço do caderno é', [
    o('A', 'R$ 4,00', 'Errada: é o preço da caneta.'),
    o('B', 'R$ 6,00', 'Errada: é a metade do total; os preços diferem em R$ 4,00.'),
    o('C', 'R$ 7,00', 'Errada: com caderno R$ 7,00, a caneta seria R$ 5,00 e a diferença, R$ 2,00.'),
    o('D', 'R$ 8,00', 'Correta: c + (c + 4) = 12 → c = 4; caderno = 8.'),
    o('E', 'R$ 12,00', 'Errada: é o total das duas peças.')], 'D', 'Médio'),
  sq(4, 'Em um grupo de 35 pessoas, o número de homens excede em 5 o número de mulheres. O número de mulheres é', [
    o('A', '10', 'Errada: com 10 mulheres, seriam 15 homens (25 no total).'),
    o('B', '15', 'Correta: h + m = 35 e h = m + 5 → 2m + 5 = 35 → m = 15.'),
    o('C', '17', 'Errada: com 17 mulheres, seriam 22 homens (39 no total).'),
    o('D', '20', 'Errada: é o número de homens.'),
    o('E', '30', 'Errada: com 30 mulheres, seriam 35 homens (65 no total).')], 'B', 'Médio'),
  sq(5, 'Três canetas e dois cadernos custam R$ 26,00; uma caneta e dois cadernos custam R$ 14,00. O preço de um caderno é', [
    o('A', 'R$ 3,00', 'Errada: com caderno R$ 3,00, a caneta seria R$ 8,00 e 3 canetas + 2 cadernos custariam R$ 30,00.'),
    o('B', 'R$ 4,00', 'Correta: subtraindo as equações, 2 canetas = 12 → caneta = 6; 2 cadernos = 14 − 6 = 8 → caderno = 4.'),
    o('C', 'R$ 5,00', 'Errada: com caderno R$ 5,00, a caneta seria R$ 4,00 e o total da 1ª compra, R$ 22,00.'),
    o('D', 'R$ 6,00', 'Errada: é o preço da caneta.'),
    o('E', 'R$ 8,00', 'Errada: é o preço dos dois cadernos.')], 'B', 'Difícil'),
]
const sc = mkC('sist', 'mat-9', 'mat-sistemas')
export const SIST_CARDS: Flashcard[] = [
  sc(1, 'O que é a solução de um sistema 2×2?', 'O par (x, y) que satisfaz as duas equações ao mesmo tempo.'),
  sc(2, 'Como funciona o método da adição?', 'Somar ou subtrair as equações para eliminar uma incógnita; resolva a outra e volte para achar a primeira.'),
  sc(3, 'Como funciona o método da substituição?', 'Isole uma incógnita em uma equação e substitua na outra.'),
  sc(4, 'Como montar um problema de "total e diferença"?', 'x + y = total e x − y = diferença; somando, 2x = total + diferença.'),
  sc(5, 'Como conferir a solução?', 'Substitua os valores nas duas equações originais.'),
  sc(6, 'Quando somar e quando subtrair as equações?', 'Soma elimina quando os coeficientes são opostos; subtração elimina quando são iguais.'),
]

// ───────── mat-10
export const GRAND_LESSON: Lesson = {
  id: 'mat-grandezas', topicId: 'mat-10', title: 'Relação entre grandezas: tabelas e gráficos', questionIds: ['grand-1', 'grand-2', 'grand-3', 'grand-4', 'grand-5'],
  steps: [
    step('Entenda', ['Grandeza é tudo o que se pode medir ou contar (preço, tempo, número de processos). Duas grandezas podem ser relacionadas de formas diferentes, e tabelas e gráficos mostram essa relação.',
      'DIRETAMENTE PROPORCIONAIS: quando uma dobra, a outra dobra; a razão entre elas é constante (y/x = k). INVERSAMENTE PROPORCIONAIS: quando uma dobra, a outra cai pela metade; o PRODUTO entre elas é constante (x × y = k). Nem toda relação é proporcional: pode haver crescimento constante com ponto inicial (preço fixo + preço por unidade).',
      'Como ler tabelas e gráficos na prova: (1) leia título e unidades; (2) localize os valores pedidos; (3) calcule diferenças (variação), razões ou porcentagens; (4) cuidado com eixos que não começam do zero e com unidades diferentes.'],
      'Teste da razão: divida y por x em cada linha da tabela. Se o resultado for sempre o mesmo, é direta. Teste do produto: multiplique x por y; se for sempre o mesmo, é inversa.'),
    step('Exemplo prático', ['Caso 1 — variação percentual: vendas de 120 em janeiro e 150 em fevereiro. Variação = (150 − 120) ÷ 120 = 0,25 = 25%.',
      'Caso 2 — direta: x = 2, 4, 6 e y = 10, 20, ? → y/x = 5, então o próximo valor é 6 × 5 = 30.',
      'Caso 3 — inversa: x = 2, 4, 8 e y = 40, 20, ? → x × y = 80, então o próximo valor é 80 ÷ 8 = 10.',
      'Caso 4 — participação: três varas têm 40, 60 e 100 processos (total 200). A vara C tem 100 ÷ 200 = 50% do total.',
      'Caso 5 — gráfico de linha com crescimento constante: pontos (mês 1; 30), (mês 2; 45), (mês 3; 60). A variação mensal é 15; no mês 5, o valor é 30 + 4 × 15 = 90.'],
      'Variação percentual é sempre (valor final − valor inicial) ÷ valor inicial. A base da conta é o valor inicial.'),
    step('Resumo essencial', ['Como identificar o tipo de relação.'], undefined, { caption: 'Relações entre grandezas', head: ['Relação', 'Teste', 'Exemplo'], rows: [
      ['Diretamente proporcional', 'y ÷ x constante', '2→10, 4→20, 6→30'],
      ['Inversamente proporcional', 'x × y constante', '2→40, 4→20, 8→10'],
      ['Crescimento constante (linear)', 'Diferenças iguais', '30, 45, 60, 75, 90'],
      ['Variação percentual', '(final − inicial) ÷ inicial', '120 → 150 = +25%']] }),
    step('O que memorizar', ['• Direta: razão constante; inversa: produto constante.',
      '• Variação percentual: divida a variação pelo valor INICIAL.',
      '• Participação percentual: parte ÷ total.',
      '• Leia unidades e título antes de calcular.',
      '• Cuidado com eixos que não começam no zero: eles distorcem a impressão visual.'] ),
  ],
}
const gq = mkQ('grand', 'mat-10')
export const GRAND_QUESTIONS: Question[] = [
  gq(1, 'As vendas de uma loja foram de 120 unidades em janeiro e de 150 unidades em fevereiro. De janeiro para fevereiro, as vendas aumentaram', [
    o('A', '20%', 'Errada: 30 ÷ 150 = 20% usa o valor final como base; a base correta é o valor inicial (120).'),
    o('B', '25%', 'Correta: (150 − 120) ÷ 120 = 0,25.'),
    o('C', '30%', 'Errada: 30 é o aumento em unidades, e não em porcentagem.'),
    o('D', '33%', 'Errada: não resulta da conta correta (30 ÷ 120 = 25%).'),
    o('E', '80%', 'Errada: é a razão 120/150 (o inverso).')], 'B', 'Médio'),
  gq(2, 'Observe a relação entre x e y: (x = 2, y = 10), (x = 4, y = 20), (x = 6, y = ?). Se as grandezas são diretamente proporcionais, o valor de y é', [
    o('A', '24', 'Errada: a razão y/x deve ser sempre 5; 24/6 = 4.'),
    o('B', '26', 'Errada: 26/6 não é igual a 5.'),
    o('C', '28', 'Errada: 28/6 não é igual a 5.'),
    o('D', '30', 'Correta: y/x = 5 em todas as linhas; 6 × 5 = 30.'),
    o('E', '60', 'Errada: é o produto 6 × 10, e não a proporção constante.')], 'D', 'Fácil'),
  gq(3, 'Observe a relação entre x e y: (x = 2, y = 40), (x = 4, y = 20), (x = 8, y = ?). Se as grandezas são inversamente proporcionais, o valor de y é', [
    o('A', '5', 'Errada: 8 × 5 = 40, e o produto constante é 80.'),
    o('B', '8', 'Errada: 8 × 8 = 64 ≠ 80.'),
    o('C', '10', 'Correta: x × y = 80; 80 ÷ 8 = 10.'),
    o('D', '16', 'Errada: 8 × 16 = 128 ≠ 80.'),
    o('E', '80', 'Errada: é o produto constante, e não o valor de y.')], 'C', 'Médio'),
  gq(4, 'A tabela mostra o número de processos de três varas: A = 40, B = 60 e C = 100. A vara C concentra, do total, a porcentagem de', [
    o('A', '20%', 'Errada: 20% de 200 seriam 40, valor da vara A.'),
    o('B', '30%', 'Errada: 30% de 200 seriam 60, valor da vara B.'),
    o('C', '40%', 'Errada: 40% de 200 seriam 80.'),
    o('D', '50%', 'Correta: o total é 200 e 100 ÷ 200 = 0,5.'),
    o('E', '100%', 'Errada: 100 é a quantidade, e não a porcentagem.')], 'D', 'Fácil'),
  gq(5, 'Em um gráfico de linha, o número de atendimentos foi de 30 no mês 1, 45 no mês 2 e 60 no mês 3, crescendo sempre na mesma quantidade por mês. No mês 5, o número de atendimentos será', [
    o('A', '75', 'Errada: é o valor do mês 4.'),
    o('B', '80', 'Errada: não segue o aumento constante de 15.'),
    o('C', '85', 'Errada: não segue o aumento constante de 15.'),
    o('D', '90', 'Correta: aumento de 15 por mês; 30 + 4 × 15 = 90.'),
    o('E', '120', 'Errada: seria o valor se o crescimento dobrasse a cada mês, o que não ocorre.')], 'D', 'Médio'),
]
const gc = mkC('grand', 'mat-10', 'mat-grandezas')
export const GRAND_CARDS: Flashcard[] = [
  gc(1, 'Como reconhecer grandezas diretamente proporcionais em uma tabela?', 'A razão y ÷ x é sempre a mesma.'),
  gc(2, 'Como reconhecer grandezas inversamente proporcionais?', 'O produto x × y é sempre o mesmo.'),
  gc(3, 'Como calcular variação percentual?', '(valor final − valor inicial) ÷ valor inicial. Ex.: 120 → 150 = +25%.'),
  gc(4, 'Como calcular a participação de uma parte no total?', 'parte ÷ total (× 100 para porcentagem).'),
  gc(5, 'O que fazer primeiro ao ler uma tabela ou gráfico?', 'Ler título, unidades e legendas antes de calcular.'),
  gc(6, 'Por que desconfiar de eixos que não começam no zero?', 'Eles exageram visualmente as diferenças entre os valores.'),
]

// ───────── mat-11
export const MED_LESSON: Lesson = {
  id: 'mat-medidas', topicId: 'mat-11', title: 'Sistemas de medidas usuais', questionIds: ['med-1', 'med-2', 'med-3', 'med-4', 'med-5'],
  steps: [
    step('Entenda', ['Medir é comparar com uma unidade padrão. No Sistema Métrico Decimal, as unidades de comprimento (metro), massa (grama) e capacidade (litro) mudam de 10 em 10 com os prefixos: quilo (1.000), hecto (100), deca (10), deci (0,1), centi (0,01), mili (0,001).',
      'Tempo não é decimal: 1 h = 60 min; 1 min = 60 s; 1 dia = 24 h. Volume: 1 m³ = 1.000 litros; 1 dm³ = 1 litro; 1 cm³ = 1 mL. Áreas e volumes mudam de unidade com fatores ao quadrado e ao cubo (1 m² = 10.000 cm²; 1 m³ = 1.000.000 cm³).',
      'Regra prática: ao passar para uma unidade MENOR, o número fica MAIOR (multiplique); ao passar para uma unidade MAIOR, o número fica MENOR (divida).'],
      'Imagine uma escada: cada degrau do metro (km, hm, dam, m, dm, cm, mm) vale 10 vezes o seguinte. Descendo, você multiplica; subindo, você divide.'),
    step('Exemplo prático', ['Caso 1: 2,5 km em metros = 2,5 × 1.000 = 2.500 m.',
      'Caso 2: 0,75 kg em gramas = 0,75 × 1.000 = 750 g.',
      'Caso 3: 3 h 45 min em minutos = 3 × 60 + 45 = 225 min.',
      'Caso 4: um reservatório de 3 m × 2 m × 1 m tem volume 6 m³ = 6.000 litros.',
      'Caso 5: 1,5 L em mL = 1.500 mL; 250 mL = 0,25 L.'],
      'Em problemas de tempo, converta tudo para uma única unidade (minutos ou segundos) antes de somar ou subtrair.'),
    step('Resumo essencial', ['Conversões frequentes.'], undefined, { caption: 'Conversões', head: ['Grandeza', 'Relação', 'Exemplo'], rows: [
      ['Comprimento', '1 km = 1.000 m; 1 m = 100 cm', '2,5 km = 2.500 m'],
      ['Massa', '1 kg = 1.000 g; 1 t = 1.000 kg', '0,75 kg = 750 g'],
      ['Capacidade', '1 L = 1.000 mL', '1,5 L = 1.500 mL'],
      ['Volume', '1 m³ = 1.000 L; 1 dm³ = 1 L', '6 m³ = 6.000 L'],
      ['Tempo', '1 h = 60 min; 1 min = 60 s', '3 h 45 min = 225 min']] }),
    step('O que memorizar', ['• km → m: × 1.000; m → cm: × 100; kg → g: × 1.000; L → mL: × 1.000.',
      '• Tempo é sexagesimal: 60 min, 60 s (não é de 10 em 10).',
      '• 1 m³ = 1.000 L; 1 dm³ = 1 L.',
      '• Para unidade menor, multiplique; para maior, divida.',
      '• Converta tudo para a mesma unidade antes de calcular.'] ),
  ],
}
const mq = mkQ('med', 'mat-11')
export const MED_QUESTIONS: Question[] = [
  mq(1, 'A distância de 2,5 km corresponde, em metros, a', [
    o('A', '25 m', 'Errada: multiplicou por 10 em vez de 1.000.'),
    o('B', '250 m', 'Errada: multiplicou por 100 em vez de 1.000.'),
    o('C', '2.500 m', 'Correta: 2,5 × 1.000 = 2.500.'),
    o('D', '25.000 m', 'Errada: multiplicou por 10.000.'),
    o('E', '0,0025 m', 'Errada: dividiu por 1.000 em vez de multiplicar.')], 'C', 'Fácil'),
  mq(2, 'O intervalo de 3 horas e 45 minutos equivale, em minutos, a', [
    o('A', '135', 'Errada: é 2 h 15 min (135 = 2 × 60 + 15).'),
    o('B', '195', 'Errada: é 3 h 15 min.'),
    o('C', '215', 'Errada: é 3 h 35 min (3 × 60 + 35).'),
    o('D', '225', 'Correta: 3 × 60 + 45 = 225.'),
    o('E', '345', 'Errada: é 5 h 45 min (5 × 60 + 45).')], 'D', 'Fácil'),
  mq(3, 'Um pacote tem 0,75 kg. Em gramas, sua massa é', [
    o('A', '7,5 g', 'Errada: multiplicou por 10 em vez de 1.000.'),
    o('B', '75 g', 'Errada: multiplicou por 100 em vez de 1.000.'),
    o('C', '750 g', 'Correta: 0,75 × 1.000 = 750.'),
    o('D', '7.500 g', 'Errada: multiplicou por 10.000.'),
    o('E', '0,00075 g', 'Errada: dividiu por 1.000 em vez de multiplicar.')], 'C', 'Fácil'),
  mq(4, 'Um reservatório com 3 m de comprimento, 2 m de largura e 1 m de altura tem capacidade, em litros, de', [
    o('A', '6 L', 'Errada: 6 é o volume em m³, não em litros.'),
    o('B', '60 L', 'Errada: considerou 1 m³ = 10 L.'),
    o('C', '600 L', 'Errada: considerou 1 m³ = 100 L.'),
    o('D', '6.000 L', 'Correta: 3 × 2 × 1 = 6 m³; 1 m³ = 1.000 L.'),
    o('E', '60.000 L', 'Errada: considerou 1 m³ = 10.000 L.')], 'D', 'Médio'),
  mq(5, 'Uma garrafa tem 1,5 litro de suco. Quantas doses de 250 mL podem ser servidas com ela?', [
    o('A', '4', 'Errada: 4 doses somam 1.000 mL.'),
    o('B', '5', 'Errada: 5 doses somam 1.250 mL.'),
    o('C', '6', 'Correta: 1,5 L = 1.500 mL; 1.500 ÷ 250 = 6.'),
    o('D', '7', 'Errada: 7 doses exigiriam 1.750 mL.'),
    o('E', '15', 'Errada: 15 doses exigiriam 3.750 mL.')], 'C', 'Médio'),
]
const mc = mkC('med', 'mat-11', 'mat-medidas')
export const MED_CARDS: Flashcard[] = [
  mc(1, 'Quantos metros tem 1 km? E centímetros tem 1 m?', '1 km = 1.000 m; 1 m = 100 cm.'),
  mc(2, 'Quantos litros tem 1 m³?', '1.000 litros (1 dm³ = 1 litro).'),
  mc(3, 'Tempo é decimal?', 'Não: 1 h = 60 min e 1 min = 60 s.'),
  mc(4, 'Ao passar para unidade menor, multiplica ou divide?', 'Multiplica (o número fica maior). Para unidade maior, divide.'),
  mc(5, 'Como converter 3 h 45 min em minutos?', '3 × 60 + 45 = 225 min.'),
  mc(6, 'Quanto vale 1 kg em gramas?', '1.000 g.'),
]

// ───────── mat-12
export const GEO_LESSON: Lesson = {
  id: 'mat-geometria', topicId: 'mat-12', title: 'Noções de geometria: perímetro, área, volume, ângulo e Pitágoras', questionIds: ['geo-1', 'geo-2', 'geo-3', 'geo-4', 'geo-5'],
  steps: [
    step('Entenda', ['PERÍMETRO é a soma dos lados (o "contorno"), medido em unidade de comprimento. ÁREA é a medida da superfície, em unidade quadrada. VOLUME é o espaço ocupado por um sólido, em unidade cúbica.',
      'Fórmulas principais: retângulo (área = base × altura; perímetro = 2 × (base + altura)); quadrado (área = lado²); triângulo (área = base × altura ÷ 2); paralelepípedo/caixa (volume = comprimento × largura × altura); cubo (volume = aresta³).',
      'ÂNGULOS: a soma dos ângulos internos de um triângulo é 180°; ângulo reto = 90°; ângulos suplementares somam 180° e complementares, 90°. PITÁGORAS: em um triângulo retângulo, a² + b² = c², em que c é a hipotenusa (o lado oposto ao ângulo reto) e a e b são os catetos.'],
      'Perímetro é a cerca ao redor do terreno; área é a grama dentro; volume é a água que cabe na piscina. Unidades diferentes: m, m², m³.'),
    step('Exemplo prático', ['Caso 1 — perímetro: retângulo de 8 m × 5 m → 2 × (8 + 5) = 26 m.',
      'Caso 2 — área do triângulo: base 10 m e altura 6 m → 10 × 6 ÷ 2 = 30 m².',
      'Caso 3 — Pitágoras: catetos 6 e 8 → c² = 36 + 64 = 100 → c = 10 (terno pitagórico 6-8-10; o mais famoso é 3-4-5).',
      'Caso 4 — volume: caixa de 4 m × 3 m × 2 m → 24 m³.',
      'Caso 5 — ângulos: em um triângulo com ângulos de 50° e 60°, o terceiro mede 180° − 110° = 70°.'],
      'Em Pitágoras, quem tem o "quadrado maior" é a hipotenusa: ela é sempre o maior lado do triângulo retângulo. Os catetos formam o ângulo reto.'),
    step('Resumo essencial', ['Fórmulas e unidades.'], undefined, { caption: 'Fórmulas', head: ['Figura', 'Fórmula', 'Unidade'], rows: [
      ['Retângulo', 'Área = b × h; Perímetro = 2(b + h)', 'm², m'],
      ['Quadrado', 'Área = l²; Perímetro = 4l', 'm², m'],
      ['Triângulo', 'Área = b × h ÷ 2', 'm²'],
      ['Caixa (paralelepípedo)', 'Volume = c × l × h', 'm³'],
      ['Triângulo retângulo', 'a² + b² = c²', '—'],
      ['Ângulos de um triângulo', 'Soma = 180°', '°']] }),
    step('O que memorizar', ['• Perímetro (soma dos lados), área (superfície), volume (espaço): unidades m, m², m³.',
      '• Área do triângulo = base × altura ÷ 2.',
      '• Pitágoras: hipotenusa² = cateto² + cateto². Ternos: 3-4-5; 6-8-10; 5-12-13.',
      '• Soma dos ângulos internos de um triângulo = 180°.',
      '• Volume de caixa = comprimento × largura × altura.'] ),
  ],
}
const goq = mkQ('geo', 'mat-12')
export const GEO_QUESTIONS: Question[] = [
  goq(1, 'O perímetro de um retângulo de 8 m de comprimento e 5 m de largura é', [
    o('A', '13 m', 'Errada: é a soma de apenas um comprimento e uma largura.'),
    o('B', '26 m', 'Correta: 2 × (8 + 5) = 26.'),
    o('C', '18 m', 'Errada: 8 + 5 + 5 = 18; faltou somar um dos lados.'),
    o('D', '40 m²', 'Errada: é a área, e não o perímetro.'),
    o('E', '80 m', 'Errada: não corresponde a nenhuma fórmula do retângulo.')], 'B', 'Fácil'),
  goq(2, 'A área de um triângulo com base de 10 m e altura de 6 m é', [
    o('A', '16 m²', 'Errada: é a soma da base e da altura.'),
    o('B', '30 m²', 'Correta: 10 × 6 ÷ 2 = 30.'),
    o('C', '60 m²', 'Errada: esqueceu de dividir por 2.'),
    o('D', '32 m²', 'Errada: não corresponde a base × altura ÷ 2.'),
    o('E', '120 m²', 'Errada: multiplicou por 2 em vez de dividir.')], 'B', 'Fácil'),
  goq(3, 'Em um triângulo retângulo, os catetos medem 6 cm e 8 cm. A hipotenusa mede', [
    o('A', '7 cm', 'Errada: é a média dos catetos, e não a hipotenusa.'),
    o('B', '10 cm', 'Correta: 6² + 8² = 36 + 64 = 100; √100 = 10.'),
    o('C', '12 cm', 'Errada: não corresponde ao resultado de √(6² + 8²).'),
    o('D', '14 cm', 'Errada: é a soma dos catetos; a hipotenusa é menor que isso.'),
    o('E', '100 cm', 'Errada: é o quadrado da hipotenusa, faltou a raiz.')], 'B', 'Médio'),
  goq(4, 'Uma caixa com 4 m de comprimento, 3 m de largura e 2 m de altura tem volume de', [
    o('A', '9 m³', 'Errada: é a soma das dimensões.'),
    o('B', '14 m³', 'Errada: não corresponde ao produto das dimensões.'),
    o('C', '24 m³', 'Correta: 4 × 3 × 2 = 24.'),
    o('D', '24 m²', 'Errada: o volume é medido em m³, e não em m².'),
    o('E', '48 m³', 'Errada: dobrou o resultado correto.')], 'C', 'Fácil'),
  goq(5, 'Em um triângulo, dois ângulos internos medem 50° e 60°. O terceiro ângulo interno mede', [
    o('A', '60°', 'Errada: a soma dos três ângulos seria 170°.'),
    o('B', '70°', 'Correta: 180° − (50° + 60°) = 70°.'),
    o('C', '80°', 'Errada: a soma seria 190°.'),
    o('D', '110°', 'Errada: é a soma dos dois ângulos dados.'),
    o('E', '130°', 'Errada: é o suplemento de 50°, e não o terceiro ângulo.')], 'B', 'Fácil'),
]
const goc = mkC('geo', 'mat-12', 'mat-geometria')
export const GEO_CARDS: Flashcard[] = [
  goc(1, 'Diferença entre perímetro, área e volume?', 'Perímetro: soma dos lados (m). Área: superfície (m²). Volume: espaço ocupado (m³).'),
  goc(2, 'Qual a área do triângulo?', 'base × altura ÷ 2.'),
  goc(3, 'Enuncie o teorema de Pitágoras.', 'No triângulo retângulo, hipotenusa² = cateto² + cateto².'),
  goc(4, 'Quanto soma os ângulos internos de um triângulo?', '180°.'),
  goc(5, 'Qual o volume de uma caixa?', 'comprimento × largura × altura.'),
  goc(6, 'Cite ternos pitagóricos comuns.', '3-4-5, 6-8-10, 5-12-13.'),
]

// ───────── mat-13
export const SITU_LESSON: Lesson = {
  id: 'mat-situacoes', topicId: 'mat-13', title: 'Resolução de situações-problema', questionIds: ['situ-1', 'situ-2', 'situ-3', 'situ-4', 'situ-5'],
  steps: [
    step('Entenda', ['Situação-problema é um texto que mistura contexto do dia a dia com matemática. O segredo não é a conta, e sim a tradução: transformar palavras em equações.',
      'Método em 4 passos: (1) LER e identificar o que é pedido; (2) DEFINIR a incógnita (o que vale x?); (3) MONTAR a equação ou o esquema com os dados; (4) RESOLVER e CONFERIR se a resposta faz sentido (e se responde à pergunta, com a unidade certa).',
      'Alguns padrões frequentes: idades (relação entre pessoas), trabalho em conjunto (somar taxas: 1/tempo de cada um), frações de um todo (2/5 de 150), porcentagem inversa (descobrir o total a partir da parte) e troco (valor pago − valor gasto).'],
      'Se travar, tente números pequenos e um desenho. Quase todo problema vira "total = soma das partes" ou "parte = fração × total".'),
    step('Exemplo prático', ['Caso 1 — idades: a idade do pai é o triplo da idade do filho e a soma é 48. f + 3f = 48 → f = 12; pai = 36.',
      'Caso 2 — troco: 3 itens de R$ 12,50, pagos com R$ 50,00. Gasto = 37,50; troco = 12,50.',
      'Caso 3 — trabalho em conjunto: uma torneira enche um tanque em 6 h e outra em 3 h. Em 1 hora, elas enchem 1/6 + 1/3 = 1/2 do tanque; juntas, levam 2 h.',
      'Caso 4 — fração: um servidor leu 2/5 de um documento de 150 páginas: 2/5 × 150 = 60 páginas lidas; faltam 90.',
      'Caso 5 — porcentagem: 60% de um grupo são mulheres e há 24 homens. Homens = 40%; 40% do total = 24 → total = 60.'],
      'Tarefa em conjunto: some as "velocidades" (parte do trabalho por hora), e não os tempos.'),
    step('Resumo essencial', ['Padrões e como reagir.'], undefined, { caption: 'Padrões frequentes', head: ['Situação', 'Como montar', 'Exemplo'], rows: [
      ['Idades/soma e razão', 'Incógnita + relação + soma', 'f + 3f = 48'],
      ['Trabalho em conjunto', 'Somar 1/tempo de cada um', '1/6 + 1/3 = 1/2 → 2 h'],
      ['Fração de um total', 'fração × total', '2/5 × 150 = 60'],
      ['Total pela parte percentual', 'parte ÷ percentual', '24 ÷ 0,40 = 60'],
      ['Troco', 'valor pago − valor gasto', '50 − 37,50 = 12,50']] }),
    step('O que memorizar', ['• Passos: ler, definir a incógnita, montar, resolver, conferir.',
      '• Trabalho em conjunto: some as taxas (1/tempo).',
      '• Parte = fração × total; total = parte ÷ fração.',
      '• Responda exatamente ao que foi pedido (não pare na incógnita intermediária).',
      '• Confira unidade e plausibilidade (um tempo de trabalho conjunto é menor que o de cada um).'] ),
  ],
}
const sq2 = mkQ('situ', 'mat-13')
export const SITU_QUESTIONS: Question[] = [
  sq2(1, 'A idade de um pai é o triplo da idade de seu filho e a soma das idades dos dois é 48 anos. A idade do pai é', [
    o('A', '12 anos', 'Errada: é a idade do filho.'),
    o('B', '24 anos', 'Errada: é a metade da soma; o pai tem o triplo do filho.'),
    o('C', '32 anos', 'Errada: com pai de 32, o filho teria 16 e a razão não seria 3.'),
    o('D', '36 anos', 'Correta: f + 3f = 48 → f = 12; pai = 36.'),
    o('E', '48 anos', 'Errada: é a soma das idades.')], 'D', 'Médio'),
  sq2(2, 'Uma pessoa comprou 3 itens de R$ 12,50 cada e pagou com uma nota de R$ 50,00. O troco recebido foi de', [
    o('A', 'R$ 7,50', 'Errada: seria o troco se gastasse R$ 42,50.'),
    o('B', 'R$ 12,50', 'Correta: 3 × 12,50 = 37,50; 50 − 37,50 = 12,50.'),
    o('C', 'R$ 15,00', 'Errada: seria o troco se gastasse R$ 35,00.'),
    o('D', 'R$ 37,50', 'Errada: é o valor gasto, e não o troco.'),
    o('E', 'R$ 62,50', 'Errada: somou o valor pago com o gasto em vez de subtrair.')], 'B', 'Fácil'),
  sq2(3, 'Uma torneira enche um tanque em 6 horas e outra, sozinha, o enche em 3 horas. Funcionando juntas, elas enchem o tanque em', [
    o('A', '1 hora', 'Errada: em 1 hora enchem apenas 1/2 do tanque.'),
    o('B', '2 horas', 'Correta: 1/6 + 1/3 = 1/2 por hora; levam 2 horas.'),
    o('C', '3 horas', 'Errada: é o tempo da torneira mais rápida sozinha.'),
    o('D', '4,5 horas', 'Errada: é a média dos tempos, o que não vale para trabalho em conjunto.'),
    o('E', '9 horas', 'Errada: é a soma dos tempos; juntas, levam menos que a mais rápida sozinha.')], 'B', 'Difícil'),
  sq2(4, 'Um servidor leu 2/5 de um documento de 150 páginas. O número de páginas que ainda faltam ler é', [
    o('A', '30', 'Errada: 150 ÷ 5 = 30 é 1/5 do documento.'),
    o('B', '60', 'Errada: são as páginas já lidas (2/5 de 150).'),
    o('C', '75', 'Errada: é a metade do documento.'),
    o('D', '90', 'Correta: 2/5 × 150 = 60 lidas; 150 − 60 = 90.'),
    o('E', '120', 'Errada: é 4/5 do documento.')], 'D', 'Médio'),
  sq2(5, 'Em um grupo, 60% das pessoas são mulheres e os 24 homens são os demais. O total de pessoas do grupo é', [
    o('A', '36', 'Errada: 40% de 36 é 14,4.'),
    o('B', '40', 'Errada: 40% de 40 é 16.'),
    o('C', '48', 'Errada: 40% de 48 é 19,2.'),
    o('D', '60', 'Correta: homens = 40%; 24 ÷ 0,40 = 60.'),
    o('E', '84', 'Errada: 40% de 84 é 33,6.')], 'D', 'Médio'),
]
const sc2 = mkC('situ', 'mat-13', 'mat-situacoes')
export const SITU_CARDS: Flashcard[] = [
  sc2(1, 'Quais os 4 passos para resolver uma situação-problema?', 'Ler (o que se pede), definir a incógnita, montar a equação/esquema, resolver e conferir.'),
  sc2(2, 'Como resolver "trabalho em conjunto"?', 'Some as partes feitas por hora (1/tempo de cada um) e inverta o resultado.'),
  sc2(3, 'Como achar o total conhecendo a parte e a porcentagem?', 'total = parte ÷ percentual (em decimal). 24 ÷ 0,40 = 60.'),
  sc2(4, 'Como calcular "2/5 de 150"?', 'Multiplique: 2/5 × 150 = 60.'),
  sc2(5, 'Como conferir a resposta?', 'Veja se responde ao que foi pedido, se a unidade está certa e se o resultado é plausível.'),
  sc2(6, 'Qual o erro mais comum em problemas de torneiras/tarefas juntas?', 'Somar os tempos ou tirar a média dos tempos, em vez de somar as taxas.'),
]
export const MAT3_LESSONS = [EQ_LESSON, SIST_LESSON, GRAND_LESSON, MED_LESSON, GEO_LESSON, SITU_LESSON]
export const MAT3_QUESTIONS = spread([...EQ_QUESTIONS, ...SIST_QUESTIONS, ...GRAND_QUESTIONS, ...MED_QUESTIONS, ...GEO_QUESTIONS, ...SITU_QUESTIONS], 2)
export const MAT3_CARDS = [...EQ_CARDS, ...SIST_CARDS, ...GRAND_CARDS, ...MED_CARDS, ...GEO_CARDS, ...SITU_CARDS]
