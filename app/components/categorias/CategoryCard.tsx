import Link from 'next/link';
import { FolderKanban } from 'lucide-react';

interface CategoryCardProps {
  category: {
    name: string;
    _count: {
      books: number;
    };
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Codifica o nome da categoria para ser seguro em uma URL
  const categoryHref = `/categorias/${encodeURIComponent(category.name)}`;

  return (
    <Link href={categoryHref}>
      <div className="flex flex-col items-center justify-center gap-4 p-6 border rounded-lg h-48
                     bg-card text-card-foreground shadow-sm 
                     transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-primary">
        <FolderKanban className="h-12 w-12 text-primary" />
        <div className="text-center">
          <h3 className="font-bold text-lg text-foreground">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category._count.books} livros</p>
        </div>
      </div>
    </Link>
  );
}