const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Habilita CORS para evitar bloqueos
app.use(express.json()); // Habilita JSON en las peticiones

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ VERIFICA ESTE NOMBRE
const formationRoutes = require("./routes/formationRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const classRoutes = require("./routes/classRoutes");
const courseRoutes = require("./routes/courseRoutes");
const courseClassRoutes = require("./routes/courseClassRoutes");
const presentialRoutes = require('./routes/presentialFormationsRoutes');
const pagosRoutes = require("./routes/pagosRoutes");

// Configuración de rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-classes", courseClassRoutes);
app.use('/api/presential-formations', presentialRoutes);
app.use("/api/pagos", pagosRoutes); 

// Ruta de prueba para verificar el estado del servidor
app.get("/", (req, res) => {
  res.send("🚀 API de CircusCoach funcionando correctamente");
});

// Asegurarse de que el servidor escuche en el puerto correcto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
