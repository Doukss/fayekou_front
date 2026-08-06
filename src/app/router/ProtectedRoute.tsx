import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="page-loader">Chargement…</div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
