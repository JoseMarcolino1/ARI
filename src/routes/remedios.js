const express = require('express');
const router = express.Router();

const remedioController = require('../controllers/remedios');
const token = require('../authMiddleware');
router.post('/', token.autenticarToken, remedioController.criaRemedio);
router.get('/',token.autenticarToken, remedioController.listaRemedios);
router.put('/:id', token.autenticarToken , remedioController.atualizaRemedio);
router.delete('/:id',token.autenticarToken, remedioController.deletaRemedio);

module.exports = router;