"use client" // Marcamos como cliente para usar o hook de pathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookUp, Upload, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/livros", label: "Livros", icon: BookUp },
    { href: "/admin/usuarios", label: "Usuários", icon: Users },
    { href: "/admin/import", label: "Importação", icon: Upload },
  ];

  return (
    <nav className="flex-1 px-4 text-sm font-medium lg:px-6">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === href && "bg-muted text-primary" // Destaca o link ativo
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}