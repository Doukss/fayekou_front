export interface AdminAgency {
  id: string
  agencyName: string
  email: string
  phone: string
  isValidated: boolean
  plan: string
}

export interface AdminPlan {
  id: string
  name: string
  price: number
  features: string[]
  isActive: boolean
}

export interface SystemStats {
  totalAgencies: number
  validatedAgencies: number
  pendingAgencies: number
  totalProjectedRevenue: number
  activePlansCount: Record<string, number>
}
