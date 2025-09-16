import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

interface RouteParams {
  params: {
    shortCode: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { shortCode } = params;

  if (!shortCode) {
    notFound();
  }

  try {
    const book = await prisma.book.findUnique({
      where: {
        shortLink: shortCode,
      },
      select: {
        id: true,
      },
    });

    if (!book) {
      notFound();
    }

    // Cria a URL absoluta para o redirecionamento
    const bookUrl = new URL(`/livros/${book.id}`, request.url);
    return NextResponse.redirect(bookUrl);

  } catch (error) {
    console.error("Erro ao redirecionar shortlink:", error);
    notFound();
  }
}
