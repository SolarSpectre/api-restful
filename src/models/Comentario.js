import { Schema, model } from 'mongoose';

const comentarioSchema = new Schema({
  comunidad: {
    type: Schema.Types.ObjectId,
    ref: 'Comunidad', // Referencia a la comunidad
    required: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Estudiante', // Referencia al estudiante
  },
  comentario: {
    type: String,
    required: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now // Fecha automática de creación
  }
});


export default model('Comentario', comentarioSchema);