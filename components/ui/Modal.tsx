import React, { useEffect } from 'react';

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
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-2 text-white bg-transparent rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 