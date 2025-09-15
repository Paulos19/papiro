'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { State } from '../livros/actions'; // Reutilizamos o tipo State

// Schema de validação para a nova senha
const passwordSchema = z.object({
  password: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres."),
});

export async function changeUserPassword(userId: string, prevState: State, formData: FormData): Promise<State> {
  const validatedFields = passwordSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação.',
    };
  }

  const { password } = validatedFields.data;

  try {
    // Criptografa a nova senha
    const hashedPassword = await hash(password, 12);

    // Atualiza o usuário no banco
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath('/admin/usuarios');
    return { success: true, message: 'Senha alterada com sucesso!' };

  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Erro no banco de dados: Não foi possível alterar a senha.' };
  }
}