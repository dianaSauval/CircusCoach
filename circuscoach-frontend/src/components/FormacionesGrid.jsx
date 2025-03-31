import React, { useEffect, useState } from "react";
import { getVisibleFormations } from "../services/api";
import "../styles/components/FormacionesGrid.css";

const FormacionesGrid = ({ lang = "es" }) => {
  const [formaciones, setFormaciones] = useState([]);

  useEffect(() => {
    const fetchFormaciones = async () => {
      try {
        const data = await getVisibleFormations(lang);
        setFormaciones(data);
      } catch (error) {
        console.error("Error al obtener formaciones:", error);
      }
    };

    fetchFormaciones();
  }, [lang]);

  return (
    <div className="formaciones-section">
      <h2 className="formaciones-title">FORMACIONES INTEGRALES</h2>
      <div className="formaciones-subtitle">
        <p>PROFUNDIZÁ TU PROFESIÓN:</p>
        <p>PERFECCIONÁ TUS HABILIDADES Y ALCANZÁ TU MÁXIMO POTENCIAL.</p>
      </div>    
      {formaciones.length === 0 ? (
  <div className="formaciones-empty-message">
    <h3>ESTAMOS PREPARANDO LOS PRÓXIMOS ENCUENTROS PRESENCIALES</h3>
    <p>
      Pronto compartiremos más propuestas presenciales para que sigas entrenando,
      aprendiendo y creando.
    </p>
  </div>
) : (
  <div className="formaciones-grid">
    {formaciones.map((formacion) => (
      <div key={formacion._id} className="formacion-card">
        <img
          src={formacion.image?.[lang]}
          alt={formacion.title?.[lang]}
          className="formacion-img"
        />
        <div className="formacion-description">
          {formacion.description?.[lang]}
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default FormacionesGrid;

