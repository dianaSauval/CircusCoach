import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/pages/FormationDetails.css";
import { getYoutubeEmbedUrl } from "../utils/youtube";

function FormationDetails() {
  const location = useLocation();
  const formation = location.state?.formation;
  const [showVideo, setShowVideo] = useState(false);

  if (!formation) {
    return <p className="error-text">Error: No se encontró la formación.</p>;
  }

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const pdfUrl = formation.pdf?.es;
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };
  
  

  const embedUrl = getYoutubeEmbedUrl(formation.video?.es);

  return (
    <div className="detalle-container">
      <div className="left-section">
        <h1 className="detalle-title">{formation.title.es}</h1>
        <p className="detalle-description">{formation.description.es}</p>

        <button className="inscribite-button">Inscribite ahora</button>

        {formation.pdf?.es && (
          <>
            <p className="pdf-info-text">
              Descargá toda la información de esta formación en PDF:
            </p>
            <button type="button" className="descargar-button" onClick={handleDownload}>
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
              alt={formation.title.es}
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
