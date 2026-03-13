export default function Emergency() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ color: "#ff4444" }}>Emergency Action</h2>
      <p style={{ color: "#aaa" }}>Dev 1: Emergency detection, alerts, and automatic response.</p>

      {/* TODO: Dev 1 — Implement:
          - Emergency state detection (from wearable vitals via AI)
          - Loud audio alert via Web Audio API
          - navigator.vibrate() for phone
          - Auto-call 911 (tel: link)
          - Message emergency contacts
          - Display emergency instructions (e.g. "chew aspirin")
          - Big red SOS button
      */}
      <button
        style={{
          marginTop: "3rem",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "#cc0000",
          border: "4px solid #ff4444",
          color: "#fff",
          fontSize: "1.5rem",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => alert("Emergency SOS triggered! (placeholder)")}
      >
        SOS
      </button>
      <p style={{ marginTop: "1rem", color: "#666" }}>
        Press and hold for emergency
      </p>
    </div>
  );
}
