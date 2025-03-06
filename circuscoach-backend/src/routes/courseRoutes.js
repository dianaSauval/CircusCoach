const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Ruta de cursos funcionando!");
});

module.exports = router;
