import { useState, useEffect } from "react";
import { getAllCourses } from "../../services/api";
import "../../styles/admin/ManageCourses.css";
import CourseEditPanel from "../../components/admin/CourseEditPanel";
import CourseClassList from "../../components/admin/CourseClassList";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    }
  };

  const toggleExpandCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  return (
    <div className="manage-courses-container">
      <h1>🎓 Cursos</h1>

      <div className={`courses-layout ${isCollapsed ? "collapsed" : ""}`}>
        <div className={`courses-list ${isCollapsed ? "collapsed" : ""}`}>
          <button
            className={`collapse-toggle ${isCollapsed ? "collapsed-position" : ""}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "🡠" : "🡢"}
          </button>

          {!isCollapsed && (
            <>
              <h2>📌 Cursos disponibles</h2>
              {courses.map((course) => (
                <div key={course._id} className="course-item-wrapper">
                  <div
                    className={`course-item ${selectedCourse?._id === course._id ? "selected" : ""}`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    {course.title?.es || "Sin título"}
                    <button
                      className="toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandCourse(course._id);
                      }}
                    >
                      {expandedCourses[course._id] ? "⬆️" : "⬇️"}
                    </button>
                  </div>

                  {expandedCourses[course._id] && (
                    <CourseClassList course={course} onUpdate={fetchCourses} />
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <CourseEditPanel course={selectedCourse} />
      </div>
    </div>
  );
};

export default ManageCourses;
