import prisma from "@/lib/prisma";
import { HeroBanner } from "./components/HeroBanner";
import { BookCarousel } from "./components/BookCarousel";
import { BookForClient } from "@/lib/types"; // Importa o tipo centralizado

async function getHomePageData() {
  // Busca o primeiro livro marcado como "destaque" e que tenha a relação de categoria
  const featuredBookQuery = prisma.book.findFirst({
    where: { isFeatured: true },
    include: {
      category: true, // Garante que a categoria seja incluída
    },
    orderBy: { createdAt: 'desc' },
  });

  // Busca todas as categorias que têm livros
  const categoriesQuery = prisma.category.findMany({
    where: { books: { some: {} } },
    include: {
      books: {
        take: 20,
        orderBy: { publicationYear: 'desc' },
        include: {
          category: true, // Garante que a categoria seja incluída nos livros do carrossel
        }
      },
    },
  });

  let [featuredBookResult, categoriesWithBooks] = await Promise.all([
    featuredBookQuery,
    categoriesQuery,
  ]);

  // Fallback: se nenhum livro for "destaque", pega o mais recente.
  if (!featuredBookResult) {
    featuredBookResult = await prisma.book.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  // Serializa o livro em destaque, convertendo o preço para número
  const serializedFeaturedBook = featuredBookResult ? {
    ...featuredBookResult,
    price: featuredBookResult.price.toNumber(),
  } : null;

  // Serializa os livros dentro de cada categoria
  const serializedCategories = categoriesWithBooks.map(category => ({
    ...category,
    books: category.books.map(book => ({
      ...book,
      price: book.price.toNumber(),
    })),
  }));

  return { featuredBook: serializedFeaturedBook, categoriesWithBooks: serializedCategories };
}

export default async function HomePage() {
  const { featuredBook, categoriesWithBooks } = await getHomePageData();

  if (!featuredBook) {
    return (
      <main className="p-8 text-white text-center flex items-center justify-center h-screen">
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo ao Papiro do Branco!</h1>
          <p className="text-lg mt-2 text-muted-foreground">Seu acervo parece estar vazio. Comece importando seus livros no painel de administrador.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <HeroBanner featuredBook={featuredBook as BookForClient} />
      
      <div className="container py-12 relative z-10">
        {categoriesWithBooks.map((category) => (
          <BookCarousel 
            key={category.id} 
            title={category.name} 
            books={category.books as BookForClient[]} 
          />
        ))}
      </div>
    </main>
  );
}