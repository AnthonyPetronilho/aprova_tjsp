// Interpreta links de vídeo colados pelo usuário. Só vídeos do YouTube e do Vimeo são incorporados (embed);
// qualquer outro link https vira um link externo. Nenhum link é inventado ou sugerido pelo app.
export type VideoInfo = { kind: 'embed'; provider: 'YouTube' | 'Vimeo'; embedUrl: string; watchUrl: string } | { kind: 'link'; watchUrl: string; host: string }
const YT = /^[A-Za-z0-9_-]{11}$/
export function parseVideo(raw: string): VideoInfo | null {
  let u: URL
  try { u = new URL(raw.trim()) } catch { return null }
  if (u.protocol !== 'https:') return null
  const h = u.hostname.replace(/^www\.|^m\./, '')
  let id: string | null = null
  if (h === 'youtu.be') id = u.pathname.slice(1).split('/')[0]
  else if (h === 'youtube.com' || h === 'youtube-nocookie.com') {
    const parts = u.pathname.split('/').filter(Boolean)
    if (u.pathname === '/watch') id = u.searchParams.get('v')
    else if (['embed', 'shorts', 'live'].includes(parts[0])) id = parts[1] ?? null
  }
  if (id !== null) {
    if (!YT.test(id)) return null
    const t = Number(u.searchParams.get('t')?.replace(/s$/, '') ?? u.searchParams.get('start') ?? 0)
    return { kind: 'embed', provider: 'YouTube', embedUrl: `https://www.youtube-nocookie.com/embed/${id}${t > 0 && Number.isFinite(t) ? `?start=${Math.floor(t)}` : ''}`, watchUrl: `https://www.youtube.com/watch?v=${id}` }
  }
  if (h === 'vimeo.com' || h === 'player.vimeo.com') {
    const m = u.pathname.match(/(?:\/video)?\/(\d{5,})/)
    if (!m) return null
    return { kind: 'embed', provider: 'Vimeo', embedUrl: `https://player.vimeo.com/video/${m[1]}`, watchUrl: `https://vimeo.com/${m[1]}` }
  }
  return { kind: 'link', watchUrl: u.toString(), host: h }
}
