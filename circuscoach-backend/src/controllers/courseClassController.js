const CourseClass = require("../models/CourseClass");
const Course = require("../models/Course");

const isAdmin = (req) => req.user && req.user.role === "admin";

// 🔹 Obtener todas las clases visibles por idioma (público)
exports.getVisibleCourseClassesByLanguage  = async (req, res) => {
  const lang = req.query.lang || "es";

  if (!["es", "en", "fr"].includes(lang)) {
    return res.status(400).json({ error: "Idioma no válido" });
  }

  try {
    const classes = await CourseClass.find({ [`visible.${lang}`]: true });
    res.json(classes);
  } catch (error) {
    console.error("Error obteniendo clases visibles:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Obtener todas las clases (solo admin)
exports.getAllCourseClasses = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const classes = await CourseClass.find();
    res.json(classes);
  } catch (error) {
    console.error("Error obteniendo todas las clases:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Crear una clase (solo admin)
exports.createCourseClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { course } = req.body;

    // ✅ Validar que exista un curso con ese ID
    const existingCourse = await Course.findById(course);
    if (!existingCourse) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Crear la clase
    const newClass = new CourseClass(req.body);
    await newClass.save();

    // Asociar la clase al curso
    existingCourse.classes.push(newClass._id);
    await existingCourse.save();

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creando clase:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};



// 🔹 Editar una clase (solo admin)
exports.updateCourseClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;
    const updated = await CourseClass.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Clase no encontrada" });

    res.json(updated);
  } catch (error) {
    console.error("Error actualizando clase:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Eliminar una clase (solo admin)
exports.deleteCourseClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;
    const deleted = await CourseClass.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Clase no encontrada" });

    // También eliminar la referencia en el curso
    await Course.findByIdAndUpdate(deleted.course, {
      $pull: { classes: deleted._id },
    });

    res.json({ message: "Clase eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando clase:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Cambiar visibilidad por idioma (solo admin)
exports.toggleCourseClassVisibilityByLanguage = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id, lang } = req.params;

    if (!["es", "en", "fr"].includes(lang)) {
      return res.status(400).json({ error: "Idioma no válido" });
    }

    const courseClass = await CourseClass.findById(id);
    if (!courseClass)
      return res.status(404).json({ error: "Clase no encontrada" });

    courseClass.visible[lang] = !courseClass.visible[lang];
    await courseClass.save();

    res.json({
      message: `Clase en ${lang.toUpperCase()} ahora está ${
        courseClass.visible[lang] ? "visible" : "oculta"
      }`,
    });
  } catch (error) {
    console.error("Error cambiando visibilidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
