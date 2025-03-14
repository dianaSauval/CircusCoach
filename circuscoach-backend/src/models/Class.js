const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  title: {
    es: { type: String, required: true },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  content: {
    es: { type: String, default: "" },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  fileUrl: { type: String, default: "" }, // ✅ Siempre como cadena vacía por defecto
  videoUrl: { type: String, default: "" }, // ✅ Siempre como cadena vacía por defecto
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true }, // ✅ Relación obligatoria con módulo
  visible: { type: Boolean, default: false }, // 🔹 Control de visibilidad
});

module.exports = mongoose.model("Class", classSchema);



