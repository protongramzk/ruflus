import React from 'react';
import { triggerFeedback } from '../../utils/feedback';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  onClick,
  style,
  ...props
}) => {
  // Cassava UI: Strict Orthogonal Geometries, Standard Border weights (1px/2px), Bipolar Inversion
  // spring-interactive class adds spring bezier curve and click micro-scaling.
  let baseClass = 'font-medium border uppercase tracking-wider text-sm outline-none spring-interactive cursor-pointer ';

  if (variant === 'primary') {
    // Monochrome high contrast: white bg, black text, black border. Hover/Active: black bg, white text.
    baseClass += 'bg-white text-black border-black hover:bg-primary hover:text-primary-text hover:border-primary focus:bg-primary focus:text-primary-text ';
  } else if (variant === 'secondary') {
    // Soft contrast monochrome: bg-white text-gray-700 border-gray-300 hover:bg-black hover:text-white hover:border-black
    baseClass += 'bg-white text-gray-800 border-gray-400 hover:bg-primary hover:text-primary-text hover:border-primary focus:bg-primary focus:text-primary-text ';
  } else if (variant === 'danger') {
    // Distinct Red highlight
    baseClass += 'bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white ';
  }

  if (fullWidth) {
    baseClass += 'w-full ';
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerFeedback(variant === 'danger' ? 'error' : 'click');
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${baseClass} ${className}`}
      onClick={handleClick}
      style={{
        padding: 'var(--density-padding-button)',
        borderRadius: 'var(--border-radius)',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};
