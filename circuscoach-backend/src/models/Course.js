const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pdfUrl: { type: String },  // URL del PDF en Firebase
  videoUrl: { type: String }, // URL del video en Firebase
  language: { type: String, enum: ["es", "en", "fr"], required: true }, // Idiomas disponibles
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", CourseSchema);
