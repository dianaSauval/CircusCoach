const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController"); // ✅ Verifica que el archivo está bien exportado

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

module.exports = router;
