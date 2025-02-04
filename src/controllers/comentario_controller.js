import jwt from "jsonwebtoken";
import Comentario from "../models/Comentario.js";
import mongoose from "mongoose";

// Obtener todos los comentarios con los campos específicos
export const getAllComments = async (req, res) => {
  try {
    const { comunidadId } = req.params;

    // Validar que se proporcione el ID de la comunidad
    if (!comunidadId) {
      return res.status(400).json({ error: "Se requiere el ID de la comunidad" });
    }

    // Validar formato del ID
    if (!mongoose.Types.ObjectId.isValid(comunidadId)) {
      return res.status(400).json({ error: "ID de comunidad no válido" });
    }

    // Buscar comentarios con el filtro de comunidad
    const comentarios = await Comentario.find({ comunidad: comunidadId })
  .populate("replyTo", "usuario comentario")
  .populate("usuario", "_id fotoPerfil usuario")
  .populate("comunidad", "_id");

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
};

// Crear un nuevo comentario
export const createComment = async (req, res) => {
  try {
    const { comunidad, usuario, comentario, replyTo } = req.body;

    // Validar replyTo si existe
    if (replyTo && !mongoose.Types.ObjectId.isValid(replyTo)) {
      return res.status(400).json({ error: "ID de comentario padre no válido" });
    }

    const nuevoComentario = new Comentario({
      comunidad,
      usuario,
      comentario,
      replyTo
    });

    await nuevoComentario.save();
    
    // Populate del comentario padre
    const populatedComment = await Comentario.findById(nuevoComentario._id)
      .populate("replyTo", "usuario comentario")
      .populate("usuario", "_id fotoPerfil usuario");

    res.status(201).json(populatedComment);
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

    // Buscar y validar comentario
    const existingComment = await Comentario.findById(id_comentario);
    if (!existingComment) return res.status(404).json({ error: "Comentario no encontrado" });

    // Verificar permisos
    if (existingComment.usuario.toString() !== idToken && rol !== "Administrador") {
      return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
    }

    // Actualizar todos los comentarios que eran respuestas a este
    await Comentario.updateMany(
      { replyTo: id_comentario },
      { 
        $set: { 
          isDeletedParent: true
        } 
      }
    );
    await existingComment.deleteOne();

    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el comentario" });
  }
};
