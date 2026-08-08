import React from 'react';
import { triggerFeedback } from '../../utils/feedback';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, title, style }) => {
  // Cassava UI Card: Orthogonal radius (dynamic variable), 1px black border, high contrast layout.
  // Uses spring-interactive if clickable.
  const clickableClass = onClick
    ? 'cursor-pointer hover:bg-primary hover:text-primary-text hover:border-primary transition-all duration-150 group spring-interactive'
    : '';

  const handleClick = () => {
    if (onClick) {
      triggerFeedback('click');
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`border border-black bg-white text-black flex flex-col space-y-2 ${clickableClass} ${className}`}
      style={{
        padding: 'var(--density-padding-card)',
        borderRadius: 'var(--border-radius)',
        ...style
      }}
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
