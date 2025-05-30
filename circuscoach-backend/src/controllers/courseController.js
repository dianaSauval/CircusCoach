const Course = require("../models/Course");
const CourseClass = require("../models/CourseClass");

const isAdmin = (req) => req.user && req.user.role === "admin";

// 🔹 Obtener todos los cursos (admin)
exports.getAllCourses = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const courses = await Course.find().populate("classes");
    res.json(courses);
  } catch (error) {
    console.error("Error obteniendo cursos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Obtener cursos visibles por idioma (alumnos)
exports.getVisibleCoursesByLanguage = async (req, res) => {
  const lang = req.query.lang || "es";

  if (!["es", "en", "fr"].includes(lang)) {
    return res.status(400).json({ error: "Idioma no válido" });
  }

  try {
    const courses = await Course.find({ [`visible.${lang}`]: true }).populate("classes");
    res.json(courses);
  } catch (error) {
    console.error("Error obteniendo cursos visibles:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Obtener curso por ID y filtrar por idioma
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "es";

  try {
    const course = await Course.findById(id).populate("classes");

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Verificar visibilidad en el idioma
    if (!course.visible?.[lang]) {
      return res.status(403).json({ error: "Curso no disponible en este idioma" });
    }

    // Filtrar clases visibles por idioma
    const clasesFiltradas = course.classes.filter(
      (cl) => cl.visible?.[lang]
    );

    res.json({
      _id: course._id,
      title: course.title?.[lang] || "",
      description: course.description?.[lang] || "",
      image: course.image?.[lang] || "",
      video: course.video?.[lang] || "",
      pdf: course.pdf?.[lang] || "",
      visible: course.visible,
      price: course.price,
      classes: clasesFiltradas,
    });
  } catch (error) {
    console.error("Error al obtener curso por ID:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};




// 🔹 Crear un curso (admin)
exports.createCourse = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, description, price, image, pdf, video } = req.body;

    if (!title?.es || !description?.es || !price) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newCourse = new Course({
      title,
      description,
      price,
      image,
      pdf,
      video,
      classes: [],
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error al crear curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Actualizar un curso (admin)
exports.updateCourse = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;
    const updatedData = req.body;

    const course = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔄 Cambiar visibilidad de un curso por idioma
exports.toggleCourseVisibilityByLanguage = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;
    const { language } = req.body;

    if (!["es", "en", "fr"].includes(language)) {
      return res.status(400).json({ error: "Idioma no válido" });
    }

    const course = await Course.findById(id);
    if (!course)
      return res.status(404).json({ error: "Curso no encontrado" });

    course.visible[language] = !course.visible[language];
    await course.save({ validateBeforeSave: false }); // 👈 Aca está la clave

    res.json({
      message: `Curso en ${language.toUpperCase()} ahora está ${
        course.visible[language] ? "visible" : "oculto"
      }`,
    });
  } catch (error) {
    console.error("Error al cambiar visibilidad del curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


// 🔹 Eliminar un curso y sus clases (admin)
exports.deleteCourse = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // 🔹 Eliminar las clases asociadas al curso (usando su array de referencias)
    await CourseClass.deleteMany({ _id: { $in: course.classes } });

    // 🔹 Eliminar el curso
    await Course.findByIdAndDelete(id);

    res.json({ message: "Curso y clases asociadas eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
