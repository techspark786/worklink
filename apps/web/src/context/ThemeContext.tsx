"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'coffee' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'coffee',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('worklink_theme') as Theme | null;
    const initialTheme: Theme = saved === 'coffee' || saved === 'light' ? saved : 'light';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (t: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (t === 'light') {
      root.classList.remove('dark', 'theme-coffee');
      root.classList.add('light', 'theme-light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light', 'theme-light');
      root.classList.add('dark', 'theme-coffee');
      root.setAttribute('data-theme', 'coffee');
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem('worklink_theme', t);
    } catch (e) {}
    applyTheme(t);
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'coffee' ? 'light' : 'coffee';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
