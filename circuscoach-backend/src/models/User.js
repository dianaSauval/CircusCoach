const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },

  // ✅ Recuperación de contraseña
  resetToken: { type: String },
  resetTokenExpire: { type: Date },

  // ✅ Cursos comprados (opcional pero útil para control de acceso)
  cursosComprados: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Formation" }
  ],

  // ✅ Progreso por curso
  progresoCursos: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Formation" },
      clasesCompletadas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }]
    }
  ]
});

module.exports = mongoose.model("User", userSchema);

