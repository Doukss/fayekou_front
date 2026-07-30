import { Link } from 'react-router-dom'
export default function NotFoundPage() { return <main className="not-found"><p className="eyebrow">ERREUR 404</p><h1>Cette page n’existe pas.</h1><Link className="button" to="/">Retour à l’accueil</Link></main> }
