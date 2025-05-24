import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import EmptyState from "../components/EmptyState/EmptyState";
import {
  getUserProfile,
  marcarClaseCurso,
  desmarcarClaseCurso,
} from "../services/userService";
import { getCourseById } from "../services/courseService";
import "../styles/pages/MyCourseDetail.css";

function MyCourseDetail() {
  const { id } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const visible = location.state?.visible;

  const [userId, setUserId] = useState(null);
  const [course, setCourse] = useState(null);
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(0);
  const [clasesCompletadas, setClasesCompletadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLocalizedText = (field) => {
    if (typeof field === "string") return field;
    return field?.[language] || field?.es || "";
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = await getUserProfile();
        setUserId(user._id);

        const progreso = user.progresoCursos?.find(p => p.courseId === id);
        if (progreso) {
          setClasesCompletadas(progreso.clasesCompletadas);
        }

        const data = await getCourseById(id, language);
        if (!data.visible?.[language]) {
          throw { response: { status: 403 } };
        }

        setCourse(data);
        setClases(data.classes || []);
      } catch (err) {
        if (err.response?.status === 403) {
          setCourse(null);
        } else {
          console.error("Error al cargar curso:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, language]);

  const handleMarcarClase = async () => {
    await marcarClaseCurso(userId, id, claseCompleta._id);
    setClasesCompletadas(prev => [...prev, claseCompleta._id]);
  };

  const handleDesmarcarClase = async () => {
    await desmarcarClaseCurso(userId, id, claseCompleta._id);
    setClasesCompletadas(prev => prev.filter(cid => cid !== claseCompleta._id));
  };

  const claseCompleta = clases?.[claseSeleccionada] || null;

  if (isLoading) return <LoadingSpinner texto="Cargando..." />;
  if (!course) {
    return (
      <EmptyState
        title="Curso no disponible"
        subtitle="Este curso no está disponible en el idioma seleccionado."
      />
    );
  }

  const totalClases = clases.length;
  const clasesHechas = clasesCompletadas.length;
  const porcentaje = Math.round((clasesHechas / totalClases) * 100);

  return (
    <div className="my-course-detail">
      <button className="volver-button" onClick={() => navigate("/mis-cursos")}>⬅️ Volver a mis cursos</button>
      <h1 className="formation-title">{getLocalizedText(course.title)}</h1>
      <p className="formation-description">{getLocalizedText(course.description)}</p>

      <h2 className="progress-title">Tu progreso</h2>
      <div className="progress-section">
        <div className="progress-item">
          <div
            className="progress-icon progress-contenido"
            style={{
              background: `conic-gradient(var(--color-petroleo) ${porcentaje}%, #e0e0e0 ${porcentaje}%)`,
            }}
          >📘</div>
          <p>{porcentaje}%<br />Contenido</p>
        </div>
      </div>

      <div className="class-selector">
        {clases.map((cl, j) => (
          <button
            key={cl._id}
            className={`class-pill ${j === claseSeleccionada ? "active" : ""}`}
            onClick={() => setClaseSeleccionada(j)}
          >
            Clase {j + 1}
          </button>
        ))}
      </div>

      <div className="class-content">
        {claseCompleta ? (
          <>
            <h2>{getLocalizedText(claseCompleta.title)}</h2>
            {claseCompleta.subtitle && <h3>{getLocalizedText(claseCompleta.subtitle)}</h3>}
            {claseCompleta.content && <p>{getLocalizedText(claseCompleta.content)}</p>}
            {claseCompleta.secondaryContent && <p className="secondary-content">{getLocalizedText(claseCompleta.secondaryContent)}</p>}

            {claseCompleta.pdfs?.length > 0 && (
              <div className="pdf-list">
                <h4>📄 PDFs:</h4>
                <ul>
                  {claseCompleta.pdfs.map((pdf, index) => (
                    <li key={index}>
                      <a href={getLocalizedText(pdf.url)} target="_blank" rel="noopener noreferrer">
                        {getLocalizedText(pdf.title) || `PDF ${index + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {claseCompleta.videos?.length > 0 && (
              <div className="video-list">
                <h4>🎥 Videos:</h4>
                <ul>
                  {claseCompleta.videos.map((video, index) => (
                    <li key={index}>
                      <a href={getLocalizedText(video.url)} target="_blank" rel="noopener noreferrer">
                        {getLocalizedText(video.title) || `Video ${index + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {clasesCompletadas.includes(claseCompleta._id) ? (
              <button className="mark-done-button unmark" onClick={handleDesmarcarClase}>🔄 Desmarcar clase</button>
            ) : (
              <button className="mark-done-button" onClick={handleMarcarClase}>✔️ Marcar como hecha</button>
            )}
          </>
        ) : (
          <p>No hay contenido disponible para esta clase.</p>
        )}
      </div>
    </div>
  );
}

export default MyCourseDetail;
