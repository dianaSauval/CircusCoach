// src/pages/RegisterSuccess.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/pages/RegisterSuccess.css";

function RegisterSuccess() {
  return (
    <div className="register-success-container">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ¡Registro exitoso! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Bienvenido a <strong>CircusCoach</strong>.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Tu viaje de aprendizaje circense comienza ahora.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/login" className="success-button">
            Iniciar sesión
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RegisterSuccess;

