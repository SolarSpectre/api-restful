import {Router} from 'express'
const router = Router()


import verificarAutenticacion from "../middlewares/autenticacion.js";
import { actualizarEstudiante, eliminarEstudiante, listarEstudiantes, loginEstudiante, obtenerEstudiante, obtenerFotosDePerfil, perfilEstudiante, registrarEstudiante, subirFotoPerfil } from '../controllers/estudiante_controller.js';


router.post('/estudiante/login',loginEstudiante)

router.get('/estudiante/perfil',verificarAutenticacion,perfilEstudiante)
router.post("estudiante/obtener-fotos", verificarAutenticacion, obtenerFotosDePerfil);
router.get("/estudiantes",verificarAutenticacion,listarEstudiantes);
router.get("/estudiante/:id",verificarAutenticacion, obtenerEstudiante);
router.post("/estudiante/registro", subirFotoPerfil, registrarEstudiante);
router.put("/estudiante/actualizar/:id", verificarAutenticacion,actualizarEstudiante);
router.delete("/estudiante/eliminar/:id", verificarAutenticacion,eliminarEstudiante);







export default router