import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../services/auth";
import "../styles/components/Header.css";
import logo from "../assets/img/Logo.png";
import { FaSearch, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decodificando token:", error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [isAuthenticated()]);
  
  

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

      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>INICIO</NavLink>
        <NavLink to="/cursos" className="nav-link" onClick={() => setMenuOpen(false)}>CURSOS</NavLink>
        <NavLink to="/formaciones" className="nav-link" onClick={() => setMenuOpen(false)}>FORMACIONES</NavLink>
        <NavLink to="/nosotros" className="nav-link" onClick={() => setMenuOpen(false)}>NOSOTROS</NavLink>

        {isAuthenticated() && (
          <>
            <NavLink to="/mis-cursos" className="nav-link" onClick={() => setMenuOpen(false)}>MIS CURSOS</NavLink>
            {userRole === "admin" && (
              <NavLink to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>ADMIN</NavLink>
            )}
          </>
        )}

        {isAuthenticated() ? (
          <NavLink to="/" className="nav-link mobile-only" onClick={handleLogout}>CERRAR SESIÓN</NavLink>
        ) : (
          <NavLink to="/login" className="nav-link mobile-only">INICIAR SESIÓN</NavLink>
        )}
      </nav>

      <div className="header-icons">
        <FaSearch className="header-icon" />
        <FaShoppingBag className="header-icon" />

        {isAuthenticated() ? (
          <NavLink to="/" className="nav-link login desktop-only" onClick={handleLogout}>CERRAR SESIÓN</NavLink>
        ) : (
          <NavLink to="/login" className="nav-link desktop-only">INICIAR SESIÓN</NavLink>
        )}
      </div>
    </header>
  );
}
