const Etapa = require('../models/Etapa');
const Progreso = require('../models/Progreso');
const Usuario = require('../models/Usuario');


// =====================================================
// OBTENER CAMINITO
// =====================================================

exports.obtenerCaminito = async (req, res) => {

  try {

    const {
      usuarioId,
      nivel
    } = req.params;

    const nivelNumero = Number(nivel);


    if (!usuarioId || !nivelNumero) {

      return res.status(400).json({
        error: 'Usuario o nivel inválido'
      });

    }


    // =================================================
    // OBTENER TODAS LAS ETAPAS DEL NIVEL
    // =================================================

    const etapas = await Etapa.find({
      nivel: nivelNumero
    })
      .sort({
        orden: 1
      })
      .lean();


    // =================================================
    // OBTENER PROGRESO DEL USUARIO
    // =================================================

    const progresos = await Progreso.find({
      usuario_id: usuarioId,
      nivel: nivelNumero
    }).lean();


    const progresoMap = new Map();


    progresos.forEach(progreso => {

      progresoMap.set(
        String(progreso.etapa_id),
        progreso
      );

    });


    // =================================================
    // CONSTRUIR CAMINITO
    // =================================================

    const caminito = etapas.map(
      (etapa, index) => {

        const progreso =
          progresoMap.get(
            String(etapa._id)
          );


        let estado = 'bloqueada';


        // -------------------------------------------------
        // PRIMERA ETAPA
        // -------------------------------------------------

        if (index === 0) {

          estado =
            progreso?.completado
              ? 'completada'
              : 'disponible';

        }


        // -------------------------------------------------
        // RESTO DE ETAPAS
        // -------------------------------------------------

        else {

          const anterior =
            etapas[index - 1];


          const progresoAnterior =
            progresoMap.get(
              String(anterior._id)
            );


          if (
            progresoAnterior &&
            progresoAnterior.completado
          ) {

            estado =
              progreso?.completado
                ? 'completada'
                : 'disponible';

          }

        }


        // -------------------------------------------------
        // ETAPA BLOQUEADA
        // -------------------------------------------------

        if (
          estado === 'bloqueada'
        ) {

          return {

            etapa_id:
              etapa._id,

            orden:
              etapa.orden,

            nombre:
              etapa.nombre,

            descripcion:
              etapa.descripcion,

            estado,

            frases: [],

            ejercicios: [],

            desafio: null

          };

        }


        // -------------------------------------------------
        // ETAPA DISPONIBLE / COMPLETADA
        // -------------------------------------------------

        return {

          etapa_id:
            etapa._id,

          orden:
            etapa.orden,

          nombre:
            etapa.nombre,

          descripcion:
            etapa.descripcion,

          estado,

          frases:
            etapa.frases || [],

          ejercicios:
            etapa.ejercicios || [],

          desafio:
            etapa.desafio || null,


          // =============================================
          // COMPATIBILIDAD CON NIVEL 1 ANTIGUO
          // =============================================

          tipo:
            etapa.tipo,

          instruccion:
            etapa.instruccion,

          pregunta:
            etapa.pregunta,

          frase_ingles:
            etapa.frase_ingles,

          frase_traduccion:
            etapa.frase_traduccion,

          opciones:
            etapa.opciones || [],

          respuesta_correcta:
            etapa.respuesta_correcta || '',

          explicacion:
            etapa.explicacion || '',

          dificultad:
            etapa.dificultad

        };

      }
    );


    // =================================================
    // COMPROBAR SI EL NIVEL ESTÁ COMPLETO
    // =================================================

    const nivelCompleto =
      etapas.length > 0 &&
      etapas.every(etapa => {

        const progreso =
          progresoMap.get(
            String(etapa._id)
          );

        return progreso?.completado === true;

      });


    // =================================================
    // OBTENER USUARIO
    // =================================================

    const usuario =
      await Usuario.findById(
        usuarioId
      ).select(
        'nivel_actual nombre email'
      );


    if (!usuario) {

      return res.status(404).json({
        error: 'Usuario no encontrado'
      });

    }


    let nivelActual =
      usuario.nivel_actual || 1;


    // =================================================
    // SINCRONIZAR NIVEL
    //
    // Si el usuario ya había terminado el nivel,
    // avanzamos automáticamente al siguiente.
    // =================================================

    if (
      nivelCompleto &&
      nivelNumero === nivelActual
    ) {

      const siguienteNivelExiste =
        await Etapa.exists({
          nivel: nivelNumero + 1
        });


      if (siguienteNivelExiste) {

        usuario.nivel_actual =
          nivelNumero + 1;

        await usuario.save();

        nivelActual =
          nivelNumero + 1;

      }

    }


    // =================================================
    // RESPUESTA
    // =================================================

    res.json({

      nivel:
        nivelNumero,

      nivelActual,

      totalEtapas:
        etapas.length,

      caminito,

      etapas:
        caminito,

      nivelCompleto

    });

  } catch (error) {

    console.error(
      'Error obteniendo caminito:',
      error
    );


    res.status(500).json({

      error:
        'Error obteniendo el caminito',

      detalle:
        error.message

    });

  }

};


// =====================================================
// COMPLETAR EJERCICIO
// =====================================================

exports.completarEtapa = async (
  req,
  res
) => {

  try {

    const {
      usuarioId,
      etapaId,
      ejercicioIndex,
      respuesta
    } = req.body;


    if (
      !usuarioId ||
      !etapaId ||
      ejercicioIndex === undefined ||
      respuesta === undefined
    ) {

      return res.status(400).json({

        error:
          'Faltan datos para completar el ejercicio'

      });

    }


    // =================================================
    // BUSCAR ETAPA
    // =================================================

    const etapa =
      await Etapa.findById(
        etapaId
      );


    if (!etapa) {

      return res.status(404).json({

        error:
          'Etapa no encontrada'

      });

    }


    const ejercicios =
      etapa.ejercicios || [];


    const indice =
      Number(ejercicioIndex);


    if (
      !Number.isInteger(indice) ||
      !ejercicios[indice]
    ) {

      return res.status(400).json({

        error:
          'Ejercicio no encontrado'

      });

    }


    const ejercicio =
      ejercicios[indice];


    // =================================================
    // COMPARAR RESPUESTA
    // =================================================

    const respuestaUsuario =
      String(respuesta)
        .trim()
        .toLowerCase();


    const respuestaCorrecta =
      String(
        ejercicio.respuesta_correcta
      )
        .trim()
        .toLowerCase();


    const correcta =
      respuestaUsuario ===
      respuestaCorrecta;


    // =================================================
    // BUSCAR / CREAR PROGRESO
    // =================================================

    let progreso =
      await Progreso.findOne({

        usuario_id:
          usuarioId,

        etapa_id:
          etapaId

      });


    if (!progreso) {

      progreso =
        new Progreso({

          usuario_id:
            usuarioId,

          etapa_id:
            etapaId,

          nivel:
            etapa.nivel,

          orden:
            etapa.orden,

          completado:
            false,

          ejercicio_actual:
            0,

          ejercicios_completados:
            [],

          intentos:
            0

        });

    }


    progreso.intentos =
      (progreso.intentos || 0) + 1;


    // =================================================
    // RESPUESTA INCORRECTA
    // =================================================

    if (!correcta) {

      await progreso.save();


      return res.json({

        correcta:
          false,

        intentos:
          progreso.intentos,

        mensaje:
          'Respuesta incorrecta'

      });

    }


    // =================================================
    // MARCAR EJERCICIO COMPLETADO
    // =================================================

    if (
      !progreso.ejercicios_completados.includes(
        indice
      )
    ) {

      progreso.ejercicios_completados.push(
        indice
      );

    }


    progreso.ejercicio_actual =
      indice + 1;


    // =================================================
    // COMPROBAR ETAPA COMPLETA
    // =================================================

    const etapaCompleta =
      ejercicios.length > 0 &&
      progreso.ejercicios_completados.length >=
      ejercicios.length;


    let nivelCompleto = false;

    let nivelActual;


    // =================================================
    // SI TERMINÓ TODA LA ETAPA
    // =================================================

    if (etapaCompleta) {

      progreso.completado =
        true;


      progreso.fecha_completado =
        new Date();


      // ===============================================
      // CUÁNTAS ETAPAS TIENE REALMENTE EL NIVEL
      // ===============================================

      const totalEtapasNivel =
        await Etapa.countDocuments({

          nivel:
            etapa.nivel

        });


      // ===============================================
      // CUÁNTAS HA COMPLETADO EL USUARIO
      // ===============================================

      const etapasCompletadas =
        await Progreso.countDocuments({

          usuario_id:
            usuarioId,

          nivel:
            etapa.nivel,

          completado:
            true

        });


      nivelCompleto =
        totalEtapasNivel > 0 &&
        etapasCompletadas >=
        totalEtapasNivel;


      // ===============================================
      // USUARIO
      // ===============================================

      const usuario =
        await Usuario.findById(
          usuarioId
        );


      if (!usuario) {

        return res.status(404).json({

          error:
            'Usuario no encontrado'

        });

      }


      nivelActual =
        usuario.nivel_actual || 1;


      // ===============================================
      // AVANZAR AL SIGUIENTE NIVEL
      // ===============================================

      if (
        nivelCompleto &&
        etapa.nivel === nivelActual
      ) {

        const siguienteNivelExiste =
          await Etapa.exists({

            nivel:
              etapa.nivel + 1

          });


        if (siguienteNivelExiste) {

          nivelActual =
            etapa.nivel + 1;


          usuario.nivel_actual =
            nivelActual;


          await usuario.save();

        }

      }

    }


    // =================================================
    // GUARDAR PROGRESO
    // =================================================

    await progreso.save();


    // =================================================
    // RESPUESTA
    // =================================================

    res.json({

      correcta:
        true,

      ejercicioIndex:
        indice,

      ejercicioCompleto:
        true,

      etapaCompleta,

      nivelCompleto,

      nivelActual,

      resultado: {

        ingles:
          ejercicio.frase_ingles || '',

        traduccion:
          ejercicio.frase_traduccion || '',

        explicacion:
          ejercicio.explicacion || ''

      }

    });

  } catch (error) {

    console.error(
      'Error completando ejercicio:',
      error
    );


    res.status(500).json({

      error:
        'Error completando ejercicio',

      detalle:
        error.message

    });

  }

};