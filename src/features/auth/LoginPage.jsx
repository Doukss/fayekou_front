import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthLayout from './AuthLayout.jsx'

export default function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ email: '', password: '' }); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event) { event.preventDefault(); setLoading(true); setMessage(''); try { await login(form); navigate('/dashboard') } catch (err) { setMessage(err.message) } finally { setLoading(false) } }
  return <AuthLayout title="Bienvenue" subtitle="Connectez-vous à l’espace de votre agence." footer={<>Pas encore de compte ? <Link to="/register">Créer mon agence</Link></>}><form onSubmit={submit}>{message && <p className="form-error">{message}</p>}<label>Email professionnel<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="agence@exemple.sn" /></label><label>Mot de passe<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Votre mot de passe" /></label><Button disabled={loading} type="submit">{loading ? 'Connexion…' : 'Se connecter'}</Button></form></AuthLayout>
}
