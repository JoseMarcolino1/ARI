const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const env = require('dotenv').config();


const app = express();
const PORT = 3000;

app.use(express.json());

// Configuração do Swagger JSDoc
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de remedios',
        version: '1.0.0',
        description: 'API para gerenciar remedios',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./src/controllers/*.js', './src/routes/*.js'],  
  };

// Cria a documentação Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importar rotas
const usuarios = require('./src/routes/usuarios');

// Usar rotas com um prefixo
app.use('/usuarios', usuarios);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log("SERVIDOR TA FUNFANDO");
});
