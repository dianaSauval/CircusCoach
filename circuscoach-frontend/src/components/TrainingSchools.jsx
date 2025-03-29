import React from "react";
import "../styles/components/TrainingSchools.css";

const TrainingSchools = () => {
  return (
    <section className="escuelas-section">
      <div className="escuelas-content">
        <h1 className="escuelas-title">Formaciones para escuelas profesionales</h1>
        <p>
          Con años de experiencia como estudiante de una escuela profesional,
          artista en el ámbito profesional, intérprete y creadora de
          espectáculos, he desarrollado una visión integral que me permite guiar
          a los estudiantes en su camino hacia una carrera profesional sólida y
          auténtica.
        </p>
        <p>
          Creo firmemente que, como artista y docente, tengo la capacidad y el
          conocimiento técnico y pedagógico para acompañar a los estudiantes en
          su proceso de transformación, ayudándolos a desarrollar la fuerza
          física y mental que necesitan para afrontar los desafíos de esta
          profesión.
        </p>
        <p>
          Mi enfoque se basa en las necesidades individuales y colectivas de
          cada alumno, siempre considerando las particularidades y objetivos de
          cada escuela y el contexto artístico actual. Trabajo para crear un
          espacio donde los estudiantes puedan explorar, crecer y superar sus
          propios límites, encontrando su estilo personal mientras fortalecen su
          técnica y expresión.
        </p>
        <p>
          Me mantengo en constante formación y actualización en áreas como
          biomecánica, neurociencia, psicología del deporte e innovación
          educativa, para ofrecer una enseñanza que no solo sea efectiva, sino
          también respetuosa con el cuerpo y las emociones de cada estudiante.
        </p>
        <div className="destacado">
          <span className="icono">💡</span>
          <p>
            Más que enseñar técnica, busco ayudar a los artistas a descubrir y
            potenciar su identidad artística, construyendo una base sólida para
            una carrera profesional exitosa.
          </p>
        </div>

        <div className="contacto">
          <span className="icono">📩</span>
          <p>
            Para solicitar los programas de estudio según disciplina, puedes
            contactarme por email
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrainingSchools;
