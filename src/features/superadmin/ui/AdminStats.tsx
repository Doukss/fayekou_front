import type { SystemStats } from '../model/types'
import { formatCfa } from '@/shared/lib'

interface AdminStatsProps {
  stats: SystemStats
  subscriptionRevenue: number
}

export default function AdminStats({ stats, subscriptionRevenue }: AdminStatsProps) {
  const cards = [
    {
      label: 'Agences Enregistrées',
      value: stats.totalAgencies,
      subText: `${stats.validatedAgencies} validées · ${stats.pendingAgencies} en attente`,
      tone: ''
    },
    {
      label: 'Flux Financier Global',
      value: formatCfa(stats.totalProjectedRevenue),
      subText: 'Loyers cumulés des agences validées',
      tone: 'success'
    },
    {
      label: 'Revenus Récurrents Système (MRR)',
      value: formatCfa(subscriptionRevenue),
      subText: 'Abonnements théoriques mensuels',
      tone: 'accent'
    },
    {
      label: 'Demandes en Attente',
      value: stats.pendingAgencies,
      subText: stats.pendingAgencies > 0 ? 'Action requise de validation' : 'Tout est validé',
      tone: stats.pendingAgencies > 0 ? 'danger' : 'neutral'
    }
  ]

  return (
    <section className="stat-grid">
      {cards.map((c) => (
        <article key={c.label}>
          <span>{c.label}</span>
          <strong className={c.tone}>{c.value}</strong>
          <small style={{ display: 'block', color: 'gray', marginTop: '4px' }}>{c.subText}</small>
        </article>
      ))}
    </section>
  )
}
