function mostrarMensaje(texto, tipo) {
  const el = document.getElementById('mensaje');
  el.textContent = texto;
  el.className = `mensaje mensaje--${tipo}`;
}

async function registrar(nombre, email, password) {
  try {
    const resp = await fetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    const data = await resp.json();
    if (!resp.ok) return mostrarMensaje(data.error || 'No se pudo registrar', 'error');

    guardarSesion(data.token, data.usuario);
    mostrarMensaje('¡Cuenta creada! Redirigiendo...', 'ok');
    setTimeout(() => (window.location.href = 'caminito.html'), 700);
  } catch (err) {
    mostrarMensaje('Error de conexión con el servidor', 'error');
  }
}

async function login(email, password) {
  try {
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await resp.json();
    if (!resp.ok) return mostrarMensaje(data.error || 'No se pudo iniciar sesión', 'error');

    guardarSesion(data.token, data.usuario);
    mostrarMensaje('¡Bienvenido de nuevo!', 'ok');
    setTimeout(() => (window.location.href = 'caminito.html'), 500);
  } catch (err) {
    mostrarMensaje('Error de conexión con el servidor', 'error');
  }
}

function guardarSesion(token, usuario) {
  localStorage.setItem('pf_token', token);
  localStorage.setItem('pf_usuario', JSON.stringify(usuario));
}

function obtenerSesion() {
  const token = localStorage.getItem('pf_token');
  const usuario = JSON.parse(localStorage.getItem('pf_usuario') || 'null');
  return { token, usuario };
}

function cerrarSesion() {
  localStorage.removeItem('pf_token');
  localStorage.removeItem('pf_usuario');
  window.location.href = 'login.html';
}
