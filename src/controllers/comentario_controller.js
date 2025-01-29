import jwt from "jsonwebtoken";
import Comentario from "../models/Comentario.js";

// Obtener todos los comentarios con los campos específicos
export const getAllComments = async (req, res) => {
  try {
    const comentarios = await Comentario.find()
      .populate("comunidad", "_id") // Solo traer el ID de la comunidad
      .populate("usuario", "_id fotoPerfil usuario"); // Solo traer los campos deseados del usuario

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
};

// Obtener un comentario por ID
export const getCommentById = async (req, res) => {
  try {
    const { id_comentario } = req.params;
    const comentario = await Comentario.findById(id_comentario)
      .populate("comunidad", "_id")
      .populate("usuario", "_id fotoPerfil usuario");

    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el comentario" });
  }
};

// Crear un nuevo comentario
export const createComment = async (req, res) => {
  try {
    const { comunidad, usuario, comentario } = req.body;

    if (Object.values(req.body).includes("")) {
      return res
        .status(400)
        .json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    const nuevoComentario = new Comentario({
      comunidad,
      usuario,
      comentario,
    });

    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el comentario" });
  }
};

// Actualizar un comentario (solo el usuario que lo creó puede hacerlo)
export const updateComment = async (req, res) => {
  try {
    const { id_comentario } = req.params;
    const { comentario } = req.body;
    const {idToken,rol} = jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)

    if (!comentario || comentario.trim() === "") {
      return res.status(400).json({ error: "El campo comentario es obligatorio" });
    }

    // Buscar el comentario
    const existingComment = await Comentario.findById(id_comentario);
    if (!existingComment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    // Verificar si el usuario es el dueño del comentario o es un administrador
    if (existingComment.usuario.toString() !== idToken && rol !== "Administrador") {
      return res.status(403).json({ error: "No tienes permiso para actualizar este comentario" });
    }

    // Actualizar el comentario
    existingComment.comentario = comentario;
    await existingComment.save();

    res.status(200).json(existingComment);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el comentario" });
  }
};

// Eliminar un comentario (solo el usuario que lo creó puede hacerlo)
export const deleteComment = async (req, res) => {
  try {
    const { id_comentario } = req.params;
    const {idToken,rol} = jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)

    // Buscar el comentario
    const existingComment = await Comentario.findById(id_comentario);
    if (!existingComment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    // Verificar si el usuario es el dueño del comentario o es un administrador
    if (existingComment.usuario.toString() !== idToken && rol !== "Administrador") {
      return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
    }

    // Eliminar el comentario
    await existingComment.deleteOne();

    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el comentario" });
  }
};
