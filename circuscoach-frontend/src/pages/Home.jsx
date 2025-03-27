import TestimonialCarousel from '../components/TestimonialCarousel';
import '../styles/pages/Home.css';
import { useNavigate } from 'react-router-dom';
import testimonios from "../data/testimonios.json";
import CategoryButtons from '../components/CategoryButtons';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
    <section className="home-hero">
      <div className="home-content">
        <h1>
          15 AÑOS DE EXPERIENCIA EN ESCUELAS DE CIRCO DE RENOMBRE, DESARROLLANDO
          FORMACIONES RESPALDADAS POR METODOLOGÍAS COMPROBADAS PARA OPTIMIZAR
          EL RENDIMIENTO FÍSICO Y ARTÍSTICO.
        </h1>

        <button onClick={() => navigate('/formaciones')}>QUIERO FORMARME</button>

        <div className="home-description">
          <p>
            En nuestras formaciones, combinamos la experiencia artística con el conocimiento teórico para potenciar tu nivel.
            
          </p>
          <p>Nos especializamos en aplicar principios de biomecánica, neurociencia, psicología del deporte e innovación educativa
          en cada proceso de enseñanza, adaptándonos a las necesidades individuales de cada alumno y al contexto artístico.</p>
          <p>
            Te ofrecemos la oportunidad de perfeccionar tu técnica y comprensión del movimiento a través de una formación integral
            que abarca todos los aspectos de las artes circenses.
          </p>
          <p>
            Con más de 10 años de experiencia en las principales escuelas de circo de Argentina y Europa, y una base teórica sólida,
            te brindamos una formación que marcará la diferencia en tu profesión.
            
          </p>
          <p>Tu potencial está en tus manos!</p>
        </div>
      </div>
    </section>
    <CategoryButtons/>
    <TestimonialCarousel testimonios={testimonios} />

    </>
  );
}
