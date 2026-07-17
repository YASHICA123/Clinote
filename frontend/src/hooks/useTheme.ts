import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('clinote-theme') as Theme) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem('clinote-theme', theme);
    } catch (e) {
      console.warn('Failed to save theme setting:', e);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
