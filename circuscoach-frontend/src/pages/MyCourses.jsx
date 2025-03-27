import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { isAuthenticated } from "../services/auth";
import "../styles/pages/MyCourses.css"; // si querés separar estilos

function MyCourses() {
  const [formations, setFormations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

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

      fetchFormations();
  }, []);

  return (
    <div className="my-courses-page">
      <h2>Mis Cursos</h2>
      <div className="formaciones-grid">
        {formations.map((formacion) => (
          <div
            key={formacion._id}
            className="formacion-card"
            onClick={() => navigate(`/mis-cursos/${formacion._id}`)}

          >
            <img
              src={formacion.image}
              alt={formacion.title.es}
              className="formacion-image"
            />
           <h3 className="formacion-title">{formacion.title?.es}</h3>

          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCourses;
