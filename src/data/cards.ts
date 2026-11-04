import type { Flashcard } from '../types'
import { QUESTIONS } from './questions'
import { EXATAS_CARDS } from './exatas'
import { PORT_CARDS } from './portugues'
import { MAT2_CARDS } from './mat2'
import { MAT3_CARDS } from './mat3'
import { RL2_CARDS } from './rl2'
import { INFO_CARDS } from './info'
import { PORT2_CARDS } from './port2'
import { ATUAL_CARDS } from './atual'
import { DCONST_CARDS } from './dconst'
import { DPENAL_CARDS } from './dpenal'
import { DPP_CARDS } from './dpp2'
// Flashcards autorais ligados às aulas (conteúdo inédito, baseado no tópico 12 do Anexo VIII – Crase).
export const FLASHCARDS: Flashcard[] = [
  { id: 'fc-crase-1', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'O que é crase?', back: 'A fusão da preposição "a" com o artigo definido feminino "a(s)" (ou com aquele/aquela/aquilo). Ex.: Fui à escola.' },
  { id: 'fc-crase-2', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Como funciona o teste do "ao" para a crase?', back: 'Troque a palavra feminina por uma masculina. Se surgir "ao", há crase no feminino. Ex.: "ao chefe" → "à chefe".' },
  { id: 'fc-crase-3', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Há crase na indicação de horas? Dê um exemplo.', back: 'Sim. Ex.: "Chegamos às 14 horas."' },
  { id: 'fc-crase-4', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Pode haver crase antes de verbo ou de pronome pessoal (ela, você)?', back: 'Não. Ex.: "a partir de hoje"; "entreguei a ela"; "revelou a você".' },
  { id: 'fc-crase-5', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Teste do "da": como saber se há crase antes de nome de lugar?', back: 'Se "volto DA" → há crase ("Vou à Bahia"). Se "volto DE" → não há ("Vou a Roma").' },
  { id: 'fc-crase-6', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Há crase em expressões com palavra repetida (ex.: frente a frente)?', back: 'Não. Ex.: "frente a frente", "cara a cara", "gota a gota".' },
  { id: 'fc-crase-7', topicId: 'pt-12', lessonId: 'pt-crase', origin: 'aula', front: 'Quando a crase é facultativa?', back: 'Antes de pronome possessivo feminino singular e de nome próprio feminino de pessoa. Ex.: "Entreguei a/à Maria."' },
  { id: 'fc-pec-1', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'Qual é a conduta do peculato previsto no caput do art. 312 do CP?', back: 'O funcionário público apropriar-se de dinheiro, valor ou qualquer outro bem móvel, público ou particular, de que tem a posse em razão do cargo, ou desviá-lo, em proveito próprio ou alheio.' },
  { id: 'fc-pec-2', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'Qual é a pena do peculato (caput e § 1º do art. 312)?', back: 'Reclusão, de dois a doze anos, e multa.' },
  { id: 'fc-pec-3', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'O que é o chamado "peculato-furto" (art. 312, § 1º)?', back: 'O funcionário, embora não tendo a posse do bem, o subtrai (ou concorre para que seja subtraído), em proveito próprio ou alheio, valendo-se da facilidade que a qualidade de funcionário lhe proporciona. Mesma pena do caput.' },
  { id: 'fc-pec-4', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'Quando ocorre o peculato culposo e qual é a sua pena?', back: 'Quando o funcionário concorre culposamente para o crime de outrem (§ 2º). Pena: detenção, de três meses a um ano.' },
  { id: 'fc-pec-5', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'Reparação do dano no peculato culposo (§ 3º): o que muda se for antes ou depois da sentença irrecorrível?', back: 'Antes da sentença irrecorrível: extingue a punibilidade. Depois: reduz de metade a pena imposta.' },
  { id: 'fc-pec-6', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'O objeto do peculato precisa ser bem público?', back: 'Não. Pode ser dinheiro, valor ou qualquer outro bem móvel, público ou particular, desde que esteja na posse do funcionário em razão do cargo.' },
  { id: 'fc-pec-7', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'Qual a diferença entre o caput e o § 1º do art. 312 quanto à posse do bem?', back: 'No caput o funcionário TEM a posse do bem em razão do cargo. No § 1º ele NÃO tem a posse e se vale da facilidade que o cargo lhe dá para subtrair.' },
  { id: 'fc-pec-8', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'Quem é funcionário público para efeitos penais (art. 327, caput)?', back: 'Quem, embora transitoriamente ou sem remuneração, exerce cargo, emprego ou função pública.' },
  { id: 'fc-pec-9', topicId: 'dpenal-2', lessonId: 'dpenal-peculato', origin: 'aula', front: 'O § 3º do art. 312 (reparação do dano) vale para qual modalidade de peculato?', back: 'Só para o peculato culposo: o texto diz "no caso do parágrafo anterior" (§ 2º).' },
  ...EXATAS_CARDS,
  ...PORT_CARDS,
  ...MAT2_CARDS,
  ...MAT3_CARDS,
  ...RL2_CARDS,
  ...INFO_CARDS,
  ...PORT2_CARDS,
  ...ATUAL_CARDS,
  ...DCONST_CARDS,
  ...DPENAL_CARDS,
  ...DPP_CARDS,
]
export const errCardId = (qid: string) => `err-${qid}`
// Cards de erro são derivados da questão errada (não duplicam texto no armazenamento).
export function cardById(id: string): Flashcard | undefined {
  if (id.startsWith('err-')) {
    const q = QUESTIONS.find(x => x.id === id.slice(4)); if (!q) return undefined
    const ok = q.options.find(o => o.id === q.answer)!
    return { id, topicId: q.topicId, origin: 'erro', front: `Você errou esta questão. Qual é a alternativa correta?\n\n${q.stem}`, back: `Gabarito: ${ok.id}) ${ok.text}\n${ok.why}` }
  }
  return FLASHCARDS.find(c => c.id === id)
}
