const usuarioController = require('./usuarios');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();
router.use(express.json());


async function criaPrescricao(req, res) {
  const {
    observacao,
    frequencia_valor,
    frequencia_unidade,
    dt_inicio,
    dt_fim,
    id_remedio,
    status = true,
  } = req.body;

  const id_usuario = req.userId;
  // Validação do id doremedio
  if (!id_remedio) {
    return res.status(400).json({ message: "O remédio é obrigatório." });
  }

  try {
    // Verifica se o remedio existe
    const remedio = await prisma.remedio.findUnique({
      where: { id: id_remedio },
    });

    if (!remedio) {
      return res.status(404).json({ message: "Remédio não encontrado." });
    }

    const novaPrescricao = await prisma.prescricao.create({
      data: { observacao, frequencia_valor, frequencia_unidade,dt_inicio, dt_fim, id_remedio, id_usuario, status },
    });
    res.status(201).json({ message: "Prescrição criada com sucesso", novaPrescricao });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar a prescrição." });
  }
}

async function listaPrescricao(req, res) {
    try {
      const prescricao = await prisma.prescricao.findMany({
        where: {
          status: true,
        },
      });
      res.status(200).json(prescricao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar usuários." });
    }
  }

module.exports ={
    criaPrescricao,
    listaPrescricao
}