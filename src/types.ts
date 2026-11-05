export type OptId = 'A' | 'B' | 'C' | 'D' | 'E'
export interface Question { id: string; topicId: string; stem: string; options: { id: OptId; text: string; why: string }[]; answer: OptId; difficulty: 'Fácil' | 'Médio' | 'Difícil'; origin: 'inedita-ia' | 'prova-anterior' | 'autoral' | 'ia-revisada' }
export interface Step { title: string; body: string[]; alt?: string; quotes?: { ref: string; text: string }[]; table?: { caption?: string; head: string[]; rows: string[][] } }
export interface Video { url: string; title?: string }
export interface Lesson { id: string; topicId: string; title: string; steps: Step[]; questionIds: string[]; video?: Video }
export interface Topic { id: string; title: string }
export interface Discipline { id: string; name: string; block: 1 | 2 | 3; questions?: number; emoji: string; topics: Topic[] }
export interface Answer { chosen: OptId; correct: boolean; everCorrect: boolean; at: string }
export type Rating = 0 | 1 | 2 | 3
export interface Flashcard { id: string; topicId: string; front: string; back: string; origin: 'aula' | 'erro'; lessonId?: string }
export interface CardState { ease: number; interval: number; due: string; reps: number; lapses: number; last?: string }
export interface ErrorEntry { count: number; lastAt: string; resolved: boolean }
export interface ReviewLog { at: string; rating: Rating }
export interface Note { text: string; updatedAt: string }
export interface DayStats { qids: string[]; correctQids: string[]; lessons: number; reviews: number; resolved: number; seconds: number; xp: number }
export type MissionKind = 'lesson' | 'review' | 'errors' | 'questions' | 'correct' | 'time'
export interface Mission { id: string; kind: MissionKind; target: number; label: string }
export interface XpSettings { lesson: number; question: number; review: number; dailyMission: number; mock: number }
export interface PlanSettings { weekdays: number[]; hoursPerDay: number; level: 'iniciante' | 'intermediario' | 'avancado'; hard: string[]; style: 'ler' | 'praticar' | 'misto' }
export interface PlanBlock { disc: string; kind: 'estudo' | 'questoes' | 'revisao' | 'simulado' | 'erros'; min: number }
export interface Plan { settings: PlanSettings; createdAt: string; from: string; template: PlanBlock[][] }
export type PlanMark = 'done' | 'skip'
export interface MockRun { id: string; kind: 'rapido' | 'completo'; startedAt: number; limitSec?: number; qids: string[]; answers: Record<string, OptId>; idx: number }
export interface MockResult { id: string; kind: 'rapido' | 'completo'; date: string; secondsUsed: number; qids: string[]; answers: Record<string, OptId>; correct: number; wrong: number; blank: number; score: number }
export interface Essay { id: string; themeId: string; text: string; savedAt: string; seconds: number }

// ── Fase 2: modelo de eventos (sincronização sem perda). Cada atividade é um registro com id único e imutável.
interface EvBase { id: string; at: string; day: string }
export type RewardKind = 'q' | 'les' | 'rev' | 'mock' | 'mission'
export type Ev =
  | (EvBase & { t: 'ans'; qid: string; chosen: OptId; correct: boolean })
  | (EvBase & { t: 'rev'; card: string; rating: Rating })
  | (EvBase & { t: 'les'; lid: string })
  | (EvBase & { t: 'sec'; sec: number })   // contador acumulado de UM aparelho em UM dia (id = sec:<aparelho>:<dia>)
  | (EvBase & { t: 'rwd'; kind: RewardKind; key: string; xp: number }) // id determinístico: a mesma recompensa em dois aparelhos conta uma vez
  | (EvBase & { t: 'fav'; qid: string; on: boolean })
// Base: retrato congelado do que existia antes do modelo de eventos (compatibilidade com os dados antigos).
export interface Base { xp: number; completed: Record<string, string>; answers: Record<string, Answer>; errors: Record<string, ErrorEntry>; cards: Record<string, CardState>; favorites: string[]; reviewLog: ReviewLog[]; daily: Record<string, DayStats>; totalAnswered: number; correctStreak: number; bestCorrectStreak: number }
export interface Progress { schemaVersion: number; epoch: { id: string; at: string }; prefsAt: string; events: Ev[]; base: Base; essaysDeleted: string[];  xp: number; completed: Record<string, string>; answers: Record<string, Answer>; studyDays: string[]; bonusDays: string[]; lastLessonId?: string; dark: boolean; cards: Record<string, CardState>; errors: Record<string, ErrorEntry>; favorites: string[]; reviewLog: ReviewLog[]; reviewXpDays: string[]; notes: Record<string, Note>; achievements: Record<string, string>; correctStreak: number; bestCorrectStreak: number; totalAnswered: number; daily: Record<string, DayStats>; missionsToday?: { day: string; list: Mission[] }; settings: { xp: XpSettings }; levelSeen: number; plan?: Plan; planMarks: Record<string, Record<number, PlanMark>>; mockRun?: MockRun; mocks: MockResult[]; mockXpDays: string[]; essays: Essay[]; essayDrafts: Record<string, string> }
