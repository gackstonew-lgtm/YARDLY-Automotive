import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizes = {
    sm: "px-3.5 py-2 text-xs gap-1.5 min-h-[36px]",
    md: "px-5 py-2.5 text-sm gap-2 min-h-[44px]",
    lg: "px-7 py-3.5 text-base gap-2.5 min-h-[52px]"
  };

  const variants = {
    primary: "bg-[#009E52] dark:bg-[#00E878] text-white dark:text-[#001A13] font-bold hover:bg-[#008744] dark:hover:bg-[#55FF78] shadow-md hover:shadow-lg hover:-translate-y-[1px] shadow-[#009E52]/20 dark:shadow-[#00E878]/25 focus:ring-[#009E52] dark:focus:ring-[#00E878]",
    secondary: "bg-[#EBF2EE] dark:bg-[#003D2D] text-[#009E52] dark:text-[#00E878] font-bold hover:bg-[#D8E6DE] dark:hover:bg-[#004D39] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.2)] focus:ring-[#009E52] dark:focus:ring-[#00E878]",
    outline: "bg-white dark:bg-[#002B1F]/60 text-[#0F241C] dark:text-[#F2F7F3] border border-[rgba(0,60,40,0.15)] dark:border-[rgba(180,255,210,0.25)] hover:border-[#009E52] dark:hover:border-[#00E878] hover:text-[#009E52] dark:hover:text-[#00E878] hover:bg-[#F4F8F6] dark:hover:bg-[#003D2D]/60 shadow-sm",
    ghost: "bg-transparent text-[#5F7E71] dark:text-[#8EA79C] hover:text-[#0F241C] dark:hover:text-[#F2F7F3] hover:bg-[#EBF2EE]/60 dark:hover:bg-[#002B1F]/50",
    danger: "bg-red-600/90 text-white hover:bg-red-600 shadow-md shadow-red-900/30 focus:ring-red-500",
    success: "bg-[#009E52] dark:bg-[#00E878] text-white dark:text-[#001A13] font-bold hover:bg-[#008744] dark:hover:bg-[#55FF78] shadow-md shadow-[#009E52]/25 dark:shadow-[#00E878]/30 focus:ring-[#009E52] dark:focus:ring-[#00E878]"
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
