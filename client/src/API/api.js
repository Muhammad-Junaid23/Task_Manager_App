import axios from "axios";

const API_BASE =
  import.meta.env.MODE === "production"
    ? "taskmanagerapp-production-a93a.up.railway.app/api"
    : "/api";

const API = axios.create({
  baseURL: API_BASE,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  profile: () => API.get("/users/profile"),
  login: (credentials) => API.post("/users/login", credentials),
  register: (userData) => API.post("/users", userData),
};

export const taskApi = {
  getTasks: () => API.get("/tasks"),
  getTask: (id) => API.get(`/tasks/${id}`),
  createTask: (taskData) => API.post("/tasks", taskData),
  updateTask: (id, updates) => API.put(`/tasks/${id}`, updates),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
};
