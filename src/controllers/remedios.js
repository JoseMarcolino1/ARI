const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());


/**
 * @swagger
 * /remedios:
 *   post:
 *     summary: Cria um novo remedio
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
 *               - status
 *     responses:
 *       201:
 *         description: Remedio criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do Remedio criado
 */
async function criaRemedio(req, res) {
  const { nome, funcao, dosagem, status = true } = req.body;
  try {
    const novoRemedio = await prisma.remedio.create({
      data: { nome, funcao, dosagem, status },
    });
    res.status(201).json(novoRemedio);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Erro ao criar remédio." }, error);
    res.status(400).json({ error: "Erro ao criar remédio." }, error);
  }
}

// Rota para listar remédios
async function listaRemedios(req, res) {
  try {
    const remedios = await prisma.remedio.findMany({
      where: { status: true },
    });
    res.status(200).json(remedios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar remédios." }, error);
  }
}

// Rota para atualizar um remédio
async function atualizaRemedio(req, res) {
  const { id } = req.params;
  const { nome, funcao, dosagem, status = true } = req.body;
  try {
    const remedioAtualizado = await prisma.remedio.update({
      where: { id: Number(id) },
      data: { nome, funcao, dosagem, status },
    });
    res.status(200).json({message: "Remedio atualizado com sucesso", remedioAtualizado});
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Remédio não encontrado." }, error);
    }
    res.status(500).json({ message: "Erro ao atualizar remédio." }, error);
  }
}

// Rota para excluir logicamente um remédio
async function deletaRemedio(req, res) {
  const { id } = req.params;
  try {
    const remedioExcluido = await prisma.remedio.update({
      where: { id: Number(id) },
      data: { status: false },
    });
    res.status(200).json({ message: "Remédio excluído.", remedio: remedioExcluido });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Remédio não encontrado." }, error);
    }
    res.status(500).json({ message: "Erro ao excluir remédio." }, error);
  }
}

// Exporta as funções para uso em outras partes da aplicação
module.exports = {
  criaRemedio,
  listaRemedios,
  atualizaRemedio,
  deletaRemedio,
};