import { useState } from "react";
import "../../styles/admin/CourseClassList.css";

const CourseClassList = ({ course, selectedClass, setSelectedClass, onDeleteClass }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  const handleSelect = (cls) => {
    setSelectedClass(cls);
  };

  const handleDelete = (classId) => {
    if (window.confirm("¿Seguro que quieres eliminar esta clase?")) {
      onDeleteClass(course._id, classId);
    }
  };

  return (
    <div className="course-item">
      <div className="course-header">
        <span
          className={`course-title ${expanded ? "expanded" : ""}`}
          onClick={() => handleSelect(course)}
        >
          {course.title?.es || "Sin título"}
        </span>
        <button className="toggle-btn" onClick={toggleExpand}>
          {expanded ? "⬆️" : "⬇️"}
        </button>
      </div>

      {expanded && (
        <div className="course-classes">
          {course.classes?.length > 0 ? (
            course.classes.map((cls) => {
              const { es, en, fr } = cls.visible || {};
              return (
                <div
                  key={cls._id}
                  className={`class-item ${selectedClass?._id === cls._id ? "selected" : ""}`}
                >
                  <div className="class-visibility">
                    <span className={es ? "visible" : "not-visible"}>ES {es ? "✅" : "❌"}</span>
                    <span className={en ? "visible" : "not-visible"}>EN {en ? "✅" : "❌"}</span>
                    <span className={fr ? "visible" : "not-visible"}>FR {fr ? "✅" : "❌"}</span>
                  </div>

                  <span
                    className="class-title"
                    onClick={() => handleSelect(cls)}
                  >
                    {cls.title?.es || "Clase sin título"}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(cls._id)}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          ) : (
            <p className="no-classes">Este curso aún no cuenta con clases.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseClassList;