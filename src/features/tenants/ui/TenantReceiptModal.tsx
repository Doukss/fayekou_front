import type { Tenant } from '../model/types'
import { formatCfa } from '@/shared/lib'
import type { UserSession } from '@/features/auth/model/types'

interface TenantReceiptModalProps {
  tenant: Tenant
  agency: UserSession
  onClose: () => void
}

export default function TenantReceiptModal({ tenant, agency, onClose }: TenantReceiptModalProps) {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" style={{ padding: '20px' }}>
      <div 
        className="tenant-modal-form" 
        style={{ 
          maxWidth: '750px', 
          width: '100%', 
          background: '#ffffff', 
          color: '#1a1a1a', 
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
        }}
      >
        {/* Style spécial pour masquer l'interface lors de l'impression */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-receipt, .printable-receipt * {
              visibility: visible;
            }
            .printable-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              box-shadow: none !important;
              color: #000000 !important;
              background: #ffffff !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}} />

        <button 
          type="button" 
          className="close no-print" 
          aria-label="Fermer" 
          onClick={onClose}
          style={{ color: '#888', fontSize: '28px', top: '15px', right: '15px' }}
        >
          ×
        </button>

        <div className="printable-receipt" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.6' }}>
          {/* Header de la quittance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a' }}>{agency.name}</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>Email : {agency.email}</p>
              {agency.phone && <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>Tél : {agency.phone}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '1.6rem', fontWeight: 'bold', color: '#333' }}>QUITTANCE DE LOYER</h2>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>Date d'émission : {today}</p>
            </div>
          </div>

          {/* Corps de la quittance */}
          <div style={{ margin: '30px 0' }}>
            <p>
              Quittance délivrée à <strong>{tenant.name}</strong>, locataire du logement référencé ci-dessous :
            </p>
            <div style={{ 
              background: '#f8f9fa', 
              border: '1px solid #e9ecef', 
              padding: '15px 20px', 
              borderRadius: '6px', 
              margin: '20px 0',
              fontSize: '0.95rem'
            }}>
              <strong>Désignation du logement :</strong> {tenant.unit}
            </div>
            <p style={{ textIndent: '30px', textAlign: 'justify' }}>
              Je soussigné, <strong>{agency.name}</strong>, mandataire/propriétaire du logement désigné ci-dessus, 
              déclare avoir reçu de la part du locataire la somme de <strong>{formatCfa(tenant.rent)}</strong> au titre du paiement du loyer et des charges pour la période d'occupation en cours.
            </p>
            <p style={{ textIndent: '30px', textAlign: 'justify', marginTop: '12px' }}>
              Cette quittance annule tout reçu ou document de réclamation antérieur pour cette même période. Ce document est délivré pour servir et valoir ce que de droit.
            </p>
          </div>

          {/* Tableau récapitulatif */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px', marginBottom: '40px' }}>
            <thead>
              <tr style={{ background: '#f1f3f5', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #dee2e6' }}>Détails</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6', width: '150px' }}>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>Loyer Principal</td>
                <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6' }}>{formatCfa(tenant.rent)}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>Charges forfaitaires</td>
                <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6' }}>0 F</td>
              </tr>
              <tr style={{ fontWeight: 'bold', background: '#e9ecef' }}>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>Total Reçu</td>
                <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6' }}>{formatCfa(tenant.rent)}</td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <div>
              <p style={{ margin: '0 0 50px 0', fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>Le locataire</p>
              <div style={{ borderBottom: '1px dashed #ced4da', width: '180px' }}></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 50px 0', fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>Pour l'agence (Signature & Cachet)</p>
              <strong>{agency.name}</strong>
              <div style={{ borderBottom: '1px dashed #ced4da', width: '220px', marginTop: '40px', float: 'right' }}></div>
            </div>
          </div>
        </div>

        {/* Boutons d'action no-print */}
        <div className="no-print" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '40px', borderTop: '1px solid #e9ecef', paddingTop: '20px' }}>
          <button 
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #dee2e6',
              background: 'transparent',
              color: '#495057',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Fermer
          </button>
          <button 
            type="button"
            onClick={handlePrint}
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: 'none',
              background: '#4cae7a',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🖨️ Imprimer la quittance
          </button>
        </div>
      </div>
    </div>
  )
}
