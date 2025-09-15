import prisma from "@/lib/prisma"
import { columns } from "./columns"
import { DataTable } from "../livros/data-table" // Reutilizamos a DataTable de livros

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
                    <p className="text-muted-foreground">Visualize e gerencie os usuários cadastrados.</p>
                </div>
            </div>
            {/* O tipo User é compatível com a DataTable genérica que criamos */}
            <DataTable columns={columns} data={users} />
        </div>
    )
}