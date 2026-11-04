// Repetição espaçada em dias, inspirada no SM-2. Esqueci=0, Difícil=1, Bom=2, Fácil=3.
import type { CardState, Rating } from '../types'
import { addDays } from './dates'
export const RATING_LABELS = ['Esqueci', 'Difícil', 'Bom', 'Fácil'] as const
export const MASTERED_AT = 21 // intervalo (dias) a partir do qual o card é considerado dominado
export const MAX_INTERVAL = 60 // teto em dias: a prova é em 14/03/2027, então intervalos longos demais não ajudam
export const newCard = (today: string): CardState => ({ ease: 2.5, interval: 0, due: today, reps: 0, lapses: 0 })
export function schedule(c: CardState, r: Rating, today: string): CardState {
  if (r === 0) return { ...c, ease: Math.max(1.3, c.ease - 0.2), interval: 0, reps: 0, lapses: c.lapses + 1, due: today, last: today }
  let ease = c.ease, interval: number
  if (r === 1) ease = Math.max(1.3, ease - 0.15)
  if (r === 3) ease += 0.15
  if (c.reps === 0) interval = r === 3 ? 3 : 1
  else if (c.reps === 1) interval = r === 1 ? 2 : r === 2 ? 3 : 5
  else interval = Math.max(c.interval + 1, Math.round(c.interval * (r === 1 ? 1.2 : r === 2 ? ease : ease * 1.3)))
  interval = Math.min(interval, MAX_INTERVAL)
  return { ease, interval, reps: c.reps + 1, lapses: c.lapses, due: addDays(today, interval), last: today }
}
export const isDue = (c: CardState, today: string) => c.due <= today
export const isMastered = (c: CardState) => c.interval >= MASTERED_AT
export const intervalLabel = (c: CardState) => c.interval === 0 ? 'repete agora' : c.interval === 1 ? '1 dia' : `${c.interval} dias`
