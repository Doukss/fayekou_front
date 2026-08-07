import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Array<'agency' | 'superadmin'>
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { agency: user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="page-loader">Chargement…</div>
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirige l'utilisateur vers son dashboard approprié s'il n'a pas le bon rôle
    return <Navigate to={user.role === 'superadmin' ? '/admin' : '/dashboard'} replace />
  }

  return <>{children}</>
}
