import { useState } from "react";
import LanguageTabs from "../LanguageTabs/LanguageTabs";
import { getYoutubeEmbedUrl } from "../../../utils/youtube";
import "./CourseEditPanel.css";
import CourseForm from "../Form/CourseForm";
import { updateCourse, updateCourseClass } from "../../../services/courseService";
import { toggleCourseClassVisibility } from "../../../services/courseService";


const CourseEditPanel = ({ course, selectedClass, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("es");
  const [isEditing, setIsEditing] = useState(false);

  if (!course && !selectedClass) {
    return <p className="placeholder">Seleccioná un curso o clase para ver sus detalles.</p>;
  }

  const data = selectedClass || course;
  const isClass = Boolean(selectedClass);

  const handleSave = async (updatedData) => {
    try {
      if (selectedClass) {
        await updateCourseClass(selectedClass._id, updatedData);
      } else if (course) {
        await updateCourse(course._id, updatedData);
      }

      Object.assign(data, updatedData);
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      console.log("Detalles del error:", error.response?.data);
    }
  };

  const handleToggleVisibility = async () => {
  try {
    console.log("Toggle visibilidad con:", selectedClass._id, activeTab);

    await toggleCourseClassVisibility(data._id, activeTab);
    // Actualiza la visibilidad local
    data.visible[activeTab] = !data.visible?.[activeTab];
    onUpdate?.(); // actualiza la vista
  } catch (error) {
    console.error("Error al cambiar visibilidad:", error);
  }
};


  const renderPDFs = () => {
  const visibles = (data.pdfs || []).filter(
    (pdf) => pdf.url?.[activeTab] || pdf.title?.[activeTab] || pdf.description?.[activeTab]
  );

  if (visibles.length === 0) {
    return <p className="no-material">📭 Aún no se ha cargado ningún documento en este idioma.</p>;
  }

  return visibles.map((pdf, i) => (
    <div key={i} className="pdf-preview-item">
      {pdf.title?.[activeTab] && (
        <p><strong>📌 Título:</strong> {pdf.title[activeTab]}</p>
      )}
      {pdf.description?.[activeTab] && (
        <p><strong>📝 Descripción:</strong> {pdf.description[activeTab]}</p>
      )}
      {pdf.url?.[activeTab] ? (
        <a
          href={pdf.url[activeTab]}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Ver PDF
        </a>
      ) : (
        <p className="no-material">❌ Sin enlace al PDF en este idioma.</p>
      )}
    </div>
  ));
};


  const renderVideos = () => {
  const visibles = (data.videos || []).filter(
    (video) => video.url?.[activeTab] || video.title?.[activeTab] || video.description?.[activeTab]
  );

  if (visibles.length === 0) {
    return <p className="no-material">📭 Aún no se ha cargado ningún video en este idioma.</p>;
  }

  return visibles.map((video, i) => {
    const embed = getYoutubeEmbedUrl(video.url?.[activeTab]);
    return (
      <div key={i} className="video-preview-item">
        {embed ? (
          <iframe
            width="100%"
            height="200"
            src={embed}
            frameBorder="0"
            allowFullScreen
            title={`Video ${i + 1}`}
          ></iframe>
        ) : (
          <p className="no-material">❌ Video sin enlace válido en este idioma.</p>
        )}
        {video.title?.[activeTab] && (
          <p><strong>📌 Título:</strong> {video.title[activeTab]}</p>
        )}
        {video.description?.[activeTab] && (
          <p><strong>📝 Descripción:</strong> {video.description[activeTab]}</p>
        )}
      </div>
    );
  });
};


  return (
    <div className="course-edit-panel">
      <LanguageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {!isEditing ? (
        <div className="informationCourse">
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
            <h3>📄 PDFs Cargados</h3>
            {renderPDFs()}
          </div>

          <div className="video-preview-container">
            <h3>🎥 Videos Cargados</h3>
            {renderVideos()}
          </div>

          <div className="button-group">
  <button className="edit" onClick={() => setIsEditing(true)}>
    ✏️ Editar
  </button>

  {isClass && (
   <button
  className={`toggle-visibility ${data.visible?.[activeTab] ? "visible" : "hidden"}`}
  onClick={handleToggleVisibility}
>
  {data.visible?.[activeTab] ? "Ocultar en este idioma" : "Hacer visible en este idioma"}
</button>

  )}
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

