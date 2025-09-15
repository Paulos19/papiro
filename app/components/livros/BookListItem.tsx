import { BookForClient } from '@/lib/types'; // <-- CORREÇÃO: Import do tipo centralizado
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function BookListItem({ book }: { book: BookForClient }) {
  const imageUrl = book.coverImageUrl || '/book-cover.jpg';

  return (
    <div className="flex gap-4 border p-4 rounded-lg bg-card text-card-foreground">
      {/* CORREÇÃO: Link ajustado para /livros/[id] */}
      <Link href={`/livros/${book.id}`}>
        <div className="relative h-32 w-24 flex-shrink-0">
          <Image src={imageUrl} alt={book.title} fill className="object-cover rounded-md" />
        </div>
      </Link>
      <div className="flex flex-col justify-between flex-1">
        <div>
          <Link href={`/livros/${book.id}`}>
            <h3 className="font-bold text-lg hover:text-primary">{book.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
        <div className='flex items-end justify-between'>
          <p className="text-xl font-bold text-primary">{formatCurrency(book.price)}</p>
          <Button asChild size="sm" className="mt-2">
            <Link href={`/livros/${book.id}`}>
              Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}