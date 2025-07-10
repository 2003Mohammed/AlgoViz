
import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as Theme) || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const setThemeMode = (mode: Theme) => {
    setTheme(mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Store preference
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }

    // Apply theme styling
    document.body.className = `${theme} theme-transition`;
    
    if (theme === 'dark') {
      document.body.style.setProperty('--theme-bg', '#0f172a');
      document.body.style.setProperty('--theme-text', '#f8fafc');
      document.body.style.setProperty('--theme-primary', '#60a5fa');
    } else {
      document.body.style.setProperty('--theme-bg', '#ffffff');
      document.body.style.setProperty('--theme-text', '#1e1e1e');
      document.body.style.setProperty('--theme-primary', '#6200ee');
    }
  }, [theme]);

  return { 
    theme, 
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}
