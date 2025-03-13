import { useState, useEffect } from "react";
import api from "../../services/api";
import AddItemModal from "./AddItemModal";
import "../../styles/admin/ClassList.css";

const ClassList = ({ module, setSelectedClass }) => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, [module]);

  const fetchClasses = async () => {
    try {
      const response = await api.get(`/classes/${module._id}`);
      setClasses(response.data);
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  // 🗑️ Eliminar clase y actualizar lista en tiempo real
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("🛑 ¿Seguro que quieres eliminar esta clase?")) return;

    try {
      await api.delete(`/classes/${classId}`);
      setClasses((prevClasses) => prevClasses.filter((cls) => cls._id !== classId));
    } catch (error) {
      console.error("Error al eliminar clase:", error);
    }
  };

  return (
    <div className="classes-list">
      <button onClick={() => setShowModal(true)} className="add-class-button">
        ➕ Agregar Clase
      </button>

      {/* Modal para agregar clase */}
      {showModal && (
        <AddItemModal
          type="class"
          parentId={module._id}
          closeModal={() => setShowModal(false)}
          onAdd={(newClass) => {
            setClasses((prevClasses) => [...prevClasses, newClass]); // 🔄 Se agrega la clase en tiempo real
            setShowModal(false); // ✅ Cierra el modal al instante
          }}
        />
      )}

      {/* Lista de clases */}
      {classes.length > 0 ? (
        <ul className="class-items">
          {classes.map((cls) => (
            <li key={cls._id} className="class-item">
              <p onClick={() => setSelectedClass(cls)}>{cls.title}</p>
              <button className="delete-button" onClick={() => handleDeleteClass(cls._id)}>🗑️</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-classes">❌ No hay clases aún</p>
      )}
    </div>
  );
};

export default ClassList;




