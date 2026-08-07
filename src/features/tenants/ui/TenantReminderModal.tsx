import { useState } from 'react'
import type { Tenant } from '../model/types'
import { formatCfa } from '@/shared/lib'
import type { UserSession } from '@/features/auth/model/types'
import { Button } from '@/shared/ui'

interface TenantReminderModalProps {
  tenant: Tenant
  agency: UserSession
  onClose: () => void
}

export default function TenantReminderModal({ tenant, agency, onClose }: TenantReminderModalProps) {
  const [copied, setCopied] = useState(false)

  // Nettoyage du numéro de téléphone pour l'API WhatsApp (ex: +221 77... -> 22177...)
  const cleanPhone = tenant.phone.replace(/[^0-9]/g, '')

  // Modèle de message
  const reminderText = `Bonjour ${tenant.name}, sauf erreur de notre part, nous n'avons pas encore reçu votre règlement de loyer pour le mois en cours concernant le logement (${tenant.unit}). Le montant est de ${formatCfa(tenant.rent)}. Merci de régulariser la situation dès que possible. Cordialement, l'agence ${agency.name}.`

  const handleCopy = () => {
    navigator.clipboard.writeText(reminderText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleWhatsAppRedirect = () => {
    const encodedText = encodeURIComponent(reminderText)
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`
    window.open(url, '_blank')
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reminder-modal-title">
      <div className="tenant-modal-form" style={{ maxWidth: '550px' }}>
        <button type="button" className="close" aria-label="Fermer" onClick={onClose}>×</button>
        <p className="eyebrow">RAPPEL DE PAIEMENT</p>
        <h2 id="reminder-modal-title">Relancer {tenant.name}</h2>
        
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: '10px 0 20px 0' }}>
          Vous pouvez copier le message ci-dessous ou l'envoyer directement par WhatsApp à son numéro de téléphone.
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          color: 'white',
          position: 'relative',
          marginBottom: '24px',
          wordBreak: 'break-word'
        }}>
          {reminderText}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            onClick={handleCopy} 
            variant="secondary"
            style={{ 
              flex: 1, 
              padding: '10px', 
              background: copied ? 'rgba(76, 174, 122, 0.2)' : 'rgba(255,255,255,0.05)',
              border: copied ? '1px solid #4cae7a' : '1px solid rgba(255,255,255,0.1)',
              color: copied ? '#4cae7a' : 'white'
            }}
          >
            {copied ? '✓ Message copié !' : '📋 Copier le message'}
          </Button>

          <Button 
            onClick={handleWhatsAppRedirect}
            style={{ 
              flex: 1, 
              padding: '10px',
              background: '#25D366', // Couleur officielle de WhatsApp
              color: 'white'
            }}
          >
            💬 Envoyer sur WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}
