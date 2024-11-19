import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user_controller.js';

const router = Router();

// Rutas para el usuario
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
