// services/formationService.js
import api from "./api";

export const getVisibleFormations = async (lang = "es") => {
  const res = await api.get(`/formations?lang=${lang}`);
  return res.data;
};

export const getFormationById = async (id, lang = "es") => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/formations/${id}?lang=${lang}`);
  if (!res.ok) throw new Error("No se pudo obtener la formación");
  return res.json();
};

export const getFormationByIdAllInformation = async (id) => {
  const res = await api.get(`/formations/id/${id}`);
  return res.data;
};

export const getFormationVisibleContent = async (id, lang = "es") => {
  const res = await api.get(`/formations/visible/${id}?lang=${lang}`);
  return res.data;
};

export const getAllFormations = async () => {
  const res = await api.get("/formations/admin");
  return res.data;
};

export const createFormation = async (data) => {
  const res = await api.post("/formations", data);
  return res.data;
};

export const updateFormation = async (id, data) => {
  const res = await api.put(`/formations/${id}`, data);
  return res.data;
};

export const deleteFormation = async (id) => {
  const res = await api.delete(`/formations/${id}`);
  return res.data;
};

export const toggleFormationVisibilityByLanguage = async (id, lang) => {
  const res = await api.patch(`/formations/${id}/visibility/language`, { language: lang });
  return res.data;
};

export const makeFormationVisibleInAllLanguages = async (id) => {
  const res = await api.patch(`/formations/${id}/visibility/all`);
  return res.data;
};
