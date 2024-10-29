const express = require('express');
const router = express.Router();

const historicoController = require('../controllers/historico');
const {autenticarToken} = require('../authMiddleware');
router.post('/',autenticarToken, historicoController.criaHistorico);
router.get('/', autenticarToken, historicoController.listaHistorico);
router.put('/:id', autenticarToken, historicoController.atualizaHistorico);
router.delete('/:id', autenticarToken, historicoController.deletaHistorico);

module.exports = router;