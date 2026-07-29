import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Cassava UI modal: completely orthogonal, black-border based panel.
  // Standard overlay.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white border-2 border-black w-full max-w-md z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black p-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-black">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white transition-colors duration-100 border border-transparent hover:border-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};
