import axios from "axios";

// ✅ Use your Render backend URL with fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://studyshare-backend-o9m7.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  // ✅ REMOVED the default Content-Type header - this was causing upload failures
});

// ✅ Fixed request interceptor for file uploads
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ CRITICAL FIX: Only set Content-Type for JSON, NOT for file uploads
  if (config.data instanceof FormData) {
    // For file uploads, let browser set Content-Type with boundary
    delete config.headers["Content-Type"];
  } else {
    // For regular API calls, use JSON
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default api;
