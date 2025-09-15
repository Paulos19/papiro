// middleware.ts (VERSÃO ATUALIZADA)

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` enriquece seu `Request` com o token do usuário.
  function middleware(req) {
    // Verifica se o usuário é ADMIN e se está tentando acessar a rota de admin
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      // Se não for admin, redireciona para a página inicial
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      // O middleware só será invocado se `authorized` retornar `true`.
      // Isso garante que apenas usuários logados cheguem à função `middleware` acima.
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'], // Continua protegendo apenas as rotas /admin
}