import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const ThemeSwitcher = React.memo(() => {
  const { theme, themeMode, toggleTheme, setThemeMode } = useTheme();

  const icon = themeMode === 'system' ? <Monitor className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(event) => {
              if (event.shiftKey) {
                toggleTheme();
              }
            }}
            className="h-9 w-9 p-0 theme-transition"
            aria-label="Theme options"
            title="Click for theme menu. Shift+click to quick toggle light/dark."
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${themeMode}-${theme}`}
                initial={{ rotate: -120, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 120, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => setThemeMode('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeMode('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeMode('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
