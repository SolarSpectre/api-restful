import {Router} from 'express'
const router = Router()

import verificarAutenticacion from "../middlewares/autenticacion.js";
import { enviarMensaje, obtenerMensajes, usuarioSidebar } from '../controllers/mensajes_controller.js';

router.get("/mensaje/usuarios", verificarAutenticacion, usuarioSidebar);
router.get("mensaje/:id", verificarAutenticacion, obtenerMensajes);

router.post("mensaje/enviar/:id", verificarAutenticacion, enviarMensaje);
export default router