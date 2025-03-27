import axios from "axios";
import { getToken } from "./auth";

const API_URL = "http://localhost:5000/api"; // Cambiar si estás en producción

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token a las peticiones protegidas
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//
// 🔹 CURSOS
//

// Cursos públicos
export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

// Cursos protegidos (solo admin)
export const getAdminCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

//
// 🔹 FORMACIONES
//

// Obtener todas las formaciones visibles (públicas)
export const getVisibleFormations = async (lang = "es") => {
  const response = await api.get(`/formations?lang=${lang}`);
  return response.data;
};


// Obtener una formación con todos los datos (autenticado)
export const getFormationById = async (id) => {
  const response = await api.get(`/formations/id/${id}`);
  return response.data;
};

// Obtener una formación visible con módulos y clases visibles por idioma
export const getFormationVisibleContent = async (id, lang = "es") => {
  const response = await api.get(`/formations/visible/${id}?lang=${lang}`);
  return response.data;
};

// CRUD (solo para admin)

export const getAllFormations = async () => {
  const response = await api.get("/formations/admin");
  return response.data;
};

export const createFormation = async (data) => {
  const response = await api.post("/formations", data);
  return response.data;
};

export const updateFormation = async (id, data) => {
  const response = await api.put(`/formations/${id}`, data);
  return response.data;
};

export const deleteFormation = async (id) => {
  const response = await api.delete(`/formations/${id}`);
  return response.data;
};

// Visibilidad
export const toggleFormationVisibilityByLanguage = async (id, language) => {
  const response = await api.patch(`/formations/${id}/visibility/language`, { language });
  return response.data;
};

export const makeFormationVisibleInAllLanguages = async (id) => {
  const response = await api.patch(`/formations/${id}/visibility/all`);
  return response.data;
};

//
// 🔹 AUTENTICACIÓN
//

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export default api;
