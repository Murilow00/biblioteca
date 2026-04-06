import ProdutoModel from '../models/LivroModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
        }

        const { id } = req.params;

        if (isNaN(id))
            return res.status(400).json({ error: 'O id enviado não é um número válido' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            removerFoto(req.file.path);
            return res.status(400).json({ error: 'Produto não possui registro' });
        }

        if (produto.foto) {
            await fs.unlink(produto.foto).catch(() => {});
        }

        produto.foto = await processarFoto(req.file.path);

        await produto.atualizar();
        return res.status(201).json({ message: 'Foto salva com sucesso', data });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro interno ao salvar registro' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Registro de produto não encontrado' });
        }

        if (!produto.foto) {
            return res.status(400).json({ error: 'Este produto não tem foto cadastrado' });
        }

        res.sendFile(produto.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro de produtos' });
    }
};
