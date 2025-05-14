import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/pages/FormationDetails.css";
import { getYoutubeEmbedUrl } from "../utils/youtube";
import { getFormationById } from "../services/formationService";

function FormationDetails() {
  const { id } = useParams(); // ⬅️ Obtenemos el ID desde la URL
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const lang = "es"; // Podés hacerlo dinámico si usás context o props

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const data = await getFormationById(id, lang);
        console.log("Datos recibidos:", data);
        setFormation(data);
      } catch (error) {
        console.error("Error al obtener la formación:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("ID que se está usando:", id);
    fetchFormation();
  }, [id, lang]);

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (formation?.pdf) {
      window.open(formation.pdf, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) return <p className="loading-text">Cargando formación...</p>;

  if (!formation) {
    return <p className="error-text">Error: No se encontró la formación.</p>;
  }

  const embedUrl = getYoutubeEmbedUrl(formation.video);

  return (
    <div className="detalle-container">
      <div className="left-section">
        <h1 className="detalle-title">{formation.title}</h1>
        <p className="detalle-description">{formation.description}</p>

        <button className="inscribite-button">Inscribite ahora</button>

        {formation.pdf && (
          <>
            <p className="pdf-info-text">
              Descargá toda la información de esta formación en PDF:
            </p>
            <button
              type="button"
              className="descargar-button"
              onClick={handleDownload}
            >
              Descargar
            </button>
          </>
        )}
      </div>

      <div className="right-column">
        {embedUrl && showVideo ? (
          <iframe
            className="video-iframe"
            src={embedUrl}
            title="Video de la formación"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <div
            className="image-container"
            onClick={() => setShowVideo(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowVideo(true)}
          >
            <img
              src={formation.image}
              alt={formation.title}
              className="formation-image"
            />
            {embedUrl && <div className="play-overlay">▶️</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormationDetails;