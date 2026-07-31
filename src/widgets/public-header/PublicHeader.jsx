import { Link } from 'react-router-dom'

export default function PublicHeader() {
  return <header className="public-header"><Link className="brand" to="/"><span>Kër</span>guiPa</Link><nav><a href="/#fonctionnalites">Fonctionnalités</a><a href="/#tarifs">Tarifs</a><Link to="/login">Connexion</Link><Link className="button button--small" to="/register">Essayer gratuitement</Link></nav></header>
}
