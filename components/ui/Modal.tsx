import React, { useEffect } from 'react';
import { Button } from './button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Modal component closes on background click or button click
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl p-6 max-w-lg w-full border border-sky-500"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button positioned within modal boundaries in top right */}
        <div className="absolute top-3 right-3">
          <Button
            variant="destructive"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <X className="h-4 w-4" color="#cb1e20" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal; 