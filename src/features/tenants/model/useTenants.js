import { useCallback, useEffect, useState } from 'react'
import { getTenants, saveTenants } from '../api/tenant.repository.js'

export function useTenants(agencyId) {
  const [tenants, setTenants] = useState([])
  useEffect(() => { if (agencyId) setTenants(getTenants(agencyId)) }, [agencyId])
  const createTenant = useCallback((input) => { const tenant = { ...input, id: crypto.randomUUID(), rent: Number(input.rent), status: 'À relancer' }; setTenants((current) => { const next = [...current, tenant]; saveTenants(agencyId, next); return next }); return tenant }, [agencyId])
  return { tenants, createTenant }
}
