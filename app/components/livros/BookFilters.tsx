'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

interface BookFiltersProps {
  categories: Category[];
}

const FiltersContent = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1'); // Reseta para a primeira página a cada novo filtro
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const newQuery = createQueryString(name, value === 'all' ? '' : value);
    router.push(`/livros?${newQuery}`);
  };

  const handleInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const { name, value } = event.currentTarget;
      handleFilterChange(name, value);
    }
  };

  const clearFilters = () => {
    router.push('/livros');
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input
        name="title"
        placeholder="Filtrar por Título..."
        defaultValue={searchParams.get('title') || ''}
        onKeyDown={handleInputChange}
      />
      <Input
        name="author"
        placeholder="Filtrar por Autor..."
        defaultValue={searchParams.get('author') || ''}
        onKeyDown={handleInputChange}
      />
      <Input
        name="publisher"
        placeholder="Filtrar por Editora..."
        defaultValue={searchParams.get('publisher') || ''}
        onKeyDown={handleInputChange}
      />
      <Input
        name="isbn"
        placeholder="Filtrar por ISBN..."
        defaultValue={searchParams.get('isbn') || ''}
        onKeyDown={handleInputChange}
      />
      <Select onValueChange={(value) => handleFilterChange('categoria', value)} defaultValue={searchParams.get('categoria') || 'all'}>
        <SelectTrigger><SelectValue placeholder="Filtrar por categoria" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          {categories.map((category) => ( <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem> ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange('condicao', value)} defaultValue={searchParams.get('condicao') || 'all'}>
        <SelectTrigger><SelectValue placeholder="Filtrar por condição" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Condições</SelectItem>
          <SelectItem value="Novo">Novo</SelectItem>
          <SelectItem value="Usado">Usado</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange('ordenar', value)} defaultValue={searchParams.get('ordenar') || 'recentes'}>
        <SelectTrigger><SelectValue placeholder="Ordenar por" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="recentes">Mais Recentes</SelectItem>
          <SelectItem value="preco_asc">Preço: Menor para Maior</SelectItem>
          <SelectItem value="preco_desc">Preço: Maior para Menor</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" onClick={clearFilters} className="w-full sm:col-span-2 md:col-span-1">Limpar Filtros</Button>
    </div>
  );
};

export function BookFilters({ categories }: BookFiltersProps) {
  return (
    <>
      <div className="hidden md:block p-6 border rounded-lg bg-card text-card-foreground">
        <FiltersContent categories={categories} />
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filtros e Ordenação
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg max-h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros Avançados</SheetTitle>
              <SheetDescription>
                Refine a sua busca para encontrar o livro perfeito.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <FiltersContent categories={categories} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}