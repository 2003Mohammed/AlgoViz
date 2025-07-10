
import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="w-9 h-9 p-0 theme-transition"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};
