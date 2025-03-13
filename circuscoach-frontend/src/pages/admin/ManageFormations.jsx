import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/admin/ManageFormations.css";
import ModuleList from "../../components/admin/ModuleList";
import EditPanel from "../../components/admin/EditPanel";
import AddItemModal from "../../components/admin/AddItemModal";

const ManageFormations = () => {
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState({ type: null, parentId: null });

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await api.get("/formations");
      setFormations(response.data);
    } catch (error) {
      console.error("Error al cargar formaciones:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Menú lateral */}
      <div className="sidebar">
        <h2>📚 Formaciones</h2>
        <button className="add-button" onClick={fetchFormations}>🔄 Actualizar Formaciones</button>

        <div className="formations-list">
          {formations.map((formation) => (
            <div
              key={formation._id}
              className={`formation-item ${selectedFormation?._id === formation._id ? "active" : ""}`}
            >
              <div onClick={() => setSelectedFormation(formation)}>
                {formation.title}
              </div>
              <button
                className="add-button small"
                onClick={() => setShowModal({ type: "module", parentId: formation._id })}
              >
                ➕ Agregar Módulo
              </button> {/* ✅ Ahora el botón está dentro de cada formación */}
            </div>
          ))}
        </div>

        {selectedFormation && (
          <ModuleList
            formation={selectedFormation}
            setSelectedModule={setSelectedModule}
            setSelectedClass={setSelectedClass}
            fetchFormations={fetchFormations}
            openClassModal={() => setShowModal({ type: "class", parentId: selectedModule?._id })}
          />
        )}
      </div>

      {/* Panel de edición */}
      <div className="content-area">
        {selectedModule && !selectedClass && (
          <EditPanel type="module" item={selectedModule} fetchFormations={fetchFormations} />
        )}
        {selectedClass && <EditPanel type="class" item={selectedClass} fetchFormations={fetchFormations} />}
        {!selectedModule && !selectedClass && (
          <div className="placeholder-container">
            <h2 className="placeholder">Selecciona un módulo o clase para visualizar</h2>
          </div>
        )}
      </div>

      {/* Modal para agregar módulos o clases */}
      {showModal.type && (
        <AddItemModal
          type={showModal.type}
          parentId={showModal.parentId}
          closeModal={() => setShowModal({ type: null, parentId: null })}
          fetchFormations={fetchFormations}
        />
      )}
    </div>
  );
};

export default ManageFormations;
