# 🔒 Documentación de Seguridad y Arquitectura

## Arquitectura General

```
┌─────────────────────────────────────────────┐
│          Frontend (HTML/CSS/JS)             │
├─────────────────────────────────────────────┤
│  - Validación con Zod (cliente)             │
│  - LocalStorage para token                  │
│  - Manejo de errores amigable               │
└──────────────┬──────────────────────────────┘
               │ HTTPS (en producción)
               ↓
┌─────────────────────────────────────────────┐
│    Backend (Node.js + Express)              │
├─────────────────────────────────────────────┤
│  - CORS configurado                         │
│  - Validación con Zod (servidor)            │
│  - JWT para autenticación                   │
│  - Hash bcryptjs para contraseñas           │
│  - Middleware de protección                 │
└──────────────┬──────────────────────────────┘
               │ MongoDB Protocol
               ↓
┌─────────────────────────────────────────────┐
│     MongoDB (Base de Datos)                 │
├─────────────────────────────────────────────┤
│  - Contraseñas hasheadas (nunca plaintext)  │
│  - Campos sensibles no se retornan          │
│  - Índice único en correo                   │
└─────────────────────────────────────────────┘
```

## Medidas de Seguridad Implementadas

### 1. Hashing de Contraseñas

**Tecnología**: bcryptjs
**Rounds**: 10 (configurable)

```javascript
// En User.js - Middleware pre-save
userSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) {
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.contraseña = await bcryptjs.hash(this.contraseña, salt);
  next();
});
```

**Ventajas**:
- Algoritmo adaptativo (se ralentiza con el tiempo)
- No reversible (one-way hashing)
- Protección contra rainbow tables
- Comparación segura de contraseñas

### 2. Autenticación JWT

**Especificación**: RFC 7519
**Algoritmo**: HS256 (HMAC SHA-256)
**Expiración**: 7 días (configurable)

```javascript
// Token generado
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "id": "usuario_mongodb_id",
  "iat": 1234567890,    // Emitido en
  "exp": 1234654290     // Expira en
}
```

**Ventajas**:
- Stateless (no necesita sesiones en servidor)
- Escalable horizontalmente
- Funciona bien con APIs REST
- Seguro contra CSRF

### 3. Validación de Datos (Zod)

**Ubicación**: Servidor y cliente

**Esquemas**:

```javascript
// Cliente (prevención temprana)
const registroSchema = z.object({
  nombre: z.string().min(2).max(50),
  correo: z.string().email(),
  contraseña: z.string()
    .min(6)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});

// Servidor (validación definitiva)
// Se valida de nuevo por seguridad
```

**Protección contra**:
- Inyección SQL (no aplica, usamos Mongoose)
- XSS (validación de entrada)
- Datos malformados
- Ataques de tipo

### 4. CORS (Cross-Origin Resource Sharing)

**Configuración segura**:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

**Protección contra**:
- Ataques cross-domain
- Peticiones no autorizadas desde otros dominios
- Robo de información sensible

### 5. Middleware de Autenticación

```javascript
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ exito: false });
  }
  
  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.id;
    next();
  } catch (error) {
    return res.status(401).json({ exito: false });
  }
};
```

**Protección**:
- Verifica tokens en cada petición
- Previene acceso no autorizado
- Detecta tokens expirados

### 6. Manejo de Errores Seguro

**❌ MAL** (expone información):
```json
{
  "error": "User not found in database at line 45 of auth.js"
}
```

**✅ BIEN** (genérico):
```json
{
  "exito": false,
  "mensaje": "Correo o contraseña incorrectos"
}
```

**Implementado**:
- Mensajes genéricos al cliente
- Logs detallados solo en servidor
- Sin información de estructura interna

### 7. Campos Sensibles

**No se retornan**:
```javascript
// En User.js
delete obj.contraseña;
delete obj.resetPasswordToken;
delete obj.resetPasswordExpire;
```

**En queries**:
```javascript
const usuario = await User.findOne({ correo }).select('+contraseña');
// Solo cuando se necesita comparar
```

### 8. Índices de Base de Datos

```javascript
// En User.js
correo: {
  type: String,
  unique: true,  // Previene duplicados
  lowercase: true,
  index: true,   // Mejora búsquedas
}
```

**Ventajas**:
- Un correo por usuario
- Búsquedas rápidas
- Integridad de datos

## Flujos Seguro de Autenticación

### Registro
```
1. Cliente válida con Zod
   ↓
2. Envía: {nombre, correo, contraseña}
   ↓
3. Servidor válida con Zod
   ↓
4. Verifica correo no existe
   ↓
5. Hashea contraseña con bcrypt
   ↓
6. Guarda en BD
   ↓
7. Genera JWT con ID de usuario
   ↓
8. Retorna token + usuario (sin contraseña)
   ↓
9. Cliente guarda token en localStorage
```

### Login
```
1. Cliente válida con Zod
   ↓
2. Envía: {correo, contraseña}
   ↓
3. Servidor válida con Zod
   ↓
4. Busca usuario (con contraseña en BD)
   ↓
5. Compara contraseña ingresada con hash
   ↓
6. Si coincide: genera JWT
   ↓
7. Retorna token + usuario
   ↓
8. Cliente guarda token en localStorage
```

### Petición Autenticada
```
1. Cliente extrae token de localStorage
   ↓
2. Envía: Authorization: Bearer {token}
   ↓
3. Middleware protect extrae token
   ↓
4. Verifica firma con JWT_SECRET
   ↓
5. Verifica no esté expirado
   ↓
6. Extrae ID de usuario
   ↓
7. Permite continuar si válido
   ↓
8. Rechaza si inválido o expirado
```

## Vulnerabilidades Prevenidas

| Vulnerabilidad | Prevención |
|---|---|
| SQL Injection | Mongoose (no SQL raw) |
| XSS | Validación Zod + sanitización |
| CSRF | CORS + tokens JWT |
| Contraseña débil | Validación regex en Zod |
| Contraseña plaintext | Hash bcryptjs |
| Token robo | JWT con expiración + HTTPS |
| Acceso no autenticado | Middleware protect |
| Datos expuestos | Campos sensibles no retornados |
| Duplicado de correo | Índice único en BD |
| Inyección | Validación Zod en servidor |

## Buenas Prácticas Implementadas

✅ **Separación de responsabilidades**
- Controllers: Lógica de negocio
- Models: Esquema de datos
- Routes: Definición de endpoints
- Middlewares: Funcionalidad transversal

✅ **Validación en dos niveles**
- Cliente (experiencia del usuario)
- Servidor (seguridad garantizada)

✅ **Variables de entorno**
- Secrets no en código
- Diferentes por entorno
- .env en .gitignore

✅ **Logging**
- Errores en consola servidor
- Sin exponer detalles al cliente

✅ **Manejo de errores**
- Try-catch en async functions
- Respuestas consistentes
- Status HTTP correctos

✅ **Documentación**
- README detallado
- Ejemplos de API
- Guías de setup
- Troubleshooting

## Configuración para Producción

### 1. Cambiar JWT_SECRET
```bash
# Generar secret seguro:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Actualizar .env
JWT_SECRET=generador_seguro_random_string_aqui
```

### 2. Usar MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maranatha
```

### 3. Usar HTTPS
```env
CORS_ORIGIN=https://www.tudominio.com
```

### 4. Configurar variables por entorno
```
.env.development
.env.production
.env.test
```

### 5. Implementar rate limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 peticiones por IP
});

app.use('/api/', limiter);
```

### 6. Agregar helmet para headers seguro
```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 7. Monitoreo y logs
- Winston para logging
- Sentry para error tracking
- CloudWatch o ELK para análisis

## Auditoría de Seguridad

Ejecutar regularmente:
```bash
# Verificar vulnerabilidades en dependencias
npm audit

# Actualizar dependencias
npm update

# Buscar secretos en código
npm install -g git-secrets
git secrets --scan
```

## Referencias de Seguridad

- [OWASP Top 10](https://owasp.org/Top10/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [bcrypt Documentación](https://github.com/kelektiv/node.bcrypt.js)
- [Zod Documentación](https://zod.dev)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Última actualización**: Abril 2025
**Versión**: 1.0.0
**Estado**: Producción-ready con mejoras recomendadas
