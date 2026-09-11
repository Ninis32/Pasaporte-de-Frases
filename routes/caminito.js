const express = require('express');
const router = express.Router();
const caminitoController = require('../controllers/caminitoController');
const verificarToken = require('../middleware/auth');

router.get('/:usuarioId/:nivel', verificarToken, caminitoController.obtenerCaminito);
router.post('/completar', verificarToken, caminitoController.completarEtapa);

module.exports = router;
