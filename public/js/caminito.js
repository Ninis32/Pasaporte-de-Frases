const { token, usuario } = obtenerSesion();


if (!token || !usuario) {

  window.location.href =
    'login.html';

  throw new Error(
    'Sesión no encontrada'
  );

}


// =====================================================
// VARIABLES
// =====================================================

let nivelActual =
  Number(usuario.nivel_actual) || 1;


let etapasActuales = [];


let etapaSeleccionada =
  null;


let ejercicioActual =
  0;


let palabrasSeleccionadas =
  [];



// =====================================================
// ATAJO PARA ELEMENTOS HTML
// =====================================================

const $ = id =>
  document.getElementById(id);



// =====================================================
// INFORMACIÓN DEL USUARIO
// =====================================================

$('badge-nombre').textContent =
  usuario.nombre || '';


$('badge-nivel').textContent =
  `Nivel ${nivelActual}`;



// =====================================================
// CARGAR CAMINITO
// =====================================================

async function cargarCaminito() {

  try {

    const resp =
      await fetch(
        `/api/caminito/${usuario.id}/${nivelActual}`,
        {
          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }
      );


    if (
      resp.status === 401
    ) {

      cerrarSesion();

      return;

    }


    const data =
      await resp.json();


    if (!resp.ok) {

      throw new Error(
        data.error ||
        'No se pudo cargar el caminito'
      );

    }


    // ===============================================
    // ACTUALIZAR NIVEL SI EL SERVIDOR LO CAMBIÓ
    // ===============================================

    if (
      data.nivelActual &&
      data.nivelActual !== nivelActual
    ) {

      nivelActual =
        Number(data.nivelActual);


      usuario.nivel_actual =
        nivelActual;


      localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
      );


      $('badge-nivel').textContent =
        `Nivel ${nivelActual}`;

    }


    etapasActuales =
      data.caminito || [];


    renderizarTrail(
      etapasActuales,
      data.nivelCompleto
    );


  } catch (error) {

    console.error(
      'Error cargando caminito:',
      error
    );


    $('trail-wrap').innerHTML =
      `
      <p style="text-align:center;">
        No se pudo conectar con el servidor.
      </p>
      `;

  }

}



// =====================================================
// MOSTRAR CAMINITO
// =====================================================

function renderizarTrail(
  etapas,
  nivelCompleto
) {

  const wrap =
    $('trail-wrap');


  wrap.innerHTML =
    '';


  if (!etapas.length) {

    wrap.innerHTML =
      `
      <p style="text-align:center;">
        Todavía no hay etapas cargadas
        para este nivel.
      </p>
      `;

    return;

  }


  etapas.forEach(
    etapa => {

      const parada =
        document.createElement(
          'div'
        );


      parada.className =
        'parada';



      // =========================================
      // NODO
      // =========================================

      const nodo =
        document.createElement(
          'button'
        );


      nodo.className =
        `parada__nodo ${etapa.estado}`;


      nodo.textContent =
        etapa.orden;


      nodo.setAttribute(
        'aria-label',
        `Etapa ${etapa.orden}: ${
          etapa.nombre || ''
        }`
      );


      nodo.disabled =
        etapa.estado ===
        'bloqueada';



      if (
        etapa.estado !==
        'bloqueada'
      ) {

        nodo.addEventListener(
          'click',
          () =>
            abrirEtapa(etapa)
        );

      }



      // =========================================
      // NOMBRE
      // =========================================

      const titulo =
        document.createElement(
          'div'
        );


      titulo.style.textAlign =
        'center';


      titulo.style.marginTop =
        '0.4rem';


      titulo.style.fontWeight =
        '600';


      titulo.textContent =
        etapa.nombre ||
        `Etapa ${etapa.orden}`;



      // =========================================
      // ESTADO
      // =========================================

      const estado =
        document.createElement(
          'small'
        );


      estado.style.display =
        'block';


      estado.style.textAlign =
        'center';


      estado.style.opacity =
        '0.65';


      estado.textContent =

        etapa.estado ===
        'completada'

          ? '✓ Completada'

          : etapa.estado ===
            'disponible'

            ? 'Disponible'

            : '🔒 Bloqueada';



      parada.appendChild(
        nodo
      );


      parada.appendChild(
        titulo
      );


      parada.appendChild(
        estado
      );


      wrap.appendChild(
        parada
      );

    }
  );



  // ===============================================
  // NIVEL COMPLETO
  // ===============================================

  if (nivelCompleto) {

    const meta =
      document.createElement(
        'div'
      );


    meta.className =
      'meta-final';


    meta.textContent =
      `🎉 ¡Nivel ${nivelActual} completo!`;


    wrap.appendChild(
      meta
    );

  }

}



// =====================================================
// ABRIR ETAPA
// =====================================================

function abrirEtapa(
  etapa
) {

  etapaSeleccionada =
    normalizarEtapa(etapa);


  ejercicioActual =
    0;


  palabrasSeleccionadas =
    [];


  $('pantalla-pregunta')
    .style.display =
    'block';


  $('pantalla-resultado')
    .style.display =
    'none';


  $('modal-overlay')
    .classList.add(
      'activo'
    );



  // ===============================================
  // ENCABEZADO
  // ===============================================

  $('modal-eyebrow')
    .textContent =
    `ETAPA ${etapa.orden} · NIVEL ${nivelActual}`;


  $('modal-titulo')
    .textContent =
    etapa.nombre ||
    `Etapa ${etapa.orden}`;


  $('modal-descripcion')
    .textContent =
    etapa.descripcion ||
    '';



  // ===============================================
  // FRASES
  // ===============================================

  mostrarFrases(
    etapa.frases || []
  );



  // ===============================================
  // PRIMER EJERCICIO
  // ===============================================

  mostrarEjercicio();

}



// =====================================================
// NORMALIZAR ETAPA ANTIGUA
// =====================================================

function normalizarEtapa(
  etapa
) {

  // ===============================================
  // NUEVO SISTEMA
  // ===============================================

  if (
    Array.isArray(
      etapa.ejercicios
    ) &&
    etapa.ejercicios.length
  ) {

    return etapa;

  }



  // ===============================================
  // SISTEMA ANTIGUO
  // ===============================================

  const ejercicio = {

    tipo:
      etapa.tipo ||
      'seleccion',

    instruccion:
      etapa.instruccion ||
      'Responde correctamente',

    pregunta:
      etapa.pregunta ||
      etapa.frase_ingles ||
      '',

    frase_ingles:
      etapa.frase_ingles ||
      '',

    frase_traduccion:
      etapa.frase_traduccion ||
      '',

    opciones:
      etapa.opciones ||
      [],

    respuesta_correcta:
      etapa.respuesta_correcta ||
      '',

    explicacion:
      etapa.explicacion ||
      ''

  };



  return {

    ...etapa,

    frases:

      etapa.frase_ingles

        ? [
            {
              ingles:
                etapa.frase_ingles,

              traduccion:
                etapa.frase_traduccion ||
                '',

              explicacion:
                etapa.explicacion ||
                '',

              pronunciacion:
                ''
            }
          ]

        : [],


    ejercicios:
      [
        ejercicio
      ]

  };

}



// =====================================================
// MOSTRAR FRASES DE LA ETAPA
// =====================================================

function mostrarFrases(
  frases
) {

  const cont =
    $('frases-aprendizaje');


  cont.innerHTML =
    '';


  if (!frases.length) {

    return;

  }


  const titulo =
    document.createElement(
      'p'
    );


  titulo.style.fontWeight =
    '700';


  titulo.textContent =
    '📚 Frases de esta etapa';


  cont.appendChild(
    titulo
  );



  frases.forEach(
    frase => {

      const bloque =
        document.createElement(
          'div'
        );


      bloque.style.padding =
        '0.7rem 0';


      bloque.style.borderBottom =
        '1px solid rgba(0,0,0,0.08)';



      // INGLÉS

      const ingles =
        document.createElement(
          'strong'
        );


      ingles.textContent =
        frase.ingles || '';



      // TRADUCCIÓN

      const traduccion =
        document.createElement(
          'div'
        );


      traduccion.style.opacity =
        '0.8';


      traduccion.textContent =
        frase.traduccion || '';



      bloque.appendChild(
        ingles
      );


      bloque.appendChild(
        traduccion
      );



      // PRONUNCIACIÓN

      if (
        frase.pronunciacion
      ) {

        const pron =
          document.createElement(
            'small'
          );


        pron.style.display =
          'block';


        pron.style.opacity =
          '0.65';


        pron.textContent =
          `🔊 ${frase.pronunciacion}`;


        bloque.appendChild(
          pron
        );

      }



      // EXPLICACIÓN

      if (
        frase.explicacion
      ) {

        const exp =
          document.createElement(
            'small'
          );


        exp.style.display =
          'block';


        exp.style.marginTop =
          '0.25rem';


        exp.textContent =
          `💡 ${frase.explicacion}`;


        bloque.appendChild(
          exp
        );

      }


      cont.appendChild(
        bloque
      );

    }
  );

}



// =====================================================
// MOSTRAR EJERCICIO
// =====================================================

function mostrarEjercicio() {

  const ejercicios =
    etapaSeleccionada.ejercicios ||
    [];


  if (!ejercicios.length) {

    mostrarResultadoFinal(
      'Etapa sin ejercicios'
    );

    return;

  }


  const ejercicio =
    ejercicios[
      ejercicioActual
    ];



  // ===============================================
  // PROGRESO
  // ===============================================

  $('modal-progreso')
    .textContent =
    `Ejercicio ${
      ejercicioActual + 1
    } de ${
      ejercicios.length
    }`;



  // ===============================================
  // DATOS
  // ===============================================

  $('modal-instruccion')
    .textContent =
    ejercicio.instruccion ||
    'Responde correctamente';


  $('modal-frase')
    .textContent =
    ejercicio.frase_ingles ||
    '';


  $('modal-pregunta')
    .textContent =
    ejercicio.pregunta ||
    '';



  // ===============================================
  // LIMPIAR
  // ===============================================

  $('modal-opciones')
    .innerHTML =
    '';


  $('orden-seleccion')
    .textContent =
    '';


  $('orden-confirmar')
    .style.display =
    'none';


  palabrasSeleccionadas =
    [];



  // ===============================================
  // TIPO DE EJERCICIO
  // ===============================================

  if (
    ejercicio.tipo ===
    'ordenar'
  ) {

    crearEjercicioOrdenar(
      ejercicio
    );

  }

  else if (
    ejercicio.tipo ===
      'traduccion' ||

    ejercicio.tipo ===
      'completar'
  ) {

    crearEjercicioTexto(
      ejercicio
    );

  }

  else {

    crearOpciones(
      ejercicio
    );

  }

}



// =====================================================
// EJERCICIOS DE SELECCIÓN
// =====================================================

function crearOpciones(
  ejercicio
) {

  const cont =
    $('modal-opciones');


  const opciones =
    [
      ...(ejercicio.opciones || [])
    ];


  mezclar(
    opciones
  );


  opciones.forEach(
    opcion => {

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
        () =>
          responder(
            opcion,
            btn
          )
      );


      cont.appendChild(
        btn
      );

    }
  );

}



// =====================================================
// TRADUCCIÓN / COMPLETAR
// =====================================================

function crearEjercicioTexto(
  ejercicio
) {

  const cont =
    $('modal-opciones');


  const input =
    document.createElement(
      'input'
    );


  input.type =
    'text';


  input.placeholder =
    'Escribe tu respuesta...';


  input.autocomplete =
    'off';


  input.style.width =
    '100%';


  input.style.padding =
    '0.8rem';


  input.style.marginBottom =
    '0.8rem';



  const btn =
    document.createElement(
      'button'
    );


  btn.className =
    'btn btn--primary';


  btn.textContent =
    'Comprobar';


  btn.addEventListener(
    'click',
    () => {

      const respuesta =
        input.value.trim();


      if (respuesta) {

        responder(
          respuesta,
          btn
        );

      }

    }
  );



  input.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
        'Enter'
      ) {

        btn.click();

      }

    }
  );


  cont.appendChild(
    input
  );


  cont.appendChild(
    btn
  );


  input.focus();

}



// =====================================================
// ORDENAR PALABRAS
// =====================================================

function crearEjercicioOrdenar(
  ejercicio
) {

  const cont =
    $('modal-opciones');


  const palabras =
    [
      ...(ejercicio.opciones || [])
    ];


  mezclar(
    palabras
  );


  palabras.forEach(
    palabra => {

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


      cont.appendChild(
        btn
      );

    }
  );


  $('orden-confirmar')
    .style.display =
    'block';


  $('orden-confirmar')
    .onclick =
    confirmarOrden;

}



// =====================================================
// SELECCIONAR PALABRA
// =====================================================

function seleccionarPalabra(
  palabra,
  boton
) {

  if (
    boton.disabled
  ) {

    return;

  }


  palabrasSeleccionadas.push(
    palabra
  );


  boton.disabled =
    true;


  boton.classList.add(
    'seleccionada'
  );


  $('orden-seleccion')
    .textContent =
    palabrasSeleccionadas.join(
      ' '
    );

}



// =====================================================
// CONFIRMAR ORDEN
// =====================================================

function confirmarOrden() {

  if (
    !palabrasSeleccionadas.length
  ) {

    return;

  }


  const respuesta =
    palabrasSeleccionadas
      .join(' ')
      .trim();


  responder(
    respuesta,
    $('orden-confirmar')
  );

}



// =====================================================
// RESPONDER
// =====================================================

async function responder(
  respuesta,
  btnElegido
) {

  const botones =
    document.querySelectorAll(
      '#modal-opciones button'
    );


  botones.forEach(
    boton => {

      boton.disabled =
        true;

    }
  );


  try {

    const resp =
      await fetch(
        '/api/caminito/completar',
        {

          method:
            'POST',

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

              ejercicioIndex:
                ejercicioActual,

              respuesta:
                respuesta

            })

        }
      );


    const data =
      await resp.json();


    if (!resp.ok) {

      throw new Error(
        data.error ||
        'Error al comprobar'
      );

    }



    // =============================================
    // CORRECTA
    // =============================================

    if (
      data.correcta
    ) {

      if (
        btnElegido?.classList
      ) {

        btnElegido.classList.add(
          'correcta'
        );

      }


      mostrarResultadoEjercicio(
        data
      );


      return;

    }



    // =============================================
    // INCORRECTA
    // =============================================

    if (
      btnElegido?.classList
    ) {

      btnElegido.classList.add(
        'incorrecta'
      );

    }


    mostrarErrorRespuesta(
      data.mensaje ||
      'Respuesta incorrecta'
    );


    setTimeout(
      () => {

        botones.forEach(
          boton => {

            boton.disabled =
              false;

            boton.classList.remove(
              'incorrecta'
            );

          }
        );


        if (
          btnElegido
        ) {

          btnElegido.classList.remove(
            'incorrecta'
          );

        }

      },
      900
    );


  } catch (error) {

    console.error(
      error
    );


    botones.forEach(
      boton => {

        boton.disabled =
          false;

      }
    );


    alert(
      error.message
    );

  }

}



// =====================================================
// MENSAJE ERROR
// =====================================================

function mostrarErrorRespuesta(
  mensaje
) {

  $('modal-instruccion')
    .textContent =
    `❌ ${mensaje}. Inténtalo nuevamente.`;

}



// =====================================================
// RESULTADO DEL EJERCICIO
// =====================================================

function mostrarResultadoEjercicio(
  data
) {

  const ejercicio =
    etapaSeleccionada.ejercicios[
      ejercicioActual
    ];


  $('pantalla-pregunta')
    .style.display =
    'none';


  $('pantalla-resultado')
    .style.display =
    'block';



  // ===============================================
  // TÍTULO
  // ===============================================

  $('resultado-titulo')
    .textContent =

      data.etapaCompleta

        ? '🏆 ¡Etapa dominada!'

        : '🎉 ¡Correcto!';



  // ===============================================
  // INGLÉS
  // ===============================================

  $('resultado-ingles')
    .textContent =

      data.resultado?.ingles ||

      ejercicio.frase_ingles ||

      '';



  // ===============================================
  // TRADUCCIÓN
  // ===============================================

  $('resultado-traduccion')
    .textContent =

      data.resultado?.traduccion ||

      ejercicio.frase_traduccion ||

      '';



  // ===============================================
  // EXPLICACIÓN
  // ===============================================

  $('resultado-explicacion')
    .textContent =

      data.resultado?.explicacion ||

      ejercicio.explicacion ||

      '¡Muy bien!';



  lanzarConfeti();



  // ===============================================
  // BOTÓN
  // ===============================================

  $('btn-continuar')
    .textContent =

      data.etapaCompleta

        ? (
            data.nivelCompleto
              ? 'Continuar →'
              : 'Siguiente etapa →'
          )

        : 'Siguiente ejercicio →';



  $('btn-continuar')
    .onclick =
    () => {


      // =========================================
      // TERMINÓ LA ETAPA
      // =========================================

      if (
        data.etapaCompleta
      ) {

        cerrarModal();


        if (
          data.nivelActual
        ) {

          nivelActual =
            Number(
              data.nivelActual
            );


          usuario.nivel_actual =
            nivelActual;


          localStorage.setItem(
            'usuario',
            JSON.stringify(
              usuario
            )
          );


          $('badge-nivel')
            .textContent =
            `Nivel ${nivelActual}`;

        }


        cargarCaminito();

        return;

      }



      // =========================================
      // SIGUIENTE EJERCICIO
      // =========================================

      ejercicioActual++;


      $('pantalla-resultado')
        .style.display =
        'none';


      $('pantalla-pregunta')
        .style.display =
        'block';


      mostrarEjercicio();

    };

}



// =====================================================
// RESULTADO FINAL
// =====================================================

function mostrarResultadoFinal(
  titulo
) {

  $('pantalla-pregunta')
    .style.display =
    'none';


  $('pantalla-resultado')
    .style.display =
    'block';


  $('resultado-titulo')
    .textContent =
    titulo;


  $('resultado-ingles')
    .textContent =
    '';


  $('resultado-traduccion')
    .textContent =
    '';


  $('resultado-explicacion')
    .textContent =
    'No hay ejercicios disponibles.';

}



// =====================================================
// MEZCLAR ARRAY
// =====================================================

function mezclar(
  array
) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      array[i],
      array[j]
    ] =
    [
      array[j],
      array[i]
    ];

  }

}



// =====================================================
// CONFETI
// =====================================================

function lanzarConfeti() {

  const contenedor =
    $('confeti');


  if (!contenedor) {

    return;

  }


  contenedor.innerHTML =
    '';


  for (
    let i = 0;
    i < 35;
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
// COLORES CONFETI
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
// CERRAR MODAL
// =====================================================

function cerrarModal() {

  $('modal-overlay')
    .classList.remove(
      'activo'
    );


  $('pantalla-pregunta')
    .style.display =
    'block';


  $('pantalla-resultado')
    .style.display =
    'none';


  $('modal-opciones')
    .innerHTML =
    '';


  $('frases-aprendizaje')
    .innerHTML =
    '';


  palabrasSeleccionadas =
    [];


  etapaSeleccionada =
    null;

}



// =====================================================
// BOTÓN CERRAR
// =====================================================

$('modal-cerrar')
  .addEventListener(
    'click',
    cerrarModal
  );



// =====================================================
// CERRAR HACIENDO CLICK FUERA
// =====================================================

$('modal-overlay')
  .addEventListener(
    'click',
    event => {

      if (
        event.target ===
        $('modal-overlay')
      ) {

        cerrarModal();

      }

    }
  );



// =====================================================
// INICIAR
// =====================================================

cargarCaminito();