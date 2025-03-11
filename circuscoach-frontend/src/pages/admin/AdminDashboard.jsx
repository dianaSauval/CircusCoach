import { useEffect, useState } from "react";
import { getAdminCourses, deleteCourse } from "../../services/api";
import { isAuthenticated } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/admin/AdminDashboard.css";

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
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>

      {/* Sección para gestionar formaciones */}
      <div className="admin-section">
        <h2>🎓 Gestión de Formaciones</h2>
        <Link to="/admin/formaciones" className="admin-button">📚 Ver Formaciones</Link>
      </div>

      {/* Sección para gestionar cursos sueltos */}
      <div className="admin-section">
        <h2>📖 Gestión de Cursos</h2>
        <button onClick={() => navigate("/admin/create")} className="admin-button">➕ Crear Nuevo Curso</button>
        <ul>
          {courses.length > 0 ? (
            courses.map((course) => (
              <li key={course._id} className="course-item">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>💰 Precio: ${course.price}</p>
                <button onClick={() => navigate(`/admin/edit/${course._id}`)} className="edit-button">✏️ Editar</button>
                <button onClick={() => handleDelete(course._id)} className="delete-button">🗑️ Eliminar</button>
              </li>
            ))
          ) : (
            <p>No hay cursos disponibles.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;



