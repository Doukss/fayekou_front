import { Link } from 'react-router-dom'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return <main className="auth-page"><section className="auth-aside"><Link className="brand" to="/"><span>Kër</span>guiPa</Link><div><p className="eyebrow">GESTION LOCATIVE</p><h1>Chaque loyer mérite un suivi simple.</h1><p>Conservez une vision nette de vos encaissements et de vos locataires.</p></div></section><section className="auth-form"><Link className="back" to="/">← Retour à l’accueil</Link><div className="auth-card"><h2>{title}</h2><p>{subtitle}</p>{children}<div className="form-footer">{footer}</div></div></section></main>
}
