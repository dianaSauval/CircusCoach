import { useState } from "react";
import "../styles/pages/Login.css";
import { requestPasswordReset } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
     await requestPasswordReset(email);
      setMessage("📩 Te enviamos un correo con instrucciones para recuperar tu contraseña.");
    } catch (err) {
      setError(err.response?.data?.error || "Ocurrió un error. Intentalo nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Recuperar contraseña</h1>

      {message && <p className="login-success">{message}</p>}
      {error && <p className="login-error">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Ingresá tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar instrucciones</button>
      </form>
    </div>
  );
}

export default ForgotPassword;

