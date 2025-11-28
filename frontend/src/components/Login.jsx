// src/components/Login.jsx
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { ROLES } from "../rbacConstants";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN); // default role
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await login(email, password, role);
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed. Please try again.");
    }
  }

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    padding: "24px 26px 22px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #ffffff, #f3f7ff)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.04)",
  };

  const titleStyle = {
    margin: 0,
    marginBottom: "4px",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#0d3b66",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const subtitleStyle = {
    margin: 0,
    marginBottom: "18px",
    fontSize: "0.9rem",
    color: "#52616b",
  };

  const labelStyle = {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: "4px",
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 11px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "0.9rem",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "white",
  };

  const inputWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "white",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    marginTop: "6px",
    boxShadow: "0 6px 16px rgba(13,148,136,0.35)",
  };

  const errorStyle = {
    color: "#b91c1c",
    fontSize: "0.85rem",
    marginBottom: "8px",
    background: "#fee2e2",
    borderRadius: "8px",
    padding: "6px 8px",
  };

  const roleHintStyle = {
    fontSize: "0.78rem",
    color: "#6b7280",
    marginTop: "2px",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>
          <span role="img" aria-label="health">
            🩺
          </span>
          HEALTHHIVE Login
        </h2>
        <p style={subtitleStyle}>
          Sign in to manage patients, records and healthcare workflows.
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "12px", marginTop: "6px" }}
        >
          <div style={inputWrapperStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              placeholder="e.g. admin@healthhive.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onFocus={(e) => {
                e.target.style.borderColor = "#0d9488";
                e.target.style.boxShadow = "0 0 0 2px rgba(13,148,136,0.20)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={inputWrapperStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={(e) => {
                e.target.style.borderColor = "#0d9488";
                e.target.style.boxShadow = "0 0 0 2px rgba(13,148,136,0.20)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={inputWrapperStyle}>
            <label style={labelStyle}>Role</label>
            <select
              style={selectStyle}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value={ROLES.ADMIN}>Admin – Full Access</option>
              <option value={ROLES.DOCTOR}>Doctor – Clinical Access</option>
              <option value={ROLES.NURSE}>Nurse – Vitals & Updates</option>
              <option value={ROLES.PATIENT}>Patient – Personal Records</option>
            </select>
            <span style={roleHintStyle}>
              Choose how you want to access HEALTHHIVE.
            </span>
          </div>

          <button type="submit" style={buttonStyle}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
