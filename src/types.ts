export type OptId = 'A' | 'B' | 'C' | 'D' | 'E'
export interface Question { id: string; topicId: string; stem: string; options: { id: OptId; text: string; why: string }[]; answer: OptId; difficulty: 'Fácil' | 'Médio' | 'Difícil'; origin: 'inedita-ia' | 'prova-anterior' | 'autoral' | 'ia-revisada'; validation?: Validation }
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
export interface DayStats { qids: string[]; correctQids: string[]; lessons: number; reviews: number; resolved: number; seconds: number; xp: number; asm?: number; study?: number } // asm = avaliações feitas; study = 1 se registrou estudo no dia
export type MissionKind = 'lesson' | 'review' | 'errors' | 'questions' | 'correct' | 'time' | 'study' | 'assess'
export interface Mission { id: string; kind: MissionKind; target: number; label: string }
export interface XpSettings { lesson: number; question: number; review: number; dailyMission: number; mock: number; assessment: number; study: number }
// Regra de domínio (configurável): ≥ minPct de acertos, avaliações em ≥ minDays dias diferentes, ≥ minDistinct questões validadas distintas. weakBelow = abaixo disso o assunto "precisa reforçar".
export interface MasteryRules { minPct: number; minDays: number; minDistinct: number; weakBelow: number }
export interface PlanSettings { weekdays: number[]; hoursPerDay: number; level: 'iniciante' | 'intermediario' | 'avancado'; hard: string[]; style: 'ler' | 'praticar' | 'misto' }
export interface PlanBlock { disc: string; kind: 'estudo' | 'questoes' | 'revisao' | 'simulado' | 'erros' | 'teoria' | 'diagnostico'; min: number }
export interface Plan { settings: PlanSettings; createdAt: string; from: string; template: PlanBlock[][] }
export type PlanMark = 'done' | 'skip'
export interface MockRun { id: string; kind: 'rapido' | 'completo'; startedAt: number; limitSec?: number; qids: string[]; answers: Record<string, OptId>; idx: number }
export interface MockResult { id: string; kind: 'rapido' | 'completo'; date: string; secondsUsed: number; qids: string[]; answers: Record<string, OptId>; correct: number; wrong: number; blank: number; score: number }
export interface Essay { id: string; themeId: string; text: string; savedAt: string; seconds: number }

// ── Fase 2: modelo de eventos (sincronização sem perda). Cada atividade é um registro com id único e imutável.
interface EvBase { id: string; at: string; day: string }
export type RewardKind = 'q' | 'les' | 'rev' | 'mock' | 'mission' | 'asm' | 'study'
export type Ev =
  | (EvBase & { t: 'ans'; qid: string; chosen: OptId; correct: boolean; dev?: string; n?: number; asm?: string }) // dev+n: produtor e nº de sequência (cobertura da compactação); asm: veio de uma avaliação
  | (EvBase & { t: 'rev'; card: string; rating: Rating; dev?: string; n?: number })
  | (EvBase & { t: 'les'; lid: string })
  | (EvBase & { t: 'sec'; sec: number })   // contador acumulado de UM aparelho em UM dia (id = sec:<aparelho>:<dia>)
  | (EvBase & { t: 'rwd'; kind: RewardKind; key: string; xp: number }) // id determinístico: a mesma recompensa em dois aparelhos conta uma vez
  | (EvBase & { t: 'fav'; qid: string; on: boolean })
  | (EvBase & { t: 'asm'; topic: string; mode: AsmMode; items: AsmItem[]; sec: number; entry?: string }) // tentativa de avaliação/prática de um assunto (imutável)
// ── Fase 3
export type AsmMode = 'avaliacao' | 'pratica'
export type AsmItem = [qid: string, chosen: OptId, ok: 0 | 1]
export type Validation = 'pendente' | 'precisa-correcao' | 'precisa-complementacao' | 'validada'
export type MaterialKind = 'videoaula' | 'apostila' | 'livro' | 'curso' | 'legislacao' | 'outro'
export interface StudyEntry { id: string; date: string; discId: string; topicId: string; material: MaterialKind; source: string; minutes: number; note?: string; createdAt: string; updatedAt: string; deleted?: boolean }
export interface TopicMark { state: 'estudando' | 'teoria' | 'limpo'; at: string; entry?: string }
// Compactação: eventos ans/rev antigos viram parte da base. vec[produtor] = maior nº de sequência já incorporado; legacy = ids de eventos antigos (sem produtor) incorporados.
export interface Checkpoint { id: string; gen: number; at: string; vec: Record<string, number>; legacy: string[] }
// Base: retrato congelado do que existia antes do modelo de eventos (compatibilidade com os dados antigos).
export interface Base { xp: number; completed: Record<string, string>; answers: Record<string, Answer>; errors: Record<string, ErrorEntry>; cards: Record<string, CardState>; favorites: string[]; reviewLog: ReviewLog[]; daily: Record<string, DayStats>; totalAnswered: number; correctStreak: number; bestCorrectStreak: number }
export interface Progress { schemaVersion: number; cp?: Checkpoint; diary: Record<string, StudyEntry>; marks: Record<string, TopicMark>; epoch: { id: string; at: string }; prefsAt: string; events: Ev[]; base: Base; essaysDeleted: string[];  xp: number; completed: Record<string, string>; answers: Record<string, Answer>; studyDays: string[]; bonusDays: string[]; lastLessonId?: string; dark: boolean; cards: Record<string, CardState>; errors: Record<string, ErrorEntry>; favorites: string[]; reviewLog: ReviewLog[]; reviewXpDays: string[]; notes: Record<string, Note>; achievements: Record<string, string>; correctStreak: number; bestCorrectStreak: number; totalAnswered: number; daily: Record<string, DayStats>; missionsToday?: { day: string; list: Mission[] }; settings: { xp: XpSettings; mastery: MasteryRules }; levelSeen: number; plan?: Plan; planMarks: Record<string, Record<number, PlanMark>>; mockRun?: MockRun; mocks: MockResult[]; mockXpDays: string[]; essays: Essay[]; essayDrafts: Record<string, string> }
