function Dashboard({ records }) {
  if (records.length === 0) {
    return <p style={{ fontStyle: "italic" }}>No records yet.</p>;
  }

  const total = records.length;
  const avgAge = Math.round(
    records.reduce((sum, r) => sum + Number(r.age), 0) / total
  );

  const seriousCases = records.filter(r =>
    r.condition.toLowerCase().includes("serious")
  ).length;

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-around",
      background: "#e0f2f1",
      borderRadius: "10px",
      padding: "15px",
      margin: "20px 0"
    }}>
      <div>👥 Total Patients: <strong>{total}</strong></div>
      <div>🎂 Avg Age: <strong>{avgAge}</strong></div>
      <div>⚠️ Serious Cases: <strong>{seriousCases}</strong></div>
    </div>
  );
}
export default Dashboard;