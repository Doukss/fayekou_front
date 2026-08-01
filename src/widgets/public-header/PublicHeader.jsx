import { Link } from 'react-router-dom'

export default function PublicHeader() {
  return <header className="public-header"><Link className="brand" to="/"><span>Kër</span>guiPa</Link><nav><a href="/#fonctionnalites">Solution</a><a href="/#tarifs">Tarifs</a><a href="#temoignages">Témoignages</a></nav><div className="header-actions"><Link className="header-login" to="/login">Se connecter</Link><Link className="button button--small" to="/register">Essai gratuit <b>→</b></Link></div></header>
}
