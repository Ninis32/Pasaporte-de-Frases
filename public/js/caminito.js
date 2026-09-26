const { token, usuario } = obtenerSesion();

if (!token) {
  window.location.href = 'login.html';
}

let nivelActual = (usuario && usuario.nivel_actual) || 1;
let etapaSeleccionada = null;
let palabrasSeleccionadas = [];


// =====================================================
// INFORMACIÓN DEL USUARIO
// =====================================================

document.getElementById('badge-nombre').textContent =
  usuario ? usuario.nombre : '';

document.getElementById('badge-nivel').textContent =
  `Nivel ${nivelActual}`;


// =====================================================
// CARGAR CAMINITO
// =====================================================

async function cargarCaminito() {
  try {
    const resp = await fetch(
      `/api/caminito/${usuario.id}/${nivelActual}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (resp.status === 401) {
      return cerrarSesion();
    }

    const data = await resp.json();

    renderizarTrail(
      data.caminito,
      data.nivelCompleto
    );

  } catch (error) {

    console.error(
      'Error cargando caminito:',
      error
    );

    document.getElementById('trail-wrap').innerHTML =
      '<p style="text-align:center;">No se pudo conectar con el servidor.</p>';
  }
}


// =====================================================
// MOSTRAR LAS ETAPAS
// =====================================================

function renderizarTrail(etapas, nivelCompleto) {

  const wrap = document.getElementById('trail-wrap');

  wrap.innerHTML = '';

  etapas.forEach((etapa) => {

    const parada = document.createElement('div');

    parada.className = 'parada';


    const nodo = document.createElement('button');

    nodo.className =
      `parada__nodo ${etapa.estado}`;

    nodo.textContent =
      etapa.orden;

    nodo.setAttribute(
      'aria-label',
      `Etapa ${etapa.orden}, ${etapa.estado}`
    );

    nodo.disabled =
      etapa.estado === 'bloqueada';


    if (etapa.estado !== 'bloqueada') {

      nodo.addEventListener(
        'click',
        () => abrirReto(etapa)
      );

    }


    parada.appendChild(nodo);

    wrap.appendChild(parada);

  });


  if (nivelCompleto) {

    const meta = document.createElement('div');

    meta.className = 'meta-final';

    meta.textContent =
      `¡Nivel ${nivelActual} completo!`;

    wrap.appendChild(meta);

  }
}


// =====================================================
// ABRIR RETO
// =====================================================

function abrirReto(etapa) {

  etapaSeleccionada = etapa;

  // Limpiar respuestas anteriores
  palabrasSeleccionadas = [];


  // Mostrar pantalla de pregunta
  document.getElementById(
    'pantalla-pregunta'
  ).style.display = 'block';


  // Ocultar resultado anterior
  document.getElementById(
    'pantalla-resultado'
  ).style.display = 'none';


  // Encabezado
  document.getElementById(
    'modal-eyebrow'
  ).textContent =
    `Etapa ${etapa.orden} · Nivel ${nivelActual}`;


  // Instrucción
  document.getElementById(
    'modal-instruccion'
  ).textContent =
    etapa.instruccion ||
    'Responde correctamente';


  // Pregunta
  document.getElementById(
    'modal-frase'
  ).textContent =
    etapa.pregunta ||
    etapa.frase_ingles ||
    '';


  // Limpiar alternativas
  const cont =
    document.getElementById(
      'modal-opciones'
    );

  cont.innerHTML = '';


  // Limpiar frase ordenada
  const seleccion =
    document.getElementById(
      'orden-seleccion'
    );

  if (seleccion) {

    seleccion.textContent = '';

  }


  // Ocultar botón comprobar
  const confirmar =
    document.getElementById(
      'orden-confirmar'
    );

  if (confirmar) {

    confirmar.style.display = 'none';

    confirmar.disabled = false;

  }


  // Crear tipo de ejercicio
  if (etapa.tipo === 'ordenar') {

    crearEjercicioOrdenar(etapa);

  } else {

    crearOpcionesNormales(etapa);

  }


  // Mostrar modal
  document.getElementById(
    'modal-overlay'
  ).classList.add('activo');
}


// =====================================================
// OPCIONES NORMALES
// =====================================================

function crearOpcionesNormales(etapa) {

  const cont =
    document.getElementById(
      'modal-opciones'
    );


  // Copiar opciones para NO modificar
  // las opciones originales de MongoDB
  const opcionesMezcladas =
    [...etapa.opciones];


  // ===================================================
  // MEZCLAR ALEATORIAMENTE
  // Algoritmo Fisher-Yates
  // ===================================================

  for (
    let i = opcionesMezcladas.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      opcionesMezcladas[i],
      opcionesMezcladas[j]
    ] = [
      opcionesMezcladas[j],
      opcionesMezcladas[i]
    ];

  }


  // Crear botones
  opcionesMezcladas.forEach(
    (opcion) => {

      const btn =
        document.createElement(
          'button'
        );


      btn.className =
        'opcion';


      btn.textContent =
        opcion;


      btn.addEventListener(
        'click',
        () => responder(
          opcion,
          btn
        )
      );


      cont.appendChild(btn);

    }
  );
}


// =====================================================
// EJERCICIO: ORDENAR PALABRAS
// =====================================================

function crearEjercicioOrdenar(etapa) {

  const cont =
    document.getElementById(
      'modal-opciones'
    );


  // Copiar palabras
  const palabrasMezcladas =
    [...etapa.opciones];


  // ===================================================
  // MEZCLAR PALABRAS
  // ===================================================

  for (
    let i = palabrasMezcladas.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      palabrasMezcladas[i],
      palabrasMezcladas[j]
    ] = [
      palabrasMezcladas[j],
      palabrasMezcladas[i]
    ];

  }


  // Crear botones
  palabrasMezcladas.forEach(
    (palabra) => {

      const btn =
        document.createElement(
          'button'
        );


      btn.className =
        'opcion';


      btn.textContent =
        palabra;


      btn.addEventListener(
        'click',
        () =>
          seleccionarPalabra(
            palabra,
            btn
          )
      );


      cont.appendChild(btn);

    }
  );


  // Mostrar botón comprobar
  const confirmar =
    document.getElementById(
      'orden-confirmar'
    );


  if (confirmar) {

    confirmar.style.display =
      'block';

    confirmar.disabled =
      false;

    confirmar.onclick =
      confirmarOrden;

  }
}


// =====================================================
// SELECCIONAR PALABRA
// =====================================================

function seleccionarPalabra(
  palabra,
  boton
) {

  // Evitar seleccionar dos veces
  if (boton.disabled) {

    return;

  }


  palabrasSeleccionadas.push(
    palabra
  );


  boton.disabled = true;


  boton.classList.add(
    'seleccionada'
  );


  actualizarFraseOrdenada();
}


// =====================================================
// MOSTRAR FRASE ORDENADA
// =====================================================

function actualizarFraseOrdenada() {

  const seleccion =
    document.getElementById(
      'orden-seleccion'
    );


  if (!seleccion) {

    return;

  }


  seleccion.textContent =
    palabrasSeleccionadas.join(
      ' '
    );
}


// =====================================================
// CONFIRMAR ORDEN
// =====================================================

async function confirmarOrden() {

  if (
    palabrasSeleccionadas.length === 0
  ) {

    return;

  }


  const respuesta =
    palabrasSeleccionadas
      .join(' ')
      .trim();


  console.log(
    'Respuesta enviada:',
    respuesta
  );


  // Desactivar botones
  const botones =
    document.querySelectorAll(
      '#modal-opciones .opcion'
    );


  botones.forEach(
    (boton) => {

      boton.disabled = true;

    }
  );


  const confirmar =
    document.getElementById(
      'orden-confirmar'
    );


  if (confirmar) {

    confirmar.disabled = true;

  }


  await enviarRespuesta(
    respuesta,
    null,
    botones
  );
}


// =====================================================
// RESPONDER OPCIONES NORMALES
// =====================================================

async function responder(
  respuesta,
  btnElegido
) {

  const botones =
    document.querySelectorAll(
      '#modal-opciones .opcion'
    );


  // Desactivar todas
  botones.forEach(
    (boton) => {

      boton.disabled = true;

    }
  );


  await enviarRespuesta(
    respuesta,
    btnElegido,
    botones
  );
}


// =====================================================
// ENVIAR RESPUESTA AL SERVIDOR
// =====================================================

async function enviarRespuesta(
  respuesta,
  btnElegido,
  botones
) {

  try {

    const resp =
      await fetch(
        '/api/caminito/completar',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body:
            JSON.stringify({

              usuarioId:
                usuario.id,

              etapaId:
                etapaSeleccionada.etapa_id,

              respuesta:
                respuesta

            })

          }
        );


    const data =
      await resp.json();


    console.log(
      'Respuesta del servidor:',
      data
    );


    // =================================================
    // RESPUESTA CORRECTA
    // =================================================

    if (data.correcta) {

      if (btnElegido) {

        btnElegido.classList.add(
          'correcta'
        );

      }


      mostrarResultado();

      return;

    }


    // =================================================
    // RESPUESTA INCORRECTA
    // =================================================

    if (btnElegido) {

      btnElegido.classList.add(
        'incorrecta'
      );

    }


    // Si es ordenar
    if (
      etapaSeleccionada &&
      etapaSeleccionada.tipo ===
        'ordenar'
    ) {

      setTimeout(
        () => {

          resetearOrden();

        },
        900
      );

    }

    // Si es una pregunta normal
    else {

      setTimeout(
        () => {

          botones.forEach(
            (boton) => {

              boton.disabled =
                false;

            }
          );

        },
        900
      );

    }


  } catch (error) {

    console.error(
      'Error enviando respuesta:',
      error
    );


    // Reactivar botones
    botones.forEach(
      (boton) => {

        boton.disabled =
          false;

      }
    );


    const confirmar =
      document.getElementById(
        'orden-confirmar'
      );


    if (confirmar) {

      confirmar.disabled =
        false;

    }

  }
}


// =====================================================
// REINICIAR EJERCICIO DE ORDENAR
// =====================================================

function resetearOrden() {

  palabrasSeleccionadas = [];


  const seleccion =
    document.getElementById(
      'orden-seleccion'
    );


  if (seleccion) {

    seleccion.textContent =
      '';

  }


  const botones =
    document.querySelectorAll(
      '#modal-opciones .opcion'
    );


  botones.forEach(
    (boton) => {

      boton.disabled =
        false;


      boton.classList.remove(
        'incorrecta'
      );


      boton.classList.remove(
        'correcta'
      );


      boton.classList.remove(
        'seleccionada'
      );

    }
  );


  const confirmar =
    document.getElementById(
      'orden-confirmar'
    );


  if (confirmar) {

    confirmar.disabled =
      false;

  }
}


// =====================================================
// MOSTRAR RESULTADO
// =====================================================

function mostrarResultado() {

  const etapa =
    etapaSeleccionada;


  // Ocultar pregunta
  document.getElementById(
    'pantalla-pregunta'
  ).style.display =
    'none';


  // Mostrar resultado
  const resultado =
    document.getElementById(
      'pantalla-resultado'
    );


  resultado.style.display =
    'block';


  // Título
  document.getElementById(
    'resultado-titulo'
  ).textContent =
    '🎉 ¡Correcto!';


  // Inglés
  document.getElementById(
    'resultado-ingles'
  ).textContent =
    etapa.frase_ingles ||
    '';


  // Traducción
  document.getElementById(
    'resultado-traduccion'
  ).textContent =
    etapa.frase_traduccion ||
    '';


  // Explicación
  document.getElementById(
    'resultado-explicacion'
  ).textContent =
    etapa.explicacion ||
    '¡Muy bien! Has respondido correctamente.';


  // Confeti
  lanzarConfeti();
}


// =====================================================
// CONFETI
// =====================================================

function lanzarConfeti() {

  const contenedor =
    document.getElementById(
      'confeti'
    );


  if (!contenedor) {

    return;

  }


  contenedor.innerHTML =
    '';


  const cantidad =
    35;


  for (
    let i = 0;
    i < cantidad;
    i++
  ) {

    const pieza =
      document.createElement(
        'div'
      );


    pieza.className =
      'confeti';


    pieza.style.left =
      `${Math.random() * 100}%`;


    pieza.style.animationDelay =
      `${Math.random() * 0.4}s`;


    pieza.style.background =
      obtenerColorConfeti();


    contenedor.appendChild(
      pieza
    );

  }
}


// =====================================================
// COLORES DEL CONFETI
// =====================================================

function obtenerColorConfeti() {

  const colores = [

    '#F4C95D',

    '#5B8E7D',

    '#D95D5D',

    '#6C8EBF',

    '#E8A87C',

    '#7A6C9D'

  ];


  return colores[
    Math.floor(
      Math.random() *
      colores.length
    )
  ];
}


// =====================================================
// CONTINUAR DESPUÉS DEL RESULTADO
// =====================================================

document
  .getElementById(
    'btn-continuar'
  )
  .addEventListener(
    'click',
    continuarDespuesDeResultado
  );


function continuarDespuesDeResultado() {

  cerrarModal();

  cargarCaminito();
}


// =====================================================
// CERRAR MODAL
// =====================================================

function cerrarModal() {

  document
    .getElementById(
      'modal-overlay'
    )
    .classList.remove(
      'activo'
    );


  document.getElementById(
    'modal-opciones'
  ).innerHTML =
    '';


  palabrasSeleccionadas =
    [];


  const seleccion =
    document.getElementById(
      'orden-seleccion'
    );


  if (seleccion) {

    seleccion.textContent =
      '';

  }


  document.getElementById(
    'pantalla-pregunta'
  ).style.display =
    'block';


  document.getElementById(
    'pantalla-resultado'
  ).style.display =
    'none';
}


// =====================================================
// BOTÓN CERRAR
// =====================================================

document
  .getElementById(
    'modal-cerrar'
  )
  .addEventListener(
    'click',
    cerrarModal
  );


// =====================================================
// INICIAR
// =====================================================

cargarCaminito();