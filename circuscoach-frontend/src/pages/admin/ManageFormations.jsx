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
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedFormations, setExpandedFormations] = useState({});
  const [showModal, setShowModal] = useState(null);

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
      fetchFormations();
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
        <div className="formations-list">
          <h2>📌 Formaciones</h2>
          <button
            className="add-button"
            onClick={() => setShowModal({ type: "formation", parentId: null })}
          >
            ➕ Crear nueva formación
          </button>

          {formations.map((formation) => {
            const { es, en, fr } = formation.visible;
            const isFullyVisible = es && en && fr;

            return (
              <div key={formation._id} className="formation-item">
                {/* 🔹 Nueva estructura visual */}
                <div className="formation-content">
                  {/* 🔹 Indicadores de disponibilidad a la izquierda */}
                  <div className="formation-visibility">
                    {isFullyVisible ? (
                      <span className="full-visible">
                        ✅ Disponible en todos los idiomas
                      </span>
                    ) : (
                      <>
                        <span className={es ? "visible" : "not-visible"}>
                          🇪spañol {es ? "✅" : " ❌"}
                        </span>
                        <span className={en ? "visible" : "not-visible"}>
                          Inglés {en ? "✅" : " ❌"}
                        </span>
                        <span className={fr ? "visible" : "not-visible"}>
                          🇫rancés {fr ? "✅" : " ❌"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* 🔹 Cabecera con título y flecha */}
                  <div className="formation-header">
                    <span
                      onClick={() => {
                        setSelectedFormation(formation);
                        setSelectedModule(null);
                        setSelectedClass(null);
                      }}
                    >
                      {formation.title.es}
                    </span>
                    <button
                      className="toggle-btn"
                      onClick={() => toggleExpandFormation(formation._id)}
                    >
                      {expandedFormations[formation._id] ? "⬆️" : "⬇️"}
                    </button>
                  </div>

                  {/* 🔹 Acciones a la derecha */}
                  <div className="formation-actions">
                    <button
                      className="small-btn"
                      onClick={() =>
                        setShowModal({
                          type: "module",
                          parentId: formation._id,
                        })
                      }
                    >
                      ➕ Agregar módulo
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteFormation(formation._id)}
                    >
                      🗑️ Eliminar Formación
                    </button>
                  </div>
                </div>

                {/* 📌 Aquí la lista de módulos ahora se despliega debajo del título */}
                {expandedFormations[formation._id] && (
                  <div className="formation-modules">
                    <ModuleList
                      formation={formation}
                      setSelectedModule={(module) => {
                        setSelectedModule(module);
                        setSelectedFormation(null);
                        setSelectedClass(null);
                      }}
                      setSelectedClass={setSelectedClass}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <EditPanel
          selectedFormation={selectedFormation}
          selectedModule={selectedModule}
          selectedClass={selectedClass}
          onUpdate={fetchFormations}
        />
      </div>

      {showModal && (
        <AddItemModal
          type={showModal.type}
          parentId={showModal.parentId}
          closeModal={() => setShowModal(null)}
          onAdd={fetchFormations}
        />
      )}
    </div>
  );
};

export default ManageFormations;
