import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        // Busca em múltiplos campos: título, autor, ISBN e editora
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { isbn: { contains: query, mode: 'insensitive' } },
          { publisher: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10, // Limita a 10 resultados para manter a busca rápida
    });

    // Serializa o preço antes de enviar a resposta
    const serializedBooks = books.map(book => ({
      ...book,
      price: book.price.toNumber(),
    }));

    return NextResponse.json(serializedBooks);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}