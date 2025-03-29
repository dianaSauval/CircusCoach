import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/pages/Login.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
      });
      setSuccess("Usuario creado con éxito. Ya podés iniciar sesión.");
      setFormData({ name: "", surname: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
        console.error("Error al registrar:", err?.response?.data || err.message);
        setError(err?.response?.data?.error || "Hubo un error al registrar. Intentalo nuevamente.");
      }
      
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Crear cuenta</h1>

      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Apellido"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Repetir contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
