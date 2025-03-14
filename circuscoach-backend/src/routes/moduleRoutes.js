const express = require("express");
const {
  getAllModules,
  getModulesByFormation,
  createModule,
  updateModule,
  toggleModuleVisibility,
  deleteModule,
} = require("../controllers/moduleController");

const { authMiddleware, isAdminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Verificar si los controladores están bien importados
console.log("🛠️ Controllers importados:", {
  getAllModules,
  getModulesByFormation,
  createModule,
  updateModule,
  toggleModuleVisibility,
  deleteModule,
});

// 🔹 Obtener todos los módulos (solo admin)
router.get("/admin", authMiddleware, isAdminMiddleware, getAllModules);

// 🔹 Obtener módulos visibles de una formación
router.get("/:formationId", getModulesByFormation);

// 🔹 Crear un módulo (solo admin)
router.post("/", authMiddleware, isAdminMiddleware, createModule);

// 🔹 Editar un módulo (solo admin)
router.put("/:moduleId", authMiddleware, updateModule);

// 🔹 Cambiar visibilidad de un módulo (solo admin)
router.patch("/:moduleId/visibility", authMiddleware, toggleModuleVisibility);

// 🔹 Eliminar un módulo (solo admin)
router.delete("/:moduleId", authMiddleware, isAdminMiddleware, deleteModule);

module.exports = router;
