const express = require('express');
const router = express.Router();

const remedioController = require('../controllers/remedios');
const token = require('../authMiddleware');

/**
 * @swagger
 * /remedios:
 *   post:
 *     summary: Cria um novo remédio
 *     tags: [Remédios]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               funcao:
 *                 type: string
 *               dosagem:
 *                 type: string
 *               status:
 *                 type: boolean
 *             required:
 *               - nome
 *               - funcao
 *               - dosagem
 *     responses:
 *       201:
 *         description: Remédio criado com sucesso
 *       400:
 *         description: Erro ao criar remédio
 *       401:
 *         description: Token de autenticação inválido ou ausente
 */
router.post('/', token.autenticarToken, remedioController.criaRemedio);

/**
 * @swagger
 * /remedios:
 *   get:
 *     summary: Lista todos os remédios ativos
 *     tags: [Remédios]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Lista de remédios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   funcao:
 *                     type: string
 *                   dosagem:
 *                     type: string
 *                   status:
 *                     type: boolean
 *       401:
 *         description: Token de autenticação inválido ou ausente
 */
router.get('/', token.autenticarToken, remedioController.listaRemedios);

/**
 * @swagger
 * /remedios/{id}:
 *   put:
 *     summary: Atualiza um remédio
 *     tags: [Remédios]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do remédio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               funcao:
 *                 type: string
 *               dosagem:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Remédio atualizado com sucesso
 *       404:
 *         description: Remédio não encontrado
 *       401:
 *         description: Token de autenticação inválido ou ausente
 */
router.put('/:id', token.autenticarToken, remedioController.atualizaRemedio);

/**
 * @swagger
 * /remedios/{id}:
 *   delete:
 *     summary: Exclui um remédio logicamente
 *     tags: [Remédios]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do remédio
 *     responses:
 *       200:
 *         description: Remédio excluído com sucesso
 *       404:
 *         description: Remédio não encontrado
 *       401:
 *         description: Token de autenticação inválido ou ausente
 */
router.delete('/:id', token.autenticarToken, remedioController.deletaRemedio);

module.exports = router;
