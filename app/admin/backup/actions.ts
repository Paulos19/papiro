'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function exportAllData() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, message: 'Acesso negado. Apenas administradores podem exportar dados.' };
  }

  try {
    const users = await prisma.user.findMany({
      // Explicitamente seleciona os campos para omitir a senha
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const categories = await prisma.category.findMany();
    const booksRaw = await prisma.book.findMany();
    
    // Converte o tipo Decimal do Prisma para número, que é serializável em JSON
    const books = booksRaw.map(book => ({
        ...book,
        price: book.price.toNumber(),
    }));

    const backupData = {
      version: 1, // Útil para futuras lógicas de importação/migração
      exportedAt: new Date().toISOString(),
      data: {
        users,
        categories,
        books,
      }
    };

    return { success: true, data: backupData };
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return { success: false, message: 'Ocorreu um erro no servidor ao buscar os dados para backup.' };
  }
}

