function Header() {
  const headerStyle = {
    background: "linear-gradient(90deg, #00695c, #26a69a)",
    color: "white",
    padding: "20px",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "1px",
    borderRadius: "0 0 15px 15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  };

  return (
    <header style={headerStyle}>
      🌿 VitalNotes: Health Recording System
    </header>
  );
}
export default Header;