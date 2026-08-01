import { useCallback } from 'react'
import { useTenantStore } from './tenant.store.js'

export function useTenants(agencyId) {
  const tenants = useTenantStore((state) => state.tenantsByAgency[agencyId] ?? state.getTenants(agencyId))
  const addTenant = useTenantStore((state) => state.createTenant)
  const removeTenant = useTenantStore((state) => state.deleteTenant)
  const createTenant = useCallback((input) => addTenant(agencyId, input), [addTenant, agencyId])
  const deleteTenant = useCallback((tenantId) => removeTenant(agencyId, tenantId), [agencyId, removeTenant])
  return { tenants, createTenant, deleteTenant }
}
