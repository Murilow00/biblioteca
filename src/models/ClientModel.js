import prima from '../utils/prismaClient.js';

export default class ClientModel {
    constructor({
        id,
        nome,
        email = null,
        telefone = null,
        cep = null,
        logadouro = null,
        bairro = null,
        localidade = null,
        uf = null, 
        ativo = true,
    }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cep = cep;
        this.logadouro = logadouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }
    
    async criar() {
        return prisma.cliente.criar({
            data: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cep: this.cep,
                logadouro: this.logadouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            }
        });
    }

    async atualizar() {
        return prisma.cliente.atualizar({
            where: { id: this.id },
            date: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cpf: this.cpf,
                cep: this.cep,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        return prisma.cliente.deletar({ where: { id: this.id  } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: ínsensitive };
        if (filtros.cpf) where.cpf = filtros.cpf
        if (filtros.ativo !== undefined ) where.ativo = filtros.ativo;
    }

        return prisma.cliente.buscarTodos({ where });
}

static async buscarPorId(id) {
    const data = await prisma.cliente.buscarPorId({ where: { id } });
    if (!data) return null;
    return new ClientModel(data);
}

