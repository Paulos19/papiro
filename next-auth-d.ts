// Importa o tipo Role do seu Prisma Client para garantir consistência
import { Role } from '@prisma/client';

// Importa os tipos originais do NextAuth
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

// Estende a interface JWT para incluir a nossa 'role'
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: Role;
  }
}

// Estende as interfaces Session e User para incluir a nossa 'role'
declare module 'next-auth' {
  interface User extends DefaultUser {
    role: Role;
  }

  interface Session extends DefaultSession {
    user: {
      role: Role;
    } & DefaultSession['user']; // Mantém as propriedades originais do usuário (name, email, image)
  }
}