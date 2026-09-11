const mongoose = require('mongoose');

const EtapaSchema = new mongoose.Schema({
  nivel: {
    type: Number,
    required: true, // 1, 2, 3...
  },
  orden: {
    type: Number,
    required: true, // posición dentro del nivel (1 a 10)
  },
  tipo: {
    type: String,
    enum: ['frase', 'cancion', 'pelicula'],
    default: 'frase',
  },
  frase_ingles: {
    type: String,
    required: true,
  },
  frase_traduccion: {
    type: String,
    required: true,
  },
  opciones: {
    type: [String], // opciones multiple choice, incluye la correcta
    default: [],
  },
  respuesta_correcta: {
    type: String,
    required: true,
  },
  imagen_url: {
    type: String,
    default: null,
  },
  dificultad: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
}, { timestamps: true });

// Un solo índice por nivel+orden (no se repiten etapas)
EtapaSchema.index({ nivel: 1, orden: 1 }, { unique: true });

module.exports = mongoose.model('Etapa', EtapaSchema);
