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
  visible: {
    es: { type: Boolean, default: false },
    en: { type: Boolean, default: false },
    fr: { type: Boolean, default: false }
  }, 
});

module.exports = mongoose.model("Formation", formationSchema);

