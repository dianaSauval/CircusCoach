import { useEffect, useState } from "react";
import { getCourses } from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Lista de Cursos</h1>
      <ul>
        {courses.length > 0 ? (
          courses.map((course) => (
            <li key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Precio: ${course.price}</p>
            </li>
          ))
        ) : (
          <p>No hay cursos disponibles.</p>
        )}
      </ul>
    </div>
  );
}

export default Courses;
