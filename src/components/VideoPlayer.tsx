import { parseVideo } from '../lib/video'
import type { Video } from '../types'
// Incorpora YouTube (nocookie) ou Vimeo; outros endereços https viram apenas um link externo.
export default function VideoPlayer({ video }: { video: Video }) {
  const v = parseVideo(video.url)
  if (!v) return <p className="text-sm text-rose-600" role="alert">Link de vídeo inválido.</p>
  const title = video.title?.trim() || 'Vídeo de reforço'
  if (v.kind === 'link') return <p className="text-sm"><a className="underline text-indigo-600" href={v.watchUrl} target="_blank" rel="noopener noreferrer">▶ {title} (abre em {v.host})</a></p>
  return <div className="space-y-1"><div className="aspect-video w-full overflow-hidden rounded-xl bg-black"><iframe className="h-full w-full" src={v.embedUrl} title={title} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox" allow="encrypted-media; picture-in-picture; fullscreen" /></div>
    <p className="text-xs text-slate-500">{title} · {v.provider} · <a className="underline" href={v.watchUrl} target="_blank" rel="noopener noreferrer">abrir no site</a></p></div>
}
