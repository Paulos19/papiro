import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { LogoutButton } from "./components/LogoutButton";
import { AdminNavLinks } from "./components/AdminNavLinks"; // Importa os links

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- SIDEBAR PARA DESKTOP --- */}
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Home className="h-6 w-6" />
              <span className="">Papiro Branco</span>
            </Link>
          </div>
          {/* Usa o componente de links reutilizável */}
          <AdminNavLinks />
        </div>
      </aside>

      <div className="flex flex-col">
        {/* --- HEADER PARA DESKTOP E MOBILE --- */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* --- MENU HAMBURGER PARA MOBILE --- */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Home className="h-6 w-6" />
                    <span className="">Papiro Branco</span>
                    </Link>
                </div>
                {/* Reutiliza os mesmos links no menu mobile */}
                <AdminNavLinks />
              </SheetContent>
            </Sheet>
          </div>

          <div className="w-full flex-1">
            {/* Espaço para futuro campo de busca no header */}
          </div>
          <div>
            <span className="text-sm text-muted-foreground mr-4">{session.user?.email}</span>
            <LogoutButton />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}