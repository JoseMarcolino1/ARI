const express = require('express');

const app = express();

// Importar rotas
const usuarios = require('./routes/usuarios');

// Usar rotas
app.use(usuarios);

// Iniciar o servidor
app.listen(3000, () => {
 console.log('Servidor rodando na porta 3000');
});