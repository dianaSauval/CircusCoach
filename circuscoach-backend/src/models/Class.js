const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  title: {
    es: { type: String, required: true },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  subtitle: {
    es: { type: String, default: "" },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  content: {
    es: { type: String, default: "" },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  secondaryContent: {
    es: { type: String, default: "" },
    en: { type: String, default: "" },
    fr: { type: String, default: "" }
  },
  pdf: {
    es: {
      url: { type: String, default: "" }, // URL del PDF en español
      title: { type: String, default: "" }, // Título opcional
      description: { type: String, default: "" } // Descripción opcional
    },
    en: {
      url: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" }
    },
    fr: {
      url: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" }
    }
  },
  video: {
    es: {
      url: { type: String, default: "" }, // URL del video en español
      title: { type: String, default: "" }, // Título opcional
      description: { type: String, default: "" } // Descripción opcional
    },
    en: {
      url: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" }
    },
    fr: {
      url: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" }
    }
  },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true }, // ✅ Relación obligatoria con módulo
  visible: {
    es: { type: Boolean, default: false },
    en: { type: Boolean, default: false },
    fr: { type: Boolean, default: false }
  } // 🔹 Control de visibilidad por idioma
});

module.exports = mongoose.model("Class", classSchema);
