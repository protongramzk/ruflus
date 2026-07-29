import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  // Cassava UI input: orthogonal 0px, 1px border. 2px focus border.
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && <label className="text-xs uppercase font-bold tracking-wider text-black">{label}</label>}
      <input
        className={`border border-black bg-white px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-2 focus:ring-0 ${className}`}
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

export const Select: React.FC<SelectProps> = ({ label, error, children, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && <label className="text-xs uppercase font-bold tracking-wider text-black">{label}</label>}
      <select
        className={`border border-black bg-white px-3 py-2 text-black focus:outline-none focus:border-2 focus:ring-0 ${className}`}
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

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && <label className="text-xs uppercase font-bold tracking-wider text-black">{label}</label>}
      <textarea
        className={`border border-black bg-white px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-2 focus:ring-0 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};
