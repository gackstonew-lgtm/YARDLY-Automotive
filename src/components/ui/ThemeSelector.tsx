import React from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

export const ThemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const options: { id: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'light', label: 'Light / Day', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5F7E71] dark:text-[#8EA79C]">
          Appearance Theme
        </span>
        <span className="text-[10px] font-bold text-[#0251B8] dark:text-[#2D7DFF] bg-[#0251B8]/10 dark:bg-[#2D7DFF]/15 px-2 py-0.5 rounded-full capitalize">
          Active: {theme} ({resolvedTheme})
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#EBF2EE] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.12)] shadow-inner">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={isSelected}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0251B8] dark:focus:ring-[#2D7DFF] cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-[#1A1A1A] text-[#0251B8] dark:text-[#2D7DFF] shadow-md border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] font-black'
                  : 'text-[#5F7E71] dark:text-[#8EA79C] hover:text-[#0F241C] dark:hover:text-[#F2F7F3] hover:bg-white/60 dark:hover:bg-[#121212]/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#0251B8] dark:text-[#2D7DFF]' : 'text-current'}`} />
              <span className="truncate">{opt.label}</span>
              {isSelected && <Check className="w-3 h-3 ml-0.5 hidden sm:inline shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
