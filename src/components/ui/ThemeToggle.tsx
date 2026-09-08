import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <Laptop className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />;
    }
    if (resolvedTheme === 'light') {
      return <Sun className="w-4 h-4 text-amber-500" />;
    }
    return <Moon className="w-4 h-4 text-[#2D7DFF]" />;
  };

  const getLabel = () => {
    if (theme === 'system') return 'System Theme';
    if (theme === 'light') return 'Light Theme';
    return 'Dark Theme';
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`Current: ${getLabel()} (Click to change)`}
      aria-label={`Toggle appearance theme (current: ${getLabel()})`}
      className={`min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#EBF2EE] dark:bg-[#121212] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.18)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:bg-white dark:hover:bg-[#1A1A1A] text-[#0F241C] dark:text-[#F2F7F3] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF] cursor-pointer shadow-sm ${className}`}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;
