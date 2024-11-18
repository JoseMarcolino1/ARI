const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const env = require('dotenv').config();
const cors =  require('cors');
const swaggerOptions = require('./config/swaggerOptions');


const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importar rotas
const usuarios = require('./src/routes/usuarios');
const remedios = require('./src/routes/remedios');
const prescricao = require('./src/routes/prescricao');
const historico = require('./src/routes/historico');  

// Usar rotas com um prefixo
app.use('/usuarios', usuarios);
app.use('/remedios', remedios);
app.use('/prescricao', prescricao);
app.use('/historico', historico);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log("SERVIDOR TA FUNFANDO");
});
