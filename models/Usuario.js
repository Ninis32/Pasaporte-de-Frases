const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  nivel_actual: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
