'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getOrCreateShortLink } from '../../livros/[bookId]/actions';

interface ShareButtonProps {
  bookId: string;
  bookTitle: string; // Título do livro, necessário para a partilha nativa
  initialShortLink: string | null;
  isCardButton?: boolean;
}

export function ShareButton({ bookId, bookTitle, initialShortLink, isCardButton = false }: ShareButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState(initialShortLink);

  const handleShare = async () => {
    setIsLoading(true);
    try {
      let linkCode = shortLink;
      
      if (!linkCode) {
        const newShortLink = await getOrCreateShortLink(bookId);
        setShortLink(newShortLink);
        linkCode = newShortLink;
      }
      
      const fullUrl = `${window.location.origin}/s/${linkCode}`;
      
      // AQUI ESTÁ A LÓGICA PRINCIPAL
      // Verifica se a Web Share API (a caixa de diálogo nativa) está disponível no navegador.
      if (navigator.share) {
        // Se estiver disponível, aciona a partilha nativa.
        await navigator.share({
          title: `Papiro Branco: ${bookTitle}`,
          text: `Confira este livro que encontrei no Papiro Branco: ${bookTitle}`,
          url: fullUrl,
        });
      } else {
        // Fallback: se a API não estiver disponível (ex: alguns navegadores de desktop),
        // o comportamento é copiar o link para a área de transferência.
        await navigator.clipboard.writeText(fullUrl);
        toast.success('Link de partilha copiado!', {
          description: 'O link encurtado está na sua área de transferência.',
        });
      }

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log("Partilha cancelada pelo utilizador.");
        return;
      }
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível partilhar. Tente novamente.';
      toast.error('Erro ao partilhar', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  if (isCardButton) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleShare} 
        disabled={isLoading} 
        className="flex-1" 
        title="Partilhar"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleShare} disabled={isLoading} className="w-full mt-2">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Share2 className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'A gerar link...' : 'Compartilhar'}
    </Button>
  );
}