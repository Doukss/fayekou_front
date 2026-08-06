import { Link } from 'react-router-dom'
import { AuthLayout, RegisterForm } from '@/features/auth'

export default function RegisterPage() {
  return (
    <AuthLayout
      mode="register"
      title="Créez votre agence"
      subtitle="Deux minutes suffisent pour démarrer."
      footer={
        <>
          Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}
