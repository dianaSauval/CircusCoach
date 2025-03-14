const Course = require("../models/Course"); // Asegurate de importar el modelo

// Obtener todos los cursos
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error obteniendo cursos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener un curso por ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Curso no encontrado" });

    res.json(course);
  } catch (error) {
    console.error("Error obteniendo curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Crear un nuevo curso
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const newCourse = new Course({
      title,
      description,
      price,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creando curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Editar un curso
exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedCourse) return res.status(404).json({ error: "Curso no encontrado" });

    res.json(updatedCourse);
  } catch (error) {
    console.error("Error actualizando curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Eliminar un curso
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Curso no encontrado" });

    res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando curso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
