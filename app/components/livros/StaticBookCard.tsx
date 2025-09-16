'use client'; 

import { BookForClient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { ShareButton } from './ShareButton';

export function StaticBookCard({ book }: { book: BookForClient }) {
  const imageUrl = book.coverImageUrl || '/book-cover.jpg';
  const whatsappMessage = `Olá! Tenho interesse no livro "${book.title}". Ele ainda está disponível?`;
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_ADM_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="border rounded-lg overflow-hidden bg-card text-card-foreground flex flex-col">
      <Link href={`/livros/${book.id}`} className="flex-grow">
        <div className="relative aspect-[3/4] w-full bg-muted">
          <Image
            src={imageUrl}
            alt={`Capa de ${book.title}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate hover:text-primary">{book.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{book.author}</p>
          <p className="font-bold text-lg mt-2">{formatCurrency(book.price)}</p>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <Button asChild className="w-full mb-2" size="sm">
          <Link href={`/livros/${book.id}`}>Ver Detalhes</Link>
        </Button>
        <div className="flex gap-2 w-full">
          <ShareButton bookId={book.id} bookTitle={book.title} initialShortLink={book.shortLink} isCardButton={true} />
          <Button asChild size="icon" className="flex-1 bg-green-600 hover:bg-green-700" title="Contatar Vendedor">
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="h-4 w-4" />
              </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

