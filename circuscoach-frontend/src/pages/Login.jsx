import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../services/authService";
import "../styles/pages/Login.css";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";


function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await loginUser(email, password);
    saveToken(response.token);

    await login(); // ⚠️ Este login() del contexto carga el perfil y actualiza el header
    navigate("/");
  } catch (err) {
    console.error("Error en el login:", err);
    setError("Error al iniciar sesión. Verifica tus datos e intenta nuevamente.");
  }
};


  return (
    <div className="login-container">
      <h1 className="login-title">Iniciar sesión</h1>

      {error && <p className="login-error">{error}</p>}

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>

        <div className="login-links">
          <button type="button" className="link-button" onClick={() => navigate("/olvidaste-tu-contraseña")}>¿Olvidaste tu contraseña?</button>
          <button type="button" className="link-button" onClick={() => navigate("/register")}>¿Aún no tenés cuenta? Registrate</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
