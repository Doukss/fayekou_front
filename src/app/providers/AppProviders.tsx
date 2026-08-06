import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { AuthProvider } from '@/features/auth'
import { startTenantStoreSync } from '@/features/tenants'

export default function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => startTenantStoreSync(), [])
  return <AuthProvider>{children}</AuthProvider>
}
