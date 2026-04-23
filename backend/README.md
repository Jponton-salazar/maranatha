# 🔐 Sistema de Autenticación Seguro - Maranatha Stereo

Sistema de autenticación completo y seguro para la emisora Maranatha Stereo, implementado con Node.js, Express, MongoDB, JWT y Zod.

## 📋 Características

✅ **Autenticación JWT** - Tokens seguros con expiración configurable
✅ **Validación con Zod** - Validación robusta de datos en servidor y cliente
✅ **Hash de Contraseñas** - Contraseñas hasheadas con bcryptjs
✅ **CORS** - Configuración segura de CORS
✅ **Formularios Responsivos** - 3 formularios optimizados (Login, Registro, Recuperación)
✅ **Manejo de Errores** - Manejo completo de errores y validaciones
✅ **LocalStorage** - Persistencia segura de tokens en cliente

## 🚀 Instalación

### Requisitos Previos
- Node.js 16+ 
- MongoDB 4.4+ (local o atlas.mongodb.com)
- npm o yarn

### Paso 1: Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### Paso 2: Configurar Variables de Entorno

Crear archivo `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maranatha_stereo
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion_2024
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:8000
```

**⚠️ IMPORTANTE:** Cambiar `JWT_SECRET` a una clave segura en producción

### Paso 3: Iniciar MongoDB

```bash
# Si MongoDB está instalado localmente
mongod

# O usar MongoDB Atlas (cloud)
# Actualizar MONGODB_URI en .env con tu string de conexión
```

### Paso 4: Iniciar el Servidor

```bash
cd backend
npm start
# O con nodemon para desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:5000`

## 📡 Endpoints de la API

### Públicos (sin autenticación)

#### 1. **Registro de Usuario**
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contraseña": "SecurePass123",
  "confirmarContraseña": "SecurePass123"
}
```

**Respuesta Exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "_id": "...",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "verificado": false,
    "activo": true,
    "createdAt": "2024-04-23T...",
    "updatedAt": "2024-04-23T..."
  }
}
```

#### 2. **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "contraseña": "SecurePass123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "_id": "...",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com"
  }
}
```

#### 3. **Recuperar Contraseña**
```http
POST /api/auth/recuperar-contraseña
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contraseñaNueva": "NewPass456",
  "confirmarContraseña": "NewPass456"
}
```

**Respuesta Exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Contraseña actualizada exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "_id": "...",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com"
  }
}
```

### Protegidos (requieren autenticación)

#### 4. **Obtener Perfil**
```http
GET /api/auth/perfil
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Respuesta Exitosa (200):**
```json
{
  "exito": true,
  "usuario": {
    "_id": "...",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "verificado": false,
    "activo": true
  }
}
```

#### 5. **Logout**
```http
POST /api/auth/logout
```

**Respuesta Exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Sesión cerrada exitosamente"
}
```

## 🛡️ Reglas de Validación

### Nombre
- Mínimo 2 caracteres
- Máximo 50 caracteres

### Correo
- Formato válido de email
- Único en la base de datos

### Contraseña
- Mínimo 6 caracteres
- Debe contener mayúsculas (A-Z)
- Debe contener minúsculas (a-z)
- Debe contener números (0-9)

Ejemplo de contraseña válida: `SecurePass123`

## 🌐 Formularios Frontend

### Login (`html/contac_form.html`)
- Campos: Correo, Contraseña
- Validación en tiempo real
- Enlace a Registro
- Enlace a Recuperación de Contraseña

### Registro (`html/registro.html`)
- Campos: Nombre, Correo, Contraseña, Confirmar Contraseña
- Validaciones robustas
- Confirmación de contraseña
- Enlace de vuelta a Login

### Recuperación de Contraseña (`html/recuperar_contraseña.html`)
- Campos: Nombre, Correo, Nueva Contraseña, Confirmar Nueva Contraseña
- Validación de identidad (Nombre + Correo)
- Cambio seguro de contraseña

## 💾 Almacenamiento en Cliente

El token se guarda en `localStorage`:
```javascript
localStorage.getItem('token')      // Token JWT
localStorage.getItem('usuario')    // Datos del usuario en JSON
```

Limpiar sesión:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('usuario')
```

## 🔒 Seguridad

- **Hashing de Contraseñas**: bcryptjs con 10 rounds
- **JWT**: Tokens con expiración configurable
- **CORS**: Solo orígenes permitidos
- **Validación**: Zod en ambos lados (servidor y cliente)
- **Input Sanitization**: Validación antes de BD
- **Errores Genéricos**: No se exponen detalles internos

## 🧪 Pruebas con curl

### Registro
```bash
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "correo": "juan@test.com",
    "contraseña": "TestPass123",
    "confirmarContraseña": "TestPass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan@test.com",
    "contraseña": "TestPass123"
  }'
```

### Recuperar Contraseña
```bash
curl -X POST http://localhost:5000/api/auth/recuperar-contraseña \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "correo": "juan@test.com",
    "contraseñaNueva": "NewPass456",
    "confirmarContraseña": "NewPass456"
  }'
```

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Conexión a MongoDB
├── controllers/
│   └── authController.js    # Lógica de autenticación
├── middlewares/
│   ├── auth.js              # Protección de rutas y JWT
│   └── validacion.js        # Validación con Zod
├── models/
│   └── User.js              # Modelo de usuario
├── routes/
│   └── auth.js              # Rutas de autenticación
├── .env                     # Variables de entorno
├── .gitignore               # Ignorar archivos en git
├── package.json             # Dependencias
└── server.js                # Punto de entrada

frontend/
├── html/
│   ├── contac_form.html     # Formulario de Login
│   ├── registro.html        # Formulario de Registro
│   └── recuperar_contraseña.html  # Recuperación de Contraseña
├── css/
│   └── sesion.css           # Estilos de formularios
└── js/
    └── auth.js              # Lógica de autenticación (cliente)
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Verificar que MongoDB está ejecutándose
- Verificar la cadena de conexión en `.env`
- Si usa MongoDB Atlas, asegurar que la IP está en whitelist

### "CORS error"
- Verificar que `CORS_ORIGIN` en `.env` contiene el dominio correcto
- Reiniciar el servidor después de cambios en `.env`

### "Invalid Token"
- Token expirado - volver a hacer login
- Token malformado - limpiar localStorage

### "Password doesn't meet requirements"
- Contraseña debe tener: mayúsculas, minúsculas y números
- Mínimo 6 caracteres

## 📞 Soporte

Para reportar issues o mejoras, contactar a: jerwebsite@gmail.com

## 📄 Licencia

© 2025 Maranatha Stereo. Todos los derechos reservados.
