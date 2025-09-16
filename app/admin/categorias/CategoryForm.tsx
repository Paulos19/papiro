'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { State } from '../livros/actions';
import { createCategory, updateCategory } from './actions';

const iconList = ["BookOpen", "Swords", "Heart", "Drama", "School", "Atom", "Spade"];

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const initialState: State = { message: null, errors: {} };
  const actionToUse = category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, dispatch] = useFormState(actionToUse, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess(); // Fecha o modal
    } else if (state?.message) {
      toast.error("Erro", { description: state.message });
    }
  }, [state, onSuccess]);

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label htmlFor="name">Nome da Categoria</label>
        <Input id="name" name="name" defaultValue={category?.name} required />
        {state?.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>}
      </div>
      <div>
        <label htmlFor="iconName">Ícone (Nome do Lucide Icon)</label>
        <Input id="iconName" name="iconName" defaultValue={category?.iconName || ''} placeholder="Ex: BookOpen" />
        <p className="text-xs text-muted-foreground mt-1">
          Exemplos: {iconList.join(', ')}. Veja a lista completa em lucide.dev.
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit">{category ? 'Salvar Alterações' : 'Criar Categoria'}</Button>
      </DialogFooter>
    </form>
  );
}

