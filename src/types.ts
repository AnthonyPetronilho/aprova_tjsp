export type OptId = 'A' | 'B' | 'C' | 'D' | 'E'
export interface Question { id: string; topicId: string; stem: string; options: { id: OptId; text: string; why: string }[]; answer: OptId; difficulty: 'Fácil' | 'Médio' | 'Difícil'; origin: 'inedita-ia' | 'prova-anterior' }
export interface Step { title: string; body: string[]; alt?: string }
export interface Lesson { id: string; topicId: string; title: string; steps: Step[]; questionIds: string[] }
export interface Topic { id: string; title: string }
export interface Discipline { id: string; name: string; block: 1 | 2 | 3; questions?: number; emoji: string; topics: Topic[] }
export interface Answer { chosen: OptId; correct: boolean; everCorrect: boolean; at: string }
export interface Progress { xp: number; completed: Record<string, string>; answers: Record<string, Answer>; studyDays: string[]; bonusDays: string[]; lastLessonId?: string; dark: boolean }
