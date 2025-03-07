import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../services/api";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error("Error al obtener detalles del curso:", error);
      }
    };

    fetchCourse();
  }, [id]);

  return (
    <div>
      {course ? (
        <>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <p>Precio: ${course.price}</p>
          <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer">Descargar PDF</a>
          <br />
          <video width="600" controls>
            <source src={course.videoUrl} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </>
      ) : (
        <p>Cargando curso...</p>
      )}
    </div>
  );
}

export default CourseDetail;
