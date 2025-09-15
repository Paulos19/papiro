'use client';

import { useState } from 'react';
import { BookWithSerializablePrice } from '@/app/page';
import { BookListItem } from './BookListItem';
import { StaticBookCard } from './StaticBookCard'; // Importa o novo card estático
import { Button } from '@/components/ui/button';
import { Grid3x3, List } from 'lucide-react';

interface BookListProps {
  books: BookWithSerializablePrice[];
}

export function BookList({ books }: BookListProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{books.length} livros encontrados</p>
        <div className="flex gap-2">
          <Button 
            variant={view === 'grid' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setView('grid')}
            aria-label="Visualização em grade"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setView('list')}
            aria-label="Visualização em lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">Nenhum livro encontrado com os filtros selecionados.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            // Usa o card estático e performático para a visualização em grade
            <StaticBookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {books.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}