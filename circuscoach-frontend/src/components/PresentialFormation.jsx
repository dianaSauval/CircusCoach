import React, { useEffect, useState } from "react";
import "../styles/components/PresentialFormation.css";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { getPresentialFormations } from "../services/api";

const PresentialFormationCard = ({ formation }) => {
  const { title, location, dateType, singleDate, dateRange } = formation;

  const formatFecha = (date, incluirAño = true) => {
    const fecha = new Date(date);
    const opciones = { day: "numeric", month: "long" };
    const diaYMes = fecha.toLocaleDateString("es-ES", opciones);
    const año = fecha.getFullYear();
    return incluirAño ? `${diaYMes} del ${año}` : diaYMes;
  };

  const dateDisplay =
    dateType === "single" ? (
      <span>{formatFecha(singleDate)}</span>
    ) : (
      <span>
        {formatFecha(dateRange.start, false)} -{" "}
        {formatFecha(dateRange.end, false)}
      </span>
    );

  return (
    <div className="formation-pill">
      <div className="circle-icon"></div>
      <div className="formation-text">
        <div className="line-top">
          <FaRegCalendarAlt className="icon" />
          <span>{dateDisplay}</span>
          <FaMapMarkerAlt className="icon location-icon" />
          <span>{location.es}</span>
        </div>
        <div className="line-bottom">
          {formation.registrationLink ? (
            <a
              className="formation-title"
              href={formation.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {title.es}
            </a>
          ) : (
            <span className="formation-title">{title.es}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const PresentialFormationsList = () => {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const data = await getPresentialFormations();
        setFormations(data);
      } catch (err) {
        console.error("Error al traer formaciones presenciales:", err);
      }
    };

    fetchFormations();
  }, []);

  return (
    <div className="formations-wrapper">
      <h2 className="formations-title">PRÓXIMAS FORMACIONES Y WORKSHOPS</h2>

      {formations.length === 0 ? (
        <div className="no-formations-message">
          <p className="no-formations-title">
            Estamos preparando los próximos encuentros presenciales
          </p>
          <p className="no-formations-text">
            Pronto compartiremos más propuestas presenciales para que sigas
            entrenando, aprendiendo y creando.
          </p>
        </div>
      ) : (
        formations.map((formation) => (
          <PresentialFormationCard key={formation._id} formation={formation} />
        ))
      )}
    </div>
  );
};

export default PresentialFormationsList;
