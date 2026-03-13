export default function Wearable() {
  return (
    <div
      style={{
        maxWidth: "320px",
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "50%",
        aspectRatio: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a1a2e",
        border: "3px solid #333",
      }}
    >
      <h3 style={{ margin: 0 }}>Wearable Panel</h3>
      <p style={{ color: "#aaa", fontSize: "0.85rem", textAlign: "center" }}>
        Dev 2: Smartwatch-style compact UI
      </p>

      {/* TODO: Dev 2 — Implement:
          - Circular layout mimicking a smartwatch
          - Heart rate display (real-time sim)
          - Step counter
          - Alert notifications
          - Emergency button
      */}
      <div style={{ marginTop: "1rem", color: "#666", fontSize: "0.8rem" }}>
        HR: -- bpm | Steps: --
      </div>
    </div>
  );
}
