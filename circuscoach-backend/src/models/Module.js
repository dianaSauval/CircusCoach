const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: {
    es: { type: String, required: true },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  description: {
    es: { type: String, default: "" },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation", required: true }, // 🔹 Ahora es obligatorio
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class", default: [] }], // 🔹 Se inicializa vacío
  visible: { type: Boolean, default: false } // 🔹 Control de visibilidad
});

module.exports = mongoose.model("Module", moduleSchema);



