'use client';

import { motion, Variants } from 'framer-motion';
import { BookCard } from './BookCard';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookWithSerializablePrice } from '../page';

// ATUALIZAÇÃO AQUI: Usamos o novo tipo para a prop
interface BookCarouselProps {
  title: string;
  books: BookWithSerializablePrice[];
}

// ... o resto do componente continua exatamente o mesmo
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function BookCarousel({ title, books }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkForScroll = () => {
      const el = scrollRef.current;
      if (el) {
        const hasOverflow = el.scrollWidth > el.clientWidth;
        setCanScrollRight(hasOverflow);
        setCanScrollLeft(el.scrollLeft > 0);
      }
    };

    checkForScroll();
    window.addEventListener('resize', checkForScroll);

    return () => window.removeEventListener('resize', checkForScroll);
  }, [books]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white",
            "hidden md:flex",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            !canScrollLeft && "opacity-0 pointer-events-none"
          )}
          onClick={() => scrollBy(-300)}
        >
          <ChevronLeft size={32} />
        </Button>

        <motion.div
          ref={scrollRef}
          onScroll={handleScroll}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </motion.div>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white",
            "hidden md:flex",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            !canScrollRight && "opacity-0 pointer-events-none"
          )}
          onClick={() => scrollBy(300)}
        >
          <ChevronRight size={32} />
        </Button>
      </div>
    </section>
  );
}