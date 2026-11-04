import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Raciocínio Lógico (Anexo VIII): rl-2 lógicas de argumentação e rl-4 sequências.

export const ARG_LESSON: Lesson = {
  id: 'rl-argumentacao', topicId: 'rl-2', title: 'Lógicas de argumentação: validade e falácias', questionIds: ['arg-1', 'arg-2', 'arg-3', 'arg-4', 'arg-5'],
  steps: [
    step('Entenda', ['Um argumento é um conjunto de premissas (afirmações dadas) e uma conclusão. Ele é VÁLIDO quando, supondo as premissas verdadeiras, a conclusão tem de ser verdadeira. Validade é sobre a FORMA do raciocínio, não sobre o mundo real: um argumento pode ser válido com premissas falsas.',
      'Formas válidas que mais caem: MODUS PONENS (p → q; p; logo q); MODUS TOLLENS (p → q; ¬q; logo ¬p); SILOGISMO HIPOTÉTICO (p → q; q → r; logo p → r); SILOGISMO DISJUNTIVO (p ou q; ¬p; logo q).',
      'Falácias clássicas (formas inválidas): AFIRMAÇÃO DO CONSEQUENTE (p → q; q; logo p) e NEGAÇÃO DO ANTECEDENTE (p → q; ¬p; logo ¬q). Saber que "choveu → rua molhada" e que a rua está molhada não prova que choveu: ela pode ter sido lavada.'],
      'Para testar um argumento, tente imaginar uma situação em que as premissas são verdadeiras e a conclusão é falsa. Se conseguir, o argumento é inválido.'),
    step('Exemplo prático', ['Caso 1 — modus tollens: "Se chove, a rua fica molhada. A rua não está molhada." Conclusão válida: não choveu.',
      'Caso 2 — falácia: "Se estudo, passo. Passei." Concluir que estudei é inválido (pode ter passado sem estudar).',
      'Caso 3 — hipotético: "Se A, então B. Se B, então C." Conclusão válida: se A, então C.',
      'Caso 4 — disjuntivo: "Ana ou Bia foi à reunião. Ana não foi." Conclusão válida: Bia foi.',
      'Caso 5 — válido ≠ verdadeiro: "Todos os gatos voam. Tom é um gato. Logo, Tom voa." A forma é válida, mas a primeira premissa é falsa; o argumento é válido e não convincente.'],
      'Cuidado com a pegadinha: a banca costuma dar a conclusão "natural" (afirmar o consequente) e perguntar se o argumento é válido. Verifique a forma, e não a plausibilidade.'),
    step('Resumo essencial', ['Formas válidas e inválidas.'], undefined, { caption: 'Argumentos', head: ['Forma', 'Estrutura', 'Válido?'], rows: [
      ['Modus ponens', 'p → q; p; logo q', 'Sim'],
      ['Modus tollens', 'p → q; ¬q; logo ¬p', 'Sim'],
      ['Silogismo hipotético', 'p → q; q → r; logo p → r', 'Sim'],
      ['Silogismo disjuntivo', 'p ou q; ¬p; logo q', 'Sim'],
      ['Afirmação do consequente', 'p → q; q; logo p', 'Não'],
      ['Negação do antecedente', 'p → q; ¬p; logo ¬q', 'Não']] }),
    step('O que memorizar', ['• Válido: conclusão decorre necessariamente das premissas.',
      '• Validade é da forma; verdade é do conteúdo.',
      '• Negar o consequente permite negar o antecedente (tollens). Afirmar o consequente NÃO permite afirmar o antecedente.',
      '• Teste prático: procure um contraexemplo.'] ),
  ],
}
const aq = mkQ('arg', 'rl-2')
export const ARG_QUESTIONS: Question[] = [
  aq(1, 'Considere as premissas: "Se chove, a rua fica molhada" e "A rua não está molhada". A única conclusão que decorre necessariamente delas é', [
    o('A', 'Choveu.', 'Errada: contradiz a premissa, pois se tivesse chovido a rua estaria molhada.'),
    o('B', 'Não choveu.', 'Correta: modus tollens; negando o consequente, nega-se o antecedente.'),
    o('C', 'A rua foi lavada.', 'Errada: não há nenhuma informação sobre isso nas premissas.'),
    o('D', 'Pode ter chovido, mas a rua secou.', 'Errada: não decorre das premissas; elas dizem apenas que a rua não está molhada.'),
    o('E', 'Nenhuma conclusão é possível.', 'Errada: é possível concluir que não choveu.')], 'B', 'Médio'),
  aq(2, 'Premissas: "Se estudo, passo no concurso" e "Passei no concurso". A conclusão "Logo, estudei" é', [
    o('A', 'válida, por modus ponens.', 'Errada: o modus ponens parte de "estudo" para "passo", e não o contrário.'),
    o('B', 'válida, por modus tollens.', 'Errada: o modus tollens exige a negação do consequente.'),
    o('C', 'inválida, pois afirma o consequente.', 'Correta: passar não implica ter estudado; é a falácia da afirmação do consequente.'),
    o('D', 'válida, pois é razoável.', 'Errada: validade independe de ser razoável; depende da forma.'),
    o('E', 'inválida, pois as premissas são falsas.', 'Errada: o problema é a forma do argumento, e não a falsidade das premissas.')], 'C', 'Médio'),
  aq(3, 'Premissas: "Se A, então B" e "Se B, então C". Uma conclusão válida é', [
    o('A', 'Se C, então A.', 'Errada: inverte o sentido das implicações.'),
    o('B', 'Se A, então C.', 'Correta: silogismo hipotético.'),
    o('C', 'A é verdadeira.', 'Errada: nada afirma A como verdadeira.'),
    o('D', 'C é verdadeira.', 'Errada: nada afirma A ou B como verdadeiras.'),
    o('E', 'Se não A, então não C.', 'Errada: é a negação do antecedente, forma inválida.')], 'B', 'Médio'),
  aq(4, 'Premissas: "Ana foi à reunião ou Bia foi à reunião" e "Ana não foi à reunião". Conclui-se, necessariamente, que', [
    o('A', 'Ana e Bia faltaram.', 'Errada: contradiz a primeira premissa, que garante que ao menos uma foi.'),
    o('B', 'Bia faltou.', 'Errada: contradiz o raciocínio: se Ana não foi, Bia foi.'),
    o('C', 'Bia foi à reunião.', 'Correta: silogismo disjuntivo.'),
    o('D', 'Ana foi à reunião.', 'Errada: contradiz a segunda premissa.'),
    o('E', 'Nada se pode concluir.', 'Errada: a conclusão sobre Bia é necessária.')], 'C', 'Fácil'),
  aq(5, '"Todos os gatos voam. Tom é um gato. Logo, Tom voa." Sobre esse argumento, é correto afirmar que', [
    o('A', 'é inválido, pois a primeira premissa é falsa.', 'Errada: premissa falsa não torna o argumento inválido; a forma é que conta.'),
    o('B', 'é inválido, pois a conclusão é falsa.', 'Errada: validade não depende do valor de verdade da conclusão no mundo real.'),
    o('C', 'é válido, pois a conclusão decorre das premissas, embora uma premissa seja falsa.', 'Correta: se as premissas fossem verdadeiras, a conclusão seria necessariamente verdadeira.'),
    o('D', 'é válido apenas se Tom realmente voar.', 'Errada: a validade independe da realidade.'),
    o('E', 'não pode ser avaliado.', 'Errada: pode ser avaliado pela forma.')], 'C', 'Difícil'),
]
const ac = mkC('arg', 'rl-2', 'rl-argumentacao')
export const ARG_CARDS: Flashcard[] = [
  ac(1, 'Quando um argumento é válido?', 'Quando, sendo verdadeiras as premissas, a conclusão é necessariamente verdadeira.'),
  ac(2, 'O que é modus tollens?', 'p → q; ¬q; logo ¬p.'),
  ac(3, 'O que é a falácia da afirmação do consequente?', 'p → q; q; logo p (inválido).'),
  ac(4, 'O que é o silogismo hipotético?', 'p → q; q → r; logo p → r.'),
  ac(5, 'Um argumento válido pode ter premissa falsa?', 'Sim. Validade trata da forma; a conclusão só é garantida como verdadeira se as premissas também forem.'),
  ac(6, 'Como testar a invalidade de um argumento?', 'Procurando um contraexemplo: premissas verdadeiras e conclusão falsa.'),
]

export const SEQ_LESSON: Lesson = {
  id: 'rl-sequencias', topicId: 'rl-4', title: 'Sequências numéricas e padrões', questionIds: ['seq-1', 'seq-2', 'seq-3', 'seq-4', 'seq-5'],
  steps: [
    step('Entenda', ['Sequência é uma lista ordenada de termos que segue uma regra. Para achar o próximo termo, descubra a regra comparando termos vizinhos.',
      'PROGRESSÃO ARITMÉTICA (PA): a diferença entre termos consecutivos é constante (razão r). Termo geral: aₙ = a₁ + (n − 1) · r. PROGRESSÃO GEOMÉTRICA (PG): o quociente entre termos consecutivos é constante (razão q). Termo geral: aₙ = a₁ · qⁿ⁻¹.',
      'Outros padrões comuns: FIBONACCI (cada termo é a soma dos dois anteriores: 1, 1, 2, 3, 5, 8, 13…), quadrados (1, 4, 9, 16…) e variações como n² + 1 (2, 5, 10, 17, 26…), além de alternância de duas regras (termos ímpares seguem uma, pares outra).'],
      'Receita: (1) calcule as diferenças; se forem iguais, é PA; (2) se não, calcule os quocientes; se iguais, é PG; (3) se nem um nem outro, olhe as diferenças das diferenças ou soma dos anteriores.'),
    step('Exemplo prático', ['Caso 1 — PA: 3, 7, 11, 15, … → r = 4; próximo = 19.',
      'Caso 2 — PG: 2, 6, 18, 54, … → q = 3; próximo = 162.',
      'Caso 3 — Fibonacci: 1, 1, 2, 3, 5, 8, … → próximo = 5 + 8 = 13.',
      'Caso 4 — quadrados + 1: 2, 5, 10, 17, 26, … → n² + 1; para n = 6, 36 + 1 = 37. (Diferenças: 3, 5, 7, 9, 11, que crescem de 2 em 2.)',
      'Caso 5 — termo geral da PA 5, 8, 11, …: a₂₀ = 5 + 19 × 3 = 62.'],
      'Se as diferenças aumentam de forma regular (3, 5, 7, 9), a sequência é de segundo grau (relacionada a n²).'),
    step('Resumo essencial', ['Tipos de sequência.'], undefined, { caption: 'Sequências', head: ['Tipo', 'Regra', 'Exemplo'], rows: [
      ['PA', 'Soma da razão r', '3, 7, 11, 15, 19'],
      ['PG', 'Multiplica pela razão q', '2, 6, 18, 54, 162'],
      ['Fibonacci', 'Soma dos dois anteriores', '1, 1, 2, 3, 5, 8, 13'],
      ['n² + 1', 'Quadrado do índice mais 1', '2, 5, 10, 17, 26, 37']] }),
    step('O que memorizar', ['• PA: aₙ = a₁ + (n − 1) r.',
      '• PG: aₙ = a₁ · qⁿ⁻¹.',
      '• Fibonacci: soma dos dois anteriores.',
      '• Diferenças crescentes de forma regular → padrão com n².',
      '• Sempre teste a regra em TODOS os termos dados.'] ),
  ],
}
const sqq = mkQ('seq', 'rl-4')
export const SEQ_QUESTIONS: Question[] = [
  sqq(1, 'Na sequência 3, 7, 11, 15, …, o próximo termo é', [
    o('A', '17', 'Errada: soma apenas 2 ao último termo, mas a razão é 4.'),
    o('B', '18', 'Errada: soma apenas 3; a razão é 4.'),
    o('C', '19', 'Correta: PA de razão 4; 15 + 4 = 19.'),
    o('D', '20', 'Errada: soma 5; a razão é 4.'),
    o('E', '23', 'Errada: soma 8 ao último termo.')], 'C', 'Fácil'),
  sqq(2, 'Na sequência 2, 6, 18, 54, …, o próximo termo é', [
    o('A', '72', 'Errada: soma 18 ao último termo, mas a sequência é multiplicativa.'),
    o('B', '108', 'Errada: multiplica por 2, mas a razão é 3.'),
    o('C', '126', 'Errada: não segue a razão 3.'),
    o('D', '162', 'Correta: PG de razão 3; 54 × 3 = 162.'),
    o('E', '216', 'Errada: multiplica por 4, mas a razão é 3.')], 'D', 'Fácil'),
  sqq(3, 'Na sequência 1, 1, 2, 3, 5, 8, …, o próximo termo é', [
    o('A', '11', 'Errada: soma apenas 3 ao último termo; a regra soma os dois anteriores.'),
    o('B', '12', 'Errada: não é a soma dos dois anteriores.'),
    o('C', '13', 'Correta: Fibonacci; 5 + 8 = 13.'),
    o('D', '14', 'Errada: não é a soma dos dois anteriores.'),
    o('E', '16', 'Errada: é o dobro do último termo.')], 'C', 'Fácil'),
  sqq(4, 'Na sequência 2, 5, 10, 17, 26, …, o próximo termo é', [
    o('A', '35', 'Errada: soma 9 ao último termo, mas as diferenças crescem 3, 5, 7, 9, 11.'),
    o('B', '36', 'Errada: é 6², sem somar 1.'),
    o('C', '37', 'Correta: n² + 1; 6² + 1 = 37 (26 + 11).'),
    o('D', '38', 'Errada: soma 12 ao último termo, mas a diferença é 11.'),
    o('E', '52', 'Errada: é o dobro do último termo.')], 'C', 'Médio'),
  sqq(5, 'Em uma progressão aritmética cujos termos são 5, 8, 11, …, o 20º termo é', [
    o('A', '57', 'Errada: não corresponde ao termo geral (5 + 19 × 3).'),
    o('B', '60', 'Errada: é 20 × 3, sem somar o termo inicial corretamente.'),
    o('C', '62', 'Correta: a₂₀ = 5 + 19 × 3 = 62.'),
    o('D', '65', 'Errada: usa n = 20 como número de razões (5 + 20 × 3).'),
    o('E', '63', 'Errada: soma 1 a mais que o correto.')], 'C', 'Médio'),
]
const sqc = mkC('seq', 'rl-4', 'rl-sequencias')
export const SEQ_CARDS: Flashcard[] = [
  sqc(1, 'Qual o termo geral de uma PA?', 'aₙ = a₁ + (n − 1) · r.'),
  sqc(2, 'Qual o termo geral de uma PG?', 'aₙ = a₁ · qⁿ⁻¹.'),
  sqc(3, 'Como é a sequência de Fibonacci?', 'Cada termo é a soma dos dois anteriores: 1, 1, 2, 3, 5, 8, 13…'),
  sqc(4, 'Como descobrir se é PA ou PG?', 'Diferenças constantes → PA; quocientes constantes → PG.'),
  sqc(5, 'O que indicam diferenças que crescem 3, 5, 7, 9?', 'Um padrão envolvendo n² (ex.: n² + 1).'),
  sqc(6, 'O que fazer ao propor uma regra?', 'Testá-la em todos os termos dados.'),
]
export const RL2_LESSONS = [ARG_LESSON, SEQ_LESSON]
export const RL2_QUESTIONS = spread([...ARG_QUESTIONS, ...SEQ_QUESTIONS], 3)
export const RL2_CARDS = [...ARG_CARDS, ...SEQ_CARDS]
