import axios from "axios";
import toast from "react-hot-toast";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hasToken = !!localStorage.getItem("token");
      localStorage.removeItem("token");

      const currentPath = window.location.pathname;
      const isProtectedRoute =
        currentPath.includes("/dashboard") ||
        currentPath.includes("/book") ||
        currentPath.includes("/profile");

      if (hasToken) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      } else if (isProtectedRoute && currentPath !== "/login") {
        toast.error("Please log in to continue.");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      toast.error("Access Denied for a specific action.");
    } else if (error.response?.status === 500) {
      toast.error("Internal Server Error. Please try again later.");
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
