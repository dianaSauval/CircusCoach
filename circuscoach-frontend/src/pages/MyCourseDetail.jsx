import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/pages/MyCourseDetail.css";
import { getFormationVisibleContent } from "../services/formationService";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

function MyCourseDetail() {
  const { id } = useParams();
  const [formacion, setFormacion] = useState(null);
  const [progress, setProgress] = useState({
    porcentajeContenido: 2,
    modulosCompletados: 1,
    totalModulos: 14,
  });
  const [moduloSeleccionado, setModuloSeleccionado] = useState(0);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFormationVisibleContent(id, "es");
        setFormacion(data.formation);
        setModules(data.modules);
      } catch (err) {
        console.error("Error al obtener datos visibles:", err);
      }
    };
  
    fetchData();
  }, [id]);

  if (!formacion) return <LoadingSpinner />    ;

  const porcentaje = progress.porcentajeContenido;
  const modulosCompletados = progress.modulosCompletados;
  const totalModulos = progress.totalModulos;
  const progresoModulos = (modulosCompletados / totalModulos) * 100;

  return (
    <div className="myCourse-detail-container">
      <h1>{formacion.title?.es}</h1>
      <p>{formacion.description?.es}</p>

      <h2>Tu progreso</h2>
      <div className="progress-section">
        <div className="progress-item">
          <div
            className="progress-icon"
            style={{
              background: `conic-gradient(#1E1F26 ${porcentaje}%, #e0e0e0 ${porcentaje}%)`,
            }}
          >
            📘
          </div>
          <p>
            {porcentaje}%<br />
            Contenido
          </p>
        </div>

        <div className="progress-item">
          <div
            className="progress-icon"
            style={{
              background: `conic-gradient(#7E1DC3 ${progresoModulos}%, #e0e0e0 ${progresoModulos}%)`,
            }}
          >
            📚
          </div>
          <p>
            {modulosCompletados}/{totalModulos}
            <br />
            Módulos
          </p>
        </div>
      </div>
      {/* 🔻 NUEVO CONTENIDO debajo del progreso */}
      <div className="course-content-section">
        <div className="module-tabs">
          {modules.map((mod, index) => (
            <button
              key={mod._id}
              className={`module-tab ${
                moduloSeleccionado === index ? "active" : ""
              }`}
              onClick={() => setModuloSeleccionado(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="module-details">
          <h3>Módulo {moduloSeleccionado + 1}</h3>
          <h4>
            {modules[moduloSeleccionado].title?.es || "Sin título"}
          </h4>
          <p>
            {modules[moduloSeleccionado].classes?.length || 0} clase
            {modules[moduloSeleccionado].classes?.length !== 1 && "s"}
          </p>

          <div className="class-list">
            {(modules[moduloSeleccionado].classes || []).map(
              (clase) => (
                <div key={clase._id} className="class-item">
                  <span>{clase.title?.es}</span>
                  <span className="status-icon">⭕</span>{" "}
                  {/* Cambiar por ✔️ si está hecha */}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCourseDetail;
