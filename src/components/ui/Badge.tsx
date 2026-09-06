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
    primary: "bg-[#003D2D] text-[#00E878] border border-[rgba(180,255,210,0.2)]",
    secondary: "bg-[#002B1F] text-[#F2F7F3] border border-[rgba(180,255,210,0.12)]",
    success: "bg-[#003D2D] text-[#00E878] border border-[#00E878]/30",
    warning: "bg-amber-950/60 text-amber-300 border border-amber-500/30",
    outline: "bg-transparent text-[#00E878] border border-[#00E878]/50",
    verified: "bg-[#004D38] text-[#00E878] border border-[#00E878]/30 shadow-sm"
  };

  return (
    <span className={`${base} ${sizeStyles[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
