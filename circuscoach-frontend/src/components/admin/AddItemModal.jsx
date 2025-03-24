import { useState } from "react";
import api from "../../services/api";
import "../../styles/admin/AddItemModal.css";

const AddItemModal = ({ type, parentId, closeModal, onAdd }) => {
  const [activeTab, setActiveTab] = useState("es"); // 🔹 Controla la pestaña activa
  const isFormation = type === "formation";
const isClass = type === "class";

const [formData, setFormData] = useState({
  title: { es: "", en: "", fr: "" },
  description: { es: "", en: "", fr: "" }, // se usa como content
  price: isFormation ? "" : undefined,
  mode: isFormation ? "presencial" : undefined,
  image: isFormation ? "" : undefined,
  subtitle: isClass ? { es: "", en: "", fr: "" } : undefined,
  secondaryContent: isClass ? { es: "", en: "", fr: "" } : undefined,
  pdf: isFormation
    ? { es: "", en: "", fr: "" }
    : {
        es: { url: "", title: "", description: "" },
        en: { url: "", title: "", description: "" },
        fr: { url: "", title: "", description: "" },
      },
  video: isFormation
    ? { es: "", en: "", fr: "" }
    : {
        es: { url: "", title: "", description: "" },
        en: { url: "", title: "", description: "" },
        fr: { url: "", title: "", description: "" },
      },
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
          [name]: value,
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let payload = {};

      // 👉 construir payload según el tipo
      if (type === "formation") {
        endpoint = "/formations";
        payload = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          mode: formData.mode,
          image: formData.image,
          pdf: formData.pdf,
          video: formData.video,
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

      if (!endpoint) throw new Error("Tipo no válido");

      const response = await api.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // ✅ Llama a onAdd (fetchFormations) para refrescar
      onAdd(response.data);

      // ✅ Cierra el modal
      closeModal();
    } catch (error) {
      if (error.response) {
        console.error(`❌ Error al agregar ${type}:`, error.response.data);
      } else {
        console.error(`❌ Error al agregar ${type}:`, error.message);
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          Agregar{" "}
          {type === "formation"
            ? "Formación"
            : type === "module"
            ? "Módulo"
            : "Clase"}
        </h2>

        {/* 🔹 Pestañas de idioma */}
        <div className="language-tabs">
          {["es", "en", "fr"].map((lang) => (
            <button
              key={lang}
              className={activeTab === lang ? "active" : ""}
              onClick={() => setActiveTab(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title[activeTab]}
            onChange={handleChange}
            placeholder={`Título (${activeTab.toUpperCase()})`}
            required
          />
          <textarea
            name="description"
            value={formData.description[activeTab]}
            onChange={handleChange}
            placeholder={`Descripción (${activeTab.toUpperCase()})`}
          />

          {/* 🔹 Campos específicos para clases */}
          {type === "class" && (
            <>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle[activeTab]}
                onChange={handleChange}
                placeholder={`Subtítulo (${activeTab.toUpperCase()})`}
              />
              <textarea
                name="secondaryContent"
                value={formData.secondaryContent[activeTab]}
                onChange={handleChange}
                placeholder={`Contenido Secundario (${activeTab.toUpperCase()})`}
              />

              <h3>📄 PDF</h3>
              <input
                type="text"
                name="url"
                value={formData.pdf[activeTab].url}
                onChange={(e) => handleFileChange(e, "pdf")}
                placeholder="URL del PDF"
              />
              <input
                type="text"
                name="title"
                value={formData.pdf[activeTab].title}
                onChange={(e) => handleFileChange(e, "pdf")}
                placeholder="Título del PDF"
              />
              <input
                type="text"
                name="description"
                value={formData.pdf[activeTab].description}
                onChange={(e) => handleFileChange(e, "pdf")}
                placeholder="Descripción del PDF"
              />

              <h3>🎥 Video</h3>
              <input
                type="text"
                name="url"
                value={formData.video[activeTab].url}
                onChange={(e) => handleFileChange(e, "video")}
                placeholder="URL del Video"
              />
              <input
                type="text"
                name="title"
                value={formData.video[activeTab].title}
                onChange={(e) => handleFileChange(e, "video")}
                placeholder="Título del Video"
              />
              <input
                type="text"
                name="description"
                value={formData.video[activeTab].description}
                onChange={(e) => handleFileChange(e, "video")}
                placeholder="Descripción del Video"
              />
            </>
          )}

          {/* 🔹 Campo de precio solo para formaciones */}
          {type === "formation" && (
            <>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Precio"
                required
              />

              <label>Modalidad</label>
              <select
                value={formData.mode}
                onChange={(e) =>
                  setFormData({ ...formData, mode: e.target.value })
                }
              >
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
              </select>

              <label>URL de imagen</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/imagen.jpg"
              />

              <div className="media-section">
              <h3>📄 PDF</h3>
    <input
      className="url-input"
      type="text"
      name="pdf"
      value={formData.pdf[activeTab]}
      onChange={(e) =>
        setFormData({
          ...formData,
          pdf: { ...formData.pdf, [activeTab]: e.target.value },
        })
      }
      placeholder={`URL del PDF (${activeTab.toUpperCase()})`}
    />

                <h3>🎥 Video</h3>
                <input
      className="url-input"
      type="text"
      name="video"
      value={formData.video[activeTab]}
      onChange={(e) =>
        setFormData({
          ...formData,
          video: { ...formData.video, [activeTab]: e.target.value },
        })
      }
      placeholder={`URL del Video (${activeTab.toUpperCase()})`}
    />
  </div>
            </>
          )}

          <button type="submit">✅ Agregar</button>
          <button type="button" onClick={closeModal}>
            ❌ Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
