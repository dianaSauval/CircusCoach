const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, surname, email, password, role } = req.body;

    // ✅ Validar que todos los campos requeridos estén presentes
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // 🔎 Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // 🔒 Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ✅ Asignar el rol, por defecto "user" si no se especifica
    const userRole = role || "user";

    // 📌 Crear usuario con los campos correctos
    user = new User({
      name,
      surname, // Se incluye el apellido
      email,
      password: hashedPassword,
      role: userRole, 
    });

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

    // 🔑 Generar JWT con el ID y el rol del usuario
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
