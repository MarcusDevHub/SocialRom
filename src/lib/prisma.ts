import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'


// Aqui definimos a URL do banco SQLite.
// Se DATABASE_URL existir, usamos ela.
// Se não existir, usamos o arquivo local dev.db.
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
})

// Truque para evitar múltiplas instâncias do Prisma em desenvolvimento
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Se já existir uma instância global, reutiliza.
// Se não existir, cria uma nova com o adapter do SQLite.

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter, log: ['error', 'warn'] })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma;
