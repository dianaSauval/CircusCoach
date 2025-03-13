import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/admin/ModuleList.css";
import AddItemModal from "./AddItemModal";
import ClassList from "./ClassList"; // Importamos ClassList

const ModuleList = ({ formation, setSelectedModule, setSelectedClass, fetchFormations }) => {
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [showModal, setShowModal] = useState({ type: null, parentId: null });

  useEffect(() => {
    fetchModules();
  }, [formation, fetchFormations]);

  const fetchModules = async () => {
    try {
      const response = await api.get(`/modules/${formation._id}`);
      setModules(response.data);
    } catch (error) {
      console.error("Error al cargar módulos:", error);
    }
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    setSelectedClass(null);
    toggleModule(module._id);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // 🗑️ Eliminar módulo y actualizar formaciones
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este módulo?")) return;

    try {
      await api.delete(`/modules/${moduleId}`);
      fetchFormations(); // 🔄 Actualiza las formaciones
    } catch (error) {
      console.error("Error al eliminar módulo:", error);
    }
  };

  return (
    <div className="modules-list">
      <h3>📂 Módulos</h3>
      {modules.map((module) => (
        <div key={module._id} className="module-item">
          <div className="module-header" onClick={() => handleSelectModule(module)}>
            {module.title} {expandedModules[module._id] ? "🔽" : "▶️"}
          </div>
          <div className="module-actions">
            <button className="delete-button" onClick={() => handleDeleteModule(module._id)}>🗑️ Eliminar Módulo</button>
          </div>

          {expandedModules[module._id] && (
            <ClassList module={module} setSelectedClass={setSelectedClass} /> // Delegamos a ClassList el manejo de clases
          )}
        </div>
      ))}

      {/* Modal para agregar módulos */}
      {showModal.type === "module" && (
        <AddItemModal
          type="module"
          parentId={formation._id}
          closeModal={() => setShowModal({ type: null, parentId: null })}
          fetchFormations={fetchFormations}
        />
      )}
    </div>
  );
};

export default ModuleList;
