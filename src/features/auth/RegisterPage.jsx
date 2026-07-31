import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../shared/ui/Button/Button.jsx'
import { useAuth } from './model/AuthContext.jsx'
import AuthLayout from './AuthLayout.jsx'

export default function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ agencyName: '', email: '', phone: '', password: '' }); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event) { event.preventDefault(); setLoading(true); setMessage(''); try { await register(form); navigate('/dashboard') } catch (err) { setMessage(err.message) } finally { setLoading(false) } }
  return <AuthLayout title="Créez votre agence" subtitle="Deux minutes suffisent pour démarrer." footer={<>Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></>}><form onSubmit={submit}>{message && <p className="form-error">{message}</p>}<label>Nom de l’agence<input required value={form.agencyName} onChange={(e) => setForm({ ...form, agencyName: e.target.value })} placeholder="Ex. Teranga Immobilier" /></label><label>Email professionnel<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="agence@exemple.sn" /></label><label>Téléphone WhatsApp<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+221 77 000 00 00" /></label><label>Mot de passe<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="8 caractères minimum" /></label><Button disabled={loading} type="submit">{loading ? 'Création…' : 'Créer mon compte'}</Button></form></AuthLayout>
}
