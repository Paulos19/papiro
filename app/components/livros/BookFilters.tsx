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

// Componente interno para evitar duplicação de código
const FiltersContent = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
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

  const clearFilters = () => {
    router.push('/livros');
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por título ou autor..."
        defaultValue={searchParams.get('q') || ''}
        onBlur={(e) => handleFilterChange('q', e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { handleFilterChange('q', (e.target as HTMLInputElement).value); } }}
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
      <Button variant="ghost" onClick={clearFilters} className="w-full">Limpar Filtros</Button>
    </div>
  );
};


export function BookFilters({ categories }: BookFiltersProps) {
  return (
    <>
      {/* Filtros para Desktop (visível a partir de 'md') */}
      <div className="hidden md:block p-4 border rounded-lg bg-card text-card-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Buscar por título ou autor..."
              defaultValue={useSearchParams().get('q') || ''}
              onBlur={(e) => { /* lógica de filtro */ }}
              onKeyDown={(e) => { /* lógica de filtro */ }}
            />
          </div>
          {/* ... renderize os outros Selects aqui ... */}
        </div>
      </div>

      {/* Botão e Gaveta de Filtros para Mobile (visível abaixo de 'md') */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filtros e Ordenação
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Refine sua busca para encontrar o livro perfeito.
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