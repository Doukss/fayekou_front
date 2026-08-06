import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth'
import { getDashboardMetrics, DashboardStats, DashboardCharts, DashboardInsights } from '@/features/dashboard'
import { useTenants, CreateTenantModal, TenantsTable } from '@/features/tenants'
import { Button } from '@/shared/ui'
import { DashboardSidebar } from '@/widgets/dashboard-sidebar'

export default function DashboardPage() {
  const { agency, logout } = useAuth()
  const { tenants, createTenant } = useTenants(agency!.id)
  const [activeItem, setActiveItem] = useState("Vue d'énsemble")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const metrics = useMemo(() => getDashboardMetrics(tenants), [tenants])
  return <div className="dashboard"><DashboardSidebar agency={agency!} activeItem={activeItem} onNavigate={setActiveItem} onLogout={logout} /><main><header className="dashboard-header"><div><p className="eyebrow">APERÇU DE L'AGENCE</p><h1>{activeItem}</h1><p>Voici ce qui demande votre attention aujourd'hui.</p></div><div className="dashboard-header-actions"><button className="period-selector" type="button">Juillet 2026 <b>⌄</b></button><Button onClick={() => setIsCreateOpen(true)}>+ Ajouter un locataire</Button></div></header><div className="dashboard-status"><span><i></i> Toutes les données sont synchronisées</span><p>{metrics.collectionRate}% de l'objectif mensuel atteint</p></div><DashboardStats metrics={metrics} /><DashboardCharts metrics={metrics} /><DashboardInsights tenants={tenants} metrics={metrics} /><TenantsTable tenants={tenants} /></main>{isCreateOpen && <CreateTenantModal onClose={() => setIsCreateOpen(false)} onCreate={createTenant} />}</div>
}
