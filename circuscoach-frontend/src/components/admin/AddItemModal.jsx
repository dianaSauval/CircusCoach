import { useState } from "react";
import api from "../../services/api";
import "../../styles/admin/AddItemModal.css";

const AddItemModal = ({ type, parentId, closeModal, onAdd }) => {
  const [activeTab, setActiveTab] = useState("es"); // 🔹 Controla la pestaña activa
  const [formData, setFormData] = useState({
    title: { es: "", en: "", fr: "" },
    subtitle: { es: "", en: "", fr: "" },
    content: { es: "", en: "", fr: "" },
    secondaryContent: { es: "", en: "", fr: "" },
    pdf: {
      es: { url: "", title: "", description: "" },
      en: { url: "", title: "", description: "" },
      fr: { url: "", title: "", description: "" }
    },
    video: {
      es: { url: "", title: "", description: "" },
      en: { url: "", title: "", description: "" },
      fr: { url: "", title: "", description: "" }
    },
    price: type === "formation" ? "" : undefined, // Solo para formaciones
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { ...formData[e.target.name], [activeTab]: e.target.value },
    });
  };

  const handleFileChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [activeTab]: {
          ...formData[field][activeTab],
          [e.target.name]: e.target.value
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
          description: formData.content, // 🔹 Aquí el contenido funciona como descripción
          price: formData.price
        };
      } else if (type === "module") {
        endpoint = "/modules";
        payload = {
          title: formData.title,
          description: formData.content,
          formationId: parentId
        };
      } else if (type === "class") {
        endpoint = "/classes";
        payload = {
          title: formData.title,
          subtitle: formData.subtitle,
          content: formData.content,
          secondaryContent: formData.secondaryContent,
          pdf: formData.pdf,
          video: formData.video,
          moduleId: parentId
        };
      }

      if (!endpoint) {
        throw new Error("Tipo de creación no válido");
      }

      const response = await api.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      onAdd(response.data); // 🔄 Actualiza la lista sin necesidad de recargar
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
          <input type="text" name="subtitle" value={formData.subtitle[activeTab]} onChange={handleChange} placeholder={`Subtítulo (${activeTab.toUpperCase()})`} />
          <textarea name="content" value={formData.content[activeTab]} onChange={handleChange} placeholder={`Contenido (${activeTab.toUpperCase()})`} />
          <textarea name="secondaryContent" value={formData.secondaryContent[activeTab]} onChange={handleChange} placeholder={`Contenido Secundario (${activeTab.toUpperCase()})`} />

          <h3>📄 PDF</h3>
          <input type="text" name="url" value={formData.pdf[activeTab].url} onChange={(e) => handleFileChange(e, "pdf")} placeholder="URL del PDF" />
          <input type="text" name="title" value={formData.pdf[activeTab].title} onChange={(e) => handleFileChange(e, "pdf")} placeholder="Título del PDF" />
          <input type="text" name="description" value={formData.pdf[activeTab].description} onChange={(e) => handleFileChange(e, "pdf")} placeholder="Descripción del PDF" />

          <h3>🎥 Video</h3>
          <input type="text" name="url" value={formData.video[activeTab].url} onChange={(e) => handleFileChange(e, "video")} placeholder="URL del Video" />
          <input type="text" name="title" value={formData.video[activeTab].title} onChange={(e) => handleFileChange(e, "video")} placeholder="Título del Video" />
          <input type="text" name="description" value={formData.video[activeTab].description} onChange={(e) => handleFileChange(e, "video")} placeholder="Descripción del Video" />

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





