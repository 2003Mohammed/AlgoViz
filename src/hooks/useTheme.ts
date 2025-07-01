
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme') as Theme;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Store preference
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', 
        theme === 'dark' ? '#1e293b' : '#f8fafc'
      );
    }

    // Apply theme styling with improved colors
    document.body.className = `${theme} theme-transition`;
    
    // Enhanced theme variables
    if (theme === 'light') {
      document.body.style.setProperty('--theme-bg', '#f8fafc');
      document.body.style.setProperty('--theme-text', '#0f172a');
      document.body.style.setProperty('--theme-primary', '#3b82f6');
    } else {
      document.body.style.setProperty('--theme-bg', '#0f172a');
      document.body.style.setProperty('--theme-text', '#f8fafc');
      document.body.style.setProperty('--theme-primary', '#60a5fa');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { 
    theme, 
    toggleTheme, 
    setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}
