import { useState } from "react";
import LanguageTabs from "../../components/admin/LanguageTabs";
import { getYoutubeEmbedUrl } from "../../utils/youtube";
import "../../styles/admin/CourseEditPanel.css";

const CourseEditPanel = ({ course }) => {
  const [activeTab, setActiveTab] = useState("es");

  if (!course) {
    return <p className="placeholder">Seleccioná un curso para ver sus detalles.</p>;
  }

  const youtubeEmbed = getYoutubeEmbedUrl(
    course?.video?.[activeTab]?.url || course?.video?.[activeTab]
  );

  return (
    <div className="course-edit-panel">
      <LanguageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="information">
        <h2>🎓 Curso</h2>
        <h3>{course.title?.[activeTab] || "Sin título"}</h3>

        <p>
          {course.description?.[activeTab] || "No hay descripción disponible."}
        </p>

        <p>
          <strong>Precio:</strong> {course.price || "No especificado"}
        </p>

        <div>
          <p><strong>Imagen de presentación:</strong></p>
          {course.image?.[activeTab] ? (
            <img
              src={course.image[activeTab]}
              alt="Imagen del curso"
              className="course-image"
            />
          ) : (
            <p style={{ color: "#777", fontStyle: "italic" }}>Imagen aún no cargada</p>
          )}
        </div>

        <div className="pdf-preview-container">
          <h3>📄 Documento cargado</h3>
          {course?.pdf?.[activeTab] ? (
            <a
              href={course.pdf[activeTab]}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Ver PDF
            </a>
          ) : (
            <p className="no-material">📭 Aún no se ha cargado ningún documento.</p>
          )}
        </div>

        <div className="video-preview-container">
          <h3>🎥 Video cargado</h3>
          {youtubeEmbed ? (
            <div className="video-container">
              <iframe
                width="100%"
                height="200"
                src={youtubeEmbed}
                frameBorder="0"
                allowFullScreen
                title="Video del curso"
              ></iframe>
            </div>
          ) : (
            <p className="no-material">📭 Aún no se ha cargado ningún video.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEditPanel;