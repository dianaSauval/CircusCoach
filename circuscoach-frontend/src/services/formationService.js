// services/formationService.js
import api from "./api";

export const getVisibleFormations = async (lang = "es") => {
  const res = await api.get(`/formations?lang=${lang}`);
  return res.data;
};

export const getFormationById = async (id, lang = "es") => {
  try {
    const res = await api.get(`/formations/${id}?lang=${lang}`);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error; // reenvía el error con el response completo (403, 404, etc.)
    } else {
      throw new Error("No se pudo obtener la formación");
    }
  }
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
