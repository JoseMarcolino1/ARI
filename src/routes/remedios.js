const express = require('express');
const router = express.Router();

const remedioController = require('../controllers/remedios');
const autenticarToken = require('../authMiddleware');
router.post('/', autenticarToken, remedioController.criaRemedio);
router.get('/',autenticarToken, remedioController.listaRemedios);
router.put('/remedios/:id', autenticarToken , remedioController.atualizaRemedio);
router.delete('/remedios/:id',autenticarToken, remedioController.deletaRemedio);

module.exports = router;