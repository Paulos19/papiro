import { BookForClient } from '@/lib/types'; // <-- CORREÇÃO: Import do tipo centralizado
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function StaticBookCard({ book }: { book: BookForClient }) {
  const imageUrl = book.coverImageUrl || '/book-cover.jpg';

  return (
    <div className="border rounded-lg overflow-hidden bg-card text-card-foreground">
      {/* CORREÇÃO: Link ajustado para /livros/[id] */}
      <Link href={`/livros/${book.id}`}>
        <div className="relative aspect-[3/4] w-full bg-muted">
          <Image
            src={imageUrl}
            alt={`Capa de ${book.title}`}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/livros/${book.id}`}>
          <h3 className="font-semibold truncate hover:text-primary">{book.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground truncate">{book.author}</p>
        <p className="font-bold text-lg mt-2">{formatCurrency(book.price)}</p>
        <Button asChild className="mt-3 w-full">
          <Link href={`/livros/${book.id}`}>Ver Detalhes</Link>
        </Button>
      </div>
    </div>
  );
}