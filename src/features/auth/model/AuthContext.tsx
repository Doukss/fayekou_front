import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '@/features/auth/api/auth.api'
import type { AuthContextType, AgencySession, LoginInput, RegisterInput } from '@/features/auth/model/types'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [agency, setAgency] = useState<AgencySession | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    authApi.getSession().then(setAgency).finally(() => setLoading(false))
  }, [])
  const value = useMemo<AuthContextType>(() => ({
    agency,
    loading,
    isAuthenticated: Boolean(agency),
    login: async (data: LoginInput) => { const session = await authApi.login(data); setAgency(session); return session },
    register: async (data: RegisterInput) => { const session = await authApi.register(data); setAgency(session); return session },
    logout: () => { authApi.logout(); setAgency(null) },
  }), [agency, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth doit être utilisé dans AuthProvider.')
  return value
}
