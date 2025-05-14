import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Login.css";
import { registerUser } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.surname.trim()) newErrors.surname = "El apellido es obligatorio.";
    if (!formData.email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo no es válido.";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password = "Debe tener 8 caracteres, una mayúscula, una minúscula y un número.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Repetí la contraseña.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
      setTimeout(() => navigate("/registro-exitoso"), 2000);
    } catch (err) {
      console.error("Error al registrar:", err?.response?.data || err.message);
      setErrors({ general: err?.response?.data?.error || "Hubo un error al registrar. Intentalo nuevamente." });
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Crear cuenta</h1>

      {errors.general && <p className="login-error">{errors.general}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="input-group">
          <input
            type="text"
            name="surname"
            placeholder="Apellido"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          {errors.surname && <p className="field-error">{errors.surname}</p>}
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
