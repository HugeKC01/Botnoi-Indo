import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Apply theme to <html> tag
    const root = window.document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
      // Optionally, use prefers-color-scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark', theme === 'dark');
    }
    // Persist theme in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Load theme from localStorage on mount
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setTheme(stored);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
