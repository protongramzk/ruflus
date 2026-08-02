import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Cassava UI: Strict Orthogonal Geometries, Standard Border weights (1px/2px), Bipolar Inversion
  // Idle: Canvas as background, ink as content/border.
  // Active/Hover: Ink as background, canvas as text/content.
  let baseClass = 'px-4 py-2 font-medium transition-all duration-150 border uppercase tracking-wider text-sm outline-none ';

  if (variant === 'primary') {
    // Monochrome high contrast: white bg, black text, black border. Hover/Active: black bg, white text.
    baseClass += 'bg-white text-black border-black hover:bg-primary hover:text-primary-text focus:bg-primary focus:text-primary-text ';
  } else if (variant === 'secondary') {
    // Soft contrast monochrome: bg-white text-gray-700 border-gray-300 hover:bg-black hover:text-white hover:border-black
    baseClass += 'bg-white text-gray-800 border-gray-400 hover:bg-primary hover:text-primary-text hover:border-primary focus:bg-primary focus:text-primary-text ';
  } else if (variant === 'danger') {
    // Since color is secondary, we can keep borders distinct or use strong solid styles
    baseClass += 'bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white ';
  }

  if (fullWidth) {
    baseClass += 'w-full ';
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
