import { useEffect, useState } from "react";
import "../../../styles/components/Form/CourseForm.css";

const CourseForm = ({ initialData, isClass, onCancel, onSave, activeTab }) => {
  const [formData, setFormData] = useState({ ...initialData });

  useEffect(() => {
    if (!isClass) {
      setFormData((prev) => {
        const fixed = { ...prev };

        ["es", "en", "fr"].forEach((lang) => {
          if (typeof fixed.pdf?.[lang] === "object") {
            fixed.pdf[lang] = fixed.pdf[lang]?.url || "";
          }

          if (typeof fixed.video?.[lang] === "object") {
            fixed.video[lang] = fixed.video[lang]?.url || "";
          }
        });

        return fixed;
      });
    }
  }, [isClass]);

  const prepareDataForSave = (data) => {
    const cleaned = {
      title: data.title,
      visible: data.visible,
    };

    if (isClass) {
      cleaned.subtitle = data.subtitle;
      cleaned.content = data.content;
      cleaned.secondaryContent = data.secondaryContent;
      cleaned.pdf = {};
      cleaned.video = {};

      ["es", "en", "fr"].forEach((lang) => {
        cleaned.pdf[lang] = {
          url: data.pdf?.[lang]?.url || "",
          title: data.pdf?.[lang]?.title || "",
          description: data.pdf?.[lang]?.description || "",
        };

        cleaned.video[lang] = {
          url: data.video?.[lang]?.url || "",
          title: data.video?.[lang]?.title || "",
          description: data.video?.[lang]?.description || "",
        };
      });
    } else {
      cleaned.description = data.description?.es
        ? data.description
        : {
            es: data.description || "",
            en: "",
            fr: "",
          };

      cleaned.image = data.image?.es
        ? data.image
        : {
            es: data.image || "",
            en: "",
            fr: "",
          };

      cleaned.price = Number(data.price);
      cleaned.pdf = {};
      cleaned.video = {};

      ["es", "en", "fr"].forEach((lang) => {
        cleaned.pdf[lang] = typeof data.pdf?.[lang] === "string" ? data.pdf[lang] : data.pdf?.[lang]?.url || "";
        cleaned.video[lang] = typeof data.video?.[lang] === "string" ? data.video[lang] : data.video?.[lang]?.url || "";
      });
    }

    return cleaned;
  };

  const handleChange = (e, field, lang) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = prepareDataForSave(formData);
    console.log("📦 Datos enviados al backend:", cleanedData);
    onSave(cleanedData);
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <label>Título:</label>
        <input
          type="text"
          value={formData.title?.[activeTab] || ""}
          onChange={(e) => handleChange(e, "title", activeTab)}
          required
        />
      </div>

      {isClass ? (
        <>
          <div className="form-section">
            <label>Subtítulo:</label>
            <input
              type="text"
              value={formData.subtitle?.[activeTab] || ""}
              onChange={(e) => handleChange(e, "subtitle", activeTab)}
            />
          </div>

          <div className="form-section">
            <label>Contenido:</label>
            <textarea
              value={formData.content?.[activeTab] || ""}
              onChange={(e) => handleChange(e, "content", activeTab)}
            />
          </div>

          <div className="form-section">
            <label>Contenido secundario:</label>
            <textarea
              value={formData.secondaryContent?.[activeTab] || ""}
              onChange={(e) => handleChange(e, "secondaryContent", activeTab)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-section">
            <label>Descripción:</label>
            <textarea
              value={formData.description?.[activeTab] || ""}
              onChange={(e) => handleChange(e, "description", activeTab)}
            />
          </div>

          <div className="form-section">
            <label>Precio:</label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleSimpleChange}
            />
          </div>

          <div className="form-section">
            <label>Imagen de presentación (URL):</label>
            <input
              type="text"
              value={formData.image?.[activeTab] || ""}
              onChange={(e) => handleChange(e, "image", activeTab)}
            />
          </div>
        </>
      )}

      <div className="form-section">
        <label>PDF:</label>
        {isClass ? (
          <>
            <input
              type="text"
              placeholder="URL PDF"
              value={formData.pdf?.[activeTab]?.url || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pdf: {
                    ...prev.pdf,
                    [activeTab]: {
                      ...prev.pdf?.[activeTab],
                      url: e.target.value,
                    },
                  },
                }))
              }
            />
            <input
              type="text"
              placeholder="Título PDF"
              value={formData.pdf?.[activeTab]?.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pdf: {
                    ...prev.pdf,
                    [activeTab]: {
                      ...prev.pdf?.[activeTab],
                      title: e.target.value,
                    },
                  },
                }))
              }
            />
            <input
              type="text"
              placeholder="Descripción PDF"
              value={formData.pdf?.[activeTab]?.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pdf: {
                    ...prev.pdf,
                    [activeTab]: {
                      ...prev.pdf?.[activeTab],
                      description: e.target.value,
                    },
                  },
                }))
              }
            />
          </>
        ) : (
          <input
            type="text"
            placeholder="URL PDF"
            value={formData.pdf?.[activeTab] || ""}
            onChange={(e) => handleChange(e, "pdf", activeTab)}
          />
        )}
      </div>

      <div className="form-section">
        <label>Video:</label>
        {isClass ? (
          <>
            <input
              type="text"
              placeholder="URL Video"
              value={formData.video?.[activeTab]?.url || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  video: {
                    ...prev.video,
                    [activeTab]: {
                      ...prev.video?.[activeTab],
                      url: e.target.value,
                    },
                  },
                }))
              }
            />
            <input
              type="text"
              placeholder="Título Video"
              value={formData.video?.[activeTab]?.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  video: {
                    ...prev.video,
                    [activeTab]: {
                      ...prev.video?.[activeTab],
                      title: e.target.value,
                    },
                  },
                }))
              }
            />
            <input
              type="text"
              placeholder="Descripción Video"
              value={formData.video?.[activeTab]?.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  video: {
                    ...prev.video,
                    [activeTab]: {
                      ...prev.video?.[activeTab],
                      description: e.target.value,
                    },
                  },
                }))
              }
            />
          </>
        ) : (
          <input
            type="text"
            placeholder="URL Video"
            value={formData.video?.[activeTab] || ""}
            onChange={(e) => handleChange(e, "video", activeTab)}
          />
        )}
      </div>

      <div className="form-buttons">
        <button type="submit">💾 Guardar</button>
        <button type="button" onClick={onCancel}>
          ❌ Cancelar
        </button>
      </div>
    </form>
  );
};

export default CourseForm;