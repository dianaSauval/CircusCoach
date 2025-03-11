import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/admin/ManageClasses.css";

const ManageClasses = () => {
  const { moduleId } = useParams();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get(`/classes/${moduleId}`);
        setClasses(response.data);
      } catch (error) {
        console.error("Error al cargar clases:", error);
      }
    };

    fetchClasses();
  }, [moduleId]);

  return (
    <div className="admin-container">
      <h1>Clases del Módulo</h1>
      <ul>
        {classes.map((cls) => (
          <li key={cls._id}>
            <h3>{cls.title}</h3>
            {cls.fileUrl && <a href={cls.fileUrl} target="_blank">📄 Ver PDF</a>}
            {cls.videoUrl && <a href={cls.videoUrl} target="_blank">🎥 Ver Video</a>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageClasses;
