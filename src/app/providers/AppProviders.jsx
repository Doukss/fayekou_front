import { AuthProvider } from '../../features/auth/model/AuthContext.jsx'

export default function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
