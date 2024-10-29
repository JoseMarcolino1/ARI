const usuarioController = require("./usuarios");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
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
  if (!id_remedio) {
    return res.status(400).json({ message: "O remédio é obrigatório." });
  }

  try {
    const remedio = await prisma.remedio.findUnique({
      where: { id: id_remedio },
    });

    if (!remedio) {
      return res.status(404).json({ message: "Remédio não encontrado." });
    }

    const novaPrescricao = await prisma.prescricao.create({
      data: {
        observacao,
        frequencia_valor,
        frequencia_unidade,
        dt_inicio,
        dt_fim,
        id_remedio,
        id_usuario,
        status,
      },
    });
    res
      .status(201)
      .json({ message: "Prescrição criada com sucesso", novaPrescricao });
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

async function atualizaPrescricao(req, res) {
  const { id } = req.params;
  const { observacao, frequencia, dt_inicio, dt_fim, status } = req.body;
  try {
    const prescricaoAtualizado = await prisma.prescricao.update({
      where: { id: Number(id) },
      data: { observacao, frequencia, dt_inicio, dt_fim, status },
    });
    res
      .status(200)
      .json({
        message: "Prescricao atualizada com sucesso",
        prescricaoAtualizado,
      });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Prescricao não encontrado." }, error);
    }
    res.status(500).json({ message: "Erro ao atualizar a Prescricao." }, error);
  }
}

async function deletaPrescricao(req, res) {
  const { id } = req.params;

  try {
    const prescricaoExcluido = await prisma.prescricao.update({
      where: { id: Number(id) },
      data: {
        status: false,
      },
    });

    res.status(200).json({
      mensagem: "Prescricao excluída logicamente.",
      usuario: {
        id: prescricaoExcluido.id,
        status: prescricaoExcluido.status,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Prescricao não encontrada." });
    }
    res.status(500).json({ error: "Erro ao excluir Prescricao." });
  }
}

module.exports = {
  criaPrescricao,
  listaPrescricao,
  atualizaPrescricao,
  deletaPrescricao,
};
