import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ✅ INTERCEPTOR para enviar el userId en todos los requests
API.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers["userId"] = userId;
  }
  return config;
});

export const getEmployees = () => API.get("/employees");
export const createEmployee = (data) => API.post("/employees", data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data); // <-- ✅ NUEVA

export const assignTaskToEmployee = (taskId, employeeId) =>
  API.patch(`/tasks/${taskId}/assign`, { employeeId });

export const updateTask = (taskId, data) => API.put(`/tasks/${taskId}`, data);
export const getProjects = () => API.get("/projects");
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

export const getTasksByProject = (projectId) =>
  API.get(`/tasks/project/${projectId}`);
export const createTask = (data) => API.post("/tasks", data);
export const updateTaskStatus = (id, status) =>
  API.patch(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
