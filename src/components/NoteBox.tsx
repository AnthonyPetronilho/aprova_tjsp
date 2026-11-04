import { useEffect, useRef, useState } from 'react'
interface Props { value: string; onSave: (text: string) => void; label?: string; placeholder?: string; rows?: number }
// Salva sozinha (0,8 s após parar de digitar, ao sair do campo e ao fechar). Use `key` para reiniciar ao trocar de alvo.
export default function NoteBox({ value, onSave, label = '📝 Minha anotação', placeholder = 'Escreva algo para lembrar: um macete, um exemplo seu, uma pegadinha…', rows = 3 }: Props) {
  const [text, setText] = useState(value), [saved, setSaved] = useState(true)
  const dirty = useRef(false), latest = useRef(value), timer = useRef<number>(), save = useRef(onSave)
  save.current = onSave
  const flush = () => { window.clearTimeout(timer.current); if (dirty.current) { dirty.current = false; save.current(latest.current); setSaved(true) } }
  useEffect(() => () => { window.clearTimeout(timer.current); if (dirty.current) save.current(latest.current) }, [])
  const change = (v: string) => { setText(v); latest.current = v; dirty.current = true; setSaved(false); window.clearTimeout(timer.current); timer.current = window.setTimeout(flush, 800) }
  return <label className="block"><span className="text-sm font-semibold">{label}</span>
    <textarea value={text} rows={rows} maxLength={2000} placeholder={placeholder} onChange={e => change(e.target.value)} onBlur={flush} className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-sm" />
    <span className="text-xs text-slate-500">{saved ? (text.trim() ? 'Salva ✓' : '') : 'Salvando…'}{text.length > 1800 ? ` · ${text.length}/2000` : ''}</span></label>
}
