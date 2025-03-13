import { useState } from "react";
import api from "../../services/api";
import "../../styles/admin/AddItemModal.css";

const AddItemModal = ({ type, parentId, closeModal, fetchFormations }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: type === "module" ? "" : undefined,
    content: type === "class" ? "" : undefined,
    fileUrl: type === "class" ? "" : undefined,
    videoUrl: type === "class" ? "" : undefined,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === "module" ? "/modules" : "/classes";

      // 🔹 Enviamos el `formationId` cuando agregamos un módulo
      const payload = type === "module"
        ? { title: formData.title, description: formData.description, formationId: parentId }
        : { title: formData.title, content: formData.content, fileUrl: formData.fileUrl, videoUrl: formData.videoUrl, moduleId: parentId };

      await api.post(endpoint, payload);

      fetchFormations(); // 🔄 Actualizar formaciones al instante
      closeModal(); // 🔹 Cerrar el modal automáticamente
    } catch (error) {
      console.error(`Error al agregar ${type}:`, error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Agregar {type === "module" ? "Módulo" : "Clase"}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título" required />
          {type === "module" && <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" />}
          {type === "class" && (
            <>
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Contenido de la clase" />
              <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="URL del PDF" />
              <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="URL del video" />
            </>
          )}
          <button type="submit">✅ Agregar</button>
          <button type="button" onClick={closeModal}>❌ Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
