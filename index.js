const express = require('express');
const prisma = require('./prisma/prismaClient');
const app = express();
app.use(express.json());
// Rota para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha, data_nascimento } = req.body;
    try {
        const novoUsuario = await prisma.usuario.create({
        data: {
        nome,
        email,
        senha,
        data_nascimento: new Date(data_nascimento)
        }
        });
        res.status(201).json(novoUsuario);
    } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário.' });
    }
   });

// Iniciar o servidor
app.listen(3000, () => {
 console.log('Servidor rodando na porta 3000');
});