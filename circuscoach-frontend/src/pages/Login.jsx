import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { saveToken } from "../services/auth";
import "../styles/Login.css"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reinicia el error en cada intento de login

    try {
      const response = await loginUser(email, password);
      saveToken(response.token);
      navigate("/admin");
    } catch (err) {
      console.error("Error en el login:", err); // ✅ Ahora err se usa aquí
      setError("Error en el inicio de sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="contenedor-Login">
      <h1>Iniciar Sesión</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;

