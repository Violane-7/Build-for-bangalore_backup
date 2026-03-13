export default function Grocery() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Grocery Scanner</h2>
      <p style={{ color: "#aaa" }}>Dev 3: Camera/upload barcode or receipt → AI nutrition analysis.</p>

      {/* TODO: Dev 3 — Implement:
          - Camera capture / image upload
          - Send image to backend → AI OCR + nutrition analysis
          - Display per-item recommendations
          - Scan history list
      */}
      <div style={{ marginTop: "2rem", padding: "3rem", border: "1px dashed #444", borderRadius: "12px", textAlign: "center", color: "#666" }}>
        Grocery Scanner Placeholder
      </div>
    </div>
  );
}
