import { Schema, model } from 'mongoose';

const comunidadSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // Se puede almacenar la URL de la foto
      default: "", // Valor por defecto si no tiene foto
    },
    tipo: {
      type: String,
      enum: ['Carrera', 'Intereses'],
      required: true,
    },
    carreraRelacionada: {
      type: String, // Si el tipo es "Carrera", se define la carrera
      trim: true,
      default: '',
    },
    interesesRelacionados: {
      type: [String], // Si el tipo es "Intereses", se definen los intereses
      default: [],
    },
    estudiantes: [{
      type: Schema.Types.ObjectId,
      ref: 'Estudiante', // Referencia a los estudiantes que forman parte de la comunidad
    }],
    administrador: {
      type: Schema.Types.ObjectId,
      ref: 'Administrador', // El administrador de la comunidad
      required: true,
    },
    estado: {
      type: Boolean,
      default: true, // Indica si la comunidad está activa o no
    },
  },
  {
    timestamps: true,
  }
);

// Crear el modelo
export default model('Comunidad', comunidadSchema);
