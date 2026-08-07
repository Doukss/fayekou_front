import { useState } from 'react'
import type { AdminAgency, AdminPlan } from '../model/types'
import { Button, ConfirmationModal } from '@/shared/ui'

interface AgenciesListProps {
  agencies: AdminAgency[]
  plans: AdminPlan[]
  onToggleValidation: (id: string) => void
  onDelete: (id: string) => void
  onChangePlan: (id: string, planName: string) => void
}

export default function AgenciesList({
  agencies,
  plans,
  onToggleValidation,
  onDelete,
  onChangePlan
}: AgenciesListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all')
  const [search, setSearch] = useState('')
  const [deletingAgency, setDeletingAgency] = useState<AdminAgency | null>(null)

  const filteredAgencies = agencies.filter(agency => {
    // Filtrage statut
    if (filter === 'pending' && agency.isValidated) return false
    if (filter === 'validated' && !agency.isValidated) return false

    // Recherche textuelle
    if (search.trim() !== '') {
      const query = search.toLowerCase()
      return (
        agency.agencyName.toLowerCase().includes(query) ||
        agency.email.toLowerCase().includes(query) ||
        agency.phone.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <section className="tenant-panel" style={{ marginTop: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Gestion des Agences</h2>
          <p>Validez les nouvelles inscriptions et gérez leurs abonnements.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              background: 'rgba(255,255,255,0.05)', 
              color: 'white',
              outline: 'none'
            }}
          />
          <select 
            value={filter}
            onChange={(e: any) => setFilter(e.target.value)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              background: 'rgba(255,255,255,0.05)', 
              color: 'white'
            }}
          >
            <option value="all">Toutes les agences</option>
            <option value="pending">En attente</option>
            <option value="validated">Validées</option>
          </select>
        </div>
      </header>

      <div className="tenant-table" style={{ overflowX: 'auto' }}>
        <div className="row table-head" style={{ minWidth: '700px', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr' }}>
          <span>Agence</span>
          <span>Abonnement</span>
          <span>Statut</span>
          <span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {filteredAgencies.length === 0 ? (
          <p className="empty-state" style={{ padding: '24px', textAlign: 'center' }}>Aucune agence trouvée.</p>
        ) : (
          filteredAgencies.map((agency) => (
            <div className="row" key={agency.id} style={{ minWidth: '700px', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr', alignItems: 'center' }}>
              <div>
                <b style={{ display: 'block' }}>{agency.agencyName}</b>
                <small style={{ color: 'gray' }}>{agency.email} · {agency.phone || 'Pas de tél'}</small>
              </div>
              
              <div>
                <select
                  value={agency.plan}
                  onChange={(e) => onChangePlan(agency.id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                >
                  {plans.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <i className={agency.isValidated ? 'paid' : 'late'}>
                  {agency.isValidated ? 'Validée' : 'En attente'}
                </i>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={() => onToggleValidation(agency.id)}
                  variant="secondary"
                  className="button--small"
                  style={{
                    backgroundColor: agency.isValidated ? '#c94b4b' : '#4cae7a',
                    color: 'white',
                    padding: '4px 10px',
                    fontSize: '0.8rem'
                  }}
                >
                  {agency.isValidated ? 'Désactiver' : 'Valider'}
                </Button>
                <Button 
                  onClick={() => setDeletingAgency(agency)}
                  variant="secondary"
                  className="button--small"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e0655d',
                    padding: '4px 10px',
                    fontSize: '0.8rem'
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {deletingAgency && (
        <ConfirmationModal
          title="Supprimer l'agence"
          message={`Êtes-vous sûr de vouloir supprimer l'agence ${deletingAgency.agencyName} ? Cette action supprimera définitivement tous ses comptes et données.`}
          onConfirm={() => {
            onDelete(deletingAgency.id)
            setDeletingAgency(null)
          }}
          onCancel={() => setDeletingAgency(null)}
        />
      )}
    </section>
  )
}
