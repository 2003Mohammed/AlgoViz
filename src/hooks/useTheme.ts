import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme-mode';

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system';
  });
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  const resolvedTheme = useMemo<ResolvedTheme>(
    () => (themeMode === 'system' ? systemTheme : themeMode),
    [themeMode, systemTheme]
  );

  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'system') {
        return resolvedTheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemTheme(getSystemTheme());
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.dataset.theme = resolvedTheme;

    localStorage.setItem(THEME_STORAGE_KEY, themeMode);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0c1222' : '#f6f8fc');
    }
  }, [themeMode, resolvedTheme]);

  return {
    theme: resolvedTheme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light'
  };
}
