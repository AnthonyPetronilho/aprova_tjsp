import type { Toast } from '../lib/useProgress'
export default function Toasts({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return <div className="fixed top-3 right-3 z-50 space-y-2 max-w-xs" role="status" aria-live="polite">{toasts.map(t => <button key={t.id} onClick={() => dismiss(t.id)} className="block w-full text-left rounded-xl bg-indigo-600 text-white px-4 py-3 shadow-lg">{t.text}</button>)}</div>
}
