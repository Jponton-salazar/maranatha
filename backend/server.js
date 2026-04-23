import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Conectar a la base de datos
await connectDB();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ estado: 'Servidor funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📚 Documentación API: http://localhost:${PORT}/api`);
  console.log(`🔒 Endpoint Auth: http://localhost:${PORT}/api/auth`);
});
