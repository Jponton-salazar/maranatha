import { z } from 'zod';

export const registroSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  correo: z.string()
    .email('Por favor ingrese un correo válido'),
  contraseña: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener mayúsculas, minúsculas y números'),
  confirmarContraseña: z.string(),
}).refine((data) => data.contraseña === data.confirmarContraseña, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarContraseña'],
});

export const loginSchema = z.object({
  correo: z.string()
    .email('Por favor ingrese un correo válido'),
  contraseña: z.string()
    .min(1, 'La contraseña es requerida'),
});

export const recuperarContraseñaSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string()
    .email('Por favor ingrese un correo válido'),
  contraseñaNueva: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener mayúsculas, minúsculas y números'),
  confirmarContraseña: z.string(),
}).refine((data) => data.contraseñaNueva === data.confirmarContraseña, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarContraseña'],
});

export const validarSchema = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores: error.errors.map((e) => ({
          campo: e.path.join('.'),
          mensaje: e.message,
        })),
      });
    }
  };
};
