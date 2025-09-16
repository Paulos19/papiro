import * as Icons from 'lucide-react';
import React from 'react';

// Define o tipo para os nomes dos ícones, excluindo exportações que não são componentes
type IconName = keyof Omit<typeof Icons, 'createLucideIcon' | 'icons' | 'default'>;

interface DynamicIconProps extends Icons.LucideProps {
  // CORREÇÃO: A prop 'name' agora aceita qualquer string, null ou undefined.
  // A validação será feita dentro do componente.
  name: string | null | undefined;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  if (!name) {
    return <Icons.Book {...props} />; // Ícone padrão se nenhum nome for fornecido
  }

  const IconComponent = Icons[name as IconName];

  // Validação para garantir que o que encontramos é um componente React renderizável
  if (!IconComponent || typeof IconComponent !== 'object') {
    return <Icons.HelpCircle {...props} />; // Ícone de fallback se o nome for inválido
  }

  return React.createElement(IconComponent, props);
};