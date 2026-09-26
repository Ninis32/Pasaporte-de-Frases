const mongoose = require('mongoose');

const ProgresoSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },

    etapa_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Etapa',
      required: true
    },

    nivel: {
      type: Number,
      required: true
    },

    orden: {
      type: Number,
      required: true
    },

    completado: {
      type: Boolean,
      default: false
    },

    // Ejercicio en el que va
    ejercicio_actual: {
      type: Number,
      default: 0
    },

    // Ejercicios que ya completó
    ejercicios_completados: {
      type: [Number],
      default: []
    },

    intentos: {
      type: Number,
      default: 0
    },

    fecha_completado: {
      type: Date,
      default: null
    }

  },
  {
    timestamps: true
  }
);


ProgresoSchema.index(
  {
    usuario_id: 1,
    etapa_id: 1
  },
  {
    unique: true
  }
);


module.exports =
  mongoose.model(
    'Progreso',
    ProgresoSchema
  );