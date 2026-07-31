import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../shared/ui/Button/Button.jsx'
import AuthLayout from './AuthLayout.jsx'
import { useAuth } from './model/AuthContext.jsx'
import { registerSchema } from './model/auth.schema.js'

export default function RegisterPage() {
  const { register: createAccount } = useAuth(); const navigate = useNavigate(); const [message, setMessage] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { agencyName: '', email: '', phone: '', password: '' } })
  async function submit(values) { setMessage(''); try { await createAccount(values); navigate('/dashboard') } catch (error) { setMessage(error.message) } }
  return <AuthLayout title="Créez votre agence" subtitle="Deux minutes suffisent pour démarrer." footer={<>Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></>}><form onSubmit={handleSubmit(submit)} noValidate>{message && <p className="form-error">{message}</p>}<label>Nom de l’agence<input placeholder="Ex. Teranga Immobilier" {...register('agencyName')} />{errors.agencyName && <small className="field-error">{errors.agencyName.message}</small>}</label><label>Email professionnel<input type="email" placeholder="agence@exemple.sn" {...register('email')} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label><label>Téléphone WhatsApp<input type="tel" placeholder="+221 77 000 00 00" {...register('phone')} /></label><label>Mot de passe<input type="password" placeholder="8 caractères minimum" {...register('password')} />{errors.password && <small className="field-error">{errors.password.message}</small>}</label><Button disabled={isSubmitting} type="submit">{isSubmitting ? 'Création…' : 'Créer mon compte'}</Button></form></AuthLayout>
}
