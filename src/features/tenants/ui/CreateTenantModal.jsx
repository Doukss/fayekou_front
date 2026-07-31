import { useState } from 'react'
import Button from '../../../shared/ui/Button/Button.jsx'

const emptyForm = { name: '', unit: '', rent: '' }
export default function CreateTenantModal({ onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  function submit(event) { event.preventDefault(); if (!form.name.trim() || !form.unit.trim() || !Number(form.rent)) return; onCreate(form); onClose() }
  return <div className="modal" role="dialog" aria-modal="true" aria-labelledby="tenant-modal-title"><form onSubmit={submit}><button type="button" className="close" aria-label="Fermer" onClick={onClose}>×</button><p className="eyebrow">NOUVEAU LOCATAIRE</p><h2 id="tenant-modal-title">Ajouter un locataire</h2><label>Nom complet<input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Logement<input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} placeholder="Ex. Appartement 2A" /></label><label>Loyer mensuel (F CFA)<input type="number" min="1" value={form.rent} onChange={(event) => setForm({ ...form, rent: event.target.value })} /></label><Button type="submit">Ajouter</Button></form></div>
}
