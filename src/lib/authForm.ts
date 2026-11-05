// Regras de validação iguais às do servidor (server/src/app.js): e-mail válido e senha de 8 a 72 caracteres.
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/
export const validateEmail = (v: string): string => (!v.trim() ? 'Informe seu e-mail.' : EMAIL.test(v.trim()) ? '' : 'Informe um e-mail válido, como nome@exemplo.com.')
export const validatePassword = (v: string): string => (!v ? 'Informe sua senha.' : v.length < 8 || v.length > 72 ? 'A senha precisa ter de 8 a 72 caracteres.' : '')
export const validateConfirm = (pw: string, c: string): string => (!c ? 'Repita a senha.' : pw !== c ? 'As senhas não coincidem.' : '')
// Mensagem amigável para o resultado de authenticate (nunca inclui a senha).
export function authMessage(mode: 'login' | 'register', status: number, serverMsg: string): string {
  if (status === 0) return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
  if (status === 401 && mode === 'login') return 'E-mail ou senha incorretos.'
  if (status === 409) return 'Este e-mail já está cadastrado. Tente entrar.'
  if (status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  if (status >= 500) return 'O servidor teve um problema. Tente novamente em instantes.'
  return serverMsg || 'Não foi possível concluir. Tente novamente.'
}
