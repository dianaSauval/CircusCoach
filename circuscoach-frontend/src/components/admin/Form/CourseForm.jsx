import { useEffect, useState } from "react";
import "./CourseForm.css";

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

    cleaned.pdfs = (data.pdfs || []).map((pdf) => ({
      url: {
        es: pdf.url?.es || "",
        en: pdf.url?.en || "",
        fr: pdf.url?.fr || "",
      },
      title: {
        es: pdf.title?.es || "",
        en: pdf.title?.en || "",
        fr: pdf.title?.fr || "",
      },
      description: {
        es: pdf.description?.es || "",
        en: pdf.description?.en || "",
        fr: pdf.description?.fr || "",
      },
    }));

    cleaned.videos = (data.videos || []).map((video) => ({
      url: {
        es: video.url?.es || "",
        en: video.url?.en || "",
        fr: video.url?.fr || "",
      },
      title: {
        es: video.title?.es || "",
        en: video.title?.en || "",
        fr: video.title?.fr || "",
      },
      description: {
        es: video.description?.es || "",
        en: video.description?.en || "",
        fr: video.description?.fr || "",
      },
    }));
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
      cleaned.pdf[lang] =
        typeof data.pdf?.[lang] === "string"
          ? data.pdf[lang]
          : data.pdf?.[lang]?.url || "";
      cleaned.video[lang] =
        typeof data.video?.[lang] === "string"
          ? data.video[lang]
          : data.video?.[lang]?.url || "";
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

  const handleAddItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [
        ...(prev[type] || []),
        {
          url: { [activeTab]: "" },
          title: { [activeTab]: "" },
          description: { [activeTab]: "" },
        },
      ],
    }));
  };

  const handleNestedChange = (type, index, lang, field, value) => {
    const items = [...formData[type]];
    items[index][field][lang] = value;
    setFormData((prev) => ({ ...prev, [type]: items }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = prepareDataForSave(formData);
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

          <div className="form-section">
            <label>PDFs:</label>
            <button type="button" onClick={() => handleAddItem("pdfs")}>➕ Agregar PDF</button>
            {formData.pdfs
              ?.filter((pdf) => pdf.url?.[activeTab] !== undefined)
              .map((pdf, i) => (
                <div key={i} className="nested-section">
                  <input
                    type="text"
                    placeholder="URL"
                    value={pdf.url?.[activeTab] || ""}
                    onChange={(e) => handleNestedChange("pdfs", i, activeTab, "url", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Título"
                    value={pdf.title?.[activeTab] || ""}
                    onChange={(e) => handleNestedChange("pdfs", i, activeTab, "title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={pdf.description?.[activeTab] || ""}
                    onChange={(e) => handleNestedChange("pdfs", i, activeTab, "description", e.target.value)}
                  />
                  <button type="button" className="remove-btn" onClick={() => {
                    const updated = [...formData.pdfs];
                    updated.splice(i, 1);
                    setFormData((prev) => ({ ...prev, pdfs: updated }));
                  }}>
                    ❌ Eliminar PDF
                  </button>
                </div>
              ))}
          </div>

          <div className="form-section">
            <label>Videos:</label>
            <button type="button" onClick={() => handleAddItem("videos")}>➕ Agregar Video</button>
            {formData.videos
              ?.filter((video) => video.url?.[activeTab] !== undefined)
              .map((video, i) => (
                <div key={i} className="nested-section">
                  <input
                    type="text"
                    placeholder="URL"
                    value={video.url?.[activeTab] || ""}
                    onChange={(e) => handleNestedChange("videos", i, activeTab, "url", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Título"
                    value={video.title?.[activeTab] || ""}
                    onChange={(e) => handleNestedChange("videos", i, activeTab, "title", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={video.description?.[activeTab] || ""}
                    onChange={(e) => handleNestedChange("videos", i, activeTab, "description", e.target.value)}
                  />
                  <button type="button" className="remove-btn" onClick={() => {
                    const updated = [...formData.videos];
                    updated.splice(i, 1);
                    setFormData((prev) => ({ ...prev, videos: updated }));
                  }}>
                    ❌ Eliminar Video
                  </button>
                </div>
              ))}
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

      <div className="form-buttons">
        <button type="submit">💾 Guardar</button>
        <button type="button" onClick={onCancel}>❌ Cancelar</button>
      </div>
    </form>
  );
};

export default CourseForm;
