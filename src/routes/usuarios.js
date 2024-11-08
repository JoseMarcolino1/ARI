const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarios');
const token = require('../authMiddleware');

router.post('/',usuarioController.criaUsuario);
router.get('/', token.autenticarToken, usuarioController.listaUsuario);
router.put('/:id', token.autenticarToken,  usuarioController.atualizaUsuario);
router.delete('/:id', token.autenticarToken,  usuarioController.deletaUsuario);
router.post('/login', usuarioController.loginUsuario);
router.post('/logout', token.autenticarToken, usuarioController.logout);

module.exports = router;