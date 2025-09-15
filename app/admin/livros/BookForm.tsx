'use client';

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Category } from '@prisma/client';
import { State, createBook, updateBook } from './actions';
import { useEffect, useRef } from 'react';
import { toast } from "sonner";
import { BookForClient } from '@/lib/types';
import Link from 'next/link';

interface BookFormProps {
  categories: Category[];
  book?: BookForClient | null;
}

export function BookForm({ categories, book }: BookFormProps) {
  const router = useRouter();
  const initialState: State = { message: null, errors: {} };

  // Vincula o ID do livro à ação de update, criando uma nova função
  const updateBookWithId = updateBook.bind(null, book?.id || '');
  
  // Decide qual ação usar: criar ou atualizar
  const actionToUse = book ? updateBookWithId : createBook;
  const [state, dispatch] = useFormState(actionToUse, initialState);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
      router.push('/admin/livros'); // Redireciona no lado do cliente
    } else if (state.message) {
      toast.error("Erro ao Salvar", {
        description: state.message,
      });
    }
  }, [state, router]);

  return (
    // O 'key' no formulário ajuda o React a resetar o estado dos campos ao alternar entre criar/editar
    <form key={book?.id || 'new'} action={dispatch} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna da Esquerda */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title">Título</label>
            <Input id="title" name="title" required defaultValue={book?.title} />
            {state?.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title[0]}</p>}
          </div>
          <div>
            <label htmlFor="author">Autor</label>
            <Input id="author" name="author" required defaultValue={book?.author} />
            {state?.errors?.author && <p className="text-sm text-red-500 mt-1">{state.errors.author[0]}</p>}
          </div>
          <div>
            <label htmlFor="publisher">Editora</label>
            <Input id="publisher" name="publisher" required defaultValue={book?.publisher} />
            {state?.errors?.publisher && <p className="text-sm text-red-500 mt-1">{state.errors.publisher[0]}</p>}
          </div>
          <div>
            <label htmlFor="categoryId">Categoria (Estante)</label>
            <Select name="categoryId" defaultValue={book?.categoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.categoryId && <p className="text-sm text-red-500 mt-1">{state.errors.categoryId[0]}</p>}
          </div>
        </div>

        {/* Coluna da Direita */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="publicationYear">Ano</label>
              <Input id="publicationYear" name="publicationYear" type="number" required defaultValue={book?.publicationYear} />
              {state?.errors?.publicationYear && <p className="text-sm text-red-500 mt-1">{state.errors.publicationYear[0]}</p>}
            </div>
            <div>
              <label htmlFor="price">Preço (R$)</label>
              <Input id="price" name="price" type="number" step="0.01" required defaultValue={book?.price} />
              {state?.errors?.price && <p className="text-sm text-red-500 mt-1">{state.errors.price[0]}</p>}
            </div>
            <div>
              <label htmlFor="stock">Estoque</label>
              <Input id="stock" name="stock" type="number" required defaultValue={book?.stock} />
              {state?.errors?.stock && <p className="text-sm text-red-500 mt-1">{state.errors.stock[0]}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="isbn">ISBN</label>
            <Input id="isbn" name="isbn" defaultValue={book?.isbn || ''} />
            {state?.errors?.isbn && <p className="text-sm text-red-500 mt-1">{state.errors.isbn[0]}</p>}
          </div>
          <div>
            <label htmlFor="coverImageUrl">URL da Capa</label>
            <Input id="coverImageUrl" name="coverImageUrl" type="url" defaultValue={book?.coverImageUrl || ''} />
             {state?.errors?.coverImageUrl && <p className="text-sm text-red-500 mt-1">{state.errors.coverImageUrl[0]}</p>}
          </div>
        </div>
      </div>

      {/* Seção Inferior */}
      <div>
        <label htmlFor="conditionDescription">Descrição do Estado de Conservação</label>
        <Textarea id="conditionDescription" name="conditionDescription" required rows={5} defaultValue={book?.conditionDescription} />
        {state?.errors?.conditionDescription && <p className="text-sm text-red-500 mt-1">{state.errors.conditionDescription[0]}</p>}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/livros">Cancelar</Link>
        </Button>
        <Button type="submit">{book ? 'Salvar Alterações' : 'Criar Livro'}</Button>
      </div>
    </form>
  );
}