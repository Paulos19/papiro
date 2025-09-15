'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookForClient } from '@/lib/types'; // <-- CORREÇÃO: Import do tipo centralizado

interface HeroBannerProps {
  featuredBook: BookForClient;
}

export function HeroBanner({ featuredBook }: HeroBannerProps) {
  const imageUrl = featuredBook.coverImageUrl || '/book-cover.jpg';
  
  return (
    <section className="relative h-[75vh] w-full flex items-center justify-center text-center text-white">
      <Image
        src={imageUrl}
        alt={`Capa do livro ${featuredBook.title}`}
        fill
        className="object-cover opacity-30"
        quality={90}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040E21] via-[#040E21]/50 to-transparent" />
      <div className="relative z-10 p-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg font-semibold text-primary"
        >
          Destaque do Acervo
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-2 text-4xl md:text-6xl font-bold drop-shadow-lg max-w-4xl"
        >
          {featuredBook.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-4 max-w-2xl mx-auto text-lg text-gray-300 drop-shadow-md"
        >
          {featuredBook.author} • {featuredBook.publicationYear}
        </motion.p>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
           className="mt-8"
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg py-6 px-8">
            {/* CORREÇÃO: Link ajustado para /livros/[id] */}
            <Link href={`/livros/${featuredBook.id}`}>
              Ver Detalhes
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}