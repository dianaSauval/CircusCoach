const User = require("../models/User");

// Obtener todos los usuarios (solo admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Crear un usuario
const createUser = async (req, res) => {
  try {
    const { name, surname, email, password, role } = req.body;

    // 🔹 Validar que los campos obligatorios estén presentes
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // 🔹 Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Si no se especifica un rol, asignar "user" por defecto
    const userRole = role || "user";

    // 🔹 Crear el nuevo usuario con la contraseña encriptada
    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword, // Guardar la contraseña encriptada
      role: userRole,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario creado con éxito", user: newUser });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// Editar un usuario
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Eliminar un usuario (solo admin)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Exportamos correctamente en CommonJS
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
