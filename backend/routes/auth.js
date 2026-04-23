import express from 'express';
import {
  registro,
  login,
  recuperarContraseña,
  obtenerPerfil,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import {
  validarSchema,
  registroSchema,
  loginSchema,
  recuperarContraseñaSchema,
} from '../middlewares/validacion.js';

const router = express.Router();

// Rutas públicas
router.post('/registro', validarSchema(registroSchema), registro);
router.post('/login', validarSchema(loginSchema), login);
router.post('/recuperar-contraseña', validarSchema(recuperarContraseñaSchema), recuperarContraseña);
router.post('/logout', logout);

// Rutas protegidas
router.get('/perfil', protect, obtenerPerfil);

export default router;
