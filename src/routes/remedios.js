const express = require('express');
const router = express.Router();

const remedioController = require('../controllers/remedios');

router.post('/', remedioController.criaRemedio);
router.get('/', remedioController.listaRemedios);
router.put('/remedios/:id', remedioController.atualizaRemedio);
router.delete('/remedios/:id', remedioController.deletaRemedio);

module.exports = router;