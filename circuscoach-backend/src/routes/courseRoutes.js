const express = require("express");
const {
  getAllCourses,
  getVisibleCoursesByLanguage,
  createCourse,
  updateCourse,
  toggleCourseVisibilityByLanguage,
  deleteCourse,
} = require("../controllers/courseController");
const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Obtener todos los cursos (solo admin)
router.get("/admin", authMiddleware, isAdminMiddleware, getAllCourses);

// 🔹 Obtener cursos visibles por idioma (público)
router.get("/visible", getVisibleCoursesByLanguage);

// 🔹 Crear un nuevo curso (solo admin)
router.post("/", authMiddleware, isAdminMiddleware, createCourse);

// 🔹 Actualizar un curso (solo admin)
router.put("/:id", authMiddleware, isAdminMiddleware, updateCourse);

// Cambiar visibilidad por idioma (admin)
router.patch("/:id/visibility/language", authMiddleware, isAdminMiddleware, toggleCourseVisibilityByLanguage);


// 🔹 Eliminar un curso y sus clases (solo admin)
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteCourse);

module.exports = router;


