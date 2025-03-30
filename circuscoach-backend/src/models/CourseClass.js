const mongoose = require("mongoose");

const courseClassSchema = new mongoose.Schema({
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
      url: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" }
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
      url: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" }
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
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  visible: {
    es: { type: Boolean, default: false },
    en: { type: Boolean, default: false },
    fr: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model("CourseClass", courseClassSchema);
