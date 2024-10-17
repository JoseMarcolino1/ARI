const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router(); 

const prisma = new PrismaClient(); // Cria uma instância do Prisma

router.use(express.json());

// Rota para criar um usuário
async function criaUsuario (req, res) {
  const { nome, email, senha, data_nascimento } = req.body;
  try {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        data_nascimento: new Date(data_nascimento),
      },
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar usuário." });
  }
};

// Rota para listar usuários
async function listaUsuario (req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        deletedAt: null, 
      },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao listar usuários." });
  }
};

// Rota para atualizar um usuário
async function atualizaUsuario (req, res) {
  const { id } = req.params; 
  const { nome, email, senha, data_nascimento } = req.body; 
  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) }, 
      data: {
        nome,
        email,
        senha,
        data_nascimento: new Date(data_nascimento),
      },
    });
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

// Rota para excluir um usuário
async function deletaUsuario(req, res)  {
  const { id } = req.params; 

  try {
    const usuarioExcluido = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() }, 
    });

    res.status(200).json({ mensagem: "Usuário excluído logicamente.", usuario: usuarioExcluido });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
};

module.exports = {
  criaUsuario,
  listaUsuario,
  atualizaUsuario,
  deletaUsuario,
}; 
