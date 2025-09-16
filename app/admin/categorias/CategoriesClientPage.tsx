'use client'; 

import { useState } from 'react';
import { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { CategoryForm } from './CategoryForm';
import { deleteCategory } from './actions';
import { toast } from 'sonner';
import { DynamicIcon } from '@/components/DynamicIcon';

type CategoryWithCount = Category & {
  _count: { books: number };
};

interface CategoriesClientPageProps {
  initialCategories: CategoryWithCount[];
}

export function CategoriesClientPage({ initialCategories }: CategoriesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: string, name: string, bookCount: number) => {
    if (bookCount > 0) {
      toast.error("Ação Proibida", {
        description: `Não é possível excluir "${name}", pois ela contém livros.`
      });
      return;
    }

    toast.promise(deleteCategory(id), {
      loading: 'Excluindo categoria...',
      success: (res) => {
        if (res.success) return res.message;
        throw new Error(res.message);
      },
      error: (err) => `Erro: ${err.message}`,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Categorias</h1>
          <p className="text-muted-foreground">Adicione, edite e remova as categorias (estantes) da sua loja.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? `Editar: ${editingCategory.name}` : 'Nova Categoria'}</DialogTitle>
            </DialogHeader>
            <CategoryForm category={editingCategory} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Ícone</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Nº de Livros</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialCategories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <DynamicIcon name={cat.iconName} />
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat._count.books}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingCategory(cat);
                        setIsModalOpen(true);
                      }}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(cat.id, cat.name, cat._count.books)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

