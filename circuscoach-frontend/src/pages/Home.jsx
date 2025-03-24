import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Home.css";

// 🔠 Convierte el título en un slug tipo "formacion-en-acrobacia"
const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD") // Quita tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "") // Quita símbolos raros
    .replace(/\s+/g, "-");

    
function Home() {
  const presencialRef = useRef(null);
  const onlineRef = useRef(null);
  const escuelasRef = useRef(null);

  const [language, setLanguage] = useState("es"); // multilenguaje
  const [presencialFormations, setPresencialFormations] = useState([]);
  const [onlineFormations, setOnlineFormations] = useState([]); // 🆕 nuevo estado

  const navigate = useNavigate();

  const handleCardClick = (formation) => {
    const slug = slugify(formation.title[language]); // función que definimos arriba
    navigate(`/${slug}`, { state: { formation } });
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔹 Formaciones presenciales
  useEffect(() => {
    const fetchPresenciales = async () => {
      try {
        const response = await api.get(
          `/formations/presencial?lang=${language}`
        );
        setPresencialFormations(response.data);
      } catch (error) {
        console.error("Error al traer formaciones presenciales:", error);
      }
    };
    fetchPresenciales();
  }, [language]);

  // 🔹 Formaciones online
  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const response = await api.get(`/formations/online?lang=${language}`);
        setOnlineFormations(response.data);
      } catch (error) {
        console.error("Error al traer formaciones online:", error);
      }
    };
    fetchOnline();
  }, [language]);

  return (
    <div className="home-container">
      <section className="banner">
        <div className="banner-overlay">
          <h1 className="banner-title">Bienvenido a CircusCoach</h1>
          <div className="banner-buttons">
            <button
              className="banner-button"
              onClick={() => scrollToSection(presencialRef)}
            >
              Formaciones presenciales
            </button>
            <button
              className="banner-button"
              onClick={() => scrollToSection(onlineRef)}
            >
              Formaciones online
            </button>
            <button
              className="banner-button"
              onClick={() => scrollToSection(escuelasRef)}
            >
              Formaciones para escuelas
            </button>
          </div>
        </div>
      </section>

      {/* 🔹 PRESENCIALES */}
      <section ref={presencialRef} className="section">
        <h2>Formaciones Presenciales</h2>
        <div className="formation-cards">
          {presencialFormations.length === 0 ? (
            <p>No hay formaciones presenciales disponibles.</p>
          ) : (
            presencialFormations.map((formation) => (
              <div
                className="formation-card"
                key={formation._id}
                onClick={() => handleCardClick(formation)}
              >
                <img
                  src={formation.image}
                  alt={`Formación ${formation._id}`}
                  className="formation-image-presentation"
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* 🔹 ONLINE */}
      <section ref={onlineRef} className="section">
        <h2>Formaciones Online</h2>
        <div className="formation-cards">
          {onlineFormations.length === 0 ? (
            <p>No hay formaciones online disponibles.</p>
          ) : (
            onlineFormations.map((formation) => (
              <div
                className="formation-card"
                key={formation._id}
                onClick={() => handleCardClick(formation)}
              >
                <img
                  src={formation.image}
                  alt={`Formación ${formation._id}`}
                  className="formation-image-presentation"
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* 🔹 ESCUELAS */}
      <section ref={escuelasRef} className="section">
        <h2>Formaciones para Escuelas</h2>
        <p>Contenido de la sección para escuelas...</p>
      </section>
    </div>
  );
}

export default Home;
