import prisma from '@/lib/prisma';
import { BookForClient } from '@/lib/types';
import { Suspense } from 'react';
import { BookFilters } from '../components/livros/BookFilters';
import { BooksPageSkeleton } from '../components/livros/BooksPageSkeleton';
import { BookList } from '../components/livros/BookList';
import { PaginationControls } from '../components/livros/PaginationControls';
import { Navbar } from '../components/Navbar';

const BOOKS_PER_PAGE = 20;

// Interface atualizada para refletir os novos filtros avançados
interface LivrosPageProps {
  searchParams: {
    title?: string;
    author?: string;
    publisher?: string;
    isbn?: string;
    categoria?: string;
    condicao?: string;
    ordenar?: string;
    page?: string;
  };
}

async function getBooksAndCategories(searchParams: LivrosPageProps['searchParams']) {
  const { title, author, publisher, isbn, categoria, condicao, ordenar, page = '1' } = searchParams;
  const currentPage = parseInt(page);

  const where: any = {};

  // Lógica de filtro avançado: adiciona uma condição para cada parâmetro de busca presente
  if (title) { where.title = { contains: title, mode: 'insensitive' }; }
  if (author) { where.author = { contains: author, mode: 'insensitive' }; }
  if (publisher) { where.publisher = { contains: publisher, mode: 'insensitive' }; }
  if (isbn) { where.isbn = { contains: isbn, mode: 'insensitive' }; }
  if (categoria) { where.category = { name: categoria }; }
  if (condicao) { where.condition = condicao; }

  const orderBy: any = {};
  if (ordenar === 'preco_asc') { orderBy.price = 'asc'; }
  else if (ordenar === 'preco_desc') { orderBy.price = 'desc'; }
  else { orderBy.createdAt = 'desc'; }

  const booksQuery = prisma.book.findMany({
    where,
    orderBy,
    take: BOOKS_PER_PAGE,
    skip: (currentPage - 1) * BOOKS_PER_PAGE,
    include: { category: true }
  });

  const countQuery = prisma.book.count({ where });

  const categoriesQuery = prisma.category.findMany();

  const [books, totalBooks, categories] = await Promise.all([booksQuery, countQuery, categoriesQuery]);

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

  const serializedBooks: BookForClient[] = books.map(book => ({
    ...book,
    price: book.price.toNumber(),
  }));

  return { books: serializedBooks, categories, totalPages, currentPage };
}

export default async function LivrosPage({ searchParams }: LivrosPageProps) {
  const categories = await prisma.category.findMany();

  return (
    <>
    <Navbar/>
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Nosso Acervo</h1>
      <div className="space-y-8">
        <BookFilters categories={categories} />
        <Suspense fallback={<BooksPageSkeleton />} key={JSON.stringify(searchParams)}>
          <BookListAndPagination searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
    </>
  );
}

async function BookListAndPagination({ searchParams }: LivrosPageProps) {
  const { books, totalPages, currentPage } = await getBooksAndCategories(searchParams);
  return (
    <>
      <BookList books={books} />
      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}