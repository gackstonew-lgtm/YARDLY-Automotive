import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className={`relative w-full ${widthClasses[maxWidth]} bg-white dark:bg-[#121212] text-[#0F241C] dark:text-[#F2F7F3] rounded-2xl shadow-2xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] z-10 overflow-hidden my-auto transform transition-all duration-200`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] bg-[#F4F8F6] dark:bg-[#0A0A0A]">
          <div>
            {title && <h3 className="text-lg font-bold text-[#0F241C] dark:text-[#F2F7F3]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#355347] dark:text-[#8EA79C] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#355347] dark:text-[#8EA79C] hover:text-[#0251B8] dark:hover:text-[#2D7DFF] hover:bg-[#E4EFEA] dark:hover:bg-[#1A1A1A] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
