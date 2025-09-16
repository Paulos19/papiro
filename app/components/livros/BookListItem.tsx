'use client'; 

import { BookForClient } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ShareButton } from '@/app/components/livros/ShareButton'; // Corrigido para caminho absoluto
import { FaWhatsapp } from 'react-icons/fa';

export function BookListItem({ book }: { book: BookForClient }) {
  const imageUrl = book.coverImageUrl || '/book-cover.jpg';
  const whatsappMessage = `Olá! Tenho interesse no livro "${book.title}". Ele ainda está disponível?`;
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_ADM_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex gap-4 border p-4 rounded-lg bg-card text-card-foreground">
      <Link href={`/livros/${book.id}`}>
        <div className="relative h-32 w-24 flex-shrink-0">
          <Image src={imageUrl} alt={book.title} fill className="object-cover rounded-md" />
        </div>
      </Link>
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <Link href={`/livros/${book.id}`}>
            <h3 className="font-bold text-lg hover:text-primary truncate">{book.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground truncate">{book.author}</p>
          <p className="text-xl font-bold text-primary mt-2">{formatCurrency(book.price)}</p>
        </div>
        <div className='flex items-center justify-end gap-2 mt-2'>
          <ShareButton bookId={book.id} bookTitle={book.title} initialShortLink={book.shortLink} isCardButton={true} />
          <Button asChild size="icon" className="bg-green-600 hover:bg-green-700" title="Contatar Vendedor">
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="h-4 w-4" />
              </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/livros/${book.id}`}>
              Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

