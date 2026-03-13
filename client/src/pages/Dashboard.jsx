import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const navLinks = [
    { to: "/glass-body", label: "Glass Body (Digital Twin)" },
    { to: "/exposome", label: "Exposome Radar" },
    { to: "/appointments", label: "Appointments" },
    { to: "/grocery", label: "Grocery Scanner" },
    { to: "/goals", label: "Goal Planner" },
    { to: "/wearable", label: "Wearable Panel" },
    { to: "/emergency", label: "Emergency" },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard ({user?.gender})</h1>
        <button onClick={logout} style={{ padding: "0.5rem 1rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <p style={{ color: "#aaa", margin: "0.5rem 0" }}>Welcome, {user?.name}</p>

      {/* Quick nav grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} style={{ padding: "1.5rem", background: "#1a1a2e", borderRadius: "12px", textAlign: "center", border: "1px solid #333" }}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* TODO: Dev 2 — Add health charts (steps, sleep, heart rate, calories) here */}
    </div>
  );
}
