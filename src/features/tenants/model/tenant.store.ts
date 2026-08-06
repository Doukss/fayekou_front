import { subDays } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const STORE_NAME = 'kerguipa-tenant-store'
const initialTenants = [
  { id: 't1', name: 'Mame Diop', phone: '+221 77 123 45 67', email: 'mame.diop@email.sn', unit: 'Appartement 2A', rent: 250000, status: 'Payé', dueDate: subDays(new Date(), 2).toISOString() },
  { id: 't2', name: 'Samba Ndiaye', phone: '+221 76 234 56 78', email: 'samba.ndiaye@email.sn', unit: 'Appartement 3B', rent: 180000, status: 'En attente', dueDate: subDays(new Date(), 6).toISOString() },
  { id: 't3', name: 'Aïssatou Fall', phone: '+221 78 345 67 89', email: 'aissatou.fall@email.sn', unit: 'Studio 1', rent: 320000, status: 'En attente', dueDate: subDays(new Date(), 1).toISOString() },
]

export const useTenantStore = create(persist((set, get) => ({
  tenantsByAgency: {},
  getTenants: (agencyId) => get().tenantsByAgency[agencyId] ?? initialTenants,
  createTenant: (agencyId, payload) => set((state) => {
    const current = state.tenantsByAgency[agencyId] ?? initialTenants
    const tenant = { ...payload, id: crypto.randomUUID(), rent: Number(payload.rent), status: 'En attente' }
    return { tenantsByAgency: { ...state.tenantsByAgency, [agencyId]: [...current, tenant] } }
  }),
  deleteTenant: (agencyId, tenantId) => set((state) => {
    const current = state.tenantsByAgency[agencyId] ?? initialTenants
    return { tenantsByAgency: { ...state.tenantsByAgency, [agencyId]: current.filter((tenant) => tenant.id !== tenantId) } }
  }),
}), { name: STORE_NAME, storage: createJSONStorage(() => localStorage) }))

export function startTenantStoreSync() {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event) => { if (event.key === STORE_NAME) useTenantStore.persist.rehydrate() }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
