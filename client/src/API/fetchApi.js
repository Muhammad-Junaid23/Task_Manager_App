const API_BASE = "http://localhost:4044/api";

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export const authApi = {
  login: (credentials) =>
    apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

export const taskApi = {
  getTasks: () => apiFetch("/tasks"),
  getTask: (id) => apiFetch(`/tasks/${id}`),
  createTask: (taskData) =>
    apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),
  updateTask: (id, updates) =>
    apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteTask: (id) => apiFetch(`/tasks/${id}`, { method: "DELETE" }),
};
