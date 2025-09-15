import { Button } from '@/components/ui/button';
import { BookWithSerializablePrice } from '@/app/page';
import { FaWhatsapp } from "react-icons/fa";
import Link from 'next/link';

interface ContactSellerButtonProps {
  book: BookWithSerializablePrice;
}

export function ContactSellerButton({ book }: ContactSellerButtonProps) {
  const adminNumber = process.env.NEXT_PUBLIC_ADM_NUMBER;

  if (!adminNumber) {
    // Retorna um botão desabilitado se o número não estiver configurado
    return <Button disabled>Contato Indisponível</Button>;
  }

  // Cria a mensagem padrão e a codifica para a URL
  const message = `Olá! Tenho interesse no livro "${book.title}". Ele ainda está disponível?`;
  const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Button asChild size="lg" className="w-full mt-4 bg-green-600 hover:bg-green-700">
      <Link href={whatsappUrl} target="_blank">
        <FaWhatsapp className="mr-2 h-6 w-6" />
        Contatar Vendedor
      </Link>
    </Button>
  );
}