import { isBefore, parseISO, startOfToday } from 'date-fns'
import type { Tenant } from '@/features/tenants/model/types'
import type { DashboardMetrics } from './types'

export function getDashboardMetrics(tenants: Tenant[]): DashboardMetrics {
  const expected = tenants.reduce((total, tenant) => total + tenant.rent, 0)
  const collected = tenants.filter((tenant) => tenant.status === 'Payé').reduce((total, tenant) => total + tenant.rent, 0)
  const late = tenants.filter((tenant) => tenant.status !== 'Payé' && isBefore(parseISO(tenant.dueDate), startOfToday())).length
  const collectionRate = expected ? Math.round((collected / expected) * 100) : 0
  return { expected, collected, unpaid: expected - collected, late, collectionRate }
}
