const STORAGE_PREFIX = 'kerguipa_tenants_'
const starterTenants = [{ id: 't1', name: 'Mame Diop', unit: 'Appartement 2A', rent: 250000, status: 'Payé' }, { id: 't2', name: 'Samba Ndiaye', unit: 'Appartement 3B', rent: 180000, status: 'En retard' }, { id: 't3', name: 'Aïssatou Fall', unit: 'Studio 1', rent: 320000, status: 'À relancer' }]
const key = (agencyId) => `${STORAGE_PREFIX}${agencyId}`
export function getTenants(agencyId) { try { return JSON.parse(localStorage.getItem(key(agencyId))) ?? starterTenants } catch { return starterTenants } }
export function saveTenants(agencyId, tenants) { localStorage.setItem(key(agencyId), JSON.stringify(tenants)) }
