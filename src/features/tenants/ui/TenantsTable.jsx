import { formatCfa } from '../../../shared/lib/formatters.js'

const statusClass = { Payé: 'paid', 'En retard': 'late', 'À relancer': 'pending' }
export default function TenantsTable({ tenants }) {
  return <section className="tenant-panel"><div><h2>Locataires à suivre</h2><p>Échéances et statut des paiements.</p></div><div className="tenant-table"><div className="row table-head"><span>Locataire</span><span>Logement</span><span>Loyer</span><span>Statut</span></div>{tenants.map((tenant) => <div className="row" key={tenant.id}><b>{tenant.name}</b><span>{tenant.unit}</span><span>{formatCfa(tenant.rent)}</span><i className={statusClass[tenant.status]}>{tenant.status}</i></div>)}</div></section>
}
