const mongoose = require('mongoose');

const ProgresoSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario', // ajustalo al nombre real de tu modelo de usuario
  },
  etapa_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Etapa',
  },
  nivel: {
    type: Number,
    required: true,
  },
  orden: {
    type: Number,
    required: true,
  },
  completado: {
    type: Boolean,
    default: false,
  },
  intentos: {
    type: Number,
    default: 0,
  },
  fecha_completado: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

ProgresoSchema.index({ usuario_id: 1, etapa_id: 1 }, { unique: true });

module.exports = mongoose.model('Progreso', ProgresoSchema);
