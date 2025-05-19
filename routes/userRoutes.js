import express from 'express';
import { register, login, logout, getProfile, updateProfile, changePassword } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../middlewares/validation.js';

const router = express.Router();

// Rutas públicas
router.post('/registro', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

// Rutas protegidas
router.get('/perfil', authenticate, getProfile);
router.put('/perfil', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/cambiar-contrasena', authenticate, validate(changePasswordSchema), changePassword);

export default router;