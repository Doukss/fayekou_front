import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui'
import { tenantSchema } from '@/features/tenants/model/tenant.schema'
import type { CreateTenantInput } from '@/features/tenants/model/types'

const defaultValues: CreateTenantInput = {
  name: '',
  phone: '',
  email: '',
  unit: '',
  rent: 0,
  dueDate: new Date().toISOString().slice(0, 10),
}

interface CreateTenantModalProps {
  onClose: () => void
  onCreate: (input: CreateTenantInput) => void
}

export default function CreateTenantModal({ onClose, onCreate }: CreateTenantModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTenantInput>({ defaultValues, resolver: zodResolver(tenantSchema) })
  return <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tenant-modal-title"><form className="tenant-modal-form" onSubmit={handleSubmit((data) => { onCreate(data); onClose() })}><button type="button" className="close" aria-label="Fermer" onClick={onClose}>×</button><p className="eyebrow">NOUVEAU LOCATAIRE</p><h2 id="tenant-modal-title">Ajouter un locataire</h2><div className="tenant-form-grid"><label>Nom complet<input autoFocus {...register('name')} />{errors.name && <small className="field-error">{errors.name.message}</small>}</label><label>Téléphone<input type="tel" placeholder="+221 77 000 00 00" {...register('phone')} />{errors.phone && <small className="field-error">{errors.phone.message}</small>}</label><label>Email<input type="email" placeholder="locataire@email.sn" {...register('email')} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label><label>Logement<input placeholder="Ex. Appartement 2A" {...register('unit')} />{errors.unit && <small className="field-error">{errors.unit.message}</small>}</label><label>Loyer mensuel (F CFA)<input type="number" min="1" {...register('rent')} />{errors.rent && <small className="field-error">{errors.rent.message}</small>}</label><label>Prochaine échéance<input type="date" {...register('dueDate')} />{errors.dueDate && <small className="field-error">{errors.dueDate.message}</small>}</label></div><Button disabled={isSubmitting} type="submit">Ajouter le locataire</Button></form></div>
}
