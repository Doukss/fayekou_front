import { z } from 'zod'
import { tenantSchema } from './tenant.schema'

export type CreateTenantInput = z.infer<typeof tenantSchema>

export interface Tenant {
  id: string
  name: string
  phone: string
  email: string
  unit: string
  rent: number
  status: 'Payé' | 'En attente'
  dueDate: string
}

export interface TenantStore {
  tenantsByAgency: Record<string, Tenant[]>
  getTenants: (agencyId: string) => Tenant[]
  createTenant: (agencyId: string, payload: CreateTenantInput) => void
  deleteTenant: (agencyId: string, tenantId: string) => void
  updateTenant: (agencyId: string, tenantId: string, payload: CreateTenantInput) => void
  togglePaymentStatus: (agencyId: string, tenantId: string) => void
}
