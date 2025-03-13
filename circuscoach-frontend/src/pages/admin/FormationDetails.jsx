import { useState, useEffect } from "react";
import api from "../../services/api";

const FormationDetails = ({ selectedModule, selectedClass, setSelectedModule, setSelectedClass , fetchFormations, setSelectedFormation}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", content: "" });
  
  useEffect(() => {
    if (selectedModule && !selectedClass) {
      setFormData({
        title: selectedModule.title || "",
        description: selectedModule.description || "",
      });
    } else if (selectedClass) {
      setFormData({
        title: selectedClass.title || "",
        content: selectedClass.content || "",
      });
    }
  }, [selectedModule, selectedClass]); // 🔹 Se actualiza cuando cambia la selección

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (selectedModule && !selectedClass) {
        await api.put(`/modules/${selectedModule._id}`, formData);
  
        // 🔹 Actualizar módulos en selectedFormation para reflejar los cambios en tiempo real
        setSelectedFormation((prev) => ({
          ...prev,
          modules: prev.modules.map((m) =>
            m._id === selectedModule._id ? { ...m, ...formData } : m
          ),
        }));
  
        setSelectedModule((prev) => ({ ...prev, ...formData }));
      } else if (selectedClass) {
        await api.put(`/classes/${selectedClass._id}`, formData);
  
        // 🔹 Actualizar clases en selectedModule para reflejar los cambios en tiempo real
        setSelectedModule((prev) => ({
          ...prev,
          classes: prev.classes.map((c) =>
            c._id === selectedClass._id ? { ...c, ...formData } : c
          ),
        }));
  
        setSelectedClass((prev) => ({ ...prev, ...formData }));
      }
  
      // 🔹 Volvemos a cargar todas las formaciones desde la API
      fetchFormations();
  
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };
  

  return (
    <div className="details-view">
      {selectedModule && !selectedClass && (
        <div className="module-details">
          {isEditing ? (
            <>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
              <textarea name="description" value={formData.description} onChange={handleChange} />
              <button onClick={handleSave}>💾 Guardar</button>
            </>
          ) : (
            <>
              <h2>{selectedModule.title}</h2>
              <p>{selectedModule.description}</p>
              <button onClick={handleEdit}>✏️ Editar</button>
            </>
          )}
        </div>
      )}

      {selectedClass && (
        <div className="class-details">
          {isEditing ? (
            <>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
              <textarea name="content" value={formData.content} onChange={handleChange} />
              <button onClick={handleSave}>💾 Guardar</button>
            </>
          ) : (
            <>
              <h2>{selectedClass.title}</h2>
              <p>{selectedClass.content}</p>
              {selectedClass.videoUrl && (
                <iframe
                  width="100%"
                  height="315"
                  src={selectedClass.videoUrl}
                  title={selectedClass.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
              {selectedClass.fileUrl && <a href={selectedClass.fileUrl}>📄 Descargar PDF</a>}
              <button onClick={handleEdit}>✏️ Editar Clase</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FormationDetails;

