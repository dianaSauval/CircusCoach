import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../../styles/admin/ManageFormations.css";

const ManageFormations = () => {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await api.get("/formations");
        setFormations(response.data);
      } catch (error) {
        console.error("Error al cargar formaciones:", error);
      }
    };

    fetchFormations();
  }, []);

  return (
    <div className="admin-container">
      <h1>Gestionar Formaciones</h1>
      <Link to="/admin/formaciones/nueva" className="add-button">➕ Nueva Formación</Link>
      <ul>
        {formations.map((formation) => (
          <li key={formation._id}>
            <h3>{formation.title}</h3>
            <p>{formation.description}</p>
            <p>💰 {formation.price} USD</p>
            <Link to={`/admin/formaciones/${formation._id}/modulos`} className="edit-button">📖 Ver Módulos</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageFormations;
