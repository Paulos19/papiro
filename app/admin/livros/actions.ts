'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Book } from '@prisma/client';

// Mantemos o mesmo schema de validação
const bookFormSchema = z.object({
  title: z.string().min(3, "O título precisa ter no mínimo 3 caracteres."),
  author: z.string().min(3, "O nome do autor precisa ter no mínimo 3 caracteres."),
  publisher: z.string().min(2, "O nome da editora precisa ter no mínimo 2 caracteres."),
  publicationYear: z.coerce.number().int("O ano deve ser um número inteiro.").min(1000, "Ano inválido.").max(new Date().getFullYear(), "O ano não pode ser no futuro."),
  price: z.coerce.number().positive("O preço deve ser um número positivo."),
  stock: z.coerce.number().int("O estoque deve ser um número inteiro.").min(0, "O estoque não pode ser negativo."),
  conditionDescription: z.string().min(10, "A descrição do estado precisa ter no mínimo 10 caracteres."),
  categoryId: z.string({ required_error: "Selecione uma categoria." }),
  isbn: z.string().optional(),
  coverImageUrl: z.string().url("A URL da capa deve ser um endereço válido.").optional().or(z.literal('')),
});

export type State = {
  [x: string]: any;
  errors?: { [key: string]: string[] | undefined; };
  message?: string | null;
} | undefined;

// Ação de criação (sem mudanças)
export async function createBook(prevState: State, formData: FormData) {
  // ...código existente...
}

// NOVA AÇÃO: Atualizar um livro existente
export async function updateBook(bookId: string, prevState: State, formData: FormData) {
  if (!bookId) {
    return { message: 'ID do livro não encontrado.' };
  }
  
  const validatedFields = bookFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }
  
  const { data } = validatedFields;

  try {
    await prisma.book.update({
      where: { id: bookId },
      data: { ...data },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Erro no banco de dados: Não foi possível atualizar o livro.' };
  }

  revalidatePath('/admin/livros');
  redirect('/admin/livros');
}

// NOVA AÇÃO: Deletar um ou mais livros
export async function deleteBooks(bookIds: string[]) {
  if (bookIds.length === 0) {
    return { message: 'Nenhum livro selecionado.' };
  }

  try {
    await prisma.book.deleteMany({
      where: {
        id: {
          in: bookIds,
        },
      },
    });
    revalidatePath('/admin/livros');
    return { message: `Sucesso: ${bookIds.length} livro(s) deletado(s).` };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Erro no banco de dados: Não foi possível deletar os livros.' };
  }
}