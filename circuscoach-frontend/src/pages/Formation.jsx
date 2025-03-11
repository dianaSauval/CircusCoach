import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api"; // Axios para hacer solicitudes
import "../styles/Formation.css"; // Si necesitas estilos personalizados

const Formation = () => {
  const { id } = useParams(); // ID de la formación desde la URL
  const [formation, setFormation] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        // Obtener datos de la formación
        const response = await api.get(`/formations/${id}`);
        setFormation(response.data);

        // Obtener el progreso del usuario en esta formación
        const progressResponse = await api.get(`/progress/${id}`);
        setProgress(progressResponse.data.progress || {});
      } catch (err) {
        setError("Error al cargar la formación.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [id]);

  const calculateProgress = () => {
    if (!formation || !formation.modules) return 0;
    const totalClasses = formation.modules.reduce(
      (total, module) => total + module.classes.length,
      0
    );
    const completedClasses = Object.values(progress).filter(
      (done) => done
    ).length;
    return totalClasses ? (completedClasses / totalClasses) * 100 : 0;
  };

  const markClassAsCompleted = async (classId) => {
    try {
      await api.post(`/progress/${id}`, { classId });
      setProgress((prev) => ({ ...prev, [classId]: true }));
    } catch (err) {
      console.error("Error al marcar clase como completada:", err);
    }
  };

  if (loading) return <p>Cargando formación...</p>;
  if (error) return <p>{error}</p>;
  if (!formation) return <p>Formación no encontrada.</p>;

  return (
    <div className="formation-container">
      <h1>{formation.title}</h1>
      <p>{formation.description}</p>

      {/* Barra de Progreso */}
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
      <p>Progreso: {calculateProgress().toFixed(2)}%</p>

      {/* Módulos y Clases */}
      {formation.modules.map((module) => (
        <div key={module._id} className="module">
          <h2>{module.title}</h2>
          <ul>
            {module.classes.map((cls) => (
              <li
                key={cls._id}
                className={`class-item ${progress[cls._id] ? "completed" : ""}`}
              >
                <h3>{cls.title}</h3>
                <p>{cls.content}</p>
                {cls.fileUrl && (
                  <a
                    href={cls.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 Ver Archivo
                  </a>
                )}
                {cls.videoUrl && (
                  <iframe
                    width="560"
                    height="315"
                    src={cls.videoUrl}
                    title={cls.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}

                {!progress[cls._id] && (
                  <button onClick={() => markClassAsCompleted(cls._id)}>
                    ✅ Marcar como completada
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Formation;
