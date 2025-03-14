const Class = require("../models/Class");

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


// 🔹 Obtener clases visibles de un módulo (para alumnos)
const getClassesByModule = async (req, res) => {
  try {
    const classes = await Class.find({ module: req.params.moduleId, visible: true });
    res.json(classes);
  } catch (error) {
    console.error("Error obteniendo clases:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Crear una nueva clase dentro de un módulo
const createClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, content, fileUrl, videoUrl, moduleId } = req.body;

    const newClass = new Class({
      title: {
        es: title.es || "",
        en: title.en || "",
        fr: title.fr || "",
      },
      content: {
        es: content.es || "",
        en: content.en || "",
        fr: content.fr || "",
      },
      fileUrl: fileUrl || "",
      videoUrl: videoUrl || "",
      module: moduleId,
      visible: false, // 🔹 Por defecto oculta
    });

    await newClass.save();
    await Module.findByIdAndUpdate(moduleId, { $push: { classes: newClass._id } });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creando clase:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Editar una clase
const updateClass = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, content, fileUrl, videoUrl } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.classId,
      {
        title: {
          es: title.es || "",
          en: title.en || "",
          fr: title.fr || "",
        },
        content: {
          es: content.es || "",
          en: content.en || "",
          fr: content.fr || "",
        },
        fileUrl: fileUrl || "",
        videoUrl: videoUrl || "",
      },
      { new: true }
    );

    if (!updatedClass) return res.status(404).json({ error: "Clase no encontrada" });

    res.json(updatedClass);
  } catch (error) {
    console.error("Error actualizando clase:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Cambiar visibilidad de una clase
const toggleClassVisibility = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const classItem = await Class.findById(req.params.classId);
    if (!classItem) return res.status(404).json({ error: "Clase no encontrada" });

    classItem.visible = !classItem.visible;
    await classItem.save();

    res.json({ message: `Clase ${classItem.visible ? "visible" : "oculta"}` });
  } catch (error) {
    console.error("Error cambiando visibilidad:", error);
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
  toggleClassVisibility,
  deleteClass
};