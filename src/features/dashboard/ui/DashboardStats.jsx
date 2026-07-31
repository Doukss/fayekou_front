import { formatCfa } from '../../../shared/lib/formatters.js'

export default function DashboardStats({ metrics }) {
  const stats = [['Total attendu', formatCfa(metrics.expected), ''], ['Collecté', formatCfa(metrics.collected), 'success'], ['Impayés', formatCfa(metrics.unpaid), 'accent'], ['En retard', `${metrics.late} locataire${metrics.late > 1 ? 's' : ''}`, 'danger']]
  return <section className="stat-grid">{stats.map(([label, value, tone]) => <article key={label}><span>{label}</span><strong className={tone}>{value}</strong></article>)}</section>
}
