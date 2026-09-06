import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline' | 'verified';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const base = "inline-flex items-center font-semibold rounded-full tracking-tight transition-colors";
  
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs"
  };

  const variants = {
    primary: "bg-[#EBF2EE] dark:bg-[#003D2D] text-[#009E52] dark:text-[#00E878] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.2)]",
    secondary: "bg-white dark:bg-[#002B1F] text-[#0F241C] dark:text-[#F2F7F3] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(180,255,210,0.12)]",
    success: "bg-[#EBF2EE] dark:bg-[#003D2D] text-[#009E52] dark:text-[#00E878] border border-[#009E52]/30 dark:border-[#00E878]/30",
    warning: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30",
    outline: "bg-transparent text-[#009E52] dark:text-[#00E878] border border-[#009E52]/50 dark:border-[#00E878]/50",
    verified: "bg-[#EBF2EE] dark:bg-[#004D38] text-[#009E52] dark:text-[#00E878] border border-[#009E52]/30 dark:border-[#00E878]/30 shadow-sm"
  };

  return (
    <span className={`${base} ${sizeStyles[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
