const Etapa = require('../models/Etapa');
const Progreso = require('../models/Progreso');
const Usuario = require('../models/Usuario');

const ETAPAS_POR_NIVEL = 10;


// =====================================================
// OBTENER CAMINITO
// =====================================================

exports.obtenerCaminito = async (req, res) => {

  try {

    const {
      usuarioId,
      nivel
    } = req.params;

    const nivelNumero =
      Number(nivel);


    if (!usuarioId || !nivelNumero) {

      return res.status(400).json({
        error: 'Usuario o nivel inválido'
      });

    }


    const etapas =
      await Etapa.find({
        nivel: nivelNumero
      })
      .sort({
        orden: 1
      })
      .lean();


    const progresos =
      await Progreso.find({
        usuario_id: usuarioId,
        nivel: nivelNumero
      })
      .lean();


    const progresoMap =
      new Map();


    progresos.forEach(
      progreso => {

        progresoMap.set(
          String(progreso.etapa_id),
          progreso
        );

      }
    );


    const caminito =
      etapas.map(
        (etapa, index) => {

          const progreso =
            progresoMap.get(
              String(etapa._id)
            );


          let estado =
            'bloqueada';


          if (index === 0) {

            estado =
              progreso?.completado
                ? 'completada'
                : 'disponible';

          } else {

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

              ejercicios: []

            };

          }


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

            // Campos antiguos
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

            explicacion:
              etapa.explicacion || '',

            dificultad:
              etapa.dificultad

          };

        }
      );


    const completadas =
      progresos.filter(
        p =>
          p.completado === true
      ).length;


    const nivelCompleto =
      completadas >=
      ETAPAS_POR_NIVEL;


    const usuario =
      await Usuario.findById(
        usuarioId
      ).select(
        'nivel_actual nombre email'
      );


    res.json({

      nivel:
        nivelNumero,

      nivelActual:
        usuario?.nivel_actual ||
        nivelNumero,

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
      !ejercicios[indice]
    ) {

      return res.status(400).json({

        error:
          'Ejercicio no encontrado'

      });

    }


    const ejercicio =
      ejercicios[indice];


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
    // PROGRESO
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
    // INCORRECTO
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


    // Siguiente ejercicio
    progreso.ejercicio_actual =
      indice + 1;


    const etapaCompleta =
      progreso.ejercicios_completados.length >=
      ejercicios.length;


    let nivelCompleto =
      false;


    let nivelActual;


    // =================================================
    // ETAPA COMPLETADA
    // =================================================

    if (etapaCompleta) {

      progreso.completado =
        true;

      progreso.fecha_completado =
        new Date();


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
        etapasCompletadas >=
        ETAPAS_POR_NIVEL;


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


      // Solo avanzar si terminó
      // el nivel que está cursando
      if (
        nivelCompleto &&
        etapa.nivel === nivelActual
      ) {

        nivelActual += 1;

        usuario.nivel_actual =
          nivelActual;

        await usuario.save();

      }

    }


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