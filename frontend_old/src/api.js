import axios from "axios";

export const BASE_URL =
  process.env.REACT_APP_API_URL || "https://hospital-backend-f0kz.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // optional safety timeout
});

// ✅ Automatically attach auth token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional global error handler (useful for expired tokens)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // force logout
    }
    return Promise.reject(error);
  }
);

export default API;
