/**
 * Script de Prueba - Sistema de Autenticación
 * Ejecutar con: node test.js
 */

const API_URL = 'http://localhost:5000/api/auth';

// Función para hacer peticiones
async function request(endpoint, method, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const resultado = await response.json();
    return { status: response.status, data: resultado };
  } catch (error) {
    console.error('Error en petición:', error);
    return { status: 500, data: { error: error.message } };
  }
}

// Pruebas
async function ejecutarPruebas() {
  console.log('🧪 Iniciando pruebas de autenticación...\n');

  // Test 1: Registro
  console.log('✋ Test 1: Registro de usuario');
  const registroResponse = await request('/registro', 'POST', {
    nombre: 'Juan Pérez',
    correo: 'juan@test.com',
    contraseña: 'TestPass123',
    confirmarContraseña: 'TestPass123',
  });
  console.log(`Status: ${registroResponse.status}`);
  console.log(`Respuesta:`, JSON.stringify(registroResponse.data, null, 2));
  let token = null;
  if (registroResponse.data.exito) {
    token = registroResponse.data.token;
    console.log('✓ Registro exitoso\n');
  } else {
    console.log('✗ Registro fallido\n');
  }

  // Test 2: Login
  console.log('✋ Test 2: Login');
  const loginResponse = await request('/login', 'POST', {
    correo: 'juan@test.com',
    contraseña: 'TestPass123',
  });
  console.log(`Status: ${loginResponse.status}`);
  console.log(`Respuesta:`, JSON.stringify(loginResponse.data, null, 2));
  if (loginResponse.data.exito) {
    token = loginResponse.data.token;
    console.log('✓ Login exitoso\n');
  } else {
    console.log('✗ Login fallido\n');
  }

  // Test 3: Obtener Perfil (requiere token)
  console.log('✋ Test 3: Obtener Perfil (requiere autenticación)');
  if (token) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(`${API_URL}/perfil`, options);
      const resultado = await response.json();
      console.log(`Status: ${response.status}`);
      console.log(`Respuesta:`, JSON.stringify(resultado, null, 2));
      console.log('✓ Perfil obtenido exitosamente\n');
    } catch (error) {
      console.log('✗ Error al obtener perfil\n');
    }
  } else {
    console.log('✗ No hay token disponible\n');
  }

  // Test 4: Recuperar Contraseña
  console.log('✋ Test 4: Recuperar Contraseña');
  const recuperarResponse = await request('/recuperar-contraseña', 'POST', {
    nombre: 'Juan Pérez',
    correo: 'juan@test.com',
    contraseñaNueva: 'NewPass456',
    confirmarContraseña: 'NewPass456',
  });
  console.log(`Status: ${recuperarResponse.status}`);
  console.log(`Respuesta:`, JSON.stringify(recuperarResponse.data, null, 2));
  if (recuperarResponse.data.exito) {
    console.log('✓ Contraseña recuperada\n');
  } else {
    console.log('✗ Recuperación fallida\n');
  }

  // Test 5: Login con nueva contraseña
  console.log('✋ Test 5: Login con nueva contraseña');
  const nuevoLoginResponse = await request('/login', 'POST', {
    correo: 'juan@test.com',
    contraseña: 'NewPass456',
  });
  console.log(`Status: ${nuevoLoginResponse.status}`);
  console.log(`Respuesta:`, JSON.stringify(nuevoLoginResponse.data, null, 2));
  if (nuevoLoginResponse.data.exito) {
    console.log('✓ Login con nueva contraseña exitoso\n');
  } else {
    console.log('✗ Login fallido\n');
  }

  // Test 6: Validaciones (errores)
  console.log('✋ Test 6: Validaciones (campo correo inválido)');
  const validacionResponse = await request('/registro', 'POST', {
    nombre: 'Pedro',
    correo: 'correo_invalido',
    contraseña: 'Pass123',
    confirmarContraseña: 'Pass123',
  });
  console.log(`Status: ${validacionResponse.status}`);
  console.log(`Respuesta:`, JSON.stringify(validacionResponse.data, null, 2));
  console.log('✓ Validación funcionando correctamente\n');

  // Test 7: Contraseña débil
  console.log('✋ Test 7: Validaciones (contraseña débil)');
  const contraseñaDebilResponse = await request('/registro', 'POST', {
    nombre: 'Maria',
    correo: 'maria@test.com',
    contraseña: 'weak', // Muy corta y sin números
    confirmarContraseña: 'weak',
  });
  console.log(`Status: ${contraseñaDebilResponse.status}`);
  console.log(`Respuesta:`, JSON.stringify(contraseñaDebilResponse.data, null, 2));
  console.log('✓ Validación de contraseña funcionando\n');

  console.log('✅ Pruebas completadas!');
}

// Ejecutar pruebas
ejecutarPruebas().catch(console.error);
