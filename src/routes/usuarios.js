const express = require('express');
const router = express.Router();

const usuarioController = require('../controller/usuarios');

router.post('/usuarios', usuarioController.cadastrarUsuario);

module.exports = router;