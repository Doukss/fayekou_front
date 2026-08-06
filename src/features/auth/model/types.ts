import { z } from 'zod'
import { loginSchema, registerSchema } from './auth.schema'

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export interface AgencySession {
  id: string
  agencyName: string
  email: string
  phone: string
}

export interface AuthContextType {
  agency: AgencySession | null
  loading: boolean
  isAuthenticated: boolean
  login: (data: LoginInput) => Promise<AgencySession>
  register: (data: RegisterInput) => Promise<AgencySession>
  logout: () => void
}
