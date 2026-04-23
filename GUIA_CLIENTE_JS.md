# Guía de Uso - Cliente JavaScript

## Resumen de Funcionalidades

El archivo `js/auth.js` proporciona una clase `AuthManager` que maneja toda la autenticación en el cliente.

## Uso en HTML

Simplemente incluir el script en los formularios:
```html
<script src="../js/auth.js"></script>
```

## Métodos Disponibles

### 1. Verificar si está autenticado
```javascript
if (window.auth.estaAutenticado()) {
  console.log('Usuario autenticado');
}
```

### 2. Obtener Token
```javascript
const token = window.auth.getToken();
console.log('Token:', token);
```

### 3. Obtener Datos del Usuario
```javascript
const usuario = window.auth.getUsuario();
console.log('Usuario:', usuario.nombre, usuario.correo);
```

### 4. Logout
```javascript
window.auth.logout();
```

## Ejemplo: Proteger Páginas

Crear archivo `js/protegido.js`:
```javascript
// Verificar autenticación al cargar la página
if (!window.auth || !window.auth.estaAutenticado()) {
  alert('Debe iniciar sesión');
  window.location.href = '../html/contac_form.html';
}

console.log('Usuario:', window.auth.getUsuario());
```

Incluir en la página protegida:
```html
<script src="../js/auth.js"></script>
<script src="../js/protegido.js"></script>
```

## Ejemplo: Hacer Peticiones Autenticadas

```javascript
const token = window.auth.getToken();

fetch('http://localhost:5000/api/auth/perfil', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  if (data.exito) {
    console.log('Perfil:', data.usuario);
  }
});
```

## LocalStorage - Datos Almacenados

```javascript
// Token JWT
localStorage.getItem('token')

// Datos del usuario (JSON string)
const usuario = JSON.parse(localStorage.getItem('usuario'));
console.log(usuario.nombre); // "Juan Pérez"
console.log(usuario.correo); // "juan@example.com"
```

## Flujo de Autenticación

### Registro
1. Usuario completa el formulario de registro
2. JavaScript valida datos localmente
3. Se envía POST a `/api/auth/registro`
4. Servidor valida con Zod
5. Se hashea contraseña y se guarda en BD
6. Se genera JWT y se retorna
7. Token se guarda en localStorage
8. Se redirige a página de inicio

### Login
1. Usuario ingresa correo y contraseña
2. JavaScript valida
3. Se envía POST a `/api/auth/login`
4. Servidor valida credenciales
5. Se compara contraseña hasheada
6. Se genera JWT y se retorna
7. Token se guarda en localStorage
8. Se redirige a página de inicio

### Recuperar Contraseña
1. Usuario ingresa nombre, correo y nueva contraseña
2. JavaScript valida
3. Se envía POST a `/api/auth/recuperar-contraseña`
4. Servidor valida identidad (nombre + correo)
5. Se hashea nueva contraseña
6. Se actualiza en BD
7. Se genera nuevo JWT
8. Token se guarda en localStorage
9. Se redirige a página de inicio

## Manejo de Errores

Los errores se muestran en divs con id `mensajeLogin`, `mensajeRegistro` o `mensajeRecuperar`:

```html
<div id="mensajeLogin" class="mensaje"></div>
```

Estilos CSS:
- `.mensaje.exito` - Fondo verde
- `.mensaje.error` - Fondo rojo

## Ejemplos de Errores

### Contraseña incorrecta
```
✗ Correo o contraseña incorrectos
```

### Validación fallida
```
✗ Error de validación
- correo: Por favor ingrese un correo válido
- contraseña: La contraseña debe tener al menos 6 caracteres
```

### Correo ya registrado
```
✗ El correo ya está registrado
```

### Usuario no encontrado (recuperación)
```
✗ Usuario no encontrado. Verifique nombre y correo.
```

## Peticiones cURL para Pruebas

### Registro
```bash
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "correo": "test@example.com",
    "contraseña": "TestPass123",
    "confirmarContraseña": "TestPass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "test@example.com",
    "contraseña": "TestPass123"
  }'
```

### Perfil (con token)
```bash
curl -X GET http://localhost:5000/api/auth/perfil \
  -H "Authorization: Bearer TOKEN_AQUI"
```

## DevTools Tips

### Ver token en consola
```javascript
console.log(localStorage.getItem('token'));
```

### Decodificar token JWT
Usar: https://jwt.io (pegar token)

### Ver todas las variables de autenticación
```javascript
console.log({
  token: window.auth.getToken(),
  usuario: window.auth.getUsuario(),
  autenticado: window.auth.estaAutenticado()
});
```

### Forzar logout desde consola
```javascript
window.auth.logout();
```

## Troubleshooting

### "Error de conexión con el servidor"
- Verificar que el backend está ejecutándose en `http://localhost:5000`
- Verificar CORS en `.env` del backend

### "Token inválido o expirado"
- Limpiar localStorage y volver a hacer login
- Verificar que JWT_SECRET es el mismo en servidor

### Contraseña no se actualiza
- Verificar que nombre y correo coinciden exactamente
- Verificar mayúsculas/minúsculas

### Formulario no responde
- Abrir DevTools (F12)
- Ver pestaña "Network" para ver peticiones
- Ver pestaña "Console" para errores de JavaScript
