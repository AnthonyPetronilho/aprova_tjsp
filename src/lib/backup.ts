// Cópias de segurança automáticas no navegador, antes de qualquer operação que possa alterar muitos dados
// (migração de formato, mesclagem com o servidor, restaurar arquivo, zerar). Mantém as 3 mais recentes de cada tipo.
const P = 'aprova-tjsp:backup:'
const allKeys = (): string[] => { const o: string[] = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k) o.push(k) } return o }
export interface BackupInfo { key: string; label: string; at: string; bytes: number }
export function backup(label: string, json: string): void {
  try {
    const at = new Date().toISOString(), key = `${P}${label}:${at}`
    const old = allKeys().filter(k => k.startsWith(`${P}${label}:`)).sort()
    for (const k of old.slice(0, Math.max(0, old.length - 2))) localStorage.removeItem(k)
    try { localStorage.setItem(key, json) } catch { // sem espaço: descarta as cópias mais antigas e tenta de novo
      for (const k of allKeys().filter(k => k.startsWith(P)).sort()) { localStorage.removeItem(k); try { localStorage.setItem(key, json); break } catch { /* tenta de novo */ } }
    }
  } catch { /* localStorage indisponível */ }
}
export function listBackups(): BackupInfo[] {
  try {
    return allKeys().filter(k => k.startsWith(P)).sort().reverse().map(key => { const [label, ...at] = key.slice(P.length).split(':'); return { key, label, at: at.join(':'), bytes: (localStorage.getItem(key) ?? '').length } })
  } catch { return [] }
}
export const readBackup = (key: string): string | null => { try { return key.startsWith(P) ? localStorage.getItem(key) : null } catch { return null } }
