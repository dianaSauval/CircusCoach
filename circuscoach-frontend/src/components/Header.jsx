import { Link, useNavigate, NavLink } from "react-router-dom";
import { isAuthenticated, removeToken } from "../services/auth";
import "../styles/components/Header.css";
import logo from "../assets/img/logo.png";
import { FaSearch, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Circus Coach Logo" />
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
      <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>INICIO</NavLink>
        <NavLink to="/cursos" className="nav-link" onClick={() => setMenuOpen(false)}>CURSOS</NavLink>
        <NavLink to="/formaciones" className="nav-link" onClick={() => setMenuOpen(false)}>FORMACIONES</NavLink>
        <NavLink to="/nosotros" className="nav-link" onClick={() => setMenuOpen(false)}>NOSOTROS</NavLink>

        {isAuthenticated() && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/mis-cursos">Mis Cursos</Link>
          </>
        )}
        {/* 🔹 Botón de Sesión */}

        {isAuthenticated() ? (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </nav>

      <div className="header-icons">
        <FaSearch className="header-icon" />
        <FaShoppingBag className="header-icon" />
      </div>
    </header>
  );
}
