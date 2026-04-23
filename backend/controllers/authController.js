import User from '../models/User.js';
import { generarToken } from '../middlewares/auth.js';
import crypto from 'crypto';

// Registro de nuevo usuario
export const registro = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El correo ya está registrado',
      });
    }

    // Crear nuevo usuario
    const usuario = new User({
      nombre,
      correo,
      contraseña,
    });

    // Guardar usuario
    await usuario.save();

    // Generar token
    const token = generarToken(usuario._id);

    // Retornar respuesta
    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: usuario.toJSON(),
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al registrar usuario',
      error: error.message,
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar usuario con contraseña (select(false) por defecto)
    const usuario = await User.findOne({ correo }).select('+contraseña');

    if (!usuario || !(await usuario.compararContraseña(contraseña))) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Correo o contraseña incorrectos',
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        exito: false,
        mensaje: 'La cuenta está desactivada',
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    // Retornar respuesta
    res.status(200).json({
      exito: true,
      mensaje: 'Login exitoso',
      token,
      usuario: usuario.toJSON(),
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};

// Recuperar contraseña
export const recuperarContraseña = async (req, res) => {
  try {
    const { nombre, correo, contraseñaNueva } = req.body;

    // Buscar usuario por nombre y correo
    const usuario = await User.findOne({
      nombre: { $regex: nombre, $options: 'i' },
      correo,
    });

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado. Verifique nombre y correo.',
      });
    }

    // Actualizar contraseña
    usuario.contraseña = contraseñaNueva;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpire = undefined;

    await usuario.save();

    // Generar nuevo token
    const token = generarToken(usuario._id);

    // Retornar respuesta
    res.status(200).json({
      exito: true,
      mensaje: 'Contraseña actualizada exitosamente',
      token,
      usuario: usuario.toJSON(),
    });
  } catch (error) {
    console.error('Error en recuperar contraseña:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al recuperar contraseña',
      error: error.message,
    });
  }
};

// Obtener perfil del usuario autenticado
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuarioId);

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      exito: true,
      usuario: usuario.toJSON(),
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener perfil',
      error: error.message,
    });
  }
};

// Logout (simplemente eliminar token en el cliente)
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      exito: true,
      mensaje: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cerrar sesión',
    });
  }
};
