import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../services/courseService";
import "../styles/pages/CourseDetail.css";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error("Error al obtener detalles del curso:", error);
      }
    };

    fetchCourse();
  }, [id]);

  const getAvailableLanguages = (visible) => {
    return Object.entries(visible || {})
      .filter(([_, value]) => value)
      .map(([lang]) => lang.toUpperCase())
      .join(", ");
  };

  return (
    <div className="course-detail-container">
      {course ? (
        <div className="course-detail-flex">
          <div className="course-info">
            <h1 className="course-title">{course.title?.es}</h1>
            <p className="course-price">💰 Precio: ${course.price}</p>
            <p className="course-description">{course.description?.es}</p>
            <p className="course-langs">
              🌍 Disponible en: {getAvailableLanguages(course.visible)}
            </p>

            <button className="course-buy-button">Comprar curso</button>

            {course.pdfUrl && (
              <div className="course-pdf">
                <a
                  href={course.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-button"
                >
                  📄 Ver PDF informativo
                </a>
              </div>
            )}
          </div>

          <div className="course-media">
            <div className={`media-wrapper ${showVideo ? "video-visible" : ""}`}>
              {!showVideo && (
                <div className="image-wrapper">
                  <img
                    src={course.image?.es}
                    alt="Imagen del curso"
                    className="course-image"
                  />
                  <button className="play-button" onClick={() => setShowVideo(true)}>
                    ▶
                  </button>
                </div>
              )}

              {showVideo && course.video?.es && (
                <div className="video-wrapper fade-in">
                  <iframe
                    src={course.video.es.replace("watch?v=", "embed/")}
                    title="Video del curso"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-message">Cargando curso...</p>
      )}
    </div>
  );
}

export default CourseDetail;