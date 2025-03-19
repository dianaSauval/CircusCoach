import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../services/auth";
import "../styles/components/Header.css";
import logo from "../assets/img/logo.png";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header className="header">
      {/* 🔹 Logo */}
      <div className="logo"><img src={logo} alt="Logo" className="logo-img" />
      </div>

      {/* 🔹 Menú Central */}
      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/courses">Cursos</Link>
        <Link to="/formaciones">Formaciones</Link>
        {isAuthenticated()&& (<Link to="/admin">Admin</Link>)}
      </nav>

      {/* 🔹 Botón de Sesión */}
      <div className="auth-button">
        {isAuthenticated() ? (
      
          <button onClick={handleLogout}>Cerrar Sesión</button>
          
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </div>
    </header>
  );
}

export default Header;

