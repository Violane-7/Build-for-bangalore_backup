export default function Exposome() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Exposome Radar</h2>
      <p style={{ color: "#aaa" }}>Dev 2: Environmental dashboard — AQI, UV index, weather, pathogen risk.</p>

      {/* TODO: Dev 2 — Integrate:
          - OpenWeatherMap API (weather/UV)
          - AQICN API (air quality)
          - Google Calendar API (schedule)
          Display smart suggestions
      */}
      <div style={{ marginTop: "2rem", padding: "3rem", border: "1px dashed #444", borderRadius: "12px", textAlign: "center", color: "#666" }}>
        Exposome Radar Placeholder
      </div>
    </div>
  );
}
