const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blackListToken, verifyToken } = require("../authMiddleware");

const prisma = new PrismaClient();

router.use(express.json());


async function criaUsuario(req, res) {
  const { nome, email, senha, data_nascimento, status } = req.body;
  try {
    // Verifica se a data está no formato correto
    if (!data_nascimento || isNaN(new Date(data_nascimento).getTime())) {
      throw new Error("Data de nascimento inválida.");
    }
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
    res
      .status(400)
      .json({ error: "Erro ao criar usuário.", details: error.message });
  }
}


async function listaUsuario(req, res) {
  const id_usuario = req.user?.id;
  try {
    console.log("ID USUARIO:", id_usuario);
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
    res.status(200).json({
      message: "Usuario atualizado com sucesso",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res
      .status(500)
      .json({ error: "Erro ao atualizar usuário.", details: error.message });
  }
}


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
        updatedAt: usuarioExcluido.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
}


async function loginUsuario(req, res) {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email: email },
    });
    console.log("Usuário encontrado:", usuario);

    if (!usuario) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    console.log("Senha correta:", senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    if (!process.env.SECRET_JWT) {
      console.error("SECRET_JWT não está definido!");
      return res
        .status(500)
        .json({ message: "Erro no servidor: SECRET_JWT não definido." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.SECRET_JWT,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao autenticar usuário." });
  }
}

async function logout(req, res) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  try {
    if (token) {
      blackListToken(token);
      res.status(200).json({ message: "Logout realizado com sucesso" });
    } else {
      res.status(400).json({ message: "Token não fornecido" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deslogar" });
  }
}

module.exports = {
  criaUsuario,
  listaUsuario,
  atualizaUsuario,
  deletaUsuario,
  loginUsuario,
  logout,
};
