import { useRef, useState } from 'react'
import type { XpSettings } from '../types'
import { useContent, setEditor } from '../lib/content'
import type { Store } from '../lib/useProgress'
const FIELDS: [keyof XpSettings, string][] = [['lesson', 'Concluir uma aula'], ['question', 'Acertar uma questão (1ª vez que acerta)'], ['review', 'Concluir uma revisão (1x por dia)'], ['dailyMission', 'Completar as missões do dia'], ['mock', 'Finalizar um simulado (simulados ainda não existem)']]
export default function Settings({ s }: { s: Store }) {
  const content = useContent()
  const { p, setXp, resetXp, replaceAll, reset } = s, [msg, setMsg] = useState(''), [confirm, setConfirm] = useState(false), file = useRef<HTMLInputElement>(null)
  const exportData = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' })); a.download = `aprova-tjsp-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href); setMsg('Backup baixado.') }
  const importData = async (f?: File) => { if (!f) return; try { setMsg(replaceAll(JSON.parse(await f.text())) ? 'Backup restaurado.' : 'Arquivo inválido: não parece um backup do Aprova TJSP.') } catch { setMsg('Não foi possível ler o arquivo.') } if (file.current) file.current.value = '' }
  return <div className="space-y-4 max-w-2xl"><h1 className="text-2xl font-bold">⚙️ Configurações</h1>
    <div className="card space-y-3"><h2 className="font-bold">Valores de XP</h2><p className="text-sm text-slate-500">Valem para ganhos futuros; o XP já acumulado não muda. Os níveis têm limites fixos.</p>
      {FIELDS.map(([k, l]) => <label key={k} className="flex items-center justify-between gap-3 text-sm"><span>{l}</span><input type="number" min={0} max={1000} value={p.settings.xp[k]} onChange={e => setXp(k, Number(e.target.value))} className="w-24 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1 text-right" /></label>)}
      <button className="btn-s" onClick={resetXp}>Restaurar valores padrão</button></div>
    <div className="card space-y-3"><h2 className="font-bold">Backup do progresso</h2><p className="text-sm text-slate-500">Seu progresso fica salvo só neste navegador. Baixe um backup de vez em quando — ou para levar o progresso a outro computador (até existir login com servidor).</p>
      <div className="flex flex-wrap gap-2"><button className="btn-p" onClick={exportData}>⬇️ Baixar backup</button><button className="btn-s" onClick={() => file.current?.click()}>⬆️ Restaurar backup</button><input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={e => importData(e.target.files?.[0])} /></div>
      {msg && <p className="text-sm" role="status">{msg}</p>}</div>
    <div className="card space-y-2"><h2 className="font-bold">Modo editor (conteúdo)</h2><p className="text-sm text-slate-500">Mostra a área “Admin” no menu para criar aulas, questões, flashcards e vídeos de reforço. É um modo local, sem senha: o conteúdo fica só neste navegador.</p><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={content.editor} onChange={e => setEditor(e.target.checked)} /> Ativar modo editor</label></div>
    <div className="card space-y-3"><h2 className="font-bold">Zerar progresso</h2><p className="text-sm text-slate-500">Apaga XP, aulas, respostas, flashcards, erros e anotações. Não dá para desfazer (faça um backup antes).</p>
      {!confirm ? <button className="btn-s" onClick={() => setConfirm(true)}>Zerar tudo…</button> : <div className="flex gap-2"><button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={() => { reset(); setConfirm(false); setMsg('Progresso zerado.') }}>Sim, apagar tudo</button><button className="btn-s" onClick={() => setConfirm(false)}>Cancelar</button></div>}</div></div>
}
