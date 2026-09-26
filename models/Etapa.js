const mongoose = require('mongoose');

const FraseSchema = new mongoose.Schema(
  {
    ingles: {
      type: String,
      required: true
    },

    traduccion: {
      type: String,
      required: true
    },

    explicacion: {
      type: String,
      default: ''
    },

    pronunciacion: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);


const EjercicioSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: [
        'seleccion',
        'traduccion',
        'completar',
        'ordenar',
        'situacion',
        'desafio'
      ],
      required: true
    },

    instruccion: {
      type: String,
      default: 'Responde correctamente'
    },

    pregunta: {
      type: String,
      required: true
    },

    frase_ingles: {
      type: String,
      default: ''
    },

    frase_traduccion: {
      type: String,
      default: ''
    },

    opciones: {
      type: [String],
      default: []
    },

    respuesta_correcta: {
      type: String,
      required: true
    },

    explicacion: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);


const EtapaSchema = new mongoose.Schema(
  {
    nivel: {
      type: Number,
      required: true
    },

    orden: {
      type: Number,
      required: true
    },

    // Nombre visible en el caminito
    nombre: {
      type: String,
      default: ''
    },

    descripcion: {
      type: String,
      default: ''
    },

    // Frases que el usuario aprenderá
    frases: {
      type: [FraseSchema],
      default: []
    },

    // Ejercicios de la etapa
    ejercicios: {
      type: [EjercicioSchema],
      default: []
    },

    // Información del desafío final
    desafio: {
      titulo: {
        type: String,
        default: 'Desafío final'
      },

      descripcion: {
        type: String,
        default: ''
      }
    },

    // -------------------------------------------------
    // CAMPOS ANTIGUOS
    // Se mantienen para que tu Nivel 1 actual
    // siga funcionando.
    // -------------------------------------------------

    tipo: {
      type: String,
      enum: [
        'seleccion',
        'traduccion',
        'completar',
        'ordenar',
        'situacion'
      ],
      default: 'seleccion'
    },

    instruccion: {
      type: String,
      default: 'Responde correctamente'
    },

    pregunta: {
      type: String,
      default: ''
    },

    frase_ingles: {
      type: String,
      default: ''
    },

    frase_traduccion: {
      type: String,
      default: ''
    },

    opciones: {
      type: [String],
      default: []
    },

    respuesta_correcta: {
      type: String,
      default: ''
    },

    explicacion: {
      type: String,
      default: ''
    },

    imagen_url: {
      type: String,
      default: null
    },

    dificultad: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    }

  },
  {
    timestamps: true
  }
);


EtapaSchema.index(
  {
    nivel: 1,
    orden: 1
  },
  {
    unique: true
  }
);


module.exports =
  mongoose.model(
    'Etapa',
    EtapaSchema
  );