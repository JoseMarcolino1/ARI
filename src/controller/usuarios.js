const cadastrarUsuario = use(express.json());
// Rota para criar um novo usuário
cadastrarUsuario.post("/usuarios", async (req, res) => {
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
    res.status(400).json({ error: "Erro ao criar usuário." });
  }
});


cadastrarUsuario.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        deletedAt: null, 
      },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
});

cadastrarUsuario.put("/usuarios/:id", async (req, res) => {
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
});

cadastrarUsuario.delete("/usuarios/:id", async (req, res) => {
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
});


module.exports = {cadastrarUsuario};
