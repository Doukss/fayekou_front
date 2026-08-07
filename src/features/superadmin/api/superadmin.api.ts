import type { AdminAgency, AdminPlan, SystemStats } from '../model/types'
import type { Tenant } from '@/features/tenants/model/types'

const ACCOUNTS_KEY = 'kerguipa_accounts'
const PLANS_KEY = 'kerguipa_plans'
const TENANT_STORE_KEY = 'kerguipa-tenant-store'

const DEFAULT_PLANS: AdminPlan[] = [
  { id: '1', name: 'PLAN DÉMARRAGE', price: 25000, features: ['Jusqu’à 15 locataires', 'Relances SMS & WhatsApp', 'Support Standard'], isActive: true },
  { id: '2', name: 'PLAN PRO', price: 75000, features: ['Locataires illimités', 'Relances automatiques', 'Statistiques avancées', 'Support Prioritaire'], isActive: true },
  { id: '3', name: 'PLAN ENTREPRISE', price: 150000, features: ['Comptabilité intégrée', 'Gestion multi-utilisateurs', 'Rapports PDF exportables', 'Accompagnement dédié'], isActive: true }
]

function read<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getAgencies(): AdminAgency[] {
  const accounts = read<any[]>(ACCOUNTS_KEY, [])
  return accounts.map(acc => ({
    id: acc.id,
    agencyName: acc.agencyName,
    email: acc.email,
    phone: acc.phone,
    isValidated: acc.isValidated ?? false,
    plan: acc.plan || 'PLAN DÉMARRAGE'
  }))
}

export function toggleAgencyValidation(agencyId: string): void {
  const accounts = read<any[]>(ACCOUNTS_KEY, [])
  const updated = accounts.map(acc => {
    if (acc.id === agencyId) {
      return { ...acc, isValidated: !acc.isValidated }
    }
    return acc
  })
  write(ACCOUNTS_KEY, updated)
}

export function deleteAgency(agencyId: string): void {
  const accounts = read<any[]>(ACCOUNTS_KEY, [])
  const updated = accounts.filter(acc => acc.id !== agencyId)
  write(ACCOUNTS_KEY, updated)
}

export function updateAgencyPlan(agencyId: string, planName: string): void {
  const accounts = read<any[]>(ACCOUNTS_KEY, [])
  const updated = accounts.map(acc => {
    if (acc.id === agencyId) {
      return { ...acc, plan: planName }
    }
    return acc
  })
  write(ACCOUNTS_KEY, updated)
}

export function getPlans(): AdminPlan[] {
  let plans = read<AdminPlan[] | null>(PLANS_KEY, null)
  if (!plans) {
    plans = DEFAULT_PLANS
    write(PLANS_KEY, plans)
  }
  return plans
}

export function updatePlanPrice(planId: string, newPrice: number): void {
  const plans = getPlans()
  const updated = plans.map(p => {
    if (p.id === planId) {
      return { ...p, price: newPrice }
    }
    return p
  })
  write(PLANS_KEY, updated)
}

export function getSystemStats(): SystemStats {
  const agencies = getAgencies()
  const validated = agencies.filter(a => a.isValidated)
  const pending = agencies.filter(a => !a.isValidated)

  // Lecture du store des locataires pour calculer le volume financier global
  let totalRevenue = 0
  try {
    const tenantStoreRaw = localStorage.getItem(TENANT_STORE_KEY)
    if (tenantStoreRaw) {
      const parsed = JSON.parse(tenantStoreRaw)
      const tenantsByAgency = parsed.state?.tenantsByAgency as Record<string, Tenant[]> || {}
      
      // On somme le loyer de tous les locataires pour toutes les agences VALIDÉES uniquement
      agencies.forEach(agency => {
        if (agency.isValidated) {
          const tenants = tenantsByAgency[agency.id] || []
          tenants.forEach(t => {
            totalRevenue += Number(t.rent || 0)
          })
        }
      })
    }
  } catch (err) {
    console.error('Erreur lors du calcul des revenus système :', err)
  }

  // Calcul du nombre d'agences par plan
  const planCounts: Record<string, number> = {}
  agencies.forEach(a => {
    planCounts[a.plan] = (planCounts[a.plan] || 0) + 1
  })

  return {
    totalAgencies: agencies.length,
    validatedAgencies: validated.length,
    pendingAgencies: pending.length,
    totalProjectedRevenue: totalRevenue,
    activePlansCount: planCounts
  }
}
