export function getDashboardMetrics(tenants) {
  const expected = tenants.reduce((total, tenant) => total + tenant.rent, 0)
  const collected = tenants.filter((tenant) => tenant.status === 'Payé').reduce((total, tenant) => total + tenant.rent, 0)
  return { expected, collected, unpaid: expected - collected, late: tenants.filter((tenant) => tenant.status === 'En retard').length }
}
