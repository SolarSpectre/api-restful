import Estudiante from "../models/Estudiante.js";
import Message from "../models/Mensajes.js";

import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const usuarioSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.estudianteBDD._id;
    const filteredUsers = await Estudiante.find(loggedInUserId).select("amigos").populate("amigos", "_id nombre usuario fotoPerfil");;

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const obtenerMensajes = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.estudianteBDD._id;

    const messages = await Message.find({
      $or: [
        { emisor: myId, receptor: userToChatId },
        { emisor: userToChatId, receptor: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const enviarMensaje = async (req, res) => {
  try {
    const { texto, imagen } = req.body;
    const { id: receptor } = req.params;
    const emisor = req.estudianteBDD._id;

    let imageUrl;
    if (imagen) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(imagen);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      emisor,
      receptor,
      texto,
      imagen: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receptor);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};