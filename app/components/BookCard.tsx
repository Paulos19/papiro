'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BookForClient } from '@/lib/types'; // <-- CORREÇÃO: Import do tipo centralizado
import { formatCurrency } from '@/lib/utils';

interface BookCardProps {
  book: BookForClient;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: 'easeOut' 
    } 
  },
};

export function BookCard({ book }: BookCardProps) {
  const imageUrl = book.coverImageUrl || '/book-cover.jpg';

  return (
    <motion.div
      variants={itemVariants}
      className="group flex-shrink-0 w-64"
    >
      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
        <div className="relative aspect-[3/4] w-full">
          {/* CORREÇÃO: Link ajustado para /livros/[id] */}
          <Link href={`/livros/${book.id}`}>
            <Image
              src={imageUrl}
              alt={`Capa de ${book.title}`}
              fill
              className="object-cover transition-all duration-500 ease-in-out group-hover:blur-sm group-hover:brightness-50"
            />
          </Link>
        </div>
        
        <div className="p-4 flex flex-col">
          <Link href={`/livros/${book.id}`}>
            <h3 className="font-bold text-lg text-foreground transition-colors duration-300 hover:text-primary h-14 overflow-hidden group-hover:h-auto group-hover:whitespace-normal">
              {book.title}
            </h3>
          </Link>

          <div 
            className="overflow-hidden transition-all duration-500 ease-in-out h-0 opacity-0 group-hover:h-28 group-hover:opacity-100"
          >
            <p className="text-sm text-muted-foreground mt-2">
              {book.author}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {book.publicationYear} • {book.publisher}
            </p>
            <p className="text-xl font-bold text-primary mt-3">
              {formatCurrency(book.price)}
            </p>
          </div>

          <Button asChild className="mt-4 w-full bg-primary hover:bg-primary/90">
            <Link href={`/livros/${book.id}`}>
              Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}