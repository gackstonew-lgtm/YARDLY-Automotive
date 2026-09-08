import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-[#355347] dark:text-[#A7BDB3] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#5F7E71] dark:text-[#8EA79C] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-white dark:bg-[#0A0A0A] px-4 py-3 text-sm text-[#0F241C] dark:text-[#F2F7F3] placeholder-[#5F7E71]/60 dark:placeholder-[#8EA79C]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF] focus:border-transparent ${
            icon ? 'pl-10' : ''
          } ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-[rgba(0,60,40,0.15)] dark:border-[rgba(255, 255, 255,0.18)] hover:border-[#0251B8]/60 dark:hover:border-[#2D7DFF]/60'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#5F7E71] dark:text-[#8EA79C]">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
