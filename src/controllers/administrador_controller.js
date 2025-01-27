// Importar el modelo
import {
  sendMailToUser,
  sendMailToRecoveryPassword,
} from "../config/nodemailer.js";
import generarJWT from "../helpers/crearJWT.js";
import Administrador from "../models/Administrador.js";
import mongoose from "mongoose";

// Método para el login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (Object.values(req.body).includes(""))
    return res.status(404).json({ msg: "Debes llenar todos los campos" });

  const administradorBDD = await Administrador.findOne({ email }).select(
    "-status -__v -token -updatedAt -createdAt"
  );

  if (administradorBDD?.confirmEmail === false)
    return res.status(403).json({ msg: "Debe verificar su cuenta" });

  if (!administradorBDD)
    return res.status(404).json({ msg: "El usuario no está registrado" });

  const verificarPassword = await administradorBDD.matchPassword(password);

  if (!verificarPassword)
    return res.status(404).json({ msg: "La contraseña no es correcta" });

  const token = generarJWT(administradorBDD._id, "administrador");

  const { nombre, apellido, email: adminEmail, _id, rol } = administradorBDD;

  res.status(200).json({
    token,
    nombre,
    apellido,
    email: adminEmail,
    _id,
    rol,
  });
};

// Método para mostrar el perfil
const perfil = (req, res) => {
  delete req.administradorBDD.token;
  delete req.administradorBDD.confirmEmail;
  delete req.administradorBDD.createdAt;
  delete req.administradorBDD.updatedAt;
  delete req.administradorBDD.__v;
  res.status(200).json(req.administradorBDD);
};

// Método para el registro
const registro = async (req, res) => {
  const { email, password } = req.body;

  if (Object.values(req.body).includes(""))
    return res.status(400).json({ msg: "Debes llenar todos los campos" });

  const verificarEmailBDD = await Administrador.findOne({ email });

  if (verificarEmailBDD)
    return res.status(400).json({ msg: "El email ya está registrado" });

  const nuevoAdministrador = new Administrador(req.body);

  nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(
    password
  );

  const token = nuevoAdministrador.crearToken();

  await sendMailToUser(email, token);

  await nuevoAdministrador.save();

  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
};

// Método para confirmar el token
const confirmEmail = async (req, res) => {
  if (!req.params.token)
    return res.status(400).json({ msg: "No se puede validar la cuenta" });

  const administradorBDD = await Administrador.findOne({
    token: req.params.token,
  });

  if (!administradorBDD?.token)
    return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });

  administradorBDD.token = null;
  administradorBDD.confirmEmail = true;

  await administradorBDD.save();

  res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
};

// Método para actualizar el perfil
const actualizarPerfil = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: "Debe ser un ID válido" });

  if (Object.values(req.body).includes(""))
    return res.status(400).json({ msg: "Debes llenar todos los campos" });

  const administradorBDD = await Administrador.findById(id);

  if (!administradorBDD)
    return res
      .status(404)
      .json({ msg: `No existe el administrador con ID ${id}` });

  if (administradorBDD.email !== req.body.email) {
    const administradorBDDMail = await Administrador.findOne({
      email: req.body.email,
    });
    if (administradorBDDMail)
      return res.status(404).json({ msg: "El email ya está registrado" });
  }

  administradorBDD.nombre = req.body.nombre || administradorBDD?.nombre;
  administradorBDD.apellido = req.body.apellido || administradorBDD?.apellido;
  administradorBDD.email = req.body.email || administradorBDD?.email;

  await administradorBDD.save();

  res.status(200).json({ msg: "Perfil actualizado correctamente" });
};

// Método para actualizar el password
const actualizarPassword = async (req, res) => {
  const administradorBDD = await Administrador.findById(
    req.administradorBDD._id
  );

  if (!administradorBDD)
    return res.status(404).json({ msg: "No existe el administrador" });

  const verificarPassword = await administradorBDD.matchPassword(
    req.body.passwordactual
  );

  if (!verificarPassword)
    return res.status(404).json({ msg: "La contraseña actual no es correcta" });

  administradorBDD.password = await administradorBDD.encrypPassword(
    req.body.passwordnuevo
  );

  await administradorBDD.save();

  res.status(200).json({ msg: "Contraseña actualizada correctamente" });
};

// Método para recuperar el password
const recuperarPassword = async (req, res) => {
  const { email } = req.body;

  if (Object.values(req.body).includes(""))
    return res.status(404).json({ msg: "Debes llenar todos los campos" });

  const administradorBDD = await Administrador.findOne({ email });

  if (!administradorBDD)
    return res.status(404).json({ msg: "El usuario no está registrado" });

  const token = administradorBDD.crearToken();

  administradorBDD.token = token;

  await sendMailToRecoveryPassword(email, token);

  await administradorBDD.save();

  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para restablecer tu cuenta" });
};

// Método para comprobar el token
const comprobarTokenPassword = async (req, res) => {
  if (!req.params.token)
    return res.status(404).json({ msg: "No se puede validar la cuenta" });

  const administradorBDD = await Administrador.findOne({
    token: req.params.token,
  });

  if (administradorBDD?.token !== req.params.token)
    return res.status(404).json({ msg: "No se puede validar la cuenta" });

  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" });
};

// Método para crear el nuevo password
const nuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body;

  if (Object.values(req.body).includes(""))
    return res.status(404).json({ msg: "Debes llenar todos los campos" });

  if (password !== confirmpassword)
    return res.status(404).json({ msg: "Las contraseñas no coinciden" });

  const administradorBDD = await Administrador.findOne({
    token: req.params.token,
  });

  if (administradorBDD?.token !== req.params.token)
    return res.status(404).json({ msg: "No se puede validar la cuenta" });

  administradorBDD.token = null;

  administradorBDD.password = await administradorBDD.encrypPassword(password);

  await administradorBDD.save();

  res
    .status(200)
    .json({
      msg: "Contraseña actualizada correctamente, ya puedes iniciar sesión",
    });
};

export {
  login,
  perfil,
  registro,
  confirmEmail,
  actualizarPerfil,
  actualizarPassword,
  recuperarPassword,
  comprobarTokenPassword,
  nuevoPassword,
};
