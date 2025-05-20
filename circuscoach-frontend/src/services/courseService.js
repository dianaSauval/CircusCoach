// services/courseService.js
import api from "./api";

export const getCourses = async (lang) => {
  const res = await api.get(`/courses/visible?lang=${lang}`);
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

export const getAllCourses = async () => {
  const res = await api.get("/courses/admin");
  return res.data;
};

export const createCourse = async (data) => {
  const res = await api.post("/courses", data);
  return res.data;
};

export const updateCourse = async (id, data) => {
  const res = await api.put(`/courses/${id}`, data);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};

// Clases de curso
export const createCourseClass = async (courseId, data) => {
  const res = await api.post(`/course-classes/${courseId}`, data);
  return res.data;
};

export const updateCourseClass = async (classId, data) => {
  const res = await api.put(`/course-classes/${classId}`, data);
  return res.data;
};

export const deleteCourseClass = async (classId) => {
  const res = await api.delete(`/course-classes/${classId}`);
  return res.data;
};

export const toggleCourseClassVisibility = async (classId, lang) => {
  const res = await api.patch(`/course-classes/${classId}/visibility/${lang}`);
  return res.data;
};

