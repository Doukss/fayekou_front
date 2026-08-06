import type { LoginInput, RegisterInput, AgencySession } from '@/features/auth/model/types'

const ACCOUNTS_KEY = 'kerguipa_accounts'
const SESSION_KEY = 'kerguipa_session'

interface Account extends AgencySession {
  password: string
}

interface AuthError extends Error {
  field?: string
}

function read<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function createError(message: string, field?: string): AuthError {
  return Object.assign(new Error(message), { field })
}

function toSession(account: Account): AgencySession {
  return { id: account.id, agencyName: account.agencyName, email: account.email, phone: account.phone }
}

export async function getSession(): Promise<AgencySession | null> {
  return read<AgencySession | null>(SESSION_KEY, null)
}

export async function register({ agencyName, email, phone, password }: RegisterInput): Promise<AgencySession> {
  if (!agencyName?.trim()) throw createError("Indiquez le nom de l'agence.", 'agencyName')
  if (!/^\S+@\S+\.\S+$/.test(email || '')) throw createError('Saisissez une adresse email valide.', 'email')
  if ((password || '').length < 8) throw createError('Le mot de passe doit contenir au moins 8 caractères.', 'password')
  const accounts = read<Account[]>(ACCOUNTS_KEY, [])
  const normalizedEmail = email.trim().toLowerCase()
  if (accounts.some((account) => account.email === normalizedEmail)) throw createError('Un compte existe déjà avec cette adresse.', 'email')
  const account: Account = { id: crypto.randomUUID(), agencyName: agencyName.trim(), email: normalizedEmail, phone: phone?.trim() || '', password }
  write(ACCOUNTS_KEY, [...accounts, account])
  const session = toSession(account)
  write(SESSION_KEY, session)
  return session
}

export async function login({ email, password }: LoginInput): Promise<AgencySession> {
  const account = read<Account[]>(ACCOUNTS_KEY, []).find((item) => item.email === email?.trim().toLowerCase())
  if (!account || account.password !== password) throw createError('Email ou mot de passe incorrect.')
  const session = toSession(account)
  write(SESSION_KEY, session)
  return session
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
