import LivroModel from '../models/livroModel.js'
import ClienteModel from '../models/clienteModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, descricao, categoria, preco, disponivel, foto, clienteId } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }

        if (preco === undefined || preco === null) {
            return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
        }

        if (!cliente) {
            return res.status(400).json({ error: 'O campo "clienteId" é obrigatório!' });
        }

        const cliente = await ClienteModel.buscarPorId(parseInt(clienteId));

        if (!clienteId) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        const livro = new LivroModel({
            nome,
            descricao,
            categoria,
            preco: parseFloat(preco),
            disponivel: disponivel !== undefined ? disponivel : true,
            foto,
            clienteId: parseInt(clienteId)
        });

        const data= await livro.criar();

        return res.status(201).json({
            message: 'Registro criado com suceso!',
            data
        });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};