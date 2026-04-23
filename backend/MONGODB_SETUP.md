# Guía MongoDB Atlas (Cloud)

## Opción 1: MongoDB Local (Recomendado para Desarrollo)

### Windows
1. Descargar MongoDB Community: https://www.mongodb.com/try/download/community
2. Ejecutar el instalador
3. Durante instalación, marcar "Install MongoDB as a Service"
4. MongoDB se ejecutará automáticamente en puerto 27017

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu)
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Verificar que está funcionando
```bash
mongo # o mongosh en versiones nuevas
> db.adminCommand('ping')
{ ok: 1 }
```

---

## Opción 2: MongoDB Atlas (Cloud)

### Pasos de Configuración

1. **Crear Cuenta**
   - Ir a https://www.mongodb.com/cloud/atlas
   - Hacer clic en "Register"
   - Completar el formulario

2. **Crear Cluster**
   - Después de registrarse, hacer clic en "Create"
   - Seleccionar "Shared Clusters" (gratis)
   - Elegir región más cercana
   - Hacer clic en "Create Cluster"

3. **Crear Usuario de Base de Datos**
   - En el panel, ir a "Database Access"
   - Hacer clic en "Add New Database User"
   - Username: `maranatha_user`
   - Password: Generar contraseña segura
   - Seleccionar "Built-in Role" → "Atlas Admin"
   - Hacer clic en "Add User"

4. **Permitir Conexiones**
   - En el panel, ir a "Network Access"
   - Hacer clic en "Add IP Address"
   - Seleccionar "Allow access from anywhere" (para desarrollo)
   - Hacer clic en "Confirm"

5. **Obtener String de Conexión**
   - En "Clusters", hacer clic en "Connect"
   - Seleccionar "Connect your application"
   - Copiar el string de conexión
   - Debería verse así:
   ```
   mongodb+srv://maranatha_user:PASSWORD@cluster0.xxxxx.mongodb.net/maranatha_stereo?retryWrites=true&w=majority
   ```
   - Reemplazar `PASSWORD` con la contraseña generada
   - Reemplazar `maranatha_stereo` (nombre de base de datos)

6. **Actualizar .env**
   ```env
   MONGODB_URI=mongodb+srv://maranatha_user:PASSWORD@cluster0.xxxxx.mongodb.net/maranatha_stereo?retryWrites=true&w=majority
   ```

---

## Verificar Conexión

### Con mongo/mongosh
```bash
mongosh "mongodb+srv://maranatha_user:PASSWORD@cluster0.xxxxx.mongodb.net/maranatha_stereo"
```

### En la aplicación
Después de iniciar el servidor, deberías ver:
```
MongoDB conectado: cluster0.xxxxx.mongodb.net
```

---

## Comparación Local vs Cloud

| Característica | Local | Atlas |
|---|---|---|
| Costo | Gratis | Gratis (tier compartido) |
| Performance | Muy rápido | Bueno |
| Backup | Manual | Automático |
| Escalabilidad | Limitada | Fácil |
| Acceso Remoto | No | Sí |
| Ideal para | Desarrollo | Producción |

---

## Tips de Seguridad

⚠️ **NUNCA**:
- Compartir contraseña de BD
- Hacer push de `.env` a git
- Usar contraseñas débiles
- Permitir acceso desde "cualquier IP" en producción

✅ **SIEMPRE**:
- Usar contraseñas fuertes (50+ caracteres)
- Guardar `.env` en `.gitignore`
- Usar diferentes credenciales por entorno
- Limitar IP en producción
- Hacer backups periódicos
