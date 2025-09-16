'use server';
import prisma from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Gera um ID alfanumérico amigável de 8 caracteres
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

export async function getOrCreateShortLink(bookId: string) {
    // Garante que apenas usuários logados possam criar links
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Não autorizado.');
    }

    const book = await prisma.book.findUnique({
        where: { id: bookId },
        select: { shortLink: true }
    });

    if (!book) {
        throw new Error('Livro não encontrado.');
    }

    if (book.shortLink) {
        return book.shortLink;
    }

    const newShortLink = nanoid();

    await prisma.book.update({
        where: { id: bookId },
        data: { shortLink: newShortLink }
    });

    revalidatePath(`/livros/${bookId}`);

    return newShortLink;
}