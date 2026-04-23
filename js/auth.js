// Configuración de la API
const API_URL = 'https://maranatha-psi.vercel.app/';

// Clase para manejar la autenticación
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('token');
    this.usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    this.inicializarEventos();
  }

  // Inicializar eventos de formularios
  inicializarEventos() {
    const loginForm = document.getElementById('loginForm');
    const registroForm = document.getElementById('registroForm');
    const recuperarForm = document.getElementById('recuperarForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
      document.getElementById('olvidoContraseña').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../html/recuperar_contraseña.html';
      });
      document.getElementById('irRegistro').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../html/registro.html';
      });
    }

    if (registroForm) {
      registroForm.addEventListener('submit', (e) => this.handleRegistro(e));
    }

    if (recuperarForm) {
      recuperarForm.addEventListener('submit', (e) => this.handleRecuperar(e));
    }
  }

  // Mostrar mensajes
  mostrarMensaje(elementId, mensaje, tipo = 'exito') {
    const elemento = document.getElementById(elementId);
    if (elemento) {
      elemento.textContent = mensaje;
      elemento.className = `mensaje ${tipo}`;
      elemento.style.display = 'block';
      
      // Auto-ocultar después de 5 segundos si es exitoso
      if (tipo === 'exito') {
        setTimeout(() => {
          elemento.style.display = 'none';
        }, 5000);
      }
    }
  }

  // Validar contraseña (debe tener mayús, minús y números)
  validarContraseña(contraseña) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (contraseña.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!regex.test(contraseña)) {
      return 'La contraseña debe contener mayúsculas, minúsculas y números';
    }
    return null;
  }

  // Validar correo
  validarCorreo(correo) {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(correo);
  }

  // Handle Login
  async handleLogin(e) {
    e.preventDefault();

    const correo = document.getElementById('loginCorreo')?.value;
    const contraseña = document.getElementById('loginContraseña')?.value;

    // Validaciones
    if (!correo || !contraseña) {
      this.mostrarMensaje('mensajeLogin', 'Por favor complete todos los campos', 'error');
      return;
    }

    if (!this.validarCorreo(correo)) {
      this.mostrarMensaje('mensajeLogin', 'Por favor ingrese un correo válido', 'error');
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña }),
      });

      const datos = await respuesta.json();

      if (datos.exito) {
        // Guardar token y usuario
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));

        this.mostrarMensaje('mensajeLogin', '✓ ' + datos.mensaje, 'exito');

        // Redirigir después de 2 segundos
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2000);
      } else {
        this.mostrarMensaje('mensajeLogin', '✗ ' + datos.mensaje, 'error');
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.mostrarMensaje('mensajeLogin', 'Error de conexión con el servidor', 'error');
    }
  }

  // Handle Registro
  async handleRegistro(e) {
    e.preventDefault();

    const nombre = document.getElementById('registroNombre')?.value;
    const correo = document.getElementById('registroCorreo')?.value;
    const contraseña = document.getElementById('registroContraseña')?.value;
    const confirmarContraseña = document.getElementById('registroConfirmar')?.value;

    // Validaciones
    if (!nombre || !correo || !contraseña || !confirmarContraseña) {
      this.mostrarMensaje('mensajeRegistro', 'Por favor complete todos los campos', 'error');
      return;
    }

    if (nombre.length < 2) {
      this.mostrarMensaje('mensajeRegistro', 'El nombre debe tener al menos 2 caracteres', 'error');
      return;
    }

    if (!this.validarCorreo(correo)) {
      this.mostrarMensaje('mensajeRegistro', 'Por favor ingrese un correo válido', 'error');
      return;
    }

    const errorContraseña = this.validarContraseña(contraseña);
    if (errorContraseña) {
      this.mostrarMensaje('mensajeRegistro', errorContraseña, 'error');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      this.mostrarMensaje('mensajeRegistro', 'Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          correo,
          contraseña,
          confirmarContraseña,
        }),
      });

      const datos = await respuesta.json();

      if (datos.exito) {
        // Guardar token y usuario
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));

        this.mostrarMensaje('mensajeRegistro', '✓ ' + datos.mensaje, 'exito');

        // Redirigir después de 2 segundos
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2000);
      } else {
        // Manejar errores de validación
        if (datos.errores) {
          const mensajosError = datos.errores
            .map((e) => `${e.campo}: ${e.mensaje}`)
            .join('\n');
          this.mostrarMensaje('mensajeRegistro', '✗ ' + mensajosError, 'error');
        } else {
          this.mostrarMensaje('mensajeRegistro', '✗ ' + datos.mensaje, 'error');
        }
      }
    } catch (error) {
      console.error('Error en registro:', error);
      this.mostrarMensaje('mensajeRegistro', 'Error de conexión con el servidor', 'error');
    }
  }

  // Handle Recuperar Contraseña
  async handleRecuperar(e) {
    e.preventDefault();

    const nombre = document.getElementById('recuperarNombre')?.value;
    const correo = document.getElementById('recuperarCorreo')?.value;
    const contraseñaNueva = document.getElementById('recuperarContraseña')?.value;
    const confirmarContraseña = document.getElementById('recuperarConfirmar')?.value;

    // Validaciones
    if (!nombre || !correo || !contraseñaNueva || !confirmarContraseña) {
      this.mostrarMensaje('mensajeRecuperar', 'Por favor complete todos los campos', 'error');
      return;
    }

    if (nombre.length < 2) {
      this.mostrarMensaje('mensajeRecuperar', 'El nombre debe tener al menos 2 caracteres', 'error');
      return;
    }

    if (!this.validarCorreo(correo)) {
      this.mostrarMensaje('mensajeRecuperar', 'Por favor ingrese un correo válido', 'error');
      return;
    }

    const errorContraseña = this.validarContraseña(contraseñaNueva);
    if (errorContraseña) {
      this.mostrarMensaje('mensajeRecuperar', errorContraseña, 'error');
      return;
    }

    if (contraseñaNueva !== confirmarContraseña) {
      this.mostrarMensaje('mensajeRecuperar', 'Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/recuperar-contraseña`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          correo,
          contraseñaNueva,
          confirmarContraseña,
        }),
      });

      const datos = await respuesta.json();

      if (datos.exito) {
        // Guardar token y usuario
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));

        this.mostrarMensaje('mensajeRecuperar', '✓ ' + datos.mensaje, 'exito');

        // Redirigir después de 2 segundos
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2000);
      } else {
        // Manejar errores de validación
        if (datos.errores) {
          const mensajosError = datos.errores
            .map((e) => `${e.campo}: ${e.mensaje}`)
            .join('\n');
          this.mostrarMensaje('mensajeRecuperar', '✗ ' + mensajosError, 'error');
        } else {
          this.mostrarMensaje('mensajeRecuperar', '✗ ' + datos.mensaje, 'error');
        }
      }
    } catch (error) {
      console.error('Error en recuperar contraseña:', error);
      this.mostrarMensaje('mensajeRecuperar', 'Error de conexión con el servidor', 'error');
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../html/contac_form.html';
  }

  // Verificar si está autenticado
  estaAutenticado() {
    return !!this.token;
  }

  // Obtener token
  getToken() {
    return this.token;
  }

  // Obtener usuario
  getUsuario() {
    return this.usuario;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.auth = new AuthManager();
});
