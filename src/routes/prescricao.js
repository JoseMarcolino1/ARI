const express = require('express');
const router = express.Router();

const prescricaoController = require('../controllers/prescricao');
const {autenticarToken} = require('../authMiddleware');
router.post('/',autenticarToken, prescricaoController.criaPrescricao);
router.get('/', autenticarToken, prescricaoController.listaPrescricao);

module.exports = router;