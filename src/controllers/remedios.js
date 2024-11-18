const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

async function criaRemedio(req, res) {

  const { nome, funcao, dosagem, status = true } = req.body;
  const dosagemNumerica = parseFloat(dosagem.replace(/[^0-9]/g, ''));

  if (isNaN(dosagemNumerica)) {
    return res.status(400).json({ error: "Dosagem inválida." });
  }
  
  try {
    const novoRemedio = await prisma.remedio.create({
      data: { nome, funcao, dosagem: dosagemNumerica, status },
    });
    res.status(201).json(novoRemedio);
  } catch (error) {
    console.error('Erro ao criar remédio:', error);
    res.status(400).json({ error: "Erro ao criar remédio." });
  }
}

async function listaRemedios(req, res) {
  try {
    const remedios = await prisma.remedio.findMany({
      where: { status: true },
    });
    res.status(200).json(remedios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar remédios." });
  }
}

async function atualizaRemedio(req, res) {
  const { id } = req.params;
  const { nome, funcao, dosagem, status = true } = req.body;
  try {
    const remedioAtualizado = await prisma.remedio.update({
      where: { id: Number(id) },
      data: { nome, funcao, dosagem, status },
    });
    res.status(200).json(remedioAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar remédio." });
  }
}

async function deletaRemedio(req, res) {
  const { id } = req.params;
  try {
    const remedioExcluido = await prisma.remedio.update({
      where: { id: Number(id) },
      data: { status: false },
    });
    res.status(200).json(remedioExcluido);
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir remédio." });
  }
}

module.exports = {
  criaRemedio,
  listaRemedios,
  atualizaRemedio,
  deletaRemedio,
};
