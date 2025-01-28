import Estudiante from "../models/Estudiante.js";
import Administrador from "../models/Administrador.js";
import cloudinary from "cloudinary";
import multer from "multer";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import Comunidad from "../models/Comunidad.js";
// Configurar Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta temporal donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Genera un nombre único para la imagen
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de archivo no válido. Solo se permiten imágenes (JPEG, PNG)."
      ),
      false
    );
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo: 5MB
  fileFilter,
}).single("logo"); // Solo permite un archivo llamado "logo"

// Controlador para crear una comunidad
const crearComunidad = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    }

    try {
      const {
        nombre,
        descripcion,
        tipo,
        carreraRelacionada,
        interesesRelacionados,
      } = req.body;

      // Verificar si el usuario es administrador
      if (req.user.rol !== "Administrador") {
        return res
          .status(403)
          .json({ mensaje: "No tienes permisos para crear una comunidad" });
      }

      // Crear una nueva comunidad sin logo inicialmente
      const nuevaComunidad = new Comunidad({
        nombre,
        descripcion,
        tipo,
        carreraRelacionada,
        interesesRelacionados,
        administrador: req.user._id,
      });

      // Subir el logo a Cloudinary si se proporcionó
      if (req.file) {
        try {
          const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "logos_comunidades", // Carpeta en Cloudinary donde se guardarán los logos
          });
          nuevaComunidad.logo = result.secure_url; // Guardar la URL de la imagen en la base de datos

          // Eliminar el archivo temporal después de subirlo a Cloudinary
          fs.unlinkSync(req.file.path);
        } catch (error) {
          // Si falla al subir a Cloudinary, eliminar archivo temporal y retornar error
          fs.unlinkSync(req.file.path);
          return res
            .status(500)
            .json({ msg: "Error al subir el logo a Cloudinary", error });
        }
      }

      // Guardar la comunidad en la base de datos
      await nuevaComunidad.save();
      res.status(201).json(nuevaComunidad);
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: "Hubo un error al crear la comunidad", error });
    }
  });
};

const subirLogo = upload;

// Unirse a una comunidad (Los estudiantes pueden unirse)
const unirseComunidad = async (req, res) => {
  try {
    const comunidadId = req.params.id;
    const estudianteId = req.user._id;

    // Verificar si el estudiante ya está en la comunidad
    const comunidad = await Comunidad.findById(comunidadId);
    if (comunidad.estudiantes.includes(estudianteId)) {
      return res
        .status(400)
        .json({ mensaje: "Ya eres miembro de esta comunidad" });
    }

    // Unir al estudiante a la comunidad
    comunidad.estudiantes.push(estudianteId);
    await comunidad.save();

    res.status(200).json({ mensaje: "Te has unido a la comunidad", comunidad });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Hubo un error al unirse a la comunidad", error });
  }
};

// Obtener información de una comunidad (Los estudiantes pueden verla)
const verComunidad = async (req, res) => {
  try {
    const comunidadId = req.params.id;

    const comunidad = await Comunidad.findById(comunidadId)
      .populate("estudiantes", "nombre usuario fotoPerfil")
      .populate("administrador", "nombre apellido email");
    if (!comunidad) {
      return res.status(404).json({ mensaje: "Comunidad no encontrada" });
    }

    res.status(200).json(comunidad);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Hubo un error al obtener la comunidad", error });
  }
};
export const obtenerComunidades = async (req, res) => {
  try {
    const comunidades = await Comunidad.find();
    res.status(200).json(comunidades);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener comunidades", error });
  }
};
export const actualizarComunidad = async (req, res) => {
  try {
    const { id } = req.params;
    const comunidadActualizada = await Comunidad.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!comunidadActualizada) {
      return res.status(404).json({ msg: "Comunidad no encontrada" });
    }
    res.status(200).json(comunidadActualizada);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la comunidad", error });
  }
};
// Eliminar una comunidad (Solo el administrador puede hacerlo)
const eliminarComunidad = async (req, res) => {
  try {
    const comunidadId = req.params.id;

    // Verificar si el usuario es administrador
    const comunidad = await Comunidad.findById(comunidadId);
    if (
      !comunidad ||
      comunidad.administrador.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para eliminar esta comunidad" });
    }

    await comunidad.remove();
    res.status(200).json({ mensaje: "Comunidad eliminada" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Hubo un error al eliminar la comunidad", error });
  }
};

export {
  crearComunidad,
  subirLogo,
  unirseComunidad,
  verComunidad,
  obtenerComunidades,
  actualizarComunidad,
  eliminarComunidad,
};
