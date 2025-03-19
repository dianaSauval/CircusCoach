import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/admin/ModuleList.css";
import ClassList from "./ClassList"; // ✅ Importamos el nuevo componente
import AddItemModal from "./AddItemModal"; // ✅ Importamos el modal para agregar clases

const ModuleList = ({
  formation,
  setSelectedModule,
  setSelectedClass,
  selectedModule,
  selectedClass, // ✅ Recibimos selectedClass correctamente
}) => {
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    if (formation) {
      fetchModules();
    }
  }, [formation]);

  const fetchModules = async () => {
    try {
      const response = await api.get(`/modules/formation/${formation._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setModules(response.data);
    } catch (error) {
      console.error("Error al obtener módulos:", error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (
      !window.confirm(
        "¿Seguro que quieres eliminar este módulo? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      await api.delete(`/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchModules();
    } catch (error) {
      console.error("Error al eliminar módulo:", error);
    }
  };

  const toggleExpandModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <div className="module-list">
      {modules.length > 0 ? (
        modules.map((module) => {
          const { es, en, fr } = module.visible;

          return (
            <div
              key={module._id}
              className={`module-item ${
                selectedModule?._id === module._id ? "selected" : ""
              }`}
            >
              {/* 🔹 Nueva estructura con visibilidad de idiomas */}
              <div className="module-content">
                {/* 🔹 Indicadores de visibilidad */}
                <div className="module-visibility">
                  <>
                    <span className={es ? "visible" : "not-visible"}>
                      🇪spañol {es ? " ✅" : "✖"}
                    </span>
                    <span className={en ? "visible" : "not-visible"}>
                      Inglés {en ? "✅" : "✖"}
                    </span>
                    <span className={fr ? "visible" : "not-visible"}>
                      🇫rancés {fr ? "✅" : "✖"}
                    </span>
                  </>
                </div>

                {/* 🔹 Título del módulo y botón de desplegar */}
                <div className="module-header">
                <span
  className={`module-title ${
    selectedModule?._id === module._id ? "selected" : ""
  }`}
  onClick={() => {
    console.log("Haciendo click en módulo:", module.title.es); // ✅ Debug
    setSelectedModule(module);
    setSelectedClass(null); // ✅ Anulamos la clase seleccionada
  }}
>
  {module.title.es}
</span>

                  <button
                    className="toggle-btn"
                    onClick={() => toggleExpandModule(module._id)}
                  >
                    {expandedModules[module._id] ? "⬆️" : "⬇️"}
                  </button>
                </div>

                {/* 🔹 Acciones a la derecha */}
                <div className="module-actions">
                  <button
                    className="small-btn"
                    onClick={() =>
                      setShowModal({ type: "class", parentId: module._id })
                    }
                  >
                    ➕ Agregar Clase
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteModule(module._id)}
                  >
                    🗑️ Eliminar Módulo
                  </button>
                </div>
              </div>

              {/* 📌 Aquí la lista de clases ahora se despliega debajo del módulo */}
              {expandedModules[module._id] && (
                <div className="module-classes">
                  <ClassList
                    module={module}
                    setSelectedClass={setSelectedClass}
                    selectedClass={selectedClass} // ✅ Pasamos selectedClass
                  />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No hay módulos en esta formación.</p>
      )}

      {/* Modal para agregar una nueva clase */}
      {showModal && (
        <AddItemModal
          type={showModal.type}
          parentId={showModal.parentId}
          closeModal={() => setShowModal(null)}
          onAdd={fetchModules}
        />
      )}
    </div>
  );
};

export default ModuleList;
