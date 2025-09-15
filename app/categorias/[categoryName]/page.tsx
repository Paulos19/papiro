import prisma from '@/lib/prisma';
import { BookWithSerializablePrice } from '@/app/page';
import { notFound } from 'next/navigation';
import { BookList } from '@/app/components/livros/BookList';
import { PaginationControls } from '@/app/components/livros/PaginationControls';
import { Navbar } from '@/app/components/Navbar';

const BOOKS_PER_PAGE = 20;

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
  searchParams: {
    page?: string;
  };
}

async function getCategoryData(params: CategoryPageProps['params'], searchParams: CategoryPageProps['searchParams']) {
  // Decodifica o nome da categoria da URL (ex: "Fic%C3%A7%C3%A3o" -> "Ficção")
  const decodedCategoryName = decodeURIComponent(params.categoryName);
  const page = parseInt(searchParams.page || '1');

  // Busca os livros E a contagem total na mesma categoria
  const [books, totalBooks, category] = await Promise.all([
    prisma.book.findMany({
      where: {
        category: {
          name: decodedCategoryName,
        },
      },
      take: BOOKS_PER_PAGE,
      skip: (page - 1) * BOOKS_PER_PAGE,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.book.count({
      where: {
        category: {
          name: decodedCategoryName,
        },
      },
    }),
    // Busca os detalhes da categoria para exibir o nome
    prisma.category.findUnique({
      where: { name: decodedCategoryName }
    })
  ]);

  if (!category) {
    notFound(); // Se a categoria não existe, retorna página 404
  }
  
  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

  // Serializa o preço dos livros
  const serializedBooks: BookWithSerializablePrice[] = books.map(book => ({
    ...book,
    price: book.price.toNumber(),
  }));

  return { books: serializedBooks, totalPages, currentPage: page, categoryName: category.name };
}


export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { books, totalPages, currentPage, categoryName } = await getCategoryData(params, searchParams);

  return (
    <>
    <Navbar/>
    <main className="container py-12">
      <h1 className="text-4xl font-bold mb-2">Estante: {categoryName}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Explorando todos os livros da categoria "{categoryName}".
      </p>

      {/* Reutilizamos os componentes da página /livros! */}
      <BookList books={books} />
      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
    </main>
    </>
  );
}

// (Opcional, mas recomendado para performance)
// Gera as páginas de categoria estaticamente no momento da build
export async function generateStaticParams() {
  const categories = await prisma.category.findMany();

  return categories.map((category) => ({
    categoryName: encodeURIComponent(category.name),
  }));
}