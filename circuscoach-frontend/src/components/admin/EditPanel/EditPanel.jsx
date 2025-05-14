import { useState, useEffect } from "react";
import api from "../../../services/api";
import "./EditPanel.css";
import LanguageTabs from "../LanguageTabs/LanguageTabs";
import ClassForm from "../Form/ClassForm";
import FormationForm from "../Form/FormationForm";
import ModuleForm from "../Form/ModuleForm";
import { getYoutubeEmbedUrl } from "../../../utils/youtube";

const EditPanel = ({
  selectedFormation,
  selectedModule,
  selectedClass,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("es");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const modeLabels = {
    presencial: {
      es: "Presencial",
      en: "In-person",
      fr: "Présentiel",
    },
    online: {
      es: "Online",
      en: "Online",
      fr: "En ligne",
    },
  };

  useEffect(() => {
    if (selectedClass) {
      setFormData({
        ...selectedClass,
        pdfs: selectedClass.pdfs || { es: [], en: [], fr: [] },
        videos: selectedClass.videos || { es: [], en: [], fr: [] },
      });
      setIsEditing(false);
    } else if (selectedModule && !selectedClass) {
      setFormData({ ...selectedModule });
      setIsEditing(false);
    } else if (selectedFormation && !selectedClass && !selectedModule) {
      setFormData({ ...selectedFormation });
      setIsEditing(false);
    } else {
      setFormData(null);
      setIsEditing(false);
    }
  }, [selectedClass, selectedModule, selectedFormation]);

  const handleSave = async () => {
    const selectedItem = selectedClass || selectedModule || selectedFormation;
    if (!selectedItem) return;

    const endpoint = selectedClass
      ? `/classes/${selectedClass._id}`
      : selectedModule
      ? `/modules/${selectedModule._id}`
      : selectedFormation
      ? `/formations/${selectedFormation._id}`
      : null;

    if (!endpoint) return;

    try {
      await api.put(endpoint, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (onUpdate) onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar:", error.response?.data || error);
    }
  };

  const toggleVisibility = async () => {
    let endpoint = null;
    let requestBody = {};

    if (selectedClass) {
      endpoint = `/classes/${selectedClass._id}/visibility/${activeTab}`;
    } else if (selectedModule) {
      endpoint = `/modules/${selectedModule._id}/visibility/${activeTab}`;
    } else if (selectedFormation) {
      endpoint = `/formations/${selectedFormation._id}/visibility/language`;
      requestBody = { language: activeTab };
    }

    if (!endpoint) return;

    try {
      await api.patch(endpoint, requestBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setFormData((prev) => ({
        ...prev,
        visible: { ...prev.visible, [activeTab]: !prev.visible[activeTab] },
      }));

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("\u274C Error al cambiar visibilidad:", error.response?.data || error);
    }
  };

  if (!formData) {
    return (
      <p className="placeholder">
        Selecciona una formación, módulo o clase para ver detalles.
      </p>
    );
  }

  const visibilityText = formData.visible?.[activeTab]
    ? "Ocultar en este idioma"
    : "Hacer visible en este idioma";

  return (
    <div className={isEditing ? "edit-panel is-editing" : "edit-panel"}>
      <LanguageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Visualización */}
      {!isEditing && (
        <div className="view-mode">
          <div className="information">
            <h2>
              {selectedClass
                ? "\ud83d\udcd6 Clase"
                : selectedModule
                ? "\ud83d\udcdc Módulo"
                : "\ud83d\udccc Formación"}
            </h2>

            <h3>{formData.title?.[activeTab] || "Sin título"}</h3>

            {selectedModule && !selectedClass && (
              <p>{formData.description?.[activeTab] || "No hay descripción disponible"}</p>
            )}

            {selectedFormation && !selectedClass && (
              <>
                <p>{formData.description?.[activeTab] || "No hay descripción disponible"}</p>
                <p><strong>Precio:</strong> {formData.price || "No especificado"}</p>
                <div>
                  <p><strong>Imagen de presentación:</strong></p>
                  {formData.image?.[activeTab] ? (
                    <img
                      src={formData.image[activeTab]}
                      alt="Imagen de la formación"
                      className="formation-image"
                    />
                  ) : (
                    <p style={{ color: "#777", fontStyle: "italic" }}>
                      Imagen aún no cargada
                    </p>
                  )}
                </div>
              </>
            )}

            {selectedClass && (
              <>
                <p>{formData.content?.[activeTab] || "No disponible"}</p>
                <h4>{formData.subtitle?.[activeTab] || "No especificado"}</h4>
                <p>{formData.secondaryContent?.[activeTab] || "No disponible"}</p>

                <div className="pdf-preview-container">
                  <h3>\ud83d\udcc4 Documentos cargados</h3>
                  {formData?.pdfs?.[activeTab]?.length > 0 ? (
                    formData.pdfs[activeTab].map((pdf, i) => (
                      <div key={i} className="pdf-preview">
                        <p><strong>📌 Título:</strong> {pdf.title || "Sin título"}</p>
                        <p><strong>📝 Descripción:</strong> {pdf.description || "Sin descripción"}</p>
                        <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                          🔗 Ver PDF
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="no-material">📭 Aún no se ha cargado ningún documento.</p>
                  )}
                </div>

                <div className="video-preview-container">
                  <h3>🎥 Videos cargados</h3>
                  {formData?.videos?.[activeTab]?.length > 0 ? (
                    formData.videos[activeTab].map((video, i) => {
                      const embedUrl = getYoutubeEmbedUrl(video.url);
                      return (
                        <div key={i} className="video-preview">
                          <p><strong>📌 Título:</strong> {video.title || "Sin título"}</p>
                          <p><strong>📝 Descripción:</strong> {video.description || "Sin descripción"}</p>
                          <div className="video-container">
                            <iframe
                              width="100%"
                              height="200"
                              src={embedUrl}
                              title={video.title || `Video ${i + 1}`}
                              frameBorder="0"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-material">📭 Aún no se ha cargado ningún video.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="button-group">
            <button className="edit" onClick={() => setIsEditing(true)}>✏️ Editar</button>
            <button
              className={`toggle-visibility ${formData.visible?.[activeTab] ? "visible" : "hidden"}`}
              onClick={toggleVisibility}
            >
              {visibilityText}
            </button>
          </div>
        </div>
      )}

      {/* Edición */}
      {isEditing && (
        <div className="edit-mode">
          <h2>
            ✏️ Editando {selectedClass ? "Clase" : selectedModule ? "Módulo" : "Formación"}
          </h2>

          {selectedFormation && !selectedClass && !selectedModule && (
            <FormationForm
              formData={formData}
              setFormData={setFormData}
              activeTab={activeTab}
              modeLabels={modeLabels}
            />
          )}

          {selectedModule && !selectedClass && (
            <ModuleForm
              formData={formData}
              setFormData={setFormData}
              activeTab={activeTab}
            />
          )}

          {selectedClass && (
            <ClassForm
              formData={formData}
              setFormData={setFormData}
              activeTab={activeTab}
            />
          )}

          <div className="button-group">
            <button className="save" onClick={handleSave}>💾 Guardar Cambios</button>
            <button className="cancel" onClick={() => setIsEditing(false)}>❌ Cancelar</button>
            <button className="toggle-visibility" onClick={toggleVisibility}>{visibilityText}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPanel;
