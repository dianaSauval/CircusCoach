import { useState, useEffect } from "react";
import api from "../../services/api";
import AddClassModal from "../../components/admin/AddClassModal";

const ClassList = ({ module, setSelectedClass }) => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ useEffect para actualizar las clases cuando cambia el módulo seleccionado
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get(`/classes/${module._id}`);
        setClasses(response.data);
      } catch (error) {
        console.error("Error al obtener clases:", error);
      }
    };

    fetchClasses();
  }, [module]); // 🔹 Se ejecuta cada vez que cambia el módulo seleccionado

  const handleAddClass = async (newClassData) => {
    try {
      const response = await api.post(`/classes`, {
        ...newClassData,
        moduleId: module._id,
      });

      // 🔹 Volvemos a obtener las clases para reflejar el cambio
      setClasses((prevClasses) => [...prevClasses, response.data]);

      setIsModalOpen(false); // ✅ Cerrar modal automáticamente
    } catch (error) {
      console.error("Error al agregar clase:", error);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta clase?")) return;

    try {
      await api.delete(`/classes/${classId}`);

      // 🔹 Volvemos a obtener las clases para reflejar el cambio
      setClasses((prevClasses) => prevClasses.filter((cls) => cls._id !== classId));
    } catch (error) {
      console.error("Error al eliminar clase:", error);
    }
  };

  return (
    <div className="classes-list">
      {/* Botón para abrir el modal */}
      <button onClick={() => setIsModalOpen(true)}>➕ Agregar Clase</button>

      {/* Modal de creación de clase */}
      {isModalOpen && <AddClassModal onClose={() => setIsModalOpen(false)} onAddClass={handleAddClass} />}

      {/* Lista de clases actualizada en tiempo real */}
      {classes.length > 0 ? (
        classes.map((cls) => (
          <div key={cls._id} className="class-item">
            <p onClick={() => setSelectedClass(cls)}>{cls.title}</p>
            <button onClick={() => handleDeleteClass(cls._id)}>🗑️ Eliminar</button>
          </div>
        ))
      ) : (
        <p>No hay clases aún</p>
      )}
    </div>
  );
};

export default ClassList;
