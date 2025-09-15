'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface BookFiltersProps {
  categories: Category[];
}

export function BookFilters({ categories }: BookFiltersProps) {
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

  // Lógica de manipulação do filtro foi aprimorada
  const handleFilterChange = (name: string, value: string) => {
    // Se o valor for 'all', tratamos como uma string vazia para limpar o filtro
    const newQuery = createQueryString(name, value === 'all' ? '' : value);
    router.push(`/livros?${newQuery}`);
  };
  
  const clearFilters = () => {
    router.push('/livros');
  }

  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Buscar por título ou autor..."
          defaultValue={searchParams.get('q') || ''}
          // Usamos onBlur para evitar uma requisição a cada tecla digitada
          onBlur={(e) => handleFilterChange('q', e.target.value)}
          // Permite buscar com a tecla Enter
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFilterChange('q', (e.target as HTMLInputElement).value);
            }
          }}
        />
        <Select
          onValueChange={(value) => handleFilterChange('categoria', value)}
          defaultValue={searchParams.get('categoria') || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            {/* CORREÇÃO: Usamos 'all' em vez de '' */}
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => handleFilterChange('condicao', value)}
          defaultValue={searchParams.get('condicao') || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por condição" />
          </SelectTrigger>
          <SelectContent>
            {/* CORREÇÃO: Usamos 'all' em vez de '' */}
            <SelectItem value="all">Todas as Condições</SelectItem>
            <SelectItem value="Novo">Novo</SelectItem>
            <SelectItem value="Usado">Usado</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => handleFilterChange('ordenar', value)}
          defaultValue={searchParams.get('ordenar') || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais Recentes</SelectItem>
            <SelectItem value="preco_asc">Preço: Menor para Maior</SelectItem>
            <SelectItem value="preco_desc">Preço: Maior para Menor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        <Button variant="ghost" onClick={clearFilters}>Limpar Filtros</Button>
      </div>
    </div>
  );
}