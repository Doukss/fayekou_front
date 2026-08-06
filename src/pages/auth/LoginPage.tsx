import { Link } from 'react-router-dom'
import { AuthLayout, LoginForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenue"
      subtitle="Connectez-vous à l’espace de votre agence."
      footer={
        <>
          Pas encore de compte ? <Link to="/register">Créer mon agence</Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
