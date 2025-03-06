const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // 👈 Protegemos la ruta

const router = express.Router();

router.get("/perfil", authMiddleware, (req, res) => {
  res.json({ message: "Accediste a una ruta protegida", user: req.user });
});

module.exports = router;
