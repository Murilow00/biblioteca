import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import e from 'express';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🗑️  Limpando banco de dados...');

    await prisma.cliente.deleteMany();
    await prisma.catalogo.deleteMany();

    console.log('📦 Inserindo Clientes...');
    await prisma.cliente.createMany({
        data: [
            {
                nome: 'Ana Silva',
                compras: 5,
                ativo: true,
                email: 'ana.silva@example.com',
                telefone: '11987654321'
            },
            {
                nome: 'Bruno Souza',
                compras: 2,
                ativo: true,
                email: 'bruno.souza@example.com',
                telefone: '11900000001'
            },
            {
                nome: 'Murilo Milan',
                compras: 0,
                ativo: false,  
                email: 'murilo.milan@example.com',
                telefone: '11900000002'
            },
            {
                nome: 'Luiz Felipe',
                compras: 67,
                ativo: true,
                email: 'luiz.felipe@example.com',
                telefone: '11900000003'   
            },
            {
                nome: 'Ana Cremasco',
                compras: 5,
                ativo: false,
                email: 'ana.cremasco@example.com',
                telefone: '11900000004'

            },
            {
                nome: 'Gustavo',
                compras: 16,
                ativo: true,
                email: 'gustavo.sla@example.com',
                telefone: '11900000005'
            },
            {
                nome: 'Pedro Urbano',
                compras: 3,
                ativo: true,
                email: 'pedro.urbano@example.com',
                telefone: '11900000006'
            },

        ],
    });

    console.log('📚 Inserindo Itens no Catálogo...');
    await prisma.catalogo.createMany({
        data: [
            {
                nome: 'O Chamado de Cthulhu',
                decricao: 'Um clássico do horror cósmico.',
                categoria: 'TERROR',
                preco: 45,
            },
            {
                nome: 'O Hobbit',
                decricao: 'Uma jornada inesperada por terras fantásticas.',
                categoria: 'FANTASIA',
                disponivel: true,
                preco: 59,
            },
            {
                nome: 'Sherlock Holmes: Um Estudo em Vermelho',
                decricao: 'O primeiro caso do detetive mais famoso do mundo.',
                categoria: 'INVESTIGACAO',
                disponivel: false,
                preco: 35,
            },
            {
                nome: 'Ordem Paranormal: iniciação',
                decricao: 'Um grupo de agentes esta investigando o paranormal em uma escola',
                categoria: 'TERROR',
                disponivel: true,
                preco: 90
            },
        ],
    });

    console.log('✅ Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
