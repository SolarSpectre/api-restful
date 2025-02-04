import {Router} from 'express'
const router = Router()

import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/comentario_controller.js';
import verificarAutenticacion from '../middlewares/autenticacion.js';


// Obtener todos los comentarios
router.get('/comentarios/:comunidadId',verificarAutenticacion, getAllComments);
// Crear un nuevo comentario
router.post('/comentarios',verificarAutenticacion ,createComment);
// Actualizar un comentario por su ID
router.patch('/comentarios/:id_comentario',verificarAutenticacion ,updateComment);
// Eliminar un comentario por su ID
router.delete('/comentarios/:id_comentario',verificarAutenticacion ,deleteComment);

export default router;
