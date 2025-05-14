import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCourses } from "../services/courseService";
import {
  getVisibleFormations,
} from "../services/formationService";
import { useLanguage } from "../context/LanguageContext";
import "../styles/pages/MyCourses.css";
import Card from "../components/Card/Card";
import EmptyState from "../components/EmptyState/EmptyState";

function MyCourses() {
  const [formations, setFormations] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
      return;
    }

          const fetchData = async () => {
      try {
        const [formationsData, coursesData] = await Promise.all([
          getVisibleFormations(language),
          getCourses(language),
        ]);
        setFormations(formationsData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error al cargar cursos o formaciones:", error);
      }
    };

    if (isAuthenticated) fetchData();
  }, [language, isAuthenticated, loading]);

  return (
    <div className="my-courses-page">
      <h2 className="section-title">📚 Mis Formaciones</h2>
      <div className="formaciones-grid">
        {formations.length > 0 ? (
          formations.map((formacion) => (
            <Card
              key={formacion._id}
              image={formacion.image}
              description={formacion.title}
              onClick={() => navigate(`/mis-cursos/${formacion._id}`)}
            />
          ))
        ) : (
          <EmptyState
            title={isAdmin ? "Sin formaciones visibles" : "Aún no tenés formaciones"}
            subtitle={
              isAdmin
                ? "No hay formaciones visibles en este idioma por el momento."
                : "Todavía no has comprado ninguna formación. ¡Explorá nuestras propuestas y empezá tu camino!"
            }
          />
        )}
      </div>

      <h2 className="section-title">💻 Mis Cursos Online</h2>
      <div className="formaciones-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card
              key={course._id}
              image={course.image}
              description={course.title}
              onClick={() => navigate(`/curso/${course._id}`)}
            />
          ))
        ) : (
          <EmptyState
            title={isAdmin ? "Sin cursos visibles" : "Aún no tenés cursos"}
            subtitle={
              isAdmin
                ? "No hay cursos visibles en este idioma por el momento."
                : "Todavía no has comprado ningún curso online. ¡Explorá nuestro catálogo y empezá a aprender!"
            }
          />
        )}
      </div>
    </div>
  );
}

export default MyCourses;
