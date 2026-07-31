import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/model/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="page-loader">Chargement…</div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
