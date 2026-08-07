import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth'
import { getDashboardMetrics, DashboardStats, DashboardCharts, DashboardInsights } from '@/features/dashboard'
import { 
  useTenants, 
  CreateTenantModal, 
  TenantsTable, 
  EditTenantModal, 
  TenantReceiptModal, 
  TenantReminderModal,
  type Tenant
} from '@/features/tenants'
import { Button, ConfirmationModal } from '@/shared/ui'
import { DashboardSidebar } from '@/widgets/dashboard-sidebar'
import { formatCfa, getDueStatus } from '@/shared/lib'

export default function DashboardPage() {
  const { agency, logout } = useAuth()
  const { tenants, createTenant, deleteTenant, updateTenant, togglePaymentStatus } = useTenants(agency!.id)
  
  // Onglet actif
  const [activeItem, setActiveItem] = useState("Vue d'énsemble")
  
  // États des modales
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [receiptTenant, setReceiptTenant] = useState<Tenant | null>(null)
  const [reminderTenant, setReminderTenant] = useState<Tenant | null>(null)
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null)

  // Filtres de recherche pour l'onglet Locataires
  const [tenantSearch, setTenantSearch] = useState('')
  const [tenantFilter, setTenantFilter] = useState<'all' | 'paid' | 'pending'>('all')

  const metrics = useMemo(() => getDashboardMetrics(tenants), [tenants])

  // Filtrage des locataires
  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
                            t.unit.toLowerCase().includes(tenantSearch.toLowerCase())
      
      const matchesFilter = tenantFilter === 'all' || 
                            (tenantFilter === 'paid' && t.status === 'Payé') ||
                            (tenantFilter === 'pending' && t.status !== 'Payé')
                            
      return matchesSearch && matchesFilter
    })
  }, [tenants, tenantSearch, tenantFilter])

  // États pour la pagination et le mode d'affichage
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [tenantSearch, tenantFilter])

  const ITEMS_PER_PAGE = 6
  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE) || 1

  const paginatedTenants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTenants.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredTenants, currentPage])

  // Liste des encaissements (Payés)
  const paidTenants = useMemo(() => tenants.filter(t => t.status === 'Payé'), [tenants])

  // Liste des relances à faire (Non payés)
  const pendingTenants = useMemo(() => tenants.filter(t => t.status !== 'Payé'), [tenants])

  return (
    <div className="dashboard">
      <DashboardSidebar 
        agency={agency!} 
        activeItem={activeItem} 
        onNavigate={setActiveItem} 
        onLogout={logout} 
      />
      
      <main>
        {agency?.isValidated === false && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(201, 162, 75, 0.15) 0%, rgba(201, 162, 75, 0.05) 100%)',
            borderLeft: '4px solid #c9a24b',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#c9a24b', fontSize: '1rem', fontWeight: 'bold' }}>
                Compte en attente de validation
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
                Votre agence est en cours d'activation. Certaines fonctionnalités de paiement ou de relance en production nécessitent la validation de votre dossier.
              </p>
            </div>
            <span style={{ fontSize: '1.2rem', marginLeft: '12px' }}>⏳</span>
          </div>
        )}

        {/* 1. ONGLETIER DYNAMIQUE */}

        {/* A. VUE D'ENSEMBLE */}
        {activeItem === "Vue d'énsemble" && (
          <>
            <header className="dashboard-header">
              <div>
                <p className="eyebrow">APERÇU DE L'AGENCE</p>
                <h1>{activeItem}</h1>
                <p>Voici ce qui demande votre attention aujourd'hui.</p>
              </div>
              <div className="dashboard-header-actions">
                <button className="period-selector" type="button">Août 2026 <b>⌄</b></button>
                <Button onClick={() => setIsCreateOpen(true)}>+ Ajouter un locataire</Button>
              </div>
            </header>

            <div className="dashboard-status">
              <span><i></i> Toutes les données sont synchronisées</span>
              <p>{metrics.collectionRate}% de l'objectif mensuel atteint</p>
            </div>

            <DashboardStats metrics={metrics} />
            <DashboardCharts metrics={metrics} />
            <DashboardInsights tenants={tenants} metrics={metrics} />
            <TenantsTable tenants={tenants} />
          </>
        )}

        {/* B. WORKSPACE LOCATAIRES */}
        {activeItem === "Locataires" && (
          <>
            <header className="dashboard-header">
              <div>
                <p className="eyebrow">WORKSPACE AGENCE</p>
                <h1>Gestion des Locataires</h1>
                <p>Retrouvez, modifiez, relancez vos locataires ou générez leurs quittances de loyer.</p>
              </div>
              <div className="dashboard-header-actions">
                <Button onClick={() => setIsCreateOpen(true)}>+ Ajouter un locataire</Button>
              </div>
            </header>

            <section className="tenant-panel" style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h3 style={{ margin: 0 }}>Portefeuille locatif</h3>
                  {/* Toggle Mode Liste / Cartes */}
                  <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    padding: '2px'
                  }}>
                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        padding: '4px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        background: viewMode === 'list' ? '#c9a24b' : 'transparent',
                        color: viewMode === 'list' ? 'black' : 'rgba(255,255,255,0.7)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      📋 Liste
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      style={{
                        padding: '4px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        background: viewMode === 'cards' ? '#c9a24b' : 'transparent',
                        color: viewMode === 'cards' ? 'black' : 'rgba(255,255,255,0.7)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      🎴 Cartes
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="Rechercher locataire..." 
                    value={tenantSearch}
                    onChange={(e) => setTenantSearch(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      background: 'rgba(255,255,255,0.05)', 
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <select 
                    value={tenantFilter}
                    onChange={(e: any) => setTenantFilter(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      background: 'rgba(255,255,255,0.05)', 
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="paid">Payé</option>
                    <option value="pending">En attente / Retard</option>
                  </select>
                </div>
              </div>

              {viewMode === 'cards' ? (
                /* Mode Cartes */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                  marginTop: '16px'
                }}>
                  {paginatedTenants.length === 0 ? (
                    <p className="empty-state" style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center' }}>Aucun locataire enregistré pour le moment.</p>
                  ) : (
                    paginatedTenants.map((tenant) => {
                      const due = getDueStatus(tenant.dueDate, tenant.status)
                      return (
                        <article key={tenant.id} style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '230px'
                        }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'white' }}>{tenant.name}</h4>
                              <i className={due.tone} style={{ display: 'inline-block', scale: '0.85', transformOrigin: 'top right' }}>{due.label}</i>
                            </div>
                            <p style={{ margin: '4px 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                              🏠 {tenant.unit}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                              ✉️ {tenant.email}
                            </p>
                            <p style={{ margin: '4px 0 12px 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                              📞 {tenant.phone}
                            </p>
                            <strong style={{ fontSize: '1.2rem', color: '#c9a24b', display: 'block', marginBottom: '8px' }}>
                              {formatCfa(tenant.rent)}
                            </strong>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            gap: '6px', 
                            borderTop: '1px solid rgba(255,255,255,0.06)', 
                            paddingTop: '12px',
                            justifyContent: 'flex-end',
                            flexWrap: 'wrap'
                          }}>
                            <Button
                              onClick={() => togglePaymentStatus(tenant.id)}
                              variant="secondary"
                              className="button--small"
                              style={{ 
                                fontSize: '0.75rem', 
                                padding: '4px 8px', 
                                backgroundColor: tenant.status === 'Payé' ? 'rgba(224, 101, 93, 0.15)' : 'rgba(76, 174, 122, 0.15)',
                                color: tenant.status === 'Payé' ? '#e0655d' : '#4cae7a',
                                border: 'none'
                              }}
                            >
                              {tenant.status === 'Payé' ? 'Annuler' : 'Encaisser'}
                            </Button>
                            
                            {tenant.status === 'Payé' ? (
                              <Button
                                onClick={() => setReceiptTenant(tenant)}
                                variant="secondary"
                                className="button--small"
                                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                              >
                                📄 Quittance
                              </Button>
                            ) : (
                              <Button
                                onClick={() => setReminderTenant(tenant)}
                                variant="secondary"
                                className="button--small"
                                style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: 'rgba(201, 162, 75, 0.15)', color: '#c9a24b', border: 'none' }}
                              >
                                💬 Relancer
                              </Button>
                            )}

                            <Button
                              onClick={() => setEditingTenant(tenant)}
                              variant="secondary"
                              className="button--small"
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                            >
                              Modifier
                            </Button>

                            <Button
                              onClick={() => setDeletingTenant(tenant)}
                              variant="secondary"
                              className="button--small"
                              style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#e0655d', border: '1px solid rgba(224, 101, 93, 0.2)' }}
                            >
                              Suppr.
                            </Button>
                          </div>
                        </article>
                      )
                    })
                  )}
                </div>
              ) : (
                /* Mode Liste */
                <div className="tenant-table" style={{ overflowX: 'auto' }}>
                  <div className="row table-head" style={{ minWidth: '850px', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 2.5fr' }}>
                    <span>Locataire</span>
                    <span>Logement</span>
                    <span>Loyer</span>
                    <span>Statut</span>
                    <span style={{ textAlign: 'right' }}>Actions</span>
                  </div>

                  {paginatedTenants.length === 0 ? (
                    <p className="empty-state" style={{ padding: '24px', textAlign: 'center' }}>Aucun locataire enregistré pour le moment.</p>
                  ) : (
                    paginatedTenants.map((tenant) => {
                      const due = getDueStatus(tenant.dueDate, tenant.status)
                      return (
                        <div className="row" key={tenant.id} style={{ minWidth: '850px', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 2.5fr', alignItems: 'center' }}>
                          <div>
                            <b style={{ display: 'block' }}>{tenant.name}</b>
                            <small style={{ color: 'gray' }}>{tenant.email} · {tenant.phone}</small>
                          </div>
                          
                          <span>{tenant.unit}</span>
                          <span>{formatCfa(tenant.rent)}</span>
                          
                          <div>
                            <i className={due.tone}>{due.label}</i>
                          </div>

                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <Button
                              onClick={() => togglePaymentStatus(tenant.id)}
                              variant="secondary"
                              className="button--small"
                              style={{ 
                                fontSize: '0.8rem', 
                                padding: '4px 8px', 
                                backgroundColor: tenant.status === 'Payé' ? 'rgba(224, 101, 93, 0.15)' : 'rgba(76, 174, 122, 0.15)',
                                color: tenant.status === 'Payé' ? '#e0655d' : '#4cae7a',
                                border: 'none'
                              }}
                            >
                              {tenant.status === 'Payé' ? 'Annuler' : 'Encaisser'}
                            </Button>
                            
                            {tenant.status === 'Payé' ? (
                              <Button
                                onClick={() => setReceiptTenant(tenant)}
                                variant="secondary"
                                className="button--small"
                                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                              >
                                📄 Quittance
                              </Button>
                            ) : (
                              <Button
                                onClick={() => setReminderTenant(tenant)}
                                variant="secondary"
                                className="button--small"
                                style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: 'rgba(201, 162, 75, 0.15)', color: '#c9a24b', border: 'none' }}
                              >
                                💬 Relancer
                              </Button>
                            )}

                            <Button
                              onClick={() => setEditingTenant(tenant)}
                              variant="secondary"
                              className="button--small"
                              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                            >
                              Modifier
                            </Button>
                            
                            <Button
                              onClick={() => setDeletingTenant(tenant)}
                              variant="secondary"
                              className="button--small"
                              style={{ fontSize: '0.8rem', padding: '4px 8px', color: '#e0655d', border: '1px solid rgba(224, 101, 93, 0.2)' }}
                            >
                              Suppr.
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {/* Contrôles de Pagination */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '20px', 
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    Page <strong>{currentPage}</strong> sur {totalPages} ({filteredTenants.length} locataires)
                  </span>
                  
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="secondary"
                      className="button--small"
                      style={{ 
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ← Précédent
                    </Button>
                    
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            background: currentPage === pageNum ? '#c9a24b' : 'rgba(255,255,255,0.05)',
                            color: currentPage === pageNum ? 'black' : 'white',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="secondary"
                      className="button--small"
                      style={{ 
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Suivant →
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* C. ENCAISSEMENTS */}
        {activeItem === "Encaissements" && (
          <>
            <header className="dashboard-header">
              <div>
                <p className="eyebrow">TRANSACTIONS AGENCE</p>
                <h1>Suivi des Encaissements</h1>
                <p>Consultez la liste des loyers réglés pour le mois en cours.</p>
              </div>
            </header>

            <section className="tenant-panel" style={{ marginTop: '24px' }}>
              <h3>Transactions validées</h3>
              <div className="tenant-table" style={{ overflowX: 'auto', marginTop: '16px' }}>
                <div className="row table-head" style={{ minWidth: '700px', gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1.5fr' }}>
                  <span>Locataire</span>
                  <span>Logement</span>
                  <span>Montant perçu</span>
                  <span style={{ textAlign: 'right' }}>Action</span>
                </div>

                {paidTenants.length === 0 ? (
                  <p className="empty-state" style={{ padding: '24px', textAlign: 'center' }}>Aucun encaissement validé ce mois-ci.</p>
                ) : (
                  paidTenants.map(tenant => (
                    <div className="row" key={tenant.id} style={{ minWidth: '700px', gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1.5fr', alignItems: 'center' }}>
                      <div>
                        <b>{tenant.name}</b>
                        <small style={{ color: 'gray', display: 'block' }}>Règlement reçu par transfert/espèces</small>
                      </div>
                      <span>{tenant.unit}</span>
                      <strong style={{ color: '#4cae7a' }}>{formatCfa(tenant.rent)}</strong>
                      <div style={{ textAlign: 'right' }}>
                        <Button
                          onClick={() => setReceiptTenant(tenant)}
                          variant="secondary"
                          className="button--small"
                        >
                          📄 Voir la quittance
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* D. RELANCES */}
        {activeItem === "Relances" && (
          <>
            <header className="dashboard-header">
              <div>
                <p className="eyebrow">ALERTES DE RETARD</p>
                <h1>Retards & Relances</h1>
                <p>Retrouvez les locataires en attente de paiement et envoyez un rappel en un clic.</p>
              </div>
            </header>

            <section className="tenant-panel" style={{ marginTop: '24px' }}>
              <h3>Loyers en attente</h3>
              <div className="tenant-table" style={{ overflowX: 'auto', marginTop: '16px' }}>
                <div className="row table-head" style={{ minWidth: '700px', gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1.5fr' }}>
                  <span>Locataire</span>
                  <span>Logement</span>
                  <span>Échéance</span>
                  <span style={{ textAlign: 'right' }}>Action</span>
                </div>

                {pendingTenants.length === 0 ? (
                  <p className="empty-state" style={{ padding: '24px', textAlign: 'center' }}>Aucune relance en attente. Félicitations !</p>
                ) : (
                  pendingTenants.map(tenant => {
                    const status = getDueStatus(tenant.dueDate, tenant.status)
                    return (
                      <div className="row" key={tenant.id} style={{ minWidth: '700px', gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1.5fr', alignItems: 'center' }}>
                        <div>
                          <b>{tenant.name}</b>
                          <small style={{ color: 'gray', display: 'block' }}>{tenant.phone}</small>
                        </div>
                        <span>{tenant.unit}</span>
                        <span style={{ color: status.tone === 'late' ? '#e0655d' : 'white' }}>
                          {status.label}
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <Button
                            onClick={() => setReminderTenant(tenant)}
                            variant="secondary"
                            className="button--small"
                            style={{ backgroundColor: 'rgba(201, 162, 75, 0.15)', color: '#c9a24b', border: 'none' }}
                          >
                            💬 Relancer via WhatsApp
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>
          </>
        )}

        {/* E. PARAMÈTRES */}
        {activeItem === "Paramètres" && (
          <>
            <header className="dashboard-header">
              <div>
                <p className="eyebrow">CONFIGURATIONS</p>
                <h1>Paramètres de l'Agence</h1>
                <p>Consultez les informations de profil de votre agence et les détails de votre offre.</p>
              </div>
            </header>

            <section className="tenant-panel" style={{ marginTop: '24px', maxWidth: '600px' }}>
              <h3>Fiche Profil Agence</h3>
              
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <small style={{ color: 'gray', textTransform: 'uppercase', fontSize: '0.75rem' }}>Nom de l'agence</small>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{agency?.name}</p>
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <small style={{ color: 'gray', textTransform: 'uppercase', fontSize: '0.75rem' }}>Adresse email professionnelle</small>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1rem' }}>{agency?.email}</p>
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <small style={{ color: 'gray', textTransform: 'uppercase', fontSize: '0.75rem' }}>Téléphone de contact</small>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1rem' }}>{agency?.phone || 'Non renseigné'}</p>
                </div>

                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <small style={{ color: 'gray', textTransform: 'uppercase', fontSize: '0.75rem' }}>Statut de l'agence</small>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: agency?.isValidated ? '#4cae7a' : '#c9a24b',
                      display: 'inline-block'
                    }} />
                    {agency?.isValidated ? 'Compte Activé & Validé' : 'Vérification en cours'}
                  </p>
                </div>

                <div>
                  <small style={{ color: 'gray', textTransform: 'uppercase', fontSize: '0.75rem' }}>Formule d'abonnement active</small>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: '#c9a24b', fontWeight: 'bold' }}>
                    {agency?.plan || 'PLAN DÉMARRAGE'}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 2. INJECTION DES MODALES DYNAMIQUES */}

      {/* A. AJOUTER LOCATAIRE */}
      {isCreateOpen && (
        <CreateTenantModal 
          onClose={() => setIsCreateOpen(false)} 
          onCreate={createTenant} 
        />
      )}

      {/* B. MODIFIER LOCATAIRE */}
      {editingTenant && (
        <EditTenantModal
          tenant={editingTenant}
          onClose={() => setEditingTenant(null)}
          onSave={(data) => updateTenant(editingTenant.id, data)}
        />
      )}

      {/* C. APERÇU QUITTANCE DE LOYER */}
      {receiptTenant && (
        <TenantReceiptModal
          tenant={receiptTenant}
          agency={agency!}
          onClose={() => setReceiptTenant(null)}
        />
      )}

      {/* D. RELANCE DE PAIEMENT */}
      {reminderTenant && (
        <TenantReminderModal
          tenant={reminderTenant}
          agency={agency!}
          onClose={() => setReminderTenant(null)}
        />
      )}

      {/* E. CONFIRMATION DE SUPPRESSION LOCATAIRE */}
      {deletingTenant && (
        <ConfirmationModal
          title="Supprimer le locataire"
          message={`Êtes-vous sûr de vouloir supprimer ${deletingTenant.name} ? Cette action est irréversible et supprimera l'ensemble de son historique de loyer.`}
          onConfirm={() => {
            deleteTenant(deletingTenant.id)
            setDeletingTenant(null)
          }}
          onCancel={() => setDeletingTenant(null)}
        />
      )}
    </div>
  )
}
