import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const links = [
    ["/", "Dashboard"],
    ["/diplomas", "Diplomas"],
    ["/relatorios", "Relatórios"],
  ];
  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <img
            style={{ width: 200, marginBottom: 15 }}
            src="/src/assets/sisinove-logo-transparente.png"
          ></img>
          <h1>Sisinove Diplomas</h1>
          <p>Registro de Diplomas Sisinove</p>
          <div className="nav">
            {links.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                style={{
                  outline:
                    location.pathname === to
                      ? "2px solid rgba(255,255,255,.55)"
                      : "none",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            padding: 12,
            background: "rgba(255,255,255,.08)",
            borderRadius: 10,
          }}
        >
          <div style={{ fontWeight: 700 }}>{user?.name}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{user?.role}</div>
          <button onClick={logout} style={{ marginTop: 12, width: "100%" }}>
            Sair
          </button>
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <div>
            <h2 style={{ margin: 0 }}>Painel de Diplomas</h2>
            <div className="muted">
              Controle por polo, cidade e emissão geral
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
