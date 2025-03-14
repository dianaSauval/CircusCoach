const express = require("express");
const {
  getAllClasses,
  getClassesByModule,
  createClass,
  updateClass,
  toggleClassVisibility,
  deleteClass,
} = require("../controllers/classController");

const { authMiddleware, isAdminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Verificar si los controladores están bien importados
console.log("🛠️ Controllers importados en classRoutes:", {
  getAllClasses,
  getClassesByModule,
  createClass,
  updateClass,
  toggleClassVisibility,
  deleteClass,
});

// 🔹 Obtener todas las clases (solo admin)
router.get("/admin", authMiddleware, isAdminMiddleware, getAllClasses);

// 🔹 Obtener clases visibles por módulo (para alumnos)
router.get("/:moduleId", getClassesByModule);

// 🔹 Crear una nueva clase (solo admin)
router.post("/", authMiddleware, isAdminMiddleware, createClass);

// 🔹 Editar una clase (solo admin)
router.put("/:classId", authMiddleware, updateClass);

// 🔹 Cambiar visibilidad de una clase (solo admin)
router.patch("/:classId/visibility", authMiddleware, toggleClassVisibility);

// 🔹 Eliminar una clase (solo admin)
router.delete("/:classId", authMiddleware, isAdminMiddleware, deleteClass);

module.exports = router;

