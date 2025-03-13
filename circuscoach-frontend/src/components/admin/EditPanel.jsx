import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/admin/EditPanel.css";

const EditPanel = ({ type, item, fetchFormations }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    content: item?.content || "",  // 🔹 Agregamos "content" para clases
    fileUrl: item?.fileUrl || "",  // 🔹 Agregamos "fileUrl" para clases
    videoUrl: item?.videoUrl || "", // 🔹 Agregamos "videoUrl" para clases
  });

  useEffect(() => {
    setFormData({
      title: item?.title || "",
      description: item?.description || "",
      content: item?.content || "",
      fileUrl: item?.fileUrl || "",
      videoUrl: item?.videoUrl || "",
    });
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/${type === "module" ? "modules" : "classes"}/${item._id}`, formData);
      fetchFormations(); // 🔹 Actualiza la vista al instante
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <div className="edit-panel">
      <h2>{type === "module" ? "📦 Módulo" : "📄 Clase"}</h2>
      {isEditing ? (
        <>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" />
          {type === "class" && (
            <>
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Contenido de la clase" />
              <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="URL del PDF" />
              <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="URL del video" />
            </>
          )}
          <button className="save-button" onClick={handleSave}>💾 Guardar</button>
        </>
      ) : (
        <>
          <h3>{formData.title}</h3>
          <p>{formData.description || "Sin descripción"}</p>
          {type === "class" && (
            <>
              <p>{formData.content || "Sin contenido"}</p>
              {formData.fileUrl && <a href={formData.fileUrl}>📄 Descargar PDF</a>}
              {formData.videoUrl && (
                <iframe width="100%" height="200" src={formData.videoUrl} title="Video de la clase" frameBorder="0" allowFullScreen></iframe>
              )}
            </>
          )}
          <button className="edit-button" onClick={() => setIsEditing(true)}>✏️ Editar</button>
        </>
      )}
    </div>
  );
};

export default EditPanel;

