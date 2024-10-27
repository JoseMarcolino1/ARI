const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const prisma = new PrismaClient();

router.use(express.json());

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: boolean
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - data_nascimento
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário criado
 */
async function criaUsuario(req, res) {
  const { nome, email, senha, data_nascimento, status } = req.body;
  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        data_nascimento: new Date(data_nascimento),
        status: status !== undefined ? status : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao criar usuário.", details: error.message });
  }
}

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
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
 *                   email:
 *                     type: string
 *                   status:
 *                     type: boolean
 */
async function listaUsuario(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        status: true,
      },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar usuários." });
  }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */
async function atualizaUsuario(req, res) {
  const { id } = req.params;
  const { nome, email, senha, data_nascimento, status } = req.body;
  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        ...(nome && { nome }),
        ...(email && { email }),
        ...(senha && { senha }),
        ...(data_nascimento && { data_nascimento: new Date(data_nascimento) }),
        ...(status !== undefined && { status }),
        updatedAt: new Date(),
      },
    });
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.status(500).json({ error: "Erro ao atualizar usuário.", details: error.message }); // Adiciona detalhes do erro para depuração
  }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário logicamente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser excluído
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído logicamente
 */
async function deletaUsuario(req, res) {
  const { id } = req.params;

  try {
    const usuarioExcluido = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        status: false,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      mensagem: "Usuário excluído logicamente.",
      usuario: {
        id: usuarioExcluido.id,
        status: usuarioExcluido.status,
        updatedAt: usuarioExcluido.updatedAt
      }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
}

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *             required:
 *               - email
 *               - senha
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
async function loginUsuario(req, res) {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email: email },
    });
    console.log('Usuário encontrado:', usuario);

    if (!usuario) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha correta:', senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    if (!process.env.SECRET_JWT) {
      console.error("SECRET_JWT não está definido!");
      return res.status(500).json({ message: "Erro no servidor: SECRET_JWT não definido." });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.SECRET_JWT, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao autenticar usuário." });
  }
}



module.exports = {
  criaUsuario,
  listaUsuario,
  atualizaUsuario,
  deletaUsuario,
  loginUsuario,
};