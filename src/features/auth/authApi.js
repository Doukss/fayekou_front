const ACCOUNTS = 'kerguipa_accounts'
const SESSION = 'kerguipa_session'
const get = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
const put = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const error = (message, field) => Object.assign(new Error(message), { field })
const publicAccount = ({ id, agencyName, email, phone }) => ({ id, agencyName, email, phone })

export async function getSession() { return get(SESSION, null) }
export async function register({ agencyName, email, phone, password }) {
  if (!agencyName?.trim()) throw error("Indiquez le nom de l'agence.", 'agencyName')
  if (!/^\S+@\S+\.\S+$/.test(email || '')) throw error('Saisissez une adresse email valide.', 'email')
  if ((password || '').length < 8) throw error('Le mot de passe doit contenir au moins 8 caractères.', 'password')
  const accounts = get(ACCOUNTS, []); const normalizedEmail = email.trim().toLowerCase()
  if (accounts.some((account) => account.email === normalizedEmail)) throw error('Un compte existe déjà avec cette adresse.', 'email')
  const account = { id: crypto.randomUUID(), agencyName: agencyName.trim(), email: normalizedEmail, phone: phone?.trim() || '', password }
  put(ACCOUNTS, [...accounts, account]); const session = publicAccount(account); put(SESSION, session); return session
}
export async function login({ email, password }) {
  const account = get(ACCOUNTS, []).find((item) => item.email === email?.trim().toLowerCase())
  if (!account || account.password !== password) throw error('Email ou mot de passe incorrect.')
  const session = publicAccount(account); put(SESSION, session); return session
}
export function logout() { localStorage.removeItem(SESSION) }
