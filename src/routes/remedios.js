const express = require('express');
const router = express.Router();

const remedioController = require('../controllers/remedios');

router.post('/remedios', remedioController.cadastrarUsuario);

module.exports = router;