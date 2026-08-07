import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/features/auth'
import { AdminSidebar } from '@/widgets/admin-sidebar'
import {
  AdminStats,
  AgenciesList,
  PlansList,
  getAgencies,
  getPlans,
  getSystemStats,
  toggleAgencyValidation,
  deleteAgency,
  updateAgencyPlan,
  updatePlanPrice
} from '@/features/superadmin'
import type { AdminAgency, AdminPlan, SystemStats } from '@/features/superadmin'

export default function AdminDashboardPage() {
  const { agency: user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  
  // States
  const [agencies, setAgencies] = useState<AdminAgency[]>([])
  const [plans, setPlans] = useState<AdminPlan[]>([])
  const [stats, setStats] = useState<SystemStats>({
    totalAgencies: 0,
    validatedAgencies: 0,
    pendingAgencies: 0,
    totalProjectedRevenue: 0,
    activePlansCount: {}
  })

  // Load data
  const loadData = () => {
    const listAgencies = getAgencies()
    const listPlans = getPlans()
    const systemStats = getSystemStats()
    setAgencies(listAgencies)
    setPlans(listPlans)
    setStats(systemStats)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate MRR (Monthly Recurring Revenue) based on plans of validated agencies
  const subscriptionRevenue = useMemo(() => {
    return agencies
      .filter((a) => a.isValidated)
      .reduce((sum, a) => {
        const plan = plans.find((p) => p.name === a.plan)
        return sum + (plan ? plan.price : 0)
      }, 0)
  }, [agencies, plans])

  // Handlers
  const handleToggleValidation = (id: string) => {
    toggleAgencyValidation(id)
    loadData()
  }

  const handleDeleteAgency = (id: string) => {
    deleteAgency(id)
    loadData()
  }

  const handleChangePlan = (id: string, planName: string) => {
    updateAgencyPlan(id, planName)
    loadData()
  }

  const handleUpdatePlanPrice = (id: string, newPrice: number) => {
    updatePlanPrice(id, newPrice)
    loadData()
  }

  if (!user) return null

  return (
    <div className="dashboard">
      <AdminSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
      />
      
      <main>
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">CONSOLE DE SUPERVISION KËRGUIPAY</p>
            <h1>
              {activeTab === 'overview' && 'Vue d’ensemble'}
              {activeTab === 'agencies' && 'Gestion des Agences'}
              {activeTab === 'plans' && 'Plans d’Abonnement'}
            </h1>
            <p>
              {activeTab === 'overview' && 'Indicateurs de performance globale du système.'}
              {activeTab === 'agencies' && 'Activez les accès ou modifiez les abonnements des agences.'}
              {activeTab === 'plans' && 'Gérez les grilles tarifaires de la plateforme.'}
            </p>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            <AdminStats stats={stats} subscriptionRevenue={subscriptionRevenue} />
            
            {/* Visualisation répartition par plan */}
            <div className="tenant-panel" style={{ marginTop: '24px' }}>
              <h2>Répartition des formules</h2>
              <p>Nombre d'agences par offre d'abonnement.</p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}>
                {plans.map(p => {
                  const count = stats.activePlansCount[p.name] || 0
                  const percentage = stats.totalAgencies ? Math.round((count / stats.totalAgencies) * 100) : 0
                  return (
                    <article key={p.id} style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px'
                    }}>
                      <small style={{ color: 'gray', fontWeight: 'bold' }}>{p.name}</small>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{count}</span>
                        <span style={{ color: '#4cae7a', fontSize: '0.85rem' }}>{percentage}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: '#c9a24b' }} />
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'agencies' && (
          <AgenciesList
            agencies={agencies}
            plans={plans}
            onToggleValidation={handleToggleValidation}
            onDelete={handleDeleteAgency}
            onChangePlan={handleChangePlan}
          />
        )}

        {activeTab === 'plans' && (
          <PlansList
            plans={plans}
            onUpdatePrice={handleUpdatePlanPrice}
          />
        )}
      </main>
    </div>
  )
}
