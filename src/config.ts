// Valores padrão de XP; o usuário pode alterá-los na tela Configurações.
export const DEFAULT_XP = { lesson: 20, question: 10, review: 15, dailyMission: 50, mock: 100, assessment: 30, study: 5 }
// Critério inicial de domínio (configurável em Configurações): 80% de acertos, avaliações em 2 dias diferentes, 10 questões validadas distintas.
export const DEFAULT_MASTERY = { minPct: 80, minDays: 2, minDistinct: 10, weakBelow: 60 }
export const EXAM_DATE = '2027-03-14' // Edital 02/2026, cap. IX, item 3
export const LEVELS = [
  { min: 0, title: 'Aspirante' }, { min: 100, title: 'Estudante dedicada' }, { min: 300, title: 'Aprendiz do Direito' },
  { min: 600, title: 'Especialista em questões' }, { min: 1000, title: 'Mestre da revisão' }, { min: 1500, title: 'Futura Escrevente' },
]
