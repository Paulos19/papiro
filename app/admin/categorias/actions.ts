'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../livros/actions';

const categorySchema = z.object({
  name: z.string().min(3, "O nome da categoria deve ter no mínimo 3 caracteres."),
  iconName: z.string().optional(),
});

// CORREÇÃO: Adicionado 'export'
export async function createCategory(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }
  
  try {
    const { name } = validatedFields.data;
    const existingCategory = await prisma.category.findUnique({ where: { name } });
    if (existingCategory) {
      return { message: 'Já existe uma categoria com este nome.' };
    }
    
    await prisma.category.create({ data: validatedFields.data });
    revalidatePath('/admin/categorias');
    return { success: true, message: 'Categoria criada com sucesso.' };
  } catch (error) {
    return { message: 'Erro no banco de dados: Não foi possível criar a categoria.' };
  }
}

// CORREÇÃO: Adicionado 'export'
export async function updateCategory(id: string, prevState: State, formData: FormData): Promise<State> {
  const validatedFields = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }
  
  try {
    await prisma.category.update({
      where: { id },
      data: validatedFields.data,
    });
    revalidatePath('/admin/categorias');
    return { success: true, message: 'Categoria atualizada com sucesso.' };
  } catch (error) {
    return { message: 'Erro no banco de dados: Não foi possível atualizar a categoria.' };
  }
}

// CORREÇÃO: Adicionado 'export'
export async function deleteCategory(id: string) {
  try {
    const booksInCategory = await prisma.book.count({ where: { categoryId: id } });
    if (booksInCategory > 0) {
      return { success: false, message: 'Não é possível excluir categorias que contêm livros.' };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categorias');
    return { success: true, message: 'Categoria excluída com sucesso.' };
  } catch (error) {
    return { success: false, message: 'Erro no banco de dados.' };
  }
}