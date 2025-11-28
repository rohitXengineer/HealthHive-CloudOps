// src/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "./api"; // 🔗 Axios instance pointing to backend (http://localhost:8085/api etc.)
import { ROLES, PERMISSIONS } from "./rbacConstants";

const AuthContext = createContext(null);

function normalizeRole(raw) {
  if (!raw) return null;
  return String(raw).toUpperCase();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id, name, email, role}

  // Load user from localStorage on first render (so refresh keeps login)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        parsed.role = normalizeRole(parsed.role);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse saved user from localStorage", e);
        setUser(null);
      }
    }
  }, []);

  // 🔐 REAL LOGIN – calls Spring Boot backend /api/auth/login
  // roleFromUI is still accepted (from dropdown), but the REAL role comes from backend
  async function login(email, password, _roleFromUI) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      // Backend should return: { token, user: { id, name, email, role } }
      const res = await api.post("/auth/login", { email, password });

      const token = res.data?.token;
      const returnedUser = res.data?.user;

      if (!token || !returnedUser) {
        throw new Error("Invalid response from server");
      }

      returnedUser.role = normalizeRole(returnedUser.role);

      // Persist auth in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(returnedUser));

      setUser(returnedUser);
      return returnedUser;
    } catch (err) {
      console.error("Login failed:", err);
      // Try to extract backend error message if available
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Login failed. Please check your credentials.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  function hasRole(role) {
    if (!user || !role) return false;
    return normalizeRole(user.role) === normalizeRole(role);
  }

  function hasAnyRole(roles = []) {
    if (!user || !Array.isArray(roles) || roles.length === 0) return false;
    const userRole = normalizeRole(user.role);
    return roles.map(normalizeRole).includes(userRole);
  }

  function can(action) {
    const allowed = PERMISSIONS[action];
    if (!allowed) return false;
    return hasAnyRole(allowed);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, hasRole, hasAnyRole, can, ROLES }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
