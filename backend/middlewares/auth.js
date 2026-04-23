import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si viene en headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si el token existe
    if (!token) {
      return res.status(401).json({ 
        exito: false, 
        mensaje: 'No autorizado para acceder a esta ruta' 
      });
    }

    // Verificar el token
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.id;
    next();
  } catch (error) {
    return res.status(401).json({ 
      exito: false, 
      mensaje: 'Token inválido o expirado' 
    });
  }
};

export const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
