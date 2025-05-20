const User = require("../models/User");

const bcrypt = require("bcrypt");

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

    if (!name || !surname || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Ya existe una cuenta con ese correo electrónico" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "user";

    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      role: userRole,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Usuario creado con éxito", user: newUser });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({
      error: "Error en el servidor",
      details: error.message,
    });
  }
};

// Editar un usuario
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser)
      return res.status(404).json({ error: "Usuario no encontrado" });

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
    if (!deletedUser)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Marcar clase como completada
const marcarClaseComoCompletada = async (req, res) => {
  const { id, courseId } = req.params;
  const { classId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Buscar el curso en progresoCursos
    let curso = user.progresoCursos.find(
      (p) => p.courseId.toString() === courseId
    );

    if (!curso) {
      // Si no existe, agregarlo
      user.progresoCursos.push({
        courseId,
        clasesCompletadas: [classId],
      });
    } else {
      // Si existe, evitar duplicado
      if (!curso.clasesCompletadas.includes(classId)) {
        curso.clasesCompletadas.push(classId);
      }
    }

    await user.save();
    res.json({
      message: "Clase marcada como completada",
      progreso: user.progresoCursos,
    });
  } catch (error) {
    console.error("Error marcando clase completada:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener progreso del usuario en una formación
const obtenerProgresoDelCurso = async (req, res) => {
  const { id, courseId } = req.params;

  try {
    const user = await User.findById(id).populate(
      "progresoCursos.clasesCompletadas"
    );
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const progreso = user.progresoCursos.find(
      (p) => p.courseId.toString() === courseId
    );

    res.json(progreso || { courseId, clasesCompletadas: [] });
  } catch (error) {
    console.error("Error obteniendo progreso:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Agregar curso a cursosComprados (opcional)
const comprarCurso = async (req, res) => {
  const { id, courseId } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (!user.cursosComprados.includes(courseId)) {
      user.cursosComprados.push(courseId);
      await user.save();
    }

    res.json({
      message: "Curso agregado a cursos comprados",
      cursos: user.cursosComprados,
    });
  } catch (error) {
    console.error("Error comprando curso:", error);
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
  marcarClaseComoCompletada,
  obtenerProgresoDelCurso,
  comprarCurso,
};
