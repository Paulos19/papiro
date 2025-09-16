'use client';

import * as Icons from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DynamicIcon } from '@/components/DynamicIcon';

// Exclui propriedades que não são componentes de ícone
type IconName = keyof Omit<typeof Icons, 'createLucideIcon' | 'icons' | 'default'>;

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [iconList, setIconList] = useState<IconName[]>([]);

  // A lista de ícones agora é carregada no cliente para evitar problemas de renderização no servidor.
  useEffect(() => {
    const allIcons = Object.keys(Icons).filter(
      (key) => !['createLucideIcon', 'icons', 'default'].includes(key)
    ) as IconName[];
    setIconList(allIcons);
  }, []);

  // Filtra os ícones com base na busca, memorizando o resultado
  const filteredIcons = useMemo(() => {
    if (!search) return iconList;
    return iconList.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, iconList]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 font-normal">
          <DynamicIcon name={value} className="h-4 w-4" />
          {value || 'Selecionar um ícone'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecionar Ícone</DialogTitle>
        </DialogHeader>
        <div className="border-b pb-4">
          <Input
            placeholder="Buscar ícone pelo nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="h-[450px] overflow-y-auto p-1">
          <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
            {filteredIcons.map((iconName) => (
              <Button
                key={iconName}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => {
                  onChange(iconName);
                  setIsOpen(false);
                }}
              >
                <DynamicIcon name={iconName} className="h-6 w-6" />
                <span className="text-xs text-muted-foreground truncate w-full px-1">{iconName}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}