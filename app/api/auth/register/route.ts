import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validação básica
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 })
    }
    if (password.length < 6) {
        return NextResponse.json({ message: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
    }

    // Verifica se o email já está em uso
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'Este email já está em uso.' }, { status: 409 }) // 409 Conflict
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await hash(password, 12)

    // Cria o novo usuário (a role será 'BUYER' por padrão, como definido no schema)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Retorna o usuário criado (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 }) // 201 Created

  } catch (error) {
    console.error("Erro no cadastro:", error)
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 })
  }
}