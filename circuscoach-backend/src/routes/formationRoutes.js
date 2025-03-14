const express = require("express");
const {
  getFormations,
  getAllFormations,
  getFormationById,
  createFormation,
  updateFormation,
  toggleFormationVisibility,
  deleteFormation
} = require("../controllers/formationController");

const { authMiddleware, isAdminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Obtener formaciones visibles para los alumnos
router.get("/", getFormations);

// 🔹 Obtener TODAS las formaciones (solo admin)
router.get("/admin", authMiddleware, isAdminMiddleware, getAllFormations);

// 🔹 Obtener una formación por ID
router.get("/:id", getFormationById);

// 🔹 Crear una formación (solo admin)
router.post("/", authMiddleware, isAdminMiddleware, createFormation);

// 🔹 Editar una formación (solo admin)
router.put("/:id", authMiddleware, isAdminMiddleware, updateFormation);

// 🔹 Cambiar visibilidad de una formación (solo admin)
router.patch("/:id/visibility", authMiddleware, isAdminMiddleware, toggleFormationVisibility);

// 🔹 Eliminar una formación (solo admin)
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteFormation);

module.exports = router;
