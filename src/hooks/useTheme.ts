
import { useState, useEffect } from 'react';

type Theme = 'dark';

export function useTheme() {
  const [theme] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    
    // Always use dark theme
    root.classList.remove('light', 'dark');
    root.classList.add('dark');
    
    // Store preference
    localStorage.setItem('theme', 'dark');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0f172a');
    }

    // Apply dark theme styling
    document.body.className = 'dark theme-transition';
    document.body.style.setProperty('--theme-bg', '#0f172a');
    document.body.style.setProperty('--theme-text', '#f8fafc');
    document.body.style.setProperty('--theme-primary', '#60a5fa');
  }, []);

  return { 
    theme: 'dark' as const, 
    toggleTheme: () => {}, // No-op since we only have dark mode
    setThemeMode: () => {}, // No-op
    isDark: true,
    isLight: false
  };
}
