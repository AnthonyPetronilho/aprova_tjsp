import { useRef, useState, type FormEvent } from 'react'
import PublicShell from '../components/PublicShell'
import { signIn, setFlash, clearFlash } from '../lib/auth'
import { authMessage, validateConfirm, validateEmail, validatePassword } from '../lib/authForm'
import { useSyncState } from '../lib/sync'
import type { Store } from '../lib/useProgress'

function Field({ id, label, error, children }: { id: string; label: string; error: string; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="block text-sm font-semibold mb-1">{label}</label>{children}{error && <p id={`${id}-err`} className="text-sm text-rose-600 dark:text-rose-400 mt-1">{error}</p>}</div>
}
function PasswordInput({ id, value, onChange, error, autoComplete, placeholder }: { id: string; value: string; onChange: (v: string) => void; error: string; autoComplete: string; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return <div className="relative">
    <input id={id} name={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className="inp pr-24" />
    <button type="button" onClick={() => setShow(v => !v)} aria-pressed={show} aria-controls={id} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">{show ? 'Ocultar' : 'Mostrar'}<span className="sr-only"> senha</span></button>
  </div>
}

function AuthForm({ mode, s, next }: { mode: 'login' | 'register'; s: Store; next: string | null }) {
  const reg = mode === 'register', sy = useSyncState()
  const [email, setEmail] = useState(''), [pw, setPw] = useState(''), [pw2, setPw2] = useState('')
  const [errs, setErrs] = useState<{ email?: string; pw?: string; pw2?: string }>({}), [formErr, setFormErr] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const expired = !reg && !!sy.msg?.startsWith('Sessão expirada')
  const other = `#/${reg ? 'login' : 'register'}${next ? `?next=${encodeURIComponent(next)}` : ''}`
  const submit = async (e: FormEvent) => {
    e.preventDefault(); if (busy) return
    const v = { email: validateEmail(email), pw: reg ? validatePassword(pw) : (pw ? '' : 'Informe sua senha.'), pw2: reg ? validateConfirm(pw, pw2) : '' }
    setErrs(v); setFormErr('')
    if (v.email) { emailRef.current?.focus(); return }
    if (v.pw) { document.getElementById('pw')?.focus(); return }
    if (v.pw2) { document.getElementById('pw2')?.focus(); return }
    setBusy(true)
    if (reg) setFlash('shell', 'Conta criada! Seu progresso agora é salvo e sincronizado.')
    const r = await signIn(mode, email.trim(), pw) // a senha só é enviada ao servidor; não é guardada nem registrada
    if (r.ok) { setDone(true); return } // a navegação para o destino acontece pela proteção de rotas
    clearFlash()
    setBusy(false); setFormErr(authMessage(mode, r.status, r.message)); setPw(''); if (reg) setPw2(''); setTimeout(() => document.getElementById(r.status === 409 ? 'email' : 'pw')?.focus(), 0)
  }
  return <PublicShell dark={s.p.dark} toggleDark={s.toggleDark}>
    <div className="card mt-4 md:mt-10 space-y-4">
      <div><h1 className="text-2xl font-bold">{reg ? 'Criar conta' : 'Entrar'}</h1><p className="text-sm text-slate-500 mt-1">{reg ? 'Crie sua conta para salvar e sincronizar seu progresso.' : 'Entre para continuar seus estudos.'}</p></div>
      {expired && <p role="status" className="rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-2 text-sm">Sua sessão expirou. Entre novamente — seu progresso neste aparelho foi mantido.</p>}
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field id="email" label="E-mail" error={errs.email ?? ''}>
          <input ref={emailRef} id="email" name="email" type="email" inputMode="email" autoComplete="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!errs.email} aria-describedby={errs.email ? 'email-err' : undefined} className="inp" placeholder="nome@exemplo.com" /></Field>
        <Field id="pw" label="Senha" error={errs.pw ?? ''}>
          <PasswordInput id="pw" value={pw} onChange={setPw} error={errs.pw ?? ''} autoComplete={reg ? 'new-password' : 'current-password'} placeholder={reg ? 'Mínimo de 8 caracteres' : undefined} /></Field>
        {reg && <Field id="pw2" label="Repita a senha" error={errs.pw2 ?? ''}><PasswordInput id="pw2" value={pw2} onChange={setPw2} error={errs.pw2 ?? ''} autoComplete="new-password" /></Field>}
        {formErr && <p role="alert" className="rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 px-3 py-2 text-sm">{formErr}{formErr.includes('já está cadastrado') && <> <a className="lnk" href={`#/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Ir para o login</a></>}</p>}
        <button type="submit" className="btn-p w-full" disabled={busy} aria-busy={busy}>{done ? (reg ? 'Conta criada ✓' : 'Entrando…') : busy ? (reg ? 'Criando conta…' : 'Entrando…') : reg ? 'Criar conta' : 'Entrar'}</button>
      </form>
      <p className="text-sm text-center text-slate-600 dark:text-slate-300">{reg ? 'Já tem conta?' : 'Ainda não tem conta?'} <a href={other} className="lnk">{reg ? 'Entrar' : 'Criar conta'}</a></p>
    </div>
  </PublicShell>
}
export const Login = ({ s, next }: { s: Store; next: string | null }) => <AuthForm mode="login" s={s} next={next} />
export const Register = ({ s, next }: { s: Store; next: string | null }) => <AuthForm mode="register" s={s} next={next} />
