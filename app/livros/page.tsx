import prisma from '@/lib/prisma';
import { BookWithSerializablePrice } from '../page';
import { Suspense } from 'react';
import { BookFilters } from '../components/livros/BookFilters';
import { BooksPageSkeleton } from '../components/livros/BooksPageSkeleton';
import { BookList } from '../components/livros/BookList';
import { PaginationControls } from '../components/livros/PaginationControls';

const BOOKS_PER_PAGE = 20;

interface LivrosPageProps {
  searchParams: {
    q?: string;
    categoria?: string;
    condicao?: string;
    ordenar?: string;
    page?: string; // Parâmetro da página
  };
}

async function getBooksAndCategories(searchParams: LivrosPageProps['searchParams']) {
  const { q, categoria, condicao, ordenar, page = '1' } = searchParams;
  const currentPage = parseInt(page);

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { author: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (categoria) { where.category = { name: categoria }; }
  if (condicao) { where.condition = condicao; }

  const orderBy: any = {};
  if (ordenar === 'preco_asc') { orderBy.price = 'asc'; }
  else if (ordenar === 'preco_desc') { orderBy.price = 'desc'; }
  else { orderBy.createdAt = 'desc'; }

  // Busca os livros com paginação
  const booksQuery = prisma.book.findMany({
    where,
    orderBy,
    take: BOOKS_PER_PAGE,
    skip: (currentPage - 1) * BOOKS_PER_PAGE,
  });

  // Conta o total de livros para a paginação
  const countQuery = prisma.book.count({ where });

  const categoriesQuery = prisma.category.findMany();

  const [books, totalBooks, categories] = await Promise.all([booksQuery, countQuery, categoriesQuery]);

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

  const serializedBooks: BookWithSerializablePrice[] = books.map(book => ({
    ...book,
    price: book.price.toNumber(),
  }));

  return { books: serializedBooks, categories, totalPages, currentPage };
}

export default async function LivrosPage({ searchParams }: LivrosPageProps) {
  // A busca dos filtros não precisa esperar pelo Suspense
  const categories = await prisma.category.findMany();

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Nosso Acervo</h1>
      <div className="space-y-8">
        <BookFilters categories={categories} />
        <Suspense fallback={<BooksPageSkeleton />} key={JSON.stringify(searchParams)}>
          <BookListAndPagination searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

// Criamos um componente async separado para usar com o Suspense
async function BookListAndPagination({ searchParams }: LivrosPageProps) {
  const { books, totalPages, currentPage } = await getBooksAndCategories(searchParams);
  return (
    <>
      <BookList books={books} />
      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}