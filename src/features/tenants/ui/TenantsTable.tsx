import { formatCfa } from '../../../shared/lib/formatters.js'
import { getDueStatus } from '../../../shared/lib/dates.js'

export default function TenantsTable({ tenants }) {
  return <section className="tenant-panel"><div><h2>Locataires à suivre</h2><p>Échéances et statut des paiements.</p></div><div className="tenant-table"><div className="row table-head"><span>Locataire</span><span>Logement</span><span>Loyer</span><span>Statut</span></div>{tenants.map((tenant) => { const due = getDueStatus(tenant.dueDate, tenant.status); return <div className="row" key={tenant.id}><b>{tenant.name}</b><span>{tenant.unit}</span><span>{formatCfa(tenant.rent)}</span><i className={due.tone}>{due.label}</i></div> })}</div></section>
}
