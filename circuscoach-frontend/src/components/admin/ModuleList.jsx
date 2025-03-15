import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/admin/ModuleList.css";
import ClassList from "./ClassList"; // ✅ Importamos el nuevo componente
import AddItemModal from "./AddItemModal"; // ✅ Importamos el modal para agregar clases

const ModuleList = ({ formation, setSelectedModule, setSelectedClass, selectedModule }) => {
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [showModal, setShowModal] = useState(null); // 🔹 Control del modal de clases

  useEffect(() => {
    if (formation) {
      fetchModules();
    }
  }, [formation]);

  const fetchModules = async () => {
    try {
      const response = await api.get(`/modules/formation/${formation._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setModules(response.data);
    } catch (error) {
      console.error("Error al obtener módulos:", error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este módulo? Esta acción no se puede deshacer.")) return;

    try {
      await api.delete(`/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchModules(); // 🔄 Actualiza la lista tras eliminar
    } catch (error) {
      console.error("Error al eliminar módulo:", error);
    }
  };

  const toggleExpandModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <div className="module-list">
      {modules.length > 0 ? (
        modules.map((module) => (
          <div
            key={module._id}
            className={`module-item ${selectedModule?._id === module._id ? "selected" : ""}`} // 🔹 Aplica la clase si el módulo está seleccionado
          >
            <div className="module-header">
              <div className="module-actions">
                <button className="delete-btn" onClick={() => handleDeleteModule(module._id)}><span>🗑️</span>Eliminar Módulo</button>
                <button className="add-btn" onClick={() => setShowModal({ type: "class", parentId: module._id })}>
                  <span>➕</span> Agregar Clase
                </button>
              </div>
              <span onClick={() => setSelectedModule(module)}>{module.title.es}</span>
              <button className="toggle-btn" onClick={() => toggleExpandModule(module._id)}>
                {expandedModules[module._id] ? "⬆️" : "⬇️"} {/* 🔹 Flechita cambia según estado */}
              </button>
            </div>

            {expandedModules[module._id] && (
              <ClassList module={module} setSelectedClass={setSelectedClass} />
            )}
          </div>
        ))
      ) : (
        <p>No hay módulos en esta formación.</p>
      )}

      {/* Modal para agregar una nueva clase */}
      {showModal && (
        <AddItemModal
          type={showModal.type}
          parentId={showModal.parentId}
          closeModal={() => setShowModal(null)}
          onAdd={fetchModules} // 🔄 Recargar módulos tras agregar una clase
        />
      )}
    </div>
  );
};

export default ModuleList;




