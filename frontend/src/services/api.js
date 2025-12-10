import axios from "axios";

// ✅ Make sure this includes /api
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://studyshare-backend-o9m7.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Enhanced request interceptor with debugging
api.interceptors.request.use((config) => {
  console.log("🚀 API Request:", {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    data: config.data,
    headers: config.headers,
  });

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

// ✅ Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
