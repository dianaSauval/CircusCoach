const express = require('express');
const router = express.Router();

const {
  getAllPresentialFormations,
  createPresentialFormation,
  updatePresentialFormation,
  deletePresentialFormation
} = require('../controllers/presentialFormationController');

const { authMiddleware, isAdminMiddleware } = require("../middlewares/authMiddleware");

// 📌 Rutas públicas
router.get('/', getAllPresentialFormations);

// 📌 Rutas solo para admin
router.post('/', authMiddleware, isAdminMiddleware, createPresentialFormation);
router.put('/:id', authMiddleware, isAdminMiddleware, updatePresentialFormation);
router.delete('/:id', authMiddleware, isAdminMiddleware, deletePresentialFormation);

module.exports = router;
