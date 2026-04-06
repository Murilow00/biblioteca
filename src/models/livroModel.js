import prisma from '../utils/prismaClient.js';

export default class livroModel {
    constructor({
        id,
        nome,
        descricao = null,
        categoria = null,
        preco = null,
        disponivel = true,
        foto = null,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.preco = preco;
        this.disponivel = disponivel;
        this.foto = foto;
    }

    async criar() {

        if (this.categoria !== undefined) {
            const tipos = ["fantasia", "terror", "aventura", "investigação"]
            if (!this.categoria.includes(tipos.toLowerCase())) {
                return res.status(400).json({
                    total: 0,
                    mensagem: `Tipo inválido. Tipos aceitos: ${tipos.join(', ')}`,
                });
            }
        }

        if (this.preco <= 0) {
            return res.status(400).json({
                total: 0,
                mensagem: "O preço de um livro não pode ser menor ou igual 0    "
            })
        }

        if (this.disponivel != true) {
            return res.status(400).json({
                mensagem: "Não é permitido o uso de um livro indisponível"
            })
        }


        return prisma.livro.create({
            data: {
                nome: this.nome,
                descricao: this.estado,
                categoria: this.categoria,
                disponivel: this.disponivel,
                preco: this.preco,
                foto: this.foto,
            },
        });
    }

    async atualizar() {
        return prisma.livro.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.estado,
                categoria: this.categoria,
                disponivel: this.disponivel,
                preco: this.preco,
                foto: this.foto,
            },
        });
    }

    async deletar() {
        return prisma.livro.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
         if (filtros.categoria) {
             where.categoria = { contains: filtros.categoria, mode: 'insensitive' };
         }
        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true';
        }

        return prisma.livro.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.livro.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new livroModel(data);
    }

}
