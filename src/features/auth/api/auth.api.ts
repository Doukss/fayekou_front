import type { LoginInput, RegisterInput, UserSession } from '@/features/auth/model/types'

const ACCOUNTS_KEY = 'kerguipa_accounts'
const SESSION_KEY = 'kerguipa_session'

export interface Account {
  id: string
  agencyName: string
  email: string
  phone: string
  password?: string
  isValidated: boolean
  plan: string
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

function toSession(account: Account): UserSession {
  return {
    id: account.id,
    name: account.agencyName,
    email: account.email,
    phone: account.phone,
    role: 'agency',
    isValidated: account.isValidated,
    plan: account.plan,
  }
}

export async function getSession(): Promise<UserSession | null> {
  const session = read<UserSession | null>(SESSION_KEY, null)
  
  // Si c'est une agence, on recharge depuis localStorage pour avoir le statut de validation à jour
  if (session && session.role === 'agency') {
    const accounts = read<Account[]>(ACCOUNTS_KEY, [])
    const freshAccount = accounts.find((acc) => acc.id === session.id)
    if (freshAccount) {
      const updatedSession = toSession(freshAccount)
      write(SESSION_KEY, updatedSession)
      return updatedSession
    }
  }
  return session
}

export async function register({ agencyName, email, phone, password }: RegisterInput): Promise<UserSession> {
  if (!agencyName?.trim()) throw createError("Indiquez le nom de l'agence.", 'agencyName')
  if (!/^\S+@\S+\.\S+$/.test(email || '')) throw createError('Saisissez une adresse email valide.', 'email')
  if ((password || '').length < 8) throw createError('Le mot de passe doit contenir au moins 8 caractères.', 'password')
  
  const normalizedEmail = email.trim().toLowerCase()
  
  // Vérification de collision avec le Super Admin
  if (normalizedEmail === 'dmbodji297@gmail.com') {
    throw createError('Cette adresse email est réservée.', 'email')
  }

  const accounts = read<Account[]>(ACCOUNTS_KEY, [])
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw createError('Un compte existe déjà avec cette adresse.', 'email')
  }

  const account: Account = {
    id: crypto.randomUUID(),
    agencyName: agencyName.trim(),
    email: normalizedEmail,
    phone: phone?.trim() || '',
    password,
    isValidated: false, // Par défaut, non validée à l'inscription
    plan: 'PLAN DÉMARRAGE',
  }

  write(ACCOUNTS_KEY, [...accounts, account])
  const session = toSession(account)
  write(SESSION_KEY, session)
  return session
}

export async function login({ email, password }: LoginInput): Promise<UserSession> {
  const normalizedEmail = email?.trim().toLowerCase()
  
  // 1. Vérification Super Admin hardcodé
  if (normalizedEmail === 'dmbodji297@gmail.com') {
    if (password === 'admin322') {
      const superAdminSession: UserSession = {
        id: 'superadmin-id',
        name: 'Super Admin',
        email: 'dmbodji297@gmail.com',
        phone: '',
        role: 'superadmin',
      }
      write(SESSION_KEY, superAdminSession)
      return superAdminSession
    } else {
      throw createError('Email ou mot de passe incorrect.')
    }
  }

  // 2. Vérification Agences dans localStorage
  const account = read<Account[]>(ACCOUNTS_KEY, []).find((item) => item.email === normalizedEmail)
  if (!account || account.password !== password) {
    throw createError('Email ou mot de passe incorrect.')
  }

  const session = toSession(account)
  write(SESSION_KEY, session)
  return session
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
