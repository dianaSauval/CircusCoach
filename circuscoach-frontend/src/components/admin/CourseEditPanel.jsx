import { useState } from "react";
import LanguageTabs from "../../components/admin/LanguageTabs";
import { getYoutubeEmbedUrl } from "../../utils/youtube";
import "../../styles/admin/CourseEditPanel.css";
import CourseForm from "./Form/CourseForm";
import { updateCourse, updateCourseClass } from "../../services/api";

const CourseEditPanel = ({ course, selectedClass, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("es");
 const [isEditing, setIsEditing] = useState(false); 

  if (!course && !selectedClass) {
    return <p className="placeholder">Seleccioná un curso o clase para ver sus detalles.</p>;
  }

  const data = selectedClass || course;
  const isClass = Boolean(selectedClass);
  const video = data?.video?.[activeTab];  
  const videoUrl = isClass ? video?.url : video;
  const youtubeEmbed = getYoutubeEmbedUrl(videoUrl);
  

  const handleSave = async (updatedData) => {
    try {
      if (selectedClass) {
        await updateCourseClass(selectedClass._id, updatedData);
      } else if (course) {
        await updateCourse(course._id, updatedData);
      }
  
      // Actualizá el contenido local
      Object.assign(data, updatedData);
  
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      console.log("Detalles del error:", error.response?.data);
    }
  };
  

  return (
    <div className="course-edit-panel">
      <LanguageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {!isEditing ? (
        <div className="information">
          <h2>{isClass ? "📖 Clase" : "🎓 Curso"}</h2>
          <h3>{data.title?.[activeTab] || "Sin título"}</h3>

          {!isClass && (
            <>
              <p>{data.description?.[activeTab] || "No hay descripción disponible."}</p>
              <p><strong>Precio:</strong> {data.price || "No especificado"}</p>
              <div>
                <p><strong>Imagen de presentación:</strong></p>
                {data.image?.[activeTab] ? (
                  <img
                    src={data.image[activeTab]}
                    alt="Imagen del curso"
                    className="course-image"
                  />
                ) : (
                  <p style={{ color: "#777", fontStyle: "italic" }}>Imagen aún no cargada</p>
                )}
              </div>
            </>
          )}

          {isClass && (
            <>
              <p>{data.content?.[activeTab] || "No hay contenido disponible."}</p>
              <h4>{data.subtitle?.[activeTab] || "Sin subtítulo"}</h4>
              <p>{data.secondaryContent?.[activeTab] || "No hay contenido secundario."}</p>
            </>
          )}

          <div className="pdf-preview-container">
            <h3>📄 Documento cargado</h3>
            {data?.pdf?.[activeTab]?.url || data?.pdf?.[activeTab] ? (
              <>
                {data?.pdf?.[activeTab]?.title && (
                  <p><strong>📌 Título:</strong> {data.pdf[activeTab].title}</p>
                )}
                {data?.pdf?.[activeTab]?.description && (
                  <p><strong>📝 Descripción:</strong> {data.pdf[activeTab].description}</p>
                )}
                <a
                  href={data.pdf[activeTab].url || data.pdf[activeTab]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 Ver PDF
                </a>
              </>
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
                  title="Video"
                ></iframe>
                {data?.video?.[activeTab]?.title && (
                  <p><strong>📌 Título:</strong> {data.video[activeTab].title}</p>
                )}
                {data?.video?.[activeTab]?.description && (
                  <p><strong>📝 Descripción:</strong> {data.video[activeTab].description}</p>
                )}
              </div>
            ) : (
              <p className="no-material">📭 Aún no se ha cargado ningún video.</p>
            )}
          </div>

          <div className="button-group">
            <button className="edit" onClick={() => setIsEditing(true)}>
              ✏️ Editar
            </button>
            {/* Aquí podrías agregar botón de visibilidad también */}
          </div>
        </div>
      ) : (
        <CourseForm
        initialData={data}
          isClass={isClass}
          activeTab={activeTab}
          setIsEditing={setIsEditing}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default CourseEditPanel;

