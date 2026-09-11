const { token, usuario } = obtenerSesion();

if (!token) {
  window.location.href = 'login.html';
}

let nivelActual = (usuario && usuario.nivel_actual) || 1;
let etapaSeleccionada = null;

document.getElementById('badge-nombre').textContent = usuario ? usuario.nombre : '';
document.getElementById('badge-nivel').textContent = `Nivel ${nivelActual}`;

async function cargarCaminito() {
  try {
    const resp = await fetch(`/api/caminito/${usuario.id}/${nivelActual}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.status === 401) return cerrarSesion();

    const data = await resp.json();
    renderizarTrail(data.caminito, data.nivelCompleto);
  } catch (err) {
    document.getElementById('trail-wrap').innerHTML =
      '<p style="text-align:center; font-family:var(--mono);">No se pudo conectar con el servidor.</p>';
  }
}

function renderizarTrail(etapas, nivelCompleto) {
  const wrap = document.getElementById('trail-wrap');
  wrap.innerHTML = '';

  etapas.forEach((etapa) => {
    const parada = document.createElement('div');
    parada.className = 'parada';

    const nodo = document.createElement('button');
    nodo.className = `parada__nodo ${etapa.estado}`;
    nodo.textContent = etapa.orden;
    nodo.setAttribute('aria-label', `Etapa ${etapa.orden}, ${etapa.estado}`);
    nodo.disabled = etapa.estado === 'bloqueada';
    if (etapa.estado !== 'bloqueada') {
      nodo.addEventListener('click', () => abrirReto(etapa));
    }

    parada.appendChild(nodo);
    wrap.appendChild(parada);
  });

  if (nivelCompleto) {
    const meta = document.createElement('div');
    meta.className = 'meta-final';
    meta.textContent = `¡Nivel ${nivelActual} completo! Preparando el siguiente...`;
    wrap.appendChild(meta);
  }
}

function abrirReto(etapa) {
  etapaSeleccionada = etapa;
  document.getElementById('modal-eyebrow').textContent = `Etapa ${etapa.orden} · Nivel ${nivelActual}`;
  document.getElementById('modal-frase').textContent = etapa.frase_ingles;

  const cont = document.getElementById('modal-opciones');
  cont.innerHTML = '';
  etapa.opciones.forEach((opcion) => {
    const btn = document.createElement('button');
    btn.className = 'opcion';
    btn.textContent = opcion;
    btn.addEventListener('click', () => responder(opcion, btn));
    cont.appendChild(btn);
  });

  document.getElementById('modal-overlay').classList.add('activo');
}

async function responder(respuesta, btnElegido) {
  const botones = document.querySelectorAll('.opcion');
  botones.forEach((b) => (b.disabled = true));

  try {
    const resp = await fetch('/api/caminito/completar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuarioId: usuario.id,
        etapaId: etapaSeleccionada.etapa_id,
        respuesta,
      }),
    });
    const data = await resp.json();

    btnElegido.classList.add(data.correcta ? 'correcta' : 'incorrecta');

    if (data.correcta) {
      setTimeout(() => {
        cerrarModal();
        if (data.nivelCompleto && data.siguienteNivel) {
          nivelActual = data.siguienteNivel;
          document.getElementById('badge-nivel').textContent = `Nivel ${nivelActual}`;
        }
        cargarCaminito();
      }, 700);
    } else {
      setTimeout(() => botones.forEach((b) => (b.disabled = false)), 900);
    }
  } catch (err) {
    botones.forEach((b) => (b.disabled = false));
  }
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('activo');
  document.getElementById('modal-opciones').innerHTML = '';
}

document.getElementById('modal-cerrar').addEventListener('click', cerrarModal);

cargarCaminito();
