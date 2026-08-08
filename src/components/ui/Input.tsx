import React from 'react';
import { triggerFeedback } from '../../utils/feedback';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', style, onClick, ...props }) => {
  // Cassava UI input: dynamic radius, dynamic padding. 2px focus border.
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    triggerFeedback('click');
    if (onClick) onClick(e);
  };

  return (
    <div className="flex flex-col space-y-1 w-full" style={{ gap: 'calc(var(--density-gap) * 0.25)' }}>
      {label && <label className="text-xs uppercase font-bold tracking-wider text-black">{label}</label>}
      <input
        onClick={handleClick}
        className={`border border-black bg-white text-black placeholder-gray-400 focus:outline-none focus:border-2 focus:ring-0 ${className}`}
        style={{
          padding: 'var(--density-padding-input)',
          borderRadius: 'var(--border-radius)',
          ...style
        }}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, error, children, className = '', onChange, style, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    triggerFeedback('success'); // Play a nice success click on select change
    if (onChange) onChange(e);
  };

  return (
    <div className="flex flex-col space-y-1 w-full" style={{ gap: 'calc(var(--density-gap) * 0.25)' }}>
      {label && <label className="text-xs uppercase font-bold tracking-wider text-black">{label}</label>}
      <select
        onChange={handleChange}
        className={`border border-black bg-white text-black focus:outline-none focus:border-2 focus:ring-0 ${className}`}
        style={{
          padding: 'var(--density-padding-input)',
          borderRadius: 'var(--border-radius)',
          ...style
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', onClick, style, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    triggerFeedback('click');
    if (onClick) onClick(e);
  };

  return (
    <div className="flex flex-col space-y-1 w-full" style={{ gap: 'calc(var(--density-gap) * 0.25)' }}>
      {label && <label className="text-xs uppercase font-bold tracking-wider text-black">{label}</label>}
      <textarea
        onClick={handleClick}
        className={`border border-black bg-white text-black placeholder-gray-400 focus:outline-none focus:border-2 focus:ring-0 ${className}`}
        style={{
          padding: 'var(--density-padding-input)',
          borderRadius: 'var(--border-radius)',
          ...style
        }}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};
