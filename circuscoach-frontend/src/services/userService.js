// services/userService.js
import api from "./api";

// Perfil
export const getUserProfile = async () => {
  const response = await api.get("/auth/perfil");
  return response.data;
};

// ✅ Marcar clase como completada
export const marcarClaseCompletada = async (userId, courseId, classId) => {
  const response = await api.post(`/users/${userId}/progreso/${courseId}`, {
    classId,
  });
  return response.data;
};

// ✅ Obtener progreso del usuario en un curso
export const obtenerProgreso = async (userId, courseId) => {
  const response = await api.get(`/users/${userId}/progreso/${courseId}`);
  return response.data;
};

// ✅ Agregar curso a la lista de cursos comprados (opcional)
export const comprarCurso = async (userId, courseId) => {
  const response = await api.post(`/users/${userId}/comprar/${courseId}`);
  return response.data;
};
