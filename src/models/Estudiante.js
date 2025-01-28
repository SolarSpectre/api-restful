import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const estudianteSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    usuario: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fotoPerfil: {
      type: String, // Se puede almacenar la URL de la foto de perfil.
      default: "", // Valor por defecto si no tiene foto
    },
    celular: {
      type: String,
      required: true,
      trim: true,
    },
    universidad: {
      type: String,
      required: true,
      trim: true,
    },
    carrera: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    intereses: {
      type: [String], // Lista de intereses o actividades extracurriculares
      default: [],
    },
    comunidad: {
      type: String, // Comunidad o grupo de estudiantes al que pertenece
      default: "",
    },
    estado: {
      type: Boolean,
      default: true, // Indica si la cuenta está activa
    },
    rol: {
      type: String,
      default: "Estudiante",
    },
  },
  {
    timestamps: true,
  }
);

// Método para cifrar el password del estudiante
estudianteSchema.methods.encrypPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const passwordEncryp = await bcrypt.hash(password, salt);
  return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
estudianteSchema.methods.matchPassword = async function (password) {
  const response = await bcrypt.compare(password, this.password);
  return response;
};

export default model("Estudiante", estudianteSchema);
