import axios from "axios";
import { getToken } from "./auth";

const API_URL = "http://localhost:5000/api"; // Cambiá esto si tu backend está en otro lado

// Configurar axios para incluir el token en cada petición
const api = axios.create({
  baseURL: API_URL,
});

// Agregar un interceptor para incluir el token en las peticiones protegidas
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Obtener todos los cursos (ruta pública)
export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

// Obtener un curso por ID (ruta pública)
export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

// Obtener los cursos protegidos (para admin)
export const getAdminCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

// Login de usuario
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// Crear un curso (solo para admin)
export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

// Eliminar un curso (solo para admin)
export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error("Error actualizando el curso:", error);
      throw error;
    }
  };
  

export default api;
