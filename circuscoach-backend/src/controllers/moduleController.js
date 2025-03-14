const Module = require("../models/Module");
const Formation = require("../models/Formation");
const Class = require("../models/Class");

// 🔹 Middleware para verificar si el usuario es admin
const isAdmin = (req) => req.user && req.user.role === "admin";

// 🔹 Obtener todos los módulos (para el administrador)
const getAllModules = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const modules = await Module.find().populate("classes");
    res.status(200).json(modules);
  } catch (error) {
    console.error("❌ Error al obtener módulos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Obtener módulos visibles por formación (para alumnos)
const getModulesByFormation = async (req, res) => {
  try {
    const modules = await Module.find({ formation: req.params.formationId, visible: true })
      .populate("classes");

    res.status(200).json(modules);
  } catch (error) {
    console.error("❌ Error al obtener módulos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Crear un nuevo módulo
const createModule = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, description, formationId } = req.body;

    if (!title || !formationId) {
      return res.status(400).json({ error: "El título y la formación son obligatorios" });
    }

    const newModule = new Module({
      title: {
        es: title.es || "",
        en: title.en || "",
        fr: title.fr || ""
      },
      description: {
        es: description?.es || "",
        en: description?.en || "",
        fr: description?.fr || ""
      },
      formation: formationId,
      classes: [], // 🔹 Se inicializa vacío
      visible: false // 🔹 Por defecto, no es visible
    });

    await newModule.save();
    await Formation.findByIdAndUpdate(formationId, { $push: { modules: newModule._id } });

    res.status(201).json(newModule);
  } catch (error) {
    console.error("❌ Error al crear módulo:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Editar un módulo
const updateModule = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, description } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.moduleId,
      {
        title: {
          es: title?.es || "",
          en: title?.en || "",
          fr: title?.fr || ""
        },
        description: {
          es: description?.es || "",
          en: description?.en || "",
          fr: description?.fr || ""
        }
      },
      { new: true }
    );

    if (!updatedModule) return res.status(404).json({ error: "Módulo no encontrado" });

    res.status(200).json(updatedModule);
  } catch (error) {
    console.error("❌ Error al actualizar módulo:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Cambiar visibilidad de un módulo
const toggleModuleVisibility = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ error: "Módulo no encontrado" });

    module.visible = !module.visible;
    await module.save();

    res.json({ message: `✅ Módulo ${module.visible ? "visible" : "oculto"}` });
  } catch (error) {
    console.error("❌ Error cambiando visibilidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Eliminar un módulo y sus clases (solo admins)
const deleteModule = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { moduleId } = req.params;

    // ✅ Verificar si el módulo existe
    const moduleToDelete = await Module.findById(moduleId);
    if (!moduleToDelete) {
      return res.status(404).json({ error: "Módulo no encontrado" });
    }

    // ✅ Eliminar todas las clases asociadas al módulo
    await Class.deleteMany({ module: moduleId });

    // ✅ Eliminar el módulo
    await Module.findByIdAndDelete(moduleId);

    res.status(200).json({ message: "✅ Módulo y sus clases eliminados correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando módulo:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// 🔹 Exportamos correctamente en CommonJS
module.exports = {
  getAllModules,
  getModulesByFormation,
  createModule,
  updateModule,
  toggleModuleVisibility,
  deleteModule
};
