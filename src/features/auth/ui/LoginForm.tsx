import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui'
import { useAuth } from '@/features/auth/model/AuthContext'
import { loginSchema } from '@/features/auth/model/auth.schema'
import type { LoginInput } from '@/features/auth/model/types'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function submit(values: LoginInput) {
    setMessage('')
    try {
      const session = await login(values)
      if (session.role === 'superadmin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Une erreur est survenue.')
    }
  }

  return (
    <form className="auth-stack" onSubmit={handleSubmit(submit)} noValidate>
      {message && <p className="form-error">{message}</p>}
      <label>
        Email professionnel
        <input type="email" placeholder="agence@exemple.sn" {...register('email')} />
        {errors.email && <small className="field-error">{errors.email.message}</small>}
      </label>
      <label>
        Mot de passe
        <input type="password" placeholder="Votre mot de passe" {...register('password')} />
        {errors.password && <small className="field-error">{errors.password.message}</small>}
      </label>
      <Button className="auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Connexion…' : <>Se connecter <b>→</b></>}
      </Button>
    </form>
  )
}
