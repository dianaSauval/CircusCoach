const Formation = require("../models/Formation");

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

// 🔹 Obtener formación por ID
exports.getFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id).populate("modules");
    if (!formation) return res.status(404).json({ error: "Formación no encontrada" });

    res.json(formation);
  } catch (error) {
    console.error("Error obteniendo formación:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Crear una formación con soporte multilenguaje
exports.createFormation = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, description, price } = req.body;

    // Validamos que al menos el título y la descripción en español existan
    if (!title?.es || !description?.es || !price) {
      return res.status(400).json({ error: "El título, descripción en español y precio son obligatorios" });
    }

    const newFormation = new Formation({
      title: {
        es: title.es,
        en: title.en || "", // Opcional
        fr: title.fr || "", // Opcional
      },
      description: {
        es: description.es,
        en: description.en || "",
        fr: description.fr || "",
      },
      price,
      modules: [],
      visible: false, // 🔹 Inicialmente no visible
    });

    await newFormation.save();
    res.status(201).json(newFormation);
  } catch (error) {
    console.error("Error creando formación:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// 🔹 Actualizar una formación (soporta múltiples idiomas y visibilidad)
exports.updateFormation = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { title, description, price, visible } = req.body;
    const { id } = req.params;

    // 🔹 Validamos que exista la formación
    let formation = await Formation.findById(id);
    if (!formation) return res.status(404).json({ error: "Formación no encontrada" });

    // 🔹 Actualizamos solo los campos que se envíen (manteniendo estructura multilenguaje)
    if (title) {
      formation.title = {
        es: title.es || formation.title.es,
        en: title.en !== undefined ? title.en : formation.title.en,
        fr: title.fr !== undefined ? title.fr : formation.title.fr,
      };
    }

    if (description) {
      formation.description = {
        es: description.es || formation.description.es,
        en: description.en !== undefined ? description.en : formation.description.en,
        fr: description.fr !== undefined ? description.fr : formation.description.fr,
      };
    }

    if (price !== undefined) formation.price = price;
    if (visible !== undefined) formation.visible = visible;

    // 🔹 Guardamos los cambios
    const updatedFormation = await formation.save();
    res.json(updatedFormation);

  } catch (error) {
    console.error("Error actualizando formación:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};

// 🔹 Cambiar visibilidad de una formación (solo admins)
exports.toggleFormationVisibility = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const { id } = req.params;

    // 🔹 Buscamos la formación
    const formation = await Formation.findById(id);
    if (!formation) return res.status(404).json({ error: "Formación no encontrada" });

    // 🔹 Alternamos el estado de visibilidad
    formation.visible = !formation.visible;
    await formation.save();

    res.json({ 
      message: `Formación ahora está ${formation.visible ? "visible" : "oculta"}`,
      formation 
    });

  } catch (error) {
    console.error("Error cambiando visibilidad:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};


// 🔹 Eliminar una formación (solo admins)
exports.deleteFormation = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado" });

  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ error: "Formación no encontrada" });

    // 🔹 1. Obtener todos los módulos de la formación
    const modules = await Module.find({ formation: formation._id });

    // 🔹 2. Eliminar todas las clases asociadas a esos módulos
    const moduleIds = modules.map((mod) => mod._id);
    await Class.deleteMany({ module: { $in: moduleIds } });

    // 🔹 3. Eliminar los módulos de la formación
    await Module.deleteMany({ formation: formation._id });

    // 🔹 4. Finalmente, eliminar la formación
    await Formation.findByIdAndDelete(req.params.id);

    res.json({ message: "Formación, módulos y clases eliminados correctamente" });
  } catch (error) {
    console.error("Error eliminando formación:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};