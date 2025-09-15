import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { BookForClient } from '@/lib/types';
import { BookForm } from '../../BookForm';

interface EditBookPageProps {
  params: { bookId: string };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const [book, categories] = await Promise.all([
    prisma.book.findUnique({ where: { id: params.bookId }, include: { category: true } }),
    prisma.category.findMany(),
  ]);

  if (!book) {
    notFound();
  }

  const serializedBook: BookForClient = {
    ...book,
    price: book.price.toNumber(),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Livro</h1>
        <p className="text-muted-foreground">Altere os dados do livro "{book.title}".</p>
      </div>
      <BookForm categories={categories} book={serializedBook} />
    </div>
  );
}