import { useState } from "react";
import "../../styles/admin/AddClassModal.css";

const AddClassModal = ({ onClose, onAddClass }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    fileUrl: "",
    videoUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClass(formData);
    setFormData({ title: "", content: "", fileUrl: "", videoUrl: "" });
    onClose(); // ✅ Cierra el modal automáticamente después de agregar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Clase</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleChange} required />
          <textarea name="content" placeholder="Contenido" value={formData.content} onChange={handleChange} />
          <input type="text" name="fileUrl" placeholder="URL de archivo (PDF)" value={formData.fileUrl} onChange={handleChange} />
          <input type="text" name="videoUrl" placeholder="URL de Vimeo" value={formData.videoUrl} onChange={handleChange} />
          <div className="modal-actions">
            <button type="submit">✅ Agregar</button>
            <button type="button" onClick={onClose}>❌ Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassModal;

