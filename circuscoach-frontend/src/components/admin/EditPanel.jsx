import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/admin/EditPanel.css";
import LanguageTabs from "../../components/admin/LanguageTabs";
import ClassForm from "./Form/ClassForm";
import FormationForm from "./Form/FormationForm";
import ModuleForm from "./Form/ModuleForm";

const EditPanel = ({
  selectedFormation,
  selectedModule,
  selectedClass,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("es");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (selectedClass) {
      setFormData({
        ...selectedClass,
        pdf: selectedClass.pdf || { es: {}, en: {}, fr: {} },
        video: selectedClass.video || { es: {}, en: {}, fr: {} },
      });
      setIsEditing(false);
    } else if (selectedModule && !selectedClass) {
      // ❗ Evita que selectedModule se mantenga si hay selectedClass
      setFormData({ ...selectedModule });
      setIsEditing(false);
    } else if (selectedFormation && !selectedClass && !selectedModule) {
      // ❗ Evita que selectedFormation se mantenga si hay otro seleccionado
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
      console.error(
        "❌ Error al cambiar visibilidad:",
        error.response?.data || error
      );
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

      {/* 🔹 Modo Visualización */}
      {!isEditing && (
        <div className="view-mode">
          <div className="information">
            <h2>
              {selectedClass
                ? "📖 Clase"
                : selectedModule
                ? "📝 Módulo"
                : "📌 Formación"}
            </h2>

            <h3>{formData.title?.[activeTab] || "Sin título"}</h3>

            {selectedModule && !selectedClass && (
              <>
                <p>
                  {formData.description?.[activeTab] ||
                    "No hay descripción disponible"}
                </p>
              </>
            )}

            {selectedFormation && (
              <>
                <p>
                  {formData.description?.[activeTab] ||
                    "No hay descripción disponible"}
                </p>
                <p>
                  <strong>Precio:</strong> {formData.price || "No especificado"}
                </p>
              </>
            )}

            {selectedClass && (
              <>
                <p>{formData.content?.[activeTab] || "No disponible"}</p>
                <h4>{formData.subtitle?.[activeTab] || "No especificado"}</h4>
                <p>
                  {formData.secondaryContent?.[activeTab] || "No disponible"}
                </p>

                <div className="pdf-preview-container">
                  <h3>📄 Documento cargado</h3>
                  {formData?.pdf?.[activeTab]?.url ? (
                    <>
                      <p>
                        <strong>📌 Título:</strong>{" "}
                        {formData?.pdf?.[activeTab]?.title || "Sin título"}
                      </p>
                      <p>
                        <strong>📝 Descripción:</strong>{" "}
                        {formData?.pdf?.[activeTab]?.description ||
                          "Sin descripción"}
                      </p>
                      <a
                        href={formData.pdf[activeTab].url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🔗 Ver PDF
                      </a>
                    </>
                  ) : (
                    <p className="no-material">
                      📭 Aún no se ha cargado ningún documento.
                    </p>
                  )}
                </div>

                <div className="video-preview-container">
                  <h3>🎥 Video cargado</h3>
                  {formData?.video?.[activeTab]?.url ? (
                    <>
                      <p>
                        <strong>📌 Título:</strong>{" "}
                        {formData?.video?.[activeTab]?.title || "Sin título"}
                      </p>
                      <p>
                        <strong>📝 Descripción:</strong>{" "}
                        {formData?.video?.[activeTab]?.description ||
                          "Sin descripción"}
                      </p>
                      <div className="video-container">
                        <iframe
                          width="100%"
                          height="200"
                          src={formData.video[activeTab].url}
                          title={formData.video[activeTab].title || "Video"}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </>
                  ) : (
                    <p className="no-material">
                      📭 Aún no se ha cargado ningún video.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="button-group">
            <button className="edit" onClick={() => setIsEditing(true)}>
              ✏️ Editar
            </button>
            <button
              className={`toggle-visibility ${
                formData.visible?.[activeTab] ? "visible" : "hidden"
              }`}
              onClick={toggleVisibility}
            >
              {visibilityText}
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Modo Edición */}
      {isEditing && (
        <div className="edit-mode">
          <h2>
            ✏️ Editando{" "}
            {selectedClass ? "Clase" : selectedModule ? "Módulo" : "Formación"}
          </h2>

          {/* 🔹 Renderizar solo el formulario correspondiente */}
          {selectedFormation && !selectedClass && !selectedModule && (
            <FormationForm
              formData={formData}
              setFormData={setFormData}
              activeTab={activeTab}
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

          {/* 🔹 Botones */}
          <div className="button-group">
            <button className="save" onClick={handleSave}>
              💾 Guardar Cambios
            </button>
            <button className="cancel" onClick={() => setIsEditing(false)}>
              ❌ Cancelar
            </button>
            <button className="toggle-visibility" onClick={toggleVisibility}>
              {visibilityText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPanel;
