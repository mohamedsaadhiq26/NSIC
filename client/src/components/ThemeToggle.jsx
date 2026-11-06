import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2 text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden text-[10px] font-black uppercase tracking-wider sm:inline">
        {isDark ? 'LIGHT' : 'DARK'}
      </span>
    </button>
  );
}
