const mongoose = require("mongoose");

const formationSchema = new mongoose.Schema({
  title: {
    es: { type: String, required: true },
    en: { type: String },
    fr: { type: String }
  },
  description: {
    es: { type: String, required: true },
    en: { type: String },
    fr: { type: String }
  },
  price: { type: Number, required: true },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }], // Relación con módulos
  visible: { type: Boolean, default: false }, // 🔹 Control de visibilidad
});

module.exports = mongoose.model("Formation", formationSchema);

