import { subDays } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const STORE_NAME = 'kerguipa-tenant-store'
const initialTenants = [
  { id: 't1', name: 'Mame Diop', unit: 'Appartement 2A', rent: 250000, status: 'Payé', dueDate: subDays(new Date(), 2).toISOString() },
  { id: 't2', name: 'Samba Ndiaye', unit: 'Appartement 3B', rent: 180000, status: 'En attente', dueDate: subDays(new Date(), 6).toISOString() },
  { id: 't3', name: 'Aïssatou Fall', unit: 'Studio 1', rent: 320000, status: 'En attente', dueDate: subDays(new Date(), 1).toISOString() },
]

export const useTenantStore = create(persist((set, get) => ({
  tenantsByAgency: {},
  getTenants: (agencyId) => get().tenantsByAgency[agencyId] ?? initialTenants,
  createTenant: (agencyId, payload) => set((state) => {
    const current = state.tenantsByAgency[agencyId] ?? initialTenants
    const tenant = { ...payload, id: crypto.randomUUID(), rent: Number(payload.rent), status: 'En attente' }
    return { tenantsByAgency: { ...state.tenantsByAgency, [agencyId]: [...current, tenant] } }
  }),
}), { name: STORE_NAME, storage: createJSONStorage(() => localStorage) }))

export function startTenantStoreSync() {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event) => { if (event.key === STORE_NAME) useTenantStore.persist.rehydrate() }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
