import React from "react";
import "../styles/pages/BioRocioGarrote.css";
import { FaFilePdf } from "react-icons/fa";

const BioRocioGarrote = () => {
  return (
    <section className="biografia-section">
      <div className="biografia-content">
        <div className="biografia-texto">
          <p>
            Rocío Garrote comenzó su camino en el circo a los 16 años en Argentina, donde dio sus primeros pasos como artista y profesora de circo. Su formación artística y pedagógica es amplia y diversa, abarcando reconocidas instituciones en Argentina y Europa. En Argentina, se formó en Circo Soq, La Arena, la Universidad Nacional de San Martín (Unsam) en la carrera de circo, y en la Escuela Superior de Educación Física ISEF II, completando con una formación de danza contemporánea en CDC- IFA con Luciano Cejas. Además, completó la formación en Flexibilidad Segura y obtuvo un Diplomado Universitario en Neurociencias y Neuropsicología aplicadas a deportes de alto rendimiento, así como estudios en Psicología del Deporte en la Universidad Austral. En Europa, perfeccionó su formación en la prestigiosa École Supérieure des Arts du Cirque (ESAC) en Bélgica.
          </p>
          <p>
            Con más de diez años de experiencia como docente, Rocío ha enseñado en numerosas escuelas de circo en Argentina y Europa, entre ellas La Arena, Maroma, Club Nueva Chicago, Circus Zonder Handen, la Escuela de Circo de Bruselas y Up Circus & Performing Arts. También ha trabajado en reconocidas escuelas profesionales de circo pertenecientes a la FEDEC, como ESAC (Bélgica), CRAC (Francia), ACaPA (Países Bajos) y Le CNAC (Francia).
          </p>
          <p>
            Rocío ha desarrollado formaciones y talleres que ofrecen herramientas sólidas, basadas en una metodología pedagógica adaptada a cada persona, ya sea en el trabajo individual o colectivo. Su enfoque busca que los alumnos comprendan su disciplina de manera teórica y práctica, integrándola como un elemento clave en su proceso de aprendizaje y en su vida cotidiana.
          </p>

          <a
            href="https://res.cloudinary.com/dkdhdy9e5/raw/upload/v1743214000/CircusCoach/CV-RocioGarrote.pdf"
            className="biografia-pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <FaFilePdf className="pdf-icon" />
            <span>Descargar CV</span>
          </a>

          <div className="firma-rocio">Rocío Garrote</div>
        </div>
      </div>
    </section>
  );
};

export default BioRocioGarrote;
