export default function DashboardSidebar({ agency, activeItem, onNavigate, onLogout }) {
  const items = ['Vue d’ensemble', 'Locataires', 'Encaissements', 'Relances']
  return <aside><div><p className="brand"><span>Kër</span>guiPa</p><p className="agency-name">{agency.agencyName}</p><span className="plan">PLAN DÉMARRAGE</span></div><nav>{items.map((item) => <button className={activeItem === item ? 'active' : ''} onClick={() => onNavigate(item)} key={item}>{item}</button>)}</nav><div className="profile"><b>{agency.agencyName.slice(0, 2).toUpperCase()}</b><div><strong>{agency.agencyName}</strong><button onClick={onLogout}>Se déconnecter</button></div></div></aside>
}
