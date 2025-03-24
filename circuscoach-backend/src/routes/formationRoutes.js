const express = require("express");
const {
  getFormations,
  getAllFormations,
  getFormationsByMode,
  createFormation,
  updateFormation,
  makeFormationVisibleInAllLanguages,
  toggleFormationVisibilityByLanguage,
  deleteFormation
} = require("../controllers/formationController");

const { authMiddleware, isAdminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Obtener TODAS las formaciones (solo admin)
router.get("/admin", authMiddleware, isAdminMiddleware, getAllFormations);

// 🔹 Cambiar visibilidad en todos los lenguajes (solo admin)
router.patch("/:id/visibility/all", authMiddleware, isAdminMiddleware, makeFormationVisibleInAllLanguages);

// 🔹 Cambiar visibilidad de un solo lenguaje (solo admin)
router.patch("/:id/visibility/language", authMiddleware, isAdminMiddleware, toggleFormationVisibilityByLanguage);

// 🔹 Editar una formación (solo admin)
router.put("/:id", authMiddleware, isAdminMiddleware, updateFormation);

// 🔹 Eliminar una formación (solo admin)
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteFormation);

// 🔹 Crear una formación (solo admin)
router.post("/", authMiddleware, isAdminMiddleware, createFormation);

// 🔹 Obtener formaciones por modo (presencial u online) con lang
router.get("/:mode", getFormationsByMode);

// 🔹 Obtener formaciones visibles para alumnos (pública)
router.get("/", getFormations);

module.exports = router;

