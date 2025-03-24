const FormationForm = ({ formData, setFormData, activeTab, modeLabels }) => {
  return (
    <>
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

      <textarea
        name="description"
        value={formData?.description?.[activeTab] || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: {
              ...formData.description,
              [activeTab]: e.target.value,
            },
          })
        }
        placeholder="Descripción"
      />

      <input
        type="number"
        name="price"
        value={formData?.price || ""}
        onChange={(e) =>
          setFormData({ ...formData, price: e.target.value })
        }
        placeholder="Precio"
      />

      <label>Modalidad</label>
      <select
        className="mode-select"
        value={formData.mode}
        onChange={(e) =>
          setFormData({ ...formData, mode: e.target.value })
        }
      >
        <option value="presencial">
          {modeLabels.presencial[activeTab]}
        </option>
        <option value="online">{modeLabels.online[activeTab]}</option>
      </select>

      <label>URL de la imagen</label>
      <input
        type="text"
        name="image"
        value={formData.image || ""}
        onChange={(e) =>
          setFormData({ ...formData, image: e.target.value })
        }
        placeholder="https://example.com/imagen.jpg"
      />

      {/* PDF por idioma */}
      <label>URL del PDF ({activeTab.toUpperCase()})</label>
      <input
        type="text"
        name="pdf"
        value={formData.pdf?.[activeTab] || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            pdf: { ...formData.pdf, [activeTab]: e.target.value },
          })
        }
        placeholder="https://example.com/info.pdf"
      />

      {/* Video por idioma */}
      <label>URL del video ({activeTab.toUpperCase()})</label>
      <input
        type="text"
        name="video"
        value={formData.video?.[activeTab] || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            video: { ...formData.video, [activeTab]: e.target.value },
          })
        }
        placeholder="https://youtube.com/..."
      />
    </>
  );
};

export default FormationForm;

  
  