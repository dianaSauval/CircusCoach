import { useEffect, useState } from "react";
import "../styles/pages/CoursesPage.css";
import { getCourses } from "../services/courseService";
import Card from "../components/Card/Card";
import EmptyState from "../components/EmptyState/EmptyState";
import { useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [lang, setLang] = useState("es"); // Podés sincronizarlo con tu selector global de idioma

  const navigate = useNavigate(); // 👈

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
        <EmptyState
          title="¡Próximamente!"
          subtitle="✨ Por el momento no hay cursos disponibles, pero estamos trabajando en nuevos contenidos para vos."
        />
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <Card
              key={course._id}
              image={course.image}
              description={course.title} // 👈 Mejor mostrar el título
              onClick={() => navigate(`/courses/${course._id}`)} // 👈 Va al detalle
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;

