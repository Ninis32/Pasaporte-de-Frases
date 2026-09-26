const express = require('express');

const router = express.Router();

const {
  obtenerCaminito,
  completarEtapa
} = require('../controllers/caminitoController');

router.get(
  '/:usuarioId/:nivel',
  obtenerCaminito
);

router.post(
  '/completar',
  completarEtapa
);

module.exports = router;