import { Router } from 'express';
import { registerStudent, loginStudent, updateStudent_controller, deleteStudent_controller } from '../controllers/student_controller.js';

import { verifyToken } from '../middlewares/auth.js'
const router = Router();

// Rutas para el usuario
router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.put('/:id',verifyToken, updateStudent_controller);
router.delete('/:id',verifyToken, deleteStudent_controller);

export default router;
