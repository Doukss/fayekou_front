import { useMemo, useState } from 'react'
import { useAuth } from '../../features/auth/model/AuthContext.jsx'
import { getDashboardMetrics } from '../../features/dashboard/model/getDashboardMetrics.js'
import DashboardStats from '../../features/dashboard/ui/DashboardStats.jsx'
import DashboardCharts from '../../features/dashboard/ui/DashboardCharts.jsx'
import DashboardInsights from '../../features/dashboard/ui/DashboardInsights.jsx'
import { useTenants } from '../../features/tenants/model/useTenants.js'
import CreateTenantModal from '../../features/tenants/ui/CreateTenantModal.jsx'
import TenantsTable from '../../features/tenants/ui/TenantsTable.jsx'
import Button from '../../shared/ui/Button/Button.jsx'
import DashboardSidebar from '../../widgets/dashboard-sidebar/DashboardSidebar.jsx'

export default function DashboardPage() {
  const { agency, logout } = useAuth(); const { tenants, createTenant } = useTenants(agency.id); const [activeItem, setActiveItem] = useState('Vue d’ensemble'); const [isCreateOpen, setIsCreateOpen] = useState(false)
  const metrics = useMemo(() => getDashboardMetrics(tenants), [tenants])
  return <div className="dashboard"><DashboardSidebar agency={agency} activeItem={activeItem} onNavigate={setActiveItem} onLogout={logout} /><main><header className="dashboard-header"><div><p className="eyebrow">APERÇU DE L’AGENCE</p><h1>{activeItem}</h1><p>Voici ce qui demande votre attention aujourd’hui.</p></div><div className="dashboard-header-actions"><button className="period-selector" type="button">Juillet 2026 <b>⌄</b></button><Button onClick={() => setIsCreateOpen(true)}>+ Ajouter un locataire</Button></div></header><div className="dashboard-status"><span><i></i> Toutes les données sont synchronisées</span><p>{metrics.collectionRate}% de l’objectif mensuel atteint</p></div><DashboardStats metrics={metrics} /><DashboardCharts metrics={metrics} /><DashboardInsights tenants={tenants} metrics={metrics} /><TenantsTable tenants={tenants} /></main>{isCreateOpen && <CreateTenantModal onClose={() => setIsCreateOpen(false)} onCreate={createTenant} />}</div>
}
