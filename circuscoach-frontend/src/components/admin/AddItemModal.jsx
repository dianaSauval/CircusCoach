import { useState } from "react";
import api from "../../services/api";
import "../../styles/admin/AddItemModal.css";

const AddItemModal = ({ type, parentId, closeModal, onAdd }) => {
  const [activeTab, setActiveTab] = useState("es"); // 🔹 Controla la pestaña activa
  const [formData, setFormData] = useState({
    title: { es: "", en: "", fr: "" },
    description: { es: "", en: "", fr: "" },
    price: type === "formation" ? "" : undefined, // Solo para formaciones
    subtitle: type === "class" ? { es: "", en: "", fr: "" } : undefined,
    secondaryContent: type === "class" ? { es: "", en: "", fr: "" } : undefined,
    pdf: type === "class"
      ? { es: { url: "", title: "", description: "" }, en: { url: "", title: "", description: "" }, fr: { url: "", title: "", description: "" } }
      : undefined,
    video: type === "class"
      ? { es: { url: "", title: "", description: "" }, en: { url: "", title: "", description: "" }, fr: { url: "", title: "", description: "" } }
      : undefined,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: { ...formData[name], [activeTab]: value },
    });
  };

  const handleFileChange = (e, field) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [activeTab]: {
          ...formData[field][activeTab],
          [name]: value
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let payload = {};

      if (type === "formation") {
        endpoint = "/formations";
        payload = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
        };
      } else if (type === "module") {
        endpoint = "/modules";
        payload = {
          title: formData.title,
          description: formData.description,
          formationId: parentId,
        };
      } else if (type === "class") {
        endpoint = "/classes";
        payload = {
          title: formData.title,
          subtitle: formData.subtitle,
          content: formData.description,
          secondaryContent: formData.secondaryContent,
          pdf: formData.pdf,
          video: formData.video,
          moduleId: parentId,
        };
      }

      if (!endpoint) {
        throw new Error("Tipo de creación no válido");
      }

      const response = await api.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      onAdd(response.data);
      closeModal(); // 🔹 Cierra el modal automáticamente
    } catch (error) {
      console.error(`❌ Error al agregar ${type}:`, error.response?.data || error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Agregar {type === "formation" ? "Formación" : type === "module" ? "Módulo" : "Clase"}</h2>

        {/* 🔹 Pestañas de idioma */}
        <div className="language-tabs">
          {["es", "en", "fr"].map((lang) => (
            <button key={lang} className={activeTab === lang ? "active" : ""} onClick={() => setActiveTab(lang)}>
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={formData.title[activeTab]} onChange={handleChange} placeholder={`Título (${activeTab.toUpperCase()})`} required />
          <textarea name="description" value={formData.description[activeTab]} onChange={handleChange} placeholder={`Descripción (${activeTab.toUpperCase()})`} />

          {/* 🔹 Campos específicos para clases */}
          {type === "class" && (
            <>
              <input type="text" name="subtitle" value={formData.subtitle[activeTab]} onChange={handleChange} placeholder={`Subtítulo (${activeTab.toUpperCase()})`} />
              <textarea name="secondaryContent" value={formData.secondaryContent[activeTab]} onChange={handleChange} placeholder={`Contenido Secundario (${activeTab.toUpperCase()})`} />

              <h3>📄 PDF</h3>
              <input type="text" name="url" value={formData.pdf[activeTab].url} onChange={(e) => handleFileChange(e, "pdf")} placeholder="URL del PDF" />
              <input type="text" name="title" value={formData.pdf[activeTab].title} onChange={(e) => handleFileChange(e, "pdf")} placeholder="Título del PDF" />
              <input type="text" name="description" value={formData.pdf[activeTab].description} onChange={(e) => handleFileChange(e, "pdf")} placeholder="Descripción del PDF" />

              <h3>🎥 Video</h3>
              <input type="text" name="url" value={formData.video[activeTab].url} onChange={(e) => handleFileChange(e, "video")} placeholder="URL del Video" />
              <input type="text" name="title" value={formData.video[activeTab].title} onChange={(e) => handleFileChange(e, "video")} placeholder="Título del Video" />
              <input type="text" name="description" value={formData.video[activeTab].description} onChange={(e) => handleFileChange(e, "video")} placeholder="Descripción del Video" />
            </>
          )}

          {/* 🔹 Campo de precio solo para formaciones */}
          {type === "formation" && (
            <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Precio" required />
          )}

          <button type="submit">✅ Agregar</button>
          <button type="button" onClick={closeModal}>❌ Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;






