const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarios');

router.post('/', usuarioController.criaUsuario);
router.get('/', usuarioController.listaUsuario);
router.put('/usuarios/:id', usuarioController.deletaUsuario);
router.delete('/usuarios/:id', usuarioController.atualizaUsuario);


module.exports = router;