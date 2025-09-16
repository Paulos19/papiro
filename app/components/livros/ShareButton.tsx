'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getOrCreateShortLink } from '../../livros/[bookId]/actions';

interface ShareButtonProps {
  bookId: string;
  initialShortLink: string | null;
}

export function ShareButton({ bookId, initialShortLink }: ShareButtonProps) {
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
      
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link de partilha copiado!', {
        description: 'O link encurtado está na sua área de transferência.',
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível gerar o link de partilha. Tente novamente.';
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

  return (
    <Button variant="outline" onClick={handleShare} disabled={isLoading} className="w-full mt-2">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Share2 className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'A gerar link...' : 'Partilhar'}
    </Button>
  );
}