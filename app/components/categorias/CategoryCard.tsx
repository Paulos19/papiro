import Link from 'next/link';
import { DynamicIcon } from '../../../components/DynamicIcon'; // Importa o componente de ícone dinâmico

interface CategoryCardProps {
  category: {
    name: string;
    // Garante que o nome do ícone seja esperado nas props
    iconName: string | null;
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
        {/* Usa o DynamicIcon para renderizar o ícone correto */}
        <DynamicIcon name={category.iconName} className="h-12 w-12 text-primary" />
        <div className="text-center">
          <h3 className="font-bold text-lg text-foreground">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category._count.books} livros</p>
        </div>
      </div>
    </Link>
  );
}

