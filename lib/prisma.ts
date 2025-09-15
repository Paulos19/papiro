import { PrismaClient } from '@prisma/client'

// Declara uma variável global para o Prisma Client
declare global {
  var prisma: PrismaClient | undefined
}

// Cria uma instância do Prisma Client, reutilizando a instância existente em desenvolvimento
// ou criando uma nova em produção.
const client = globalThis.prisma || new PrismaClient()

// Em ambiente de desenvolvimento, armazena a instância no objeto global para
// que ela não seja recriada a cada hot-reload.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client