// src/config/swaggerOptions.js

module.exports = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Remédios',
        version: '1.0.0',
        description: 'API para gerenciar remédios',
      },
      servers: [
        {
          url: 'http://localhost:3000', 
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
  };
  