import { z } from 'zod'
import { loginSchema, registerSchema } from './auth.schema'

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export interface UserSession {
  id: string
  name: string // "agencyName" pour les agences, "Super Admin" pour le superadmin
  email: string
  phone: string
  role: 'agency' | 'superadmin'
  isValidated?: boolean
  plan?: string
}

export interface AuthContextType {
  agency: UserSession | null
  loading: boolean
  isAuthenticated: boolean
  login: (data: LoginInput) => Promise<UserSession>
  register: (data: RegisterInput) => Promise<UserSession>
  logout: () => void
}
