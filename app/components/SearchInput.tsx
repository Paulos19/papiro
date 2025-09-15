'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BookForClient } from '@/lib/types'; // <-- CORREÇÃO: Importa o tipo centralizado
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookForClient[]>([]); // <-- Usa o tipo corrigido
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timerId = setTimeout(() => {
      fetch(`/api/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setIsLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);
  
  const handleSelectBook = () => {
    setIsOpen(false);
    setQuery('');
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Buscar por título, autor, ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {!isLoading && results.length > 0 && (
              results.map(book => (
                <Link 
                  href={`/livros/${book.id}`} 
                  key={book.id} 
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-accent"
                  onClick={handleSelectBook}
                >
                  <div className="relative h-16 w-12 flex-shrink-0">
                    <Image 
                      src={book.coverImageUrl || '/book-cover.jpg'} 
                      alt={book.title}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm line-clamp-2">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    <p className="text-sm font-bold text-primary">{formatCurrency(book.price)}</p>
                  </div>
                </Link>
              ))
            )}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <p className="text-center text-sm text-muted-foreground p-4">Nenhum livro encontrado.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}