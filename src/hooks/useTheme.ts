
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) return stored;
    
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
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }

    // Apply theme styling for better visibility
    document.body.className = `${theme} theme-transition`;
    
    // Force re-render of styled elements
    document.body.style.setProperty('--theme-applied', theme);
    
    // Ensure all text is visible with proper contrast
    if (theme === 'light') {
      document.body.style.color = 'hsl(220, 100%, 10%)';
      document.body.style.backgroundColor = 'hsl(0, 0%, 100%)';
    } else {
      document.body.style.color = 'hsl(210, 20%, 95%)';
      document.body.style.backgroundColor = 'hsl(210, 50%, 8%)';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}
