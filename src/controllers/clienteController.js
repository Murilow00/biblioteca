import ClienteModel from '../models/ClientModel.js';

export const criar = async (req, res) => {
    try {
        const { nome, telefone, email, cep } = req.body;

        ClienteModel.validarNome(nome);
        const cepValidado = ClienteModel.validarCep(cep);

        let endereco = null;
        try {
            endereco = await ClienteModel.buscarEnderecoPorCep(cepValidado);
        } catch (erroCep) {
            return res.status(400).json({ error: "CEP inválido ou não encontrado.", error: erroCep });
        }

        const cliente = new ClienteModel({
            nome,
            telefone: ClienteModel.limparTexto(telefone),
            email,
            cep: cepValidado,
            logradouro: endereco.logradouro || null,
            localidade: endereco.localidade || null,
            uf: endereco.uf || null,
            ativo: true,
        });

        const resultado = await cliente.criar();
        return res.status(201).json({ message: 'Cliente criado com sucesso!', cliente: resultado });
    } catch (error) {
        return res.status(400).json({ error: "Erro ao criar cliente.", error });
    }
};

export const atualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cliente = await ClienteModel.buscarPorId(id);

        if (!cliente) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }


        if (!cliente.ativo) {
            return res.status(400).json({ error: 'Operação não permitida para registro inativo.' });
        }

        if (req.body.cep && req.body.cep !== cliente.cep) {
            const cepValidado = ClienteModel.validarCep(req.body.cep);
            const novoEnd = await ClienteModel.buscarEnderecoPorCep(cepValidado);
            cliente.logradouro = novoEnd.logradouro;
            cliente.localidade = novoEnd.localidade;
            cliente.uf = novoEnd.uf;
            cliente.cep = cepValidado;
        }

        if (req.body.nome) {
            ClienteModel.validarNome(req.body.nome);
            cliente.nome = req.body.nome;
        }

        cliente.email = req.body.email ?? cliente.email;
        cliente.telefone = ClienteModel.limparTexto(req.body.telefone) || cliente.telefone;
        cliente.ativo = req.body.ativo ?? cliente.ativo;

        const resultado = await cliente.atualizar();
        return res.json(resultado);
    } catch (error) {
        return res.status(400).json({ error: "Erro ao atualizar cliente.", error });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const clientes = await ClienteModel.buscarTodos(req.query);
        return res.json(clientes);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar clientes.", error });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cliente = await ClienteModel.buscarPorId(id);
        if (!cliente) return res.status(404).json({ error: 'Registro não encontrado.' });
        return res.json(cliente);
    } catch (error) {
        return res.status(400).json({ error: "Erro ao buscar cliente.", error });
    }
};

export const deletar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cliente = await ClienteModel.buscarPorId(id);

        if (!cliente) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        cliente.ativo = false;
        await cliente.atualizar();

        return res.json({ message: 'Cliente desativado com sucesso!' });
    } catch (error) {
        return res.status(400).json({ error: "Erro ao desativar cliente.", error });
    }
};
