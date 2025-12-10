import axios from "axios";

// ✅ Make sure this includes /api
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://studyshare-backend-o9m7.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Fixed request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Critical fix for file uploads
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default api;
