import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Button from '../../../shared/ui/Button/Button.jsx'
import { tenantSchema } from '../model/tenant.schema.js'

const defaultValues = { name: '', unit: '', rent: '', dueDate: new Date().toISOString().slice(0, 10) }
export default function CreateTenantModal({ onClose, onCreate }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues, resolver: zodResolver(tenantSchema) })
  return <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tenant-modal-title"><form onSubmit={handleSubmit((data) => { onCreate(data); onClose() })}><button type="button" className="close" aria-label="Fermer" onClick={onClose}>×</button><p className="eyebrow">NOUVEAU LOCATAIRE</p><h2 id="tenant-modal-title">Ajouter un locataire</h2><label>Nom complet<input autoFocus {...register('name')} />{errors.name && <small className="field-error">{errors.name.message}</small>}</label><label>Logement<input placeholder="Ex. Appartement 2A" {...register('unit')} />{errors.unit && <small className="field-error">{errors.unit.message}</small>}</label><label>Loyer mensuel (F CFA)<input type="number" min="1" {...register('rent')} />{errors.rent && <small className="field-error">{errors.rent.message}</small>}</label><label>Prochaine échéance<input type="date" {...register('dueDate')} />{errors.dueDate && <small className="field-error">{errors.dueDate.message}</small>}</label><Button disabled={isSubmitting} type="submit">Ajouter</Button></form></div>
}
