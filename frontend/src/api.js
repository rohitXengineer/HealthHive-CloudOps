// src/api.js
import axios from "axios";

const api = axios.create({
  // 👇 Use your backend port here (you used 8085 in the last step)
  baseURL: "http://localhost:8085/api",
});

// Attach token if you want later (already added in AuthContext)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
