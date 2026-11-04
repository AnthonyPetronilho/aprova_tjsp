import { useEffect, useMemo, useRef, useState } from 'react'
import { THEMES } from '../data/essays'
import { analyzeEssay } from '../lib/essay'
import { fmtClock } from '../lib/mocks'
import { todayStr } from '../lib/dates'
import type { Store } from '../lib/useProgress'
const chip = (on: boolean) => `px-3 py-1 rounded-full text-sm border ${on ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`
const fmtDate = (d: string) => d.split('-').reverse().join('/')
const CRITERIA = [
  ['Tema', 'O texto trata exatamente do tema proposto? (fugir completamente do tema zera a prova)'],
  ['Estrutura e coerência', 'Há introdução, desenvolvimento e conclusão? Defendi um ponto de vista claro, com argumentos desenvolvidos e conclusão que decorre do que escrevi?'],
  ['Língua', 'Revisei concordância, regência, ortografia, acentuação, pontuação e o registro formal?'],
  ['Coesão', 'Usei conectivos adequados e dividi o texto em parágrafos bem articulados?'],
]
function Flags({ text, sources }: { text: string; sources: string[] }) {
  const a = useMemo(() => analyzeEssay(text, sources), [text, sources])
  return <div className="space-y-2"><p className="text-sm">{a.words} palavra(s) · {a.paragraphs} parágrafo(s)</p>
    {!a.words ? <p className="text-sm text-slate-500">Escreva algo para ver a checagem.</p> : a.flags.length ? <ul className="space-y-2">{a.flags.map(f => <li key={f.id} className={`text-sm rounded-xl p-3 ${f.level === 'atencao' ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>{f.level === 'atencao' ? '⚠️' : 'ℹ️'} {f.text}</li>)}</ul> : <p className="text-sm text-emerald-700 dark:text-emerald-400">✅ Nenhum dos pontos automáticos do edital foi detectado. Isso não é uma nota: leia o texto com os critérios abaixo.</p>}
    <p className="text-xs text-slate-500">Checagem automática simples (padrões de texto). Não é correção oficial da VUNESP nem estimativa de nota.</p></div>
}
export default function Essay({ s }: { s: Store }) {
  const { p, saveDraft, saveEssay, deleteEssay } = s
  const [tab, setTab] = useState<'write' | 'history'>('write'), [tid, setTid] = useState(THEMES[0].id)
  const theme = THEMES.find(t => t.id === tid)!, sources = theme.texts
  const [text, setText] = useState(p.essayDrafts[tid] ?? ''), [showCheck, setShowCheck] = useState(false), [msg, setMsg] = useState(''), [open, setOpen] = useState<string | null>(null)
  const [secs, setSecs] = useState(0), [running, setRunning] = useState(false), [limit, setLimit] = useState(0), tRef = useRef<number>()
  const pickTheme = (id: string) => { saveDraft(tid, text); setTid(id); setText(p.essayDrafts[id] ?? ''); setSecs(0); setRunning(false); setMsg('') }
  useEffect(() => { if (!running) return; const i = window.setInterval(() => setSecs(x => x + 1), 1000); return () => window.clearInterval(i) }, [running])
  useEffect(() => { if (limit && secs >= limit && running) setRunning(false) }, [secs, limit, running])
  useEffect(() => { window.clearTimeout(tRef.current); tRef.current = window.setTimeout(() => saveDraft(tid, text), 800); return () => window.clearTimeout(tRef.current) }, [text, tid, saveDraft])
  const save = () => { if (!text.trim()) return; saveEssay({ id: `e${Date.now()}`, themeId: tid, text, savedAt: todayStr(), seconds: secs }); saveDraft(tid, ''); setText(''); setSecs(0); setRunning(false); setMsg('Redação salva no histórico.') }
  const reedit = (id: string) => { const e = p.essays.find(x => x.id === id)!; setTid(e.themeId); setText(e.text); setSecs(0); setTab('write'); setMsg('Texto carregado para edição. Ao salvar, vira uma nova versão no histórico.') }
  return <div className="space-y-4 max-w-3xl"><h1 className="text-2xl font-bold">✍️ Laboratório de Redação</h1>
    <div className="flex gap-2"><button className={chip(tab === 'write')} onClick={() => setTab('write')}>Escrever</button><button className={chip(tab === 'history')} onClick={() => setTab('history')}>Histórico ({p.essays.length})</button></div>
    {tab === 'write' ? <>
      <div className="card space-y-2"><h2 className="font-bold">Critérios do edital</h2><p className="text-sm">Texto dissertativo-argumentativo em prosa, avaliado em <b>Tema</b>, <b>Estrutura</b> (gênero e coerência), <b>Língua</b> e <b>Coesão</b>. Escala de 0 a 40 pontos; é aprovado quem obtém 24 ou mais (19,2 para vagas reservadas a candidatos negros, indígenas, quilombolas ou com deficiência). O título não é considerado na avaliação.</p></div>
      <div className="flex flex-wrap gap-2">{THEMES.map(t => <button key={t.id} onClick={() => pickTheme(t.id)} className={chip(t.id === tid)}>{t.title}</button>)}</div>
      <div className="card space-y-3"><h2 className="font-bold">Proposta</h2><p>{theme.prompt}</p><details><summary className="cursor-pointer font-semibold text-sm">Textos motivadores (elaborados para treino)</summary><div className="space-y-2 mt-2 text-sm">{theme.texts.map((t, i) => <p key={i} className="border-l-4 border-indigo-300 pl-3">{t}</p>)}</div></details>
        <details><summary className="cursor-pointer font-semibold text-sm">Como estruturar</summary><ul className="list-disc ml-5 mt-2 text-sm space-y-1"><li><b>Introdução:</b> apresente o tema e deixe claro o seu ponto de vista (tese).</li><li><b>Desenvolvimento:</b> um ou dois parágrafos com argumentos e exemplos que sustentem a tese, usando conectivos para ligar as ideias.</li><li><b>Conclusão:</b> retome a tese e feche com uma proposta ou síntese que decorra do que foi dito.</li><li>Prefira linguagem impessoal; evite 1ª e 2ª pessoa e referências como “segundo o texto I”.</li></ul><p className="text-sm mt-2"><b>Dica deste tema:</b> {theme.tip}</p></details></div>
      <div className="card space-y-3"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-lg" role="timer">⏱️ {fmtClock(secs)}{limit ? ` / ${fmtClock(limit)}` : ''}</span><button className="btn-s !py-1" onClick={() => setRunning(!running)}>{running ? 'Pausar' : secs ? 'Continuar' : 'Iniciar cronômetro'}</button><button className="btn-s !py-1" onClick={() => { setSecs(0); setRunning(false) }}>Zerar</button><label className="text-sm ml-auto">Limite <select value={limit} onChange={e => setLimit(Number(e.target.value))} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1"><option value={0}>sem limite</option><option value={1800}>30 min</option><option value={3600}>60 min</option><option value={5400}>90 min</option></select></label></div>
        <label className="block"><span className="font-semibold text-sm">Seu texto</span><textarea value={text} onChange={e => { setText(e.target.value); setMsg('') }} rows={16} maxLength={8000} placeholder="Escreva aqui (o rascunho é salvo automaticamente). Na prova real o texto é manuscrito." className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 leading-relaxed" /></label>
        <div className="flex flex-wrap gap-2"><button className="btn-p" disabled={!text.trim()} onClick={save}>Salvar no histórico</button><button className="btn-s" onClick={() => setShowCheck(!showCheck)}>{showCheck ? 'Esconder checagem' : 'Checar meu texto'}</button><button className="btn-s" disabled title="Depende da Tutora (Fase 5), que exige backend seguro">🤖 Análise por IA (em breve)</button><button className="btn-s" disabled title="Depende de reconhecimento de texto (OCR)">📷 Enviar foto manuscrita (em breve)</button></div>
        {msg && <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">{msg}</p>}
        {showCheck && <Flags text={text} sources={sources} />}</div>
      <div className="card"><h2 className="font-bold mb-2">Autoavaliação pelos critérios</h2><p className="text-xs text-slate-500 mb-2">Releia seu texto com estas perguntas. Não gera nota: os pesos de cada critério não constam no edital.</p><ul className="space-y-2 text-sm">{CRITERIA.map(([t, q]) => <li key={t}><b>{t}:</b> {q}</li>)}</ul></div></>
    : <div className="space-y-3">{!p.essays.length && <div className="card">Nenhuma redação salva ainda.</div>}{[...p.essays].reverse().map(e => { const th = THEMES.find(t => t.id === e.themeId), isOpen = open === e.id; return <div key={e.id} className="card space-y-2"><div className="flex flex-wrap items-center gap-2"><div className="flex-1 min-w-[12rem]"><p className="font-semibold">{th?.title ?? 'Tema removido'}</p><p className="text-xs text-slate-500">{fmtDate(e.savedAt)} · {e.text.trim().split(/\s+/).length} palavras · {fmtClock(e.seconds)}</p></div><button className="btn-s !py-1 text-sm" onClick={() => setOpen(isOpen ? null : e.id)}>{isOpen ? 'Fechar' : 'Abrir'}</button><button className="btn-s !py-1 text-sm" onClick={() => reedit(e.id)}>Reeditar</button><button className="underline text-xs text-rose-600" onClick={() => deleteEssay(e.id)}>Excluir</button></div>{isOpen && <><p className="whitespace-pre-line text-sm border-l-4 border-slate-300 pl-3">{e.text}</p><Flags text={e.text} sources={th?.texts ?? []} /></>}</div> })}</div>}</div>
}
