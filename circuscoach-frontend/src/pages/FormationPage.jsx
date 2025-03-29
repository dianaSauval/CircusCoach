import { useEffect, useRef, useState } from 'react';
import '../styles/pages/FormationPage.css';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormacionesGrid from '../components/FormacionesGrid';
import PresentialFormation from '../components/PresentialFormation';
import PresentialFormationsList from '../components/PresentialFormation';
import TrainingSchools from '../components/TrainingSchools';

// 🔠 Convierte el título en un slug tipo "formacion-en-acrobacia"
const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD") // Quita tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "") // Quita símbolos raros
    .replace(/\s+/g, "-");


export default function FormationPage() {
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
    <>
    <div className="formation-hero">
      <div className="formation-buttons">
        <button onClick={() => scrollToSection(onlineRef)}>FORMACIONES ONLINE</button>
        <button onClick={() => scrollToSection(presencialRef)}>FORMACIONES PRESENCIALES</button>
        <button onClick={() => scrollToSection(escuelasRef)}>FORMACIONES PARA ESCUELAS PROFESIONALES</button>
      </div>
    </div>
      {/* 🔹 ONLINE */}
      <section ref={onlineRef} className="section">
        
        <FormacionesGrid/>
      </section>
        {/* 🔹 PRESENCIALES */}
            <section ref={presencialRef} className="section">
              <PresentialFormationsList/>
        
        </section>

      {/* 🔹 ESCUELAS */}
      <section ref={escuelasRef} className="section school">
        <TrainingSchools/>
      </section>
          
    </>
  );
}
