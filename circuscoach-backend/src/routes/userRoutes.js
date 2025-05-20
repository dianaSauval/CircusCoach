const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  marcarClaseComoCompletada,
  obtenerProgresoDelCurso,
  comprarCurso,
} = require("../controllers/userController");

const { authMiddleware, isAdminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Obtener todos los usuarios (solo admin)
router.get("/", authMiddleware, isAdminMiddleware, getUsers);

// 🔹 Obtener usuario por ID
router.get("/:id", authMiddleware, getUserById);

// 🔹 Crear usuario
router.post("/", createUser);

// 🔹 Editar usuario
router.put("/:id", authMiddleware, updateUser);

// 🔹 Eliminar usuario (solo admin)
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteUser);

// 🔹 Marcar clase como completada
router.post("/:id/progreso/:courseId", authMiddleware, marcarClaseComoCompletada);

// 🔹 Obtener progreso de un curso
router.get("/:id/progreso/:courseId", authMiddleware, obtenerProgresoDelCurso);

// 🔹 Comprar curso (opcional)
router.post("/:id/comprar/:courseId", authMiddleware, comprarCurso);

module.exports = router;
