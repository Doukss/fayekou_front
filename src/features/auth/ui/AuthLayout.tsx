import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
  mode?: 'login' | 'register'
}

export default function AuthLayout({ title, subtitle, children, footer, mode = 'login' }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Link className="brand" to="/"><span>Kër</span>guiPa</Link>
        <div className="auth-aside-copy">
          <p className="eyebrow">GESTION LOCATIVE, SÉNÉGAL</p>
          <h1>
            {mode === 'register' ? (
              <>Votre agence<br /><em>mérite mieux.</em></>
            ) : (
              <>Tout votre suivi.<br /><em>Au même endroit.</em></>
            )}
          </h1>
          <p>
            {mode === 'register'
              ? 'Créez votre espace KërguiPa et reprenez le contrôle de vos encaissements.'
              : 'Retrouvez vos encaissements, vos échéances et les actions à mener.'}
          </p>
        </div>
        <div className="auth-proof">
          <div className="auth-proof-icon">✦</div>
          <p>
            <b>Simple dès le premier jour.</b>
            <span>Une interface construite pour le rythme des agences.</span>
          </p>
        </div>
        <div className="auth-orbit auth-orbit--one"></div>
        <div className="auth-orbit auth-orbit--two"></div>
      </section>
      <section className="auth-form">
        <Link className="back" to="/">← Retour à l'Accueil</Link>
        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-step">{mode === 'register' ? 'CRÉER MON ESPACE' : 'BON RETOUR PARMI NOUS'}</span>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
          <div className="form-footer">{footer}</div>
        </div>
        <p className="auth-support">Besoin d'aide ? <a href="mailto:bonjour@kerguipa.sn">Contactez-nous</a></p>
      </section>
    </main>
  )
}
