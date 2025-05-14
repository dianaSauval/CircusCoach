import "./Form.css";

const ClassForm = ({ formData, setFormData, activeTab }) => {
  // 🟡 Actualizar campos comunes (título, contenido, etc.)
  const handleTextChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [activeTab]: value,
      },
    });
  };

  // 📄 PDF handlers
  const handlePdfChange = (index, field, value) => {
    const updated = [...(formData.pdfs?.[activeTab] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      pdfs: { ...formData.pdfs, [activeTab]: updated },
    });
  };

  const addPdf = () => {
    const current = formData.pdfs?.[activeTab] || [];
    setFormData({
      ...formData,
      pdfs: { ...formData.pdfs, [activeTab]: [...current, { title: "", description: "", url: "" }] },
    });
  };

  const removePdf = (index) => {
    const updated = [...(formData.pdfs?.[activeTab] || [])];
    updated.splice(index, 1);
    setFormData({
      ...formData,
      pdfs: { ...formData.pdfs, [activeTab]: updated },
    });
  };

  // 🎥 Video handlers
  const handleVideoChange = (index, field, value) => {
    const updated = [...(formData.videos?.[activeTab] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      videos: { ...formData.videos, [activeTab]: updated },
    });
  };

  const addVideo = () => {
    const current = formData.videos?.[activeTab] || [];
    setFormData({
      ...formData,
      videos: { ...formData.videos, [activeTab]: [...current, { title: "", description: "", url: "" }] },
    });
  };

  const removeVideo = (index) => {
    const updated = [...(formData.videos?.[activeTab] || [])];
    updated.splice(index, 1);
    setFormData({
      ...formData,
      videos: { ...formData.videos, [activeTab]: updated },
    });
  };

  return (
    <div className="class-form-container">
      <div className="input-group">
        <label>Título</label>
        <input
          type="text"
          value={formData?.title?.[activeTab] || ""}
          onChange={(e) => handleTextChange("title", e.target.value)}
          placeholder="Título"
        />
      </div>

      <div className="input-group">
        <label>Contenido Principal</label>
        <textarea
          value={formData?.content?.[activeTab] || ""}
          onChange={(e) => handleTextChange("content", e.target.value)}
          placeholder="Contenido principal"
        />
      </div>

      <div className="input-group">
        <label>Subtítulo</label>
        <input
          type="text"
          value={formData?.subtitle?.[activeTab] || ""}
          onChange={(e) => handleTextChange("subtitle", e.target.value)}
          placeholder="Subtítulo"
        />
      </div>

      <div className="input-group">
        <label>Contenido Secundario</label>
        <textarea
          value={formData?.secondaryContent?.[activeTab] || ""}
          onChange={(e) => handleTextChange("secondaryContent", e.target.value)}
          placeholder="Contenido secundario"
        />
      </div>

      <h3>📄 PDFs</h3>
      {(formData.pdfs?.[activeTab] || []).map((pdf, index) => (
        <div key={index} className="pdf-block">
          <div className="input-group">
            <label>Título del PDF</label>
            <input
              type="text"
              value={pdf.title || ""}
              onChange={(e) => handlePdfChange(index, "title", e.target.value)}
              placeholder="Título"
            />
          </div>
          <div className="input-group">
            <label>Descripción del PDF</label>
            <textarea
              value={pdf.description || ""}
              onChange={(e) => handlePdfChange(index, "description", e.target.value)}
              placeholder="Descripción"
            />
          </div>
          <div className="input-group">
            <label>URL del PDF</label>
            <input
              type="text"
              value={pdf.url || ""}
              onChange={(e) => handlePdfChange(index, "url", e.target.value)}
              placeholder="URL"
            />
          </div>
          <button onClick={() => removePdf(index)}>🗑️ Quitar PDF</button>
        </div>
      ))}
      <button onClick={addPdf}>➕ Agregar PDF</button>

      <h3>🎥 Videos</h3>
      {(formData.videos?.[activeTab] || []).map((video, index) => (
        <div key={index} className="video-block">
          <div className="input-group">
            <label>Título del Video</label>
            <input
              type="text"
              value={video.title || ""}
              onChange={(e) => handleVideoChange(index, "title", e.target.value)}
              placeholder="Título"
            />
          </div>
          <div className="input-group">
            <label>Descripción del Video</label>
            <textarea
              value={video.description || ""}
              onChange={(e) => handleVideoChange(index, "description", e.target.value)}
              placeholder="Descripción"
            />
          </div>
          <div className="input-group">
            <label>URL del Video</label>
            <input
              type="text"
              value={video.url || ""}
              onChange={(e) => handleVideoChange(index, "url", e.target.value)}
              placeholder="URL"
            />
          </div>
          <button onClick={() => removeVideo(index)}>🗑️ Quitar Video</button>
        </div>
      ))}
      <button onClick={addVideo}>➕ Agregar Video</button>
    </div>
  );
};

export default ClassForm;

