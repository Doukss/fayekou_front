import { useMemo, useState } from 'react'
import { useAuth } from '../../features/auth/model/AuthContext.jsx'
import { getDashboardMetrics } from '../../features/dashboard/model/getDashboardMetrics.js'
import DashboardStats from '../../features/dashboard/ui/DashboardStats.jsx'
import DashboardCharts from '../../features/dashboard/ui/DashboardCharts.jsx'
import { useTenants } from '../../features/tenants/model/useTenants.js'
import CreateTenantModal from '../../features/tenants/ui/CreateTenantModal.jsx'
import TenantsTable from '../../features/tenants/ui/TenantsTable.jsx'
import Button from '../../shared/ui/Button/Button.jsx'
import DashboardSidebar from '../../widgets/dashboard-sidebar/DashboardSidebar.jsx'

export default function DashboardPage() {
  const { agency, logout } = useAuth(); const { tenants, createTenant } = useTenants(agency.id); const [activeItem, setActiveItem] = useState('Vue d’ensemble'); const [isCreateOpen, setIsCreateOpen] = useState(false)
  const metrics = useMemo(() => getDashboardMetrics(tenants), [tenants])
  return <div className="dashboard"><DashboardSidebar agency={agency} activeItem={activeItem} onNavigate={setActiveItem} onLogout={logout} /><main><header className="dashboard-header"><div><p className="eyebrow">BONJOUR, {agency.agencyName.toUpperCase()}</p><h1>{activeItem}</h1><p>Voici le suivi de votre agence pour ce mois.</p></div><Button onClick={() => setIsCreateOpen(true)}>+ Ajouter un locataire</Button></header><DashboardStats metrics={metrics} /><DashboardCharts metrics={metrics} /><TenantsTable tenants={tenants} /></main>{isCreateOpen && <CreateTenantModal onClose={() => setIsCreateOpen(false)} onCreate={createTenant} />}</div>
}
