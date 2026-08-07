import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui'
import { tenantSchema } from '../model/tenant.schema'
import type { CreateTenantInput, Tenant } from '../model/types'

interface EditTenantModalProps {
  tenant: Tenant
  onClose: () => void
  onSave: (data: CreateTenantInput) => void
}

export default function EditTenantModal({ tenant, onClose, onSave }: EditTenantModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTenantInput>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email,
      unit: tenant.unit,
      rent: tenant.rent,
      dueDate: tenant.dueDate.slice(0, 10)
    }
  })

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-tenant-modal-title">
      <form 
        className="tenant-modal-form" 
        onSubmit={handleSubmit((data) => { onSave(data); onClose() })}
      >
        <button type="button" className="close" aria-label="Fermer" onClick={onClose}>×</button>
        <p className="eyebrow">MODIFICATION LOCATAIRE</p>
        <h2 id="edit-tenant-modal-title">Modifier la fiche</h2>
        
        <div className="tenant-form-grid">
          <label>
            Nom complet
            <input autoFocus {...register('name')} />
            {errors.name && <small className="field-error">{errors.name.message}</small>}
          </label>
          <label>
            Téléphone
            <input type="tel" placeholder="+221 77 000 00 00" {...register('phone')} />
            {errors.phone && <small className="field-error">{errors.phone.message}</small>}
          </label>
          <label>
            Email
            <input type="email" placeholder="locataire@email.sn" {...register('email')} />
            {errors.email && <small className="field-error">{errors.email.message}</small>}
          </label>
          <label>
            Logement
            <input placeholder="Ex. Appartement 2A" {...register('unit')} />
            {errors.unit && <small className="field-error">{errors.unit.message}</small>}
          </label>
          <label>
            Loyer mensuel (F CFA)
            <input type="number" min="1" {...register('rent')} />
            {errors.rent && <small className="field-error">{errors.rent.message}</small>}
          </label>
          <label>
            Prochaine échéance
            <input type="date" {...register('dueDate')} />
            {errors.dueDate && <small className="field-error">{errors.dueDate.message}</small>}
          </label>
        </div>
        
        <Button disabled={isSubmitting} type="submit">Enregistrer les modifications</Button>
      </form>
    </div>
  )
}
