import { AuthProvider } from '../../features/auth/model/AuthContext.jsx'
import { useEffect } from 'react'
import { startTenantStoreSync } from '../../features/tenants/model/tenant.store.js'

export default function AppProviders({ children }) {
  useEffect(() => startTenantStoreSync(), [])
  return <AuthProvider>{children}</AuthProvider>
}
