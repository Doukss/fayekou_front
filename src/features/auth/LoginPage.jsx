import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../shared/ui/Button/Button.jsx'
import AuthLayout from './AuthLayout.jsx'
import { useAuth } from './model/AuthContext.jsx'
import { loginSchema } from './model/auth.schema.js'

export default function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const [message, setMessage] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })
  async function submit(values) { setMessage(''); try { await login(values); navigate('/dashboard') } catch (error) { setMessage(error.message) } }
  return <AuthLayout title="Bienvenue" subtitle="Connectez-vous à l’espace de votre agence." footer={<>Pas encore de compte ? <Link to="/register">Créer mon agence</Link></>}><form className="auth-stack" onSubmit={handleSubmit(submit)} noValidate>{message && <p className="form-error">{message}</p>}<label>Email professionnel<input type="email" placeholder="agence@exemple.sn" {...register('email')} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label><label>Mot de passe<input type="password" placeholder="Votre mot de passe" {...register('password')} />{errors.password && <small className="field-error">{errors.password.message}</small>}</label><Button className="auth-submit" disabled={isSubmitting} type="submit">{isSubmitting ? 'Connexion…' : <>Se connecter <b>→</b></>}</Button></form></AuthLayout>
}
