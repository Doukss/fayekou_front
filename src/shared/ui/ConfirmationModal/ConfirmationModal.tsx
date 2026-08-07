import { Button } from '@/shared/ui'

interface ConfirmationModalProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({
  title,
  message,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  return (
    <div className="modal" role="dialog" aria-modal="true" style={{ zIndex: 1100 }}>
      <div className="tenant-modal-form" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
        <button type="button" className="close" aria-label="Fermer" onClick={onCancel}>×</button>
        <p className="eyebrow" style={{ color: '#e0655d', letterSpacing: '1px' }}>ATTENTION</p>
        <h2 style={{ fontSize: '1.3rem', margin: '10px 0 12px 0', color: 'white' }}>{title}</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            onClick={onCancel} 
            variant="secondary"
            style={{ 
              flex: 1, 
              padding: '10px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white'
            }}
          >
            {cancelLabel}
          </Button>
          <Button 
            onClick={onConfirm}
            style={{ 
              flex: 1, 
              padding: '10px', 
              backgroundColor: '#e0655d', 
              color: 'white',
              border: 'none'
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
