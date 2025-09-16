import prisma from '@/lib/prisma';
import { CategoryCard } from '../components/categorias/CategoryCard';
import { Navbar } from '../components/Navbar';

async function getCategories() {
  const categories = await prisma.category.findMany({
    // Inclui a contagem de livros em cada categoria
    include: {
      _count: {
        select: { books: true },
      },
    },
    // Filtra categorias que não têm livros
    where: {
      books: {
        some: {}
      }
    },
    orderBy: {
      name: 'asc',
    },
  });
  return categories;
}

export default async function CategoriasPage() {
  const categories = await getCategories();

  return (
    <>
    <Navbar/>
    <main className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Explore por Categoria</h1>
        <p className="text-xl text-muted-foreground mt-2">Navegue pelo nosso acervo organizado por estantes.</p>
      </div>
      
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhuma categoria encontrada.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </main>
    </>
  );
}

