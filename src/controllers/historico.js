const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { atualizaPrescricao } = require("./prescricao");
const router = express.Router();
const prisma = new PrismaClient();
router.use(express.json());

async function criaHistorico(req, res) {
  const { dt_atual, id_prescricao, status = true } = req.body;

  if (!id_prescricao) {
    return res.status(400).json({ message: "A Historico é obrigatório." });
  }

  try {
    const prescricao = await prisma.prescricao.findUnique({
      where: { id: id_prescricao },
    });

    if (!prescricao) {
      return res.status(404).json({ message: "Historico não encontrado." });
    }

    const novoHistorico = await prisma.historico.create({
      data: {
        dt_atual: new Date(),
        id_prescricao,
      },
    });
    res
      .status(201)
      .json({ message: "Historico criada com sucesso", novoHistorico });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar a Historico." });
  }
}

async function listaHistorico(req, res) {
  try {
    const historico = await prisma.historico.findMany({
      where: {
        status: true,
      },
    });
    res.status(200).json({ historico });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar o historico." });
  }
}

async function atualizaHistorico (req, res) {
    const {id} = req.params;
    const {dt_atual, id_prescricao, status} = req.body;
    try {
        const historicoAtualizado = await prisma.historico.update({
            where: {id: Number(id)},
            data:{
                ...(dt_atual && {dt_atual}),
                ...(id_prescricao && {id_prescricao}),
                ...(status !== undefined && {status}),
            }
        }); 
        res.status(200).json({message: "Historico atualizado com sucesso", historico: historicoAtualizado});
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({message: "Historico não encontrado."});
        }
        res.status(500).json({message: "Erro ao atualizar historico."});
        console.error(error); 

    }
}

async function deletaHistorico(req, res) {
  const { id } = req.params;
  try {
    const historicoExcluido = await prisma.historico.update({
      where: { id: Number(id) },
      data: { status: false },
    });
    res.status(200).json({ message: "Historico excluído.", historico: historicoExcluido });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Historico não encontrado." }, error);
    }
    res.status(500).json({ message: "Erro ao excluir historico." }, error);
  }
}

module.exports = {
  criaHistorico,
  listaHistorico,
  atualizaHistorico,
  deletaHistorico,
};
