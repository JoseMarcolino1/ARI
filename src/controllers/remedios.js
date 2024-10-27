const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

// Rota para criar um remédio
async function criaRemedio(req, res) {
  const { nome, funcao, dosagem, status = true } = req.body;
  try {
    const novoRemedio = await prisma.remedio.create({
      data: { nome, funcao, dosagem, status },
    });
    res.status(201).json(novoRemedio);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar remédio." });
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
    res.status(500).json({ message: "Erro ao listar remédios." });
  }
}

// Rota para atualizar um remédio
async function atualizaRemedio(req, res) {
  const { id } = req.params;
  const { nome, funcao, dosagem, status } = req.body;
  try {
    const remedioAtualizado = await prisma.remedio.update({
      where: { id: Number(id) },
      data: { nome, funcao, dosagem, status },
    });
    res.status(200).json(remedioAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Remédio não encontrado." });
    }
    res.status(500).json({ error: "Erro ao atualizar remédio." });
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
    res.status(200).json({ mensagem: "Remédio excluído logicamente.", remedio: remedioExcluido });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Remédio não encontrado." });
    }
    res.status(500).json({ error: "Erro ao excluir remédio." });
  }
}

// Exporta as funções para uso em outras partes da aplicação
module.exports = {
  criaRemedio,
  listaRemedios,
  atualizaRemedio,
  deletaRemedio,
};