const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController"); // Asegurate de importar correctamente los controladores

const { authMiddleware } = require("../middlewares/authMiddleware"); // Middleware de autenticación

const router = express.Router();

router.post("/", authMiddleware, createCourse); // Crear un curso (solo usuarios autenticados)
router.get("/", getCourses); // Obtener todos los cursos
router.get("/:id", getCourseById); // Obtener un curso por ID
router.put("/:id", authMiddleware, updateCourse); // Editar un curso (solo usuarios autenticados)
router.delete("/:id", authMiddleware, deleteCourse); // Eliminar un curso (solo usuarios autenticados)

module.exports = router;

