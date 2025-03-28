import { useEffect, useState } from "react";
import { getCourses } from "../services/api";
import "../styles/pages/CoursesPage.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [lang, setLang] = useState("es"); // Podés sincronizarlo con tu selector global de idioma

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses(lang);
        setCourses(data);
      } catch (error) {
        console.error("Error al cargar cursos visibles:", error);
      }
    };
  
    fetchCourses();
  }, [lang]);
  

  return (
    <div className="courses-container">
      <h1 className="courses-title">CURSOS Y TUTORIALES</h1>
      <p className="courses-subtitle">
        PROFUNDIZA TU PROFESIÓN:
        <br />
        PERFECCIONA TUS HABILIDADES Y ALCANZA TU MÁXIMO POTENCIAL.
      </p>

      {courses.length === 0 ? (
        <div className="no-courses">
          <p>
            ✨ Por el momento no hay cursos disponibles, ¡pero estamos
            trabajando en nuevos contenidos para vos!
          </p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              {course.image?.[lang] && (
                <img
                  src={course.image[lang]}
                  alt={course.title?.[lang] || "Imagen del curso"}
                  className="course-image"
                />
              )}
              <div className="course-description">
                {course.description?.[lang] || "Descripción no disponible"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
