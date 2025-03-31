import { useState } from "react";
import { createCourseClass, createCourse } from "../../services/api";
import "../../styles/admin/AddItemModal.css";

const AddCoursesModal = ({ courseId, onClose, onClassAdded, onCourseAdded }) => {
  const isAddingCourse = !courseId;
  const [activeTab, setActiveTab] = useState("es");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: { es: "", en: "", fr: "" },
    description: { es: "", en: "", fr: "" },
    price: "",
    image: { es: "", en: "", fr: "" },
    pdf: { es: "", en: "", fr: "" },
    video: { es: "", en: "", fr: "" },
    subtitle: { es: "", en: "", fr: "" },
    content: { es: "", en: "", fr: "" },
    secondaryContent: { es: "", en: "", fr: "" },
    pdfDetails: {
      es: { url: "", title: "", description: "" },
      en: { url: "", title: "", description: "" },
      fr: { url: "", title: "", description: "" },
    },
    videoDetails: {
      es: { url: "", title: "", description: "" },
      en: { url: "", title: "", description: "" },
      fr: { url: "", title: "", description: "" },
    },
    visible: {
      es: true,
      en: false,
      fr: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [activeTab]: value,
      },
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleNestedChange = (e, field) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [activeTab]: {
          ...prev[field][activeTab],
          [name]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.es) newErrors.title = "El título en español es obligatorio.";

    if (isAddingCourse) {
      if (!formData.description.es) newErrors.description = "La descripción en español es obligatoria.";
      if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "El precio debe ser mayor a 0.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isAddingCourse) {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          image: formData.image,
          pdf: formData.pdf,
          video: formData.video,
        };
        const response = await createCourse(payload);
        onCourseAdded?.(response);
      } else {
        const payload = {
          title: formData.title,
          subtitle: formData.subtitle,
          content: formData.content,
          secondaryContent: formData.secondaryContent,
          pdf: formData.pdfDetails,
          video: formData.videoDetails,
          visible: formData.visible,
          course: courseId,
        };
        const response = await createCourseClass(courseId, payload);
        onClassAdded?.(response);
      }

      onClose();
    } catch (error) {
      console.error("❌ Error al crear:", error.response?.data || error.message);
      setErrors({ global: error.response?.data?.error || "Error inesperado al crear." });
    }
  };

  const inputClass = (field) => (errors[field] ? "error" : "");

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isAddingCourse ? "Agregar Curso" : "Agregar Clase"}</h2>

        <div className="language-tabs">
          {['es', 'en', 'fr'].map((lang) => (
            <button
              key={lang}
              className={activeTab === lang ? "active" : ""}
              onClick={() => setActiveTab(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {errors.global && <p className="error-message">⚠️ {errors.global}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title[activeTab]}
            onChange={handleChange}
            placeholder={`Título (${activeTab})`}
            className={inputClass("title")}
          />
          {errors.title && <div className="field-error">{errors.title}</div>}

          {isAddingCourse ? (
            <>
              <textarea
                name="description"
                value={formData.description[activeTab]}
                onChange={handleChange}
                placeholder={`Descripción (${activeTab})`}
                className={inputClass("description")}
              />
              {errors.description && <div className="field-error">{errors.description}</div>}

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Precio"
                className={inputClass("price")}
              />
              {errors.price && <div className="field-error">{errors.price}</div>}

              <input
                type="text"
                name="image"
                value={formData.image[activeTab]}
                onChange={handleChange}
                placeholder={`Imagen (${activeTab})`}
              />
              <input
                type="text"
                name="pdf"
                value={formData.pdf[activeTab]}
                onChange={handleChange}
                placeholder={`PDF (${activeTab})`}
              />
              <input
                type="text"
                name="video"
                value={formData.video[activeTab]}
                onChange={handleChange}
                placeholder={`Video (${activeTab})`}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle[activeTab]}
                onChange={handleChange}
                placeholder={`Subtítulo (${activeTab})`}
              />
              <textarea
                name="content"
                value={formData.content[activeTab]}
                onChange={handleChange}
                placeholder={`Contenido (${activeTab})`}
              />
              <textarea
                name="secondaryContent"
                value={formData.secondaryContent[activeTab]}
                onChange={handleChange}
                placeholder={`Contenido secundario (${activeTab})`}
              />

              <h3>📄 PDF</h3>
              <input
                type="text"
                name="url"
                value={formData.pdfDetails[activeTab].url}
                onChange={(e) => handleNestedChange(e, "pdfDetails")}
                placeholder="URL del PDF"
              />
              <input
                type="text"
                name="title"
                value={formData.pdfDetails[activeTab].title}
                onChange={(e) => handleNestedChange(e, "pdfDetails")}
                placeholder="Título del PDF"
              />
              <input
                type="text"
                name="description"
                value={formData.pdfDetails[activeTab].description}
                onChange={(e) => handleNestedChange(e, "pdfDetails")}
                placeholder="Descripción del PDF"
              />

              <h3>🎥 Video</h3>
              <input
                type="text"
                name="url"
                value={formData.videoDetails[activeTab].url}
                onChange={(e) => handleNestedChange(e, "videoDetails")}
                placeholder="URL del Video"
              />
              <input
                type="text"
                name="title"
                value={formData.videoDetails[activeTab].title}
                onChange={(e) => handleNestedChange(e, "videoDetails")}
                placeholder="Título del Video"
              />
              <input
                type="text"
                name="description"
                value={formData.videoDetails[activeTab].description}
                onChange={(e) => handleNestedChange(e, "videoDetails")}
                placeholder="Descripción del Video"
              />
            </>
          )}

          <div className="content-button-modal">
            <button type="submit">✅ Agregar</button>
            <button type="button" onClick={onClose}>
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoursesModal;
