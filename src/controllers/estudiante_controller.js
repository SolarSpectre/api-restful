// IMPORTAR EL MODELO
import Estudiante from "../models/Estudiante.js";
import cloudinary from "cloudinary";
import multer from "multer";
import jwt from "jsonwebtoken";
import fs from "fs";
// IMPORTAR EL MÉTODO sendMailToPaciente
import { sendMailToEstudiante } from "../config/nodemailer.js";

import mongoose from "mongoose";
import generarJWT from "../helpers/crearJWT.js";

// Configurar Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta temporal donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Genera un nombre único para la imagen
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo: 5MB
  fileFilter,
}).single("fotoPerfil"); // Solo permite una foto de perfil

// Método para el proceso de login
const loginEstudiante = async (req, res) => {
  const { email, password } = req.body;

  // Validar que todos los campos estén llenos
  if (Object.values(req.body).includes("")) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  // Buscar el estudiante en la base de datos por email
  const estudianteBDD = await Estudiante.findOne({ email });

  // Verificar si el estudiante existe
  if (!estudianteBDD) {
    return res
      .status(404)
      .json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  }

  // Verificar el password
  const verificarPassword = await estudianteBDD.matchPassword(password);

  if (!verificarPassword) {
    return res
      .status(401)
      .json({ msg: "Lo sentimos, el password no es correcto" });
  }

  // Generar el token JWT
  const token = generarJWT(estudianteBDD._id, "Estudiante");

  // Desestructurar los datos necesarios del estudiante
  const {
    nombre,
    usuario,
    email: emailEstudiante,
    fotoPerfil,
    universidad,
    _id,
    rol,
  } = estudianteBDD;

  // Enviar la respuesta con el token y los datos del estudiante
  res.status(200).json({
    token,
    _id,
    nombre,
    usuario,
    email: emailEstudiante,
    fotoPerfil,
    universidad,
    rol,
  });
};

// Controlador para registrar un estudiante
const registrarEstudiante = async (req, res) => {
  // Desestructurar los campos necesarios
  const { email, usuario, password } = req.body;
  const validDomains = ["@puce.edu.ec", "@epn.edu.ec", "@ups.edu.ec"];
  // Validar que todos los campos estén llenos
  if (Object.values(req.body).includes(null)) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  if (!validDomains.some((domain) => email.includes(domain))) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes ingresar un correo válido" });
  }

  // Verificar si el estudiante ya está registrado
  const verificarEmailBDD = await Estudiante.findOne({ email });
  const verificarUsuarioBDD = await Estudiante.findOne({ usuario });

  if (verificarEmailBDD) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, el email ya está registrado" });
  }

  if (verificarUsuarioBDD) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, el usuario ya está registrado" });
  }

  // Crear una instancia del estudiante
  const nuevoEstudiante = new Estudiante(req.body);

  // Encriptar el password
  nuevoEstudiante.password = await nuevoEstudiante.encrypPassword(
    "estud" + password
  );

  // Subir la foto de perfil a Cloudinary si se ha proporcionado
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "estudiantes_perfil", // Carpeta en Cloudinary donde se guardarán las fotos
      });
      nuevoEstudiante.fotoPerfil = {
        url: result.secure_url,
        public_id: result.public_id,
      };
      fs.unlinkSync(req.file.path);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Error al subir la foto de perfil a Cloudinary" });
    }
  }

  // Enviar el correo electrónico
  await sendMailToEstudiante(email, "estud" + password);

  // Guardar en la base de datos
  await nuevoEstudiante.save();

  // Presentar resultados
  res.status(200).json({ msg: "Registro exitoso y correo enviado" });
};

// Middleware para manejar la subida de fotos
const subirFotoPerfil = upload;
// Método para ver el perfil del estudiante
const perfilEstudiante = async (req, res) => {
  const { id, rol } = jwt.verify(
    req.headers.authorization.split(" ")[1],
    process.env.JWT_SECRET
  );
  if (rol !== "Estudiante")
    return res
      .status(404)
      .json({ msg: "No tienes permisos para realizar esta acción" });
  const estudianteBDD = await Estudiante.findById(id);
  const token = generarJWT(estudianteBDD._id, rol);
  // Desestructurar los datos necesarios del estudiante
  const {
    nombre,
    usuario,
    email,
    fotoPerfil,
    universidad,
    _id,
    celular,
    carrera,
    bio,
    intereses,
  } = estudianteBDD;

  // Enviar la respuesta con el token y los datos del estudiante
  res.status(200).json({
    token,
    _id,
    nombre,
    usuario,
    email,
    fotoPerfil,
    universidad,
    rol,
    celular,
    carrera,
    bio,
    intereses,
  });
};

// Método para actualizar un estudiante (incluyendo la imagen de perfil)
const actualizarEstudiante = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;

  if (Object.values(body).includes("")) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el estudiante con ID ${id}` });
  }

  try {
    const estudiante = await Estudiante.findById(id);
    if (!estudiante) {
      return res.status(404).json({ msg: "Estudiante no encontrado" });
    }

    // Si hay una imagen nueva, subirla a Cloudinary
    if (file) {
      if (estudiante.fotoPerfil?.public_id) {
        // Eliminar la imagen anterior de Cloudinary
        await cloudinary.v2.uploader.destroy(estudiante.fotoPerfil.public_id);
      }

      // Subir la nueva imagen a Cloudinary
      const resultado = await cloudinary.v2.uploader.upload(file.path, {
        folder: "estudiantes",
        width: 300,
        crop: "scale",
      });

      body.fotoPerfil = {
        url: resultado.secure_url,
        public_id: resultado.public_id,
      };
      fs.unlinkSync(req.file.path);
    }

    // Actualizar el estudiante con los nuevos datos
    const estudianteActualizado = await Estudiante.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(200).json(estudianteActualizado);
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

// Método para eliminar (dar de baja) un estudiante
const eliminarEstudiante = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el estudiante con ID ${id}` });
  }

  try {
    const estudiante = await Estudiante.findById(id);
    if (!estudiante) {
      return res.status(404).json({ msg: "Estudiante no encontrado" });
    }

    // Eliminar la imagen de Cloudinary si existe
    if (estudiante.fotoPerfil?.public_id) {
      await cloudinary.v2.uploader.destroy(estudiante.fotoPerfil.public_id);
    }

    // Dar de baja al estudiante
    estudiante.estado = false;
    await estudiante.save();

    res
      .status(200)
      .json({ msg: "El estudiante ha sido dado de baja exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error en el servidor"});
  }
};

// Método para listar todos los estudiantes
const listarEstudiantes = async (req, res) => {
  const estudiantes = await Estudiante.find({ estado: true }).select(
    "-password -__v -createdAt -updatedAt"
  );
  res.status(200).json(estudiantes);
};

// Método para obtener un estudiante específico por ID
const obtenerEstudiante = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el estudiante con ID ${id}` });
  }

  const estudiante = await Estudiante.findById(id).select(
    "-password -__v -createdAt -updatedAt"
  );

  if (!estudiante) {
    return res.status(404).json({ msg: "Estudiante no encontrado" });
  }

  res.status(200).json(estudiante);
};

// Método para reactivar un estudiante
const reactivarEstudiante = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el estudiante con ID ${id}` });
  }

  await Estudiante.findByIdAndUpdate(id, { estado: true });

  res
    .status(200)
    .json({ msg: "El estudiante ha sido reactivado exitosamente" });
};

export {
  loginEstudiante,
  perfilEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  listarEstudiantes,
  obtenerEstudiante,
  reactivarEstudiante,
  registrarEstudiante,
  subirFotoPerfil,
};
