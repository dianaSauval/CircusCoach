import { useState } from "react";
import "../../styles/admin/EditPanel.css";

const EditPanel = ({ selectedFormation, selectedModule, selectedClass }) => {
  const [activeTab, setActiveTab] = useState("es"); // 🔹 Control de idioma activo

  return (
    <div className="edit-panel">
      {selectedClass ? (
        <>
          <h2>📖 Clase: {selectedClass.title[activeTab]}</h2>

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

          <h3>📌 Subtítulo</h3>
          <p>{selectedClass.subtitle?.[activeTab] || "No disponible"}</p>

          <h3>📄 Contenido</h3>
          <p>{selectedClass.content?.[activeTab] || "No disponible"}</p>

          <h3>📌 Contenido Secundario</h3>
          <p>{selectedClass.secondaryContent?.[activeTab] || "No disponible"}</p>

          {/* 📄 PDF */}
          {selectedClass.pdf?.[activeTab]?.url && (
            <div>
              <h3>📄 PDF</h3>
              <a
                href={selectedClass.pdf[activeTab].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedClass.pdf[activeTab].title || "Ver PDF"}
              </a>
              <p>{selectedClass.pdf[activeTab].description}</p>
            </div>
          )}

          {/* 🎥 Video */}
          {selectedClass.video?.[activeTab]?.url && (
            <div>
              <h3>🎥 Video</h3>
              <iframe
                src={selectedClass.video[activeTab].url}
                title={selectedClass.video[activeTab].title || "Video"}
                width="100%"
                height="315"
                allowFullScreen
              />
              <p>{selectedClass.video[activeTab].description}</p>
            </div>
          )}
        </>
      ) : selectedModule ? (
        <>
          <h2>📝 Editar Módulo</h2>
          <h3>{selectedModule.title.es}</h3>
          <p>{selectedModule.description.es}</p>
        </>
      ) : selectedFormation ? (
        <>
          <h2>📌 Información de la Formación</h2>
          <h3>{selectedFormation.title.es}</h3>
          <p>{selectedFormation.description.es}</p>
        </>
      ) : (
        <p className="placeholder">Selecciona una formación, módulo o clase para ver detalles.</p>
      )}
    </div>
  );
};

export default EditPanel;

