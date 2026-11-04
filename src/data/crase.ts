import type { Lesson, Question } from '../types'
const o = (id: Question['options'][0]['id'], text: string, why: string) => ({ id, text, why })
export const CRASE_LESSON: Lesson = {
  id: 'pt-crase', topicId: 'pt-12', title: 'Crase', questionIds: ['crase-1', 'crase-2', 'crase-3', 'crase-4', 'crase-5'],
  steps: [
    { title: 'Entenda', body: ['Crase é a fusão de dois "a": a preposição "a" + o artigo definido feminino "a(s)". O acento grave (`) marca essa fusão.', 'Exemplo: Fui a + a escola → Fui à escola.', 'Só há crase quando as duas condições existem: o termo anterior pede a preposição "a" E a palavra seguinte aceita o artigo "a".'], alt: 'Imagine dois "a" entrando juntos por uma porta estreita: um vem da preposição, outro do artigo. Se só um deles existe, não há o que juntar — logo, não há acento.' },
    { title: 'Exemplo prático', body: ['"Entreguei o recurso à chefe." → quem entrega, entrega a alguém (preposição) + a chefe (artigo).', 'Teste: troque por um masculino. "Entreguei o recurso ao chefe." Apareceu "ao"? Então no feminino há crase.', '"Entreguei o recurso a ela." → "ela" não aceita artigo, não há crase.'], alt: 'Pense em pedir um favor: "Pedi ajuda à minha irmã" / "Pedi ajuda ao meu irmão". Se o masculino pede "ao", o feminino pede "à".' },
    { title: 'Resumo essencial', body: ['USA crase: horas ("às 14h"); locuções femininas ("à noite", "à direita", "à medida que"); a + aquele/aquela/aquilo ("àquele", "àquilo"); a + substantivo feminino determinado.', 'NÃO usa crase: antes de palavra masculina ("a pé"); antes de verbo ("a partir"); antes de pronomes pessoais ("a ela", "a você"); antes de artigo indefinido ("a uma"); em expressões com palavra repetida ("frente a frente"); antes de plural indeterminado ("a pessoas").'] },
    { title: 'O que memorizar', body: ['Teste do "ao": troque a palavra feminina por masculina; se surgir "ao", há crase.', 'Teste do lugar: "volto DA" → há crase ("Vou à Bahia"); "volto DE" → não há ("Vou a Roma").', 'Crase facultativa: antes de possessivo feminino singular e de nome próprio feminino de pessoa ("Entreguei a/à Maria").'] },
  ],
}
const Q = (n: number, stem: string, options: Question['options'], answer: Question['answer'], difficulty: Question['difficulty']): Question => ({ id: `crase-${n}`, topicId: 'pt-12', stem, options, answer, difficulty, origin: 'inedita-ia' })
export const QUESTIONS: Question[] = [
  Q(1, 'Assinale a alternativa em que o sinal indicativo de crase está empregado corretamente.', [
    o('A', 'Referiu-se à pessoas que não conhecia.', 'Errada: "pessoas" é plural indeterminado, sem artigo.'), o('B', 'O prazo começa à partir de segunda-feira.', 'Errada: não há crase antes de verbo.'),
    o('C', 'Os documentos foram entregues às 14 horas.', 'Correta: indicação de horas exige crase.'), o('D', 'Ela revelou à você toda a verdade.', 'Errada: pronome pessoal não aceita artigo.'), o('E', 'Fomos à pé até o fórum.', 'Errada: "pé" é masculino ("a pé").')], 'C', 'Fácil'),
  Q(2, 'Assinale a alternativa em que a palavra "a" NÃO deve receber acento grave.', [
    o('A', 'Entregou o documento ( ) secretária.', 'Há crase: entregou a + a secretária.'), o('B', 'Ficamos frente ( ) frente com o réu.', 'Correta: expressão com palavra repetida não tem crase.'),
    o('C', 'Voltaram ( ) noite.', 'Há crase: locução adverbial feminina.'), o('D', 'Referiu-se ( ) funcionária citada.', 'Há crase: referir-se a + a funcionária.'), o('E', 'Assistimos ( ) sessão de ontem.', 'Há crase: assistir (ver) pede "a" + a sessão.')], 'B', 'Médio'),
  Q(3, 'Em qual alternativa o acento grave está de acordo com a norma-padrão?', [
    o('A', 'Voltamos à Roma na semana passada.', 'Errada: "volto de Roma" → sem artigo, sem crase.'), o('B', 'Voltaram à Bahia no fim do ano.', 'Correta: "voltar DA Bahia" → há crase.'),
    o('C', 'Fomos à Campinas visitar a família.', 'Errada: "volto de Campinas" → sem crase.'), o('D', 'Ele foi à Paris a trabalho.', 'Errada: "volto de Paris" → sem crase.'), o('E', 'Chegamos à Lisboa pela manhã.', 'Errada: "volto de Lisboa" → sem crase.')], 'B', 'Médio'),
  Q(4, 'Assinale a alternativa que completa corretamente: "O relatório foi enviado ( ) que solicitaram o parecer e ( ) outras unidades."', [
    o('A', 'aqueles … as', 'Errada: faltam as fusões com a preposição.'), o('B', 'àqueles … às', 'Correta: a + aqueles; a + as outras unidades.'),
    o('C', 'àqueles … as', 'Errada: "as outras unidades" pede crase (às).'), o('D', 'aqueles … às', 'Errada: "enviado a aqueles" pede àqueles.'), o('E', 'àquele … à', 'Errada: concordância e crase incorretas com o plural.')], 'B', 'Médio'),
  Q(5, 'Assinale a alternativa correta quanto ao uso da crase.', [
    o('A', 'Prefiro café à chá.', 'Errada: "chá" é masculino.'), o('B', 'A audiência será daqui à dez dias.', 'Errada: não há crase antes de numeral nesse contexto.'),
    o('C', 'Pediu ajuda à vizinha.', 'Correta: pedir a + a vizinha (teste: "ao vizinho").'), o('D', 'Estamos dispostos à colaborar.', 'Errada: não há crase antes de verbo.'), o('E', 'Entregou o recurso à ele.', 'Errada: pronome pessoal não aceita artigo.')], 'C', 'Fácil'),
]
