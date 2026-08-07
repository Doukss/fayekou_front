import type { UserSession } from '@/features/auth/model/types'
import type { ReactNode } from 'react'

const icons: Record<string, ReactNode> = {
  overview: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  agencies: (
    <>
      <circle cx="9" cy="8" r="2.5" />
      <path d="M3.5 20c.7-3.1 2.7-4.7 5.5-4.7s4.8 1.6 5.5 4.7" />
      <path d="M16 11h6M19 8v6" />
    </>
  ),
  plans: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 11h8M8 15h5" />
    </>
  )
}

function SidebarIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: "22px",
        height: "22px",
        flexShrink: 0,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
      }}
    >
      {icons[name] || <circle cx="12" cy="12" r="9" />}
    </svg>
  )
}

interface AdminSidebarProps {
  user: UserSession
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export default function AdminSidebar({
  user,
  activeTab,
  onTabChange,
  onLogout,
}: AdminSidebarProps) {
  const items = [
    { id: "overview", label: "Vue d’ensemble", icon: "overview" },
    { id: "agencies", label: "Gestion Agences", icon: "agencies" },
    { id: "plans", label: "Plans d’Abonnement", icon: "plans" },
  ]

  return (
    <aside style={{ width: "260px", minWidth: "260px" }}>
      <div>
        <p className="brand">
          <span>Kër</span>guiPay
        </p>
        <p className="agency-name">Console Admin</p>
        <span className="plan" style={{ background: '#c9a24b', color: 'black' }}>
          SUPER ADMINISTRATEUR
        </span>
      </div>
      
      <nav style={{ flex: 1, marginTop: '24px' }}>
        {items.map((item) => (
          <button
            className={activeTab === item.id ? "active" : ""}
            onClick={() => onTabChange(item.id)}
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              color: activeTab === item.id ? "#fff" : "rgba(255,255,255,0.6)",
              background: activeTab === item.id ? "rgba(255,255,255,0.08)" : "transparent",
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '4px',
              transition: 'all 0.2s'
            }}
          >
            <SidebarIcon name={item.icon} />
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="profile" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
        <b style={{ background: '#c9a24b', color: 'black' }}>AD</b>
        <div>
          <strong style={{ display: 'block', fontSize: '0.9rem' }}>{user.name}</strong>
          <button 
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#e0655d',
              padding: 0,
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginTop: '2px',
              textAlign: 'left'
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  )
}
