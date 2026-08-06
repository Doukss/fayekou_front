import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui'
import { useAuth } from '@/features/auth/model/AuthContext'
import { registerSchema } from '@/features/auth/model/auth.schema'
import type { RegisterInput } from '@/features/auth/model/types'

export default function RegisterForm() {
  const { register: createAccount } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agencyName: '', email: '', phone: '', password: '' },
  })

  async function submit(values: RegisterInput) {
    setMessage('')
    try {
      await createAccount(values)
      navigate('/dashboard')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Une erreur est survenue.')
    }
  }

  return (
    <form className="auth-stack" onSubmit={handleSubmit(submit)} noValidate>
      {message && <p className="form-error">{message}</p>}
      <label>
        Nom de l'agence
        <input placeholder="Ex. Teranga Immobilier" {...register('agencyName')} />
        {errors.agencyName && <small className="field-error">{errors.agencyName.message}</small>}
      </label>
      <label>
        Email professionnel
        <input type="email" placeholder="agence@exemple.sn" {...register('email')} />
        {errors.email && <small className="field-error">{errors.email.message}</small>}
      </label>
      <label>
        Téléphone WhatsApp <span className="label-optional">optionnel</span>
        <input type="tel" placeholder="+221 77 000 00 00" {...register('phone')} />
      </label>
      <label>
        Mot de passe
        <input type="password" placeholder="8 caractères minimum" {...register('password')} />
        {errors.password && <small className="field-error">{errors.password.message}</small>}
      </label>
      <Button className="auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Création…' : <>Créer mon compte <b>→</b></>}
      </Button>
    </form>
  )
}
