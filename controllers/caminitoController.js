const Etapa = require('../models/Etapa');
const Progreso = require('../models/Progreso');

const ETAPAS_POR_NIVEL = 10;

/**
 * GET /api/caminito/:usuarioId/:nivel
 * Devuelve las 10 etapas del nivel con su estado: bloqueada / disponible / completada
 */
exports.obtenerCaminito = async (req, res) => {
  try {
    const { usuarioId, nivel } = req.params;
    const nivelNum = parseInt(nivel, 10);

    const etapas = await Etapa.find({ nivel: nivelNum }).sort({ orden: 1 });
    const progresos = await Progreso.find({ usuario_id: usuarioId, nivel: nivelNum });

    const progresoPorOrden = {};
    progresos.forEach(p => { progresoPorOrden[p.orden] = p; });

    let siguienteDisponible = 1;
    const caminito = etapas.map(etapa => {
      const prog = progresoPorOrden[etapa.orden];
      const completada = !!(prog && prog.completado);
      if (completada) siguienteDisponible = etapa.orden + 1;

      let estado = 'bloqueada';
      if (completada) estado = 'completada';
      else if (etapa.orden === siguienteDisponible) estado = 'disponible';

      return {
        etapa_id: etapa._id,
        orden: etapa.orden,
        tipo: etapa.tipo,
        dificultad: etapa.dificultad,
        imagen_url: etapa.imagen_url,
        estado,
        // No mandamos frase_ingles ni respuesta_correcta si está bloqueada, para evitar trampa
        frase_ingles: estado === 'bloqueada' ? null : etapa.frase_ingles,
        opciones: estado === 'bloqueada' ? [] : etapa.opciones,
      };
    });

    const nivelCompleto = progresos.filter(p => p.completado).length >= ETAPAS_POR_NIVEL;

    res.json({ nivel: nivelNum, caminito, nivelCompleto });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo caminito', detalle: err.message });
  }
};

/**
 * POST /api/caminito/completar
 * body: { usuarioId, etapaId, respuesta }
 * Valida la respuesta y marca la etapa como completada si es correcta
 */
exports.completarEtapa = async (req, res) => {
  try {
    const { usuarioId, etapaId, respuesta } = req.body;

    const etapa = await Etapa.findById(etapaId);
    if (!etapa) return res.status(404).json({ error: 'Etapa no encontrada' });

    const esCorrecta = respuesta.trim().toLowerCase() === etapa.respuesta_correcta.trim().toLowerCase();

    let progreso = await Progreso.findOne({ usuario_id: usuarioId, etapa_id: etapaId });
    if (!progreso) {
      progreso = new Progreso({
        usuario_id: usuarioId,
        etapa_id: etapaId,
        nivel: etapa.nivel,
        orden: etapa.orden,
      });
    }

    progreso.intentos += 1;
    if (esCorrecta) {
      progreso.completado = true;
      progreso.fecha_completado = new Date();
    }
    await progreso.save();

    // Revisar si con esto se completó el nivel entero
    const totalCompletadas = await Progreso.countDocuments({
      usuario_id: usuarioId,
      nivel: etapa.nivel,
      completado: true,
    });
    const nivelCompleto = totalCompletadas >= ETAPAS_POR_NIVEL;

    res.json({
      correcta: esCorrecta,
      intentos: progreso.intentos,
      siguienteNivel: nivelCompleto ? etapa.nivel + 1 : null,
      nivelCompleto,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error completando etapa', detalle: err.message });
  }
};
