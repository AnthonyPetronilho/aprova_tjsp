import { LEVELS } from '../config'
import { DISCIPLINES } from '../data/edital'
import { LESSONS } from '../data/lessons'
import { addDays, todayStr } from './dates'
import type { Progress } from '../types'
import { validationOf } from './content'
import { attemptsOf, coverage, entriesOf, score } from './learning'
export function levelInfo(xp: number) {
  let i = 0; LEVELS.forEach((l, k) => { if (xp >= l.min) i = k })
  const next = LEVELS[i + 1]
  return { index: i + 1, title: LEVELS[i].title, pct: next ? Math.round(((xp - LEVELS[i].min) / (next.min - LEVELS[i].min)) * 100) : 100, toNext: next ? next.min - xp : 0 }
}
// Sequência tolerante: 1 dia de folga entre dias estudados não quebra a sequência (só 2 dias seguidos sem estudar).
// O dia de hoje ainda não acabou, então não estudar hoje não conta como dia perdido.
export function streak(days: string[]) {
  const s = new Set(days), t = todayStr(); let n = 0, miss = 0
  for (let i = 0; i < 400; i++) { if (s.has(addDays(t, -i))) { n++; miss = 0 } else if (i > 0 && ++miss >= 2) break }
  return n
}
export function topicsDone(p: Progress): Set<string> {
  const by: Record<string, string[]> = {}; LESSONS.forEach(l => (by[l.topicId] ??= []).push(l.id))
  return new Set(Object.entries(by).filter(([, ids]) => ids.every(id => p.completed[id])).map(([t]) => t))
}
export interface Ach { id: string; emoji: string; name: string; desc: string; cur: number; goal: number; ok: boolean; hint?: string }
export function achievements(p: Progress): Ach[] {
  const done = topicsDone(p), total = DISCIPLINES.reduce((n, d) => n + d.topics.length, 0)
  const law = DISCIPLINES.filter(d => d.block === 2).map(d => ({ d, cur: d.topics.filter(t => done.has(t.id)).length, goal: d.topics.length })).sort((a, b) => b.cur / b.goal - a.cur / a.goal)[0]
  const mk = (id: string, emoji: string, name: string, desc: string, cur: number, goal: number, hint?: string): Ach => ({ id, emoji, name, desc, cur: Math.min(cur, goal), goal, ok: goal > 0 && cur >= goal, hint })
  const asm = p.events.some(e => e.t === 'asm') ? attemptsOf(p) : [], evalOk = asm.filter(a => a.mode === 'avaliacao')
  const studyDays = new Set(entriesOf(p).map(e => e.date)).size
  const topicsEvaluated = new Set(asm.map(a => a.topic)).size
  const mastered = asm.length ? coverage(p, { vOf: validationOf }).mastery.n : 0
  const improved = [...new Set(asm.map(a => a.topic))].filter(t => { const l = asm.filter(a => a.topic === t); return l.length >= 2 && score(l[l.length - 1].items).pct > score(l[0].items).pct }).length
  return [
    mk('first', '👣', 'Primeiros passos', 'Concluir a primeira aula', Object.keys(p.completed).length, 1),
    mk('streak10', '🧠', 'Mente brilhante', 'Acertar 10 questões seguidas (cada acerto vale uma vez por questão)', p.bestCorrectStreak, 10, 'Precisa de pelo menos 10 questões diferentes no banco.'),
    mk('days7', '🛡️', 'Disciplina de ferro', 'Estudar em 7 dias (não precisam ser seguidos)', p.studyDays.length, 7),
    mk('q100', '🏃', 'Maratonista', 'Responder 100 questões (máx. 1 vez por questão ao dia)', p.totalAnswered, 100),
    mk('law', '⚖️', 'Dominando o Direito', `Concluir todos os tópicos de uma disciplina jurídica${law ? ` (melhor: ${law.d.name})` : ''}`, law?.cur ?? 0, law?.goal ?? 1, 'Ainda não há aulas jurídicas no sistema.'),
    mk('diary5', '📖', 'Diário em dia', 'Registrar estudo externo em 5 dias diferentes', studyDays, 5),
    mk('asm1', '✅', 'Primeira validação', 'Fazer a primeira avaliação com questões validadas', evalOk.length, 1, 'Precisa de questões marcadas como validadas.'),
    mk('asm10', '🧭', 'Mapa de dificuldades', 'Ser avaliado em 10 assuntos diferentes (avaliação ou prática)', topicsEvaluated, 10),
    mk('improve', '📈', 'Evolução comprovada', 'Melhorar o aproveitamento entre a primeira e a última tentativa de um assunto', improved, 1),
    mk('mastery1', '🏅', 'Domínio consolidado', 'Consolidar o domínio de um assunto pelo critério configurado', mastered, 1, 'Exige questões validadas, 2 dias de avaliação e 80% de acertos (configurável).'),
    mk('all', '🎯', 'Rumo à aprovação', 'Completar todo o conteúdo do edital', done.size, total),
  ]
}
