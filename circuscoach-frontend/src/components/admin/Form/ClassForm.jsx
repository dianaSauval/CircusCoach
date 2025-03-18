import "../../../styles/components/Form/Form.css"

const ClassForm = ({ formData, setFormData, activeTab }) => {
  return (
    <div className="class-form-container">
      <div className="input-group">
        <label>Título</label>
        <input
          type="text"
          name="title"
          value={formData?.title?.[activeTab] || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: { ...formData.title, [activeTab]: e.target.value },
            })
          }
          placeholder="Título"
        />
      </div>
      <div className="input-group">
        <label>Contenido Principal</label>
        <textarea
          value={formData?.content?.[activeTab] || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              content: { ...formData.content, [activeTab]: e.target.value },
            })
          }
          placeholder="Contenido principal"
        />
      </div>

      <div className="input-group">
        <label>Subtítulo</label>
        <input
          type="text"
          name="subtitle"
          value={formData?.subtitle?.[activeTab] || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              subtitle: { ...formData.subtitle, [activeTab]: e.target.value },
            })
          }
          placeholder="Subtítulo"
        />
      </div>

      <div className="input-group">
        <label>Contenido Secundario</label>
        <textarea
          name="secondaryContent"
          value={formData?.secondaryContent?.[activeTab] || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              secondaryContent: {
                ...formData.secondaryContent,
                [activeTab]: e.target.value,
              },
            })
          }
          placeholder="Contenido secundario"
        />
      </div>

      <h3>📄 PDF</h3>
      <div className="input-group">
        <label>Título del PDF</label>
        <input
          type="text"
          name="pdfTitle"
          value={formData?.pdf?.[activeTab]?.title || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              pdf: {
                ...formData.pdf,
                [activeTab]: {
                  ...formData.pdf?.[activeTab],
                  title: e.target.value,
                },
              },
            })
          }
          placeholder="Título del PDF"
        />
      </div>
      <div className="input-group">
        <label>Descripción del PDF</label>
        <textarea
          value={formData?.pdf?.[activeTab]?.description || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              pdf: {
                ...formData.pdf,
                [activeTab]: {
                  ...formData.pdf?.[activeTab],
                  description: e.target.value,
                },
              },
            })
          }
          placeholder="Descripción del PDF"
        />
      </div>
      <div className="input-group">
        <label>URL del PDF</label>
        <input
          type="text"
          name="pdfUrl"
          value={formData?.pdf?.[activeTab]?.url || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              pdf: {
                ...formData.pdf,
                [activeTab]: {
                  ...formData.pdf?.[activeTab],
                  url: e.target.value,
                },
              },
            })
          }
          placeholder="URL del PDF"
        />
      </div>

      <h3>🎥 Video</h3>
      <div className="input-group">
        <label>Título del Video</label>
        <input
          type="text"
          name="videoTitle"
          value={formData?.video?.[activeTab]?.title || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              video: {
                ...formData.video,
                [activeTab]: {
                  ...formData.video?.[activeTab],
                  title: e.target.value,
                },
              },
            })
          }
          placeholder="Título del Video"
        />
      </div>

      <div className="input-group">
        <label>Descripción del Video</label>
        <textarea
          name="videoDescription"
          value={formData?.video?.[activeTab]?.description || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              video: {
                ...formData.video,
                [activeTab]: {
                  ...formData.video?.[activeTab],
                  description: e.target.value,
                },
              },
            })
          }
          placeholder="Descripción del Video"
        />
      </div>

      <div className="input-group">
        <label>URL del Video</label>
        <input
          type="text"
          name="videoUrl"
          value={formData?.video?.[activeTab]?.url || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              video: {
                ...formData.video,
                [activeTab]: {
                  ...formData.video?.[activeTab],
                  url: e.target.value,
                },
              },
            })
          }
          placeholder="URL del Video"
        />
      </div>
    </div>
  );
};

export default ClassForm;

