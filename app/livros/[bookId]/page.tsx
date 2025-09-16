import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { BookForClient } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ContactSellerButton } from '@/app/components/livros/ContactSellerButton';
import { Navbar } from '@/app/components/Navbar';
import { ShareButton } from '@/app/components/livros/ShareButton'; // Importa o novo botão

interface BookDetailsPageProps {
  params: {
    bookId: string;
  };
}

async function getBookDetails(bookId: string): Promise<BookForClient | null> {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      category: true, 
    },
  });

  if (!book) {
    return null;
  }

  const serializedBook: BookForClient = {
    ...book,
    price: book.price.toNumber(),
  };

  return serializedBook;
}

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const book = await getBookDetails(params.bookId);
  
  if (!book) {
    notFound();
  }
  
  const imageUrl = book.coverImageUrl || '/book-cover.jpg';

  return (
    <>
    <Navbar/>
    <main className="container py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Coluna da Imagem */}
        <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
          <Image
            src={imageUrl}
            alt={`Capa do livro ${book.title}`}
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Coluna de Detalhes */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold">{book.title}</h1>
          <p className="text-xl text-muted-foreground mt-2">{book.author}</p>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline">{book.condition || 'Não informado'}</Badge>
            <Link href={`/categorias/${encodeURIComponent(book.category.name)}`} className="text-sm hover:text-primary transition-colors">
              {book.category.name}
            </Link>
          </div>
          
          <p className="text-4xl font-bold text-primary my-6">{formatCurrency(book.price)}</p>

          <ContactSellerButton book={book} />
          {/* Adiciona o novo botão de partilha */}
          <ShareButton bookId={book.id} initialShortLink={book.shortLink} />

          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Detalhes do Livro</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Editora</dt>
              <dd>{book.publisher}</dd>

              <dt className="text-muted-foreground">Ano de Publicação</dt>
              <dd>{book.publicationYear}</dd>

              <dt className="text-muted-foreground">ISBN</dt>
              <dd>{book.isbn || 'Não informado'}</dd>
            </dl>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Descrição do Estado</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{book.conditionDescription}</p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

// Gera as páginas de detalhes estaticamente no momento da build
export async function generateStaticParams() {
  const books = await prisma.book.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  return books.map((book) => ({
    bookId: book.id,
  }));
}