import "./Card.css";
import { useLanguage } from "../../context/LanguageContext";

const Card = ({ image, description, onClick }) => {
  const { language } = useLanguage();

  // 📷 Selecciona la imagen correcta según el idioma, o usa 'es' como fallback
  const selectedImage =
    typeof image === "string" ? image : image?.[language] || image?.es || null;

  // 📝 Selecciona la descripción correcta según el idioma, o usa 'es' como fallback
  const selectedDescription =
    typeof description === "string"
      ? description
      : description?.[language] || description?.es || "";

  function truncateText(text, maxLength = 120) {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return truncated.slice(0, lastSpace) + "...";
  }

  return (
    <div
      className="custom-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Imagen del curso o formación"
          className="custom-card-img"
        />
      )}
      <div className="custom-card-description">
        {truncateText(selectedDescription)}
      </div>
    </div>
  );
};

export default Card;
