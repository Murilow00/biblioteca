import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

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
            },
            {
                nome: 'Bruno Souza',
                compras: 2,
                ativo: true,
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
