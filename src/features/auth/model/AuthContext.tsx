import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth.api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [agency, setAgency] = useState(null); const [loading, setLoading] = useState(true)
  useEffect(() => { authApi.getSession().then(setAgency).finally(() => setLoading(false)) }, [])
  const value = useMemo(() => ({ agency, loading, isAuthenticated: Boolean(agency), login: async (data) => { const session = await authApi.login(data); setAgency(session); return session }, register: async (data) => { const session = await authApi.register(data); setAgency(session); return session }, logout: () => { authApi.logout(); setAgency(null) } }), [agency, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth doit être utilisé dans AuthProvider.'); return value }
