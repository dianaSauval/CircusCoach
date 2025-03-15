const Class = require("../models/Class");
const Module = require("../models/Module");

// 🔹 Middleware para verificar si el usuario es admin
const isAdmin = (req) => req.user && req.user.role === "admin";

// 🔹 Obtener todas las clases (para el administrador)
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error obteniendo clases:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


// 🔹 Obtener clases visibles por formación (para alumnos y admin)
const getClassesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const isAdminRequest = req.user && req.user.role === "admin";

    console.log("📩 ID del módulo recibido:", moduleId);
    console.log("👤 Es admin?", isAdminRequest);

    // Verificar si el módulo existe
    const moduleExists = await Module.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ error: "Módulo no encontrado" });
    }

    // Si el usuario no es admin, filtrar solo las clases visibles
    const query = { module: moduleId };
    if (!isAdminRequest) {
      query.$or = [{ "visible.es": true }, { "visible.en": true }, { "visible.fr": true }];
    }

    const classes = await Class.find(query);

    console.log("📤 Clases encontradas:", classes);

    res.status(200).json(classes);
  } catch (error) {
    console.error("❌ Error al obtener clases:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// 🔹 Crear una nueva clase dentro de un módulo
const createClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    console.log("📩 Datos recibidos en el backend:", req.body); // 🔹 Verifica qué datos llegan

    const { title, subtitle, content, secondaryContent, pdf, video, moduleId } = req.body;

    if (!title || !moduleId) {
      return res.status(400).json({ error: "El título y el módulo son obligatorios" });
    }

    const newClass = new Class({
      title,
      subtitle,
      content,
      secondaryContent,
      pdf,
      video,
      module: moduleId,
      visible: { es: false, en: false, fr: false }
    });

    await newClass.save();
    console.log("✅ Clase creada con éxito:", newClass);

    res.status(201).json(newClass);
  } catch (error) {
    console.error("❌ Error en createClass:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// 🔹 Editar una clase
const updateClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.classId, req.body, { new: true });

    if (!updatedClass) return res.status(404).json({ error: "Clase no encontrada" });

    res.json(updatedClass);
  } catch (error) {
    console.error("Error actualizando clase:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Hacer visible una clase en todos los idiomas
const makeClassVisibleInAllLanguages = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const classItem = await Class.findById(req.params.classId);
    if (!classItem) return res.status(404).json({ error: "Clase no encontrada" });

    classItem.visible = { es: true, en: true, fr: true };
    await classItem.save();

    res.json({ message: "Clase ahora es visible en todos los idiomas" });
  } catch (error) {
    console.error("Error cambiando visibilidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Cambiar visibilidad de un idioma específico en una clase
const toggleClassVisibilityByLanguage = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { classId, lang } = req.params;

    // 🔹 Lista de idiomas válidos
    const validLanguages = ["es", "en", "fr"];
    if (!validLanguages.includes(lang)) {
      return res.status(400).json({ error: "Idioma no válido" });
    }

    const classItem = await Class.findById(classId);
    if (!classItem) return res.status(404).json({ error: "Clase no encontrada" });

    // 🔹 Cambiar visibilidad del idioma específico
    classItem.visible[lang] = !classItem.visible[lang];
    await classItem.save();

    res.json({ message: `Clase ahora es ${classItem.visible[lang] ? "visible" : "oculta"} en ${lang}` });
  } catch (error) {
    console.error("Error cambiando visibilidad por idioma:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Eliminar una clase (solo admins)
const deleteClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const classDeleted = await Class.findByIdAndDelete(req.params.classId);
    if (!classDeleted) return res.status(404).json({ error: "Clase no encontrada" });

    res.json({ message: "Clase eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando clase:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  getAllClasses,
  getClassesByModule,
  createClass,
  updateClass,
  makeClassVisibleInAllLanguages,
  toggleClassVisibilityByLanguage,
  deleteClass
};