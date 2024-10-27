const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarios');
// Middleware para autenticação do token
function autenticarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"
  
    if (!token) {
      return res.sendStatus(401); // Sem token
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Token inválido
      }
      req.user = user; // Armazenar os dados do usuário na requisição
      next(); // Passar para o próximo middleware ou rota
    });
  }

router.post('/', autenticarToken, usuarioController.criaUsuario);
router.get('/', autenticarToken, usuarioController.listaUsuario);
router.put('/:id', autenticarToken,  usuarioController.atualizaUsuario);
router.delete('/:id', autenticarToken,  usuarioController.deletaUsuario);
router.post('/login', usuarioController.loginUsuario);


module.exports = router;