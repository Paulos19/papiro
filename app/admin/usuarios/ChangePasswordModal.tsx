'use client';

import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { State } from '../livros/actions';
import { changeUserPassword } from './actions';
import { User } from '@prisma/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChangePasswordModalProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({ user, isOpen, onOpenChange }: ChangePasswordModalProps) {
  const initialState: State = { message: null, errors: {} };
  const changePasswordWithUserId = changeUserPassword.bind(null, user.id);
  const [state, dispatch] = useFormState(changePasswordWithUserId, initialState);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      onOpenChange(false); // Fecha o modal em caso de sucesso
    } else if (state.message) {
      toast.error("Erro", { description: state.message });
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            Alterando a senha para o usuário: <strong>{user.email}</strong>
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="password">Nova Senha</label>
              <Input id="password" name="password" type="password" required />
              {state?.errors?.password && <p className="text-sm text-red-500 mt-1">{state.errors.password[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar Nova Senha</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}