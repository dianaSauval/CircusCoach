import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import "../../styles/admin/ManageModules.css";

const ManageModules = () => {
  const { formationId } = useParams();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await api.get(`/modules/${formationId}`);
        setModules(response.data);
      } catch (error) {
        console.error("Error al cargar módulos:", error);
      }
    };

    fetchModules();
  }, [formationId]);

  return (
    <div className="admin-container">
      <h1>Módulos de la Formación</h1>
      <Link to={`/admin/formaciones/${formationId}/modulos/nuevo`} className="add-button">➕ Nuevo Módulo</Link>
      <ul>
        {modules.map((module) => (
          <li key={module._id}>
            <h3>{module.title}</h3>
            <Link to={`/admin/modulos/${module._id}/clases`} className="edit-button">🎥 Ver Clases</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageModules;
