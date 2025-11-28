import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login.jsx";
import ProtectedSection from "./components/ProtectedSection";
import { useAuth } from "./AuthContext";
import api from "./api"; // 👈 new

function App() {
  const [records, setRecords] = useState([]);      // now synced with backend
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);   // optional: for UX
  const [error, setError] = useState(null);

  const { user, logout } = useAuth();

  // 🔄 Load patients from backend on first render
  useEffect(() => {
    if (user) {
      // only load records after login
      fetchPatients();
    } else {
      setRecords([]); // clear on logout
    }
  }, [user]);

  async function fetchPatients() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/patients");
      setRecords(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load patient records from server.");
    } finally {
      setLoading(false);
    }
  }

  // ➕ Add or Update record (connected to backend)
  async function addRecord(newRecord) {
    try {
      setError(null);

      if (editIndex !== null) {
        // UPDATE
        const existing = records[editIndex];
        if (!existing || existing.id == null) {
          console.warn("No existing patient id found for update");
          return;
        }

        const res = await api.put(`/patients/${existing.id}`, {
          ...existing,
          ...newRecord,
        });

        const updatedList = [...records];
        updatedList[editIndex] = res.data;
        setRecords(updatedList);
        setEditIndex(null);
      } else {
        // CREATE
        const res = await api.post("/patients", newRecord);
        setRecords((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save patient record.");
    }
  }

  // ❌ Delete record (connected to backend)
  async function deleteRecord(index) {
    try {
      setError(null);
      const target = records[index];
      if (!target || target.id == null) {
        console.warn("No patient id found for delete");
        return;
      }

      await api.delete(`/patients/${target.id}`);
      setRecords(records.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      setError("Failed to delete patient.");
    }
  }

  function editRecord(index) {
    setEditIndex(index);
  }

  const appStyle = {
    backgroundColor: darkMode ? "#121212" : "#f9f9f9",
    color: darkMode ? "#e0e0e0" : "#2c3e50",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const containerStyle = {
    flex: 1,
    maxWidth: "900px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "12px",
    background: darkMode ? "#1e1e1e" : "white",
    boxShadow: darkMode
      ? "0 4px 20px rgba(255,255,255,0.05)"
      : "0 4px 20px rgba(0,0,0,0.1)",
  };

  return (
    <div style={appStyle}>
      <Header />

      {/* Top bar: auth info + dark mode */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px 20px",
          alignItems: "center",
        }}
      >
        <div>
          {user ? (
            <>
              Logged in as <b>{user.name}</b> ({user.role})
              <button
                onClick={logout}
                style={{
                  marginLeft: "10px",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: "#e53935",
                  color: "white",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <span>Not logged in</span>
          )}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: darkMode ? "#26a69a" : "#00695c",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <main style={containerStyle}>
        {/* If not logged in -> only show login */}
        {!user && <Login />}

        {/* After login -> show app */}
        {user && (
          <>
            {error && (
              <p style={{ color: "#ff6b6b", marginBottom: "8px" }}>{error}</p>
            )}
            {loading && <p>Loading patient records...</p>}

            <ProtectedSection>
              <Dashboard records={records} />
            </ProtectedSection>

            <ProtectedSection roles={["ADMIN", "DOCTOR"]}>
              <PatientForm
                onAdd={addRecord}
                editRecord={records[editIndex] || null}
              />
            </ProtectedSection>

            <ProtectedSection>
              <PatientList
                records={records}
                onDelete={deleteRecord}
                onEdit={editRecord}
              />
            </ProtectedSection>
          </>
        )}
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;
