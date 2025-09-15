import prisma from "@/lib/prisma"
import { BookForClient } from "@/lib/types"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getBooks(): Promise<BookForClient[]> {
    const books = await prisma.book.findMany({
        include: {
            category: true
        }
    })

    const serializedBooks: BookForClient[] = books.map(book => ({
        ...book,
        price: book.price.toNumber(),
    }));

    return serializedBooks
}


export default async function AdminBooksPage() {
    const data = await getBooks()

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Gerenciamento de Livros</h1>
                    <p className="text-muted-foreground">Adicione, edite e remova livros do seu acervo.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/livros/novo">Adicionar Livro</Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}