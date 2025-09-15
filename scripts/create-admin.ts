// scripts/create-admin.ts
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "papiro@gmail.com" // Defina o email do admin
  const adminPassword = "password" // Defina uma senha forte

  // Verifica se o admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log("Usuário administrador já existe.")
    return
  }

  // Faz o hash da senha
  const hashedPassword = await hash(adminPassword, 12)

  // Cria o usuário no banco
  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
    },
  })

  console.log("Usuário administrador criado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })