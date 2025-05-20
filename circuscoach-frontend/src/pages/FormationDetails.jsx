import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/pages/DetailLayout.css";
import { getYoutubeEmbedUrl } from "../utils/youtube";
import { getFormationById } from "../services/formationService";
import { useLanguage } from "../context/LanguageContext";
import translations from "../i18n/translations";
import EmptyState from "../components/EmptyState/EmptyState";
import InternationalPriceCard from "../components/InternationalPriceCard/InternationalPriceCard";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import slugify from "slugify"; // Asegurate de tenerlo instalado: npm i slugify

function FormationDetails() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const tc = translations.courseDetail[lang];

  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [idiomaNoDisponible, setIdiomaNoDisponible] = useState(false);
  const [idiomasDisponibles, setIdiomasDisponibles] = useState([]);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const data = await getFormationById(id, lang);
        if (!data.visible?.[lang]) {
          setFormation(null);
          setIdiomaNoDisponible(true);
          const langs = Object.entries(data.visible || {})
            .filter(([_, visible]) => visible)
            .map(([idioma]) => idioma.toUpperCase());
          setIdiomasDisponibles(langs);
        } else {
          setFormation(data);
          setIdiomaNoDisponible(false);

          // 🔁 Si falta el slug en la URL, redireccionamos
          const generatedSlug = slugify(data.title, { lower: true });
          if (!slug || slug !== generatedSlug) {
            navigate(`/formaciones/${id}/${generatedSlug}`, { replace: true });
          }

          const langs = Object.entries(data.visible || {})
            .filter(([_, visible]) => visible)
            .map(([idioma]) => idioma.toUpperCase());
          setIdiomasDisponibles(langs);
        }
      } catch (error) {
        console.error("Error al obtener la formación:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [id, lang]);

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (formation?.pdf) {
      window.open(formation.pdf, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) return <LoadingSpinner texto={tc.loading} />;

  if (idiomaNoDisponible) {
    return (
      <EmptyState
        title={`😢 ${tc.unavailableTitle}`}
        subtitle={tc.unavailable.replace(
          "{{lang}}",
          tc.languageNames[lang] || lang.toUpperCase()
        )}
      />
    );
  }

  if (!formation) {
    return <p className="error-text">{tc.notFound}</p>;
  }

  const embedUrl = formation.video ? getYoutubeEmbedUrl(formation.video) : null;

  return (
    <>
      <div className="detalle-container">
        <div className="left-section">
          <h1 className="detalle-title">{formation.title}</h1>
          <p className="detalle-description">{formation.description}</p>

          <button className="inscribite-button">{tc.enrollNow}</button>

          {formation.pdf && (
            <>
              <p className="pdf-info-text">{tc.downloadInfo}</p>
              <button
                type="button"
                className="descargar-button"
                onClick={handleDownload}
              >
                {tc.downloadButton}
              </button>
            </>
          )}

          {idiomasDisponibles.length > 0 && (
            <p className="detalle-idiomas">
              🌐 {tc.availableLanguages}:{" "}
              {idiomasDisponibles
                .map((code) => tc.languageNames[code.toLowerCase()] || code)
                .join(" / ")}
            </p>
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

      <div className="detalle-caracteristicas">
        <div className="caracteristica">
          <i className="fas fa-wifi"></i>
          <span>{tc.feature_online}</span>
        </div>

        <div className="caracteristica">
          <i className="fas fa-file-download"></i>
          <span>{tc.feature_downloadable}</span>
        </div>

        <div className="caracteristica">
          <i className="fas fa-comments"></i>
          <span>{tc.feature_support}</span>
        </div>
      </div>

      <InternationalPriceCard isCourse={false} price={formation.price} />
    </>
  );
}

export default FormationDetails;
