'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Schema de validação com a sintaxe correta para campos obrigatórios
const bookFormSchema = z.object({
  title: z.string().min(3, "O título precisa ter no mínimo 3 caracteres."),
  author: z.string().min(3, "O nome do autor precisa ter no mínimo 3 caracteres."),
  publisher: z.string().min(2, "O nome da editora precisa ter no mínimo 2 caracteres."),
  publicationYear: z.coerce.number().int("O ano deve ser um número inteiro.").min(1000, "Ano inválido.").max(new Date().getFullYear(), "O ano não pode ser no futuro."),
  price: z.coerce.number().positive("O preço deve ser um número positivo."),
  stock: z.coerce.number().int("O estoque deve ser um número inteiro.").min(0, "O estoque não pode ser negativo."),
  conditionDescription: z.string().min(10, "A descrição do estado precisa ter no mínimo 10 caracteres."),
  // CORREÇÃO: Usamos .min(1) para garantir que a string não esteja vazia
  categoryId: z.string().min(1, "Selecione uma categoria."),
  isbn: z.string().optional(),
  coverImageUrl: z.string().url("A URL da capa deve ser um endereço válido.").optional().or(z.literal('')),
});

// O tipo de estado agora inclui um booleano de 'success'
export type State = {
  errors?: { [key: string]: string[] | undefined; };
  message: string | null;
  success?: boolean;
};

// --- AÇÃO DE CRIAÇÃO ATUALIZADA ---
export async function createBook(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = bookFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }

  try {
    await prisma.book.create({ data: validatedFields.data });
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Erro no banco de dados: Não foi possível criar o livro.' };
  }

  revalidatePath('/admin/livros');
  // CORREÇÃO: Retorna um estado de sucesso em vez de redirecionar
  return { message: 'Livro criado com sucesso!', success: true };
}

// --- AÇÃO DE ATUALIZAÇÃO ATUALIZADA ---
export async function updateBook(bookId: string, prevState: State, formData: FormData): Promise<State> {
  const validatedFields = bookFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos.',
    };
  }
  
  try {
    await prisma.book.update({
      where: { id: bookId },
      data: validatedFields.data,
    });
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Erro no banco de dados: Não foi possível atualizar o livro.' };
  }

  revalidatePath('/admin/livros');
  revalidatePath(`/livros/${bookId}`);
  // CORREÇÃO: Retorna um estado de sucesso em vez de redirecionar
  return { message: 'Livro atualizado com sucesso!', success: true };
}

// --- AÇÃO DE EXCLUSÃO (sem mudanças, mas incluída para completude) ---
export async function deleteBooks(bookIds: string[]) {
  try {
    const result = await prisma.book.deleteMany({ where: { id: { in: bookIds } } });
    revalidatePath('/admin/livros');
    return { message: `Sucesso: ${result.count} livro(s) deletado(s).` };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Erro no banco de dados: Não foi possível deletar os livros.' };
  }
}