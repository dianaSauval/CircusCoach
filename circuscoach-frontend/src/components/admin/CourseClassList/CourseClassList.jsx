import { deleteCourseClass } from "../../../services/courseService";
import "./CourseClassList.css";
import { useEffect, useState } from "react";


const CourseClassList = ({ course, selectedClass, setSelectedClass }) => {
  const [localClasses, setLocalClasses] = useState([]);

  useEffect(() => {
    // Siempre que cambia el curso, actualizamos las clases locales
    setLocalClasses(course.classes || []);
  }, [course]);
  const handleSelect = (cls) => {
    setSelectedClass(cls);
  };

  const handleDelete = async (classId) => {
    const confirm = window.confirm("¿Seguro que querés eliminar esta clase?");
    if (!confirm) return;

    try {
      console.log("🔍 Eliminando clase con ID:", classId);
      await deleteCourseClass(classId);
      // 🔄 Actualizamos la UI al instante
      setLocalClasses((prev) => prev.filter((cls) => cls._id !== classId));
    } catch (error) {
      console.error("Error al eliminar clase:", error);
    }
  };


  

  return (
    <div className="course-classes">
      {localClasses.length > 0 ? (
        localClasses.map((cls) => {
          const { es, en, fr } = cls.visible || {};
          return (
            <div
              key={cls._id}
              className={`class-item ${selectedClass?._id === cls._id ? "selected" : ""}`}
            >
              <div className="class-visibilityClass">
                <span className={es ? "visible" : "not-visible"}>Español {es ? "✅" : "❌"}</span>
                <span className={en ? "visible" : "not-visible"}>Inglés {en ? "✅" : "❌"}</span>
                <span className={fr ? "visible" : "not-visible"}>Francés {fr ? "✅" : "❌"}</span>
              </div>

              <span className="class-title" onClick={() => handleSelect(cls)}>
                {cls.title?.es || "Clase sin título"}
              </span>

              <button className="delete-btn" onClick={() => handleDelete(cls._id)}>
                🗑️ Eliminar clase
              </button>
            </div>
          );
        })
      ) : (
        <p className="no-classes">Este curso aún no cuenta con clases.</p>
      )}
    </div>
  );
};

export default CourseClassList;
