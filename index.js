const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

// Importar rotas
const usuarios = require('./src/routes/usuarios');

// Usar rotas com um prefixo
app.use('/usuarios', usuarios);


app.listen(PORT, () => {
    console.log("SERVIDOR TA FUNFANDO")
})