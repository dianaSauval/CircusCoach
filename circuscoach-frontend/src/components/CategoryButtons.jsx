import React from 'react';
import '../styles/components/CategoryButtons.css';
import { NavLink } from 'react-router-dom';

const CategoryButtons = () => {
  return (
    <div className="category-buttons">
      <NavLink to="/cursos" className="category-button">CURSOS CORTOS</NavLink>
      <NavLink to="/formaciones" className="category-button">FORMACIONES COMPLETAS</NavLink>
      <NavLink to="/formaciones" className="category-button">FORMACIONES PARA ESCUELAS PROFESIONALES</NavLink>
    </div>
  );
};

export default CategoryButtons;

