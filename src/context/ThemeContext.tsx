import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'yardly_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    }
    return 'light'; // Default to light theme for new visits
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark') return 'dark';
      if (stored === 'light') return 'light';
      if (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Synchronize document classes, data attributes, and mobile status bar
  const applyTheme = (resolved: ResolvedTheme) => {
    setResolvedTheme(resolved);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const isDark = resolved === 'dark';
      const statusColor = isDark ? '#000000' : '#FFFFFF';
      const statusBarStyle = isDark ? 'black' : 'default';

      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }

      // Dynamically update mobile browser status-bar color (#FFFFFF for Light, #000000 for Dark)
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', statusColor);

      // Dynamically update iOS status bar style ('default' for Light/dark-icons, 'black' for Dark/light-icons)
      let metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!metaAppleStatusBar) {
        metaAppleStatusBar = document.createElement('meta');
        metaAppleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(metaAppleStatusBar);
      }
      metaAppleStatusBar.setAttribute('content', statusBarStyle);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveCurrentTheme = () => {
      if (theme === 'system') {
        const systemPrefersDark = mediaQuery.matches;
        applyTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        applyTheme(theme);
      }
    };

    resolveCurrentTheme();

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn('Failed to persist theme preference:', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
