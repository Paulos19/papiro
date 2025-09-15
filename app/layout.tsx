import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./components/Providers"; // Precisamos do Provider para a Navbar saber se o usuário está logado

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Papiro do Branco",
  description: "Sua livraria virtual.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      {/* Adicionamos a cor de fundo diretamente no body */}
      <body className={`${inter.className} bg-[#040E21]`}> 
        <NextAuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}