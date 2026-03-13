import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>PreventAI</h1>
      <p style={{ margin: "1rem 0", color: "#aaa" }}>
        AI-Powered Preventive Healthcare Platform
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
        <Link to="/login" style={{ padding: "0.75rem 2rem", background: "#2563eb", borderRadius: "8px" }}>
          Login
        </Link>
        <Link to="/register" style={{ padding: "0.75rem 2rem", background: "#16a34a", borderRadius: "8px" }}>
          Register
        </Link>
      </div>
    </div>
  );
}
