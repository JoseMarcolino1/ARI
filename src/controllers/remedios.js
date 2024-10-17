const remedio = use(express.json());
remedio.post("/remedios", async (req, res) => {
  const { nome, funcao, dosagem, status } = req.body;
  try {
    const novoRemedio = await prisma.usuario.create({
      data: {
        nome,
        funcao,
        dosagem,
        status,
      },
    });
    res.status(201).json(novoRemedio);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar um novo remedio." });
  }
});


remedio.get("/remedios", async (req, res) => {
  try {
    const remedios = await prisma.remedio.findMany({
      where: {
        deletedAt: null, 
      },
    });
    res.status(200).json(remedios);
  } catch (error) {
    
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
});

remedio.put("/remedios/:id", async (req, res) => {
  const { id } = req.params; 
  const { nome, funcao, dosagem, status } = req.body; 
  try {
    const remedioAtualizado = await prisma.remedio.update({
      where: { id: Number(id) }, 
      data: {
        nome,
        funcao,
        dosagem,
        status,
      },
    });
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Remedio não encontrado." });
    }
    res.status(500).json({ error: "Erro ao atualizar o remedio." });
  }
});

remedio.delete("/remedios/:id", async (req, res) => {
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


module.exports = {remedio};
