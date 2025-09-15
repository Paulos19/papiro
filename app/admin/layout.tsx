import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/sonner"
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookUp, Upload, LogOut, Home, Users, BarChart3 } from "lucide-react";
import { LogoutButton } from "./components/LogoutButton"; // Vamos reutilizar e mover este componente

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
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">Papiro do Branco</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 text-sm font-medium lg:px-6">
            <Link
              href="/admin" // Link para o futuro dashboard de gráficos
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/livros" // Link para a gestão de livros
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <BookUp className="h-4 w-4" />
              Livros
            </Link>
            <Link
              href="/admin/usuarios" // Link para a gestão de usuários
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Usuários
            </Link>
            <Link
              href="/admin/import" // Renomeamos a rota de importação
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Upload className="h-4 w-4" />
              Importação
            </Link>
          </nav>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Pode adicionar um campo de busca aqui no futuro */}
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