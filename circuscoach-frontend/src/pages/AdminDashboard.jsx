import { useEffect, useState } from "react";
import { getAdminCourses, deleteCourse } from "../services/api";
import { isAuthenticated } from "../services/auth";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login"); // Redirige si el usuario no está autenticado
    } else {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getAdminCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este curso?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (error) {
        console.error("Error al eliminar curso:", error);
      }
    }
  };

  return (
    <div>
      <h1>Panel de Administración</h1>
      <button onClick={() => navigate("/admin/create")}>Crear Nuevo Curso</button>
      <ul>
        {courses.length > 0 ? (
          courses.map((course) => (
            <li key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Precio: ${course.price}</p>
              <button onClick={() => navigate(`/admin/edit/${course._id}`)}>Editar</button>
              <button onClick={() => handleDelete(course._id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <p>No hay cursos disponibles.</p>
        )}
      </ul>
    </div>
  );
}

export default AdminDashboard;


