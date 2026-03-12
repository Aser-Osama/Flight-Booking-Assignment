import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  let token = null;

  try {
    const stored = localStorage.getItem("auth");
    token = stored ? JSON.parse(stored).token : null;
  } catch {
    localStorage.removeItem("auth");
  }

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
