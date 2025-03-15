const Formation = require("../models/Formation");
const Module = require("../models/Module");
const Class = require("../models/Class");

// 🔹 Middleware para verificar si el usuario es admin
const isAdmin = (req) => req.user && req.user.role === "admin";


// 🔹 Obtener formaciones (solo las visibles para alumnos)
exports.getFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ visible: true }).populate("modules");
    res.json(formations);
  } catch (error) {
    console.error("Error obteniendo formaciones:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Obtener todas las formaciones (para el administrador)
exports.getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.find().populate("modules");
    res.json(formations);
  } catch (error) {
    console.error("Error obteniendo formaciones:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


// 🔹 Crear una formación con soporte multilenguaje
exports.createFormation = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, description, price } = req.body;

    // 🔹 Validar que al menos el título y descripción en español estén presentes
    if (!title?.es || !description?.es || !price) {
      return res.status(400).json({ error: "Título en español, descripción y precio son obligatorios" });
    }

    // 🔹 Crear la formación con los datos recibidos
    const newFormation = new Formation({
      title: {
        es: title.es,
        en: title.en || "",
        fr: title.fr || "",
      },
      description: {
        es: description.es,
        en: description.en || "",
        fr: description.fr || "",
      },
      price,
      modules: [], // 🔹 Inicialmente sin módulos
      visible: {
        es: false, // 🔹 No visible hasta que se active
        en: false,
        fr: false,
      },
    });

    await newFormation.save();
    res.status(201).json(newFormation);
  } catch (error) {
    console.error("❌ ERROR en createFormation:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};
// 🔹 Actualizar una formación (soporta múltiples idiomas y visibilidad)
exports.updateFormation = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, description, price, visible } = req.body;
    const { id } = req.params;

    // 🔹 Verificar si la formación existe
    const formation = await Formation.findById(id);
    if (!formation) {
      return res.status(404).json({ error: "Formación no encontrada" });
    }

    // 🔹 Actualizar solo los campos enviados (sin sobreescribir valores no enviados)
    if (title) {
      formation.title.es = title.es ?? formation.title.es;
      formation.title.en = title.en ?? formation.title.en;
      formation.title.fr = title.fr ?? formation.title.fr;
    }

    if (description) {
      formation.description.es = description.es ?? formation.description.es;
      formation.description.en = description.en ?? formation.description.en;
      formation.description.fr = description.fr ?? formation.description.fr;
    }

    if (price !== undefined) {
      formation.price = price;
    }

    if (visible) {
      formation.visible.es = visible.es ?? formation.visible.es;
      formation.visible.en = visible.en ?? formation.visible.en;
      formation.visible.fr = visible.fr ?? formation.visible.fr;
    }

    await formation.save();

    res.status(200).json({ message: "Formación actualizada correctamente", formation });
  } catch (error) {
    console.error("❌ ERROR en updateFormation:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};


// 🔹 Poner visibles TODOS los idiomas
exports.makeFormationVisibleInAllLanguages = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;

    const formation = await Formation.findById(id);
    if (!formation) return res.status(404).json({ error: "Formación no encontrada" });

    // 🔄 Hacer visible en todos los idiomas
    formation.visible = { es: true, en: true, fr: true };

    await formation.save();

    res.json({
      message: "Formación ahora es visible en todos los idiomas.",
    });
  } catch (error) {
    console.error("Error haciendo visible en todos los idiomas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Cambiar visibilidad de un solo idioma 
exports.toggleFormationVisibilityByLanguage = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;
    const { language } = req.body; // 📌 El frontend debe enviar el idioma a modificar

    if (!["es", "en", "fr"].includes(language)) {
      return res.status(400).json({ error: "Idioma no válido" });
    }

    const formation = await Formation.findById(id);
    if (!formation) return res.status(404).json({ error: "Formación no encontrada" });

    // 🔄 Alternar visibilidad del idioma especificado
    formation.visible[language] = !formation.visible[language];

    await formation.save();

    res.json({
      message: `Formación en ${language.toUpperCase()} ahora es ${formation.visible[language] ? "visible" : "oculta"}`,
    });
  } catch (error) {
    console.error("Error cambiando visibilidad por idioma:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};



// 🔹 Eliminar una formación (solo admins)
exports.deleteFormation = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ error: "Formación no encontrada" });
    }

    // 🔹 Buscar los módulos asociados a la formación
    const modules = await Module.find({ formation: formation._id });

    // 🔹 Eliminar todas las clases asociadas a esos módulos
    const moduleIds = modules.map((mod) => mod._id);
    await Class.deleteMany({ module: { $in: moduleIds } });

    // 🔹 Luego, eliminar los módulos
    await Module.deleteMany({ formation: formation._id });

    // 🔹 Finalmente, eliminar la formación
    await Formation.findByIdAndDelete(req.params.id);

    res.json({ message: "Formación, módulos y clases eliminados correctamente" });
  } catch (error) {
    console.error("❌ ERROR en deleteFormation:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};