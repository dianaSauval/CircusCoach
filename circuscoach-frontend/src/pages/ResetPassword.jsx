import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/pages/Login.css";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "La nueva contraseña es obligatoria.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      newErrors.password =
        "Debe tener 8 caracteres, una mayúscula, una minúscula y un número.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Repetí la contraseña.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
        await resetPassword(token, password);
        setSuccess("Contraseña actualizada con éxito. Ya podés iniciar sesión.");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        const message =
          err?.response?.data?.error || "Ocurrió un error al restablecer la contraseña.";
        setErrors({ general: message });
      }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Nueva contraseña</h1>

      {success && <p className="login-success">{success}</p>}
      {errors.general && <p className="login-error">{errors.general}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit">Restablecer</button>
      </form>
    </div>
  );
}

export default ResetPassword;
