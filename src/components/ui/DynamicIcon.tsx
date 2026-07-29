import React from 'react';
import * as Lucide from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = (Lucide as any)[name];
  if (!IconComponent) {
    return <Lucide.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
};
