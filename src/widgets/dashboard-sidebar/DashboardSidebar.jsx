const icons = {
  overview: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  tenants: (
    <>
      <circle cx="9" cy="8" r="2.5" />
      <path d="M3.5 20c.7-3.1 2.7-4.7 5.5-4.7s4.8 1.6 5.5 4.7" />
      <path d="M16 9h4M18 6.5v4" />
    </>
  ),
  payments: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 10h16M7 15h3" />
    </>
  ),
  reminders: (
    <>
      <path d="M19.5 11.5a7.5 7.5 0 1 1-3-6" />
      <path d="M12 7v5l2.5 2" />
      <path d="M17 4h3v3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M19.4 15a1.5 1.5 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.5 1.5 0 0 0-1.9-.3 1.5 1.5 0 0 0-1 1.5v.2h-2.8v-.2a1.5 1.5 0 0 0-1-1.5 1.5 1.5 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.5 1.5 0 0 0 .3-1.9 1.5 1.5 0 0 0-1.5-1H5.7V11h.2a1.5 1.5 0 0 0 1.5-1 1.5 1.5 0 0 0-.3-1.9L7 8l2-2 .1.1a1.5 1.5 0 0 0 1.9.3 1.5 1.5 0 0 0 1-1.5v-.2h2.8v.2a1.5 1.5 0 0 0 1 1.5 1.5 1.5 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.5 1.5 0 0 0-.3 1.9 1.5 1.5 0 0 0 1.5 1h.2v2.8h-.2a1.5 1.5 0 0 0-1.5 1Z" />
    </>
  ),
};

function SidebarIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: "26px",
        height: "26px",
        flexShrink: 0,
        fill: "white",
        stroke: "gray",
        strokeWidth: 1.5,
      }}
    >
      {icons[name]}
    </svg>
  );
}

export default function DashboardSidebar({
  agency,
  activeItem,
  onNavigate,
  onLogout,
}) {
  const items = [
    { label: "Vue d’ensemble", icon: "overview" },
    { label: "Locataires", icon: "tenants" },
    { label: "Encaissements", icon: "payments" },
    { label: "Relances", icon: "reminders" },
  ];

  return (
    <aside style={{ width: "250px", minWidth: "250px" }}>
      <div>
        <p className="brand">
          <span>Kër</span>guiPay
        </p>
        <p className="agency-name">{agency.agencyName}</p>
        <span className="plan">PLAN DÉMARRAGE</span>
      </div>
      <nav>
        {items.map((item) => (
          <button
            className={activeItem === item.label ? "active" : ""}
            onClick={() => onNavigate(item.label)}
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              color: "white",
            }}
          >
            <SidebarIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-settings">
        <button
          className={activeItem === "Paramètres" ? "active" : ""}
          onClick={() => onNavigate("Paramètres")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            color: "blue",
          }}
        >
          <SidebarIcon name="settings" />
          <span>Paramètres</span>
        </button>
      </div>
      <div className="profile">
        <b>{agency.agencyName.slice(0, 2).toUpperCase()}</b>
        <div>
          <strong>{agency.agencyName}</strong>
          <button onClick={onLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}
