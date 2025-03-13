import { useState } from "react";
import "../../styles/admin/AddModuleModal.css";

const AddModuleModal = ({ onClose, onAddModule }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddModule(formData);
    setFormData({ title: "", description: "" });
    onClose(); // ✅ Cierra el modal automáticamente después de agregar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Módulo</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} />
          <div className="modal-actions">
            <button type="submit">✅ Agregar</button>
            <button type="button" onClick={onClose}>❌ Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleModal;
