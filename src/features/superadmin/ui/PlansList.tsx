import { useState } from 'react'
import type { AdminPlan } from '../model/types'
import { formatCfa } from '@/shared/lib'
import { Button } from '@/shared/ui'

interface PlansListProps {
  plans: AdminPlan[]
  onUpdatePrice: (id: string, price: number) => void
}

export default function PlansList({ plans, onUpdatePrice }: PlansListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<string>('')

  const handleEditClick = (plan: AdminPlan) => {
    setEditingId(plan.id)
    setTempPrice(plan.price.toString())
  }

  const handleSaveClick = (id: string) => {
    const parsedPrice = Number(tempPrice)
    if (!isNaN(parsedPrice) && parsedPrice >= 0) {
      onUpdatePrice(id, parsedPrice)
      setEditingId(null)
    } else {
      alert('Veuillez saisir un prix valide supérieur ou égal à 0.')
    }
  }

  return (
    <section className="tenant-panel" style={{ marginTop: '24px' }}>
      <div>
        <h2>Gestion des Plans d'Abonnement</h2>
        <p>Définissez les tarifs mensuels des formules d'abonnement des agences.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {plans.map((plan) => (
          <article 
            key={plan.id} 
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Décoration subtile en arrière-plan */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: plan.name.includes('PRO') ? 'rgba(76, 174, 122, 0.06)' : plan.name.includes('ENTREPRISE') ? 'rgba(201, 162, 75, 0.06)' : 'rgba(255, 255, 255, 0.02)',
              filter: 'blur(20px)'
            }} />

            <div>
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#c9a24b', 
                fontWeight: 'bold', 
                letterSpacing: '1px',
                display: 'block',
                marginBottom: '8px'
              }}>
                PLAN ABONNEMENT
              </span>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem' }}>{plan.name}</h3>
              
              {editingId === plan.id ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '16px 0' }}>
                  <input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    style={{
                      width: '120px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #c9a24b',
                      background: '#1d1d20',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <span style={{ color: 'gray' }}>F CFA / mois</span>
                </div>
              ) : (
                <div style={{ margin: '16px 0' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                    {formatCfa(plan.price).replace(' F', '')}
                  </span>
                  <span style={{ color: 'gray', marginLeft: '6px' }}>FCFA / mois</span>
                </div>
              )}

              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: '20px 0', 
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '16px'
              }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '0.9rem', 
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '8px'
                  }}>
                    <span style={{ color: '#4cae7a', fontWeight: 'bold' }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '12px' }}>
              {editingId === plan.id ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    onClick={() => handleSaveClick(plan.id)}
                    style={{ flex: 1, padding: '8px 12px' }}
                  >
                    Enregistrer
                  </Button>
                  <Button 
                    onClick={() => setEditingId(null)}
                    style={{ 
                      flex: 1, 
                      padding: '8px 12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => handleEditClick(plan)}
                  style={{ 
                    width: '100%', 
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  Modifier le tarif
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
