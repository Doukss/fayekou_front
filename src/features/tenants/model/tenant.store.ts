import { subDays } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Tenant, CreateTenantInput, TenantStore } from '@/features/tenants/model/types'

const STORE_NAME = 'kerguipa-tenant-store'

const initialTenants: Tenant[] = [
  { id: 't1', name: 'Mame Diop', phone: '+221 77 123 45 67', email: 'mame.diop@email.sn', unit: 'Appartement 2A', rent: 250000, status: 'Payé', dueDate: subDays(new Date(), 2).toISOString() },
  { id: 't2', name: 'Samba Ndiaye', phone: '+221 76 234 56 78', email: 'samba.ndiaye@email.sn', unit: 'Appartement 3B', rent: 180000, status: 'En attente', dueDate: subDays(new Date(), 6).toISOString() },
  { id: 't3', name: 'Aïssatou Fall', phone: '+221 78 345 67 89', email: 'aissatou.fall@email.sn', unit: 'Studio 1', rent: 320000, status: 'En attente', dueDate: subDays(new Date(), 1).toISOString() },
]

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      tenantsByAgency: {},
      getTenants: (agencyId: string) => get().tenantsByAgency[agencyId] ?? initialTenants,
      createTenant: (agencyId: string, payload: CreateTenantInput) => set((state) => {
        const current = state.tenantsByAgency[agencyId] ?? initialTenants
        const tenant: Tenant = { 
          ...payload, 
          id: crypto.randomUUID(), 
          rent: Number(payload.rent), 
          status: 'En attente' 
        }
        return { tenantsByAgency: { ...state.tenantsByAgency, [agencyId]: [...current, tenant] } }
      }),
      deleteTenant: (agencyId: string, tenantId: string) => set((state) => {
        const current = state.tenantsByAgency[agencyId] ?? initialTenants
        return { tenantsByAgency: { ...state.tenantsByAgency, [agencyId]: current.filter((tenant) => tenant.id !== tenantId) } }
      }),
      updateTenant: (agencyId: string, tenantId: string, payload: CreateTenantInput) => set((state) => {
        const current = state.tenantsByAgency[agencyId] ?? initialTenants
        const updated = current.map((t) => 
          t.id === tenantId 
            ? { ...t, ...payload, rent: Number(payload.rent) } 
            : t
        )
        return { tenantsByAgency: { ...state.tenantsByAgency, [agencyId]: updated } }
      }),
      togglePaymentStatus: (agencyId: string, tenantId: string) => set((state) => {
        const current = state.tenantsByAgency[agencyId] ?? initialTenants
        const updated = current.map((t) => {
          if (t.id === tenantId) {
            const nextStatus: 'Payé' | 'En attente' = t.status === 'Payé' ? 'En attente' : 'Payé'
            return { ...t, status: nextStatus }
          }
          return t
        })
        return { tenantsByAgency: { ...state.tenantsByAgency, [agencyId]: updated } }
      })
    }),
    { name: STORE_NAME, storage: createJSONStorage(() => localStorage) }
  )
)

export function startTenantStoreSync(): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORE_NAME) useTenantStore.persist.rehydrate()
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
