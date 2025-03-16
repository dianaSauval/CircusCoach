import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/admin/EditPanel.css";

const EditPanel = ({ selectedFormation, selectedModule, selectedClass, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("es");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // 🔹 Cargar datos cuando cambia la selección
  useEffect(() => {
    if (selectedClass || selectedModule || selectedFormation) {
      setFormData(selectedClass || selectedModule || selectedFormation);
    } else {
      setFormData(null);
    }
  }, [selectedClass, selectedModule, selectedFormation]);

  // 🔹 Función para obtener datos actualizados desde el backend
  const fetchUpdatedData = async () => {
    const selectedItem = selectedClass || selectedModule || selectedFormation;
    if (!selectedItem) return;

    const endpoint = selectedClass
      ? `/classes/${selectedClass._id}`
      : selectedModule
      ? `/modules/${selectedModule._id}`
      : selectedFormation
      ? `/formations/${selectedFormation._id}`
      : null;

    if (!endpoint) return;

    try {
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setFormData(response.data); // 🔹 Refresca la UI con los datos más recientes
    } catch (error) {
      console.error("Error al obtener los datos actualizados:", error);
    }
  };

  // 🔹 Función para enviar la actualización a la API
  const handleSubmit = async () => {
    const selectedItem = selectedClass || selectedModule || selectedFormation;
    if (!selectedItem) return;
  
    const endpoint = selectedClass
      ? `/classes/${selectedClass._id}`
      : selectedModule
      ? `/modules/${selectedModule._id}`
      : selectedFormation
      ? `/formations/${selectedFormation._id}`
      : null;
  
    if (!endpoint) return;
  
    // 🔹 Asegurar que los valores sean válidos
    const cleanedData = JSON.parse(JSON.stringify(formData)); // Elimina `undefined`
  
    console.log("📤 Enviando datos al backend:", cleanedData);
  
    try {
      const response = await api.put(endpoint, cleanedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (response.status === 200) {
        console.log("✅ Actualización exitosa:", response.data);
        setIsEditing(false);
        fetchUpdatedData();
        if (onUpdate && typeof onUpdate === "function") {
          onUpdate();
        }
      } else {
        console.error("❌ Error en la actualización, código de estado:", response.status);
      }
    } catch (error) {
      console.error("❌ Error al actualizar:", error.response?.data || error);
    }
  };
  

  // 🔹 Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: { ...prev?.[name], [activeTab]: value },
    }));
  };

  return (
    <div className="edit-panel">
      {isEditing ? (
        <>
          <h2>✏️ Editando</h2>
          <div className="language-tabs">
            {["es", "en", "fr"].map((lang) => (
              <button
                key={lang}
                className={activeTab === lang ? "active" : ""}
                onClick={() => setActiveTab(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <input
            type="text"
            name="title"
            value={formData?.title?.[activeTab] || ""}
            onChange={handleChange}
            placeholder="Título"
          />
          <textarea
            name="description"
            value={formData?.description?.[activeTab] || ""}
            onChange={handleChange}
            placeholder="Descripción"
          />

          <button onClick={handleSubmit}>💾 Guardar</button>
          <button onClick={() => setIsEditing(false)}>❌ Cancelar</button>
        </>
      ) : formData ? (
        <section>
          <h2>
            {selectedClass ? "📖 Clase" : selectedModule ? "📝 Módulo" : "📌 Formación"}
          </h2>
          <div className="language-tabs">
            {["es", "en", "fr"].map((lang) => (
              <button
                key={lang}
                className={activeTab === lang ? "active" : ""}
                onClick={() => setActiveTab(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <h3>{formData.title?.[activeTab] || "Sin título"}</h3>
          <p>{formData.description?.[activeTab] || "No hay descripción disponible"}</p>
          <button onClick={() => setIsEditing(true)}>✏️ Editar</button>
        </section>
      ) : (
        <p className="placeholder">Selecciona una formación, módulo o clase para ver detalles.</p>
      )}
    </div>
  );
};

export default EditPanel;
