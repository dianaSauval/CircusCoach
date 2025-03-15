import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/admin/ManageFormations.css";
import ModuleList from "../../components/admin/ModuleList";
import EditPanel from "../../components/admin/EditPanel";
import AddItemModal from "../../components/admin/AddItemModal";

const ManageFormations = () => {
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null); // 🔹 Nueva variable para la clase seleccionada
  const [expandedFormations, setExpandedFormations] = useState({});
  const [showModal, setShowModal] = useState(null); // 🔹 Ahora guarda el tipo

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await api.get("/formations/admin", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormations(response.data);
    } catch (error) {
      console.error("Error al cargar formaciones:", error);
    }
  };

  const handleDeleteFormation = async (formationId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta formación?")) return;

    try {
      await api.delete(`/formations/${formationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchFormations(); // 🔄 Recargar formaciones tras eliminación
    } catch (error) {
      console.error("Error al eliminar formación:", error);
    }
  };

  const toggleExpandFormation = (formationId) => {
    setExpandedFormations((prev) => ({
      ...prev,
      [formationId]: !prev[formationId],
    }));
  };

  return (
    <div className="manage-formations-container">
      <h1>📚 Formaciones</h1>

      <div className="formations-layout">
        {/* 📌 Sección izquierda: Lista de formaciones */}
        <div className="formations-list">
          <h2>📌 Formaciones</h2>
          <button
            className="add-button"
            onClick={() => setShowModal({ type: "formation", parentId: null })}
          >
            ➕ Crear nueva formación
          </button>

          {formations.map((formation) => (
            <div key={formation._id} className="formation-item">
              <div className="formation-header">
                <span
                  onClick={() => {
                    setSelectedFormation(formation);
                    setSelectedModule(null);
                    setSelectedClass(null); // 🔹 Limpiar selección de módulo y clase
                  }}
                >
                  {formation.title.es}
                </span>
                <button onClick={() => toggleExpandFormation(formation._id)}>⬇️</button>
              </div>

              <div className="formation-actions">
                <button
                  className="small-btn"
                  onClick={() => setShowModal({ type: "module", parentId: formation._id })}
                >
                  ➕ Agregar módulo
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteFormation(formation._id)}
                >
                  🗑️ Eliminar
                </button>
              </div>

              {/* 📌 Aquí se muestra la lista de módulos si la formación está expandida */}
              {expandedFormations[formation._id] && (
                <ModuleList
                  formation={formation}
                  setSelectedModule={(module) => {
                    setSelectedModule(module);
                    setSelectedFormation(null);
                    setSelectedClass(null); // 🔹 Limpiar selección de formación y clase
                  }}
                  setSelectedClass={setSelectedClass} // ✅ Ahora pasa la función para seleccionar clases
                />
              )}
            </div>
          ))}
        </div>

        {/* 📌 Sección derecha: Información de la formación, módulo o clase seleccionada */}
        <EditPanel
          selectedFormation={selectedFormation}
          selectedModule={selectedModule}
          selectedClass={selectedClass} // ✅ Pasamos la clase seleccionada
        />
      </div>

      {/* Modal para agregar formación o módulo */}
      {showModal && (
        <AddItemModal
          type={showModal.type}
          parentId={showModal.parentId}
          closeModal={() => setShowModal(null)}
          onAdd={fetchFormations} // ✅ Para actualizar la lista después de crear
        />
      )}
    </div>
  );
};

export default ManageFormations;
