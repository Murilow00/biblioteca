import prisma from '../utils/prismaClient.js';

export default class ClienteModel {
    constructor({
        id, nome, telefone, email, cep,
        logradouro = null, localidade = null, uf = null, ativo = true,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cep = cep;
        this.logradouro = logradouro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    async criar() {
        return prisma.cliente.create({
            data: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cep: this.cep,
                logradouro: this.logradouro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        return prisma.cliente.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cep: this.cep,
                logradouro: this.logradouro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.email) where.email = { contains: filtros.email, mode: 'insensitive' };
        if (filtros.localidade) where.localidade = { contains: filtros.localidade, mode: 'insensitive' };

        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });
        if (!data) return null;
        return new this(data);
    }

       static limparTexto(texto) {
        if (!texto) return '';
        return texto
            .split('')
            .filter((caractere) => caractere >= '0' && caractere <= '9')
            .join('');
    }


    static async buscarEnderecoPorCep(cep) {
        const cepLimpo = this.limparTexto(cep);
        if (cepLimpo.length !== 8) return null;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (data.erro) {
                throw new Error(`CEP não encontrado.`);
            }
            return data;
        } catch (error) {
            if (error.message.includes('não encontrado')) {
                throw error;
            }
            throw new Error('Serviço externo indisponível.');
        }
    }

    static validarNome(nome) {
        if (!nome || nome.length < 3 || nome.length > 100) {
            throw new Error('O nome deve ter de 3 a 100 caracteres.');
        }
    }

    static validarCep(cep) {
        const cepLimpo = this.limparTexto(cep);
        if (cepLimpo.length !== 8) {
            throw new Error('CEP inválido.');
        }
        return cepLimpo;
    }
}



