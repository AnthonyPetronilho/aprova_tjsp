// Fase 4B — Questões substitutas (substituição versionada). Cada uma encerra uma questão comprovadamente
// desatualizada/incorreta, que permanece no catálogo para não reinterpretar respostas e XP históricos.
import type { Question } from '../types'
import { o, place } from './helpers'

/** Substitui soc-2 (art. 7º, XIII, na redação anterior à EC 141/2026). Origem 'autoral' → nasce Pendente até revisão humana. */
const SOC_2B: Question = place({
  id: 'soc-2b', topicId: 'dconst-2', difficulty: 'Fácil', origin: 'autoral', answer: 'A',
  stem: 'Segundo o art. 7º, XIII, da Constituição Federal, na redação dada pela Emenda Constitucional nº 141/2026, a duração do trabalho normal não é superior a',
  options: [
    o('A', 'oito horas diárias e quarenta semanais.', 'Correta: texto do inciso XIII na redação da EC 141/2026, facultada a compensação de horários e a redução da jornada por acordo ou convenção coletiva.'),
    o('B', 'oito horas diárias e quarenta e quatro semanais.', 'Errada: 44 horas semanais era o limite da redação anterior do inciso XIII, alterada pela EC 141/2026.'),
    o('C', 'oito horas diárias e quarenta e duas semanais.', 'Errada: o texto do inciso XIII não fixa 42 horas.'),
    o('D', 'seis horas diárias e trinta e seis semanais.', 'Errada: jornada de seis horas é a dos turnos ininterruptos de revezamento (art. 7º, XIV), salvo negociação coletiva.'),
    o('E', 'dez horas diárias e quarenta semanais.', 'Errada: o limite diário é de oito horas.')],
}, 'B')
/** Substitui ppj-4 (art. 265 do CPP na redação da Lei 11.719/2008, alterada pela Lei 14.752/2023). Origem 'autoral' → Pendente. */
const PPJ_4B: Question = place({
  id: 'ppj-4b', topicId: 'dpp-1', difficulty: 'Médio', origin: 'autoral', answer: 'A',
  stem: 'O defensor que abandona o processo sem justo motivo, previamente comunicado ao juiz, fica sujeito, segundo o art. 265 do CPP (redação da Lei 14.752/2023), a',
  options: [
    o('A', 'responder por infração disciplinar perante o órgão correicional competente.', 'Correta: art. 265, caput, na redação da Lei 14.752/2023.'),
    o('B', 'multa de 10 a 100 salários mínimos, sem prejuízo das demais sanções cabíveis.', 'Errada: essa multa constava da redação anterior (Lei 11.719/2008), que a Lei 14.752/2023 substituiu.'),
    o('C', 'prisão administrativa de até 30 dias.', 'Errada: o artigo não prevê prisão.'),
    o('D', 'advertência verbal do juiz, apenas.', 'Errada: o artigo prevê responsabilização disciplinar perante o órgão correicional competente.'),
    o('E', 'exclusão automática dos quadros da OAB.', 'Errada: o artigo não prevê exclusão automática.')],
}, 'C')
/** Substitui estr-1: a alternativa "Se Marta é escrevente, então Paulo não é oficial de justiça" é logicamente equivalente à negação da conjunção (p → ¬q ≡ ¬p ∨ ¬q), o que dava duas respostas corretas. Origem 'autoral' → Pendente. */
const ESTR_1B: Question = place({
  id: 'estr-1b', topicId: 'rl-1', difficulty: 'Fácil', origin: 'autoral', answer: 'A',
  stem: 'A negação da proposição "Marta é escrevente e Paulo é oficial de justiça" é',
  options: [
    o('A', 'Marta não é escrevente ou Paulo não é oficial de justiça.', 'Correta: pela lei de De Morgan, nega-se cada parte e troca-se "e" por "ou".'),
    o('B', 'Marta não é escrevente e Paulo não é oficial de justiça.', 'Errada: manteve o "e"; ao negar uma conjunção, o conectivo muda para "ou".'),
    o('C', 'Marta é escrevente ou Paulo é oficial de justiça.', 'Errada: trocou o conectivo, mas não negou as partes.'),
    o('D', 'Se Marta não é escrevente, então Paulo não é oficial de justiça.', 'Errada: se Marta não é escrevente e Paulo é oficial de justiça, esse condicional é falso, mas a negação da conjunção original é verdadeira; as duas proposições não têm sempre o mesmo valor lógico.'),
    o('E', 'Marta é escrevente e Paulo não é oficial de justiça.', 'Errada: negou só uma das partes e manteve o "e".')],
}, 'E')
/** Substitui pcl-4 (Lei 9.099, art. 42 — fora do recorte do edital: Processo Civil, arts. 3º a 19). Conteúdo no recorte: art. 18, § 3º. Origem 'autoral' → Pendente. */
const PCL_4B: Question = place({
  id: 'pcl-4b', topicId: 'dpc-2', difficulty: 'Médio', origin: 'autoral', answer: 'A',
  stem: 'No Juizado Especial Cível, segundo o art. 18, § 3º, da Lei 9.099/1995, a falta ou a nulidade da citação é suprida',
  options: [
    o('A', 'pelo comparecimento espontâneo do réu.', 'Correta: art. 18, § 3º: "O comparecimento espontâneo suprirá a falta ou nulidade da citação."'),
    o('B', 'pela citação por edital, feita em seguida.', 'Errada: no Juizado Especial Cível não se faz citação por edital (art. 18, § 2º).'),
    o('C', 'apenas se o réu constituir advogado nos autos.', 'Errada: o artigo não condiciona o efeito à constituição de advogado.'),
    o('D', 'somente por decisão do juiz na sentença.', 'Errada: o suprimento decorre do comparecimento do réu, e não de decisão posterior.'),
    o('E', 'pelo decurso do prazo para o autor se manifestar.', 'Errada: o artigo trata do comparecimento do citando, e não de prazo do autor.')],
}, 'D')
export const REPLACEMENT_QUESTIONS: Question[] = [SOC_2B, PPJ_4B, ESTR_1B, PCL_4B]
