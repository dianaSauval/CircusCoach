import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/admin/ModuleList.css";

const ModuleList = ({ formation, setSelectedModule, setSelectedClass, fetchFormations }) => {
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [moduleClasses, setModuleClasses] = useState({});

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

  const fetchClasses = async (moduleId) => {
    try {
      const response = await api.get(`/classes/${moduleId}`);
      setModuleClasses((prev) => ({ ...prev, [moduleId]: response.data }));
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  // 🔹 Al hacer clic en un módulo, se actualiza y se cargan las clases
  const handleSelectModule = async (module) => {
    setSelectedModule(module);
    setSelectedClass(null);
    await fetchClasses(module._id);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // 🗑️ Función para eliminar módulo
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este módulo?")) return;

    try {
      await api.delete(`/modules/${moduleId}`);
      fetchFormations(); // 🔄 Actualiza las formaciones al instante
    } catch (error) {
      console.error("Error al eliminar módulo:", error);
    }
  };

  return (
    <div className="modules-list">
      <h3>📂 Módulos</h3>
      {modules.map((module) => (
        <div key={module._id} className="module-item">
          <div className="module-header" onClick={() => { handleSelectModule(module); toggleModule(module._id); }}>
            {module.title} {expandedModules[module._id] ? "🔽" : "▶️"}
          </div>
          <button className="delete-button" onClick={() => handleDeleteModule(module._id)}>🗑️ Eliminar</button> {/* ✅ Botón de eliminar */}

          {expandedModules[module._id] && (
            <div className="classes-list">
              {moduleClasses[module._id]?.length > 0 ? (
                moduleClasses[module._id].map((cls) => (
                  <div key={cls._id} className="class-item" onClick={() => setSelectedClass(cls)}>
                    {cls.title}
                  </div>
                ))
              ) : (
                <p className="no-classes">🔹 No hay clases en este módulo</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModuleList;
