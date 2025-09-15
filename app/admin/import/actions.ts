'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema para validar um único livro vindo do cliente
const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  publisher: z.string().nullable(),
  publicationYear: z.number().nullable(),
  price: z.number(),
  conditionDescription: z.string().nullable(),
  stock: z.number(),
  isbn: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  categoryName: z.string(),
});

// Ação que recebe um array de livros e os insere/atualiza
export async function importBooksAction(books: z.infer<typeof bookSchema>[]) {
  try {
    const operations = books.map(book => {
      // **LÓGICA CORRIGIDA**

      // Objeto de dados para a operação de ATUALIZAÇÃO (update)
      // Converte `null` em `undefined` para que o Prisma não altere campos vazios.
      const updateData = {
        title: book.title,
        author: book.author,
        publisher: book.publisher ?? undefined,
        publicationYear: book.publicationYear ?? undefined,
        price: book.price,
        conditionDescription: book.conditionDescription ?? undefined,
        stock: book.stock,
        coverImageUrl: book.coverImageUrl ?? undefined,
      };

      // Objeto de dados para a operação de CRIAÇÃO (create)
      // Fornece valores padrão para campos obrigatórios que podem ser nulos na planilha.
      const createData = {
        title: book.title,
        author: book.author,
        publisher: book.publisher || 'Editora não informada',
        publicationYear: book.publicationYear || new Date().getFullYear(),
        price: book.price,
        conditionDescription: book.conditionDescription || 'Nenhuma descrição fornecida.',
        stock: book.stock,
        isbn: book.isbn,
        coverImageUrl: book.coverImageUrl,
        category: {
          connectOrCreate: {
            where: { name: book.categoryName },
            create: { name: book.categoryName },
          },
        },
      };

      // Se o livro tiver um ISBN, tentamos a operação "upsert"
      if (book.isbn) {
        return prisma.book.upsert({
          where: { isbn: book.isbn },
          update: updateData, // Usa os dados preparados para atualização
          create: createData,  // Usa os dados preparados para criação
        });
      } else {
        // Se não tiver ISBN, apenas criamos o livro
        return prisma.book.create({ data: createData });
      }
    });

    // Executa todas as operações (criações e atualizações) em uma única transação
    await prisma.$transaction(operations);
    
    // Limpa o cache da página de livros para que os novos dados apareçam
    revalidatePath('/admin/livros');
    
    return { success: true, message: `${books.length} livros importados com sucesso!` };

  } catch (error) {
    console.error("Erro na importação:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return { success: false, message: `Erro no servidor: ${errorMessage}` };
  }
}