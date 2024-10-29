const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarios');
const token = require('../authMiddleware');

router.post('/',token.autenticarToken,usuarioController.criaUsuario);
router.get('/', token.autenticarToken, usuarioController.listaUsuario);
router.put('/:id', token.autenticarToken,  usuarioController.atualizaUsuario);
router.delete('/:id', token.autenticarToken,  usuarioController.deletaUsuario);
router.post('/login', usuarioController.loginUsuario);

module.exports = router;