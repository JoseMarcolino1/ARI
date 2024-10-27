const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarios');
const autenticarToken = require('../authMiddleware');

router.post('/', autenticarToken, usuarioController.criaUsuario);
router.get('/', autenticarToken, usuarioController.listaUsuario);
router.put('/:id', autenticarToken,  usuarioController.atualizaUsuario);
router.delete('/:id', autenticarToken,  usuarioController.deletaUsuario);
router.post('/login', usuarioController.loginUsuario);


module.exports = router;