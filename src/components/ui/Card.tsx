import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, title }) => {
  // Cassava UI Card: Orthogonal 0px radius, 1px black border, high contrast layout.
  const clickableClass = onClick ? 'cursor-pointer hover:bg-black hover:text-white transition-all duration-150 group' : '';

  return (
    <div
      onClick={onClick}
      className={`border border-black bg-white p-4 text-black flex flex-col space-y-2 ${clickableClass} ${className}`}
    >
      {title && (
        <div className="border-b border-black pb-2 mb-2 font-bold uppercase tracking-wider text-xs">
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
