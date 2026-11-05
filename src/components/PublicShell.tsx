import type { ReactNode } from 'react'
// Moldura das telas públicas (boas-vindas, login, cadastro): logo, alternância de tema e conteúdo centralizado.
export default function PublicShell({ dark, toggleDark, children, wide }: { dark: boolean; toggleDark: () => void; children: ReactNode; wide?: boolean }) {
  return <div className="min-h-screen flex flex-col">
    <header className={`w-full mx-auto ${wide ? 'max-w-5xl' : 'max-w-md'} px-4 py-4 flex items-center justify-between`}>
      <a href="#/" className="font-extrabold text-xl text-indigo-600 dark:text-indigo-400 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">🎓 Aprova TJSP</a>
      <button className="btn-s !px-3 !py-1.5 text-sm" onClick={toggleDark} aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}>{dark ? '☀️' : '🌙'}</button>
    </header>
    <main className={`w-full mx-auto flex-1 ${wide ? 'max-w-5xl' : 'max-w-md'} px-4 pb-10`}>{children}</main>
  </div>
}
