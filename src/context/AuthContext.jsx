import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../features/auth/authApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [agency, setAgency] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { authApi.getSession().then(setAgency).finally(() => setLoading(false)) }, [])
  const login = async (data) => { const session = await authApi.login(data); setAgency(session); return session }
  const register = async (data) => { const session = await authApi.register(data); setAgency(session); return session }
  const logout = () => { authApi.logout(); setAgency(null) }
  return <AuthContext.Provider value={{ agency, loading, isAuthenticated: Boolean(agency), login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider.')
  return context
}
