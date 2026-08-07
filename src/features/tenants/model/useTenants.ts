import { useCallback } from 'react'
import { useTenantStore } from '@/features/tenants/model/tenant.store'
import type { Tenant, CreateTenantInput } from '@/features/tenants/model/types'

export interface UseTenantsResult {
  tenants: Tenant[]
  createTenant: (input: CreateTenantInput) => void
  deleteTenant: (tenantId: string) => void
  updateTenant: (tenantId: string, input: CreateTenantInput) => void
  togglePaymentStatus: (tenantId: string) => void
}

export function useTenants(agencyId: string): UseTenantsResult {
  const tenants = useTenantStore((state) => state.tenantsByAgency[agencyId] ?? state.getTenants(agencyId))
  const addTenant = useTenantStore((state) => state.createTenant)
  const removeTenant = useTenantStore((state) => state.deleteTenant)
  const editTenant = useTenantStore((state) => state.updateTenant)
  const toggleStatus = useTenantStore((state) => state.togglePaymentStatus)

  const createTenant = useCallback((input: CreateTenantInput) => addTenant(agencyId, input), [addTenant, agencyId])
  const deleteTenant = useCallback((tenantId: string) => removeTenant(agencyId, tenantId), [agencyId, removeTenant])
  const updateTenant = useCallback((tenantId: string, input: CreateTenantInput) => editTenant(agencyId, tenantId, input), [agencyId, editTenant])
  const togglePaymentStatus = useCallback((tenantId: string) => toggleStatus(agencyId, tenantId), [agencyId, toggleStatus])

  return { tenants, createTenant, deleteTenant, updateTenant, togglePaymentStatus }
}
