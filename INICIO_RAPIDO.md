# 🚀 Guía Rápida de Inicio - Sistema de Autenticación Maranatha

## Paso 1: Preparar el Backend

### 1.1 Abrir terminal en la carpeta `backend`
```bash
cd backend
```

### 1.2 Instalar dependencias
```bash
npm install
```

### 1.3 Instalar MongoDB (si no lo tienes)
**Windows**: Descargar de https://www.mongodb.com/try/download/community

**macOS**: 
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu)**:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 1.4 Verificar variables de entorno
El archivo `.env` ya existe con configuración por defecto. Verificar:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maranatha_stereo
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion_2024
```

## Paso 2: Iniciar el Servidor

### En la carpeta `backend`:
```bash
npm start
```

Deberías ver:
```
🚀 Servidor ejecutándose en puerto 5000
📚 Documentación API: http://localhost:5000/api
🔒 Endpoint Auth: http://localhost:5000/api/auth
```

## Paso 3: Probar el Sistema

### Opción A: Abrir en el navegador
1. Ir a: `file:///C:/Users/jerwe/Documents/Doc-Programing/PROYECTOS-WEB/maranatha/html/contac_form.html`
2. (Reemplazar ruta según tu ubicación)

### Opción B: Con servidor web (recomendado)
```bash
# En otra terminal, en la carpeta maranatha/
# Si tienes Python:
python -m http.server 8000

# Si tienes Node:
npx http-server

# Si tienes Live Server en VS Code, hacer click derecho: "Open with Live Server"
```

Ir a: `http://localhost:8000/html/contac_form.html`

## Paso 4: Probar Funcionalidades

### Test 1: Registro
1. Ir a [Login Form](http://localhost:8000/html/contac_form.html)
2. Hacer clic en "Registrarse"
3. Llenar formulario:
   - Nombre: `Juan Pérez`
   - Correo: `juan@test.com`
   - Contraseña: `TestPass123` (mayús, minús, números)
   - Confirmar: `TestPass123`
4. Hacer clic en "Registrarse"
5. Debe mostrar: "✓ Usuario registrado exitosamente"

### Test 2: Login
1. Volver a [Login Form](http://localhost:8000/html/contac_form.html)
2. Llenar formulario:
   - Correo: `juan@test.com`
   - Contraseña: `TestPass123`
3. Hacer clic en "Iniciar Sesión"
4. Debe redirigir a inicio

### Test 3: Recuperar Contraseña
1. En [Login Form](http://localhost:8000/html/contac_form.html)
2. Hacer clic en "¿Olvidó su contraseña?"
3. Llenar formulario:
   - Nombre: `Juan Pérez`
   - Correo: `juan@test.com`
   - Nueva Contraseña: `NewPass456`
   - Confirmar: `NewPass456`
4. Hacer clic en "Recuperar Contraseña"
5. Debe redirigir a inicio con nuevo token

## Paso 5: Verificar Funcionamiento

### En DevTools del navegador (F12)

**Pestaña Console:**
```javascript
// Ver si está autenticado
window.auth.estaAutenticado()

// Ver token
window.auth.getToken()

// Ver usuario
window.auth.getUsuario()
```

**Pestaña Application → LocalStorage:**
- Debe haber: `token` y `usuario`

**Pestaña Network:**
- Ver peticiones a `localhost:5000/api/auth/...`
- Ver respuestas con `token` en JSON

## Paso 6: Ejecutar Tests Automatizados

```bash
# En la carpeta backend
node test.js
```

Debe ejecutar 7 pruebas y mostrar: ✅ Pruebas completadas!

## 📂 Archivos Importantes

```
maranatha/
├── backend/
│   ├── server.js              ← Punto de entrada
│   ├── .env                   ← Variables de entorno
│   ├── package.json           ← Dependencias
│   ├── routes/auth.js         ← Rutas
│   ├── controllers/           ← Lógica
│   ├── models/User.js         ← Esquema BD
│   ├── README.md              ← Doc completa
│   ├── MONGODB_SETUP.md       ← Setup MongoDB
│   └── test.js                ← Tests
├── html/
│   ├── contac_form.html       ← Login
│   ├── registro.html          ← Registro
│   └── recuperar_contraseña.html ← Recuperar
├── css/
│   └── sesion.css             ← Estilos (actualizado)
├── js/
│   └── auth.js                ← Lógica cliente
└── GUIA_CLIENTE_JS.md         ← Guía JS
```

## 🆘 Problemas Comunes

### ❌ "Cannot GET /api/health"
**Solución**: Asegurar que el servidor está ejecutándose (`npm start` en backend)

### ❌ "CORS error"
**Solución**: Verificar que `CORS_ORIGIN` en `.env` contiene el dominio correcto
```env
CORS_ORIGIN=http://localhost:8000
```

### ❌ "Connection refused"
**Solución**: MongoDB no está ejecutándose. Ejecutar `mongod` en otra terminal

### ❌ "Usuario ya registrado"
**Solución**: Usar un correo diferente o eliminar la base de datos

### ❌ "Contraseña no cumple requisitos"
**Solución**: Usar: mayúsculas, minúsculas, números. Ej: `Pass123`

## 📖 Documentación Completa

- 📘 [README Backend](backend/README.md) - Documentación completa de API
- 🗄️ [MongoDB Setup](backend/MONGODB_SETUP.md) - Guía de base de datos
- 🎯 [Guía Cliente JS](GUIA_CLIENTE_JS.md) - Uso desde JavaScript

## 🔐 Próximos Pasos (Producción)

1. **Cambiar JWT_SECRET**
   ```env
   JWT_SECRET=generador_seguro_random_string_123abc456def
   ```

2. **Usar MongoDB Atlas**
   - Ver [MONGODB_SETUP.md](backend/MONGODB_SETUP.md)
   - Actualizar `MONGODB_URI`

3. **Cambiar CORS_ORIGIN a dominio real**
   ```env
   CORS_ORIGIN=https://www.tudominio.com
   ```

4. **Desplegar Backend**
   - Heroku, Vercel, Railway, AWS Lambda, etc.

5. **Actualizar API_URL en frontend**
   ```javascript
   // En js/auth.js cambiar:
   const API_URL = 'https://api.tudominio.com/api/auth';
   ```

---

## ✅ Checklist de Verificación

- [ ] MongoDB está ejecutándose
- [ ] Backend `npm start` sin errores
- [ ] Puedes hacer registro
- [ ] Puedes hacer login
- [ ] Puedes recuperar contraseña
- [ ] Token aparece en localStorage
- [ ] Tests pasan: `node test.js`
- [ ] No hay errores en DevTools (F12)

---

## 📞 Soporte

Si hay problemas:
1. Ver la pestaña "Console" en DevTools (F12)
2. Leer los mensajes de error
3. Consultar la documentación completa en `backend/README.md`
4. Contactar: jerwebsite@gmail.com

**¡Sistema listo para usar! 🎉**
