'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationControls({ totalPages, currentPage }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/livros?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  // Lógica aprimorada para gerar os números de página
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Quantidade de páginas a serem exibidas ao redor da página atual
    const pageWindow = 2; 

    // Adiciona a primeira página
    if (currentPage > pageWindow + 1) {
      pageNumbers.push(1);
      if (currentPage > pageWindow + 2) {
        pageNumbers.push('...');
      }
    }

    // Gera as páginas ao redor da página atual
    for (let i = Math.max(1, currentPage - pageWindow); i <= Math.min(totalPages, currentPage + pageWindow); i++) {
      pageNumbers.push(i);
    }

    // Adiciona a última página
    if (currentPage < totalPages - pageWindow) {
      if (currentPage < totalPages - pageWindow - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
        
        {/* Renderiza a nova lista de números de página */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === 'number' ? (
              <PaginationLink href={createPageURL(page)} isActive={currentPage === page}>
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}