import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/admin/ClassList.css";

const ClassList = ({ module, setSelectedClass }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, [module]);

  const fetchClasses = async () => {
    try {
      const response = await api.get(`/classes/module/${module._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setClasses(response.data);
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta clase? Esta acción no se puede deshacer.")) return;

    try {
      await api.delete(`/classes/${classId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchClasses(); // 🔄 Actualiza la lista tras eliminar
    } catch (error) {
      console.error("Error al eliminar clase:", error);
    }
  };

  return (
    <div className="class-list">
      {classes.length > 0 ? (
        classes.map((cls) => (
          <div key={cls._id} className="class-item">
            <span onClick={() => setSelectedClass(cls)}>{cls.title.es}</span>
            <button className="delete-btn" onClick={() => handleDeleteClass(cls._id)}>🗑️</button>
          </div>
        ))
      ) : (
        <p className="no-classes">No hay clases en este módulo.</p>
      )}
    </div>
  );
};

export default ClassList;





