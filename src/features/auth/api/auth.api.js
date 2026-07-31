const ACCOUNTS_KEY = 'kerguipa_accounts'
const SESSION_KEY = 'kerguipa_session'

const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const createError = (message, field) => Object.assign(new Error(message), { field })
const toSession = ({ id, agencyName, email, phone }) => ({ id, agencyName, email, phone })

export async function getSession() { return read(SESSION_KEY, null) }
export async function register({ agencyName, email, phone, password }) {
  if (!agencyName?.trim()) throw createError("Indiquez le nom de l'agence.", 'agencyName')
  if (!/^\S+@\S+\.\S+$/.test(email || '')) throw createError('Saisissez une adresse email valide.', 'email')
  if ((password || '').length < 8) throw createError('Le mot de passe doit contenir au moins 8 caractères.', 'password')
  const accounts = read(ACCOUNTS_KEY, []); const normalizedEmail = email.trim().toLowerCase()
  if (accounts.some((account) => account.email === normalizedEmail)) throw createError('Un compte existe déjà avec cette adresse.', 'email')
  const account = { id: crypto.randomUUID(), agencyName: agencyName.trim(), email: normalizedEmail, phone: phone?.trim() || '', password }
  write(ACCOUNTS_KEY, [...accounts, account]); const session = toSession(account); write(SESSION_KEY, session); return session
}
export async function login({ email, password }) {
  const account = read(ACCOUNTS_KEY, []).find((item) => item.email === email?.trim().toLowerCase())
  if (!account || account.password !== password) throw createError('Email ou mot de passe incorrect.')
  const session = toSession(account); write(SESSION_KEY, session); return session
}
export function logout() { localStorage.removeItem(SESSION_KEY) }
