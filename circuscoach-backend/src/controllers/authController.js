const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Usuario creado con éxito" });
  } catch (error) {
    console.error("❌ ERROR en /register:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("❌ ERROR en /login:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// EXPORTAMOS AMBAS FUNCIONES
module.exports = { register, login };
