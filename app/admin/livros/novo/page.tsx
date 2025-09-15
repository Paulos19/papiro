import prisma from '@/lib/prisma';
import { BookForm } from '../BookForm';

// Esta página busca os dados necessários (categorias) no servidor
// e os passa para o formulário de cliente.
export default async function NewBookPage() {
  const categories = await prisma.category.findMany();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Adicionar Novo Livro</h1>
        <p className="text-muted-foreground">Preencha os campos abaixo para cadastrar um novo livro no acervo.</p>
      </div>
      <BookForm categories={categories} />
    </div>
  );
}