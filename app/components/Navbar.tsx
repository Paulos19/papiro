'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetClose } from '@/components/ui/sheet';
import { User, LogOut, Heart, Book, LayoutGrid, Info, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from './SearchInput'; // Importa o componente de busca

export function Navbar() {
  const { data: session } = useSession();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        hasScrolled 
          ? 'border-b border-white/10 bg-black/30 backdrop-blur-lg' 
          : 'bg-[#040E21] border-b border-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* --- NAVEGAÇÃO MOBILE (HAMBURGER) --- */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-[#040E21] border-r-white/10 text-white">
              <SheetHeader className='mb-8 text-left'>
                <SheetClose asChild>
                  <Link href="/">
                    <Image 
                      src="/logo.png" 
                      alt="Papiro Branco Logo" 
                      width={45}
                      height={33} 
                      className="object-contain"
                    />
                  </Link>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col gap-6 text-lg font-medium">
                <SheetClose asChild>
                  <Link href="/livros" className="flex items-center gap-3 transition-colors hover:text-primary">
                    <Book className="h-5 w-5" />
                    Todos os Livros
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/categorias" className="flex items-center gap-3 transition-colors hover:text-primary">
                    <LayoutGrid className="h-5 w-5" />
                    Categorias
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/sobre" className="flex items-center gap-3 transition-colors hover:text-primary">
                    <Info className="h-5 w-5" />
                    Sobre Nós
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* --- LOGO PARA DESKTOP --- */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Papiro Branco Logo" 
              width={45}
              height={33} 
              className="object-contain"
            />
          </Link>
        </div>

        {/* --- NAVEGAÇÃO CENTRAL PARA DESKTOP --- */}
        <nav className="hidden md:flex items-center justify-center">
          <div className="flex items-center space-x-8 text-md font-medium text-gray-300">
            <Link href="/livros" className="flex items-center gap-2 transition-colors hover:text-white">
              <Book className="h-4 w-4" />
              Todos os Livros
            </Link>
            <Link href="/categorias" className="flex items-center gap-2 transition-colors hover:text-white">
              <LayoutGrid className="h-4 w-4" />
              Categorias
            </Link>
            <Link href="/sobre" className="flex items-center gap-2 transition-colors hover:text-white">
              <Info className="h-4 w-4" />
              Sobre Nós
            </Link>
          </div>
        </nav>

        {/* --- SEÇÃO DIREITA (ÍCONES E LOGIN) --- */}
        <div className="flex items-center justify-end space-x-2">
          <SearchInput />
          {session ? (
            <>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                <Heart className="h-5 w-5" />
              </Button>
              <Button onClick={() => signOut()} variant="outline" className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white">
                Sair
              </Button>
            </>
          ) : (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" /> Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}