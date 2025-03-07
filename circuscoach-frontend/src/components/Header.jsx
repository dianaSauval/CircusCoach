import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../services/auth";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">Inicio</Link> | 
      <Link to="/courses">Cursos</Link> | 
      {isAuthenticated() ? (
        <>
          <Link to="/admin">Admin</Link> | 
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <Link to="/login">Iniciar Sesión</Link>
      )}
    </nav>
  );
}

export default Header;
