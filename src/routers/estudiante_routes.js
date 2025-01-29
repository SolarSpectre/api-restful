import {Router} from 'express'
const router = Router()


import verificarAutenticacion from "../middlewares/autenticacion.js";
import { actualizarEstudiante, eliminarEstudiante, listarEstudiantes, loginEstudiante, obtenerEstudiante, perfilEstudiante, registrarEstudiante, subirFotoPerfil } from '../controllers/estudiante_controller.js';
import { verificarAdmin } from '../middlewares/verificarAdmin.js';


router.post('/estudiante/login',loginEstudiante)

router.get('/estudiante/perfil',verificarAutenticacion,perfilEstudiante)
router.get("/estudiantes",verificarAutenticacion,listarEstudiantes);
router.get("/estudiante/:id",verificarAutenticacion, obtenerEstudiante);
router.post("/estudiante/registro", subirFotoPerfil, registrarEstudiante);
router.put("/estudiante/actualizar/:id", verificarAutenticacion,subirFotoPerfil,actualizarEstudiante);
router.delete("/estudiante/eliminar/:id", verificarAutenticacion,eliminarEstudiante);


export default router