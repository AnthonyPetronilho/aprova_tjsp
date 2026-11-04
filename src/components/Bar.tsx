export default function Bar({ pct, color = 'bg-indigo-500' }: { pct: number; color?: string }) {
  return <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} /></div>
}
